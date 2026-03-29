import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BsPeople } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { LuClock4 } from 'react-icons/lu'
import { FaRegArrowAltCircleRight } from 'react-icons/fa'
import { MdRefresh } from 'react-icons/md'
import { useTasks } from '../../context/TaskContext'
import { useData } from '../../context/DataContext'
const AdminDashboard = () => {
  const { loading, loadTasks } = useTasks()
  const { totalUsers, admins, managers, overdueTasks, pendingTasks } = useData()
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-slate-900'>Admin Dashboard</h1>
              {/* <p className='text-slate-600 mt-1'>Overview of users and task load</p> */}
            </div>
            <button
              onClick={() => loadTasks()}
              disabled={loading}
              className='flex cursor-pointer disabled:cursor-not-allowed items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition disabled:opacity-50'>
              <MdRefresh
                className={`text-slate-600 ${loading ? 'animate-spin' : ''}`}
                size={18} />
              <span className='text-sm font-medium text-slate-700'>Refresh</span>
            </button>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg border border-slate-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-bold text-slate-600 mb-1'>Total Users</p>
                <p className='text-3xl font-bold text-purple-600'>{totalUsers}</p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <BsPeople
                  className='text-purple-600'
                  size={25} />
              </div>
            </div>
            <div className='mt-4 pt-4 border-t border-slate-200'>
              <div className='flex justify-between text-xs'>
                <span className='text-slate-600 font-semibold'>Managers: {managers}</span>
                <span className='text-slate-600 font-semibold'>Admins: {admins}</span>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg border border-slate-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-bold text-slate-600 mb-1'>Pending Tasks</p>
                <p className='text-3xl font-bold text-amber-600'>
                  {pendingTasks}
                </p>
              </div>
              <div className='w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center'>
                <LuClock4
                  className='text-amber-600'
                  size={25} />
              </div>
            </div>
            <div className='mt-4 pt-4 border-t border-slate-200'>
              <p className='text-xs text-slate-600 font-semibold'>Awaiting action across all users</p>
            </div>
          </div>
          <div className='bg-white rounded-lg border border-slate-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-bold text-slate-600 mb-1'>Overdue Tasks</p>
                <p className='text-3xl font-bold text-red-600'>
                  {overdueTasks}
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center'>
                <IoWarningOutline
                  className='text-red-600'
                  size={25} />
              </div>
            </div>
            <div className='mt-4 pt-4 border-t border-slate-200'>
              <p className='text-xs text-slate-600 font-semibold'>Needs attention across all users</p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-6'>
          <div className='bg-white rounded-lg border border-slate-200 p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Quick Actions</h2>
            <div className='space-y-3'>
              <button
                className='w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition'
                onClick={() => navigate('/admin/users')}>
                <div className='flex items-center justify-between'>
                  <span className='text-md font-medium text-purple-900'>Assign Task</span>
                  <FaRegArrowAltCircleRight
                    className='text-purple-600'
                    size={20} />
                </div>
              </button>
              <button
                className='w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition'
                onClick={() => navigate('/admin/reports')}>
                <div className='flex items-center justify-between'>
                  <span className='text-md font-medium text-blue-900'>View Report</span>
                  <FaRegArrowAltCircleRight
                    className='text-blue-600'
                    size={20} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminDashboard