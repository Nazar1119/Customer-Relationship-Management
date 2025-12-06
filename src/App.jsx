import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import RequireAuth from './components/RequireAuth'
import AdminUsers from './pages/AdminUsers'
import ClientDetail from './pages/ClientDetail'
import Clients from './pages/Clients'
import Login from './pages/Login'
import Diagnostics from './pages/Diagnostics'
import Reports from './pages/Reports'
import RequestDetail from './pages/RequestDetail'
import Requests from './pages/Requests'
import './App.css'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/clients" replace />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="requests" element={<Requests />} />
          <Route path="requests/:id" element={<RequestDetail />} />
          <Route path="diagnostics" element={<Diagnostics />} />
          <Route path="reports" element={<Reports />} />
          <Route element={<RequireAuth roles={['admin']} />}>
            <Route path="admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

console.log("DOTNET =", import.meta.env.VITE_DOTNET_API_BASE)
console.log("PROXY =", import.meta.env.VITE_DOTNET_PROXY_TARGET)

export default App
