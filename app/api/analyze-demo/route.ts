import { type NextRequest, NextResponse } from "next/server"

interface RiskAnalysis {
  type: "critical" | "warning" | "info"
  title: string
  description: string
  clause: string
  suggestion: string
  severity: number
}

export async function POST(request: NextRequest) {
  try {
    const { contractText, fileName, userId } = await request.json()

    if (!contractText || !fileName) {
      return NextResponse.json({ error: "Contract text and filename are required" }, { status: 400 })
    }

    // Simulation d'une analyse avec des résultats réalistes
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate AI processing time

    const mockAnalysis = {
      risks: [
        {
          type: "critical" as const,
          title: "Cession totale des droits IP",
          description: "Cette clause vous fait perdre tous vos droits sur votre travail",
          clause:
            "Le prestataire cède à titre exclusif et définitif tous ses droits de propriété intellectuelle sur les créations réalisées",
          suggestion:
            "Le prestataire accorde une licence non-exclusive d'utilisation, les droits moraux restant acquis à l'auteur",
          severity: 30,
        },
        {
          type: "critical" as const,
          title: "Délais de paiement excessifs",
          description: "Paiement à 90 jours, bien au-delà des standards (30 jours)",
          clause: "Le règlement interviendra dans un délai de 90 jours suivant réception de la facture",
          suggestion: "Le règlement interviendra dans un délai de 30 jours suivant réception de la facture",
          severity: 25,
        },
        {
          type: "warning" as const,
          title: "Clause de confidentialité excessive",
          description: "Durée de confidentialité de 5 ans, supérieure aux standards",
          clause: "Le prestataire s'engage à maintenir la confidentialité pendant une durée de 5 ans",
          suggestion: "Limiter la confidentialité à 2 ans conformément aux standards du secteur",
          severity: 15,
        },
        {
          type: "info" as const,
          title: "Clause de résiliation abrupte",
          description: "Possibilité de résiliation sans préavis ni indemnité",
          clause: "Chaque partie peut résilier le contrat à tout moment sans préavis",
          suggestion: "Résiliation possible avec un préavis de 30 jours et indemnisation des travaux en cours",
          severity: 10,
        },
      ],
      overallScore: 20, // Score faible = risque élevé
      summary:
        "Ce contrat présente des risques critiques, notamment concernant la propriété intellectuelle et les délais de paiement. Une négociation est fortement recommandée.",
    }

    // Simulation de sauvegarde en base
    const mockAnalysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      analysisId: mockAnalysisId,
      analysis: mockAnalysis,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
