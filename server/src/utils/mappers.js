// ── SHARED ROW → OBJECT MAPPERS ──
// The database uses snake_case columns; the API contract is camelCase.
// Every controller that returns raw rows should map them through these.

function parseIntSafe(value) {
  const n = parseInt(value)
  return Number.isNaN(n) ? 0 : n
}

// ── CONNECTIONS (student view) ──
export function mapMentorConnection(r) {
  return {
    id:        r.id,
    status:    r.status,
    createdAt: r.created_at,
    mentor: {
      id:        r.mentor_id || r.id,
      firstName: r.first_name,
      lastName:  r.last_name,
      avatarUrl: r.avatar_url,
      title:     r.title,
      company:   r.company,
      field:     r.field,
    },
  }
}

// ── MENTORS ──
export function mapMentorListItem(r) {
  return {
    id:             r.id,
    firstName:      r.first_name,
    lastName:       r.last_name,
    avatarUrl:      r.avatar_url,
    title:          r.title,
    company:        r.company,
    field:          r.field,
    mentoringAreas: r.mentoring_areas || [],
    sessionType:    r.session_type,
    availability:   r.availability,
    bio:            r.bio,
    sessions:       parseIntSafe(r.sessions),
    available:      !r.is_busy,
  }
}

export function mapMentorDetail(r) {
  return {
    id:             r.id,
    firstName:      r.first_name,
    lastName:       r.last_name,
    avatarUrl:      r.avatar_url,
    title:          r.title,
    company:        r.company,
    field:          r.field,
    mentoringAreas: r.mentoring_areas || [],
    sessionType:    r.session_type,
    availability:   r.availability,
    hoursPerMonth:  r.hours_per_month,
    bio:            r.bio,
    linkedinUrl:    r.linkedin_url,
    portfolioUrl:   r.portfolio_url,
    sessions:       parseIntSafe(r.sessions),
    available:      !r.is_busy,
  }
}

// ── COMMUNITY ──
export function mapPost(r) {
  return {
    id:         r.id,
    body:       r.body,
    category:   r.category,
    createdAt:  r.created_at,
    likes:      parseIntSafe(r.likes),
    replies:    parseIntSafe(r.replies),
    liked:      Boolean(r.liked),
    userId:     r.user_id,
    firstName:  r.first_name,
    lastName:   r.last_name,
    avatarUrl:  r.avatar_url,
  }
}

export function mapReply(r) {
  return {
    id:        r.id,
    postId:    r.post_id,
    userId:    r.user_id,
    body:      r.body,
    createdAt: r.created_at,
    firstName: r.first_name,
    lastName:  r.last_name,
    avatarUrl: r.avatar_url,
  }
}

// ── CAREERS ──
export function mapCareer(r) {
  return {
    id:           r.id,
    icon:         r.icon,
    title:        r.title,
    field:        r.field,
    combinations: r.combinations || [],
    salaryMin:    r.salary_min,
    salaryMax:    r.salary_max,
    demandLevel:  r.demand_level,
    duration:     r.duration,
    universities: r.universities || [],
    description:  r.description,
    skills:       r.skills || [],
  }
}

// ── OPPORTUNITIES ──
export function mapOpportunity(r) {
  return {
    id:           r.id,
    icon:         r.icon,
    title:        r.title,
    org:          r.org,
    description:  r.description,
    deadline:     r.deadline,
    daysLeft:     parseIntSafe(r.days_left),
    type:         r.type,
    field:        r.field,
    requirements: r.requirements || [],
    link:         r.link,
    saved:        Boolean(r.saved),
  }
}

// ── RESOURCES ──
export function mapResource(r) {
  return {
    id:            r.id,
    icon:          r.icon,
    title:         r.title,
    description:   r.description,
    type:          r.type,
    category:      r.category,
    fileUrl:       r.file_url,
    externalUrl:   r.external_url,
    sizeMb:        r.size_mb,
    durationMin:   r.duration_min,
    readTimeMin:   r.read_time_min,
    downloadCount: parseIntSafe(r.download_count),
    viewCount:     parseIntSafe(r.view_count),
  }
}
