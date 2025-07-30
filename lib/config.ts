// Configuration centralisée de l'application

export const config = {
  // Environnement
  env: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",

  // URLs
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api",

  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-4o",
    maxTokens: 4000,
  },

  // Limites
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    analysesPerMonth: {
      free: 1,
      pro: -1, // illimité
      enterprise: -1,
    },
    negotiationsPerMonth: {
      free: 0,
      pro: 3,
      enterprise: -1,
    },
  },

  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    enableErrorReporting: process.env.NODE_ENV === "production",
    enablePerformanceMonitoring: true,
  },

  // Features flags
  features: {
    enableNegotiation: true,
    enableTemplates: true,
    enableAnalytics: true,
    enableNotifications: true,
  },

  // Email
  email: {
    from: process.env.EMAIL_FROM || "noreply@ailawshield.com",
    replyTo: process.env.EMAIL_REPLY_TO || "support@ailawshield.com",
  },

  // Stripe (pour les paiements)
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
}

// Validation de la configuration
export function validateConfig() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "OPENAI_API_KEY",
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
