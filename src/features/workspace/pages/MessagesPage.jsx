import ChatPanel from './messages/ChatPanel.jsx'
import ConversationSidebar from './messages/ConversationSidebar.jsx'

function MessagesPage({ contacts, conversations, activeContact, onSelectContact, onSendMessage, isLoading }) {
  const selectedContact = contacts.find((contact) => contact.id === activeContact) || contacts[0]
  const messages = conversations[activeContact] || []

  return (
    <div className="page-stack messages-page">
      <section className="page-heading-row messages-page-heading">
        <div>
          <span className="page-eyebrow">YOUR COMMUNITY</span>
          <h1>Messages</h1>
          <p>Stay in touch with your skill exchange partners.</p>
        </div>
      </section>

      <section className="messages-workspace content-card">
        {selectedContact ? (
          <>
            <ConversationSidebar
              contacts={contacts}
              conversations={conversations}
              activeContact={activeContact}
              onSelectContact={onSelectContact}
            />
            <ChatPanel
              contact={selectedContact}
              messages={messages}
              onSendMessage={onSendMessage}
            />
          </>
        ) : (
          <div className="messages-empty">
            {isLoading ? 'Loading conversations…' : 'No conversations found for this account.'}
          </div>
        )}
      </section>
    </div>
  )
}

export default MessagesPage
