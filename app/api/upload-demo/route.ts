import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Vérification du type de fichier
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not supported. Please upload PDF, DOCX, or TXT files." },
        { status: 400 },
      )
    }

    // Vérification de la taille
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Simulation de l'extraction de texte
    const mockExtractedText = `
    ACCORD DE NON-DIVULGATION

    Le prestataire s'engage à maintenir la confidentialité de toutes les informations 
    communiquées par le client pendant une durée de 5 ans.

    Le prestataire cède à titre exclusif et définitif tous ses droits de propriété 
    intellectuelle sur les créations réalisées dans le cadre de cette mission.

    Le règlement interviendra dans un délai de 90 jours suivant réception de la facture.

    Chaque partie peut résilier le contrat à tout moment sans préavis.
    `

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      extractedText: mockExtractedText.trim(),
      textLength: mockExtractedText.trim().length,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
