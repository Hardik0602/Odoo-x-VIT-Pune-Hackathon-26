import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
const Profile = () => {
  const active = true
  const avgResTime = 2.0
  const { user } = useAuth()
  const { totalTasks, pendingTasks, completedTasks, overdueTasks } = useData()
  const role = user.role.charAt(0).toUpperCase() + user.role.slice(1)
  const initials = user.name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8'>
        <div className='mb-8 animate-slideUp'>
          <h1 className='text-2xl font-bold text-slate-900'>Profile</h1>
          {/* <p className='text-slate-600 mt-1'>Manage your account information</p> */}
        </div>
        <div className='bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 animate-slideUp' style={{ animationDelay: '75ms', animationFillMode: 'backwards' }}>
          <div className='h-32 bg-linear-to-r from-blue-400 to-blue-700' />
          <div className='px-6 pb-6'>
            <div className='flex items-end -mt-16 mb-6'>
              <div className='w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center'>
                <div className='w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center'>
                  <span className='text-4xl font-bold text-blue-600'>{initials}</span>
                </div>
              </div>
            </div>
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1'>
                    Full Name
                  </label>
                  <p className='text-slate-900 font-medium'>{user.name}</p>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1'>
                    Email Address
                  </label>
                  <p className='text-slate-900 font-medium'>{user.email}</p>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1'>
                    Role
                  </label>
                  <p className='text-slate-900 font-medium'>{role}</p>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1'>
                    Account Status
                  </label>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <div className={`w-1.5 h-1.5 ${active ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                    {active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-lg border border-slate-200 p-6 mb-6 animate-slideUp' style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}>
          <h3 className='text-lg font-semibold text-slate-900 mb-4'>Activity Overview</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-slate-50 rounded-lg border border-slate-200'>
              <div className='text-2xl font-bold text-slate-900 mb-1'>{totalTasks}</div>
              <div className='text-xs text-slate-600'>Total Tasks</div>
            </div>
            <div className='text-center p-4 bg-amber-50 rounded-lg border border-amber-200'>
              <div className='text-2xl font-bold text-amber-600 mb-1'>{pendingTasks}</div>
              <div className='text-xs text-amber-700'>Pending</div>
            </div>
            <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200'>
              <div className='text-2xl font-bold text-green-600 mb-1'>{completedTasks}</div>
              <div className='text-xs text-green-700'>Completed</div>
            </div>
            <div className='text-center p-4 bg-red-50 rounded-lg border border-red-200'>
              <div className='text-2xl font-bold text-red-600 mb-1'>{overdueTasks}</div>
              <div className='text-xs text-red-700'>Overdue</div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg border border-slate-200 p-6 animate-slideUp' style={{ animationDelay: '225ms', animationFillMode: 'backwards' }}>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-semibold text-slate-900'>Completion Rate</h3>
              <span className='text-2xl font-bold text-blue-600'>
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
            <div className='w-full bg-slate-200 rounded-full h-2'>
              <div
                className='bg-blue-600 h-2 rounded-full transition-all duration-500'
                style={{ width: '0%' }}
                ref={(el) => {
                  if (el) setTimeout(() => { el.style.width = `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }, 50)
                }} />
            </div>
            <p className='text-xs text-slate-500 mt-2'>
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <div className='bg-white rounded-lg border border-slate-200 p-6 animate-slideUp' style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
            <h3 className='text-sm font-semibold text-slate-900 mb-4'>Performance</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-600'>Average response time</span>
                <span className='text-sm font-semibold text-slate-900'>{avgResTime} days</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-600'>Tasks this month</span>
                <span className='text-sm font-semibold text-slate-900'>{totalTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Profile