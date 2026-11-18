import sql from '../db.js'

export async function calculateProgress(userId) {
  // Run all queries in parallel
  const [
    user,
    studentProfile,
    careerViewsResult,
    sessionsResult,
    connectionsResult,
    postsResult,
    savedOppsResult,
  ] = await Promise.all([
    sql`SELECT * FROM users WHERE id = ${userId} LIMIT 1`,
    sql`SELECT * FROM student_profiles WHERE user_id = ${userId} LIMIT 1`,
    sql`SELECT COUNT(*) AS count FROM career_views WHERE user_id = ${userId}`,
    sql`SELECT * FROM sessions WHERE student_id = ${userId} ORDER BY scheduled_at DESC`,
    sql`SELECT COUNT(*) AS count FROM mentor_connections WHERE student_id = ${userId} AND status = 'accepted'`,
    sql`SELECT COUNT(*) AS count FROM community_posts WHERE user_id = ${userId}`,
    sql`SELECT COUNT(*) AS count FROM saved_opportunities WHERE user_id = ${userId}`,
  ])

  const u  = user[0]
  const sp = studentProfile[0] || {}
  const careerViews    = parseInt(careerViewsResult[0]?.count  || 0)
  const connections    = parseInt(connectionsResult[0]?.count  || 0)
  const communityPosts = parseInt(postsResult[0]?.count        || 0)
  const savedOpps      = parseInt(savedOppsResult[0]?.count    || 0)

  // ── PROFILE SECTION ──
  const profileItems = [
    { name: 'Basic Info',          done: !!(u.first_name && u.last_name && u.email) },
    { name: 'Combination',         done: !!sp.combination },
    { name: 'Career Interests',    done: (sp.career_interests?.length || 0) > 0 },
    { name: 'School',              done: !!sp.school },
    { name: 'Region',              done: !!sp.region },
    { name: 'Goals',               done: !!sp.goals },
    { name: 'Bio',                 done: !!sp.bio },
    { name: 'Profile Photo',       done: !!u.avatar_url },
    { name: 'Target Universities', done: (sp.target_universities?.length || 0) > 0 },
  ]
  const profileDone    = profileItems.filter(i => i.done).length
  const profilePercent = Math.round((profileDone / profileItems.length) * 100)

  // ── CAREER EXPLORATION SECTION ──
  const careerItems = [
    { name: 'Viewed 1 career',   done: careerViews >= 1  },
    { name: 'Viewed 3 careers',  done: careerViews >= 3  },
    { name: 'Viewed 5 careers',  done: careerViews >= 5  },
    { name: 'Viewed 10 careers', done: careerViews >= 10 },
    { name: 'Set career interests', done: (sp.career_interests?.length || 0) > 0 },
  ]
  const careerDone    = careerItems.filter(i => i.done).length
  const careerPercent = Math.round((careerDone / careerItems.length) * 100)

  // ── MENTORSHIP SECTION ──
  const completedSessions = sessionsResult.filter(s => s.status === 'completed').length
  const mentorItems = [
    { name: 'First connection request', done: connections >= 1 || sessionsResult.length >= 1 },
    { name: 'First session completed',  done: completedSessions >= 1 },
    { name: 'Second session completed', done: completedSessions >= 2 },
  ]
  const mentorDone    = mentorItems.filter(i => i.done).length
  const mentorPercent = Math.round((mentorDone / mentorItems.length) * 100)

  // ── COMMUNITY SECTION ──
  const communityItems = [
    { name: 'First post',           done: communityPosts >= 1 },
    { name: 'Posted 3 times',       done: communityPosts >= 3 },
    { name: 'Saved an opportunity', done: savedOpps >= 1 },
  ]
  const communityDone    = communityItems.filter(i => i.done).length
  const communityPercent = Math.round((communityDone / communityItems.length) * 100)

  // ── OVERALL ──
  const overall = Math.round(
    (profilePercent + careerPercent + mentorPercent + communityPercent) / 4
  )

  // ── STREAK (days active - simplified) ──
  const streak = 0 // TODO: track daily logins in a separate table when needed

  // ── BADGES ──
  const badges = [
    { icon: '🎯', label: 'Profile Pioneer',   desc: 'Completed your profile setup',      earned: profilePercent >= 50 },
    { icon: '🧑‍🏫', label: 'First Connection',  desc: 'Sent your first mentor request',    earned: connections >= 1 || sessionsResult.length >= 1 },
    { icon: '📚', label: 'Career Explorer',   desc: 'Viewed 10+ career paths',           earned: careerViews >= 10 },
    { icon: '🏆', label: 'Top Student',       desc: 'Maintain a 14-day streak',          earned: streak >= 14 },
    { icon: '🌟', label: 'Community Star',    desc: 'Posted 5+ times in community',      earned: communityPosts >= 5 },
    { icon: '🚀', label: 'Go-Getter',         desc: 'Save 3 or more opportunities',      earned: savedOpps >= 3 },
  ]

  return {
    overall,
    streak,
    sections: [
      { label: 'Profile',           percent: profilePercent,   done: profileDone,    total: profileItems.length,    items: profileItems    },
      { label: 'Career Exploration',percent: careerPercent,    done: careerDone,     total: careerItems.length,     items: careerItems     },
      { label: 'Mentorship',        percent: mentorPercent,    done: mentorDone,     total: mentorItems.length,     items: mentorItems     },
      { label: 'Community',         percent: communityPercent, done: communityDone,  total: communityItems.length,  items: communityItems  },
    ],
    badges,
    sessions: sessionsResult.map(s => ({
      mentor:   s.mentor_id,
      topic:    s.topic,
      date:     new Date(s.scheduled_at).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }),
      status:   s.status.charAt(0).toUpperCase() + s.status.slice(1),
    })),
  }
}