import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { getAllUsers } from '../../data/userStore'

const ManagerApprovals = () => {
  const { user } = useAuth()
  const sym = user?.currencySymbol || '₹'
  const code = user?.currencyCode || 'INR'
  const [sel, setSel] = useState(0)
  const [comment, setComment] = useState('')
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch('http://localhost:3000/expenses')
        if (res.ok) {
          const allExpenses = await res.json()
          const allUsers = getAllUsers()

          // Find employees who report to this manager
          const myEmployees = allUsers.filter(u =>
            u.role?.toLowerCase() === 'employee' &&
            u.manager === user?.email
          )

          // Filter expenses submitted by my employees
          const myTeamExpenses = allExpenses.filter(exp =>
            myEmployees.some(emp => emp.email === exp.submittedBy)
          )

          setExpenses(myTeamExpenses)
        }
      } catch (error) {
        console.error('Error fetching expenses:', error)
        toast.error('Failed to load expenses')
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [user?.email])

  const approve = async (expenseId) => {
    try {
      const res = await fetch(`http://localhost:3000/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      })

      if (res.ok) {
        toast.success(`Approved!${comment ? ` Comment: ${comment}` : ''}`)
        // Refresh expenses
        setExpenses(prev => prev.map(exp =>
          exp.id === expenseId ? { ...exp, status: 'approved' } : exp
        ))
      } else {
        toast.error('Failed to approve expense')
      }
    } catch (error) {
      console.error('Error approving expense:', error)
      toast.error('Failed to approve expense')
    }
  }

  const reject = async (expenseId) => {
    try {
      const res = await fetch(`http://localhost:3000/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      })

      if (res.ok) {
        toast.error(`Rejected.${comment ? ` Comment: ${comment}` : ''}`)
        // Refresh expenses
        setExpenses(prev => prev.map(exp =>
          exp.id === expenseId ? { ...exp, status: 'rejected' } : exp
        ))
      } else {
        toast.error('Failed to reject expense')
      }
    } catch (error) {
      console.error('Error rejecting expense:', error)
      toast.error('Failed to reject expense')
    }
  }

  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>Approvals to review</div>
          <div className='ps'>
            {expenses.length} expenses waiting · amounts shown in company currency {code} {sym}
          </div>
        </div>
      </div>
      <div
        style={{
          background: 'rgba(232,169,60,.07)',
          border: '1px solid rgba(232,169,60,.18)',
          borderRadius: 8,
          padding: '10px 13px',
          fontSize: 12.5,
          color: 'var(--amber)',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 7
        }}
      >
        ⚡ Once approved/rejected, the expense automatically moves to the next approver in the chain (or employee is notified if rejected).
      </div>
      <div className='rb-two-col' style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 16, alignItems: 'start' }}>
        <div className='tw'>
          <div className='th2'>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Pending queue</div>
            <div style={{ display: 'flex', gap: 5 }}>
              <div
                style={{
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontFamily: 'var(--font-m)',
                  background: 'var(--adim2)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(212,245,96,.2)',
                  cursor: 'pointer'
                }}
              >
                All
              </div>
              <div
                style={{
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontFamily: 'var(--font-m)',
                  background: 'transparent',
                  color: 'var(--text2)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                High value
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Approval subject</th>
                <th>Request owner</th>
                <th>Category</th>
                <th>Request status</th>
                <th>
                  Total amount ({code})
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No expenses pending approval
                  </td>
                </tr>
              ) : (
                expenses.map((expense, index) => {
                  const allUsers = getAllUsers()
                  const submitter = allUsers.find(u => u.email === expense.submittedBy)
                  const initials = submitter ? submitter.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
                  const ownerName = submitter ? submitter.name : expense.submittedBy

                  return (
                    <tr
                      key={expense.id}
                      id={`mr${index}`}
                      style={{ background: sel === index ? 'var(--adim)' : undefined }}
                      onClick={() => setSel(index)}
                    >
                      <td>
                        <div style={{ fontWeight: 500 }}>{expense.description}</div>
                        <div className='ts2'>{new Date(expense.date).toLocaleDateString()}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div
                            className='av'
                            style={{
                              width: 22,
                              height: 22,
                              fontSize: 9,
                              background: 'linear-gradient(135deg,#2ECC8A,#5B9CF6)'
                            }}
                          >
                            {initials}
                          </div>
                          {ownerName}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12 }}>
                          {expense.category === 'Meals' ? '🍽 Meals' :
                           expense.category === 'Travel' ? '✈ Travel' :
                           expense.category === 'Supplies' ? '📦 Supplies' :
                           '📄 Other'}
                        </span>
                      </td>
                      <td>
                        <span className={'badge ' + (expense.status === 'pending' ? 'b-wa' : 'b-rv')}>
                          {expense.status === 'pending' ? 'Pending' : expense.status}
                        </span>
                      </td>
                      <td>
                        <div className='amt'>{sym}{parseFloat(expense.amount).toLocaleString()}</div>
                        {expense.originalCurrency !== 'INR' && (
                          <div className='amts'>{expense.originalAmount} {expense.originalCurrency} orig.</div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            type='button'
                            className='btn bs'
                            style={{ padding: '4px 8px', fontSize: 11 }}
                            onClick={e => {
                              e.stopPropagation()
                              approve(expense.id)
                            }}
                          >
                            ✓
                          </button>
                          <button
                            type='button'
                            className='btn bd'
                            style={{ padding: '4px 8px', fontSize: 11 }}
                            onClick={e => {
                              e.stopPropagation()
                              reject(expense.id)
                            }}
                          >
                            ✗
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className='panel'>
          <div className='ph2'>
            <div className='pt2'>Expense detail</div>
            <span className='badge b-rv'>In Review</span>
          </div>
          <div className='pb'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 13 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-d)', fontSize: 22 }}>
                  {sym}6,840
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-m)' }}>$82.00 USD · rate 83.41</div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  background: 'var(--surface2)',
                  padding: '3px 9px',
                  borderRadius: 6,
                  border: '1px solid var(--border)'
                }}
              >
                🍽 Meals
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 13 }}>
              <div>
                <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>SUBMITTED BY</div>
                <div>Priya Menon</div>
              </div>
              <div>
                <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>DATE</div>
                <div style={{ fontFamily: 'var(--font-m)' }}>28 Jun 2025</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>DESCRIPTION</div>
                <div>Business lunch — Q2 review meeting</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>NOTES</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>3 attendees — Priya, Arjun, client.</div>
              </div>
            </div>
            <div className='div' />
            <div className='sl'>Approval trail</div>
            <div className='tl'>
              <div className='tli'>
                <div className='tldot done'>✓</div>
                <div className='tlline' />
                <div className='tlc'>
                  <div className='tlt'>Step 1 — Manager</div>
                  <div className='tls'>Vikram Singh · 28 Jun 4:12 PM</div>
                  <div className='tlcmt'>&quot;Valid business purpose.&quot;</div>
                </div>
              </div>
              <div className='tli'>
                <div className='tldot act'>2</div>
                <div className='tlline' />
                <div className='tlc'>
                  <div className='tlt'>Step 2 — Finance (you)</div>
                  <div className='tls'>Awaiting your decision</div>
                </div>
              </div>
              <div className='tli'>
                <div className='tldot idle'>3</div>
                <div className='tlc'>
                  <div className='tlt'>Step 3 — Director</div>
                  <div className='tls' style={{ color: 'var(--text3)' }}>
                    Pending step 2
                  </div>
                </div>
              </div>
            </div>
            <div className='div' />
            <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 6 }}>COMMENT (OPTIONAL)</div>
            <textarea
              className='fi'
              rows={2}
              id='mcmt'
              placeholder='Add a comment…'
              style={{ resize: 'none' }}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 7, marginTop: 9 }}>
              <button type='button' className='btn bd' style={{ flex: 1, justifyContent: 'center' }} onClick={() => reject(0)}>
                ✗ Reject
              </button>
              <button type='button' className='btn bs' style={{ flex: 1, justifyContent: 'center' }} onClick={() => approve(0)}>
                ✓ Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerApprovals
