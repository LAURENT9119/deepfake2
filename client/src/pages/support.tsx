import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, MessageCircle, Mail, Phone, Clock, 
  Search, FileText, Users, AlertTriangle, CheckCircle 
} from "lucide-react";
import { Link } from "wouter";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal"
  });

  const faqItems = [
    {
      question: "Qu'est-ce qu'un deepfake et comment ça fonctionne?",
      answer: "Un deepfake est une technique d'intelligence artificielle qui utilise des réseaux de neurones pour créer ou modifier des contenus vidéo, audio ou photo de manière réaliste. La technologie analyse des milliers d'images pour apprendre les caractéristiques d'un visage ou d'une voix.",
      category: "Général"
    },
    {
      question: "Cette plateforme est-elle sécurisée?",
      answer: "Oui, notre plateforme est conçue avec la sécurité en priorité. Toutes les données sont traitées localement, supprimées après usage, et tous les contenus générés incluent un filigrane éducatif automatique.",
      category: "Sécurité"
    },
    {
      question: "Puis-je utiliser cette technologie commercialement?",
      answer: "Non, cette plateforme est strictement destinée à des fins éducatives et de démonstration. L'utilisation commerciale n'est pas autorisée. Consultez nos conditions d'utilisation pour plus de détails.",
      category: "Légal"
    },
    {
      question: "Comment améliorer la qualité des résultats?",
      answer: "Pour de meilleurs résultats : utilisez des images haute résolution, assurez-vous d'un bon éclairage, choisissez des photos avec des visages clairement visibles, et ajustez les paramètres de qualité dans l'interface.",
      category: "Technique"
    },
    {
      question: "Que faire si je détecte un usage malveillant?",
      answer: "Signalez immédiatement tout usage malveillant via notre formulaire de contact en sélectionnant 'Urgence'. Nous prenons ces signalements très au sérieux et coopérons avec les autorités si nécessaire.",
      category: "Éthique"
    },
    {
      question: "Les appels vidéo en temps réel fonctionnent-ils vraiment?",
      answer: "Oui, notre technologie permet la transformation faciale en temps réel pendant les appels vidéo avec une latence minimale. La performance dépend de votre matériel et connexion internet.",
      category: "Technique"
    }
  ];

  const contactOptions = [
    {
      type: "email",
      title: "Support par Email",
      description: "Réponse sous 24h",
      contact: "support@deepfake-educatif.fr",
      icon: Mail,
      available: "24/7"
    },
    {
      type: "chat",
      title: "Chat en Direct",
      description: "Assistance immédiate",
      contact: "Chat disponible",
      icon: MessageCircle,
      available: "9h-18h"
    },
    {
      type: "phone",
      title: "Support Téléphonique",
      description: "Pour les cas urgents",
      contact: "+33 1 23 45 67 89",
      icon: Phone,
      available: "9h-17h"
    }
  ];

  const filteredFAQ = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">DeepFake Éducatif</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-slate-600 hover:text-primary transition-colors">Accueil</Link>
              <Link href="/video-call" className="text-slate-600 hover:text-primary transition-colors">Appel Vidéo</Link>
              <Link href="/workspace" className="text-slate-600 hover:text-primary transition-colors">Espace de Travail</Link>
              <Link href="/tutorials" className="text-slate-600 hover:text-primary transition-colors">Tutoriels</Link>
              <Link href="/ethics" className="text-slate-600 hover:text-primary transition-colors">Éthique</Link>
              <Link href="/legal" className="text-slate-600 hover:text-primary transition-colors">Légal</Link>
              <Link href="/support" className="text-slate-600 hover:text-primary transition-colors font-medium text-primary">Support</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Centre d'Aide et Support
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Trouvez rapidement les réponses à vos questions ou contactez notre équipe d'assistance
          </p>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="status">État du Service</TabsTrigger>
          </TabsList>

          {/* FAQ Section */}
          <TabsContent value="faq" className="space-y-6">
            <div className="grid gap-6">
              {filteredFAQ.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-slate-900 pr-4">
                        {item.question}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
              
              {filteredFAQ.length === 0 && searchQuery && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun résultat trouvé</h3>
                    <p className="text-slate-600 mb-4">
                      Aucune question ne correspond à votre recherche "{searchQuery}"
                    </p>
                    <Button onClick={() => setSearchQuery("")} variant="outline">
                      Effacer la recherche
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Parcourir par Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {["Général", "Technique", "Sécurité", "Légal", "Éthique"].map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      onClick={() => setSearchQuery(category)}
                      className="h-auto p-4 flex flex-col gap-2"
                    >
                      <span className="font-medium">{category}</span>
                      <span className="text-xs text-slate-500">
                        {faqItems.filter(item => item.category === category).length} articles
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {contactOptions.map((option) => (
                <Card key={option.type} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <option.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{option.title}</h3>
                    <p className="text-slate-600 text-sm mb-3">{option.description}</p>
                    <p className="font-medium text-slate-900 mb-2">{option.contact}</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {option.available}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Formulaire de Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom complet
                      </label>
                      <Input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priorité
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: "low", label: "Faible", color: "bg-green-100 text-green-700" },
                        { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-700" },
                        { value: "high", label: "Élevée", color: "bg-orange-100 text-orange-700" },
                        { value: "urgent", label: "Urgente", color: "bg-red-100 text-red-700" }
                      ].map((priority) => (
                        <Button
                          key={priority.value}
                          type="button"
                          variant={contactForm.priority === priority.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setContactForm(prev => ({ ...prev, priority: priority.value }))}
                          className={contactForm.priority === priority.value ? priority.color : ""}
                        >
                          {priority.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sujet
                    </label>
                    <Input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Résumé de votre demande"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Décrivez votre demande en détail..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer le Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Status */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  État des Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: "Plateforme Web", status: "Opérationnel", uptime: "99.9%" },
                    { service: "Traitement d'Images", status: "Opérationnel", uptime: "99.7%" },
                    { service: "Appels Vidéo Temps Réel", status: "Opérationnel", uptime: "99.8%" },
                    { service: "API de Détection", status: "Opérationnel", uptime: "99.6%" },
                    { service: "Système de Upload", status: "Opérationnel", uptime: "99.9%" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-slate-900">{item.service}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-green-700 border-green-200">
                          {item.status}
                        </Badge>
                        <span className="text-sm text-slate-600">{item.uptime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Programmée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium text-slate-900 mb-2">Aucune maintenance prévue</h3>
                  <p className="text-slate-600">Tous les services fonctionnent normalement</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique des Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-yellow-800">Maintenance de routine</h4>
                        <p className="text-yellow-700 text-sm">Mise à jour des serveurs de traitement</p>
                      </div>
                      <span className="text-yellow-600 text-sm">Il y a 3 jours</span>
                    </div>
                  </div>
                  <div className="p-4 border-l-4 border-green-400 bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-green-800">Service restauré</h4>
                        <p className="text-green-700 text-sm">Tous les services fonctionnent normalement</p>
                      </div>
                      <span className="text-green-600 text-sm">Il y a 1 semaine</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Emergency Contact */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Contact d'Urgence</h3>
                <p className="text-red-700 text-sm mb-3">
                  En cas d'utilisation malveillante ou criminelle de cette technologie, 
                  contactez immédiatement les autorités compétentes.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-red-300 text-red-700">
                    Signaler un Abus
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-700">
                    Cyberpolicce
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}