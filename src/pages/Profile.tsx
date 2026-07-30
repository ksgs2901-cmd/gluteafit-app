import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { LevelBadge } from '../components/LevelBadge'
import { UserIcon } from '../components/icons'
import { useLocalProgress } from '../hooks/useLocalProgress'
import { LEVEL_LABEL, LEVEL_ORDER } from '../lib/levels'

export function Profile() {
  const { progress, setDisplayName, setLevel } = useLocalProgress()

  const [name, setName] = useState(progress.displayName)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(progress.displayName)
  }, [progress.displayName])

  function handleSave() {
    setDisplayName(name.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppShell>
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bloom-100 text-bloom-600">
          <UserIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink-900">{progress.displayName || 'Seu perfil'}</h1>
          <p className="text-sm text-ink-500">Progresso salvo neste dispositivo</p>
        </div>
      </header>

      <div className="space-y-5">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-100">
          <label htmlFor="display_name" className="mb-1 block text-sm font-medium text-ink-700">
            Nome
          </label>
          <div className="flex gap-2">
            <input
              id="display_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-xl border border-ink-100 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-bloom-400 focus:ring-2 focus:ring-bloom-100"
              placeholder="Seu nome"
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="shrink-0 rounded-xl bg-bloom-600 px-4 text-sm font-semibold text-white transition hover:bg-bloom-700 disabled:opacity-50"
            >
              Salvar
            </button>
          </div>
          {saved && <p className="mt-2 text-xs font-medium text-emerald-600">Salvo com sucesso!</p>}
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-100">
          <p className="mb-2 text-sm font-medium text-ink-700">Nível de treino</p>
          <div className="flex flex-wrap gap-2">
            {LEVEL_ORDER.map((level) => (
              <button key={level} onClick={() => setLevel(level)} className={progress.level === level ? 'opacity-100' : 'opacity-50 hover:opacity-80'}>
                <LevelBadge level={level} />
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-500">
            Selecionado: <span className="font-medium">{LEVEL_LABEL[progress.level]}</span> · usado para sugerir seu
            treino do dia.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <MiniStat label="Sequência" value={`${progress.currentStreak}d`} />
          <MiniStat label="Treinos" value={String(progress.totalSessions)} />
          <MiniStat label="Minutos" value={String(progress.totalMinutes)} />
        </section>

        <p className="rounded-xl bg-ink-50 px-4 py-3 text-center text-xs text-ink-500 ring-1 ring-ink-100">
          Seu progresso fica salvo apenas neste navegador por enquanto. Em breve teremos contas e sincronização entre
          dispositivos.
        </p>
      </div>
    </AppShell>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-ink-100">
      <p className="text-lg font-bold text-ink-900">{value}</p>
      <p className="text-[11px] text-ink-500">{label}</p>
    </div>
  )
}
