import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'
import Notification from '../helper/Notification'
const TaskContext = createContext()
export function TaskProvider({ children }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState(new Set())
  const loadTasks = async () => {
    if (!user) return
    setLoading(true)
    if (user.role === 'manager') {
      try {
        const res = await fetch(`http://localhost:3000/tasks?assignedTo=${user.email}`)
        const data = await res.json()
        setTasks(data)
      } catch (error) {
        console.log(error)
        toast.error('something went wrong')
      } finally {
        setLoading(false)
      }
    } else if (user.role === 'admin') {
      try {
        const res = await fetch('http://localhost:3000/tasks')
        const data = await res.json()
        setTasks(data)
      } catch (error) {
        console.log(error)
        toast.error('something went wrong')
      } finally {
        setLoading(false)
      }
    }
  }
  useEffect(() => {
    loadTasks()
  }, [user])
  useEffect(() => {
    const list = Notification(tasks)
    setNotifications(list)
    setReadIds(prev => new Set([...prev].filter(id => list.some(n => n.id === id))))
  }, [tasks])
  const markRead = (id) => {
    setReadIds(prev => new Set([...prev, id]))
  }
  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)))
  }
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length
  return (
    <TaskContext.Provider value={{ tasks, loading, loadTasks, notifications, unreadCount, readIds, markRead, markAllRead }}>
      {children}
    </TaskContext.Provider>
  )
}
export const useTasks = () => useContext(TaskContext)