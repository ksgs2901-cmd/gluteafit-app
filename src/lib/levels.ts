import type { Enums } from '../types/database'

export type FitnessLevel = Enums<'fitness_level'>

export const LEVEL_LABEL: Record<FitnessLevel, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

export const LEVEL_STYLE: Record<FitnessLevel, string> = {
  iniciante: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  intermediario: 'bg-amber-50 text-amber-700 ring-amber-200',
  avancado: 'bg-bloom-50 text-bloom-700 ring-bloom-200',
}

export const LEVEL_ORDER: FitnessLevel[] = ['iniciante', 'intermediario', 'avancado']
