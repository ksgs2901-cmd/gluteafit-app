import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { LevelBadge } from '../components/LevelBadge'
import { VideoModal } from '../components/VideoModal'
import { ChevronLeftIcon, ClockIcon, VideoIcon } from '../components/icons'
import type { Tables } from '../types/database'

type WorkoutExerciseRow = Tables<'workout_exercises'> & { exercises: Tables<'exercises'> }
type WorkoutWithExercises = Tables<'workouts'> & { workout_exercises: WorkoutExerciseRow[] }

async function fetchWorkout(slug: string): Promise<WorkoutWithExercises> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_exercises(*, exercises(*))')
    .eq('slug', slug)
    .order('position', { referencedTable: 'workout_exercises', ascending: true })
    .single()

  if (error) throw error
  return data as unknown as WorkoutWithExercises
}

export function WorkoutDetail() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['workout', slug],
    queryFn: () => fetchWorkout(slug),
    enabled: !!slug,
  })
  const [videoExercise, setVideoExercise] = useState<Tables<'exercises'> | null>(null)

  return (
    <div className="min-h-svh bg-cream pb-10">
      <div className="mx-auto max-w-md px-5 pt-6">
        <button
          onClick={() => navigate('/treinos')}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm ring-1 ring-ink-100"
          aria-label="Voltar"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {isLoading && <div className="h-40 animate-pulse rounded-2xl bg-white ring-1 ring-ink-100" />}
        {isError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">Treino não encontrado.</p>}

        {data && (
          <>
            <div
              className="mb-5 rounded-2xl p-5 text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${data.cover_color}, ${data.cover_color}99)` }}
            >
              <LevelBadge level={data.level} />
              <h1 className="mt-2 text-2xl font-bold">{data.title}</h1>
              <p className="mt-1 text-sm text-white/90">{data.description}</p>
              <p className="mt-3 flex items-center gap-1 text-sm font-medium text-white/90">
                <ClockIcon className="h-4 w-4" /> {data.estimated_minutes} min · {data.workout_exercises.length}{' '}
                exercícios
              </p>
            </div>

            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">Lista de exercícios</h2>
            <ul className="mb-24 space-y-2">
              {data.workout_exercises.map((we, idx) => (
                <li
                  key={we.id}
                  className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 shadow-sm ring-1 ring-ink-100"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bloom-50 text-sm font-semibold text-bloom-600">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{we.exercises.name}</p>
                    <p className="text-xs text-ink-500">{we.exercises.muscle_focus.join(', ')}</p>
                  </div>
                  {we.exercises.video_url && (
                    <button
                      onClick={() => setVideoExercise(we.exercises)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-bloom-100 hover:text-bloom-600"
                      aria-label={`Ver vídeo de ${we.exercises.name}`}
                    >
                      <VideoIcon className="h-4 w-4" />
                    </button>
                  )}
                  <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700">
                    {we.duration_seconds ?? we.exercises.default_duration_seconds}s
                  </span>
                </li>
              ))}
            </ul>

            {videoExercise?.video_url && (
              <VideoModal
                title={videoExercise.name}
                url={videoExercise.video_url}
                onClose={() => setVideoExercise(null)}
              />
            )}

            <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-cream via-cream/95 to-transparent p-5 pt-8">
              <Link
                to={`/treinos/${data.slug}/play`}
                className="mx-auto block max-w-md rounded-full bg-bloom-600 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-bloom-600/30 transition hover:bg-bloom-700"
              >
                Começar treino
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
