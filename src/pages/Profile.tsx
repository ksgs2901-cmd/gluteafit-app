import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { LevelBadge } from '../components/LevelBadge'
import { UserIcon } from '../components/icons'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { LEVEL_LABEL, LEVEL_ORDER, type FitnessLevel } from '../lib/levels'

async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
  })

  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) setName(profile.display_name ?? '')
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: async (updates: { display_name?: string; level?: FitnessLevel }) => {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user!.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <AppShell>
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bloom-100 text-bloom-600">
          <UserIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink-900">{profile?.display_name || 'Seu perfil'}</h1>
          <p className="text-sm text-ink-500">{user?.email}</p>
        </div>
      </header>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-ink-100" />
      ) : (
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
              />
              <button
                onClick={() => updateMutation.mutate({ display_name: name.trim() })}
                disabled={updateMutation.isPending || !name.trim()}
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
                <button
                  key={level}
                  onClick={() => updateMutation.mutate({ level })}
                  className={profile?.level === level ? 'opacity-100' : 'opacity-50 hover:opacity-80'}
                >
                  <LevelBadge level={level} />
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-500">
              Selecionado: <span className="font-medium">{profile ? LEVEL_LABEL[profile.level] : '—'}</span> · usado para
              sugerir seu treino do dia.
            </p>
          </section>

          <section className="grid grid-cols-3 gap-3">
            <MiniStat label="Sequência" value={`${profile?.current_streak ?? 0}d`} />
            <MiniStat label="Treinos" value={String(profile?.total_sessions ?? 0)} />
            <MiniStat label="Minutos" value={String(profile?.total_minutes ?? 0)} />
          </section>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-ink-100 transition hover:bg-red-50"
          >
            Sair da conta
          </button>
        </div>
      )}
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
