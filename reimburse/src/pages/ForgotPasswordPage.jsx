import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCircleNotch } from 'react-icons/fa'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [tempPassword, setTempPassword] = useState('')

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const onSubmit = e => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    // Generate unique random password
    const newPassword = generateRandomPassword()
    setTempPassword(newPassword)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setEmailSent(true)
      toast.success('Temporary password sent to your email')
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
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ color: 'var(--text2)', marginBottom: 16 }}>
              Password reset email sent to <strong>{email}</strong>
            </p>
            <p style={{ fontSize: 14, color: 'var(--text3)' }}>
              Check your email for a temporary password. Use it to log in and change your password immediately.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to='/login' className='btn bp' style={{ display: 'inline-block' }}>
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
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24 }}>
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
              placeholder='you@company.io'
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='btn bp'
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <FaCircleNotch className='animate-spin' size={14} /> Sending…
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>
            Remember your password? <Link to='/login' style={{ color: 'var(--accent)' }}>Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage