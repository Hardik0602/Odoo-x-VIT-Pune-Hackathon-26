import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Login from './pages/Login'
import Dummy from './pages/Dummy'
import Dummy2 from './pages/Dummy2'
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Login />} />
      <Route
        path='/'
        element={
          <AdminLayout />
        }>
        <Route index element={<Dummy />} />
        <Route path='/dummy2' element={<Dummy2 />} />
      </Route>
    </>
  )
)
export default function App() {
  return <RouterProvider router={router} />
}