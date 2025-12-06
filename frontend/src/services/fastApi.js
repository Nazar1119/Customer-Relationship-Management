import { fastFetch } from '../api/httpClient'

const toQuery = (params = {}) => {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, v))
    } else {
      search.append(key, value)
    }
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const listRequests = (params = {}) => fastFetch(`/requests${toQuery(params)}`)

export const getRequest = (id) => fastFetch(`/requests/${id}`)

export const createRequest = (payload) =>
  fastFetch('/requests', { method: 'POST', body: JSON.stringify(payload) })

export const updateStatus = (id, status) =>
  fastFetch(`/requests/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })

export const createReport = (payload) =>
  fastFetch('/reports', { method: 'POST', body: JSON.stringify(payload) })

export const getReport = (id) => fastFetch(`/reports/${id}`)

// Diagnostics
export const listDiagnostics = () => fastFetch('/diagnostics')

export const getDiagnostic = (id) => fastFetch(`/diagnostics/${id}`)

export const createDiagnostic = (payload) =>
  fastFetch('/diagnostics', { method: 'POST', body: JSON.stringify(payload) })
