import React, { useState } from 'react'
import { useTasks } from '../../context/TaskContext'
import { useData } from '../../context/DataContext'
import TaskCard from '../../components/TaskCard'
import { MdRefresh } from 'react-icons/md'
import { HiSortDescending } from 'react-icons/hi'
import { LuInbox, LuTag } from 'react-icons/lu'
import { FaRegCheckCircle } from 'react-icons/fa'
import { IoWarningOutline } from 'react-icons/io5'
const Inbox = () => {
  const { loadTasks, loading } = useTasks()
  const { sortMode, setSortMode, filters, setFilters, statuses, categories, priorities, processedTasks } = useData()
  const handleReset = () => {
    setFilters({
      category: 'all',
      status: 'all',
      priority: 'all'
    })
  }
  const activeFiltersCount = (filters.category !== 'all' ? 1 : 0) + (filters.status !== 'all' ? 1 : 0) + (filters.priority !== 'all' ? 1 : 0)
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 animate-slideUp'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-2xl font-bold text-slate-900'>Task Inbox</h1>
            </div>
            <button
              onClick={() => loadTasks()}
              disabled={loading}
              className='flex cursor-pointer disabled:cursor-not-allowed items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 disabled:opacity-50'>
              <MdRefresh
                className={`text-slate-600 ${loading ? 'animate-spin' : ''}`}
                size={18} />
              <span className='text-sm font-medium text-slate-700'>Refresh</span>
            </button>
          </div>
          <div className='bg-white rounded-lg border border-slate-200 p-4'>
            <div className='flex flex-col lg:flex-row gap-3'>
              <div className='flex items-center space-x-2 flex-1'>
                <HiSortDescending
                  size={18}
                  className='text-slate-400' />
                <select
                  value={sortMode}
                  onChange={e => setSortMode(e.target.value)}
                  className='flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition'>
                  <option value='due'>Sort by Due Date</option>
                  <option value='priority'>Sort by Priority</option>
                </select>
              </div>
              <div className='flex items-center space-x-2 flex-1'>
                <LuTag
                  size={18}
                  className='text-slate-400' />
                <select
                  value={filters.category}
                  onChange={e => setFilters({ ...filters, category: e.target.value })}
                  className='flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition'>
                  <option value='all'>All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className='flex items-center space-x-2 flex-1'>
                <FaRegCheckCircle
                  size={18}
                  className='text-slate-400' />
                <select
                  value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}
                  className='flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition'>
                  <option value='all'>All Statuses</option>
                  {statuses.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className='flex items-center space-x-2 flex-1'>
                <IoWarningOutline
                  size={18}
                  className='text-slate-400' />
                <select
                  value={filters.priority}
                  onChange={e => setFilters({ ...filters, priority: e.target.value })}
                  className='flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition'>
                  <option value='all'>All Priorities</option>
                  {priorities.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleReset}
                  className='px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-200 bg-slate-100 border border-slate-200 rounded-md transition-all'>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
        <div className='space-y-8'>
          {Object.entries(processedTasks).map(([category, items]) => (
            <div key={category}>
              <div className='flex items-center mb-4'>
                <h2 className='text-lg font-semibold text-slate-900'>{category}</h2>
                <span className='ml-3 px-2.5 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-full'>
                  {items.length}
                </span>
              </div>
              <div className='space-y-3'>
                {items.map((t, i) => (
                  <TaskCard key={t.id} task={t} index={i} />
                ))}
              </div>
            </div>
          ))}
          {Object.keys(processedTasks).length === 0 && (
            <div className='bg-white rounded-lg border border-slate-200 p-12 text-center animate-slideUp'>
              <div className='max-w-sm mx-auto'>
                <LuInbox
                  size={80}
                  className=' text-slate-300 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-slate-900 mb-2'>No tasks found</h3>
                <p className='text-slate-500 mb-6'>
                  {activeFiltersCount > 0
                    ? 'Try adjusting your filters to see more tasks.'
                    : 'Your inbox is empty. New tasks will appear here.'}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleReset}
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium cursor-pointer'>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Inbox