import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../../api/apiClient.js'
import { mapAdminSkillRequest, mapAdminUser, mapMarketplaceCategory, mapMarketplaceSkill } from '../../api/workspaceApi.js'
import AdminShell from './components/AdminShell.jsx'
import AdminItemModal from './components/AdminItemModal.jsx'
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx'
import AdminRequestsPage from './pages/AdminRequestsPage.jsx'
import AdminReviewSkillPage from './pages/AdminReviewSkillPage.jsx'
import AdminSkillsPage from './pages/AdminSkillsPage.jsx'
import AdminUserDetailPage from './pages/AdminUserDetailPage.jsx'
import AdminUsersPage from './pages/AdminUsersPage.jsx'
import './admin.css'

const pageTitles = {
  requests: 'Requests',
  review: 'Review & Add Skill',
  skills: 'Skills',
  categories: 'Categories',
  users: 'Users',
  userDetail: 'User Profile',
}

function AdminPanel({ session, onExit }) {
  const [activePage, setActivePage] = useState('requests')
  const [requests, setRequests] = useState([])
  const [skills, setSkills] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [dashboard, setDashboard] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isReviewing, setIsReviewing] = useState(false)
  const [error, setError] = useState('')
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [itemModal, setItemModal] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const selectedRequest = requests.find((request) => request.id === selectedRequestId)

  const loadAdminData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [requestData, categoryData, skillData, userData, dashboardData] = await Promise.all([
        apiRequest('/api/admin/skill-requests', { token: session.token }),
        apiRequest('/api/admin/categories', { token: session.token }),
        apiRequest('/api/admin/skills', { token: session.token }),
        apiRequest('/api/admin/users', { token: session.token }),
        apiRequest('/api/admin/dashboard', { token: session.token }),
      ])
      setRequests(requestData.map(mapAdminSkillRequest))
      setCategories(categoryData.map(mapMarketplaceCategory))
      setSkills(skillData.map(mapMarketplaceSkill))
      setUsers(userData.map(mapAdminUser))
      setDashboard(dashboardData)
      setSelectedUser((current) => current
        ? userData.map(mapAdminUser).find((user) => user.id === current.id) || current
        : current)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }, [session.token])

  useEffect(() => {
    let isCurrent = true
    Promise.resolve().then(() => {
      if (isCurrent) loadAdminData()
    })
    return () => {
      isCurrent = false
    }
  }, [loadAdminData])

  async function reviewRequest(request, decision, note = '') {
    setIsReviewing(true)
    try {
      await apiRequest(`/api/admin/skill-requests/${request.id}/review`, {
        method: 'POST',
        token: session.token,
        body: JSON.stringify({ Decision: decision, Note: note }),
      })
      await loadAdminData()
      setActivePage(decision === 'Approved' ? 'skills' : 'requests')
      setSelectedRequestId(null)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsReviewing(false)
    }
  }

  async function saveAdminItem(item) {
    try {
      if (itemModal.type === 'category') {
        await apiRequest(
          item.id ? `/api/admin/categories/${item.id}` : '/api/admin/categories',
          {
            method: item.id ? 'PUT' : 'POST',
            token: session.token,
            body: JSON.stringify({ Name: item.name, Description: item.description }),
          },
        )
      } else {
        await apiRequest('/api/admin/skills', {
          method: 'POST',
          token: session.token,
          body: JSON.stringify({
            Name: item.name,
            CategoryId: Number(item.categoryId),
            Description: item.description,
            Requirements: item.requirements,
            Status: 'Active',
          }),
        })
      }
      await loadAdminData()
      setItemModal(null)
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  async function openUser(user) {
    setSelectedUser(user)
    setActivePage('userDetail')
    try {
      const userData = await apiRequest(`/api/admin/users/${user.id}`, { token: session.token })
      setSelectedUser(mapAdminUser(userData))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function updateUserStatus(user) {
    const status = user.status === 'Active' ? 'Suspended' : 'Active'
    try {
      await apiRequest(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ Status: status }),
      })
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function renderAdminPage() {
    if (activePage === 'review') {
      return (
        <AdminReviewSkillPage
          request={selectedRequest}
          isSaving={isReviewing}
          onApprove={(request, note) => reviewRequest(request, 'Approved', note)}
          onReject={(request) => reviewRequest(request, 'Rejected')}
          onCancel={() => {
            setActivePage('requests')
            setSelectedRequestId(null)
          }}
        />
      )
    }

    if (activePage === 'skills') {
      return (
        <AdminSkillsPage
          skills={skills}
          categories={categories}
          categoryFilter={categoryFilter}
          isLoading={isLoading}
          onAdd={() => setItemModal({ type: 'skill' })}
        />
      )
    }

    if (activePage === 'categories') {
      return (
        <AdminCategoriesPage
          categories={categories}
          skills={skills}
          dashboard={dashboard}
          isLoading={isLoading}
          onCreate={() => setItemModal({ type: 'category' })}
          onEdit={(type, item) => setItemModal({ type, item })}
          onViewSkills={(category) => {
            setCategoryFilter(category.name)
            setActivePage('skills')
          }}
        />
      )
    }

    if (activePage === 'users') {
      return <AdminUsersPage users={users} isLoading={isLoading} onViewProfile={openUser} onManage={openUser} />
    }

    if (activePage === 'userDetail') {
      return (
        <AdminUserDetailPage
          user={selectedUser}
          onBack={() => setActivePage('users')}
          onToggleStatus={updateUserStatus}
        />
      )
    }

    return (
      <AdminRequestsPage
        requests={requests}
        dashboard={dashboard}
        isLoading={isLoading}
        onReview={(requestId) => {
          setSelectedRequestId(requestId)
          setActivePage('review')
        }}
      />
    )
  }

  return (
    <>
      <AdminShell
        user={session.user}
        pendingRequestCount={requests.length}
        activePage={activePage}
        pageTitle={pageTitles[activePage] || 'Admin'}
        onNavigate={setActivePage}
        onExit={onExit}
      >
        {error && <p className="workspace-api-error" role="alert">{error}</p>}
        {renderAdminPage()}
      </AdminShell>
      {itemModal && (
        <AdminItemModal
          type={itemModal.type}
          item={itemModal.item}
          categories={categories}
          onClose={() => setItemModal(null)}
          onSave={saveAdminItem}
        />
      )}
    </>
  )
}

export default AdminPanel
