import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isAdminAll = pathname.includes('/admin/expenses')
  const isManagerMy = pathname.includes('/manager/expenses')
  const sym = user?.currencySymbol || '₹'
  const code = user?.currencyCode || 'INR'

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const first = user?.name?.split(/\s+/)[0] || 'there'

  let title
  let subtitle
  if (isAdminAll) {
    title = 'All expenses'
    subtitle = `Organization-wide · amounts in ${code} ${sym}`
  } else if (isManagerMy) {
    title = 'My expenses'
    subtitle = `Your claims and history · ${code} ${sym}`
  } else {
    title = `${greet}, ${first}.`
    subtitle = `Your expense overview · all amounts in ${code} ${sym}`
  }

  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>{title}</div>
          <div className='ps'>{subtitle}</div>
        </div>
        {!isAdminAll && (
          <button type='button' className='btn bp' onClick={() => navigate('/employee/submit')}>
            + New Expense
          </button>
        )}
      </div>
      <div className='stat-row'>
        <div className='stat sac'>
          <div className='stl'>Total Submitted</div>
          <div className='stv' style={{ fontFamily: 'var(--font-m)', fontSize: 20 }}>
            {sym}2,84,320
          </div>
          <div className='sts'>↑ 12% this month</div>
        </div>
        <div className='stat sg'>
          <div className='stl'>Approved</div>
          <div className='stv' style={{ fontFamily: 'var(--font-m)', fontSize: 20 }}>
            {sym}1,96,450
          </div>
          <div className='sts' style={{ color: 'var(--green)' }}>
            ↑ 8% vs last month
          </div>
        </div>
        <div className='stat sa'>
          <div className='stl'>Pending Review</div>
          <div className='stv'>12</div>
          <div className='sts'>3 require action</div>
        </div>
        <div className='stat sb'>
          <div className='stl'>Avg. Resolution</div>
          <div className='stv'>
            1.4<span style={{ fontSize: 13, fontFamily: 'var(--font)', color: 'var(--text2)' }}> days</span>
          </div>
          <div className='sts'>↓ 0.3 days faster</div>
        </div>
      </div>
      <div className='sl'>Recent expenses</div>
      <div className='tw'>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Description</th>
              <th>Date</th>
              <th>Category</th>
              <th>Paid by</th>
              <th>
                Amount ({code})
              </th>
              <th>Approval chain</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => navigate('/employee/submit')}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    className='av'
                    style={{
                      width: 24,
                      height: 24,
                      fontSize: 9,
                      background: 'linear-gradient(135deg,#E8A93C,#E05252)'
                    }}
                  >
                    PM
                  </div>
                  <div>
                    <div>Priya M.</div>
                    <div className='ts2'>Employee</div>
                  </div>
                </div>
              </td>
              <td>
                <div>Business lunch — Q2</div>
                <div className='ts2'>Bistro Café</div>
              </td>
              <td>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>28 Jun</span>
              </td>
              <td>
                <span
                  style={{
                    fontSize: 11.5,
                    background: 'var(--surface2)',
                    padding: '2px 7px',
                    borderRadius: 5,
                    border: '1px solid var(--border)'
                  }}
                >
                  🍽 Meals
                </span>
              </td>
              <td>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Self</span>
              </td>
              <td>
                <div className='amt'>
                  {sym}6,840
                </div>
                <div className='amts'>$82 USD</div>
              </td>
              <td>
                <div className='chain'>
                  <div className='cd done'>✓</div>
                  <div className='cl done' />
                  <div className='cd act'>2</div>
                  <div className='cl' />
                  <div className='cd idle'>3</div>
                </div>
              </td>
              <td>
                <span className='badge b-rv'>In Review</span>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    className='av'
                    style={{
                      width: 24,
                      height: 24,
                      fontSize: 9,
                      background: 'linear-gradient(135deg,#5B9CF6,#A78BFA)'
                    }}
                  >
                    AK
                  </div>
                  <div>
                    <div>Arjun K.</div>
                    <div className='ts2'>Employee</div>
                  </div>
                </div>
              </td>
              <td>
                <div>AWS Cloud Credits</div>
              </td>
              <td>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>26 Jun</span>
              </td>
              <td>
                <span
                  style={{
                    fontSize: 11.5,
                    background: 'var(--surface2)',
                    padding: '2px 7px',
                    borderRadius: 5,
                    border: '1px solid var(--border)'
                  }}
                >
                  ☁ Software
                </span>
              </td>
              <td>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Co. card</span>
              </td>
              <td>
                <div className='amt'>
                  {sym}41,600
                </div>
                <div className='amts'>$500 USD</div>
              </td>
              <td>
                <div className='chain'>
                  <div className='cd done'>✓</div>
                  <div className='cl done' />
                  <div className='cd done'>✓</div>
                  <div className='cl done' />
                  <div className='cd done'>✓</div>
                </div>
              </td>
              <td>
                <span className='badge b-ap'>Approved</span>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    className='av'
                    style={{
                      width: 24,
                      height: 24,
                      fontSize: 9,
                      background: 'linear-gradient(135deg,#2ECC8A,#5B9CF6)'
                    }}
                  >
                    SM
                  </div>
                  <div>
                    <div>Sneha M.</div>
                  </div>
                </div>
              </td>
              <td>
                <div>Client travel — BLR</div>
              </td>
              <td>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>24 Jun</span>
              </td>
              <td>
                <span
                  style={{
                    fontSize: 11.5,
                    background: 'var(--surface2)',
                    padding: '2px 7px',
                    borderRadius: 5,
                    border: '1px solid var(--border)'
                  }}
                >
                  ✈ Travel
                </span>
              </td>
              <td>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Self</span>
              </td>
              <td>
                <div className='amt'>
                  {sym}12,300
                </div>
              </td>
              <td>
                <div className='chain'>
                  <div className='cd done'>✓</div>
                  <div className='cl' />
                  <div className='cd act'>2</div>
                </div>
              </td>
              <td>
                <span className='badge b-wa'>Pending</span>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className='av' style={{ width: 24, height: 24, fontSize: 9 }}>
                    RA
                  </div>
                  <div>
                    <div>Ravi A.</div>
                  </div>
                </div>
              </td>
              <td>
                <div>Team offsite venue</div>
              </td>
              <td>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>20 Jun</span>
              </td>
              <td>
                <span
                  style={{
                    fontSize: 11.5,
                    background: 'var(--surface2)',
                    padding: '2px 7px',
                    borderRadius: 5,
                    border: '1px solid var(--border)'
                  }}
                >
                  🎉 Events
                </span>
              </td>
              <td>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>Self</span>
              </td>
              <td>
                <div className='amt'>
                  {sym}88,000
                </div>
              </td>
              <td>
                <div className='chain'>
                  <div className='cd idle'>✗</div>
                </div>
              </td>
              <td>
                <span className='badge b-rj'>Rejected</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeDashboard
