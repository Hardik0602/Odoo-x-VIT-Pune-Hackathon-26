import React from 'react'
const Notification = (tasks = []) => {
    const today = new Date()
    const twoDays = 2 * 24 * 60 * 60 * 1000
    const list = []
    tasks.forEach(t => {
        if (t.status !== 'pending') return
        const due = new Date(t.dueDate)
        const diff = due - today
        if (diff < 0) {
            list.push({
                id: `${t.id}-overdue`,
                type: 'overdue',
                taskId: t.id,
                dueDate: t.dueDate,
                message: `${t.title} is Overdue`
            })
        }
        else if (diff <= twoDays) {
            list.push({
                id: `${t.id}-soon`,
                type: 'dueSoon',
                taskId: t.id,
                dueDate: t.dueDate,
                message: `${t.title} is Due Soon`
            })
        }
        else {
            list.push({
                id: `${t.id}-pending`,
                type: 'pending',
                taskId: t.id,
                dueDate: t.dueDate,
                message: `${t.title} is Pending Review`
            })
        }
    })
    const order = { overdue: 0, dueSoon: 1, pending: 2 }
    return list.sort((a, b) => order[a.type] - order[b.type])
}
export default Notification