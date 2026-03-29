import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FaCircleNotch, FaRegCommentDots } from 'react-icons/fa'
import { VscSend } from 'react-icons/vsc'
const Comments = ({ taskId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCommentId, setNewCommentId] = useState(null)
  const loadComments = () => {
    fetch(`http://localhost:3000/comments?taskId=${taskId}`)
      .then(res => res.json())
      .then(data => {
        setComments(data)
        setLoading(false)
      })
  }
  useEffect(() => {
    loadComments()
  }, [taskId])
  const addComment = async () => {
    if (!text.trim()) return
    setIsSubmitting(true)
    try {
      await fetch(`http://localhost:3000/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userName: user.name,
          userEmail: user.email,
          message: text.trim(),
          createdAt: new Date().toISOString()
        })
      })
      setText('')
      setIsSubmitting(false)
      const res = await fetch(`http://localhost:3000/comments?taskId=${taskId}&_sort=id&_order=desc&_limit=1`)
      const newComment = await res.json()
      if (newComment.length > 0) {
        setNewCommentId(newComment[0].id)
        setTimeout(() => setNewCommentId(null), 500)
      }
      loadComments()
      toast.success('Comment Added')
    } catch {
      setIsSubmitting(false)
      toast.error('Failed to Add Comment')
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addComment()
    }
  }
  const formatTimestamp = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
  return (
    <div className='bg-white rounded-lg border border-slate-200 flex flex-col lg:top-24'>
      <div className='p-4 border-b border-slate-200'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-slate-900'>Comments</h2>
          <span className='px-2.5 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-full'>
            {comments.length}
          </span>
        </div>
      </div>
      <div className='p-4 border-t border-slate-200 bg-slate-50'>
        <div className='flex items-center gap-2'>
          <div className=' w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm'>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className='flex-1'>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Write a comment...'
              rows={1}
              disabled={isSubmitting}
              className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-slate-100 disabled:cursor-not-allowed'
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }} />
          </div>
          <button
            onClick={addComment}
            disabled={!text.trim() || isSubmitting}
            className='w-10 cursor-pointer h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center active:scale-[0.98] transition-all duration-150'>
            {isSubmitting ? (
              <FaCircleNotch
                size={20}
                className='animate-spin' />
            ) : (
              <VscSend size={20} />
            )}
          </button>
        </div>
        <p className='text-xs text-slate-500 mt-2'>Press Enter to send, Shift + Enter for new line</p>
      </div>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {loading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='flex flex-col items-center gap-2'>
              <FaCircleNotch
                size={35}
                className='animate-spin text-slate-400' />
              <p className='text-sm text-slate-500'>Loading comments...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3'>
              <FaRegCommentDots
                size={25}
                className='text-slate-400' />
            </div>
            <h3 className='text-sm font-semibold text-slate-900 mb-1'>No comments yet</h3>
          </div>
        ) : (
          [...comments].reverse().map((c, index) => {
            const isCurrentUser = c.userEmail === user.email
            return (
              <div
                key={c.id}
                className={`group animate-slideInFromBottom ${index !== comments.length - 1 ? 'pb-4 border-b border-slate-100' : ''}`}
                style={newCommentId === c.id ? { animation: 'slideInFromBottom 0.3s ease-out' } : {}}>
                <div className='flex gap-3'>
                  {/* Avatar */}
                  <div className={` w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${isCurrentUser
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-200 text-slate-600'
                    }`}>
                    {c.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-sm font-semibold text-slate-900'>
                        {c.userName}
                        {isCurrentUser && (
                          <span className='ml-1.5 text-xs font-normal text-slate-500'>(You)</span>
                        )}
                      </span>
                      <span className='text-xs text-slate-400'>•</span>
                      <span className='text-xs text-slate-500' title={new Date(c.createdAt).toLocaleString()}>
                        {formatTimestamp(c.createdAt)}
                      </span>
                    </div>
                    <p className='text-sm text-slate-700 leading-relaxed wrap-break-words whitespace-pre-wrap'>
                      {c.message}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
export default Comments