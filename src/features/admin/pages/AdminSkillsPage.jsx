import { useMemo, useState } from 'react'

function AdminSkillsPage({ skills, categories, categoryFilter, isLoading, onAdd }) {
  const [filter, setFilter] = useState(categoryFilter || 'All')
  const [query, setQuery] = useState('')
  const filteredSkills = useMemo(() => skills.filter((skill) => (
    skill.name.toLowerCase().includes(query.toLowerCase())
    && (filter === 'All' || skill.category === filter)
  )), [filter, query, skills])

  return (
    <div className="admin-page-stack">
      <section className="admin-page-heading">
        <div><span className="admin-eyebrow">CATALOG MANAGEMENT</span><h1>Skills</h1><p>Manage and organize skills available to the community.</p></div>
        <button type="button" className="admin-primary-button" onClick={() => onAdd('skill')}>＋ Add new skill</button>
      </section>

      <section className="admin-list-panel">
        <div className="admin-skill-summary"><strong>{skills.length} <small>Total skills in catalog</small></strong><button type="button" className="admin-filter-button">☷ Filter</button></div>
        <div className="admin-filter-chips">
          {['All', ...categories.map((category) => category.name)].map((value) => (
            <button type="button" className={filter === value ? 'is-active' : ''} key={value} onClick={() => setFilter(value)}>{value}</button>
          ))}
        </div>
        <label className="admin-search-input admin-skill-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skill by name, category..." aria-label="Search catalog skills" /></label>
        <div className="admin-catalog-list">
          {isLoading ? <div className="admin-empty-state">Loading skills…</div> : filteredSkills.map((skill) => (
            <article className="admin-catalog-card" key={skill.id}>
              <span className="catalog-skill-icon">▧</span>
              <div className="catalog-skill-info">
                <div className="catalog-title-row"><strong>{skill.name}</strong><span className="admin-live-label"><i /> {skill.status || 'Active'}</span></div>
                <small>{skill.category}</small>
                <div className="catalog-skill-stats"><span>♙ {skill.mentors} Tutors</span><span>◉ {skill.learners} Learners</span></div>
              </div>
              <div className="catalog-actions">
                <span>{skill.status}</span>
              </div>
            </article>
          ))}
          {!isLoading && !filteredSkills.length && <div className="admin-empty-state">No catalog skills match this search.</div>}
        </div>
        <div className="admin-list-footer"><span>Showing {filteredSkills.length} skills</span><button type="button" className="admin-primary-button" onClick={() => onAdd('skill')}>＋ Add new skill</button></div>
      </section>
    </div>
  )
}

export default AdminSkillsPage
