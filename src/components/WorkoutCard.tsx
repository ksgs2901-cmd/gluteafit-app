import { Link } from 'react-router-dom'
import { ClockIcon, DumbbellIcon } from './icons'
import { LevelBadge } from './LevelBadge'
import type { Tables } from '../types/database'

export function WorkoutCard({ workout }: { workout: Tables<'workouts'> }) {
  return (
    <Link
      to={`/treinos/${workout.slug}`}
      className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-ink-100 transition hover:shadow-md"
    >
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ background: `linear-gradient(135deg, ${workout.cover_color}, ${workout.cover_color}cc)` }}
      >
        <DumbbellIcon className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <LevelBadge level={workout.level} />
        </div>
        <h3 className="truncate text-base font-semibold text-ink-900">{workout.title}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500">
          <ClockIcon className="h-4 w-4" /> {workout.estimated_minutes} min
        </p>
      </div>
    </Link>
  )
}
