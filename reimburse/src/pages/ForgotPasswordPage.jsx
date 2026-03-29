import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCircleNotch } from 'react-icons/fa'
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [tempPassword, setTempPassword] = useState('abcd@123')
  const onSubmit = e => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    setLoading(true)
    setTempPassword('abcd@123')
    setTimeout(() => {
      setLoading(false)
      setEmailSent(true)
      toast.success('Password reset link sent to mail. Temporarily use abcd@123 and change it later.')
    }, 1000)
  }
  if (emailSent) {
    return (
      <div className='auth-wrap'>
        <div className='auth-card auth-card--centered'>
          <div className='alogo'>
            Re<span>imburse</span>
          </div>
          <div className='asub'>Check your email</div>
          <div className='text-center mb-6'>
            <p className='text-(--text2) mb-4'>
              Password reset email sent to <strong>{email}</strong>
            </p>
            <p className='text-sm text-(--text3)'>
              Password reset link sent to mail. Temporarily you can use the following password: <strong>abcd@123</strong>. Make sure to change it later.
            </p>
          </div>
          <div className='text-center'>
            <Link to='/login' className='btn bp inline-block'>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='auth-wrap'>
      <div className='auth-card auth-card--centered'>
        <div className='alogo'>
          Re<span>imburse</span>
        </div>
        <div className='asub'>Reset your password</div>
        <p className='text-sm text-(--text2) mb-6'>
          Enter your email address and we'll send you a temporary password.
        </p>
        <form className='aform' onSubmit={onSubmit}>
          <div className='fg'>
            <label className='fl' htmlFor='reset-email'>
              Email address
            </label>
            <input
              id='reset-email'
              className='fi'
              type='email'
              placeholder='you@company.com'
              value={email}
              required
              onChange={e => setEmail(e.target.value)} />
          </div>
          <button
            type='submit'
            className='btn bp w-full justify-center'
            disabled={loading}>
            {loading ? (
              <span className='inline-flex items-center gap-2'>
                <FaCircleNotch className='animate-spin' size={14} /> Sending…
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
        <div className='text-center mt-5'>
          <span className='text-sm text-(--text2)'>
            Remember your password? <Link to='/login' className='text-(--accent)'>Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
export default ForgotPasswordPage