import { useState } from 'react'

function AvailabilitySlotModal({ type, day, onClose, onSave }) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSave({ type, day, start, end })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="workspace-modal availability-modal" role="dialog" aria-modal="true" aria-labelledby="availability-modal-title">
        <header className="modal-header">
          <div><span className="modal-eyebrow">{type === 'teaching' ? 'TEACHING' : 'LEARNING'} TIMETABLE</span><h2 id="availability-modal-title">Add a time slot</h2></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button>
        </header>
        <form className="slot-form" onSubmit={handleSubmit}>
          <p className="availability-day-note">Add an available time on <strong>{day}</strong>.</p>
          <div className="slot-time-fields">
            <label className="form-field"><span>Start time</span><input type="time" value={start} onChange={(event) => setStart(event.target.value)} required /></label>
            <label className="form-field"><span>End time</span><input type="time" value={end} onChange={(event) => setEnd(event.target.value)} required /></label>
          </div>
          <footer className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
            <span />
            <button type="submit" className="button button-primary">Add time slot</button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default AvailabilitySlotModal
