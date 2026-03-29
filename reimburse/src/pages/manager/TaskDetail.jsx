import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTasks } from '../../context/TaskContext'
import { toast } from 'react-toastify'
import Comments from '../../components/Comments'
import ActionConfirmModal from '../../components/ActionConfirmModal'
import { getAllUsers } from '../../data/userStore'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { FaArrowLeft, FaEye, FaRegCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { LuCalendar, LuClock4, LuTag } from 'react-icons/lu'
const TaskDetail = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, loadTasks } = useTasks()
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center'>
          <IoDocumentTextOutline
            size={60}
            className='mx-auto text-slate-300' />
          <h3 className='text-lg font-semibold text-slate-900 mb-2'>Task Not Found</h3>
          <p className='text-slate-500 mb-6'>The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer'>
            Back to Inbox
          </button>
        </div>
      </div>
    )
  }
  const updateStatus = async (newStatus, note) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error()
      if (note?.trim()) {
        const statusMap = {
          in_progress: 'Marked for Review',
          approved: 'Approve',
          rejected: 'Reject'
        }
        const commentStatus = statusMap[newStatus]
        await fetch(`http://localhost:3000/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: id,
            userName: getAllUsers().find(u => u.email === task.assignedTo)?.name,
            userEmail: task.assignedTo,
            message: `${commentStatus} — ${note}`,
            createdAt: new Date().toISOString()
          })
        })
      }
      loadTasks()
      toast.success('Task Updated')
      navigate('/')
    } catch {
      toast.error('Failed to Update Task')
    }
  }
  const today = new Date()
  const due = new Date(task.dueDate)
  const isOverdue = task.status === 'pending' && due < today
  const isDone = task.status !== 'pending'
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
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-6 animate-slideUp'>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex gap-1 items-center text-slate-600 hover:text-slate-400 transition mb-4 cursor-pointer'>
            <FaArrowLeft size={15} />
            <span className='font-medium'>Back</span>
          </button>
          <h1 className='text-2xl font-bold text-slate-900'>Task Details</h1>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6 lg:sticky lg:top-6 self-start animate-slideUp border border-slate-200 rounded-lg'>
            <div className='bg-white rounded-lg borde border-slate-200 overflow-hidden'>
              {isOverdue && (
                <div className='bg-red-600 text-white px-6 py-3 flex items-center gap-2'>
                  <FaTimesCircle size={15} />
                  <span className='font-semibold'>This task is overdue and requires immediate attention</span>
                </div>
              )}
              <div className='p-6 border-b border-slate-200'>
                <div className='flex items-start justify-between mb-4'>
                  <h2 className='text-2xl font-bold text-slate-900 flex-1'>{task.title}</h2>
                  <div className='flex items-center gap-2 ml-4'>
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${status.bg} ${status.text}`}>
                      {isOverdue ? 'Overdue' : status.label}
                    </span>
                  </div>
                </div>
                <p className='text-slate-600'>{task.description}</p>
              </div>
              <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Category
                  </label>
                  <div className='flex items-center gap-2'>
                    <LuTag
                      size={15}
                      className='text-slate-400' />
                    <span className='text-slate-900 font-medium'>{task.category}</span>
                  </div>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Priority
                  </label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md ${priority.bg} border ${priority.border}`}>
                    <div className={`w-2 h-2 rounded-full ${priority.dot}`}></div>
                    <span className={`text-sm font-medium ${priority.text} capitalize`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Due Date
                  </label>
                  <div className='flex items-center gap-2'>
                    <LuCalendar
                      size={15}
                      className='text-slate-400' />
                    <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-slate-900'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Submitted By
                  </label>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center'>
                      <span className='text-xs font-medium text-slate-600'>
                        {task.submittedBy.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className='text-slate-900 font-medium'>{task.submittedBy}</span>
                  </div>
                </div>
                <div className='md:col-span-2'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block'>
                    Submitted On
                  </label>
                  <div className='flex items-center gap-2'>
                    <LuClock4
                      size={15}
                      className='text-slate-400' />
                    <span className='text-slate-600'>{formatDate(task.submittedDate)}</span>
                  </div>
                </div>
              </div>
              {task.details && Object.keys(task.details).length > 0 && (
                <div className='p-6'>
                  <h3 className='text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4'>
                    Additional Details
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {Object.entries(task.details).map(([key, value]) => (
                      <div key={key} className='bg-white rounded-lg border border-slate-200 p-4'>
                        <label className='text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1'>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <span className='text-slate-900 font-medium'>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!isDone && (
                <div className='p-6'>
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <button
                      onClick={() => {
                        setSelectedAction('approved')
                        setModalOpen(true)
                      }}
                      className='flex-1 cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:scale-[0.98] transition-all duration-150'>
                      <FaRegCheckCircle
                        className='text-green-100'
                        size={20} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAction('in_progress')
                        setModalOpen(true)
                      }}
                      className='flex-1 cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all duration-150'>
                      <FaEye
                        size={20}
                        className='text-blue-100' />
                      <span>Mark for Review</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAction('rejected')
                        setModalOpen(true)
                      }}
                      className='flex-1 cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all duration-150'>
                      <FaTimesCircle
                        size={20}
                        className='text-red-100' />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='lg:col-span-1 animate-slideUp'>
            <Comments taskId={task.id} />
          </div>
        </div>
      </div>
      <ActionConfirmModal
        open={modalOpen}
        action={selectedAction}
        onCancel={() => setModalOpen(false)}
        onConfirm={(note) => {
          setModalOpen(false)
          updateStatus(selectedAction, note)
        }} />
    </div>
  )
}
export default TaskDetail