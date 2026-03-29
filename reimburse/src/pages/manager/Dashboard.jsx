import React from 'react'
import Stats from '../../components/Stats'
import { useData } from '../../context/DataContext'
import { LuCalendar, LuClipboard, LuClock4 } from 'react-icons/lu'
import { IoWarningOutline } from 'react-icons/io5'
import { FaRegCheckCircle } from 'react-icons/fa'
const Dashboard = () => {
  const { totalTasks, overdueTasks, pendingTasks, completedTasks, highPriority, lowPriority, mediumPriority, dueSoon } = useData()
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-slideUp'>
          <h1 className='text-2xl font-bold text-slate-900'>Dashboard</h1>
          {/* <p className='text-slate-600 mt-1'>Overview of your tasks and activities</p> */}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Stats
            title='Total Tasks'
            value={totalTasks}
            icon={
              <LuClipboard size={25} />
            }
            color='blue'
            index={0} />
          <Stats
            title='Overdue'
            value={overdueTasks}
            icon={
              <IoWarningOutline size={25} />
            }
            color='red'
            subtitle='Needs attention'
            index={1} />
          <Stats
            title='Pending'
            value={pendingTasks}
            icon={
              <LuClock4 size={25} />
            }
            color='amber'
            subtitle='Awaiting action'
            index={2} />
          <Stats
            title='Completed'
            value={completedTasks}
            icon={
              <FaRegCheckCircle size={25} />
            }
            color='green'
            index={3} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg border border-slate-200 p-6 animate-slideUp' style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Due Task Priority Breakdown</h2>
            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-slate-700'>High Priority</span>
                  </div>
                  <span className='text-sm font-semibold text-slate-900'>{highPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-red-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: '0%' }}
                    ref={(el) => {
                      if (el) setTimeout(() => { el.style.width = `${pendingTasks > 0 ? (highPriority / pendingTasks) * 100 : 0}%` }, 50)
                    }} />
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-slate-700'>Medium Priority</span>
                  </div>
                  <span className='text-sm font-semibold text-slate-900'>{mediumPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-amber-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: '0%' }}
                    ref={(el) => {
                      if (el) setTimeout(() => { el.style.width = `${pendingTasks > 0 ? (mediumPriority / pendingTasks) * 100 : 0}%` }, 100)
                    }} />
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-slate-700'>Low Priority</span>
                  </div>
                  <span className='text-sm font-semibold text-slate-900'>{lowPriority}</span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: '0%' }}
                    ref={(el) => {
                      if (el) setTimeout(() => { el.style.width = `${pendingTasks > 0 ? (lowPriority / pendingTasks) * 100 : 0}%` }, 150)
                    }} />
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg border border-slate-200 p-6 animate-slideUp' style={{ animationDelay: '375ms', animationFillMode: 'backwards' }}>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Quick Insights</h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
                <IoWarningOutline
                  size={35}
                  className='text-amber-600' />
                <div>
                  <p className='text-sm font-semibold text-amber-900'>{dueSoon} tasks due soon</p>
                  <p className='text-xs text-amber-700 mt-0.5'>Due within the next 3 days</p>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <LuCalendar
                  size={35}
                  className='text-blue-600' />
                <div>
                  <p className='text-sm font-semibold text-blue-900'>Completion Rate</p>
                  <p className='text-xs text-blue-700 mt-0.5'>
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% of all tasks completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard