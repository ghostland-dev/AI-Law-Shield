"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { Shield, Mail, Lock, User, ArrowLeft, Loader2, CheckCircle } from "lucide-react"

interface SignupState {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  loading: boolean
  error: string | null
  success: boolean
}

export default function SignupPage() {
  const router = useRouter()
  const [state, setState] = useState<SignupState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: null,
    success: false,
  })

  const handleInputChange = (field: keyof SignupState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value, error: null }))
  }

  const validateForm = () => {
    if (!state.fullName.trim()) {
      setState((prev) => ({ ...prev, error: "Le nom complet est requis" }))
      return false
    }

    if (!state.email.trim()) {
      setState((prev) => ({ ...prev, error: "L'email est requis" }))
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(state.email)) {
      setState((prev) => ({ ...prev, error: "Format d'email invalide" }))
      return false
    }

    if (state.password.length < 8) {
      setState((prev) => ({ ...prev, error: "Le mot de passe doit contenir au moins 8 caractères" }))
      return false
    }

    if (state.password !== state.confirmPassword) {
      setState((prev) => ({ ...prev, error: "Les mots de passe ne correspondent pas" }))
      return false
    }

    return true
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: state.fullName,
          email: state.email,
          password: state.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la création du compte")
      }

      setState((prev) => ({ ...prev, success: true }))

      toast({
        title: "Compte créé avec succès !",
        description: "Vérifiez votre email pour activer votre compte.",
      })

      // Redirection après 3 secondes
      setTimeout(() => {
        router.push("/auth/signin")
      }, 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      setState((prev) => ({ ...prev, error: errorMessage }))

      toast({
        title: "Erreur de création",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">AI Law Shield</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h1>
          <p className="text-gray-600">Rejoignez des milliers d'utilisateurs protégés</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Inscription Gratuite</CardTitle>
            <CardDescription>Commencez avec 1 analyse gratuite par mois</CardDescription>
          </CardHeader>
          <CardContent>
            {state.success ? (
              <div className="text-center space-y-4">
                <div className="animate-bounce">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Compte créé avec succès !</h3>
                  <p className="text-green-700 text-sm">
                    Un email de vérification a été envoyé à <strong>{state.email}</strong>
                  </p>
                  <p className="text-gray-600 text-sm mt-2">Redirection vers la connexion...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Jean Dupont"
                      value={state.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="pl-10"
                      disabled={state.loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean@exemple.com"
                      value={state.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      disabled={state.loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={state.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10"
                      disabled={state.loading}
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Minimum 8 caractères</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={state.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10"
                      disabled={state.loading}
                      required
                    />
                  </div>
                </div>

                {state.error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{state.error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={state.loading}
                >
                  {state.loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/signin")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  )
}
