import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to='/login' />
  }
  const userRole = user.role.toLowerCase()
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase())
  if (!normalizedAllowedRoles.includes(userRole)) {
    if (userRole === 'admin') {
      return <Navigate to='/admin/users' />
    } else if (userRole === 'manager' || userRole === 'cfo' || userRole === 'director') {
      return <Navigate to='/manager/approvals' />
    } else {
      return <Navigate to='/employee/dashboard' />
    }
  }
  return children
}
export default RoleProtectedRoute
