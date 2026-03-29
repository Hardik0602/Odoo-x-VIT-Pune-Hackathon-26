import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function initials (name) {
  if (!name) return '?'
  const p = name.trim().split(/\s+/)
  return (p[0][0] + (p[1]?.[0] || '')).toUpperCase()
}

const ReimburseLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  const userRole = user.role.toLowerCase()
  const curLabel = `${user?.currencyCode} ${user?.currencySymbol}`
  const roleLabel = userRole === 'employee' ? `Employee · ${curLabel}` : userRole === 'manager' ? `Manager · ${curLabel}` : `Admin · ${curLabel}`

  return (
    <>
      <nav className='top-nav'>
        <div className='nav-logo'>
          Re<span>imburse</span>
        </div>

        {userRole === 'employee' && (
          <div style={{ display: 'flex' }}>
            <NavLink to='/employee/dashboard' className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to='/employee/submit' className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')}>
              Submit Expense
            </NavLink>
            <NavLink to='/employee/claims' className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')}>
              My Claims
            </NavLink>
          </div>
        )}

        {userRole === 'manager' && (
          <div style={{ display: 'flex' }}>
            <NavLink to='/manager/approvals' className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')}>
              Approvals to Review
            </NavLink>
            <NavLink to='/manager/expenses' className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')}>
              Team Expenses
            </NavLink>
          </div>
        )}

        {userRole === 'admin' && (
          <div style={{ display: 'flex' }}>
            <NavLink to='/admin/users' className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')}>
              User Management
            </NavLink>
            <NavLink to='/admin/rules' className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')}>
              Approval Rules
            </NavLink>
            <NavLink to='/admin/expenses' className={({ isActive }) => 'nav-tab' + (isActive ? ' active' : '')}>
              All Expenses
            </NavLink>
          </div>
        )}

        <div className='nav-right'>
          <div className='nav-user'>
            <div className='av'>{initials(user?.name)}</div>
            <div>
              <div style={{ fontSize: '12.5px', color: 'var(--text)' }}>{user?.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-m)' }} id='rlabel'>
                {roleLabel}
              </div>
            </div>
          </div>
          <button type='button' className='btn bg' style={{ fontSize: 11, padding: '6px 10px' }} onClick={() => { logout(); navigate('/login') }}>
            Log out
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  )
}

export default ReimburseLayout
