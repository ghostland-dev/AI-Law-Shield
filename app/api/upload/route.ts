import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import pdf from "pdf-parse"
import mammoth from "mammoth"

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

    // Conversion du fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extraction du texte selon le type de fichier
    let extractedText = ""

    try {
      if (file.type === "application/pdf") {
        const pdfData = await pdf(buffer)
        extractedText = pdfData.text
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const docxData = await mammoth.extractRawText({ buffer })
        extractedText = docxData.value
      } else if (file.type === "text/plain") {
        extractedText = buffer.toString("utf-8")
      }
    } catch (extractionError) {
      console.error("Text extraction error:", extractionError)
      return NextResponse.json({ error: "Failed to extract text from file" }, { status: 500 })
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: "No text could be extracted from the file" }, { status: 400 })
    }

    // Sauvegarde optionnelle du fichier (pour debug)
    const uploadDir = join(process.cwd(), "uploads")
    const filePath = join(uploadDir, `${Date.now()}-${file.name}`)

    try {
      await writeFile(filePath, buffer)
    } catch (writeError) {
      console.warn("Could not save file to disk:", writeError)
      // Continue même si la sauvegarde échoue
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      extractedText: extractedText,
      textLength: extractedText.length,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
