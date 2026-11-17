import { useMemo, useState } from 'react'

function MarketplacePage({ skills, categories, isLoading, onViewSkill, onRequestSkill }) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const category = categories.some((item) => item.name === selectedCategory)
    ? selectedCategory
    : categories[0]?.name || ''

  const filteredSkills = useMemo(() => skills.filter((skill) => (
    skill.category === category
    && `${skill.name} ${skill.subtitle}`.toLowerCase().includes(query.toLowerCase())
  )), [category, query, skills])

  return (
    <div className="page-stack marketplace-page">
      <section className="page-heading-row marketplace-heading">
        <div>
          <span className="page-eyebrow">LEARN SOMETHING NEW</span>
          <h1>Marketplace</h1>
          <p>Map your skills and find people to learn from.</p>
        </div>
        <span className="experts-count"><strong>{skills.length}</strong> skills</span>
      </section>

      <section className="content-card marketplace-tools">
        <div className="market-category-row">
          <div className="market-current-category">
            <span className="market-icon" aria-hidden="true">⌘</span>
            <span><small>CATEGORY</small><strong>{category || 'No categories available'}</strong></span>
          </div>
          <label className="market-category-select">
            <span className="visually-hidden">Select skill category</span>
            <select value={category} onChange={(event) => setSelectedCategory(event.target.value)}>
              {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
          </label>
        </div>
        <div className="market-search-row">
          <label className="market-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search skills in ${category}...`} aria-label={`Search skills in ${category}`} />
          </label>
          <button type="button" className="button button-outline-green" onClick={() => onRequestSkill({ categoryId: categories.find((item) => item.name === category)?.id, intent: 'Learn' })} disabled={!skills.length}>
            <span aria-hidden="true">＋</span> Add a skill listing
          </button>
        </div>
      </section>

      <section className="marketplace-skills-section">
        <div className="marketplace-section-heading">
          <div><h2>Available in {category}</h2><p>Browse skills offered by community members.</p></div>
          <button className="text-filter-button" type="button" onClick={() => setQuery('')}>Quick add <span>⌄</span></button>
        </div>
        {isLoading ? (
          <div className="empty-schedule marketplace-empty"><strong>Loading marketplace…</strong></div>
        ) : filteredSkills.length ? (
          <div className="market-skill-grid">
            {filteredSkills.map((skill) => (
              <article className="market-skill-card" key={skill.id}>
                <button className="market-skill-main" type="button" onClick={() => onViewSkill(skill)}>
                  <span className="market-skill-icon">{skill.name?.[0]?.toUpperCase()}</span>
                  <span className="market-skill-copy">
                    <span><small>{skill.category} <i>·</i> {skill.status}</small></span>
                    <strong>{skill.name}</strong>
                    <small>{skill.subtitle}</small>
                  </span>
                  <span className="market-skill-arrow" aria-hidden="true">↗</span>
                </button>
                <div className="market-skill-actions">
                  <span>AVAILABLE IN {category.toUpperCase()}</span>
                  <button type="button" onClick={() => onRequestSkill({ ...skill, intent: 'Teach' })}>＋ Offer</button>
                  <button type="button" onClick={() => onRequestSkill({ ...skill, intent: 'Learn' })}>＋ Learn</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-schedule marketplace-empty">
            <span aria-hidden="true">⌕</span>
            <strong>No skills found</strong>
            <p>There are no marketplace skills matching this category and search.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default MarketplacePage
