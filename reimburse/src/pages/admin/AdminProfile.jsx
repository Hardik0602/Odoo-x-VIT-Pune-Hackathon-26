import React from 'react'
import { useAuth } from '../../context/AuthContext'
const AdminProfile = () => {
  const active = false
  const { user } = useAuth()
  const role = user.role.charAt(0).toUpperCase() + user.role.slice(1)
  const initials = user.name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-slate-900'>Admin Profile</h1>
          {/* <p className='text-slate-600 mt-1'>Admin account information</p> */}
        </div>
        <div className='bg-white rounded-lg border border-slate-200 overflow-hidden mb-6'>
          <div className='h-32 bg-linear-to-r from-blue-700 to-blue-400' />
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
        <div className='bg-white rounded-lg border border-slate-200 p-6 mb-6'>
          <h3 className='text-lg font-semibold text-slate-900 mb-4'>Admin Privileges</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm font-semibold text-blue-900 mb-1'>User Management</p>
              <p className='text-xs text-blue-700'>Full access to manage system users</p>
            </div>
            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm font-semibold text-blue-900 mb-1'>Reports & Analytics</p>
              <p className='text-xs text-blue-700'>Access to all system reports</p>
            </div>
            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-sm font-semibold text-blue-900 mb-1'>Task Management</p>
              <p className='text-xs text-blue-700'>Access to assign tasks to system users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminProfile