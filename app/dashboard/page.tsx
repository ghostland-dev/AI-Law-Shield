"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { StatusTimeline } from "@/components/ui/status-timeline"
import { toast } from "@/hooks/use-toast"
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Download,
  Shield,
  TrendingUp,
  DollarSign,
  BarChart3,
  Zap,
  Settings,
  LogOut,
} from "lucide-react"

interface ContractAnalysis {
  id: string
  name: string
  status: "analyzing" | "completed" | "negotiating"
  riskLevel: "low" | "medium" | "high"
  uploadDate: string
  issues: number
  suggestions: number
}

export default function Dashboard() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<ContractAnalysis[]>([
    {
      id: "1",
      name: "NDA_Client_TechCorp.pdf",
      status: "completed",
      riskLevel: "high",
      uploadDate: "2025-01-30",
      issues: 3,
      suggestions: 5,
    },
    {
      id: "2",
      name: "Contrat_Freelance_Startup.docx",
      status: "negotiating",
      riskLevel: "medium",
      uploadDate: "2025-01-29",
      issues: 2,
      suggestions: 3,
    },
    {
      id: "3",
      name: "Accord_Partenariat.pdf",
      status: "analyzing",
      riskLevel: "low",
      uploadDate: "2025-01-30",
      issues: 0,
      suggestions: 0,
    },
  ])

  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
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

    // Simulate file upload and analysis
    const newAnalysis: ContractAnalysis = {
      id: Date.now().toString(),
      name: file.name,
      status: "analyzing",
      riskLevel: "low",
      uploadDate: new Date().toISOString().split("T")[0],
      issues: 0,
      suggestions: 0,
    }

    setAnalyses((prev) => [newAnalysis, ...prev])

    toast({
      title: "Analyse démarrée",
      description: `${file.name} est en cours d'analyse...`,
    })

    // Simulate analysis completion after 3 seconds
    setTimeout(() => {
      setAnalyses((prev) =>
        prev.map((analysis) =>
          analysis.id === newAnalysis.id
            ? { ...analysis, status: "completed", riskLevel: "medium", issues: 2, suggestions: 4 }
            : analysis,
        ),
      )

      toast({
        title: "Analyse terminée",
        description: `${file.name} a été analysé avec succès !`,
      })
    }, 3000)
  }

  const handleDownloadReport = (analysisId: string, fileName: string) => {
    // Simulate PDF download
    toast({
      title: "Téléchargement démarré",
      description: `Le rapport PDF de ${fileName} est en cours de téléchargement.`,
    })

    // In real app, this would trigger actual download
    console.log(`Downloading report for analysis ${analysisId}`)
  }

  const handleStartNegotiation = (analysisId: string, fileName: string) => {
    router.push(`/negotiation/${analysisId}`)
  }

  const handleUpgradePlan = (plan: string) => {
    router.push(`/pricing?upgrade=${plan}`)
  }

  const handleLogout = () => {
    // In real app, clear auth tokens
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    })
    router.push("/")
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "analyzing":
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "negotiating":
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const floatingActions = [
    {
      icon: <Upload className="h-5 w-5" />,
      label: "Analyser un contrat",
      onClick: () => router.push("/upload"),
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Nouvelle négociation",
      onClick: () => router.push("/negotiations/new"),
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Templates juridiques",
      onClick: () => router.push("/templates"),
      color: "bg-green-600 hover:bg-green-700",
    },
  ]

  const timelineSteps = [
    {
      id: "1",
      title: "Analyse terminée",
      description: "NDA_Client_TechCorp.pdf analysé avec succès",
      status: "completed" as const,
      timestamp: "Il y a 2h",
    },
    {
      id: "2",
      title: "Négociation en cours",
      description: "Email envoyé à contact@techcorp.com",
      status: "current" as const,
      timestamp: "Il y a 1h",
    },
    {
      id: "3",
      title: "En attente de réponse",
      description: "Relance automatique prévue dans 24h",
      status: "pending" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AI Law Shield</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800 animate-pulse">Plan Pro</Badge>
            <Button variant="ghost" size="sm" onClick={() => router.push("/settings")}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
            <div
              className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => router.push("/analytics")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Analyses ce mois</CardTitle>
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                <AnimatedCounter end={23} />
              </div>
              <p className="text-xs text-blue-700 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => router.push("/risks")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Risques détectés</CardTitle>
              <div className="p-2 bg-red-600 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">
                <AnimatedCounter end={47} />
              </div>
              <p className="text-xs text-red-700">Évités grâce à l'IA</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => router.push("/negotiations")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Négociations</CardTitle>
              <div className="p-2 bg-purple-600 rounded-lg">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                <AnimatedCounter end={8} />
              </div>
              <p className="text-xs text-purple-700">3 en cours</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => router.push("/savings")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Économies</CardTitle>
              <div className="p-2 bg-green-600 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                <AnimatedCounter end={2400} prefix="" suffix="€" />
              </div>
              <p className="text-xs text-green-700">vs avocats traditionnels</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Nouvelle Analyse
                </TabsTrigger>
                <TabsTrigger
                  value="analyses"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Mes Analyses
                </TabsTrigger>
                <TabsTrigger
                  value="negotiations"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Négociations
                </TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-6">
                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Analyser un nouveau contrat
                    </CardTitle>
                    <CardDescription>
                      Glissez-déposez votre contrat ou cliquez pour sélectionner • Analyse en 30 secondes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                        dragActive
                          ? "border-blue-500 bg-blue-50 scale-105"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="animate-bounce">
                        <Upload className="mx-auto h-16 w-16 text-blue-400 mb-4" />
                      </div>
                      <p className="text-xl font-medium text-gray-900 mb-2">Déposez votre contrat ici</p>
                      <p className="text-gray-600 mb-6">Formats supportés : PDF, DOCX, TXT • Max 10MB</p>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => router.push("/upload")}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Sélectionner un fichier
                      </Button>
                    </div>

                    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />⚡ Analyse IA Ultra-Rapide
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Clauses de propriété intellectuelle
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Conditions de paiement et délais
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Clauses d'exclusivité
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Responsabilités et garanties
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Conditions de résiliation
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Juridiction et droit applicable
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analyses Tab */}
              <TabsContent value="analyses" className="space-y-6">
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <Card key={analysis.id} className="hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(analysis.status)}
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {analysis.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Analysé le {new Date(analysis.uploadDate).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <Badge className={getRiskColor(analysis.riskLevel)}>
                              {analysis.riskLevel === "high" && "🔴 Risque Élevé"}
                              {analysis.riskLevel === "medium" && "🟡 Risque Modéré"}
                              {analysis.riskLevel === "low" && "🟢 Risque Faible"}
                            </Badge>

                            {analysis.status === "analyzing" && (
                              <div className="flex items-center space-x-2">
                                <Progress value={65} className="w-20" />
                                <span className="text-sm text-gray-600">65%</span>
                              </div>
                            )}

                            {analysis.status === "completed" && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span>{analysis.issues} problèmes</span>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{analysis.suggestions} suggestions</span>
                              </div>
                            )}

                            <div className="flex space-x-2">
                              {analysis.status === "completed" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-transparent"
                                    onClick={() => handleDownloadReport(analysis.id, analysis.name)}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    PDF
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => router.push(`/analysis/${analysis.id}`)}
                                  >
                                    Voir Détails
                                  </Button>
                                </>
                              )}
                              {analysis.status === "negotiating" && (
                                <Button
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700"
                                  onClick={() => handleStartNegotiation(analysis.id, analysis.name)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Négociation
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Negotiations Tab */}
              <TabsContent value="negotiations" className="space-y-6">
                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      Négociations Automatiques
                    </CardTitle>
                    <CardDescription>L'IA négocie vos contrats par email en temps réel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-xl p-6 bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-gray-900">NDA TechCorp - En cours</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Réponse envoyée</Badge>
                        </div>

                        <div className="bg-white p-4 rounded-lg border text-sm mb-4">
                          <p className="font-medium mb-2 text-gray-700">Dernière action :</p>
                          <p className="text-gray-800 italic">
                            "Nous proposons de limiter la clause de confidentialité à 2 ans au lieu de 5, conformément
                            aux standards du secteur..."
                          </p>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Envoyé il y a 2h</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent"
                            onClick={() => router.push("/negotiations/1")}
                          >
                            Voir conversation
                          </Button>
                        </div>
                      </div>

                      <div className="border rounded-xl p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-gray-900">Contrat Freelance - Attente</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">En attente de réponse</Badge>
                        </div>

                        <div className="bg-white p-4 rounded-lg border text-sm mb-4">
                          <p className="font-medium mb-2 text-gray-700">Proposition envoyée :</p>
                          <p className="text-gray-800 italic">
                            "Nous suggérons d'ajuster les délais de paiement à 30 jours au lieu de 60..."
                          </p>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Envoyé il y a 1 jour</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent"
                            onClick={() => {
                              toast({
                                title: "Relance envoyée",
                                description: "Un email de relance a été envoyé automatiquement.",
                              })
                            }}
                          >
                            Relancer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Timeline */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTimeline steps={timelineSteps} />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card
              className="bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => router.push("/performance")}
            >
              <CardHeader>
                <CardTitle className="text-white">Performance ce mois</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Taux de réussite</span>
                  <span className="text-2xl font-bold">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Temps moyen</span>
                  <span className="text-2xl font-bold">28s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Satisfaction</span>
                  <span className="text-2xl font-bold">4.9/5</span>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-orange-900">🚀 Passez au Pro</CardTitle>
                <CardDescription className="text-orange-700">
                  Analyses illimitées + négociations automatiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-orange-900">49€/mois</div>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    onClick={() => handleUpgradePlan("pro")}
                  >
                    Upgrader maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton actions={floatingActions} />
    </div>
  )
}
