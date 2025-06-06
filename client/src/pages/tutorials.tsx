import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Play, Download, Users, Brain, Video, 
  Mic, Camera, Shield, Clock, Star, ExternalLink 
} from "lucide-react";
import { Link } from "wouter";

export default function Tutorials() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const tutorials = [
    {
      id: "basics",
      title: "Bases du DeepFake",
      description: "Comprendre les fondamentaux de la technologie deepfake",
      duration: "15 min",
      difficulty: "Débutant",
      topics: ["Qu'est-ce qu'un deepfake?", "Comment ça fonctionne?", "Applications légitimes"]
    },
    {
      id: "detection",
      title: "Détecter les DeepFakes",
      description: "Apprendre à identifier les contenus synthétiques",
      duration: "20 min",
      difficulty: "Intermédiaire",
      topics: ["Signes visuels", "Outils de détection", "Analyse technique"]
    },
    {
      id: "ethics",
      title: "Éthique et Responsabilité",
      description: "Usage responsable de la technologie",
      duration: "25 min",
      difficulty: "Tous niveaux",
      topics: ["Principes éthiques", "Consentement", "Implications légales"]
    },
    {
      id: "technical",
      title: "Aspects Techniques",
      description: "Comprendre la technologie sous-jacente",
      duration: "45 min",
      difficulty: "Avancé",
      topics: ["Réseaux de neurones", "GANs", "Algorithmes d'apprentissage"]
    }
  ];

  const practicalGuides = [
    {
      title: "Configurer votre Premier Test",
      steps: [
        "Préparer des images de qualité",
        "Vérifier l'éclairage",
        "Choisir les bons paramètres",
        "Lancer le traitement",
        "Analyser les résultats"
      ]
    },
    {
      title: "Optimiser la Qualité",
      steps: [
        "Sélectionner des images haute résolution",
        "Ajuster les paramètres de qualité",
        "Utiliser la détection automatique",
        "Appliquer les corrections colorimétriques"
      ]
    },
    {
      title: "Appels Vidéo en Temps Réel",
      steps: [
        "Configurer votre caméra",
        "Sélectionner un modèle de visage",
        "Tester la performance",
        "Démarrer l'appel avec transformation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">DeepFake Éducatif</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-slate-600 hover:text-primary transition-colors">Accueil</Link>
              <Link href="/video-call" className="text-slate-600 hover:text-primary transition-colors">Appel Vidéo</Link>
              <Link href="/workspace" className="text-slate-600 hover:text-primary transition-colors">Espace de Travail</Link>
              <Link href="/tutorials" className="text-slate-600 hover:text-primary transition-colors font-medium text-primary">Tutoriels</Link>
              <Link href="/ethics" className="text-slate-600 hover:text-primary transition-colors">Éthique</Link>
              <Link href="/legal" className="text-slate-600 hover:text-primary transition-colors">Légal</Link>
              <Link href="/support" className="text-slate-600 hover:text-primary transition-colors">Support</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Tutoriels et Guides d'Apprentissage
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Apprenez à utiliser la technologie deepfake de manière éthique et responsable
          </p>
        </div>

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">Vidéos Tutoriels</TabsTrigger>
            <TabsTrigger value="guides">Guides Pratiques</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
          </TabsList>

          {/* Video Tutorials */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {tutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                        <p className="text-slate-600 text-sm mt-1">{tutorial.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {tutorial.duration}
                        </Badge>
                        <Badge 
                          variant={tutorial.difficulty === "Débutant" ? "default" : 
                                 tutorial.difficulty === "Intermédiaire" ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Contenu du tutoriel:</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {tutorial.topics.map((topic, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => setActiveVideo(tutorial.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Regarder
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Video Player */}
            {activeVideo && (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-60" />
                      <p className="text-lg">Lecteur Vidéo - Tutoriel: {tutorials.find(t => t.id === activeVideo)?.title}</p>
                      <p className="text-sm opacity-75 mt-2">
                        Contenu éducatif sur la technologie deepfake
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900">
                      {tutorials.find(t => t.id === activeVideo)?.title}
                    </h3>
                    <Button variant="ghost" onClick={() => setActiveVideo(null)}>
                      Fermer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Practical Guides */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-6">
              {practicalGuides.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-slate-600">{stepIndex + 1}</span>
                          </div>
                          <p className="text-slate-700">{step}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-2">
                      <Link href="/workspace">
                        <Button>
                          <Brain className="h-4 w-4 mr-2" />
                          Essayer Maintenant
                        </Button>
                      </Link>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Documentation Technique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <a href="#" className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-slate-900">Guide de l'API</h4>
                      <p className="text-sm text-slate-600">Documentation complète de l'API</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-slate-900">Référence Technique</h4>
                      <p className="text-sm text-slate-600">Spécifications techniques détaillées</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-slate-900">FAQ Développeurs</h4>
                      <p className="text-sm text-slate-600">Questions fréquentes techniques</p>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    Outils de Détection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-slate-900">Deepware Scanner</h4>
                      <p className="text-sm text-slate-600 mb-2">Détecteur automatique en ligne</p>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Accéder
                      </Button>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-slate-900">Microsoft Authenticator</h4>
                      <p className="text-sm text-slate-600 mb-2">Outil de vérification vidéo</p>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Research */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Recherche Académique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <a href="#" className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-slate-900">Papers de Référence</h4>
                      <p className="text-sm text-slate-600">Publications scientifiques importantes</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-slate-900">Datasets Publics</h4>
                      <p className="text-sm text-slate-600">Jeux de données pour la recherche</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-slate-900">Communauté Recherche</h4>
                      <p className="text-sm text-slate-600">Forums et discussions académiques</p>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Community */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Communauté
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <a href="#" className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-slate-900">Forum Discussion</h4>
                      <p className="text-sm text-slate-600">Échanges avec d'autres utilisateurs</p>
                    </a>
                    <a href="#" className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-slate-900">Blog Éducatif</h4>
                      <p className="text-sm text-slate-600">Articles et actualités</p>
                    </a>
                    <Link href="/support">
                      <div className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <h4 className="font-medium text-slate-900">Support Communautaire</h4>
                        <p className="text-sm text-slate-600">Aide et assistance</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Access */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
              Accès Rapide aux Fonctionnalités
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/workspace">
                <Button className="w-full h-16 flex flex-col gap-1" variant="outline">
                  <Brain className="h-6 w-6" />
                  <span className="text-sm">Espace de Travail</span>
                </Button>
              </Link>
              <Link href="/video-call">
                <Button className="w-full h-16 flex flex-col gap-1" variant="outline">
                  <Video className="h-6 w-6" />
                  <span className="text-sm">Appel Vidéo</span>
                </Button>
              </Link>
              <Link href="/ethics">
                <Button className="w-full h-16 flex flex-col gap-1" variant="outline">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">Guide Éthique</span>
                </Button>
              </Link>
              <Link href="/support">
                <Button className="w-full h-16 flex flex-col gap-1" variant="outline">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Support</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}