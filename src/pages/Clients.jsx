import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createClient, deleteClient, getClients, getDevicesSpecial } from '../services/dotnetApi'

const Clients = () => {
  const queryClient = useQueryClient()
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })

  const [selectedClientId, setSelectedClientId] = useState(null)
  const { data: devices = [] } = useQuery({
    queryKey: ['devices', selectedClientId],
    enabled: Boolean(selectedClientId),
    queryFn: () => getDevicesSpecial(selectedClientId),
  })
  const filteredDevices = devices ?? []

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteClient,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['clients'] })

      const previousClients = queryClient.getQueryData(['clients'])

      queryClient.setQueryData(['clients'], (old) =>
        old.filter((client) => client.id !== id)
      )

      return { previousClients }
    },

    onError: (err, id, ctx) => {
      queryClient.setQueryData(['clients'], ctx.previousClients)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })

  const [draft, setDraft] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active',
    assignedEmployeeId: 1,
  })

  const handleSubmit = (evt) => {
    evt.preventDefault()
    createMutation.mutate(draft)
    setDraft({firstName: '', lastname: '', email: '', phone: '', status: '', assignedEmployeeId: 1 })
  }

  if (isLoading) return <p>Loading clients...</p>
  if (error) return <p className="error">{error.message}</p>

  return (
    <div className="stack gap">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">CRM</p>
            <h2>Clients</h2>
          </div>
          <div className="pill">{clients?.length || 0} total</div>
        </div>
        <div className="grid">
          {clients.map((client) => (
            <div
              key={client.id}
              className={`card ${client.id === selectedClientId ? 'card-active' : ''}`}
              onClick={() => setSelectedClientId(client.id)}
              role="button"
            >
              <div className="card-title">
                {client.firstName} {client.lastName}
              </div>
              <div className="card-sub">{client.email || 'No email'}</div>
              <div className="card-sub">{client.phone || 'No phone'}</div>
              <div className="card-footer">
                <Link to={`/clients/${client.id}`} className="link">
                  View details
                </Link>
                <button
                  className="btn-danger"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete ${client.firstName} ${client.lastName}?`)) {
                      deleteMutation.mutate(client.id)
                    }
                  }}
                  style={{ backgroundColor: 'red', color: 'white' }}
                  
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-header">
            <p className="eyebrow">Quick add</p>
            <h3>Create client</h3>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>First Name</span>
              <input
                name="FirstName"
                value={draft.firstName}
                onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Last Name</span>
              <input
                name="LastName"
                value={draft.lastName}
                onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                name="phone"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Status</span>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="field">
              <span>Assigned Employee ID</span>
              <input
                type="number"
                value={draft.assignedEmployeeId}
                onChange={(e) => setDraft({ ...draft, assignedEmployeeId: Number(e.target.value) })}
              />
            </label>
            <button className="primary" type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save client'}
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <p className="eyebrow">Devices</p>
            <h3>{selectedClientId ? 'Linked devices' : 'Pick a client'}</h3>
          </div>
          {selectedClientId ? (
            <ul className="list">
              {filteredDevices.map((device) => (
                <li key={device.id} className="list-row">
                  <div>
                    <div className="list-title">{device.model || device.name}</div>
                    <div className="list-sub">
                      SN: {device.serialNumber || device.serial || 'n/a'}
                    </div>
                  </div>
                  <span className="pill subtle">{device.status || 'active'}</span>
                </li>
              ))}
              {filteredDevices.length === 0 ? <p className="muted">No devices yet.</p> : null}
            </ul>
          ) : (
            <p className="muted">Select a client to preview devices.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Clients
