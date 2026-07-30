# GlúteaFit

App de treinos de glúteos para mulheres — treinos por nível (Iniciante/Intermediário/Avançado), player com timer e vídeos de demonstração, progresso salvo localmente.

Fase atual: **validação de oferta**, sem contas de usuário. O progresso (nível, sequência, treinos concluídos) fica salvo só no `localStorage` do navegador. Autenticação e sincronização entre dispositivos ficam para uma fase futura, junto com o sistema de acesso via webhook (pós-compra).

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS v4, `react-router-dom`, `@tanstack/react-query`.
- **Backend**: Supabase (Postgres + Row Level Security) — usado só como catálogo público de treinos/exercícios, sem login.

## Estrutura

- `src/pages` — telas (painel, treinos, player, perfil).
- `src/lib/localProgress.ts` — leitura/escrita do progresso no `localStorage`.
- `src/hooks/useLocalProgress.ts` — hook React sobre o `localProgress`.
- `supabase/` (não versionado neste repo — schema e RLS vivem no projeto Supabase).

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

- RLS habilitado em todas as tabelas. O catálogo de treinos/exercícios é público (somente leitura); não há dados de usuário no banco nesta fase.
- Nenhuma chave secreta é exposta no client.
