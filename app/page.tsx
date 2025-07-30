"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Zap, FileText, MessageSquare, ArrowRight, Star } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Analyse Instantanée",
      description: "Scannez vos contrats PDF, DOCX en 30 secondes avec notre IA juridique avancée",
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Détection de Risques",
      description: "Identifiez automatiquement les clauses dangereuses et les pièges juridiques",
      color: "bg-red-50 border-red-200",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
      title: "Négociation Auto",
      description: "L'IA rédige et envoie vos emails de négociation de manière professionnelle",
      color: "bg-purple-50 border-purple-200",
    },
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: "Suggestions Optimisées",
      description: "Recevez des amendements juridiquement solides et équilibrés",
      color: "bg-green-50 border-green-200",
    },
  ]

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Développeuse Freelance",
      content: "AI Law Shield m'a fait économiser 3000€ en détectant une clause abusive que j'avais ratée !",
      rating: 5,
    },
    {
      name: "Thomas Martin",
      role: "Fondateur Startup",
      content: "Indispensable pour négocier avec les grands comptes. L'IA est bluffante de précision.",
      rating: 5,
    },
    {
      name: "Sophie Laurent",
      role: "Consultante",
      content: "Plus besoin d'avocat pour mes contrats simples. Gain de temps et d'argent énorme !",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "",
      description: "Pour découvrir",
      features: [
        "1 analyse par mois",
        "Détection des clauses dangereuses",
        "Rapport PDF basique",
        "Support communautaire",
      ],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      name: "Pro",
      price: "49€",
      period: "/mois",
      description: "Pour freelances actifs",
      features: [
        "Analyses illimitées",
        "3 négociations automatisées",
        "Templates juridiques",
        "Support prioritaire",
        "Historique complet",
        "Export avancé",
      ],
      cta: "Choisir Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "199€",
      period: "/mois",
      description: "Pour startups & agences",
      features: [
        "Tout du plan Pro",
        "Négociations illimitées",
        "API intégration",
        "Audit juridique annuel",
        "Manager dédié",
        "Formation équipe",
      ],
      cta: "Choisir Enterprise",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AI Law Shield</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Tarifs
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
              Témoignages
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/auth/signin")}>
              Se connecter
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/auth/signup")}>
              Essayer Gratuitement
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">💡 L'Assistant Juridique Autonome</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Protégez-vous des <span className="gradient-text">contrats piégés</span> en 30 secondes
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Une IA spécialisée qui analyse vos contrats, détecte les clauses dangereuses et négocie automatiquement à
            votre place. Fini les arnaques juridiques !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 btn-glow"
              onClick={() => router.push("/upload")}
            >
              <Zap className="mr-2 h-5 w-5" />
              Analyser un contrat gratuitement
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 bg-white/80 backdrop-blur-sm"
              onClick={() => router.push("/demo")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Voir la démo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center animate-fade-in">
              <div className="text-4xl font-bold text-red-600 mb-2">72%</div>
              <p className="text-gray-600">des freelances signent des contrats déséquilibrés</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl font-bold text-green-600 mb-2">30s</div>
              <p className="text-gray-600">pour analyser n'importe quel contrat</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl font-bold text-blue-600 mb-2">300€/h</div>
              <p className="text-gray-600">économisés vs un avocat traditionnel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">🚨 Le Problème (Énorme)</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-red-200 card-hover">
                <CardHeader>
                  <CardTitle className="text-red-700">Contrats Piégés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p className="italic">"Vous cédez tous vos droits IP"</p>
                    <p className="italic">"Exclusivité à vie"</p>
                    <p className="italic">"Paiement sous 90 jours"</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-200 card-hover">
                <CardHeader>
                  <CardTitle className="text-red-700">Coûts Prohibitifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p>Les avocats coûtent 300€/h</p>
                    <p>3 jours d'attente minimum</p>
                    <p>Pas accessible aux petites structures</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">🔥 La Solution (Magique)</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`${feature.color} card-hover animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Example */}
          <div className="max-w-4xl mx-auto mt-16">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 card-hover">
              <CardHeader>
                <CardTitle className="text-center">Exemple Réel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 rounded-lg border">
                  <p className="text-gray-700 mb-4">
                    <strong>Problème détecté :</strong> NDA avec clause abusive
                  </p>
                  <div className="bg-red-50 p-4 rounded border-l-4 border-red-400 mb-4">
                    <p className="text-red-700">⚠️ "Confidentialité de 5 ans"</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
                    <p className="text-green-700 mb-2">
                      ✅ <strong>Suggestion :</strong> Limiter la confidentialité à 2 ans au lieu de 5.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        ACCEPTER
                      </Button>
                      <Button size="sm" variant="outline">
                        MODIFIER
                      </Button>
                      <Button size="sm" variant="outline">
                        REFUSER
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">⭐ Ce que disent nos utilisateurs</h2>
            <p className="text-gray-600">Plus de 10,000 professionnels nous font confiance</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">💰 Tarifs Transparents</h2>
            <p className="text-gray-600">Choisissez le plan qui correspond à vos besoins</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative card-hover ${plan.popular ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">Populaire</Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}`}
                    onClick={() => router.push(`/auth/signup?plan=${plan.name.toLowerCase()}`)}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Potential */}
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 card-hover">
              <CardHeader>
                <CardTitle className="text-green-700">Économies Réalisées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">2,400€</div>
                    <p className="text-sm text-gray-600">économisés en moyenne par an</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">94%</div>
                    <p className="text-sm text-gray-600">de taux de satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à Protéger vos Contrats ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez les milliers de freelances et startups qui se protègent déjà
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              onClick={() => router.push("/auth/signup")}
            >
              <Shield className="mr-2 h-5 w-5" />
              Commencer Gratuitement
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 bg-transparent"
              onClick={() => router.push("/upload")}
            >
              <Zap className="mr-2 h-5 w-5" />
              Analyser un Contrat
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">AI Law Shield</span>
              </div>
              <p className="text-gray-400 text-sm">
                L'assistant juridique IA qui protège vos contrats et négocie à votre place.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="/demo" className="hover:text-white">
                    Démo
                  </a>
                </li>
                <li>
                  <a href="/api" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/help" className="hover:text-white">
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/status" className="hover:text-white">
                    Statut
                  </a>
                </li>
                <li>
                  <a href="/security" className="hover:text-white">
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/privacy" className="hover:text-white">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white">
                    CGU
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="hover:text-white">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="/gdpr" className="hover:text-white">
                    RGPD
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">© 2025 AI Law Shield. Tous droits réservés.</div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
