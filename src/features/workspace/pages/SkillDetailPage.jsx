function SkillDetailPage({ skill, members, currentUserId, isLoading, onBack, onBookSession, onOfferSkill }) {
  const tutors = members.filter((member) => Number(member.id) !== Number(currentUserId))

  return (
    <div className="page-stack skill-detail-page">
      <section className="page-heading-row skill-detail-heading">
        <div>
          <button type="button" className="back-link" onClick={onBack}><span aria-hidden="true">‹</span> Marketplace</button>
          <h1>Skill detail</h1>
        </div>
      </section>

      <section className="skill-detail-hero">
        <div className="skill-detail-icon">{skill.name?.[0]?.toUpperCase()}</div>
        <div className="skill-detail-title">
          <span>{skill.category}</span>
          <h2>{skill.name}</h2>
          <p>{skill.subtitle || skill.description}</p>
        </div>
        <span className="expert-level">{skill.status}</span>
      </section>

      <div className="skill-detail-grid">
        <div className="skill-detail-main">
          <section className="content-card skill-description-card">
            <h2>Description</h2>
            <p>{skill.description || skill.subtitle}</p>
          </section>

          <section className="content-card tutor-list-card">
            <div className="section-heading">
              <div><h2>Members offering this skill <span className="subtle-count">{tutors.length}</span></h2></div>
            </div>
            {isLoading ? <div className="empty-schedule"><strong>Loading members…</strong></div> : tutors.length ? (
              <div className="tutor-list">
                {tutors.map((tutor) => (
                  <article className="tutor-card" key={tutor.listingId}>
                    <span className="avatar avatar-user">{tutor.initials}</span>
                    <div className="tutor-main">
                      <div className="tutor-name-row"><strong>{tutor.name}</strong><span className="tutor-title">{tutor.proficiency}</span></div>
                      <div className="tutor-metadata"><span>{tutor.city}</span><span>{tutor.duration}</span></div>
                      <div className="tutor-tags">
                        {tutor.topics.split(',').map((topic) => topic.trim()).filter(Boolean).map((topic) => <span key={topic}>{topic}</span>)}
                        <b>{tutor.tokenRate} tokens/hr</b>
                      </div>
                    </div>
                    <button type="button" className="button button-primary tutor-book" onClick={() => onBookSession({ ...tutor, skillId: skill.id })}>Request session</button>
                  </article>
                ))}
              </div>
            ) : <div className="empty-schedule"><strong>No members are currently offering this skill.</strong></div>}
          </section>
        </div>

        <aside className="skill-detail-aside">
          <section className="content-card mentor-prompt-card">
            <span className="mentor-prompt-icon">✦</span>
            <h2>Offer this skill</h2>
            <p>Add your own listing for this marketplace skill.</p>
            <button type="button" className="button button-secondary full-button" onClick={onOfferSkill}>Create listing</button>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default SkillDetailPage
