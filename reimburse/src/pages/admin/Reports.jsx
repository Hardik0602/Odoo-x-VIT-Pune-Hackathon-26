import React from 'react'
import { useData } from '../../context/DataContext'
import { LuClipboard, LuClock4 } from 'react-icons/lu'
import { IoWarningOutline } from 'react-icons/io5'
import { FaRegCheckCircle } from 'react-icons/fa'
import Stats from '../../components/Stats'
const Reports = () => {
  const { totalTasks, completedTasks, pendingTasks, overdueTasks, lowPriority, highPriority, mediumPriority } = useData()
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-slate-900'>Reports & Analytics</h1>
          {/* <p className='text-slate-600 mt-1'>Performance and task analytics</p> */}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Stats
            title='Total Tasks'
            value={totalTasks}
            icon={<LuClipboard size={25} />}
            color='blue'
            subtitle='All tasks in the system' />
          <Stats
            title='Completed'
            value={completedTasks}
            icon={<FaRegCheckCircle size={25} />}
            color='green'
            subtitle={`Completion rate: ${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`} />
          <Stats
            title='Pending'
            value={pendingTasks}
            icon={<LuClock4 size={25} />}
            color='amber'
            subtitle='Tasks awaiting action' />
          <Stats
            title='Overdue'
            value={overdueTasks}
            icon={<IoWarningOutline size={25} />}
            color='red'
            subtitle='Pending tasks past due date' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='bg-white rounded-lg border border-slate-200 p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Due Task Priority Breakdown</h2>
            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-slate-700'>High Priority</span>
                  <span className='text-sm font-semibold text-slate-900'>{highPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-red-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${pendingTasks > 0 ? (highPriority / pendingTasks) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-slate-700'>Medium Priority</span>
                  <span className='text-sm font-semibold text-slate-900'>{mediumPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-amber-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${pendingTasks > 0 ? (mediumPriority / pendingTasks) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-slate-700'>Low Priority</span>
                  <span className='text-sm font-semibold text-slate-900'>{lowPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${pendingTasks > 0 ? (lowPriority / pendingTasks) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg border border-slate-200 p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Weekly Performance</h2>
            <div className='space-y-4'>
              <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='text-sm font-semibold text-blue-900 mb-1'>Completion Rate</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </p>
                <p className='text-xs text-blue-700 mt-1'>Overall system performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Reports