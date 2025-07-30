"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RiskGauge } from "@/components/ui/risk-gauge"
import { RiskCard } from "@/components/ui/risk-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, MessageSquare, Download, Shield, Send, Sparkles, TrendingUp, Users, Clock } from "lucide-react"

interface RiskItem {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  clause: string
  suggestion: string
  status: "pending" | "accepted" | "rejected"
}

export default function ContractAnalysis() {
  const router = useRouter()
  const [risks, setRisks] = useState<RiskItem[]>([
    {
      id: "1",
      type: "critical",
      title: "Cession totale des droits IP",
      description: "Cette clause vous fait perdre tous vos droits sur votre travail",
      clause:
        '"Le prestataire cède à titre exclusif et définitif tous ses droits de propriété intellectuelle sur les créations réalisées"',
      suggestion:
        "\"Le prestataire accorde une licence non-exclusive d'utilisation, les droits moraux restant acquis à l'auteur\"",
      status: "pending",
    },
    {
      id: "2",
      type: "critical",
      title: "Clause d'exclusivité abusive",
      description: "Vous interdit de travailler avec d'autres clients pendant 2 ans",
      clause: '"Le prestataire s\'engage à ne pas travailler pour des entreprises concurrentes pendant 24 mois"',
      suggestion: '"Limitation de l\'exclusivité aux projets directement concurrents, durée réduite à 6 mois"',
      status: "pending",
    },
    {
      id: "3",
      type: "warning",
      title: "Délais de paiement excessifs",
      description: "Paiement à 90 jours, bien au-delà des standards (30 jours)",
      clause: '"Le règlement interviendra dans un délai de 90 jours suivant réception de la facture"',
      suggestion: '"Le règlement interviendra dans un délai de 30 jours suivant réception de la facture"',
      status: "pending",
    },
    {
      id: "4",
      type: "info",
      title: "Clause de résiliation",
      description: "Possibilité de résiliation sans préavis ni indemnité",
      clause: '"Chaque partie peut résilier le contrat à tout moment sans préavis"',
      suggestion: '"Résiliation possible avec un préavis de 30 jours et indemnisation des travaux en cours"',
      status: "pending",
    },
  ])

  const [selectedRisks, setSelectedRisks] = useState<string[]>([])
  const [isNegotiating, setIsNegotiating] = useState(false)

  const criticalCount = risks.filter((r) => r.type === "critical").length
  const warningCount = risks.filter((r) => r.type === "warning").length
  const infoCount = risks.filter((r) => r.type === "info").length

  const riskScore = Math.max(0, 100 - (criticalCount * 30 + warningCount * 15 + infoCount * 5))

  const handleRiskStatusChange = (id: string, status: "accepted" | "rejected") => {
    setRisks((prev) => prev.map((risk) => (risk.id === id ? { ...risk, status } : risk)))

    const risk = risks.find((r) => r.id === id)
    toast({
      title: status === "accepted" ? "Suggestion acceptée" : "Risque ignoré",
      description: `${risk?.title} ${status === "accepted" ? "sera inclus dans la négociation" : "a été ignoré"}`,
    })
  }

  const handleRiskEdit = (id: string) => {
    toast({
      title: "Édition du risque",
      description: "Fonctionnalité d'édition en cours de développement",
    })
  }

  const handleDownloadReport = () => {
    toast({
      title: "Téléchargement démarré",
      description: "Le rapport PDF complet est en cours de génération...",
    })

    // Simulate PDF generation and download
    setTimeout(() => {
      toast({
        title: "Rapport téléchargé",
        description: "Le rapport a été téléchargé avec succès !",
      })
    }, 2000)
  }

  const handleStartNegotiation = async () => {
    setIsNegotiating(true)

    toast({
      title: "Négociation démarrée",
      description: "L'IA prépare l'email de négociation...",
    })

    // Simulate negotiation process
    setTimeout(() => {
      setIsNegotiating(false)
      toast({
        title: "Email envoyé !",
        description: "La négociation automatique a été envoyée à contact@techcorp.com",
      })
      router.push("/negotiations/new-negotiation-id")
    }, 3000)
  }

  const handleSelectiveNegotiation = () => {
    const acceptedRisks = risks.filter((r) => r.status === "accepted")
    if (acceptedRisks.length === 0) {
      toast({
        title: "Aucun risque sélectionné",
        description: "Veuillez accepter au moins un risque pour démarrer la négociation",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Négociation sélective",
      description: `${acceptedRisks.length} point(s) seront négociés`,
    })

    handleStartNegotiation()
  }

  const handleViewBenchmarks = () => {
    router.push("/benchmarks/nda-contracts")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Analyse Détaillée</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-transparent" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="sm"
              onClick={handleStartNegotiation}
              disabled={isNegotiating}
            >
              {isNegotiating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Négociation...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Négocier Automatiquement
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Risk Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Info */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      NDA_Client_TechCorp.pdf
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      Analysé le 30 janvier 2025 à 14:32 • Temps d'analyse: 28 secondes
                    </CardDescription>
                  </div>
                  <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">🔴 Risque Élevé</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Enhanced Risk Score */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Score de Sécurité Juridique
                </CardTitle>
                <CardDescription>
                  Évaluation globale basée sur l'analyse de {risks.length} clauses critiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <RiskGauge score={riskScore} size="lg" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-3xl font-bold text-red-600">
                          <AnimatedCounter end={criticalCount} />
                        </div>
                        <div className="text-sm text-red-700 font-medium">Critiques</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-3xl font-bold text-orange-600">
                          <AnimatedCounter end={warningCount} />
                        </div>
                        <div className="text-sm text-orange-700 font-medium">Alertes</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600">
                          <AnimatedCounter end={infoCount} />
                        </div>
                        <div className="text-sm text-blue-700 font-medium">Infos</div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Impact financier estimé:</span>
                        <span className="font-bold text-red-600">-15,000€</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Temps de résolution:</span>
                        <span className="font-bold text-blue-600">2-3 jours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Problèmes Détectés</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {risks.filter((r) => r.status === "pending").length} en attente
                </Badge>
              </div>

              {risks.map((risk, index) => (
                <div
                  key={risk.id}
                  className="animate-in slide-in-from-left-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RiskCard risk={risk} onStatusChange={handleRiskStatusChange} onEdit={handleRiskEdit} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Actions IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleStartNegotiation}
                  disabled={isNegotiating}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isNegotiating ? "Négociation..." : "Négocier Tout Automatiquement"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover:bg-blue-50"
                  onClick={handleSelectiveNegotiation}
                  disabled={isNegotiating}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Négociation Sélective ({risks.filter((r) => r.status === "accepted").length})
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover:bg-green-50"
                  onClick={handleDownloadReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter le Rapport Complet
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <TrendingUp className="h-5 w-5" />
                  Insights IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-purple-800">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Ce contrat est 40% plus risqué que la moyenne
                </div>
                <div className="flex items-center gap-2 text-purple-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Négociation recommandée sous 48h
                </div>
                <div className="flex items-center gap-2 text-purple-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Taux de succès prévu: 85%
                </div>
              </CardContent>
            </Card>

            {/* Negotiation Preview */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Aperçu Email de Négociation
                </CardTitle>
                <CardDescription>L'IA va envoyer cet email automatiquement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 max-h-64 overflow-y-auto">
                  <p>
                    <strong>À :</strong> contact@techcorp.com
                  </p>
                  <p>
                    <strong>Objet :</strong> Amendements proposés - NDA
                  </p>
                  <Separator />
                  <div className="text-gray-700 space-y-2">
                    <p>Bonjour,</p>
                    <p>
                      Après examen attentif du NDA, nous proposons quelques amendements pour équilibrer les intérêts des
                      deux parties :
                    </p>
                    <ul className="space-y-1 list-disc list-inside ml-2">
                      <li>Limitation des droits IP à une licence non-exclusive</li>
                      <li>Réduction de la clause d'exclusivité à 6 mois</li>
                      <li>Délais de paiement à 30 jours</li>
                      <li>Ajout d'une clause de résiliation équitable</li>
                    </ul>
                    <p>
                      Ces modifications sont conformes aux standards du secteur et permettront une collaboration plus
                      équilibrée.
                    </p>
                    <p>Nous restons à votre disposition pour discuter de ces points.</p>
                    <p>
                      Cordialement,
                      <br />
                      AI Law Shield
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleStartNegotiation}
                  disabled={isNegotiating}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isNegotiating ? "Envoi en cours..." : "Envoyer la Négociation"}
                </Button>
              </CardContent>
            </Card>

            {/* Similar Contracts */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={handleViewBenchmarks}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Users className="h-5 w-5" />
                  Contrats Similaires
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Analysés cette semaine:</span>
                  <span className="font-bold text-blue-600">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Score moyen:</span>
                  <span className="font-bold text-orange-600">67/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Négociations réussies:</span>
                  <span className="font-bold text-green-600">91%</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 bg-transparent"
                  onClick={handleViewBenchmarks}
                >
                  Voir les benchmarks
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
