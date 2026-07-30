import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AppShell } from '../components/AppShell'
import { WorkoutCard } from '../components/WorkoutCard'
import { supabase } from '../lib/supabaseClient'
import { LEVEL_LABEL, LEVEL_ORDER, type FitnessLevel } from '../lib/levels'

async function fetchWorkouts() {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export function Workouts() {
  const [filter, setFilter] = useState<FitnessLevel | 'todos'>('todos')
  const { data, isLoading, isError } = useQuery({ queryKey: ['workouts'], queryFn: fetchWorkouts })

  const filtered = data?.filter((w) => filter === 'todos' || w.level === filter) ?? []

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-ink-900">Treinos de Glúteos</h1>
        <p className="mt-1 text-sm text-ink-500">Escolha o nível ideal para você hoje.</p>
      </header>

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        <FilterPill active={filter === 'todos'} onClick={() => setFilter('todos')}>
          Todos
        </FilterPill>
        {LEVEL_ORDER.map((level) => (
          <FilterPill key={level} active={filter === level} onClick={() => setFilter(level)}>
            {LEVEL_LABEL[level]}
          </FilterPill>
        ))}
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white ring-1 ring-ink-100" />
          ))}
        </div>
      )}

      {isError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">Não foi possível carregar os treinos.</p>
      )}

      <div className="space-y-3">
        {filtered.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </AppShell>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? 'bg-bloom-600 text-white shadow-sm' : 'bg-white text-ink-700 ring-1 ring-ink-100'
      }`}
    >
      {children}
    </button>
  )
}
