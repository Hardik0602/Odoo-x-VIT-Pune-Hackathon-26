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
      navigate('/admin/users')
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
              Full Name
            </label>
            <input
              id='su-name'
              className='fi'
              type='text'
              placeholder='Your Name'
              value={suName}
              required
              onChange={e => setSuName(e.target.value)} />
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='su-email'>
              Work Email
            </label>
            <input
              id='su-email'
              className='fi'
              type='email'
              placeholder='you@company.com'
              value={suEmail}
              required
              onChange={e => setSuEmail(e.target.value)} />
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='su-pass'>
              Password
            </label>
            <div className='relative'>
              <input
                id='su-pass'
                className='fi pr-10'
                type={showSu1 ? 'text' : 'password'}
                placeholder='Password'
                value={suPassword}
                required
                minLength={6}
                onChange={e => setSuPassword(e.target.value)} />
              <button
                type='button'
                className='absolute right-0 top-1/2 -translate-y-1/2 p-2.25 pr-2.5 border-none bg-transparent text-(--text2) cursor-pointer transition-colors hover:text-(--text)'
                onClick={() => setShowSu1(!showSu1)}
                aria-label='Toggle password'>
                {showSu1 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='su-confirm'>
              Confirm password
            </label>
            <div className='relative'>
              <input
                id='su-confirm'
                className='fi pr-10'
                type={showSu2 ? 'text' : 'password'}
                placeholder='Re-enter Password'
                value={suConfirm}
                required
                onChange={e => setSuConfirm(e.target.value)} />
              <button
                type='button'
                className='absolute right-0 top-1/2 -translate-y-1/2 p-2.25 pr-2.5 border-none bg-transparent text-(--text2) cursor-pointer transition-colors hover:text-(--text)'
                onClick={() => setShowSu2(!showSu2)}
                aria-label='Toggle password'>
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
              onChange={e => setCountryVal(e.target.value)}>
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
            className='btn bp w-full justify-center'
            disabled={loading}>
            {loading ? (
              <span className='inline-flex items-center gap-2'>
                <FaCircleNotch className='animate-spin' size={14} /> Creating…
              </span>
            ) : (
              'Create company & sign in →'
            )}
          </button>
        </form>
        <div className='text-center mt-5'>
          <span className='text-sm text-(--text2)'>
            Already have an account? <Link to='/login' className='text-(--accent)'>Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
export default SignupPage