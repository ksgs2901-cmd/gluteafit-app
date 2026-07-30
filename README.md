# GlúteaFit

SaaS de treinos de glúteos para mulheres — cadastro/login, treinos por nível (Iniciante/Intermediário/Avançado), player com timer e vídeos de demonstração, e acompanhamento de progresso.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS v4, `react-router-dom`, `@tanstack/react-query`.
- **Backend**: Supabase (Postgres + Auth + Row Level Security + Edge Functions).

## Estrutura

- `src/pages` — telas (login, cadastro, painel, treinos, player, perfil).
- `src/contexts/AuthContext.tsx` — sessão do Supabase Auth.
- `src/lib/api.ts` — chamadas às Edge Functions (`dashboard`, `complete-workout`).
- `supabase/` (não versionado neste repo — schema, RLS e Edge Functions vivem no projeto Supabase).

## Rodando localmente

```bash
npm install
cp .env.example .env # preencha com as credenciais do seu projeto Supabase
npm run dev
```

Variáveis de ambiente necessárias (veja `.env.example`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (chave publishable/anon — nunca a service role)

## Segurança

- RLS habilitado em todas as tabelas; cada usuária só acessa seus próprios dados.
- Lógica sensível (cálculo de sequência, gravação de progresso) roda em Edge Functions que validam o JWT do usuário no servidor.
- Nenhuma chave secreta é exposta no client.
