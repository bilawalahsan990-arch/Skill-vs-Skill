import { useState } from 'react'
import { getWeekdayNames } from '../../../api/workspaceApi.js'

const days = getWeekdayNames()

function Timetable({ type, slots, selectedDay, onAdd, onRemove, disabled }) {
  const filteredSlots = slots.filter((slot) => slot.type === type && slot.day === selectedDay)
  const title = type === 'teaching' ? 'Teaching timetable' : 'Learning timetable'
  const color = type === 'teaching' ? 'green' : 'purple'

  return (
    <section className={`content-card timetable-card timetable-${type}`}>
      <div className="timetable-header">
        <div><h2>{title}</h2><p>{type === 'teaching' ? 'Set when you are available to teach.' : 'Choose time to learn from the community.'}</p></div>
        <span className={`timetable-count ${color}`}>{slots.filter((slot) => slot.type === type).length} active</span>
      </div>
      <div className="timetable-day-heading">
        <h3>{selectedDay}</h3>
        <span>{filteredSlots.length} time {filteredSlots.length === 1 ? 'slot' : 'slots'} for this day</span>
      </div>
      <div className="timetable-slots">
        {filteredSlots.length ? filteredSlots.map((slot) => (
          <article className="availability-slot-row" key={slot.id}>
            <span className={`slot-type-icon ${color}`}>◷</span>
            <span className="availability-slot-copy">
              <strong>{selectedDay} <small>{slot.start} – {slot.end}</small></strong>
              <span>{slot.label}</span>
            </span>
            <button type="button" className="icon-button remove-slot-button" onClick={() => onRemove(slot.id)} disabled={disabled} aria-label={`Remove ${type} slot ${slot.start}`}>×</button>
          </article>
        )) : (
          <div className="availability-empty"><span>◷</span><p>No time slots on {selectedDay} yet.</p></div>
        )}
      </div>
      <button type="button" className="button button-outline-green add-availability-button" onClick={() => onAdd(type, selectedDay)} disabled={disabled}>＋ Add time</button>
    </section>
  )
}

function AvailabilityPage({ slots, onAddSlot, onRemoveSlot, onBack, onSave, isLoading, isLoaded, isSaving }) {
  const [teachingDay, setTeachingDay] = useState(days[0])
  const [learningDay, setLearningDay] = useState(days[0])

  function renderDaySelector(type, selectedDay, onSelect) {
    return (
      <div className={`availability-day-selector ${type}`} role="group" aria-label={`${type} days`}>
        {days.map((day) => (
          <button type="button" key={day} className={selectedDay === day ? 'is-active' : ''} onClick={() => onSelect(day)}>
            <span>{day.slice(0, 3)}</span>
            {selectedDay === day && <small>{day}</small>}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="page-stack availability-page">
      <section className="page-heading-row">
        <div>
          <button type="button" className="back-link" onClick={onBack}><span aria-hidden="true">‹</span> Profile</button>
          <h1>Set your availability</h1>
          <p>Set teaching and learning hours separately. Each timetable has its own days and time slots.</p>
        </div>
        <span className="availability-status"><i /> {isLoading ? 'Loading schedule…' : 'Save changes to update your schedule'}</span>
      </section>

      <section className="content-card availability-overview">
        <span className="availability-calendar-icon">▦</span>
        <span><strong>Your weekly exchange schedule</strong><small>Choose a day below, then add or remove available time slots.</small></span>
      </section>

      <section className="availability-section">
        <div className="availability-section-heading">
          <div><span className="page-eyebrow">TEACHING</span><h2>When can you teach?</h2></div>
          <span className="timetable-count green">{slots.filter((slot) => slot.type === 'teaching').length} active slots</span>
        </div>
        {renderDaySelector('teaching', teachingDay, setTeachingDay)}
        <Timetable type="teaching" slots={slots} selectedDay={teachingDay} onAdd={onAddSlot} onRemove={onRemoveSlot} disabled={!isLoaded || isSaving} />
      </section>

      <section className="availability-section">
        <div className="availability-section-heading">
          <div><span className="page-eyebrow purple-text">LEARNING</span><h2>When do you want to learn?</h2></div>
          <span className="timetable-count purple">{slots.filter((slot) => slot.type === 'learning').length} active slots</span>
        </div>
        {renderDaySelector('learning', learningDay, setLearningDay)}
        <Timetable type="learning" slots={slots} selectedDay={learningDay} onAdd={onAddSlot} onRemove={onRemoveSlot} disabled={!isLoaded || isSaving} />
      </section>
      <button type="button" className="button button-primary availability-save" onClick={onSave} disabled={!isLoaded || isLoading || isSaving}>{isSaving ? 'Saving…' : 'Save teaching & learning timetables'} <span>→</span></button>
    </div>
  )
}

export default AvailabilityPage
