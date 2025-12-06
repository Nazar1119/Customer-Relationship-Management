const mapToTone = (status) => {
  const normalized = status?.toLowerCase()
  if (normalized?.includes('done') || normalized === 'completed') return 'green'
  if (normalized?.includes('progress')) return 'blue'
  if (normalized?.includes('pending')) return 'amber'
  if (normalized?.includes('cancel')) return 'gray'
  return 'slate'
}

const StatusBadge = ({ value }) => {
  const tone = mapToTone(value)
  return <span className={`badge badge-${tone}`}>{value || 'unknown'}</span>
}

export default StatusBadge
