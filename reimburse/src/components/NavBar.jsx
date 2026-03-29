import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'
import { LuInbox } from 'react-icons/lu'
import { BsBarChart } from 'react-icons/bs'
import { IoNotificationsOutline, IoPersonOutline } from 'react-icons/io5'
import { FaCaretDown } from 'react-icons/fa'
import { PiSignOut } from 'react-icons/pi'
import { RxHamburgerMenu } from 'react-icons/rx'
const NavBar = () => {
  const { user, logout } = useAuth()
  const { unreadCount } = useTasks()
  const navigate = useNavigate()
  const [mobileView, setMobileView] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const currentPage = ({ isActive }) =>
    isActive
      ? 'flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md transition'
      : 'flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md active:scale-[0.98] transition-all duration-150'
  return (
    <nav className='bg-white border-b border-slate-200 sticky top-0 z-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <h1 className='text-xl font-bold text-indigo-600 cursor-not-allowed'>TaskFlow</h1>
          <div className='hidden md:flex items-center space-x-1'>
            <NavLink to='/' className={currentPage}>
              <LuInbox size={18} />
              <span className='ml-2'>Inbox</span>
            </NavLink>
            <NavLink to='/dashboard' className={currentPage}>
              <BsBarChart size={18} />
              <span className='ml-2'>Dashboard</span>
            </NavLink>
            <NavLink to='/notifications' className={currentPage}>
              <IoNotificationsOutline size={18} />
              <span className='ml-2'>Notifications</span>
              {unreadCount > 0 && (
                <span className='relative ml-2 flex size-4 items-center justify-center text-red-400 text-sm'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-75' />
                  <span className='relative animate-bounce-once'>{unreadCount}</span>
                </span>
              )}
            </NavLink>
          </div>
          <div className='hidden md:flex items-center space-x-3'>
            <div className='relative'>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className='flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer active:scale-[0.98] transition-all duration-150'>
                <div className='w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-medium text-slate-600'>
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className='text-sm font-medium text-slate-700'>{user?.name}</span>
                <FaCaretDown
                  className={`text-slate-400 transition ${showProfileMenu ? 'rotate-180' : ''}`}
                  size={18} />
              </button>
              {showProfileMenu && (
                <>
                  <div
                    className='fixed inset-0 z-10 cursor-pointer'
                    onClick={() => setShowProfileMenu(false)} />
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-20'>
                    <NavLink
                      to='/profile'
                      onClick={() => setShowProfileMenu(false)}
                      className='block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all duration-150'>
                      <div className='flex items-center space-x-2'>
                        <IoPersonOutline size={18} />
                        <span>Profile</span>
                      </div>
                    </NavLink>
                    <div className='border-t border-slate-200 my-1' />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        handleLogout()
                      }}
                      className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all duration-150 cursor-pointer'>
                      <div className='flex items-center space-x-2'>
                        <PiSignOut size={18} />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setMobileView(!mobileView)}
              className='p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition relative'>
              {(unreadCount > 0 && !mobileView) && (
                <span className='absolute flex top-1 right-0 size-2.5'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-75' />
                  <span className='relative inline-flex size-2.5 rounded-full bg-red-400' />
                </span>
              )}
              <RxHamburgerMenu
                size={20}
                className={`transition ${mobileView ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      {mobileView && (
        <div className='md:hidden border-t border-slate-200 bg-white'>
          <div className='px-4 py-3 space-y-1'>
            <NavLink
              to='/'
              className={currentPage}
              onClick={() => setMobileView(false)}>
              <LuInbox size={18} />
              <span className='ml-2'>Inbox</span>
            </NavLink>
            <NavLink
              to='/dashboard'
              end
              className={currentPage}
              onClick={() => setMobileView(false)}>
              <BsBarChart size={18} />
              <span className='ml-2'>Dashboard</span>
            </NavLink>
            <NavLink
              to='/notifications'
              className={currentPage}
              onClick={() => setMobileView(false)}>
              <IoNotificationsOutline size={18} />
              <span className='ml-2'>Notifications</span>
              {unreadCount > 0 && (
                <span className='relative ml-2 flex size-4 items-center justify-center text-red-400 text-sm'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-75' />
                  <span className='relative animate-bounce-once'>{unreadCount}</span>
                </span>
              )}
            </NavLink>
            <div className='border-t border-slate-200 my-2' />
            <NavLink
              to='/profile'
              className='flex items-center space-x-2 p-2 text-sm font-medium text-slate-600'
              onClick={() => setMobileView(false)}>
              <div className='w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center'>
                <span className='text-sm font-medium text-slate-600'>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{user?.name}</span>
            </NavLink>
            <button
              onClick={() => {
                setMobileView(false)
                handleLogout()
              }}
              className='w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600'>
              <PiSignOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
export default NavBar