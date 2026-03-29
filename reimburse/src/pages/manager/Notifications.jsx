import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../../context/TaskContext'
import { FaRegArrowAltCircleRight, FaRegCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { IoNotificationsOutline, IoWarning } from 'react-icons/io5'
import { LuCalendar } from 'react-icons/lu'
const Notifications = () => {
  const { notifications, readIds, markRead, markAllRead } = useTasks()
  const navigate = useNavigate()
  const handleClick = (n) => {
    markRead(n.id)
    navigate(`/task/${n.taskId}`)
  }
  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation()
    markRead(notificationId)
  }
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue':
        return (
          <FaTimesCircle size={20} />
        )
      case 'dueSoon':
        return (
          <IoWarning size={25} />
        )
      default:
        return (
          <IoNotificationsOutline size={20} />
        )
    }
  }
  const getNotificationStyle = (type, isRead) => {
    const baseStyle = 'transition'
    if (isRead) {
      return `bg-white border-slate-200 opacity-60 ${baseStyle}`
    }
    switch (type) {
      case 'overdue':
        return `bg-red-50 border-red-200 ${baseStyle}`
      case 'dueSoon':
        return `bg-amber-50 border-amber-200 ${baseStyle}`
      default:
        return `bg-blue-50 border-blue-200 ${baseStyle}`
    }
  }
  const getIconStyle = (type, isRead) => {
    if (isRead) return 'bg-slate-100 text-slate-400'
    switch (type) {
      case 'overdue':
        return 'bg-red-100 text-red-600'
      case 'dueSoon':
        return 'bg-amber-100 text-amber-600'
      default:
        return 'bg-blue-100 text-blue-600'
    }
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8'>
        <div className='mb-8 animate-slideUp'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-slate-900'>Notifications</h1>
              <p className='text-slate-600 mt-1'>
                {notifications.length > 0
                  ? `${unreadCount} unread of ${notifications.length} total`
                  : 'No notifications at this time'}
              </p>
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium cursor-pointer transition-all'>
                <FaRegCheckCircle size={15} />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>
        <div className='space-y-3'>
          {notifications.length > 0 && unreadCount === 0 && (
            <div className='mb-6 bg-green-50 border border-green-200 rounded-lg p-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                  <FaRegCheckCircle
                    size={20}
                    className='text-green-600' />
                </div>
                <div>
                  <p className='text-sm font-semibold text-green-900'>All caught up!</p>
                  <p className='text-xs text-green-700'>You've read all your notifications.</p>
                </div>
              </div>
            </div>
          )}
          {notifications.map((n, index) => {
            const isRead = readIds.has(n.id)
            return (
              <div
                key={n.id}
                className={`border rounded-lg hover:shadow-md hover:border-slate-300 hover:scale-[1.01] transition-all duration-200 animate-slideInFromBottom ${getNotificationStyle(n.type, isRead)}`}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
                <div className='p-4'>
                  <div className='flex items-start gap-4'>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconStyle(n.type, isRead)}`}>
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className={`text-sm ${isRead ? 'text-slate-500' : 'text-slate-900 font-medium'}`}>
                        {n.message}
                      </p>
                      <div className='flex items-center gap-4 mt-2'>
                        <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                          <LuCalendar size={13} />
                          <span>Due: {formatDate(n.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {!isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(e, n.id)}
                          className='cursor-pointer p-2 text-slate-400 rounded-lg'>
                          <FaRegCheckCircle size={18} />
                        </button>
                      )}
                      <button
                        className='cursor-pointer p-2 text-slate-400 rounded-lg'
                        onClick={() => handleClick(n)}>
                        <FaRegArrowAltCircleRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {notifications.length === 0 && (
          <div className='bg-white rounded-lg border border-slate-200 p-12 text-center animate-slideUp'>
            <div className='max-w-sm mx-auto'>
              <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <IoNotificationsOutline
                  size={40}
                  className='text-slate-400' />
              </div>
              <h3 className='text-lg font-semibold text-slate-900 mb-2'>No notifications</h3>
              <p className='text-slate-500'>
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Notifications