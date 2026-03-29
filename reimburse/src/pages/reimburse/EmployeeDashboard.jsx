import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllUsers } from '../../data/userStore'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const isAdminAll = pathname.includes('/admin/expenses')
  const isManagerMy = pathname.includes('/manager/expenses')
  const sym = user?.currencySymbol || '₹'
  const code = user?.currencyCode || 'INR'

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const res = await fetch('http://localhost:3000/expenses')
        const data = await res.json()
        let filtered = data

        const allUsers = getAllUsers()
        const userRole = user?.role?.toLowerCase()
        const userName = user?.name?.toLowerCase()

        if (isAdminAll) {
          // Admin sees everything
          filtered = data
        } else if (isManagerMy || userRole === 'manager' || userRole === 'cfo' || userRole === 'director' || userName === 'cfo' || userName === 'director') {
          // Manager, CFO, Director see their team plus CFO/Director special
          if (userRole === 'cfo' || userRole === 'director' || userName === 'cfo' || userName === 'director') {
            const allEmployees = allUsers.filter(u => u.role?.toLowerCase() === 'employee')
            filtered = data.filter(exp => allEmployees.some(emp => emp.email === exp.submittedBy))
          } else {
            const myEmployees = allUsers.filter(u => u.role?.toLowerCase() === 'employee' && u.manager === user?.email)
            filtered = data.filter(exp => myEmployees.some(emp => emp.email === exp.submittedBy))
          }
        } else {
          // Regular employee sees only own
          filtered = data.filter(e => e.submittedBy === user?.email)
        }

        setExpenses(filtered)
      } catch (error) {
        console.log('Error loading expenses:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (user?.email) {
      loadExpenses()
    }
  }, [user, isAdminAll])

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const first = user?.name?.split(/\s+/)[0] || 'there'

  let title
  let subtitle
  if (isAdminAll) {
    title = 'All expenses'
    subtitle = `Organization-wide · amounts in ${code} ${sym}`
  } else if (isManagerMy) {
    title = 'My expenses'
    subtitle = `Your claims and history · ${code} ${sym}`
  } else {
    title = `${greet}, ${first}.`
    subtitle = `Your expense overview · all amounts in ${code} ${sym}`
  }

  const getStatusBadgeClass = (status) => {
    if (status === 'approved') return 'b-ap'
    if (status === 'rejected') return 'b-rj'
    return 'b-rv'
  }

  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>{title}</div>
          <div className='ps'>{subtitle}</div>
        </div>
        {!isAdminAll && (
          <button type='button' className='btn bp' onClick={() => navigate('/employee/submit')}>
            + New Expense
          </button>
        )}
      </div>
      <div className='stat-row'>
        {/* Stats will be populated from database */}
      </div>
      <div className='sl'>Recent expenses</div>
      <div className='tw'>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Description</th>
              <th>Date</th>
              <th>Category</th>
              <th>Paid by</th>
              <th>
                Amount ({code})
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='7' style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>
                  Loading expenses...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan='7' style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>
                  No expenses found
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <div style={{ fontSize: 12 }}>Employee</div>
                  </td>
                  <td>
                    <div>{expense.description}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>
                      {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12 }}>{expense.category || 'Other'}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>Self</span>
                  </td>
                  <td>
                    <div className='amt'>
                      {sym}{expense.amount}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(expense.status)}`}>
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeDashboard
