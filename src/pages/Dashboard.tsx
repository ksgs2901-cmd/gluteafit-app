import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { LevelBadge } from '../components/LevelBadge'
import { ClockIcon, DumbbellIcon, FlameIcon } from '../components/icons'
import { fetchDashboard } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })

  const firstName = (data?.profile.display_name || user?.email || '').split(' ')[0]

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-sm text-ink-500">Olá,</p>
        <h1 className="text-2xl font-bold text-ink-900">{firstName || 'bem-vinda'} 👋</h1>
      </header>

      {isLoading && <DashboardSkeleton />}

      {isError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          Não foi possível carregar seu painel: {(error as Error).message}
        </p>
      )}

      {data && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-3">
            <StatCard icon={<FlameIcon className="h-5 w-5" />} label="Sequência" value={`${data.profile.current_streak}d`} />
            <StatCard icon={<DumbbellIcon className="h-5 w-5" />} label="Treinos" value={String(data.profile.total_sessions)} />
            <StatCard icon={<ClockIcon className="h-5 w-5" />} label="Minutos" value={String(data.profile.total_minutes)} />
          </div>

          {data.suggested_workout && (
            <section className="mb-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Treino sugerido</h2>
              <Link
                to={`/treinos/${data.suggested_workout.slug}`}
                className="block rounded-2xl p-5 text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${data.suggested_workout.cover_color}, ${data.suggested_workout.cover_color}99)`,
                }}
              >
                <LevelBadge level={data.suggested_workout.level} />
                <h3 className="mt-2 text-xl font-bold">{data.suggested_workout.title}</h3>
                <p className="mt-1 text-sm text-white/90">{data.suggested_workout.description}</p>
                <p className="mt-3 flex items-center gap-1 text-sm font-medium text-white/90">
                  <ClockIcon className="h-4 w-4" /> {data.suggested_workout.estimated_minutes} min · Toque para começar
                </p>
              </Link>
            </section>
          )}

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Últimos treinos</h2>
            {data.recent_sessions.length === 0 ? (
              <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-ink-500 ring-1 ring-ink-100">
                Você ainda não concluiu nenhum treino. Que tal começar agora?
              </p>
            ) : (
              <ul className="space-y-2">
                {data.recent_sessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-ink-100"
                  >
                    <span className="font-medium text-ink-900">{s.workouts?.title ?? 'Treino'}</span>
                    <span className="text-ink-500">{new Date(s.completed_at).toLocaleDateString('pt-BR')}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
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

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-white ring-1 ring-ink-100" />
        ))}
      </div>
      <div className="h-36 rounded-2xl bg-white ring-1 ring-ink-100" />
      <div className="h-24 rounded-xl bg-white ring-1 ring-ink-100" />
    </div>
  )
}
