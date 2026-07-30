import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useLocalProgress } from '../hooks/useLocalProgress'
import { VideoModal } from '../components/VideoModal'
import { ChevronLeftIcon, CheckIcon, PauseIcon, PlayIcon, SkipIcon, VideoIcon } from '../components/icons'
import type { Tables } from '../types/database'

type WorkoutExerciseRow = Tables<'workout_exercises'> & { exercises: Tables<'exercises'> }
type WorkoutWithExercises = Tables<'workouts'> & { workout_exercises: WorkoutExerciseRow[] }

type Step = {
  type: 'exercise' | 'descanso'
  seconds: number
  exercise: Tables<'exercises'>
  exerciseNumber: number
  totalExercises: number
}

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

function buildSteps(workout: WorkoutWithExercises): Step[] {
  const total = workout.workout_exercises.length
  const steps: Step[] = []
  workout.workout_exercises.forEach((we, idx) => {
    const duration = we.duration_seconds ?? we.exercises.default_duration_seconds
    steps.push({ type: 'exercise', seconds: duration, exercise: we.exercises, exerciseNumber: idx + 1, totalExercises: total })
    if (we.rest_seconds > 0 && idx < total - 1) {
      steps.push({
        type: 'descanso',
        seconds: we.rest_seconds,
        exercise: we.exercises,
        exerciseNumber: idx + 1,
        totalExercises: total,
      })
    }
  })
  return steps
}

export function WorkoutPlayer() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { completeWorkout } = useLocalProgress()

  const { data: workout, isLoading } = useQuery({
    queryKey: ['workout', slug],
    queryFn: () => fetchWorkout(slug),
    enabled: !!slug,
  })

  const steps = useMemo(() => (workout ? buildSteps(workout) : []), [workout])

  const [stepIndex, setStepIndex] = useState(0)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const elapsedRef = useRef(0)

  useEffect(() => {
    if (steps.length > 0 && remaining === null) {
      setRemaining(steps[0].seconds)
    }
  }, [steps, remaining])

  const currentStep = steps[stepIndex]

  useEffect(() => {
    if (!currentStep || paused || finished) return
    const timer = window.setInterval(() => {
      elapsedRef.current += 1
      setRemaining((prev) => {
        if (prev === null) return prev
        if (prev <= 1) {
          goToNext()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, paused, finished, currentStep])

  function goToNext() {
    setStepIndex((idx) => {
      const next = idx + 1
      if (next >= steps.length) {
        setFinished(true)
        return idx
      }
      setRemaining(steps[next].seconds)
      return next
    })
  }

  function handleSkip() {
    goToNext()
  }

  useEffect(() => {
    if (finished && workout) {
      completeWorkout(
        { id: workout.id, slug: workout.slug, title: workout.title },
        Math.max(elapsedRef.current, 1)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  useEffect(() => {
    setVideoOpen(false)
  }, [stepIndex])

  if (isLoading || !workout) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-ink-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    )
  }

  if (finished) {
    const minutes = Math.round(elapsedRef.current / 60)
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-ink-900 px-6 text-center text-white">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-bloom-600">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold">Treino concluído!</h1>
        <p className="mt-2 text-white/70">Você terminou {workout.title} em {minutes || 1} min.</p>
        <Link
          to="/painel"
          className="mt-8 w-full max-w-xs rounded-full bg-bloom-600 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-bloom-600/30 transition hover:bg-bloom-700"
        >
          Voltar ao painel
        </Link>
      </div>
    )
  }

  if (!currentStep) return null

  const progressPercent = ((stepIndex + 1) / steps.length) * 100

  return (
    <div className="flex min-h-svh flex-col bg-ink-900 text-white">
      <div className="flex items-center gap-3 px-5 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
          aria-label="Sair do treino"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-bloom-500 transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="shrink-0 text-xs text-white/60">
          {currentStep.exerciseNumber}/{currentStep.totalExercises}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-bloom-400">
          {currentStep.type === 'descanso' ? 'Descanso' : 'Exercício'}
        </p>
        <h1 className="text-3xl font-bold">{currentStep.exercise.name}</h1>

        {currentStep.exercise.video_url && (
          <button
            onClick={() => {
              setPaused(true)
              setVideoOpen(true)
            }}
            className="mt-3 flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            <VideoIcon className="h-4 w-4" /> Ver vídeo de demonstração
          </button>
        )}

        <div className="my-8 flex h-48 w-48 items-center justify-center rounded-full border-4 border-white/10">
          <span className="text-6xl font-bold tabular-nums">{remaining ?? currentStep.seconds}</span>
        </div>

        {currentStep.type === 'exercise' ? (
          <>
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {currentStep.exercise.muscle_focus.map((m) => (
                <span key={m} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize">
                  {m}
                </span>
              ))}
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/70">{currentStep.exercise.instructions}</p>
          </>
        ) : (
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            Respire, hidrate-se e prepare-se para: <span className="font-semibold text-white">{steps[stepIndex + 1]?.exercise.name}</span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 px-8 pb-12 pt-4">
        <button
          onClick={handleSkip}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white"
          aria-label="Pular"
        >
          <SkipIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setPaused((p) => !p)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-bloom-600 text-white shadow-lg shadow-bloom-600/30"
          aria-label={paused ? 'Continuar' : 'Pausar'}
        >
          {paused ? <PlayIcon className="h-7 w-7" /> : <PauseIcon className="h-7 w-7" />}
        </button>
        <div className="h-12 w-12" />
      </div>

      {videoOpen && currentStep.exercise.video_url && (
        <VideoModal
          title={currentStep.exercise.name}
          url={currentStep.exercise.video_url}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </div>
  )
}
