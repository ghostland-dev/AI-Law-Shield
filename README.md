# AI Law Shield

Contract analysis platform that flags risky clauses and suggests negotiation points.

## Features

- Contract upload and automated clause analysis
- Risk scoring with a detailed analysis view per document
- Negotiation suggestions endpoint
- Authentication, dashboard and health/metrics API routes

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
- Supabase

## Getting Started

```bash
git clone https://github.com/ghostland-dev/ai-law-shield.git
cd ai-law-shield
npm install
npm run dev
```

Other scripts:

- `npm run build`: next build
- `npm run lint`: next lint

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fghostland-dev%2Fai-law-shield)

Click the button to deploy your own copy on Vercel in one step.

Set these environment variables in the Vercel project settings (see `.env.example`):

- `EMAIL_FROM`
- `EMAIL_REPLY_TO`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `OPENAI_API_KEY`
- `SENTRY_DSN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

## Author

**Ismail.M**, Software Engineer & DevOps

- GitHub: [@ghostland-dev](https://github.com/ghostland-dev)
- Website: [ismail-mouyahada.com](https://www.ismail-mouyahada.com)
