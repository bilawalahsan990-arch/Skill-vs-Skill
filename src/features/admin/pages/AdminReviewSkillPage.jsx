import { useState } from 'react'

function AdminReviewSkillPage({ request, isSaving, onApprove, onReject, onCancel }) {
  const [note, setNote] = useState('')

  if (!request) {
    return (
      <div className="admin-page-stack">
        <section className="admin-page-heading"><div><h1>Review skill request</h1><p>This request is no longer available.</p></div></section>
        <button type="button" className="admin-secondary-button" onClick={onCancel}>Return to requests</button>
      </div>
    )
  }

  return (
    <div className="admin-page-stack review-skill-page">
      <section className="admin-review-heading">
        <button type="button" className="admin-back-link" onClick={onCancel}><span>‹</span> Requests</button>
        <h1>Review skill request</h1>
      </section>

      <section className="admin-review-card">
        <div className="request-context-card">
          <span className="request-context-icon">◉</span>
          <span><strong>{request.skill}</strong><small>{request.age}</small></span>
        </div>
        <div className="requester-context">
          <span className="admin-avatar">{request.initials}</span>
          <span><strong>{request.requester}</strong><small>⌖ {request.location}</small></span>
          <span>{request.category}</span>
        </div>
        {request.description && <p>{request.description}</p>}

        <label className="review-form-field">
          <span>Review note</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows="4" />
        </label>

        <div className="review-skill-actions">
          <button type="button" className="admin-primary-button" disabled={isSaving} onClick={() => onApprove(request, note)}>
            {isSaving ? 'Saving…' : 'Approve request'}
          </button>
          <div>
            <button type="button" className="admin-danger-button" disabled={isSaving} onClick={() => onReject(request)}>Reject request</button>
            <button type="button" className="admin-secondary-button" disabled={isSaving} onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminReviewSkillPage
