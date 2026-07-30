export function ConfigError() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-cream px-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-2xl font-bold text-white">
        !
      </div>
      <h1 className="text-xl font-bold text-ink-900">Configuração ausente</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        As variáveis de ambiente <code className="rounded bg-ink-100 px-1 py-0.5">VITE_SUPABASE_URL</code> e{' '}
        <code className="rounded bg-ink-100 px-1 py-0.5">VITE_SUPABASE_PUBLISHABLE_KEY</code> não foram encontradas.
      </p>
      <p className="mt-3 max-w-sm text-sm text-ink-500">
        Se este é um deploy (Vercel, Netlify, etc.), adicione as duas variáveis nas configurações do projeto e faça um
        novo deploy. Em desenvolvimento local, copie <code className="rounded bg-ink-100 px-1 py-0.5">.env.example</code>{' '}
        para <code className="rounded bg-ink-100 px-1 py-0.5">.env</code> e preencha os valores.
      </p>
    </div>
  )
}
