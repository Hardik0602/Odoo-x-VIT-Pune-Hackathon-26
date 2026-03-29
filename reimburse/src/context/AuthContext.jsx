import { createContext, useContext, useState } from 'react'
import { addRegisteredUser, getAllUsers } from '../data/userStore'

function safeParseUser () {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    return normalizeUser(JSON.parse(raw))
  } catch {
    return null
  }
}

function normalizeUser (u) {
  if (!u) return null
  return {
    ...u,
    role: (u.role || 'employee').toLowerCase(),
    currencyCode: u.currencyCode || 'INR',
    currencySymbol: u.currencySymbol || '₹',
    country: u.country || 'India'
  }
}

const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(safeParseUser)
  const [userListVersion, setUserListVersion] = useState(0)
  const login = (email, password) => {
    const found = getAllUsers().find(
      u => u.email === email && u.password === password
    )
    if (!found) return null
    const normalized = normalizeUser(found)
    localStorage.setItem('user', JSON.stringify(normalized))
    setUser(normalized)
    return normalized
  }
  const register = (name, email, password, meta) => {
    if (getAllUsers().some(u => u.email === email)) {
      return { error: 'An account with this email already exists' }
    }
    const newUser = normalizeUser({
      name,
      email,
      password,
      country: meta.country,
      currencyCode: meta.currencyCode,
      currencySymbol: meta.currencySymbol,
      role: 'admin'
    })
    addRegisteredUser(newUser)
    setUserListVersion(v => v + 1)
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
    return { user: newUser }
  }
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{ user, login, logout, register, userListVersion }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
