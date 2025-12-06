import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createDiagnostic, getDiagnostic, listDiagnostics } from '../services/fastApi'

const Diagnostics = () => {
  const queryClient = useQueryClient()
  const [lookupId, setLookupId] = useState('')
  const [lastDiagnostic, setLastDiagnostic] = useState(null)
  const [form, setForm] = useState({ request_id: '', notes: '', result_code: '' })

  const {
    data: diagnostics = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['diagnostics'],
    queryFn: listDiagnostics,
  })

  const createMutation = useMutation({
    mutationFn: createDiagnostic,
    onSuccess: (data) => {
      setLastDiagnostic(data)
      queryClient.invalidateQueries({ queryKey: ['diagnostics'] })
    },
  })

  const fetchMutation = useMutation({
    mutationFn: (id) => getDiagnostic(id),
    onSuccess: (data) => setLastDiagnostic(data),
  })

  if (isLoading) return <p>Loading diagnostics...</p>
  if (error) return <p className="error">{error.message}</p>

  return (
    <div className="stack gap">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">FastAPI</p>
            <h2>Diagnostics</h2>
          </div>
          <div className="pill">Total {diagnostics.length}</div>
        </div>
        <div className="table">
          <div className="table-head">
            <span>ID</span>
            <span>Request</span>
            <span>Result</span>
            <span>Notes</span>
            <span>Created</span>
          </div>
          <div className="table-body">
            {diagnostics.map((diag) => (
              <div key={diag.id} className="table-row">
                <span>#{diag.id}</span>
                <span>{diag.request_id}</span>
                <span className="pill subtle">{diag.result_code}</span>
                <span>{diag.notes || '—'}</span>
                <span>{diag.created_at ? new Date(diag.created_at).toLocaleString() : '—'}</span>
              </div>
            ))}
          </div>
          {diagnostics.length === 0 ? <p className="muted">No diagnostics recorded.</p> : null}
        </div>
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-header">
            <p className="eyebrow">New diagnostic</p>
            <h3>Create entry</h3>
          </div>
          <form
            className="form"
            onSubmit={(evt) => {
              evt.preventDefault()
              const payload = {
                request_id: Number(form.request_id),
                notes: form.notes,
                result_code: form.result_code,
              }
              createMutation.mutate(payload)
              setForm({ request_id: '', notes: '', result_code: '' })
            }}
          >
            <label className="field">
              <span>Request ID</span>
              <input
                type="number"
                value={form.request_id}
                onChange={(e) => setForm((f) => ({ ...f, request_id: e.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Result code</span>
              <input
                value={form.result_code}
                onChange={(e) => setForm((f) => ({ ...f, result_code: e.target.value }))}
                placeholder="ok/fail/waiting"
                required
              />
            </label>
            <label className="field">
              <span>Notes</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Observed issues, parts needed..."
              />
            </label>
            <button className="primary" type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save diagnostic'}
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <p className="eyebrow">Lookup</p>
            <h3>Get by ID</h3>
          </div>
          <div className="actions">
            <input
              type="number"
              placeholder="Diagnostic ID"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
            />
            <button
              className="ghost"
              type="button"
              onClick={() => lookupId && fetchMutation.mutate(Number(lookupId))}
              disabled={fetchMutation.isPending}
            >
              {fetchMutation.isPending ? 'Loading...' : 'Fetch'}
            </button>
          </div>
          {lastDiagnostic ? (
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="label">Diagnostic #{lastDiagnostic.id}</div>
              <div className="list-sub">Request: {lastDiagnostic.request_id}</div>
              <div className="list-sub">Result: {lastDiagnostic.result_code}</div>
              <div className="list-sub">Notes: {lastDiagnostic.notes || '—'}</div>
              <div className="list-sub">Created: {lastDiagnostic.created_at}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Diagnostics
