"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { StatusTimeline } from "@/components/ui/status-timeline"
import { toast } from "@/hooks/use-toast"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Zap,
  Clock,
  Sparkles,
  ArrowLeft,
} from "lucide-react"

interface UploadState {
  file: File | null
  uploading: boolean
  analyzing: boolean
  progress: number
  error: string | null
  success: boolean
  currentStep: string
}

export default function UploadPage() {
  const router = useRouter()
  const [state, setState] = useState<UploadState>({
    file: null,
    uploading: false,
    analyzing: false,
    progress: 0,
    error: null,
    success: false,
    currentStep: "",
  })

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validation du fichier
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez uploader un fichier PDF, DOCX ou TXT.",
          variant: "destructive",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 10MB.",
          variant: "destructive",
        })
        return
      }

      setState((prev) => ({ ...prev, file, error: null }))
      toast({
        title: "Fichier sélectionné",
        description: `${file.name} est prêt pour l'analyse.`,
      })
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]

      // Validation du fichier
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez uploader un fichier PDF, DOCX ou TXT.",
          variant: "destructive",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 10MB.",
          variant: "destructive",
        })
        return
      }

      setState((prev) => ({ ...prev, file, error: null }))
      toast({
        title: "Fichier déposé",
        description: `${file.name} est prêt pour l'analyse.`,
      })
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const analyzeContract = async () => {
    if (!state.file) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier avant de démarrer l'analyse.",
        variant: "destructive",
      })
      return
    }

    setState((prev) => ({ ...prev, uploading: true, progress: 10, error: null, currentStep: "Lecture du fichier..." }))

    try {
      // Étape 1: Upload et extraction du texte
      const formData = new FormData()
      formData.append("file", state.file)

      setState((prev) => ({ ...prev, progress: 25, currentStep: "Extraction du texte..." }))

      const uploadResponse = await fetch("/api/upload-demo", {
        method: "POST",
        body: formData,
      })

      let uploadResult
      try {
        const uploadText = await uploadResponse.text()
        if (uploadResponse.ok) {
          uploadResult = JSON.parse(uploadText)
        } else {
          // Try to parse as JSON, fallback to text error
          try {
            const errorData = JSON.parse(uploadText)
            throw new Error(errorData.error || "Upload failed")
          } catch {
            throw new Error(uploadText || "Upload failed")
          }
        }
      } catch (parseError) {
        throw new Error("Erreur lors du traitement du fichier")
      }

      setState((prev) => ({ ...prev, progress: 50, currentStep: "Analyse juridique en cours..." }))

      // Étape 2: Analyse avec GPT-4 (simulation pour la démo)
      setState((prev) => ({ ...prev, uploading: false, analyzing: true, progress: 70 }))

      // Simulation de l'analyse pour la démo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setState((prev) => ({ ...prev, progress: 90, currentStep: "Génération du rapport..." }))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulation d'un résultat d'analyse
      const mockAnalysisResult = {
        analysisId: `analysis_${Date.now()}`,
        analysis: {
          risks: [
            {
              type: "critical",
              title: "Cession totale des droits IP",
              description: "Cette clause vous fait perdre tous vos droits sur votre travail",
              clause: "Le prestataire cède à titre exclusif et définitif tous ses droits de propriété intellectuelle",
              suggestion: "Le prestataire accorde une licence non-exclusive d'utilisation",
              severity: 30,
            },
          ],
          overallScore: 40,
          summary: "Ce contrat présente des risques élevés nécessitant une négociation.",
        },
      }

      setState((prev) => ({ ...prev, progress: 100, success: true, currentStep: "Analyse terminée !" }))

      toast({
        title: "Analyse terminée !",
        description: "Votre contrat a été analysé avec succès. Redirection en cours...",
      })

      // Redirection vers les résultats après 2 secondes
      setTimeout(() => {
        router.push(`/analysis/${mockAnalysisResult.analysisId}`)
      }, 2000)
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de l'analyse"

      setState((prev) => ({
        ...prev,
        uploading: false,
        analyzing: false,
        error: errorMessage,
        currentStep: "",
        progress: 0,
      }))

      toast({
        title: "Erreur d'analyse",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isProcessing = state.uploading || state.analyzing

  const timelineSteps = [
    {
      id: "1",
      title: "Upload du fichier",
      description: "Réception et validation du document",
      status: state.progress > 0 ? "completed" : ("pending" as const),
    },
    {
      id: "2",
      title: "Extraction du texte",
      description: "Lecture et conversion du contenu",
      status: state.progress > 25 ? "completed" : state.progress > 0 ? "current" : ("pending" as const),
    },
    {
      id: "3",
      title: "Analyse IA",
      description: "Détection des clauses problématiques",
      status: state.progress > 70 ? "completed" : state.progress > 25 ? "current" : ("pending" as const),
    },
    {
      id: "4",
      title: "Génération du rapport",
      description: "Création des suggestions d'amélioration",
      status: state.success ? "completed" : state.progress > 70 ? "current" : ("pending" as const),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AI Law Shield</span>
          </div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Analyse IA Ultra-Rapide
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analyser un Contrat</h1>
          <p className="text-xl text-gray-600">
            Uploadez votre contrat et obtenez une analyse juridique complète en 30 secondes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Upload de Document
                </CardTitle>
                <CardDescription>
                  Formats supportés : PDF, DOCX, TXT • Taille max : 10MB • Analyse en temps réel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Zone de drop améliorée */}
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    isProcessing
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="animate-bounce">
                        <Loader2 className="mx-auto h-16 w-16 text-blue-600 animate-spin" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-blue-900 mb-2">{state.currentStep}</p>
                        <p className="text-blue-700">L'IA analyse votre contrat...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="animate-bounce">
                        <Upload className="mx-auto h-16 w-16 text-blue-400 mb-4" />
                      </div>
                      <p className="text-xl font-medium text-gray-900 mb-2">Déposez votre contrat ici</p>
                      <p className="text-gray-600 mb-6">ou cliquez pour sélectionner un fichier</p>
                      <label htmlFor="file-upload">
                        <Button
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                          asChild
                        >
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Sélectionner un fichier
                          </span>
                        </Button>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileSelect}
                        disabled={isProcessing}
                      />
                    </>
                  )}
                </div>

                {/* Fichier sélectionné */}
                {state.file && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 text-lg">{state.file.name}</p>
                        <p className="text-blue-700">{formatFileSize(state.file.size)}</p>
                      </div>
                      {state.success && (
                        <div className="animate-in zoom-in-50">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Barre de progression améliorée */}
                {isProcessing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{state.currentStep}</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        <AnimatedCounter end={state.progress} suffix="%" />
                      </span>
                    </div>
                    <Progress value={state.progress} className="h-3" />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Temps estimé restant:{" "}
                        <span className="font-medium">
                          <AnimatedCounter end={Math.max(1, Math.floor((100 - state.progress) / 10))} suffix="s" />
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Messages d'erreur */}
                {state.error && (
                  <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{state.error}</AlertDescription>
                  </Alert>
                )}

                {/* Message de succès */}
                {state.success && (
                  <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      ✨ Analyse terminée avec succès ! Redirection vers les résultats...
                    </AlertDescription>
                  </Alert>
                )}

                {/* Bouton d'analyse */}
                <Button
                  onClick={analyzeContract}
                  disabled={!state.file || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Analyser le Contrat
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline de progression */}
            {isProcessing && (
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusTimeline steps={timelineSteps} />
                </CardContent>
              </Card>
            )}

            {/* Informations sur l'analyse */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Shield className="h-5 w-5" />
                  Ce que l'IA va analyser
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 text-sm text-blue-800">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-600 flex-shrink-0" />
                    <span>Clauses de propriété intellectuelle</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-600 flex-shrink-0" />
                    <span>Conditions de paiement et délais</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-600 flex-shrink-0" />
                    <span>Clauses d'exclusivité et non-concurrence</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-600 flex-shrink-0" />
                    <span>Responsabilités et garanties</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-600 flex-shrink-0" />
                    <span>Conditions de résiliation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-600 flex-shrink-0" />
                    <span>Juridiction et droit applicable</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats en temps réel */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Sparkles className="h-5 w-5" />
                  Performance IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 text-sm">Précision:</span>
                  <span className="text-2xl font-bold text-green-900">
                    <AnimatedCounter end={94} suffix="%" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 text-sm">Temps moyen:</span>
                  <span className="text-2xl font-bold text-green-900">
                    <AnimatedCounter end={28} suffix="s" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 text-sm">Contrats analysés:</span>
                  <span className="text-2xl font-bold text-green-900">
                    <AnimatedCounter end={15847} />
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Témoignage */}
            <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">⭐⭐⭐⭐⭐</div>
                  <p className="text-sm text-gray-700 italic mb-3">
                    "AI Law Shield m'a fait économiser 3000€ en détectant une clause abusive que j'avais ratée !"
                  </p>
                  <p className="text-xs text-gray-600 font-medium">- Marie D., Développeuse Freelance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
