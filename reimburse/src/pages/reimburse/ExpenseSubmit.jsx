import React, { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const RATES = {
  'INR|₹|1': 1,
  'USD|$|83.41': 83.41,
  'EUR|€|90.2': 90.2,
  'GBP|£|105.5': 105.5,
  'SGD|S$|61.8': 61.8
}

const ExpenseSubmit = () => {
  const { user } = useAuth()
  const sym = user?.currencySymbol || '₹'
  const code = user?.currencyCode || 'INR'

  const [ocrDone, setOcrDone] = useState(false)
  const [trailOpen, setTrailOpen] = useState(false)
  const [desc, setDesc] = useState('Business lunch — Q2 review')
  const [currKey, setCurrKey] = useState('INR|₹|1')
  const [amount, setAmount] = useState('82')
  const [stepState, setStepState] = useState('draft')

  const convLine = useMemo(() => {
    const parts = currKey.split('|')
    const rate = RATES[currKey] ?? 1
    const a = parseFloat(amount) || 0
    const converted = (a * rate).toLocaleString('en-IN', { maximumFractionDigits: 2 })
    if (parts[0] === 'INR') {
      return `= ${sym}${converted} ${code} (same currency)`
    }
    return `= ${sym}${converted} ${code} at rate ${parts[2]}`
  }, [amount, currKey, sym, code])

  const runOcr = () => {
    setOcrDone(true)
    setDesc('Business lunch — Bistro Café')
    setAmount('1038')
    setCurrKey('INR|₹|1')
  }

  const submit = () => {
    setTrailOpen(true)
    setStepState('waiting')
    toast.success('Submitted! Your manager has been notified for approval.')
  }

  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>Submit expense claim</div>
          <div className='ps'>Upload a receipt — OCR auto-fills fields. Employee can submit in any currency.</div>
        </div>
      </div>

      <div className='sbar'>
        <div className={stepState === 'draft' ? 'sd active' : 'sd done'}>{stepState === 'draft' ? '1' : '✓'}</div>
        <span className={'sl2 ' + (stepState === 'draft' ? 'active' : 'done')}>Draft</span>
        <div className={'sline ' + (stepState !== 'draft' ? 'done' : '')} />
        <div className={stepState === 'waiting' ? 'sd active' : stepState === 'approved' ? 'sd done' : 'sd idle'}>
          {stepState === 'approved' ? '✓' : '2'}
        </div>
        <span className={'sl2 ' + (stepState === 'waiting' ? 'active' : stepState === 'approved' ? 'done' : '')}>
          Waiting approval
        </span>
        <div className='sline' />
        <div className={stepState === 'approved' ? 'sd done' : 'sd idle'}>3</div>
        <span className={'sl2 ' + (stepState === 'approved' ? 'done' : '')}>Approved</span>
      </div>

      <div className='rb-two-col' style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'start' }}>
        <div>
          <div className='panel' style={{ marginBottom: 15 }}>
            <div className='ph2'>
              <div className='pt2'>
                <span
                  style={{
                    background: 'var(--adim2)',
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-m)',
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 20,
                    marginRight: 5
                  }}
                >
                  AI
                </span>
                Attach receipt — OCR auto-fill
              </div>
              <span className='tag'>Claude Vision</span>
            </div>
            <div className='pb'>
              <div
                role='button'
                tabIndex={0}
                onClick={runOcr}
                onKeyDown={e => e.key === 'Enter' && runOcr()}
                style={{
                  border: '1.5px dashed var(--border2)',
                  borderRadius: 'var(--r)',
                  padding: 20,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  background: 'var(--surface2)',
                  textAlign: 'center',
                  borderColor: ocrDone ? 'var(--accent)' : undefined
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>📎 Upload or drag receipt here</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>PNG, JPG or PDF · fields extracted automatically</div>
              </div>
              {ocrDone && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-m)', marginBottom: 8 }}>
                    ✓ Receipt scanned — fields auto-filled
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                    {[
                      ['MERCHANT', 'Bistro Café'],
                      ['AMOUNT', `${sym}1,038`],
                      ['DATE', '28 Jun 2025'],
                      ['CATEGORY', 'Meals']
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        style={{
                          background: 'var(--adim)',
                          border: '1px solid rgba(212,245,96,.15)',
                          borderRadius: 7,
                          padding: '8px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7
                        }}
                      >
                        <span style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', width: 60 }}>{k}</span>
                        <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>{v}</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='panel'>
            <div className='ph2'>
              <div className='pt2'>Expense details</div>
            </div>
            <div className='pb'>
              <div className='fg2'>
                <div className='fg full'>
                  <label className='fl' htmlFor='fdesc'>
                    Description
                  </label>
                  <input
                    id='fdesc'
                    className='fi'
                    type='text'
                    placeholder='e.g. Client lunch — Q2 review'
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                  />
                </div>
                <div className='fg'>
                  <label className='fl' htmlFor='fcat'>
                    Category
                  </label>
                  <select id='fcat' className='fi' defaultValue='🍽 Meals & Entertainment'>
                    <option>🍽 Meals & Entertainment</option>
                    <option>✈ Travel & Transport</option>
                    <option>🏨 Accommodation</option>
                    <option>☁ Software / Subscriptions</option>
                    <option>🖥 Hardware</option>
                    <option>🎉 Events</option>
                    <option>📦 Other</option>
                  </select>
                </div>
                <div className='fg'>
                  <label className='fl' htmlFor='fpaid'>
                    Paid by
                  </label>
                  <select id='fpaid' className='fi' defaultValue='Self (reimbursement)'>
                    <option>Self (reimbursement)</option>
                    <option>Company card</option>
                  </select>
                </div>
                <div className='fg'>
                  <label className='fl' htmlFor='famt'>
                    Amount — employee can use any currency
                  </label>
                  <div className='fig'>
                    <select id='fcurr' className='fic' value={currKey} onChange={e => setCurrKey(e.target.value)}>
                      <option value='INR|₹|1'>INR ₹</option>
                      <option value='USD|$|83.41'>USD $</option>
                      <option value='EUR|€|90.2'>EUR €</option>
                      <option value='GBP|£|105.5'>GBP £</option>
                      <option value='SGD|S$|61.8'>SGD S$</option>
                    </select>
                    <input
                      id='famt'
                      className='fi'
                      type='number'
                      value={amount}
                      placeholder='0.00'
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginTop: 4 }}>{convLine}</div>
                </div>
                <div className='fg'>
                  <label className='fl' htmlFor='fdate'>
                    Date of expense
                  </label>
                  <input id='fdate' className='fi' type='date' defaultValue='2025-06-28' />
                </div>
                <div className='fg full'>
                  <label className='fl' htmlFor='fnotes'>
                    Notes (optional)
                  </label>
                  <textarea
                    id='fnotes'
                    className='fi'
                    rows={2}
                    style={{ resize: 'none' }}
                    placeholder='Context for approvers…'
                    defaultValue='Client Q2 review lunch. 3 attendees — Priya, Arjun, client.'
                  />
                </div>
              </div>
              <div className='div' />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                  Converted to{' '}
                  <span style={{ color: 'var(--text)' }}>
                    {sym} {code}
                  </span>{' '}
                  (company currency) on submit
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button type='button' className='btn bg'>
                    Save draft
                  </button>
                  <button type='button' className='btn bp' onClick={submit}>
                    Submit for approval →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className='panel' style={{ marginBottom: 14 }}>
            <div className='ph2'>
              <div className='pt2'>Approval route preview</div>
            </div>
            <div className='pb'>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 13 }}>Based on your manager & active rule:</div>
              <div className='tl'>
                <div className='tli'>
                  <div className='tldot act'>1</div>
                  <div className='tlline' />
                  <div className='tlc'>
                    <div className='tlt'>Manager (IS_MANAGER_APPROVER ✓)</div>
                    <div className='tls'>Vikram Singh — approves first</div>
                  </div>
                </div>
                <div className='tli'>
                  <div className='tldot idle'>2</div>
                  <div className='tlline' />
                  <div className='tlc'>
                    <div className='tlt'>Finance</div>
                    <div className='tls'>Rahul — Finance lead</div>
                  </div>
                </div>
                <div className='tli'>
                  <div className='tldot idle'>3</div>
                  <div className='tlc'>
                    <div className='tlt'>Director</div>
                    <div className='tls'>Ananya Sharma</div>
                  </div>
                </div>
              </div>
              <div className='div' />
              <div
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: 7,
                  padding: '10px 12px',
                  fontSize: 12,
                  color: 'var(--text2)'
                }}
              >
                <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-m)', fontSize: 9.5, marginBottom: 4 }}>
                  CONDITIONAL RULE ACTIVE
                </div>
                Auto-approved if <strong style={{ color: 'var(--text)' }}>60%</strong> of approvers approve, OR if{' '}
                <strong style={{ color: 'var(--text)' }}>CFO</strong> approves.
              </div>
            </div>
          </div>

          {trailOpen && (
            <div className='panel'>
              <div className='ph2'>
                <div className='pt2'>Approval trail</div>
                <span className='badge b-rv'>In Review</span>
              </div>
              <div className='pb'>
                <div className='tl'>
                  <div className='tli'>
                    <div className='tldot done'>✓</div>
                    <div className='tlline' />
                    <div className='tlc'>
                      <div className='tlt'>Vikram Singh — Manager</div>
                      <div className='tls'>Approved · 28 Jun 4:12 PM</div>
                      <div className='tlcmt'>&quot;Valid business purpose.&quot;</div>
                    </div>
                  </div>
                  <div className='tli'>
                    <div className='tldot act'>2</div>
                    <div className='tlline' />
                    <div className='tlc'>
                      <div className='tlt'>Finance — awaiting</div>
                      <div className='tls'>Notification sent to Rahul</div>
                    </div>
                  </div>
                  <div className='tli'>
                    <div className='tldot idle'>3</div>
                    <div className='tlc'>
                      <div className='tlt'>Director — not started</div>
                      <div className='tls' style={{ color: 'var(--text3)' }}>
                        Waiting for step 2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpenseSubmit
