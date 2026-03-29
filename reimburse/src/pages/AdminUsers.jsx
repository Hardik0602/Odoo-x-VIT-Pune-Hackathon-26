import React, { useState, useMemo, useEffect } from 'react'
import { getAllUsers, addRegisteredUser } from '../data/userStore'
import { toast } from 'react-toastify'

const Row = ({ initials, name, email, manager, roleDefault }) => {
  const [role, setRole] = useState(roleDefault)
  const isSpecialRole = role === 'CFO' || role === 'Director'
  const managerText = manager ? manager : 'null'
  const managerTextColor = manager ? 'var(--text2)' : 'var(--text3)'
  const handleSendPassword = () => {
    toast.success(`Password reset link sent to ${email}. Temporarily use abcd@123 and change it later.`)
  }
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        transition: 'background .1s',
        cursor: 'pointer'
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)' }}
      onMouseLeave={e => { e.currentTarget.style.background = '' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div className='av' style={{ width: 26, height: 26, fontSize: 10 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            {name}
            {isSpecialRole && <span style={{ fontSize: 12 }}>⭐</span>}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-m)' }}>{email}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text)', padding: '4px 0' }}>
        {role}
      </div>
      <div style={{ padding: '4px 0' }}>
        <span style={{
          display: 'inline-block',
          fontSize: 12,
          color: managerTextColor,
          background: manager ? 'rgba(56, 189, 248, 0.15)' : 'rgba(160, 174, 192, 0.2)',
          border: manager ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(160, 174, 192, 0.35)',
          borderRadius: 999,
          padding: '2px 9px',
          minWidth: 80,
          textAlign: 'center'
        }}>
          {managerText}
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-m)', padding: '4px 0' }}>{email.split('@')[0]}@…</div>
      <div>
        <button type='button' className='btn bg' style={{ padding: '4px 9px', fontSize: 11 }} onClick={handleSendPassword}>
          Send pwd
        </button>
      </div>
    </div>
  )
}

const Toggle = () => {
  const [on, setOn] = useState(true)
  return (
    <button type='button' className={'tog ' + (on ? 'on' : 'off')} onClick={() => setOn(!on)} aria-pressed={on} />
  )
}

const AdminUsers = () => {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'abcd@123',
    role: 'Employee',
    manager: ''
  })
  const allUsers = useMemo(() => getAllUsers(), [])
  const managers = useMemo(() => allUsers.filter(u => 
    u.role === 'manager' || u.role === 'Manager' || 
    u.role === 'cfo' || u.role === 'CFO' ||
    u.role === 'director' || u.role === 'Director'
  ), [allUsers])

  // Find default manager (CFO or Director, preferring CFO)
  const defaultManager = useMemo(() => {
    const cfo = allUsers.find(u => u.role?.toLowerCase() === 'cfo')
    if (cfo) return cfo.email
    const director = allUsers.find(u => u.role?.toLowerCase() === 'director')
    if (director) return director.email
    // Fallback to first manager if no CFO/Director
    return managers.length > 0 ? managers[0].email : ''
  }, [allUsers, managers])

  // Set default manager in form when it changes
  useEffect(() => {
    if (defaultManager) {
      setFormData(prev => ({ ...prev, manager: defaultManager }))
    }
  }, [defaultManager])

  const handleInvite = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required')
      return
    }
    if (!formData.email.includes('@')) {
      toast.error('Invalid email address')
      return
    }
    
    const role = formData.role.toLowerCase()
    if (role === 'employee' && !formData.manager) {
      toast.error('Please select a manager for employees')
      return
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      manager: role === 'employee' ? formData.manager : null,
      currencyCode: 'INR',
      currencySymbol: '₹',
      country: 'India'
    }

    addRegisteredUser(newUser)
    toast.success(`Invite sent to ${formData.email}. Password reset link sent to mail; temporarily use abcd@123 and change it later.`)
    setFormData({ name: '', email: '', password: 'abcd@123', role: 'Employee', manager: defaultManager })
    setShowInviteModal(false)
  }

  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>User management</div>
          <div className='ps'>Create users, assign roles, set manager relationships</div>
        </div>
        <button type='button' className='btn bp' onClick={() => setShowInviteModal(true)}>
          + Invite user
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className='panel' style={{ width: '100%' }}>
          <div className='ph2'>
            <div className='pt2'>All users</div>
            <span className='tag'>{allUsers.length} members</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              padding: '8px 14px',
              borderBottom: '1px solid var(--border)'
            }}
          >
            {['USER', 'ROLE', 'MANAGER', 'EMAIL', ''].map(h => (
              <div key={h} style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)' }}>
                {h}
              </div>
            ))}
          </div>
          <div>
            {allUsers.map((user, idx) => {
              const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              const managerUser = allUsers.find(u => u.email === user.manager)
              const managerDisplay = managerUser ? `${managerUser.name} (${managerUser.email})` : (user.manager || 'null')
              return (
                <Row
                  key={idx}
                  initials={initials}
                  name={user.name}
                  email={user.email}
                  manager={managerDisplay}
                  roleDefault={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                />
              )
            })}
          </div>
        </div>

        <div className='panel' style={{ width: '100%', padding: '12px 14px' }}>
          <div className='ph2'>
            <div className='pt2' style={{ fontSize: 14 }}>IS_MANAGER_APPROVER</div>
          </div>
          <div className='pb' style={{ padding: '0' }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 14 }}>
              When ON: employee&apos;s direct manager must approve their expense <em>first</em>, before the formal chain begins.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {allUsers.filter(u => u.role.toLowerCase() === 'employee').map((u, idx) => {
                const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                const gradients = [
                  'linear-gradient(135deg,#E8A93C,#E05252)',
                  'linear-gradient(135deg,#2ECC8A,#5B9CF6)',
                  'linear-gradient(135deg,#A78BFA,#E05252)'
                ]
                return (
                  <div
                    key={u.email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: 6
                    }}
                  >
                    <div className='av' style={{ width: 26, height: 26, fontSize: 9, background: gradients[idx % gradients.length] }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>Manager: {u.manager || 'null'}</div>
                    </div>
                    <Toggle key={u.email} />
                  </div>
                )
              })}
            </div>
            <div
              style={{
                marginTop: 12,
                padding: '10px 12px',
                background: 'var(--adim)',
                border: '1px solid rgba(212,245,96,.15)',
                borderRadius: 7,
                fontSize: 12,
                color: 'var(--text2)'
              }}
            >
              <span style={{ color: 'var(--accent)' }}>Note:</span> On signup, Admin creates employees & assigns their manager. A new company + currency is auto-created for each signup.
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            width: 400,
            maxWidth: '90%',
            padding: 20
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Invite New User</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='John Doe'
                  style={{
                    width: '100%',
                    padding: '9px 11px',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    fontSize: 13,
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Email</label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder='john@company.com'
                  style={{
                    width: '100%',
                    padding: '9px 11px',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    fontSize: 13,
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value, manager: '' })}
                  style={{
                    width: '100%',
                    padding: '9px 11px',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    fontSize: 13,
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    boxSizing: 'border-box'
                  }}
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Employee</option>
                </select>
              </div>
              {formData.role === 'Employee' && (
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Manager</label>
                  <select
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 11px',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      fontSize: 13,
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value=''>Select a manager</option>
                    {managers.map((m) => (
                      <option key={m.email} value={m.email}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type='button'
                onClick={() => setShowInviteModal(false)}
                style={{
                  padding: '9px 16px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleInvite}
                style={{
                  padding: '9px 16px',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500
                }}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
