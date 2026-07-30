import type { FitnessLevel } from './levels'

const STORAGE_KEY = 'gluteafit_progress_v1'
const MAX_RECENT_SESSIONS = 5

export interface RecentSession {
  workoutId: string
  workoutSlug: string
  workoutTitle: string
  completedAt: string
  durationSeconds: number
}

export interface LocalProgress {
  displayName: string
  level: FitnessLevel
  currentStreak: number
  longestStreak: number
  totalSessions: number
  totalMinutes: number
  lastWorkoutAt: string | null
  recentSessions: RecentSession[]
}

const DEFAULT_PROGRESS: LocalProgress = {
  displayName: '',
  level: 'iniciante',
  currentStreak: 0,
  longestStreak: 0,
  totalSessions: 0,
  totalMinutes: 0,
  lastWorkoutAt: null,
  recentSessions: [],
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function loadProgress(): LocalProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROGRESS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_PROGRESS, ...parsed }
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function saveProgress(progress: LocalProgress) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function updateProfile(partial: Partial<Pick<LocalProgress, 'displayName' | 'level'>>): LocalProgress {
  const current = loadProgress()
  const next = { ...current, ...partial }
  saveProgress(next)
  return next
}

export function recordWorkoutCompletion(
  workout: { id: string; slug: string; title: string },
  durationSeconds: number
): LocalProgress {
  const current = loadProgress()
  const now = new Date()
  const lastWorkoutAt = current.lastWorkoutAt ? new Date(current.lastWorkoutAt) : null

  let currentStreak = 1
  if (lastWorkoutAt) {
    const daysSince = Math.floor(
      (startOfDay(now).getTime() - startOfDay(lastWorkoutAt).getTime()) / 86_400_000
    )
    if (daysSince === 0) currentStreak = current.currentStreak || 1
    else if (daysSince === 1) currentStreak = (current.currentStreak || 0) + 1
    else currentStreak = 1
  }

  const session: RecentSession = {
    workoutId: workout.id,
    workoutSlug: workout.slug,
    workoutTitle: workout.title,
    completedAt: now.toISOString(),
    durationSeconds,
  }

  const next: LocalProgress = {
    ...current,
    currentStreak,
    longestStreak: Math.max(current.longestStreak, currentStreak),
    totalSessions: current.totalSessions + 1,
    totalMinutes: current.totalMinutes + Math.round(durationSeconds / 60),
    lastWorkoutAt: now.toISOString(),
    recentSessions: [session, ...current.recentSessions].slice(0, MAX_RECENT_SESSIONS),
  }

  saveProgress(next)
  return next
}
