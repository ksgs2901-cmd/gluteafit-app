import { useCallback, useState } from 'react'
import { loadProgress, recordWorkoutCompletion, updateProfile, type LocalProgress } from '../lib/localProgress'
import type { FitnessLevel } from '../lib/levels'

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(() => loadProgress())

  const setDisplayName = useCallback((displayName: string) => {
    setProgress(updateProfile({ displayName }))
  }, [])

  const setLevel = useCallback((level: FitnessLevel) => {
    setProgress(updateProfile({ level }))
  }, [])

  const completeWorkout = useCallback(
    (workout: { id: string; slug: string; title: string }, durationSeconds: number) => {
      const next = recordWorkoutCompletion(workout, durationSeconds)
      setProgress(next)
      return next
    },
    []
  )

  return { progress, setDisplayName, setLevel, completeWorkout }
}
