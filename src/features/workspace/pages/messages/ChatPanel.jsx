import { useEffect, useRef, useState } from 'react'

function ChatPanel({ contact, messages, onSendMessage }) {
  const [draft, setDraft] = useState('')
  const [sendError, setSendError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messageEndRef = useRef(null)
  const today = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: 'end' })
  }, [contact.id, messages.length])

  async function handleSubmit(event) {
    event.preventDefault()
    const message = draft.trim()
    if (!message) return
    setIsSending(true)
    setSendError('')
    try {
      await onSendMessage(contact.id, message)
      setDraft('')
    } catch (error) {
      setSendError(error.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="chat-panel" aria-label={`Conversation with ${contact.name}`}>
      <header className="chat-header">
        <span className={`avatar avatar-${contact.id}`}>{contact.initials}</span>
        <div className="chat-contact-info">
          <strong>{contact.name}</strong>
          {contact.skill && <small>{contact.skill}</small>}
        </div>
      </header>

      <div className="chat-date-divider"><span>{today}</span></div>
      <div className="chat-messages" aria-live="polite">
        {sendError && <p className="chat-send-error" role="alert">{sendError}</p>}
        {messages.map((message) => (
          <div className={`chat-message-row${message.from === 'you' ? ' is-mine' : ''}`} key={`${contact.id}-${message.id}`}>
            {message.from !== 'you' && <span className={`avatar avatar-small avatar-${contact.id}`}>{contact.initials}</span>}
            <div className="chat-message-content">
              <p>{message.text}</p>
              <time>{message.time}{message.from === 'you' && <span className="message-check"> ✓✓</span>}</time>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <button type="button" className="composer-add" aria-label="Add attachment">＋</button>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." aria-label="Write a message" />
        <button type="submit" className="send-button" disabled={!draft.trim() || isSending} aria-label="Send message">➤</button>
      </form>
    </section>
  )
}

export default ChatPanel
