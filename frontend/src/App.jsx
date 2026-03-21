import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CashierDashboard from './pages/cashier/CashierDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Setup from './pages/Setup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/setup" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/cashier" element={
          <ProtectedRoute allowedRoles={['cashier']}>
            <CashierDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={['manager', 'owner']}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App