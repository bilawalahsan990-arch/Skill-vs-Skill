import { useEffect, useState } from 'react'
import { apiRequest } from '../../api/apiClient.js'
import {
  mapAvailabilitySlot,
  mapChatMessage,
  mapConversation,
  mapCurrentUser,
  getWeekdayNames,
  mapMarketplaceCategory,
  mapMarketplaceMember,
  mapMarketplaceSkill,
  mapSession,
  mapSessionMatch,
} from '../../api/workspaceApi.js'
import AdminPanel from '../admin/AdminPanel.jsx'
import WorkspaceShell from './components/WorkspaceShell.jsx'
import ReviewSessionModal from './components/ReviewSessionModal.jsx'
import RequestSkillFlowModal from './components/RequestSkillFlowModal.jsx'
import AvailabilitySlotModal from './components/AvailabilitySlotModal.jsx'
import AvailabilityPage from './pages/AvailabilityPage.jsx'
import HomePage from './pages/HomePage.jsx'
import MarketplacePage from './pages/MarketplacePage.jsx'
import MatchesPage from './pages/MatchesPage.jsx'
import MemberProfilePage from './pages/MemberProfilePage.jsx'
import MessagesPage from './pages/MessagesPage.jsx'
import SkillDetailPage from './pages/SkillDetailPage.jsx'
import './workspace.css'
import './skills.css'
import './availability.css'

function requireList(value, label) {
  if (!Array.isArray(value)) throw new Error(`The ${label} API response was not a list.`)
  return value
}

async function loadSessions(token, userId) {
  const data = await apiRequest('/api/sessions', { token })
  return requireList(data, 'sessions').map((item) => mapSession(item, userId))
}

async function loadAvailability(token) {
  const response = await apiRequest('/api/availability/my-schedule', { token })
  const slots = response?.slots || response?.Slots
  if (!Array.isArray(slots)) throw new Error('The availability API response did not include a slots array.')
  return slots.map(mapAvailabilitySlot)
}

function WorkspaceApp({ session, onLogout }) {
  const currentUser = mapCurrentUser(session.user)
  const [activePage, setActivePage] = useState('home')
  const [matchTab, setMatchTab] = useState('teaching')
  const [sessions, setSessions] = useState([])
  const [isSessionsLoading, setIsSessionsLoading] = useState(true)
  const [matches, setMatches] = useState([])
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [activeSkill, setActiveSkill] = useState(null)
  const [skillMembers, setSkillMembers] = useState([])
  const [membersLoadedForSkillId, setMembersLoadedForSkillId] = useState(null)
  const [availability, setAvailability] = useState([])
  const [hasAvailabilityLoaded, setHasAvailabilityLoaded] = useState(false)
  const [availabilityModal, setAvailabilityModal] = useState(null)
  const [skillFlow, setSkillFlow] = useState(null)
  const [reviewSession, setReviewSession] = useState(null)
  const [activeContact, setActiveContact] = useState(null)
  const [contacts, setContacts] = useState([])
  const [conversations, setConversations] = useState({})
  const [workspaceError, setWorkspaceError] = useState('')
  const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false)
  const [isMatchesLoading, setIsMatchesLoading] = useState(false)
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false)
  const [isMessagesLoading, setIsMessagesLoading] = useState(false)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isSavingAvailability, setIsSavingAvailability] = useState(false)

  useEffect(() => {
    let isCurrent = true
    Promise.resolve()
      .then(() => loadSessions(session.token, currentUser.id))
      .then((data) => {
        if (isCurrent) setSessions(data)
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })
      .finally(() => {
        if (isCurrent) setIsSessionsLoading(false)
      })
    Promise.resolve()
      .then(() => apiRequest('/api/marketplace/my-listings', { token: session.token }))
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('The listings API response was not a list.')
        if (isCurrent) setListings(data.map(mapMarketplaceMember))
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })
    return () => {
      isCurrent = false
    }
  }, [session.token, currentUser.id])

  useEffect(() => {
    if (!['marketplace', 'skillDetail'].includes(activePage)) return undefined

    let isCurrent = true
    Promise.resolve()
      .then(() => {
        if (!isCurrent) return null
        setIsMarketplaceLoading(true)
        return Promise.all([
          apiRequest('/api/marketplace/categories', { token: session.token }),
          apiRequest('/api/marketplace/skills', { token: session.token }),
        ])
      })
      .then((result) => {
        if (!result || !isCurrent) return
        const [categoryData, skillData] = result
        if (!Array.isArray(categoryData) || !Array.isArray(skillData)) {
          throw new Error('The marketplace API response was not a list.')
        }
        setCategories(categoryData.map(mapMarketplaceCategory))
        setSkills(skillData.map(mapMarketplaceSkill))
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })
      .finally(() => {
        if (isCurrent) setIsMarketplaceLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [activePage, session.token])

  useEffect(() => {
    if (activePage !== 'skillDetail' || !activeSkill?.id) return undefined

    let isCurrent = true
    Promise.resolve()
      .then(() => apiRequest(`/api/marketplace/skills/${encodeURIComponent(activeSkill.id)}/members?intent=Offer`, { token: session.token }))
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('The skill members API response was not a list.')
        if (isCurrent) {
          setSkillMembers(data.map(mapMarketplaceMember))
          setMembersLoadedForSkillId(activeSkill.id)
        }
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })

    return () => {
      isCurrent = false
    }
  }, [activePage, activeSkill?.id, session.token])

  useEffect(() => {
    if (activePage !== 'matches') return undefined

    let isCurrent = true
    Promise.resolve()
      .then(() => {
        if (!isCurrent) return null
        setIsMatchesLoading(true)
        return Promise.all([
          apiRequest('/api/sessions/matches', { token: session.token }),
          loadSessions(session.token, currentUser.id),
        ])
      })
      .then((result) => {
        if (!result || !isCurrent) return
        const [matchData, sessionData] = result
        if (!Array.isArray(matchData)) throw new Error('The matches API response was not a list.')
        setMatches(matchData.map(mapSessionMatch))
        setSessions(sessionData)
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })
      .finally(() => {
        if (isCurrent) setIsMatchesLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [activePage, currentUser.id, session.token])

  useEffect(() => {
    if (activePage !== 'availability') return undefined

    let isCurrent = true
    Promise.resolve()
      .then(() => {
        if (!isCurrent) return null
        setIsAvailabilityLoading(true)
        setHasAvailabilityLoaded(false)
        return loadAvailability(session.token)
      })
      .then((slots) => {
        if (!slots) return
        if (!isCurrent) return
        setAvailability(slots)
        setHasAvailabilityLoaded(true)
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })
      .finally(() => {
        if (isCurrent) setIsAvailabilityLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [activePage, session.token])

  useEffect(() => {
    if (activePage !== 'profile') return undefined

    let isCurrent = true
    Promise.resolve()
      .then(() => {
        if (!isCurrent) return null
        setIsProfileLoading(true)
        return apiRequest('/api/marketplace/my-listings', { token: session.token })
      })
      .then((data) => {
        if (!data) return
        if (!Array.isArray(data)) throw new Error('The listings API response was not a list.')
        if (isCurrent) setListings(data.map(mapMarketplaceMember))
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })
      .finally(() => {
        if (isCurrent) setIsProfileLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [activePage, session.token])

  useEffect(() => {
    if (activePage !== 'messages') return undefined

    let isCurrent = true
    Promise.resolve()
      .then(() => {
        if (!isCurrent) return null
        setIsMessagesLoading(true)
        return apiRequest('/api/chat/conversations', { token: session.token })
      })
      .then((data) => {
        if (!data) return
        if (!Array.isArray(data)) throw new Error('The conversations API response was not a list.')
        const loadedContacts = data.map((item) => mapConversation(item, skills))
        if (!isCurrent) return
        setContacts(loadedContacts)
        setActiveContact((current) => (
          loadedContacts.some((contact) => contact.id === current)
            ? current
            : loadedContacts[0]?.id || null
        ))
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })
      .finally(() => {
        if (isCurrent) setIsMessagesLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [activePage, session.token, skills])

  useEffect(() => {
    if (activePage !== 'messages' || !activeContact) return undefined

    let isCurrent = true
    apiRequest(`/api/chat/conversations/${encodeURIComponent(activeContact)}/messages`, { token: session.token })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('The messages API response was not a list.')
        if (!isCurrent) return
        setConversations((current) => ({
          ...current,
          [activeContact]: data.map(mapChatMessage),
        }))
      })
      .catch((error) => {
        if (isCurrent) setWorkspaceError(error.message)
      })

    return () => {
      isCurrent = false
    }
  }, [activeContact, activePage, session.token])

  function requestSkill(initialSkill = {}) {
    setSkillFlow(initialSkill)
  }

  async function refreshSessions() {
    const data = await loadSessions(session.token, currentUser.id)
    setSessions(data)
    return data
  }

  async function refreshListings() {
    const data = await apiRequest('/api/marketplace/my-listings', { token: session.token })
    if (!Array.isArray(data)) throw new Error('The listings API response was not a list.')
    const mapped = data.map(mapMarketplaceMember)
    setListings(mapped)
    return mapped
  }

  async function saveSkill(skill) {
    await apiRequest('/api/marketplace/my-listings', {
      method: 'POST',
      token: session.token,
      body: JSON.stringify({
        SkillId: Number(skill.skillId),
        SkillIntent: skill.intent === 'Teach' ? 'Offer' : 'Learn',
        Proficiency: skill.level || null,
        Duration: skill.duration,
        TokenRate: skill.tokenRate ? Number(skill.tokenRate) : null,
        Topics: skill.topics,
      }),
    })
    await refreshListings()
    const savedSkill = skills.find((item) => Number(item.id) === Number(skill.skillId))
    if (savedSkill) setActiveSkill(savedSkill)
    setSkillFlow(null)
    setActivePage(savedSkill ? 'skillDetail' : 'profile')
  }

  async function saveAvailability() {
    setIsSavingAvailability(true)
    setWorkspaceError('')
    try {
      const days = getWeekdayNames()
      await apiRequest('/api/availability/my-schedule', {
        method: 'POST',
        token: session.token,
        body: JSON.stringify({
          Slots: availability.map((slotItem) => ({
            ScheduleType: slotItem.type === 'teaching' ? 'Teaching' : 'Learning',
            DayOfWeek: days.indexOf(slotItem.day) + 1,
            StartTime: `${slotItem.start}:00`,
            EndTime: `${slotItem.end}:00`,
          })),
        }),
      })
      setAvailability(await loadAvailability(session.token))
      setActivePage('profile')
    } catch (error) {
      setWorkspaceError(error.message)
    } finally {
      setIsSavingAvailability(false)
    }
  }

  function addAvailabilitySlot(slotData) {
    setAvailability((current) => [...current, { ...slotData, id: crypto.randomUUID(), label: '' }])
    setAvailabilityModal(null)
  }

  async function updateSession(sessionId, action) {
    setWorkspaceError('')
    try {
      await apiRequest(`/api/sessions/${encodeURIComponent(sessionId)}/${action}`, {
        method: 'POST',
        token: session.token,
      })
      await refreshSessions()
    } catch (error) {
      setWorkspaceError(error.message)
    }
  }

  async function requestSession(match) {
    const isOffering = match.intent === 'Offer'
    setWorkspaceError('')
    try {
      await apiRequest('/api/sessions', {
        method: 'POST',
        token: session.token,
        body: JSON.stringify({
          TeacherUserId: isOffering ? currentUser.id : match.userId,
          LearnerUserId: isOffering ? match.userId : currentUser.id,
          SkillId: match.skillId,
        }),
      })
      await refreshSessions()
      setWorkspaceError('')
    } catch (error) {
      setWorkspaceError(error.message)
    }
  }

  async function submitReview({ rating, review }) {
    if (!reviewSession) return
    setWorkspaceError('')
    try {
      if (reviewSession.status !== 'Completed') {
        await apiRequest(`/api/sessions/${encodeURIComponent(reviewSession.id)}/complete`, {
          method: 'POST',
          token: session.token,
        })
      }
      await apiRequest(`/api/sessions/${encodeURIComponent(reviewSession.id)}/reviews`, {
        method: 'POST',
        token: session.token,
        body: JSON.stringify({ Rating: rating, Comment: review }),
      })
      await refreshSessions()
      setReviewSession(null)
    } catch (error) {
      setWorkspaceError(error.message)
    }
  }

  async function sendMessage(contactId, text) {
    const message = await apiRequest(`/api/chat/conversations/${encodeURIComponent(contactId)}/messages`, {
      method: 'POST',
      token: session.token,
      body: JSON.stringify({ Body: text }),
    })
    setConversations((current) => ({
      ...current,
      [contactId]: [...(current[contactId] || []), mapChatMessage(message)],
    }))
    setContacts((current) => current.map((contact) => (
      contact.id === contactId
        ? { ...contact, preview: text, time: mapChatMessage(message).time }
        : contact
    )))
  }

  function renderPage() {
    if (activePage === 'marketplace') {
      return (
        <MarketplacePage
          skills={skills}
          categories={categories}
          isLoading={isMarketplaceLoading}
          onViewSkill={(skill) => {
            setActiveSkill(skill)
            setActivePage('skillDetail')
          }}
          onRequestSkill={requestSkill}
        />
      )
    }

    if (activePage === 'skillDetail') {
      return activeSkill ? (
        <SkillDetailPage
          skill={activeSkill}
          members={skillMembers}
          currentUserId={currentUser.id}
          isLoading={isMarketplaceLoading || membersLoadedForSkillId !== activeSkill.id}
          onBack={() => setActivePage('marketplace')}
          onBookSession={requestSession}
          onOfferSkill={() => requestSkill({ ...activeSkill, intent: 'Teach' })}
        />
      ) : <div className="empty-schedule"><strong>No skill selected.</strong></div>
    }

    if (activePage === 'availability') {
      return (
        <AvailabilityPage
          slots={availability}
          onAddSlot={(type, day) => setAvailabilityModal({ type, day })}
          onRemoveSlot={(slotId) => setAvailability((current) => current.filter((slotItem) => slotItem.id !== slotId))}
          isLoading={isAvailabilityLoading}
          isLoaded={hasAvailabilityLoaded}
          isSaving={isSavingAvailability}
          onSave={saveAvailability}
          onBack={() => setActivePage('profile')}
        />
      )
    }

    if (activePage === 'matches') {
      return (
        <MatchesPage
          activeTab={matchTab}
          onTabChange={setMatchTab}
          matches={matches}
          sessions={sessions}
          isLoading={isMatchesLoading}
          onRequestSession={requestSession}
          onSessionAction={updateSession}
          onReviewSession={setReviewSession}
          onManageAvailability={() => setActivePage('availability')}
        />
      )
    }

    if (activePage === 'messages') {
      return (
        <MessagesPage
          contacts={contacts}
          conversations={conversations}
          activeContact={activeContact}
          onSelectContact={setActiveContact}
          onSendMessage={sendMessage}
          isLoading={isMessagesLoading}
        />
      )
    }

    if (activePage === 'profile') {
      return (
        <MemberProfilePage
          user={currentUser}
          listings={listings}
          sessions={sessions}
          isLoading={isProfileLoading}
          onMessage={() => setActivePage('messages')}
          onManageAvailability={() => setActivePage('availability')}
          onNavigateToSkill={(listing) => {
            const skill = skills.find((item) => Number(item.id) === Number(listing.skillId))
            if (skill) {
              setActiveSkill(skill)
              setActivePage('skillDetail')
            } else {
              setWorkspaceError('This skill is not available in the marketplace.')
            }
          }}
        />
      )
    }

    return (
      <HomePage
        user={currentUser}
        sessions={sessions}
        isLoading={isSessionsLoading}
        onSessionAction={updateSession}
        onNavigate={(page) => setActivePage(page === 'findSkill' ? 'marketplace' : page)}
      />
    )
  }

  if (activePage === 'admin') {
    return <AdminPanel session={session} onExit={() => setActivePage('home')} />
  }

  const unreadCount = contacts.reduce((total, contact) => total + contact.unreadCount, 0)

  return (
    <>
      <WorkspaceShell
        user={currentUser}
        unreadCount={unreadCount}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
      >
        {workspaceError && <p className="workspace-api-error" role="alert">{workspaceError}</p>}
        {renderPage()}
      </WorkspaceShell>
      {reviewSession && (
        <ReviewSessionModal
          session={reviewSession}
          onClose={() => setReviewSession(null)}
          onSubmit={submitReview}
        />
      )}
      {skillFlow && (
        <RequestSkillFlowModal
          initialSkill={skillFlow}
          categories={categories}
          skills={skills}
          onClose={() => setSkillFlow(null)}
          onSave={saveSkill}
        />
      )}
      {availabilityModal && (
        <AvailabilitySlotModal
          type={availabilityModal.type}
          day={availabilityModal.day}
          onClose={() => setAvailabilityModal(null)}
          onSave={addAvailabilitySlot}
        />
      )}
    </>
  )
}

export default WorkspaceApp
