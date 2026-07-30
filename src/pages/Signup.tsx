import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthLayout } from '../components/AuthLayout'

export function Signup() {
  const { signUp } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, name.trim())
    setLoading(false)

    if (error) {
      setError(error)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <AuthLayout title="Quase lá!" subtitle="Confirme sua conta para começar">
        <p className="text-center text-sm text-ink-700">
          Enviamos um e-mail de confirmação para <span className="font-semibold">{email}</span>. Confirme para poder
          entrar e começar seus treinos.
        </p>
        <Link
          to="/login"
          className="mt-6 block w-full rounded-xl bg-bloom-600 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-bloom-600/30 transition hover:bg-bloom-700"
        >
          Ir para o login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Crie sua conta" subtitle="Comece seus treinos de glúteos hoje">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink-700">
            Nome
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-ink-100 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-bloom-400 focus:ring-2 focus:ring-bloom-100"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink-100 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-bloom-400 focus:ring-2 focus:ring-bloom-100"
            placeholder="voce@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink-100 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-bloom-400 focus:ring-2 focus:ring-bloom-100"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-bloom-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-bloom-600/30 transition hover:bg-bloom-700 disabled:opacity-60"
        >
          {loading ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Já tem conta?{' '}
        <Link to="/login" className="font-semibold text-bloom-600 hover:text-bloom-700">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
