function valueOf(record, name) {
  return record?.[name] ?? record?.[name[0].toLowerCase() + name.slice(1)]
}

export function mapCurrentUser(user) {
  const name = ['FullName', 'Name', 'UserName']
    .map((field) => valueOf(user, field))
    .find((value) => typeof value === 'string' && value.trim())?.trim() || 'Member'

  return {
    id: valueOf(user, 'UserId'),
    name,
    initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
    city: valueOf(user, 'City') || '',
    address: valueOf(user, 'Address') || '',
    email: valueOf(user, 'Email') || '',
    bio: valueOf(user, 'Bio') || '',
    avatarUrl: valueOf(user, 'AvatarUrl') || '',
  }
}

function initials(fullName = '') {
  return fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function formatTime(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date)
}

export function getWeekdayNames(locale = 'en') {
  const monday = new Date()
  monday.setHours(12, 0, 0, 0)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date)
  })
}

export function mapMarketplaceCategory(category) {
  return {
    id: valueOf(category, 'CategoryId') ?? valueOf(category, 'Id'),
    name: valueOf(category, 'Name'),
    description: valueOf(category, 'Description') || '',
    skills: valueOf(category, 'Skills') ?? 0,
    users: valueOf(category, 'Users') ?? 0,
  }
}

export function mapMarketplaceSkill(skill) {
  const description = valueOf(skill, 'Description') || ''
  return {
    id: valueOf(skill, 'SkillId') ?? valueOf(skill, 'Id'),
    categoryId: valueOf(skill, 'CategoryId'),
    category: valueOf(skill, 'CategoryName') || valueOf(skill, 'Category') || '',
    name: valueOf(skill, 'Name'),
    subtitle: valueOf(skill, 'Requirements') || description,
    description,
    status: valueOf(skill, 'Status'),
    mentors: valueOf(skill, 'Teachers') ?? 0,
    learners: valueOf(skill, 'Learners') ?? 0,
  }
}

export function mapMarketplaceMember(member) {
  const name = valueOf(member, 'FullName') || valueOf(member, 'UserName') || 'Member'
  return {
    id: valueOf(member, 'UserId'),
    listingId: valueOf(member, 'UserSkillId'),
    name,
    initials: initials(name),
    avatarUrl: valueOf(member, 'AvatarUrl') || '',
    city: valueOf(member, 'City') || '',
    skillId: valueOf(member, 'SkillId'),
    skillName: valueOf(member, 'SkillName') || '',
    intent: valueOf(member, 'SkillIntent') || '',
    proficiency: valueOf(member, 'Proficiency') || '',
    duration: valueOf(member, 'Duration') || '',
    tokenRate: valueOf(member, 'TokenRate') ?? 0,
    topics: valueOf(member, 'Topics') || '',
  }
}

export function mapSession(session, currentUserId) {
  const teacherUserId = Number(valueOf(session, 'TeacherUserId'))
  const learnerUserId = Number(valueOf(session, 'LearnerUserId'))
  const requestedByUserId = Number(valueOf(session, 'RequestedByUserId'))
  const isTeacher = teacherUserId === Number(currentUserId)

  return {
    id: valueOf(session, 'SessionId'),
    status: valueOf(session, 'Status') || '',
    skillId: valueOf(session, 'SkillId'),
    skillName: valueOf(session, 'SkillName') || '',
    teacherUserId,
    learnerUserId,
    requestedByUserId,
    canRespond: requestedByUserId !== Number(currentUserId),
    otherUserId: isTeacher ? learnerUserId : teacherUserId,
    otherUserName: isTeacher
      ? valueOf(session, 'LearnerName') || 'Member'
      : valueOf(session, 'TeacherName') || 'Member',
    otherUserAvatar: isTeacher
      ? valueOf(session, 'LearnerAvatar') || ''
      : valueOf(session, 'TeacherAvatar') || '',
    currentUserIntent: isTeacher ? 'Offer' : 'Learn',
    scheduledStart: valueOf(session, 'ScheduledStart'),
    scheduledEnd: valueOf(session, 'ScheduledEnd'),
    tokenRate: valueOf(session, 'TokenRate') ?? 0,
    tokenAmount: valueOf(session, 'TokenAmount') ?? 0,
    createdAt: valueOf(session, 'CreatedAt'),
  }
}

export function mapSessionMatch(match) {
  const name = valueOf(match, 'OtherUserName') || 'Member'
  return {
    userId: valueOf(match, 'OtherUserId'),
    name,
    initials: initials(name),
    avatarUrl: valueOf(match, 'OtherUserAvatar') || '',
    skillId: valueOf(match, 'SkillId'),
    skillName: valueOf(match, 'SkillName') || '',
    intent: valueOf(match, 'CurrentUserIntent') || '',
    matchType: valueOf(match, 'MatchType') || '',
    matchingDays: valueOf(match, 'MatchingDays') || [],
    matchingSlots: valueOf(match, 'MatchingSlots') || [],
  }
}

export function mapAdminUser(user) {
  const name = valueOf(user, 'Name') || 'Member'
  return {
    id: valueOf(user, 'Id'),
    name,
    initials: initials(name),
    handle: valueOf(user, 'Handle') || '',
    location: valueOf(user, 'Location') || '',
    joined: valueOf(user, 'Joined') || '',
    status: valueOf(user, 'IsActive') ? 'Active' : 'Suspended',
    verified: Boolean(valueOf(user, 'IsVerified')),
    swaps: valueOf(user, 'Swaps') ?? 0,
    rating: valueOf(user, 'Rating') ?? 0,
    tokens: valueOf(user, 'TokenCredits') ?? 0,
    spent: valueOf(user, 'SpentTokens') ?? 0,
    avatarUrl: valueOf(user, 'AvatarUrl') || '',
    offeredSkills: valueOf(user, 'OfferedSkills') || [],
    learningSkills: valueOf(user, 'LearningSkills') || [],
  }
}

export function mapAdminSkillRequest(request) {
  const name = valueOf(request, 'Requester') || 'Member'
  return {
    id: valueOf(request, 'Id'),
    skill: valueOf(request, 'Skill') || '',
    requester: name,
    initials: initials(name),
    location: valueOf(request, 'Location') || '',
    age: valueOf(request, 'Time') || '',
    category: valueOf(request, 'Category') || '',
    description: valueOf(request, 'Description') || '',
    status: 'pending',
  }
}

export function mapAvailabilitySlot(slot) {
  const scheduleType = valueOf(slot, 'ScheduleType') || ''
  const dayNumber = Number(valueOf(slot, 'DayOfWeek'))
  const days = getWeekdayNames()
  const day = days[dayNumber - 1]
  if (!day) throw new Error('The availability API returned an invalid day of week.')
  const time = (value) => String(value || '').slice(0, 5)

  return {
    id: valueOf(slot, 'AvailabilitySlotId'),
    type: scheduleType.toLowerCase() === 'teaching' ? 'teaching' : 'learning',
    day,
    start: time(valueOf(slot, 'StartTime')),
    end: time(valueOf(slot, 'EndTime')),
    label: scheduleType,
  }
}

export function mapConversation(conversation, skills = []) {
  const name = valueOf(conversation, 'OtherUserName') || 'Unknown member'
  const conversationId = valueOf(conversation, 'ConversationId')
  const lastMessageAt = valueOf(conversation, 'LastMessageAt')
  const skillId = valueOf(conversation, 'SkillId')
  const skill = skills.find((item) => Number(item.id) === Number(skillId))

  return {
    id: String(conversationId),
    name,
    initials: initials(name),
    skill: skill?.name || '',
    preview: valueOf(conversation, 'LastMessage') || 'No messages yet',
    time: formatTime(lastMessageAt),
    lastMessageAt,
    unreadCount: valueOf(conversation, 'UnreadCount') ?? 0,
  }
}

export function mapChatMessage(message) {
  return {
    id: valueOf(message, 'MessageId'),
    from: valueOf(message, 'IsMine') ? 'you' : 'them',
    text: valueOf(message, 'Body') || '',
    time: formatTime(valueOf(message, 'SentAt')),
  }
}
