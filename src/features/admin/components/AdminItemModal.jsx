import { useState } from 'react'

function AdminItemModal({ type, item, categories, onClose, onSave }) {
  const [name, setName] = useState(item?.name || '')
  const [categoryId, setCategoryId] = useState(String(item?.categoryId || ''))
  const [description, setDescription] = useState(item?.description || '')
  const [requirements, setRequirements] = useState(item?.requirements || '')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const isSkill = type === 'skill'

  const selectedCategoryId = categories.some((category) => String(category.id) === categoryId)
    ? categoryId
    : String(categories[0]?.id || '')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      await onSave({ ...item, name, categoryId, description, requirements })
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-item-modal-title">
        <header className="admin-modal-header">
          <div><span className="admin-eyebrow">CATALOG MANAGEMENT</span><h2 id="admin-item-modal-title">{item ? 'Edit' : 'Add'} {isSkill ? 'skill' : 'category'}</h2></div>
          <button type="button" className="admin-close-button" onClick={onClose} aria-label="Close dialog">×</button>
        </header>
        <form className="admin-modal-form" onSubmit={handleSubmit}>
          <label><span>{isSkill ? 'Skill name' : 'Category name'}</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>
          {isSkill && (
            <label>
              <span>Domain category</span>
              <select value={selectedCategoryId} onChange={(event) => setCategoryId(event.target.value)} required>
                <option value="" disabled>Select a category</option>
                {categories.map((categoryItem) => <option key={categoryItem.id} value={categoryItem.id}>{categoryItem.name}</option>)}
              </select>
            </label>
          )}
          <label><span>Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows="3" /></label>
          {isSkill && <label><span>Requirements</span><textarea value={requirements} onChange={(event) => setRequirements(event.target.value)} rows="3" /></label>}
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <footer className="admin-modal-actions">
            <button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-primary-button" disabled={isSaving || (isSkill && !categories.length)}>{isSaving ? 'Saving…' : item ? 'Save changes' : `Add ${isSkill ? 'skill' : 'category'}`}</button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default AdminItemModal
