import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FaArrowLeft, FaCaretDown, FaCircleNotch } from 'react-icons/fa'
const CATEGORY_OPTIONS = [
  'Expense Approval',
  'Document Review',
  'Leave Request',
  'Finance',
  'Access Request',
  'IT Support'
]
const PRIORITY_OPTIONS = ['low', 'medium', 'high']
const TaskAssign = () => {
  const { email } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { users } = useData()
  const assignee = users.find(u => u.email === email).name
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('low')
  const [submittedBy, setSubmittedBy] = useState(user?.name)
  const [submittedDate, setSubmittedDate] = useState(new Date().toISOString().slice(0, 10))
  const [dueDate, setDueDate] = useState('')
  const [detailsRows, setDetailsRows] = useState([{ key: '', value: '' }])
  const [submitting, setSubmitting] = useState(false)
  const handleAddDetailRow = () => {
    setDetailsRows(prev => [...prev, { key: '', value: '' }])
  }
  const handleDetailChange = (index, field, value) => {
    setDetailsRows(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }
  const handleRemoveDetailRow = (index) => {
    setDetailsRows(prev => prev.filter((_, i) => i !== index))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !category || !priority || !dueDate) {
      toast.error('fill all required fields')
      return
    }
    let isValid = true
    const detailsObject = {}
    detailsRows.forEach(row => {
      const key = row.key.trim()
      const value = row.value.trim()
      if ((key && !value) || (!key && value)) {
        isValid = false
      }
      if (key && value) {
        detailsObject[key] = value
      }
    })
    if (!isValid) {
      toast.error('additional detail must have both field name and value')
      return
    }
    const newTask = {
      id: `task-${Date.now()}`,
      title: `${category} - ${title.trim()}`,
      description: description.trim(),
      category,
      status: 'pending',
      priority,
      assignedTo: email,
      submittedBy,
      submittedDate,
      dueDate,
      details: Object.keys(detailsObject).length ? detailsObject : {}
    }
    try {
      setSubmitting(true)
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
      if (!res.ok) throw new Error()
      toast.success('assigned successfully')
      navigate('/admin/users')
    } catch {
      toast.error('something went wrong')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8'>
        <div className='mb-8'>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex gap-1 items-center text-slate-600 hover:text-slate-400 transition mb-4'>
            <FaArrowLeft size={15} />
            <span className='font-medium'>Back</span>
          </button>
          <h1 className='text-3xl font-bold text-slate-900'>Assign New Task</h1>
        </div>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <span className='text-lg font-semibold text-blue-700'>
                {assignee.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className='text-sm font-semibold text-blue-900 mb-1'>
                Assigning to: {assignee}
              </p>
              <p className='text-xs text-blue-700'>{email}</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-lg border border-slate-200'>
          <form onSubmit={handleSubmit}>
            <div className='p-6 space-y-6'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900 mb-4'>Task Information</h2>
                <div className='mb-5'>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Task Title
                  </label>
                  <input
                    type='text'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition'
                    placeholder='e.g. Mumbai Trip'
                    required />
                </div>
                <div className='mb-5'>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    required
                    onChange={e => setDescription(e.target.value)}
                    className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none transition'
                    placeholder='Provide additional context or instructions for this task...' />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Category
                    </label>
                    <div className='relative'>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer transition'
                        required>
                        <option value=''>Select a category</option>
                        {CATEGORY_OPTIONS.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <FaCaretDown
                        className='absolute right-3 top-3 text-slate-400 pointer-events-none'
                        size={20} />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Priority
                    </label>
                    <div className='relative'>
                      <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer transition'
                        required>
                        {PRIORITY_OPTIONS.map(option => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                      <FaCaretDown
                        className='absolute right-3 top-3 text-slate-400 pointer-events-none'
                        size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='px-6 pb-6 space-y-6'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900 mb-4'>Timeline & Assignment</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Submitted By
                    </label>
                    <input
                      type='text'
                      value={submittedBy}
                      onChange={e => setSubmittedBy(e.target.value)}
                      className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition'
                      placeholder='Name of Owner' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Submitted Date
                    </label>
                    <input
                      type='date'
                      value={submittedDate}
                      onChange={e => setSubmittedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Due Date
                    </label>
                    <input
                      type='date'
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                      min={submittedDate}
                      className='w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition'
                      required />
                  </div>
                </div>
              </div>
            </div>
            <div className='px-6 pb-6'>
              <div className='bg-slate-50 rounded-lg border border-slate-200 p-5'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-slate-900'>Additional Details</h2>
                  <span className='text-xs text-slate-500'>Optional</span>
                </div>
                <p className='text-sm text-slate-600 mb-4'>
                  Add custom fields specific to this task (e.g., Amount, Location)
                </p>
                <div className='space-y-3'>
                  {detailsRows.map((row, index) => (
                    <div key={index} className='flex flex-col sm:flex-row gap-3'>
                      <input
                        type='text'
                        value={row.key}
                        onChange={e => handleDetailChange(index, 'key', e.target.value)}
                        placeholder='Field name (e.g., Amount)'
                        className='flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm' />
                      <input
                        type='text'
                        value={row.value}
                        onChange={e => handleDetailChange(index, 'value', e.target.value)}
                        placeholder='Value (e.g. 1500 INR)'
                        className='flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm' />
                      {detailsRows.length > 1 && (
                        <button
                          type='button'
                          onClick={() => handleRemoveDetailRow(index)}
                          className='sm:w-auto w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition'>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type='button'
                  onClick={handleAddDetailRow}
                  className='mt-3 text-sm font-medium text-blue-600 hover:text-blue-200 transition'>
                  Add Another Field
                </button>
              </div>
            </div>
            <div className='px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-200 transition'>
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2'>
                {submitting ? (
                  <>
                    <FaCircleNotch
                      size={16}
                      className='animate-spin -ml-1 mr-2' />
                    <span>Assigning Task...</span>
                  </>
                ) : (
                  <span>Assign Task</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default TaskAssign