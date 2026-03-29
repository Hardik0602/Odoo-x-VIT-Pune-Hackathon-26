import React, { useState } from 'react'

const Tog = ({ initial = true }) => {
  const [on, setOn] = useState(initial)
  return <button type='button' className={'tog ' + (on ? 'on' : 'off')} onClick={() => setOn(!on)} />
}

const AdminRules = () => {
  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>Approval rules</div>
          <div className='ps'>Configure sequential approver chains and conditional auto-approval logic</div>
        </div>
        <button type='button' className='btn bp'>
          + New rule
        </button>
      </div>
      <div className='rb-two-col' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className='panel'>
          <div className='ph2'>
            <div>
              <div className='pt2'>Approval rule for miscellaneous expenses</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Default rule · applies when no specific rule matches</div>
            </div>
            <span className='badge b-ap'>Active</span>
          </div>
          <div style={{ padding: 0 }}>
            <div style={{ padding: '13px 17px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 7 }}>
                MANAGER (Approves first if IS_MANAGER_APPROVER is ON)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className='av' style={{ width: 24, height: 24, fontSize: 9, background: 'linear-gradient(135deg,#5B9CF6,#A78BFA)' }}>
                  VS
                </div>
                <div style={{ fontSize: 13 }}>Vikram Singh</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>↓ then chain proceeds</div>
              </div>
            </div>
            <div style={{ padding: '13px 17px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 9.5, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 10 }}>APPROVERS — sequential order</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['1', 'John (Manager)', 'Required', true],
                  ['2', 'Mitchell (Finance)', 'Required', true],
                  ['3', 'Ananya (Director)', 'Required', false]
                ].map(([num, label, req, on]) => (
                  <div
                    key={num}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '10px 12px'
                    }}
                  >
                    <div className='snum'>{num}</div>
                    <select className='fi' style={{ flex: 1, padding: '6px 10px', fontSize: 13 }}>
                      <option>{label}</option>
                      <option>Vikram Singh</option>
                      <option>Rahul — Finance</option>
                    </select>
                    <span style={{ fontSize: 11.5, color: 'var(--text2)' }}>{req}</span>
                    <Tog initial={on} />
                  </div>
                ))}
                <button type='button' className='btn bg' style={{ fontSize: 12, padding: 7, width: '100%', justifyContent: 'center' }}>
                  + Add approver
                </button>
              </div>
            </div>
            <div style={{ padding: '13px 17px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <input type='checkbox' defaultChecked style={{ accentColor: 'var(--accent)', marginTop: 3, width: 14, height: 14, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 5 }}>Approves Expense</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                    If this rule is triggered, the time-conditional sequence of approvers applies. Each approver approves in order. If an approver rejects, the request is rejected.
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '13px 17px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Minimum Approval percentage</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>
                  Percentage of approvers needed for conditional approval
                </div>
              </div>
              <input
                type='number'
                defaultValue={60}
                min={1}
                max={100}
                style={{
                  width: 64,
                  background: 'var(--surface2)',
                  border: '1px solid var(--border2)',
                  borderRadius: 6,
                  padding: '7px 9px',
                  fontFamily: 'var(--font-m)',
                  fontSize: 15,
                  color: 'var(--accent)',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>%</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className='panel'>
            <div className='ph2'>
              <div className='pt2'>Chain preview</div>
            </div>
            <div className='pb'>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <div
                  style={{
                    background: 'var(--adim2)',
                    border: '1px solid rgba(212,245,96,.2)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    textAlign: 'center',
                    fontSize: 12,
                    minWidth: 70
                  }}
                >
                  <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>STEP 0</div>
                  <div style={{ color: 'var(--accent)' }}>Manager</div>
                  <div style={{ fontSize: 9, color: 'var(--text3)' }}>if flag ON</div>
                </div>
                <svg width='14' height='14' viewBox='0 0 14 14' fill='none' style={{ color: 'var(--text3)', flexShrink: 0 }}>
                  <path d='M2 7h10M8 4l3 3-3 3' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round' />
                </svg>
                {['John', 'Mitchell', 'Ananya'].map((name, i) => (
                  <React.Fragment key={name}>
                    {i > 0 && (
                      <svg width='14' height='14' viewBox='0 0 14 14' fill='none' style={{ color: 'var(--text3)', flexShrink: 0 }}>
                        <path d='M2 7h10M8 4l3 3-3 3' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round' />
                      </svg>
                    )}
                    <div
                      style={{
                        background: 'var(--surface2)',
                        border: '1px solid var(--border2)',
                        borderRadius: 8,
                        padding: '8px 10px',
                        textAlign: 'center',
                        fontSize: 12,
                        minWidth: 70
                      }}
                    >
                      <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-m)', marginBottom: 2 }}>STEP {i + 1}</div>
                      <div>{name}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className='panel'>
            <div className='ph2'>
              <div className='pt2'>Conditional rules</div>
            </div>
            <div className='pb' style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { icon: '📊', t: 'Percentage threshold', d: '60% of approvers approve → auto-approved', on: true },
                { icon: '⚡', t: 'Specific approver override', d: 'CFO approves → expense auto-approved', on: false },
                { icon: '⚖', t: 'Hybrid rule', d: '60% OR CFO approval → auto-approved', on: true }
              ].map(rule => (
                <div
                  key={rule.t}
                  style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '11px 13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: 'rgba(91,156,246,.1)',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0
                    }}
                  >
                    {rule.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{rule.t}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text2)', marginTop: 2 }}>{rule.d}</div>
                  </div>
                  <Tog initial={rule.on} />
                </div>
              ))}
            </div>
          </div>

          <button type='button' className='btn bp' style={{ width: '100%', justifyContent: 'center' }}>
            Save rule changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminRules
