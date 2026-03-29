import { createContext, useContext, useMemo, useState } from 'react'
import { useTasks } from './TaskContext'
import { useAuth } from './AuthContext'
import { getAllUsers } from '../data/userStore'
const DataContext = createContext()
export function DataProvider({ children }) {
    const { userListVersion } = useAuth()
    const { tasks } = useTasks()
    const users = useMemo(() => getAllUsers(), [userListVersion])
    const today = new Date()
    const threeDays = new Date(today)
    threeDays.setDate(today.getDate() + 3)
    const totalUsers = users.length
    const managers = users.filter(u => u.role === 'manager').length
    const admins = users.filter(u => u.role === 'admin').length
    const [searchTerm, setSearchTerm] = useState('')
    const filteredUsers = users.filter(u => u.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) || u.email.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status !== 'pending').length
    const overdueTasks = tasks.filter(t => t.status === 'pending' && new Date(t.dueDate) < today).length
    const pendingTasks = tasks.filter(t => t.status === 'pending' && new Date(t.dueDate) >= today).length
    const effectiveTasks = tasks.map(t => {
        const overdue = (t.status === 'pending' && new Date(t.dueDate) < today)
        return {
            ...t,
            overdue,
            priority: overdue ? 'high' : t.priority
        }
    })
    const [sortMode, setSortMode] = useState('due')
    const [filters, setFilters] = useState({
        category: 'all',
        status: 'all',
        priority: 'all'
    })
    const statusOrder = {
        overdue: 0,
        pending: 1,
        in_progress: 2,
        approved: 3,
        rejected: 3
    }
    const priorityOrder = {
        high: 0,
        medium: 1,
        low: 2
    }
    const applyFilters = (tasks) => (
        tasks.filter(t => {
            if (filters.category !== 'all' && t.category !== filters.category) return false
            if (filters.status !== 'all' && t.status !== filters.status) return false
            if (filters.priority !== 'all' && t.priority !== filters.priority) return false
            return true
        })
    )
    const sortTasks = (tasks) => (
        [...tasks].sort((a, b) => {
            const aStatus = a.overdue ? 'overdue' : a.status
            const bStatus = b.overdue ? 'overdue' : b.status
            const s = statusOrder[aStatus] - statusOrder[bStatus]
            if (s !== 0) return s
            return sortMode === 'due'
                ? new Date(a.dueDate) - new Date(b.dueDate)
                : priorityOrder[a.priority] - priorityOrder[b.priority]
        })
    )
    const processedTasks = applyFilters(effectiveTasks).reduce((acc, task) => {
        if (!acc[task.category]) {
            acc[task.category] = []
        }
        acc[task.category].push(task)
        return acc
    }, {})
    Object.keys(processedTasks).forEach(category => {
        processedTasks[category] = sortTasks(processedTasks[category])
    })
    const categories = [...new Set(effectiveTasks.map(t => t.category))]
    const statuses = [...new Set(effectiveTasks.map(t => t.status))]
    const priorities = ['high', 'medium', 'low']
    const pendingEffectiveTasks = effectiveTasks.filter(t => t.status === 'pending')
    const highPriority = pendingEffectiveTasks.filter(t => t.priority === 'high').length
    const mediumPriority = pendingEffectiveTasks.filter(t => t.priority === 'medium').length
    const lowPriority = pendingEffectiveTasks.filter(t => t.priority === 'low').length
    const dueSoon = tasks.filter(t => t.status === 'pending' && new Date(t.dueDate) >= today && new Date(t.dueDate) <= threeDays).length
    return (
        <DataContext.Provider value={{ effectiveTasks, users, searchTerm, filteredUsers, setSearchTerm, totalUsers, managers, admins, overdueTasks, pendingTasks, totalTasks, completedTasks, highPriority, lowPriority, mediumPriority, dueSoon, sortMode, setSortMode, filters, setFilters, statuses, categories, priorities, processedTasks }}>
            {children}
        </DataContext.Provider>
    )
}
export const useData = () => useContext(DataContext)