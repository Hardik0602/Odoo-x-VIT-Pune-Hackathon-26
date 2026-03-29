import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom'
import ProtectedRoute from './helper/ProtectedRoute'
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
        <Route path='employee/dashboard' element={<EmployeeDashboard />} />
        <Route path='employee/submit' element={<ExpenseSubmit />} />
        <Route path='employee/claims' element={<MyClaims />} />
        <Route path='manager/approvals' element={<ManagerApprovals />} />
        <Route path='manager/expenses' element={<EmployeeDashboard />} />
        <Route path='admin/users' element={<AdminUsers />} />
        <Route path='admin/rules' element={<AdminRules />} />
        <Route path='admin/expenses' element={<EmployeeDashboard />} />
      </Route>
    </>
  )
)

export default function App () {
  return <RouterProvider router={router} />
}
