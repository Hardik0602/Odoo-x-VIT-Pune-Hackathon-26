import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MyClaims = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const sym = user?.currencySymbol || '₹'

  return (
    <div className='view'>
      <div className='ph'>
        <div>
          <div className='pt'>My claims</div>
          <div className='ps'>All submitted expenses and approval status</div>
        </div>
        <button type='button' className='btn bp' onClick={() => navigate('/employee/submit')}>
          + New claim
        </button>
      </div>
      <div className='tw'>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount ({user?.currencyCode || 'INR'})</th>
              <th>Approval progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>Business lunch — Bistro Café</div>
              </td>
              <td>
                <span style={{ fontSize: 12 }}>🍽 Meals</span>
              </td>
              <td>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>28 Jun</span>
              </td>
              <td>
                <div className='amt'>
                  {sym}6,840
                </div>
                <div className='amts'>$82 USD</div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: '40%', height: '100%', background: 'var(--amber)', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-m)', color: 'var(--text2)' }}>1/3</span>
                </div>
              </td>
              <td>
                <span className='badge b-rv'>In Review</span>
              </td>
            </tr>
            <tr>
              <td>
                <div>AWS Cloud Credits</div>
              </td>
              <td>
                <span style={{ fontSize: 12 }}>☁ Software</span>
              </td>
              <td>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>26 Jun</span>
              </td>
              <td>
                <div className='amt'>
                  {sym}41,600
                </div>
                <div className='amts'>$500 USD</div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--green)', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-m)', color: 'var(--text2)' }}>3/3</span>
                </div>
              </td>
              <td>
                <span className='badge b-ap'>Approved</span>
              </td>
            </tr>
            <tr>
              <td>
                <div>Team offsite venue</div>
              </td>
              <td>
                <span style={{ fontSize: 12 }}>🎉 Events</span>
              </td>
              <td>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text2)' }}>20 Jun</span>
              </td>
              <td>
                <div className='amt'>
                  {sym}88,000
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: '33%', height: '100%', background: 'var(--red)', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-m)', color: 'var(--text2)' }}>—</span>
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

export default MyClaims
