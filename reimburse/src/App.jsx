import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom'
import ProtectedRoute from './helper/ProtectedRoute'
import RoleProtectedRoute from './helper/RoleProtectedRoute'
import ReimburseLayout from './layouts/ReimburseLayout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import EmployeeDashboard from './pages/reimburse/EmployeeDashboard'
import ExpenseSubmit from './pages/reimburse/ExpenseSubmit'
import MyClaims from './pages/reimburse/MyClaims'
import ManagerApprovals from './pages/reimburse/ManagerApprovals'
import AdminUsers from './pages/reimburse/AdminUsers'
import AdminRules from './pages/reimburse/AdminRules'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <ReimburseLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to='/employee/dashboard' replace />} />
        
        {/* Employee Routes */}
        <Route
          path='employee/dashboard'
          element={
            <RoleProtectedRoute allowedRoles={['employee', 'admin', 'manager']}>
              <EmployeeDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='employee/submit'
          element={
            <RoleProtectedRoute allowedRoles={['employee']}>
              <ExpenseSubmit />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='employee/claims'
          element={
            <RoleProtectedRoute allowedRoles={['employee']}>
              <MyClaims />
            </RoleProtectedRoute>
          }
        />
        
        {/* Manager Routes */}
        <Route
          path='manager/approvals'
          element={
            <RoleProtectedRoute allowedRoles={['manager', 'admin']}>
              <ManagerApprovals />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='manager/expenses'
          element={
            <RoleProtectedRoute allowedRoles={['manager', 'admin']}>
              <EmployeeDashboard />
            </RoleProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path='admin/users'
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='admin/rules'
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminRules />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='admin/expenses'
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <EmployeeDashboard />
            </RoleProtectedRoute>
          }
        />
      </Route>
    </>
  )
)

export default function App () {
  return <RouterProvider router={router} />
}
