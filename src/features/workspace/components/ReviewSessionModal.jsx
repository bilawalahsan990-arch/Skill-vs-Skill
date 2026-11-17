import { useState } from 'react'

function ReviewSessionModal({ session, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const initials = session.otherUserName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const sessionDate = session.scheduledStart
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(session.scheduledStart))
    : ''

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({ rating, review })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="workspace-modal review-modal" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
        <header className="modal-header">
          <div>
            <span className="modal-eyebrow">SESSION COMPLETE</span>
            <h2 id="review-modal-title">Review your exchange partner</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button>
        </header>

        <div className="review-person">
          <span className="avatar avatar-user">{initials}</span>
          <span><strong>{session.otherUserName}</strong><small>{[session.skillName, sessionDate].filter(Boolean).join(' · ')}</small></span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rating-control">
            <strong>How was your session?</strong>
            <span className="rating-stars" role="group" aria-label="Choose a rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={value <= rating ? 'is-selected' : ''}
                  onClick={() => setRating(value)}
                  aria-label={`${value} star${value === 1 ? '' : 's'}`}
                  aria-pressed={rating === value}
                >
                  ★
                </button>
              ))}
            </span>
          </div>
          <label className="form-field review-textarea">
            <span>Your review <small>Optional</small></span>
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Share what you learned or how the session went..."
              rows="4"
            />
          </label>
          <button type="submit" className="button button-primary review-submit" disabled={!rating}>
            Submit review &amp; end session
          </button>
          <button type="button" className="review-cancel" onClick={onClose}>Cancel</button>
        </form>
      </section>
    </div>
  )
}

export default ReviewSessionModal
