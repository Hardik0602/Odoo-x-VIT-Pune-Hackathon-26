import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MyClaims = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const sym = user?.currencySymbol || '₹'

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const res = await fetch('http://localhost:3000/expenses')
        const data = await res.json()
        const userExpenses = data.filter(e => e.submittedBy === user?.email)
        setExpenses(userExpenses)
      } catch (error) {
        console.log('Error loading expenses:', error)
      } finally {
        setLoading(false)
      }
    }
    loadExpenses()
  }, [user])

  const getStatusBadgeClass = (status) => {
    if (status === 'approved') return 'b-ap'
    if (status === 'rejected') return 'b-rj'
    return 'b-rv'
  }

  const getProgressPercentage = (status) => {
    if (status === 'approved') return 100
    if (status === 'rejected') return 33
    if (status === 'in_progress') return 50
    return 30
  }

  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>My claims</div>
          <div className='ps'>All submitted expenses and approval status</div>
        </div>
        <button type='button' className='btn bp' onClick={() => navigate('/employee/submit')}>
          + New claim
        </button>
      </div>
      <div className='tw'>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount ({user?.currencyCode || 'INR'})</th>
              <th>Approval progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='6' style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>
                  Loading expenses...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan='6' style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>
                  No expenses submitted yet
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <div>{expense.description}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12 }}>{expense.category || 'Other'}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>
                      {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td>
                    <div className='amt'>
                      {sym}{expense.amount}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${getProgressPercentage(expense.status)}%`,
                            height: '100%',
                            background: expense.status === 'approved' ? 'var(--green)' : expense.status === 'rejected' ? 'var(--red)' : 'var(--amber)',
                            borderRadius: 4
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-m)', color: 'var(--text2)' }}>
                        {expense.status === 'rejected' ? '—' : '1/1'}
                      </span>
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

export default MyClaims

