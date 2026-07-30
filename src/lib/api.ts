import { supabase } from './supabaseClient'
import type { Tables } from '../types/database'

export interface DashboardResponse {
  profile: Tables<'profiles'>
  suggested_workout: Tables<'workouts'> | null
  recent_sessions: Array<
    Pick<Tables<'workout_sessions'>, 'id' | 'workout_id' | 'completed_at' | 'duration_seconds'> & {
      workouts: { title: string; slug: string } | null
    }
  >
}

export interface CompleteWorkoutResponse {
  session: Pick<Tables<'workout_sessions'>, 'id' | 'completed_at'>
  profile: Pick<
    Tables<'profiles'>,
    'current_streak' | 'longest_streak' | 'total_sessions' | 'total_minutes' | 'last_workout_at'
  >
}

async function invokeEdgeFunction<T>(
  name: string,
  options?: { method?: 'GET' | 'POST'; body?: Record<string, unknown> }
) {
  const { data, error } = await supabase.functions.invoke<T>(name, {
    method: options?.method ?? 'GET',
    body: options?.body,
  })
  if (error) {
    throw new Error(error.message || 'Falha ao chamar o servidor.')
  }
  return data as T
}

export function fetchDashboard() {
  return invokeEdgeFunction<DashboardResponse>('dashboard', { method: 'GET' })
}

export function completeWorkout(workoutId: string, durationSeconds: number) {
  return invokeEdgeFunction<CompleteWorkoutResponse>('complete-workout', {
    method: 'POST',
    body: { workout_id: workoutId, duration_seconds: durationSeconds },
  })
}
