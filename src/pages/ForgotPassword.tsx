import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthLayout } from '../components/AuthLayout'

export function ForgotPassword() {
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await sendPasswordReset(email)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout title="Verifique seu e-mail" subtitle="Enviamos um link para redefinir sua senha">
        <p className="text-center text-sm text-ink-700">
          Se existir uma conta para <span className="font-semibold">{email}</span>, você receberá um link para criar
          uma nova senha em instantes.
        </p>
        <Link
          to="/login"
          className="mt-6 block w-full rounded-xl bg-bloom-600 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-bloom-600/30 transition hover:bg-bloom-700"
        >
          Voltar ao login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Recuperar senha" subtitle="Informe seu e-mail para receber o link de redefinição">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-bloom-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-bloom-600/30 transition hover:bg-bloom-700 disabled:opacity-60"
        >
          {loading ? 'Enviando…' : 'Enviar link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        <Link to="/login" className="font-semibold text-bloom-600 hover:text-bloom-700">
          Voltar ao login
        </Link>
      </p>
    </AuthLayout>
  )
}
