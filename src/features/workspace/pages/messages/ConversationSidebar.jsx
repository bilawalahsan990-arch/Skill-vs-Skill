import { useState } from 'react'

function ConversationSidebar({ contacts, conversations, activeContact, onSelectContact }) {
  const [query, setQuery] = useState('')
  const filteredContacts = contacts.filter((contact) => (
    `${contact.name} ${contact.skill} ${contact.preview}`.toLowerCase().includes(query.toLowerCase())
  ))

  return (
    <aside className="conversation-sidebar">
      <div className="conversation-list-header">
        <div><h2>Conversations <span>{contacts.length}</span></h2><p>Your recent messages</p></div>
        <button className="icon-button" type="button" aria-label="Compose a message">＋</button>
      </div>
      <label className="conversation-search">
        <span aria-hidden="true">⌕</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages..." aria-label="Search conversations" />
      </label>
      <div className="conversation-list">
        {filteredContacts.map((contact) => {
          const lastMessage = (conversations[contact.id] || []).slice(-1)[0]
          return (
            <button
              type="button"
              key={contact.id}
              className={`conversation-item${contact.id === activeContact ? ' is-active' : ''}`}
              onClick={() => onSelectContact(contact.id)}
            >
              <span className={`avatar avatar-${contact.id}`}>{contact.initials}</span>
              <span className="conversation-item-copy">
                <span><strong>{contact.name}</strong><time>{contact.time}</time></span>
                <small>{lastMessage?.text || contact.preview}</small>
                {contact.skill && <em>{contact.skill}</em>}
              </span>
            </button>
          )
        })}
        {!filteredContacts.length && <p className="messages-empty">No conversations match this search.</p>}
      </div>
    </aside>
  )
}

export default ConversationSidebar
