import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoAlertCircleSharp, IoPersonOutline } from 'react-icons/io5'
import { LuCalendar, LuClock4 } from 'react-icons/lu'
const TaskCard = ({ task, index = 0 }) => {
  const navigate = useNavigate()
  const priorityConfig = {
    high: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-500'
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500'
    },
    low: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500'
    }
  }
  const statusConfig = {
    pending: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      label: 'Pending'
    },
    in_progress: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'In Progress'
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Approved'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Rejected'
    }
  }
  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const status = statusConfig[task.status] || statusConfig.pending
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  const getDueDateDisplay = () => {
    if (task.overdue) {
      return {
        text: 'Overdue',
        class: 'text-red-600 font-semibold'
      }
    } else if (diffDays === 0) {
      return {
        text: 'Due Today',
        class: 'text-amber-600 font-semibold'
      }
    } else if (diffDays === 1) {
      return {
        text: 'Due Tomorrow',
        class: 'text-amber-600 font-medium'
      }
    } else if (diffDays > 0 && diffDays <= 2) {
      return {
        text: `Due in ${diffDays} days`,
        class: 'text-slate-600'
      }
    } else {
      return {
        text: formatDate(task.dueDate),
        class: 'text-slate-500'
      }
    }
  }
  const dueDateInfo = getDueDateDisplay()
  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className={`bg-white border border-slate-200 rounded-lg p-5 cursor-pointer hover:shadow-md hover:border-slate-300 hover:scale-[1.01] transition-all duration-200 animate-slideInFromBottom ${task.overdue ? 'ring-2 ring-red-200' : ''}`}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1 min-w-0 pr-4'>
          <h3 className='font-semibold text-slate-900 text-base mb-1 truncate'>
            {task.title}
          </h3>
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700'>
              {task.category}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${priority.bg} border ${priority.border}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></div>
          <span className={`text-xs font-medium ${priority.text} capitalize`}>
            {task.priority}
          </span>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
        <div className='flex items-center gap-2'>
          <LuCalendar
            className={dueDateInfo.class}
            size={15} />
          <span className={dueDateInfo.class}>{dueDateInfo.text}</span>
        </div>
        <div className='flex items-center gap-2'>
          <IoPersonOutline
            className='text-slate-400'
            size={15} />
          <span className='text-slate-600 truncate'>{task.submittedBy}</span>
        </div>
        <div className='flex items-center gap-2 col-span-2'>
          <LuClock4
            className='text-slate-400'
            size={15} />
          <span className='text-slate-500'>
            Submitted on {formatDate(task.submittedDate)}
          </span>
        </div>
      </div>
      {task.overdue && (
        <div className='mt-3 pt-3 border-t border-red-100'>
          <div className='flex items-center gap-2 text-red-600'>
            <IoAlertCircleSharp size={18} />
            <span className='text-sm font-medium'>Action Required - This task is overdue</span>
          </div>
        </div>
      )}
    </div>
  )
}
export default TaskCard