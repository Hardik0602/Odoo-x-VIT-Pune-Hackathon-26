import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { getAllUsers } from '../data/userStore'

const ManagerApprovals = () => {
  const { user } = useAuth()
  const sym = user?.currencySymbol || '₹'
  const code = user?.currencyCode || 'INR'
  const [selectedId, setSelectedId] = useState(null)
  const [comment, setComment] = useState('')
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const selectedExpense = expenses.find(exp => exp.id === selectedId) || expenses[0]

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch('http://localhost:3000/expenses')
        if (res.ok) {
          const allExpenses = await res.json()
          const allUsers = getAllUsers()
          const userRole = user?.role?.toLowerCase()

          let filteredExpenses = allExpenses

          // For CFO and Director, show all "pending" expenses from all employees
          if (userRole === 'cfo' || userRole === 'director') {
            const allEmployees = allUsers.filter(u => u.role?.toLowerCase() === 'employee')
            filteredExpenses = allExpenses.filter(exp =>
              exp.status === 'pending' &&
              allEmployees.some(emp => emp.email === exp.submittedBy)
            )
          } else {
            // For regular managers, show only "pending" expenses from their direct reports
            const myEmployees = allUsers.filter(u =>
              u.role?.toLowerCase() === 'employee' &&
              (
                u.manager === user?.email ||
                u.manager === user?.name ||
                (typeof u.manager === 'string' && u.manager.toLowerCase() === (user?.email || '').toLowerCase())
              )
            )
            filteredExpenses = allExpenses.filter(exp =>
              exp.status === 'pending' &&
              myEmployees.some(emp => emp.email === exp.submittedBy)
            )
          }

          const sortedExpenses = filteredExpenses
            .filter(exp => exp.status === 'pending')
            .sort((a, b) => {
              const dateA = new Date(a.submittedDate + 'T00:00:00')
              const dateB = new Date(b.submittedDate + 'T00:00:00')
              if (dateB - dateA !== 0) return dateB - dateA
              return parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1])
            })
          setExpenses(sortedExpenses)
        }
      } catch (error) {
        console.error('Error fetching expenses:', error)
        toast.error('Failed to load expenses')
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [user?.email, user?.role])

  useEffect(() => {
    if (expenses.length > 0) {
      setSelectedId(expenses[0].id)
    }
  }, [expenses])

  const approve = async (expenseId) => {
    const expense = expenses.find(exp => exp.id === expenseId)
    if (!expense) return
    if (expense.status !== 'pending') {
      toast.info('Expense is already processed')
      return
    }

    const existingApprovals = expense.approvals ?? []
    if (existingApprovals.some(a => a.by === user?.email)) {
      toast.info('You already reviewed this expense')
      return
    }

    const userRole = user?.role?.toLowerCase()
    const currentStep = expense.approvalStep || 1
    let newStep = currentStep
    let newStatus = 'pending'

    if (userRole === 'manager' && currentStep === 1) {
      newStep = 2
    } else if (userRole === 'cfo' && currentStep === 2) {
      newStep = 3
      newStatus = 'approved'
    } else {
      toast.error('You are not authorized to approve at this step')
      return
    }

    const newApproval = {
      by: user?.email,
      role: user?.role,
      decision: 'approved',
      date: new Date().toISOString(),
      comment: comment || ''
    }

    const updatedApprovals = [...existingApprovals, newApproval]

<<<<<<< HEAD:reimburse/src/pages/reimburse/ManagerApprovals.jsx
=======
    const isCfoOverride = user?.role?.toLowerCase() === 'cfo'
    const approvedCount = updatedApprovals.filter(a => a.decision === 'approved').length
    const threshold = 3
    const metPercentageRule = (approvedCount / threshold) >= 0.6

    let newStatus = 'pending'
    if (existingApprovals.length === 0 || isCfoOverride || metPercentageRule) {
      newStatus = 'approved'
    }

>>>>>>> d652b99218e01d8aca30fab755672cb0e71710e9:reimburse/src/pages/ManagerApprovals.jsx
    try {
      const res = await fetch(`http://localhost:3000/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, approvals: updatedApprovals, approvalStep: newStep })
      })

      if (res.ok) {
        toast.success(`Approved!${comment ? ` Comment: ${comment}` : ''}`)
<<<<<<< HEAD:reimburse/src/pages/reimburse/ManagerApprovals.jsx
        setExpenses(prev => prev.map(exp =>
          exp.id === expenseId ? { ...exp, status: newStatus, approvals: updatedApprovals, approvalStep: newStep } : exp
        ))
=======
        setExpenses(prev => {
          const newList = prev.filter(exp => exp.id !== expenseId)
          if (newList.length > 0) {
            setSelectedId(newList[0].id)
          } else {
            setSelectedId(null)
          }
          return newList
        })
        setComment('')
>>>>>>> d652b99218e01d8aca30fab755672cb0e71710e9:reimburse/src/pages/ManagerApprovals.jsx
      } else {
        toast.error('Failed to approve expense')
      }
    } catch (error) {
      console.error('Error approving expense:', error)
      toast.error('Failed to approve expense')
    }
  }

  const reject = async (expenseId) => {
    const expense = expenses.find(exp => exp.id === expenseId)
    if (!expense) return
    if (expense.status !== 'pending') {
      toast.info('Expense is already processed')
      return
    }

    const existingApprovals = expense.approvals ?? []
    if (existingApprovals.some(a => a.by === user?.email)) {
      toast.info('You already reviewed this expense')
      return
    }

    const newApproval = {
      by: user?.email,
      role: user?.role,
      decision: 'rejected',
      date: new Date().toISOString(),
      comment: comment || ''
    }

    const updatedApprovals = [...existingApprovals, newApproval]
    const newStatus = 'rejected'

    try {
      const res = await fetch(`http://localhost:3000/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, approvals: updatedApprovals })
      })

      if (res.ok) {
        toast.error(`Rejected.${comment ? ` Comment: ${comment}` : ''}`)
        setExpenses(prev => {
          const newList = prev.filter(exp => exp.id !== expenseId)
          if (newList.length > 0) {
            setSelectedId(newList[0].id)
          } else {
            setSelectedId(null)
          }
          return newList
        })
        setComment('')
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
            {expenses.filter(e => e.status === 'pending').length} expenses waiting · amounts shown in company currency {code} {sym}
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
                  const ownerName = expense.submittedByName || submitter?.name || expense.submittedBy
                  const initials = ownerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
                  const isSpecialRole = submitter && (submitter.role === 'CFO' || submitter.role === 'Director')

                  return (
                    <tr
                      key={expense.id}
                      id={`mr${index}`}
                      style={{ background: selectedId === expense.id ? 'var(--adim)' : undefined }}
                      onClick={() => setSelectedId(expense.id)}
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {ownerName}
                            {isSpecialRole && <span style={{ fontSize: 12 }}>⭐</span>}
                          </div>
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
                          {expense.status === 'approved' ? 'Approved' : expense.approvalStep === 2 ? 'In Review (2/3)' : 'Pending (1/3)'}
                        </span>
                      </td>
                      <td>
                        <div className='amt'>{sym}{parseFloat(expense.amount).toLocaleString()}</div>
                        {expense.originalCurrency !== 'INR' && (
                          <div className='amts'>{expense.originalAmount} {expense.originalCurrency} orig.</div>
                        )}
                      </td>
                      <td>
                        {expense.status === 'pending' && !expense.approvals?.some(a => a.by === user?.email) ? (
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
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                            {expense.approvals?.some(a => a.by === user?.email) ? 'Reviewed' : expense.status}
                          </span>
                        )}
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
<<<<<<< HEAD:reimburse/src/pages/reimburse/ManagerApprovals.jsx
            <span className={`badge ${expenses[sel]?.status === 'pending' ? 'b-wa' : expenses[sel]?.status === 'approved' ? 'b-ap' : 'b-rj'}`}>
              {expenses[sel]?.status === 'approved' ? 'Approved' : expenses[sel]?.status === 'rejected' ? 'Rejected' : `In Review (${expenses[sel]?.approvalStep || 1}/3)`}
=======
            <span className={`badge ${selectedExpense?.status === 'pending' ? 'b-wa' : selectedExpense?.status === 'approved' ? 'b-ap' : 'b-rj'}`}>
              {selectedExpense?.status === 'approved' ? 'Approved' : selectedExpense?.status === 'rejected' ? 'Rejected' : 'In Review'}
>>>>>>> d652b99218e01d8aca30fab755672cb0e71710e9:reimburse/src/pages/ManagerApprovals.jsx
            </span>
          </div>
          {selectedExpense ? (
            <div className='pb'>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 13 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-d)', fontSize: 22 }}>
                    {sym}{parseFloat(selectedExpense.amount).toLocaleString()}
                  </div>
                  {selectedExpense.originalCurrency !== 'INR' && (
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-m)' }}>
                      {selectedExpense.originalAmount} {selectedExpense.originalCurrency} orig.
                    </div>
                  )}
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
                  {selectedExpense.category === 'Meals' ? '🍽 Meals' :
                   selectedExpense.category === 'Travel' ? '✈ Travel' :
                   selectedExpense.category === 'Supplies' ? '📦 Supplies' :
                   selectedExpense.category === 'Accommodation' ? '🏨 Accommodation' :
                   selectedExpense.category === 'Software' ? '☁ Software' :
                   selectedExpense.category === 'Hardware' ? '🖥 Hardware' :
                   selectedExpense.category === 'Events' ? '🎉 Events' : '📄 Other'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 13 }}>
                <div>
                  <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>SUBMITTED BY</div>
                  <div>{(() => {
                    const allUsers = getAllUsers()
                    const submitter = allUsers.find(u => u.email === selectedExpense.submittedBy)
                    return submitter ? submitter.name : selectedExpense.submittedBy
                  })()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>DATE</div>
                  <div style={{ fontFamily: 'var(--font-m)' }}>{new Date(selectedExpense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>DESCRIPTION</div>
                  <div>{selectedExpense.description}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>NOTES</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{selectedExpense.notes || 'No notes'}</div>
                </div>
              </div>
              <div className='div' />
              <div className='sl'>Approval trail</div>
              <div className='tl'>
                {selectedExpense.approvals && selectedExpense.approvals.length > 0 ? (
                  selectedExpense.approvals.map((approval, idx) => (
                    <div className='tli' key={idx}>
                      <div className={`tldot ${approval.decision === 'approved' ? 'done' : 'rjt'}`}>
                        {approval.decision === 'approved' ? '✓' : '✗'}
                      </div>
                      <div className='tlline' />
                      <div className='tlc'>
                        <div className='tlt'>{approval.role?.charAt(0).toUpperCase() + approval.role?.slice(1)}</div>
                        <div className='tls'>{approval.by} · {new Date(approval.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        {approval.comment && <div className='tlcmt'>"{approval.comment}"</div>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='tli'>
                    <div className='tldot act'>1</div>
                    <div className='tlc'>
                      <div className='tlt'>Awaiting first approval</div>
                      <div className='tls'>No approvals yet</div>
                    </div>
                  </div>
                )}
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
                <button type='button' className='btn bd' style={{ flex: 1, justifyContent: 'center' }} onClick={() => reject(selectedExpense.id)}>
                  ✗ Reject
                </button>
                <button type='button' className='btn bs' style={{ flex: 1, justifyContent: 'center' }} onClick={() => approve(selectedExpense.id)}>
                  ✓ Approve
                </button>
              </div>
            </div>
          ) : (
            <div className='pb' style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
              <div style={{ fontSize: 14 }}>No expense selected</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>Select an expense from the list</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManagerApprovals
