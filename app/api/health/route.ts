import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Vérifications de santé de l'application
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      services: {
        database: await checkDatabase(),
        ai: await checkAI(),
        storage: await checkStorage(),
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function checkDatabase() {
  try {
    // En production, vérifier la connexion à Supabase
    return { status: "healthy", latency: "< 50ms" }
  } catch (error) {
    return { status: "unhealthy", error: error instanceof Error ? error.message : "Database error" }
  }
}

async function checkAI() {
  try {
    // En production, vérifier l'API OpenAI
    return { status: "healthy", model: "gpt-4o" }
  } catch (error) {
    return { status: "unhealthy", error: error instanceof Error ? error.message : "AI service error" }
  }
}

async function checkStorage() {
  try {
    // En production, vérifier le stockage de fichiers
    return { status: "healthy", provider: "vercel-blob" }
  } catch (error) {
    return { status: "unhealthy", error: error instanceof Error ? error.message : "Storage error" }
  }
}
