import React, { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RATES = {
  'INR|₹|1': 1,
  'USD|$|91.5': 91.5,
  'EUR|€|90.5': 90.5,
  'GBP|£|105.8': 105.8,
  'JPY|¥|0.55': 0.55,
  'CNY|¥|11.5': 11.5,
  'KRW|₩|0.062': 0.062,
  'SGD|S$|61.5': 61.5,
  'AUD|A$|54.8': 54.8,
  'CAD|C$|61.2': 61.2,
  'NZD|NZ$|50.5': 50.5,
  'AED|د.إ|22.65': 22.65,
  'SAR|﷼|22.2': 22.2,
  'QAR|﷼|22.8': 22.8,
  'CHF|CHF|94.5': 94.5,
  'SEK|kr|8.0': 8.0,
  'NOK|kr|7.9': 7.9,
  'DKK|kr|12.1': 12.1,
  'BRL|R$|16.8': 16.8,
  'MXN|$|4.9': 4.9,
  'ZAR|R|4.4': 4.4
}

const ExpenseSubmit = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const sym = user?.currencySymbol || '₹'
  const code = user?.currencyCode || 'INR'

  const [desc, setDesc] = useState('')
  const [currKey, setCurrKey] = useState('INR|₹|1')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState('Meals')
  const [stepState, setStepState] = useState('draft')
  const [loading, setLoading] = useState(false)

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

  const submit = async () => {
    if (!desc.trim()) {
      toast.error('Description is required')
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    setLoading(true)
    try {
      const parts = currKey.split('|')
      const rate = RATES[currKey] ?? 1
      const convertedAmount = (parseFloat(amount) * rate).toFixed(2)

      const newExpense = {
        id: `exp-${Date.now()}`,
        description: desc,
        category: category,
        amount: convertedAmount,
        originalAmount: amount,
        originalCurrency: parts[0],
        submittedBy: user?.email,
        submittedByName: user?.name || '',
        submittedDate: new Date().toISOString().split('T')[0],
        date: date,
        status: 'pending',
        notes: notes
      }

      const res = await fetch('http://localhost:3000/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      })

      if (res.ok) {
        setStepState('waiting')
        toast.success('Expense submitted! Your manager has been notified.')
        setTimeout(() => {
          navigate('/employee/claims')
        }, 1500)
      } else {
        toast.error('Failed to submit expense')
      }
    } catch (error) {
      console.log('Error:', error)
      toast.error('Failed to submit expense')
    } finally {
      setLoading(false)
    }
  }
  const [ocrLoading, setOcrLoading] = useState(false)
  const handleOCR = async (file) => {
    if (!file) return

    setOcrLoading(true)

    try {
      const {
        data: { text }
      } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      })

      console.log('OCR TEXT:', text)

      const amountMatch = text.match(/(\d+[\.,]\d{2})/)
      if (amountMatch) {
        setAmount(amountMatch[0].replace(',', ''))
      }
      const dateMatch = text.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/)
      if (dateMatch) {
        const parts = dateMatch[0].split(/[\/\-]/)
        setDate(`${parts[2]}-${parts[1]}-${parts[0]}`)
      }
      const lines = text.split('\n').filter(l => l.trim().length > 3)
      if (lines.length > 0) {
        setDesc(lines[0])
      }

      toast.success('OCR completed — fields auto-filled 🎉')

    } catch (err) {
      console.error(err)
      toast.error('OCR failed')
    } finally {
      setOcrLoading(false)
    }
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
                onClick={() => document.getElementById('receiptUpload').click()}
                onKeyDown={e => e.key === 'Enter' && document.getElementById('receiptUpload').click()}
                style={{
                  border: '1.5px dashed var(--border2)',
                  borderRadius: 'var(--r)',
                  padding: 20,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  background: 'var(--surface2)',
                  textAlign: 'center'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="receiptUpload"
                  onChange={(e) => handleOCR(e.target.files[0])}
                />

                {ocrLoading ? (
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>
                    🔍 Scanning receipt...
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>
                      📎 Upload or drag receipt here (optional)
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                      PNG, JPG supported
                    </div>
                  </>
                )}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>📎 Upload or drag receipt here (optional)</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>PNG, JPG or PDF</div>
            </div>
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
                  placeholder='e.g. Client lunch'
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>
              <div className='fg'>
                <label className='fl' htmlFor='fcat'>
                  Category
                </label>
                <select id='fcat' className='fi' value={category} onChange={e => setCategory(e.target.value)}>
                  <option>🍽 Meals</option>
                  <option>✈ Travel</option>
                  <option>🏨 Accommodation</option>
                  <option>☁ Software</option>
                  <option>🖥 Hardware</option>
                  <option>🎉 Events</option>
                  <option>📦 Other</option>
                </select>
              </div>
              <div className='fg'>
                <label className='fl' htmlFor='fpaid'>
                  Paid by
                </label>
                <select id='fpaid' className='fi' defaultValue='Self'>
                  <option>Self</option>
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
                <input id='fdate' className='fi' type='date' value={date} onChange={e => setDate(e.target.value)} />
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
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
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
                <button type='button' className='btn bp' onClick={submit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit for approval →'}
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
      </div>
    </div>
  )
}

export default ExpenseSubmit
