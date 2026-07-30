import { LEVEL_LABEL, LEVEL_STYLE, type FitnessLevel } from '../lib/levels'

export function LevelBadge({ level }: { level: FitnessLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${LEVEL_STYLE[level]}`}
    >
      {LEVEL_LABEL[level]}
    </span>
  )
}
