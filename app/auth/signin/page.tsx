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
import { Shield, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react"

interface SigninState {
  email: string
  password: string
  loading: boolean
  error: string | null
}

export default function SigninPage() {
  const router = useRouter()
  const [state, setState] = useState<SigninState>({
    email: "",
    password: "",
    loading: false,
    error: null,
  })

  const handleInputChange = (field: keyof SigninState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value, error: null }))
  }

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!state.email || !state.password) {
      setState((prev) => ({ ...prev, error: "Veuillez remplir tous les champs" }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // Simulation de connexion pour la démo
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // En production, appeler l'API d'authentification
      const mockUser = {
        id: "user_123",
        email: state.email,
        fullName: "Jean Dupont",
        plan: "free",
      }

      // Stocker les données utilisateur (en production, utiliser des tokens JWT)
      localStorage.setItem("user", JSON.stringify(mockUser))

      toast({
        title: "Connexion réussie !",
        description: "Redirection vers votre dashboard...",
      })

      router.push("/dashboard")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur de connexion"
      setState((prev) => ({ ...prev, error: errorMessage }))

      toast({
        title: "Erreur de connexion",
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
          <p className="text-gray-600">Accédez à votre dashboard juridique</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Se connecter</CardTitle>
            <CardDescription>Entrez vos identifiants pour continuer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignin} className="space-y-4">
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
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/signup")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  S'inscrire
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/auth/forgot-password")}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>
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
