import React, { useState, useEffect } from 'react'
import { FaEye, FaRegCheckCircle, FaTimesCircle } from 'react-icons/fa'
const ActionConfirmModal = ({ open, action, onCancel, onConfirm }) => {
  const [note, setNote] = useState('')
  useEffect(() => {
    if (!open) {
      setNote('')
    }
  }, [open])
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onCancel])
  if (!open) return null
  const actionConfig = {
    approved: {
      title: 'Approve Task',
      message: 'Are you sure you want to approve this task?',
      icon: (
        <FaRegCheckCircle size={23} />
      ),
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      confirmButton: 'bg-green-600 cursor-pointer hover:bg-green-700',
      confirmText: 'Approve'
    },
    rejected: {
      title: 'Reject Task',
      message: 'Are you sure you want to reject this task?',
      icon: (
        <FaTimesCircle size={23} />
      ),
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmButton: 'bg-red-600 cursor-pointer hover:bg-red-700',
      confirmText: 'Reject'
    },
    in_progress: {
      title: 'Mark for Review',
      message: 'Mark this task as in progress for review?',
      icon: (
        <FaEye size={23} />
      ),
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      confirmButton: 'bg-blue-600 cursor-pointer hover:bg-blue-700',
      confirmText: 'Mark for Review'
    }
  }
  const config = actionConfig[action] || actionConfig.in_progress
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn'>
      <div
        className='absolute inset-0'
        onClick={onCancel} />
      <div className='relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp'>
        <div className='p-6 pb-4'>
          <div className='flex items-center gap-4'>
            <div className={` w-12 h-12 rounded-full ${config.iconBg} ${config.iconColor} flex items-center justify-center`}>
              {config.icon}
            </div>
            <div className='flex-1 min-w-0'>
              <h2 className='text-xl font-bold text-slate-900 mb-1'>
                {config.title}
              </h2>
              <p className='text-sm text-slate-600'>
                {config.message}
              </p>
            </div>
          </div>
        </div>
        <div className='px-6 pb-6'>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Add a note (optional)
          </label>
          <textarea
            placeholder='Provide additional context or feedback...'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className='w-full px-4 py-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
            rows={4}
            autoFocus />
        </div>
        <div className='px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition cursor-pointer'>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note)}
            className={`px-6 py-2 text-white font-semibold rounded-lg transition ${config.confirmButton}`}>
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
export default ActionConfirmModal