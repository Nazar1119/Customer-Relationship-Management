import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { createReport, getReport } from '../services/fastApi'

const Reports = () => {
  const [form, setForm] = useState(() => {
    const now = new Date()
    const end = now.toISOString()
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    return { 
      period_start: start, 
      period_end: end, 
      summary_json: "" 
    }
  })

  const [lastReport, setLastReport] = useState(null)
  const [lookupId, setLookupId] = useState('')
  const [formError, setFormError] = useState(null)

  // --------------------------
  // CREATE REPORT MUTATION
  // --------------------------
  const createMutation = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      setLastReport(data)
      setFormError(null)
    },
    onError: (err) => setFormError(err.message),
  })

  // --------------------------
  // FETCH REPORT BY ID
  // --------------------------
  const fetchMutation = useMutation({
    mutationFn: (id) => getReport(id),
    onSuccess: (data) => {
      setLastReport(data)
      setFormError(null)
    },
    onError: (err) => setFormError(err.message),
  })

  // --------------------------
  // CREATE REPORT HANDLER
  // --------------------------
  const handleGenerateReport = () => {
    let summaryObject = {}

    try {
      const txt = form.summary_json.trim()

      if (!txt) {
        summaryObject = {}
      } else if (!txt.startsWith('{')) {
        summaryObject = { notes: txt } // wrap plain text
      } else {
        summaryObject = JSON.parse(txt)
      }
    } catch (err) {
      setFormError("summary_json must be valid JSON")
      return
    }

    createMutation.mutate({
      period_start: form.period_start,
      period_end: form.period_end,
      summary_json: summaryObject,
    })
  }

  return (
    <div className="stack gap">
      {/* CREATE REPORT PANEL */}
      <div className="panel">
        <div className="panel-header">
          <p className="eyebrow">Reports</p>
          <h2>Create report</h2>
        </div>

        <div className="form">
          <div className="grid two">
            <label className="field">
              <span>Period start (ISO)</span>
              <input
                name="period_start"
                value={form.period_start}
                onChange={(e) => setForm({ ...form, period_start: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Period end (ISO)</span>
              <input
                name="period_end"
                value={form.period_end}
                onChange={(e) => setForm({ ...form, period_end: e.target.value })}
              />
            </label>
          </div>

          <label className="field">
            <span>Summary</span>
            <textarea
              rows={6}
              value={form.summary_json}
              onChange={(e) => setForm({ ...form, summary_json: e.target.value })}
            />
          </label>

          {formError && <div className="error">{formError}</div>}

          <button
            type="button"
            className="primary"
            onClick={handleGenerateReport}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Generating..." : "Generate report"}
          </button>
        </div>
      </div>

      {/* LOOKUP REPORT BY ID */}
      <div className="panel">
        <div className="panel-header">
          <p className="eyebrow">Lookup</p>
          <h3>Fetch report by ID</h3>
        </div>

        <div className="actions">
          <input
            type="number"
            placeholder="Report ID"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
          />

          <button
            className="ghost"
            onClick={() => lookupId && fetchMutation.mutate(Number(lookupId))}
            disabled={fetchMutation.isPending}
          >
            {fetchMutation.isPending ? 'Loading...' : 'Fetch'}
          </button>
        </div>
      </div>

      {/* LAST REPORT PREVIEW */}
      {lastReport && (
        <div className="panel">
          <div className="panel-header">
            <p className="eyebrow">Result</p>
            <h3>Report #{lastReport.id}</h3>
          </div>

          <div className="grid two">
            <div>
              <div className="label">Period start</div>
              <div>{lastReport.period_start}</div>
            </div>

            <div>
              <div className="label">Period end</div>
              <div>{lastReport.period_end}</div>
            </div>

            <div>
              <div className="label">Generated at</div>
              <div>{lastReport.generated_at}</div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: 12 }}>
            <div className="label">summary_json</div>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(lastReport.summary_json, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
