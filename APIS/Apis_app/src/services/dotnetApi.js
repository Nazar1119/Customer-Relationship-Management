import { dotnetFetch } from '../api/httpClient'

export const login = (credentials) =>
  dotnetFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })

export const logout = () => dotnetFetch('/auth/logout', { method: 'POST' })

export const getProfile = () => dotnetFetch('/auth/me')

export const getClients = () => dotnetFetch('/client/get')

export const getClient = (id) => dotnetFetch(`/client/get/${id}`)

export const deleteClient = (id) => dotnetFetch(`/client/delete/${id}`, { method: 'DELETE',})

export const updateClient = (id, payload) =>
  dotnetFetch(`/client/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const createClient = (payload) =>
  dotnetFetch('/client/create', { method: 'POST', body: JSON.stringify(payload) })




export const getDevice = (id) => dotnetFetch(`/devices/get/${id}`)

export const createDevice = (clientId, payload) =>
  dotnetFetch(`/devices/create/${clientId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
})

export const updateDevice = (deviceId, payload) =>
  dotnetFetch(`/devices/update/${deviceId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
})

export const deleteDevice = (deviceId) =>
  dotnetFetch(`/devices/delete/${deviceId}`, { method: 'DELETE' })

export const getDevices = () => dotnetFetch('/devices/get/')


export const getUsers = () => dotnetFetch('/employee/get')

export const updateUserRole = (id, role) =>
  dotnetFetch(`/employee/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  })



// Employees (admin-only panel)
export const listEmployees = () => dotnetFetch('/employee/get')

export const getEmployee = (id) => dotnetFetch(`/employee/get/${id}`)

export const createEmployee = (payload) =>
  dotnetFetch('/employee/create', { method: 'POST', body: JSON.stringify(payload) })

export const updateEmployee = (id, payload) =>
  dotnetFetch(`/employee/update/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const deleteEmployee = (id) => dotnetFetch(`/employee/delete/${id}`, { method: 'DELETE' })
