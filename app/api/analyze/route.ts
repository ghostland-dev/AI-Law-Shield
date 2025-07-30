import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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

    // Analyse du contrat avec GPT-4
    const { text: analysisResult } = await generateText({
      model: openai("gpt-4o"),
      system: `Tu es un expert juridique spécialisé dans l'analyse de contrats pour freelances et startups.
      
      Analyse le contrat fourni et identifie les clauses problématiques selon ces critères :
      
      CRITICAL (score 30) : Clauses qui peuvent causer des pertes financières majeures ou légales
      - Cession totale des droits IP
      - Exclusivité abusive (>12 mois)
      - Responsabilité illimitée
      - Clause de non-concurrence excessive
      
      WARNING (score 15) : Clauses déséquilibrées mais négociables
      - Délais de paiement >45 jours
      - Pénalités disproportionnées
      - Clause de résiliation unilatérale
      
      INFO (score 5) : Points d'attention ou améliorations possibles
      - Manque de précision sur les livrables
      - Absence de clause de force majeure
      - Juridiction défavorable
      
      Réponds UNIQUEMENT en JSON valide avec cette structure :
      {
        "risks": [
          {
            "type": "critical|warning|info",
            "title": "Titre court du problème",
            "description": "Explication claire du risque",
            "clause": "Citation exacte de la clause problématique",
            "suggestion": "Proposition d'amélioration concrète",
            "severity": 5-30
          }
        ],
        "overallScore": 0-100,
        "summary": "Résumé en 2-3 phrases"
      }`,
      prompt: `Analyse ce contrat et identifie tous les risques juridiques :

${contractText}

Concentre-toi sur les clauses qui peuvent nuire au freelance/startup.`,
    })

    let analysis
    try {
      analysis = JSON.parse(analysisResult)
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      return NextResponse.json({ error: "Failed to analyze contract" }, { status: 500 })
    }

    // Sauvegarde en base de données
    const { data: contractAnalysis, error: dbError } = await supabase
      .from("contract_analyses")
      .insert({
        user_id: userId,
        file_name: fileName,
        contract_text: contractText,
        analysis_result: analysis,
        risk_score: analysis.overallScore,
        status: "completed",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      analysisId: contractAnalysis.id,
      analysis: analysis,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
