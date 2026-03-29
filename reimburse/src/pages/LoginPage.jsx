import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FaCircleNotch, FaEye, FaEyeSlash } from 'react-icons/fa'

const LoginPage = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLp, setShowLp] = useState(false)

  const onLogin = e => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const u = login(loginEmail, loginPassword)
      setLoading(false)
      if (!u) {
        toast.error('Invalid credentials')
        return
      }
      toast.success('Signed in')
      navigate('/employee/dashboard')
    }, 500)
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
        <div className='asub'>Sign in</div>
        <form className='aform' onSubmit={onLogin}>
          <div className='fg'>
            <label className='fl' htmlFor='li-email'>
              Email
            </label>
            <input
              id='li-email'
              className='fi'
              type='email'
              placeholder='you@company.io'
              value={loginEmail}
              required
              onChange={e => setLoginEmail(e.target.value)}
            />
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='li-pass'>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id='li-pass'
                className='fi'
                type={showLp ? 'text' : 'password'}
                placeholder='••••••••'
                value={loginPassword}
                required
                onChange={e => setLoginPassword(e.target.value)}
                style={{ paddingRight: 40 }}
              />
              <button
                type='button'
                className='nav-tab'
                style={{ position: 'absolute', right: 0, top: 0, padding: '9px 10px', border: 'none' }}
                onClick={() => setShowLp(!showLp)}
                aria-label='Toggle password'
              >
                {showLp ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                color: 'var(--text2)',
                cursor: 'pointer'
              }}
            >
              <input type='checkbox' style={{ accentColor: 'var(--accent)' }} /> Remember me
            </label>
            <span style={{ fontSize: 12, color: 'var(--text3)', cursor: 'pointer' }}>
              <Link to='/forgot-password' style={{ color: 'inherit', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </span>
          </div>
          <button
            type='submit'
            className='btn bp'
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <FaCircleNotch className='animate-spin' size={14} /> Signing in…
              </span>
            ) : (
              'Login →'
            )}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>
            Don't have an account? <Link to='/signup' style={{ color: 'var(--accent)' }}>Sign up</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage