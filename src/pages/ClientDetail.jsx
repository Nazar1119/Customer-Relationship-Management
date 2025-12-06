import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  createDevice,
  deleteDevice,
  getClient,
  getDevicesSpecial,
  updateClient,
  updateDevice,
} from '../services/dotnetApi'

const ClientDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const clientId = Number(id)

  const {
    data: client,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(id),
  })

  const [editDevice, setEditDevice] = useState({
    deviceId: '',
    model: '',
    serialNumber: '',
    deviceType: '',
    notes: '',
  })

  const { data: filteredDevices = [] } = useQuery({
    queryKey: ['devices', clientId],
    queryFn: () => getDevicesSpecial(clientId),
  })

  const updateMutation = useMutation({
    mutationFn: (payload) => updateClient(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['client', id] }),
  })

  
  // mutation for devices
  const deviceMutation = useMutation({
    mutationFn: (payload) => createDevice(clientId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices', clientId] }),
  })

  const deviceUpdateMutation = useMutation({
    mutationFn: ({ deviceId, payload }) => updateDevice(deviceId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices', clientId] }),
  })

  const deviceDeleteMutation = useMutation({
    mutationFn: (deviceId) => deleteDevice(deviceId),
    onMutate: async (deviceId) => {
      await queryClient.cancelQueries({ queryKey: ['devices', clientId] })
      const previous = queryClient.getQueryData(['devices', clientId])
      queryClient.setQueryData(['devices', clientId], (old = []) =>
        old.filter((d) => d.id !== deviceId)
      )
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['devices', clientId], ctx.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['devices', clientId] }),
  })



  if (isLoading) return <p>Loading client...</p>
  if (error) return <p className="error">{error.message}</p>

  return (
    <div className="stack gap">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Client</p>
            <h2>{client.firstName} {client.lastName}</h2> 
          </div>
          <div className="pill">ID: {client.id}</div>
        </div>
        <div className="grid two">
          <div>
            <div className="label">Email</div>
            <div>{client.email || '—'}</div>
          </div>
          <div>
            <div className="label">Phone</div>
            <div>{client.phone || '—'}</div>
          </div>
          <div>
            <div className="label">Address</div>
            <div>{client.address || '—'}</div>
          </div>
          <div>
            <div className="label">Status</div>
            <div className="pill subtle">{client.status || 'active'}</div>
          </div>
        </div>
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-header">
            <p className="eyebrow">Edit</p>
            <h3>Update client</h3>
          </div>
          <form
            className="form"
            onSubmit={(evt) => {
              evt.preventDefault()
              const payload = Object.fromEntries(new FormData(evt.currentTarget))
              updateMutation.mutate(payload)
            }}
          >
            <label className="field">
              <span>First Name</span>
              <input name="firstName" defaultValue={client.firstName} />
            </label>
            <label className="field">
              <span>Last Name</span>
              <input name="lastName" defaultValue={client.lastName} />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" defaultValue={client.email} />
            </label>
            <label className="field">
              <span>Phone</span>
              <input name="phone" defaultValue={client.phone} />
            </label>
            <label className="field">
              <span>Status</span>
              <select
                name="status"
                defaultValue={client.status}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option> {/* only if your backend supports this */}
              </select>
            </label>
            <button className="primary" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-header">
            <p className="eyebrow">Devices</p>
            <h3>Linked devices</h3>
          </div>
          <ul className="list">
            {filteredDevices.map((device) => (
              <li key={device.id} className="list-row">
                <div>
                  <div className="list-title">{device.model || 'Device'}</div>
                  <div className="list-sub">SN: {device.serialNumber || device.serial_number || 'n/a'}</div>
                  <div className="list-sub">Type: {device.deviceType || 'n/a'}</div>
                  {/* <div className="list-sub">Notes: {device.notes || '—'}</div> */}
                </div>
                <div className="actions">
                  <button
                    className="ghost small"
                    type="button"
                    onClick={() => {
                      setEditDevice({
                        deviceId: device.id,
                        serialNumber: device.serialNumber || device.serial || '',
                        deviceType: device.deviceType || device.type || '',
                        model: device.model || '',
                        notes: device.notes || '',
                      })
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="ghost small"
                    type="button"
                    onClick={() => deviceDeleteMutation.mutate(device.id)}
                    disabled={deviceDeleteMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {filteredDevices.length === 0 ? <p className="muted">No devices registered.</p> : null}
          </ul>

          <form
            className="form"
            onSubmit={(evt) => {
              evt.preventDefault()
              const payload = Object.fromEntries(new FormData(evt.currentTarget))
              const mapped = {
                serialNumber: payload.serialNumber,
                deviceType: payload.deviceType,
                model: payload.model,
                notes: payload.notes,
              }
              deviceMutation.mutate(mapped)
              evt.currentTarget.reset()
            }}
          >
            <div className="panel-header">
              <h4>Add device</h4>
            </div>
            <label className="field">
              <span>Serial Number</span>
              <input name="serialNumber" placeholder="SN123..." required />
            </label>
            <label className="field">
              <span>Device Type</span>
              <input name="deviceType" placeholder="phone/laptop" required />
            </label>
            <label className="field">
              <span>Model</span>
              <input name="model" placeholder="iPhone 12" required />
            </label>
            <label className="field">
              <span>Notes</span>
              <input name="notes" placeholder="Extra info" />
            </label>
            <button className="primary" type="submit" disabled={deviceMutation.isPending}>
              {deviceMutation.isPending ? 'Adding...' : 'Add device'}
            </button>
          </form>

          <form
            className="form"
            onSubmit={(evt) => {
              evt.preventDefault()
              if (!editDevice.deviceId) return
              const payload = {
                serialNumber: editDevice.serialNumber,
                deviceType: editDevice.deviceType,
                model: editDevice.model,
                notes: editDevice.notes,
              }
              deviceUpdateMutation.mutate({ deviceId: editDevice.deviceId, payload })
            }}
          >
            <div className="panel-header">
              <h4>Update device</h4>
            </div>
            <label className="field">
              <span>Device ID</span>
              <input
                type="number"
                value={editDevice.deviceId ?? ''}
                onChange={(e) => {
                  const raw = e.target.value
                  setEditDevice((d) => ({
                    ...d,
                    deviceId: raw === null ? '' : Number(raw),
                  }))
                }}
                placeholder="Select from list or enter ID"
                required
              />
            </label>
            <label className="field">
              <span>Serial Number</span>
              <input
                value={editDevice.serialNumber}
                onChange={(e) => setEditDevice((d) => ({ ...d, serialNumber: e.target.value }))}
              />
            </label>
            <label className="field">
              <span>Device Type</span>
              <input
                value={editDevice.deviceType}
                onChange={(e) => setEditDevice((d) => ({ ...d, deviceType: e.target.value }))}
              />
            </label>
            <label className="field">
              <span>Model</span>
              <input
                value={editDevice.model}
                onChange={(e) => setEditDevice((d) => ({ ...d, model: e.target.value }))}
              />
            </label>
            <label className="field">
              <span>Notes</span>
              <input
                value={editDevice.notes}
                onChange={(e) => setEditDevice((d) => ({ ...d, notes: e.target.value }))}
              />
            </label>
            <button className="primary" type="submit" disabled={deviceUpdateMutation.isPending}>
              {deviceUpdateMutation.isPending ? 'Updating...' : 'Update device'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClientDetail
