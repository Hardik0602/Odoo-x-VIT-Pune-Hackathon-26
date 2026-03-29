import React, { useState } from 'react'

const Row = ({ initials, name, email, manager, roleDefault }) => {
  const [role, setRole] = useState(roleDefault)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 100px 120px 100px 100px',
        alignItems: 'center',
        padding: '10px 14px',
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
          <div style={{ fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-m)' }}>{email}</div>
        </div>
      </div>
      <div>
        <select className='fi' style={{ padding: '4px 7px', fontSize: 11.5 }} value={role} onChange={e => setRole(e.target.value)}>
          <option>Admin</option>
          <option>Manager</option>
          <option>Employee</option>
        </select>
      </div>
      <div style={{ fontSize: 12, color: manager === '—' ? 'var(--text3)' : 'var(--text2)' }}>{manager}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-m)' }}>{email.split('@')[0]}@…</div>
      <div>
        <button type='button' className='btn bg' style={{ padding: '4px 9px', fontSize: 11 }}>
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
  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>User management</div>
          <div className='ps'>Create users, assign roles, set manager relationships</div>
        </div>
        <button type='button' className='btn bp'>
          + Invite user
        </button>
      </div>
      <div className='two rb-two-col'>
        <div className='panel'>
          <div className='ph2'>
            <div className='pt2'>All users</div>
            <span className='tag'>5 members</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 120px 100px 100px',
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
            <Row initials='RA' name='Ravi Anand' email='ravi@acme.io' manager='—' roleDefault='Admin' />
            <Row initials='VS' name='Vikram Singh' email='vikram@acme.io' manager='—' roleDefault='Manager' />
            <Row initials='PM' name='Priya Menon' email='priya@acme.io' manager='Vikram Singh' roleDefault='Employee' />
            <Row initials='SM' name='Sneha M.' email='sneha@acme.io' manager='Vikram Singh' roleDefault='Employee' />
            <Row initials='AK' name='Arjun Kumar' email='arjun@acme.io' manager='Vikram Singh' roleDefault='Employee' />
          </div>
        </div>

        <div className='panel'>
          <div className='ph2'>
            <div className='pt2'>IS_MANAGER_APPROVER flag</div>
          </div>
          <div className='pb'>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 14 }}>
              When ON: employee&apos;s direct manager must approve their expense <em>first</em>, before the formal chain begins.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { i: 'PM', g: 'linear-gradient(135deg,#E8A93C,#E05252)', n: 'Priya Menon', m: 'Manager: Vikram Singh' },
                { i: 'SM', g: 'linear-gradient(135deg,#2ECC8A,#5B9CF6)', n: 'Sneha M.', m: 'Manager: Vikram Singh' },
                { i: 'AK', g: 'linear-gradient(135deg,#A78BFA,#E05252)', n: 'Arjun Kumar', m: 'Manager: Vikram Singh' }
              ].map((u, idx) => (
                <div
                  key={u.i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 13px',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8
                  }}
                >
                  <div className='av' style={{ width: 26, height: 26, fontSize: 9, background: u.g }}>
                    {u.i}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13 }}>{u.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{u.m}</div>
                  </div>
                  <Toggle key={idx} />
                </div>
              ))}
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
    </div>
  )
}

export default AdminUsers
