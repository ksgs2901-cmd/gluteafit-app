import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { LevelBadge } from '../components/LevelBadge'
import { ClockIcon, DumbbellIcon, FlameIcon } from '../components/icons'
import { supabase } from '../lib/supabaseClient'
import { useLocalProgress } from '../hooks/useLocalProgress'
import type { FitnessLevel } from '../lib/levels'

async function fetchSuggestedWorkout(level: FitnessLevel) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('level', level)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export function Dashboard() {
  const { progress } = useLocalProgress()
  const { data: suggestedWorkout, isLoading, isError } = useQuery({
    queryKey: ['suggested-workout', progress.level],
    queryFn: () => fetchSuggestedWorkout(progress.level),
  })

  const firstName = progress.displayName.split(' ')[0]

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-sm text-ink-500">Olá,</p>
        <h1 className="text-2xl font-bold text-ink-900">{firstName || 'bem-vinda'} 👋</h1>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard icon={<FlameIcon className="h-5 w-5" />} label="Sequência" value={`${progress.currentStreak}d`} />
        <StatCard icon={<DumbbellIcon className="h-5 w-5" />} label="Treinos" value={String(progress.totalSessions)} />
        <StatCard icon={<ClockIcon className="h-5 w-5" />} label="Minutos" value={String(progress.totalMinutes)} />
      </div>

      {isLoading && <div className="mb-6 h-36 animate-pulse rounded-2xl bg-white ring-1 ring-ink-100" />}
      {isError && (
        <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">Não foi possível carregar o treino sugerido.</p>
      )}

      {suggestedWorkout && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Treino sugerido</h2>
          <Link
            to={`/treinos/${suggestedWorkout.slug}`}
            className="block rounded-2xl p-5 text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${suggestedWorkout.cover_color}, ${suggestedWorkout.cover_color}99)`,
            }}
          >
            <LevelBadge level={suggestedWorkout.level} />
            <h3 className="mt-2 text-xl font-bold">{suggestedWorkout.title}</h3>
            <p className="mt-1 text-sm text-white/90">{suggestedWorkout.description}</p>
            <p className="mt-3 flex items-center gap-1 text-sm font-medium text-white/90">
              <ClockIcon className="h-4 w-4" /> {suggestedWorkout.estimated_minutes} min · Toque para começar
            </p>
          </Link>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Últimos treinos</h2>
        {progress.recentSessions.length === 0 ? (
          <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 ring-1 ring-ink-100">
            Você ainda não concluiu nenhum treino. Que tal começar agora?
          </p>
        ) : (
          <ul className="space-y-2">
            {progress.recentSessions.map((s) => (
              <li
                key={`${s.workoutId}-${s.completedAt}`}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-ink-100"
              >
                <span className="font-medium text-ink-900">{s.workoutTitle}</span>
                <span className="text-ink-500">{new Date(s.completedAt).toLocaleDateString('pt-BR')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-ink-100">
      <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-bloom-50 text-bloom-600">
        {icon}
      </div>
      <p className="text-lg font-bold text-ink-900">{value}</p>
      <p className="text-[11px] text-ink-500">{label}</p>
    </div>
  )
}
