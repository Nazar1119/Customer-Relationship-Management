import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { createRequest, listRequests, updateStatus } from '../services/fastApi'

const Requests = () => {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    status_filter: '',
    limit: 50,
    offset: 0,
  })

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['requests', filters],
    queryFn: () => listRequests(filters),
  })

  const createMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests'] }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests'] }),
  })

  if (isLoading) return <p>Loading requests...</p>
  if (error) return <p className="error">{error.message}</p>

  return (
    <div className="stack gap">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Repairs</p>
            <h2>Requests</h2>
          </div>
          <div className="actions">
            <select
              value={filters.status_filter}
              onChange={(e) => setFilters((f) => ({ ...f, status_filter: e.target.value }))}
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="in_progress">Repairing...</option>
              <option value="awaiting_parts">Awaiting Parts</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="pill">Total {requests.length}</div>
          </div>
        </div>
        <div className="table">
          <div className="table-head">
            <span>ID</span>
            <span>Device</span>
            <span>Client</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="table-body">
            {requests.map((req) => (
              <div key={req.id} className="table-row">
                <span>#{req.id}</span>
                <span>{req.device_id || '—'}</span>
                <span>{req.client_id || '—'}</span>
                <StatusBadge value={req.status} />
                <span className="actions">
                  <button
                    className="ghost small"
                    onClick={() => statusMutation.mutate({ id: req.id, status: 'in_progress' })}
                  >
                    Start
                  </button>
                  <button
                    className="ghost small"
                    onClick={() => statusMutation.mutate({ id: req.id, status: 'completed' })}
                  >
                    Complete
                  </button>
                  <Link to={`/requests/${req.id}`} className="link">
                    Details
                  </Link>
                </span>
              </div>
            ))}
            {requests.length === 0 ? <p className="muted">No requests yet.</p> : null}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <p className="eyebrow">FastAPI</p>
          <h3>Create request</h3>
        </div>
        <form
          className="form"
          onSubmit={(evt) => {
            evt.preventDefault()
            const payload = Object.fromEntries(new FormData(evt.currentTarget))
            payload.device_id = Number(payload.device_id)
            payload.client_id = Number(payload.client_id)
            createMutation.mutate(payload)
            evt.currentTarget.reset()
          }}
        >
          <label className="field">
            <span>Description</span>
            <textarea name="description" placeholder="Issue summary" required rows={3} />
          </label>
          <div className="grid two">
            <label className="field">
              <span>Device ID</span>
              <input name="device_id" type="number" placeholder="22" required />
            </label>
            <label className="field">
              <span>Client ID</span>
              <input name="client_id" type="number" placeholder="10" required />
            </label>
          </div>
          <div className="grid two">
            <label className="field">
              <span>Priority</span>
              <input name="priority" placeholder="high/medium/low" />
            </label>
            <label className="field">
              <span>Category</span>
              <input name="category" placeholder="hardware, diagnostic, networketc." />
            </label>
          </div>
          <button className="primary" type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Submitting...' : 'Create request'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Requests
