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
              onChange={e => setLoginEmail(e.target.value)} />
          </div>
          <div className='fg'>
            <label className='fl' htmlFor='li-pass'>
              Password
            </label>
            <div className='relative'>
              <input
                id='li-pass'
                className='fi pr-10'
                type={showLp ? 'text' : 'password'}
                placeholder='••••••••'
                value={loginPassword}
                required
                onChange={e => setLoginPassword(e.target.value)} />
              <button
                type='button'
                className='absolute right-0 top-1/2 -translate-y-1/2 p-2.25 pr-2.5 border-none bg-transparent text-(--text2) cursor-pointer transition-colors hover:text-(--text)'
                onClick={() => setShowLp(!showLp)}
                aria-label='Toggle password'>
                {showLp ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <label className='flex items-center gap-1.25 text-xs text-(--text2) cursor-pointer'>
              <input type='checkbox' style={{ accentColor: 'var(--accent)' }} /> Remember me
            </label>
            <span className='text-xs text-(--text3) cursor-pointer'>
              <Link to='/forgot-password' className='text-inherit no-underline'>
                Forgot password?
              </Link>
            </span>
          </div>
          <button
            type='submit'
            className='btn bp w-full justify-center'
            disabled={loading}>
            {loading ? (
              <span className='inline-flex items-center gap-2'>
                <FaCircleNotch className='animate-spin' size={14} /> Signing in…
              </span>
            ) : (
              'Login →'
            )}
          </button>
        </form>
        <div className='text-center mt-5'>
          <span className='text-sm text-(--text2)'>
            Don't have an account? <Link to='/signup' className='text-(--accent)'>Sign up</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
export default LoginPage