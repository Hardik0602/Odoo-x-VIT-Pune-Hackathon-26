import { users as seedUsers } from './users'

const REGISTERED_KEY = 'taskflow_registered_users'

export function getRegisteredUsers () {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getAllUsers () {
  return [...seedUsers, ...getRegisteredUsers()]
}

export function addRegisteredUser (user) {
  const next = [...getRegisteredUsers(), user]
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(next))
}
