import { useMemo, useState } from 'react'

function AdminCategoriesPage({ categories, skills, dashboard, isLoading, onCreate, onEdit, onViewSkills }) {
  const [query, setQuery] = useState('')
  const filteredCategories = useMemo(() => categories.filter((category) => (
    category.name.toLowerCase().includes(query.toLowerCase())
  )), [categories, query])

  return (
    <div className="admin-page-stack">
      <section className="admin-page-heading">
        <div><span className="admin-eyebrow">TAXONOMY GOVERNANCE</span><h1>Categories</h1><p>Organize skills and power meaningful peer swaps.</p></div>
        <button type="button" className="admin-primary-button" onClick={() => onCreate('category')}>＋ New category</button>
      </section>

      <section className="admin-category-metrics">
        <article><span>Categories</span><strong>{categories.length}</strong></article>
        <article><span>Skills</span><strong>{skills.length}</strong></article>
        <article><span>Users</span><strong>{dashboard.Users ?? 0}</strong></article>
      </section>

      <section className="admin-list-panel">
        <label className="admin-search-input"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories or keywords..." aria-label="Search categories" /></label>
        <div className="admin-category-toolbar"><span>Displaying <b>{filteredCategories.length} Domains</b></span><button type="button" className="admin-filter-button">☷ Sort</button></div>
        <div className="admin-category-list">
          {isLoading ? <div className="admin-empty-state">Loading categories…</div> : filteredCategories.map((category) => (
            <article className="admin-domain-card" key={category.id}>
              <div className="domain-icon">‹›</div>
              <div className="domain-main">
                <div><strong>{category.name}</strong><span className="admin-verified-dot">✓</span></div>
                <small>{category.skills} Skills <span>·</span> {category.users.toLocaleString()} Users</small>
                {category.description && <div className="domain-health">{category.description}</div>}
              </div>
              <div className="domain-actions">
                <button type="button" className="catalog-edit-button" onClick={() => onEdit('category', category)}>✎ Edit</button>
                <button type="button" className="admin-primary-button" onClick={() => onViewSkills(category)}>View skills <span>→</span></button>
              </div>
            </article>
          ))}
          {!isLoading && !filteredCategories.length && <div className="admin-empty-state">No categories match this search.</div>}
        </div>
      </section>
    </div>
  )
}

export default AdminCategoriesPage
