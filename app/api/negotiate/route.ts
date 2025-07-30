import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { analysisId, recipientEmail, userEmail, userName, selectedRisks } = await request.json()

    if (!analysisId || !recipientEmail || !selectedRisks?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Récupération de l'analyse depuis la base
    const { data: analysis, error: fetchError } = await supabase
      .from("contract_analyses")
      .select("*")
      .eq("id", analysisId)
      .single()

    if (fetchError || !analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    // Génération de l'email de négociation avec GPT-4
    const { text: emailContent } = await generateText({
      model: openai("gpt-4o"),
      system: `Tu es un assistant juridique professionnel qui rédige des emails de négociation contractuelle.

Règles importantes :
- Ton professionnel et respectueux
- Justifie chaque demande par des arguments juridiques ou commerciaux
- Propose des alternatives équilibrées
- Reste constructif et orienté solution
- Utilise un français professionnel

Structure de l'email :
1. Salutation professionnelle
2. Contexte (examen du contrat)
3. Points à négocier avec justifications
4. Propositions concrètes d'amendements
5. Ouverture au dialogue
6. Formule de politesse`,
      prompt: `Rédige un email de négociation professionnel pour ces points problématiques :

${selectedRisks
  .map(
    (risk: any) => `
- ${risk.title}: ${risk.description}
  Clause actuelle: "${risk.clause}"
  Suggestion: "${risk.suggestion}"
`,
  )
  .join("\n")}

Informations contextuelles :
- Expéditeur: ${userName} (${userEmail})
- Destinataire: ${recipientEmail}
- Fichier: ${analysis.file_name}

L'email doit être persuasif mais diplomatique.`,
    })

    // Simulation d'envoi d'email (en production, utiliser SendGrid, Resend, etc.)
    const emailData = {
      to: recipientEmail,
      from: userEmail,
      subject: `Amendements proposés - ${analysis.file_name}`,
      content: emailContent,
      analysisId: analysisId,
      status: "sent",
      sentAt: new Date().toISOString(),
    }

    // Sauvegarde de la négociation en base
    const { data: negotiation, error: saveError } = await supabase
      .from("negotiations")
      .insert({
        analysis_id: analysisId,
        recipient_email: recipientEmail,
        sender_email: userEmail,
        sender_name: userName,
        email_subject: emailData.subject,
        email_content: emailContent,
        selected_risks: selectedRisks,
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (saveError) {
      console.error("Failed to save negotiation:", saveError)
      return NextResponse.json({ error: "Failed to save negotiation" }, { status: 500 })
    }

    // Mise à jour du statut de l'analyse
    await supabase.from("contract_analyses").update({ status: "negotiating" }).eq("id", analysisId)

    return NextResponse.json({
      success: true,
      negotiationId: negotiation.id,
      emailPreview: emailContent,
      message: "Negotiation email sent successfully",
    })
  } catch (error) {
    console.error("Negotiation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
