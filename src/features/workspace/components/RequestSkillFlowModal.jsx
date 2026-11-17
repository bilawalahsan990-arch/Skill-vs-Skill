import { useMemo, useState } from 'react'

function RequestSkillFlowModal({ initialSkill = {}, categories, skills, onClose, onSave }) {
  const [stage, setStage] = useState('request')
  const [categoryId, setCategoryId] = useState(String(initialSkill.categoryId || ''))
  const [skillId, setSkillId] = useState(String(initialSkill.id || ''))
  const [intent, setIntent] = useState(initialSkill.intent || 'Learn')
  const [level, setLevel] = useState('')
  const [tokenRate, setTokenRate] = useState('')
  const [duration, setDuration] = useState('')
  const [topics, setTopics] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const selectedCategoryId = categories.some((category) => String(category.id) === categoryId)
    ? categoryId
    : String(categories[0]?.id || '')
  const categorySkills = useMemo(
    () => skills.filter((skill) => String(skill.categoryId) === selectedCategoryId),
    [selectedCategoryId, skills],
  )
  const selectedSkillId = categorySkills.some((skill) => String(skill.id) === skillId)
    ? skillId
    : String(categorySkills[0]?.id || '')

  function handleConfigure(event) {
    event.preventDefault()
    setStage('configure')
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      await onSave({ skillId: selectedSkillId, intent, level, tokenRate, duration, topics })
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  const selectedSkill = skills.find((skill) => String(skill.id) === selectedSkillId)
  const selectedCategory = categories.find((category) => String(category.id) === selectedCategoryId)

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className={`workspace-modal skill-flow-modal${stage === 'configure' ? ' is-configure-stage' : ''}`} role="dialog" aria-modal="true" aria-labelledby="skill-flow-title">
        <header className="modal-header">
          <div>
            <span className="modal-eyebrow">{stage === 'request' ? 'MARKETPLACE · STEP 1 OF 2' : `${selectedCategory?.name || ''} · ${intent.toUpperCase()}`}</span>
            <h2 id="skill-flow-title">{stage === 'request' ? 'Add a skill listing' : 'Configure skill'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button>
        </header>

        <div className="skill-flow-progress"><span className={stage === 'configure' ? 'is-complete' : ''} /><span className={stage === 'configure' ? 'is-active' : ''} /></div>

        {stage === 'request' ? (
          <form className="skill-request-form" onSubmit={handleConfigure}>
            <label className="form-field">
              <span>Category</span>
              <select value={selectedCategoryId} onChange={(event) => {
                setCategoryId(event.target.value)
                setSkillId('')
              }} required>
                <option value="" disabled>Select a category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>Skill</span>
              <select value={selectedSkillId} onChange={(event) => setSkillId(event.target.value)} required disabled={!categorySkills.length}>
                <option value="" disabled>Select a skill</option>
                {categorySkills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
              </select>
            </label>
            {!categorySkills.length && <p>No skills are available for this category.</p>}
            <fieldset className="skill-intent-fieldset">
              <legend>I want to</legend>
              <div className="skill-intent-options">
                <button type="button" className={intent === 'Learn' ? 'is-selected' : ''} onClick={() => setIntent('Learn')}>Learn</button>
                <button type="button" className={intent === 'Teach' ? 'is-selected' : ''} onClick={() => setIntent('Teach')}>Teach</button>
              </div>
            </fieldset>
            <button type="submit" className="button button-primary skill-request-submit" disabled={!selectedSkill}>Continue to configure <span aria-hidden="true">→</span></button>
            <button type="button" className="skill-flow-cancel" onClick={onClose}>Cancel</button>
          </form>
        ) : (
          <form className="skill-configure-form" onSubmit={handleSave}>
            <div className="configure-skill-summary"><span className="market-skill-icon">⌘</span><span><strong>{selectedSkill?.name}</strong><small>{selectedCategory?.name}</small></span><span className="skill-type-pill">{intent === 'Teach' ? 'Teaching / Offering' : 'Learning'}</span></div>
            <label className="form-field">
              <span>Proficiency level</span>
              <input value={level} onChange={(event) => setLevel(event.target.value)} autoComplete="off" />
            </label>
            <label className="form-field token-rate-field">
              <span>Token rate per hour</span>
              <input type="number" min="0" step="any" value={tokenRate} onChange={(event) => setTokenRate(event.target.value)} />
            </label>
            <label className="form-field">
              <span>Estimated duration</span>
              <input value={duration} onChange={(event) => setDuration(event.target.value)} />
            </label>
            <label className="form-field">
              <span>Topics and specialization</span>
              <textarea value={topics} onChange={(event) => setTopics(event.target.value)} rows="3" />
            </label>
            {error && <p className="skill-flow-error" role="alert">{error}</p>}
            <footer className="modal-actions">
              <button type="button" className="button button-secondary" onClick={() => setStage('request')}>Back</button>
              <span />
              <button type="submit" className="button button-primary" disabled={isSaving}>{isSaving ? 'Saving…' : 'Save listing'}</button>
            </footer>
          </form>
        )}
      </section>
    </div>
  )
}

export default RequestSkillFlowModal
