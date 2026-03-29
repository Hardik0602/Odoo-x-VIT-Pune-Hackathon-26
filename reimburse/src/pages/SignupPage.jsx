import React, { useMemo, useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FaCircleNotch, FaEye, FaEyeSlash } from 'react-icons/fa'
import { countryCurrencyOptions, parseCountryCurrency } from '../data/countryCurrency'

const SignupPage = () => {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [suName, setSuName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [countryVal, setCountryVal] = useState('India|INR|₹')
  const [loading, setLoading] = useState(false)
  const [showSu1, setShowSu1] = useState(false)
  const [showSu2, setShowSu2] = useState(false)

  const currencyPreview = useMemo(() => {
    const { country, currencyCode, currencySymbol } = parseCountryCurrency(countryVal)
    const opt = countryCurrencyOptions.find(o => o.value === countryVal)
    const flag = opt?.flag || '🌍'
    return `${flag} Company currency set to ${currencyCode} ${currencySymbol}`
  }, [countryVal])

  const onSignup = e => {
    e.preventDefault()
    if (suPassword !== suConfirm) {
      toast.error('Passwords do not match')
      return
    }
    if (suPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const meta = parseCountryCurrency(countryVal)
      const result = register(suName.trim(), suEmail.trim(), suPassword, meta)
      setLoading(false)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Company account created')
      navigate('/employee/dashboard')
    }, 600)
  }

  if (user) {
    return <Navigate to='/employee/dashboard' replace />
  }

  return (
    <div className='auth-wrap'>
      <div className='auth-card auth-card--centered'>
        <div className='alogo'>
          Re<span>imburse</span>
        </div>
        <div className='asub'>Create your company account</div>
        <form className='aform' onSubmit={onSignup}>
          <div className='fg'>
            <label className='fl' htmlFor='su-name'>
              Full name
            </label>
            <input
              id='su-name'
              className='fi'
              type='text'
              placeholder='Ravi Anand'
              value={suName}
              required
              onChange={e => setSuName(e.target.value)}
            />
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='su-email'>
              Work email
            </label>
            <input
              id='su-email'
              className='fi'
              type='email'
              placeholder='ravi@acme.io'
              value={suEmail}
              required
              onChange={e => setSuEmail(e.target.value)}
            />
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='su-pass'>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id='su-pass'
                className='fi'
                type={showSu1 ? 'text' : 'password'}
                placeholder='••••••••'
                value={suPassword}
                required
                minLength={6}
                onChange={e => setSuPassword(e.target.value)}
                style={{ paddingRight: 40 }}
              />
              <button
                type='button'
                className='nav-tab'
                style={{ position: 'absolute', right: 0, top: 0, padding: '9px 10px', border: 'none' }}
                onClick={() => setShowSu1(!showSu1)}
                aria-label='Toggle password'
              >
                {showSu1 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='su-confirm'>
              Confirm password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id='su-confirm'
                className='fi'
                type={showSu2 ? 'text' : 'password'}
                placeholder='••••••••'
                value={suConfirm}
                required
                onChange={e => setSuConfirm(e.target.value)}
                style={{ paddingRight: 40 }}
              />
              <button
                type='button'
                className='nav-tab'
                style={{ position: 'absolute', right: 0, top: 0, padding: '9px 10px', border: 'none' }}
                onClick={() => setShowSu2(!showSu2)}
                aria-label='Toggle password'
              >
                {showSu2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='su-country'>
              Country — sets company currency
            </label>
            <select
              id='su-country'
              className='fi'
              value={countryVal}
              onChange={e => setCountryVal(e.target.value)}
            >
              {countryCurrencyOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className='cprev'>{currencyPreview}</div>
            <div className='hint'>Currency is set based on country and cannot be changed after signup.</div>
          </div>
          <button
            type='submit'
            className='btn bp'
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <FaCircleNotch className='animate-spin' size={14} /> Creating…
              </span>
            ) : (
              'Create company & sign in →'
            )}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>
            Already have an account? <Link to='/login' style={{ color: 'var(--accent)' }}>Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default SignupPage