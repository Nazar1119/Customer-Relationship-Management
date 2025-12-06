import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { getRequest, updateStatus } from '../services/fastApi'

const RequestDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const {
    data: request,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['request', id],
    queryFn: () => getRequest(id),
  })

  const mutation = useMutation({
    mutationFn: (status) => updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['request', id] }),
  })

  if (isLoading) return <p>Loading request...</p>
  if (error) return <p className="error">{error.message}</p>

  return (
    <div className="stack gap">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">FastAPI</p>
            <h2>Request #{request.id}</h2>
          </div>
          <StatusBadge value={request.status} />
        </div>
        <div className="grid two">
          <div>
            <div className="label">Client</div>
            <div>{request.client_id}</div>
          </div>
          <div>
            <div className="label">Device</div>
            <div>{request.device_id}</div>
          </div>
          <div className="full">
            <div className="label">Description</div>
            <div className="muted">{request.description}</div>
          </div>
          <div className="full">
            <div className="label">Сategory</div>
            <div className="muted">{request.category}</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <p className="eyebrow">Status</p>
          <h3>Update status</h3>
        </div>
        <div className="actions">
          {['pending', 'completed'].map((status) => (
            <button
              key={status}
              className="ghost"
              onClick={() => mutation.mutate(status)}
              disabled={mutation.isPending}
            >
              {status}
            </button>
          ))}
        </div>
        {mutation.isPending ? <p className="muted">Applying...</p> : null}
      </div>
    </div>
  )
}

export default RequestDetail
