import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Download, ExternalLink, Video, FileText, 
  Users, Code, Globe, HelpCircle, Star, Play
} from "lucide-react";
import { Link } from "wouter";

export default function Resources() {
  const documentationSections = [
    {
      title: "Guide de Démarrage",
      description: "Introduction complète à la technologie deepfake",
      items: [
        { name: "Qu'est-ce qu'un deepfake?", type: "Guide", url: "/tutorials" },
        { name: "Premiers pas avec l'application", type: "Tutoriel", url: "/workspace" },
        { name: "Configuration de l'environnement", type: "Guide", url: "/tutorials" }
      ]
    },
    {
      title: "Guides Techniques",
      description: "Documentation technique approfondie",
      items: [
        { name: "API de traitement d'images", type: "Documentation", url: "#" },
        { name: "Intégration WebRTC", type: "Guide", url: "#" },
        { name: "Optimisation des performances", type: "Guide", url: "#" }
      ]
    },
    {
      title: "Sécurité et Éthique",
      description: "Bonnes pratiques et considérations éthiques",
      items: [
        { name: "Code d'éthique complet", type: "Document", url: "/ethics" },
        { name: "Détection des deepfakes", type: "Guide", url: "/tutorials" },
        { name: "Signalement d'abus", type: "Procédure", url: "/support" }
      ]
    }
  ];

  const videoTutorials = [
    {
      title: "Introduction aux DeepFakes",
      duration: "15:30",
      difficulty: "Débutant",
      description: "Comprendre les bases de la technologie deepfake",
      thumbnail: "/placeholder-video-1.jpg"
    },
    {
      title: "Utilisation de l'Espace de Travail",
      duration: "22:45",
      difficulty: "Intermédiaire",
      description: "Guide complet de l'interface de test",
      thumbnail: "/placeholder-video-2.jpg"
    },
    {
      title: "Appels Vidéo en Temps Réel",
      duration: "18:20",
      difficulty: "Intermédiaire",
      description: "Configuration et utilisation des appels deepfake",
      thumbnail: "/placeholder-video-3.jpg"
    },
    {
      title: "Détection et Prévention",
      duration: "25:15",
      difficulty: "Avancé",
      description: "Techniques de détection des contenus synthétiques",
      thumbnail: "/placeholder-video-4.jpg"
    }
  ];

  const faqItems = [
    {
      question: "Comment fonctionne la technologie deepfake?",
      answer: "Les deepfakes utilisent des réseaux de neurones génératifs adverses (GANs) pour analyser et reproduire les caractéristiques faciales et vocales."
    },
    {
      question: "Cette application est-elle sécurisée?",
      answer: "Oui, toutes les données sont traitées localement et supprimées automatiquement. Un filigrane éducatif est ajouté à tous les contenus générés."
    },
    {
      question: "Puis-je utiliser mes propres modèles?",
      answer: "Oui, vous pouvez créer et entraîner vos propres modèles dans l'espace de travail en utilisant vos images et enregistrements audio."
    },
    {
      question: "Comment signaler un usage abusif?",
      answer: "Utilisez le formulaire de contact dans la section Support ou contactez directement les autorités compétentes."
    }
  ];

  const communityResources = [
    {
      title: "Forum de Discussion",
      description: "Échangez avec d'autres utilisateurs et experts",
      icon: Users,
      url: "#"
    },
    {
      title: "Dépôt GitHub",
      description: "Code source et contributions open source",
      icon: Code,
      url: "#"
    },
    {
      title: "Blog Éducatif",
      description: "Articles et actualités sur les deepfakes",
      icon: Globe,
      url: "#"
    },
    {
      title: "Support Communautaire",
      description: "Aide et assistance de la communauté",
      icon: HelpCircle,
      url: "/support"
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
              <Link href="/tutorials" className="text-slate-600 hover:text-primary transition-colors">Tutoriels</Link>
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
            Centre de Ressources
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Documentation, tutoriels et ressources pour maîtriser la technologie deepfake de manière éthique
          </p>
        </div>

        <Tabs defaultValue="documentation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="videos">Tutoriels Vidéo</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="community">Communauté</TabsTrigger>
          </TabsList>

          {/* Documentation */}
          <TabsContent value="documentation" className="space-y-8">
            {documentationSections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {section.title}
                  </CardTitle>
                  <p className="text-slate-600">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {section.items.map((item, itemIndex) => (
                      <Link key={itemIndex} href={item.url}>
                        <div className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">{item.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Lire la documentation
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Downloads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-green-600" />
                  Téléchargements Rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="font-medium">Guide Complet PDF</span>
                    <span className="text-xs text-slate-500">Documentation complète (2.3 MB)</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Code className="h-6 w-6" />
                    <span className="font-medium">Exemples de Code</span>
                    <span className="text-xs text-slate-500">Intégrations et API (850 KB)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Tutorials */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video bg-slate-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-12 w-12 mx-auto mb-2 opacity-75" />
                      <p className="text-sm opacity-60">Tutoriel Vidéo</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{video.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {video.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{video.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{video.duration}</span>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Regarder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-slate-900 mb-2">Vous ne trouvez pas votre réponse?</h3>
                <p className="text-slate-600 mb-4">
                  Consultez notre section support pour plus d'aide ou contactez notre équipe.
                </p>
                <Link href="/support">
                  <Button>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Aller au Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {communityResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <resource.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">{resource.title}</h3>
                        <p className="text-slate-600 mb-4">{resource.description}</p>
                        <Link href={resource.url}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Accéder
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Contribuer au Projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Ce projet est open source et nous accueillons les contributions de la communauté. 
                  Vous pouvez contribuer de plusieurs façons:
                </p>
                <ul className="space-y-2 text-sm text-slate-600 mb-6">
                  <li>• Signaler des bugs ou proposer des améliorations</li>
                  <li>• Contribuer au code source sur GitHub</li>
                  <li>• Améliorer la documentation</li>
                  <li>• Partager vos cas d'usage éducatifs</li>
                  <li>• Aider d'autres utilisateurs sur le forum</li>
                </ul>
                <div className="flex gap-2">
                  <Button>
                    <Code className="h-4 w-4 mr-2" />
                    Voir le Code Source
                  </Button>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Rejoindre le Forum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Download, ExternalLink, Code, Lightbulb } from "lucide-react";
import { Link } from "wouter";

export default function Resources() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Ressources Éducatives</h1>
          <p className="text-slate-600">
            Découvrez des ressources complètes sur la technologie deepfake, ses applications et implications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Guides Techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Guides Techniques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Introduction aux Réseaux Neuronaux
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Architecture GAN Expliquée
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Traitement d'Images en Temps Réel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tutoriels Vidéo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Tutoriels Vidéo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Comment Détecter un Deepfake
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Utilisation Éthique de l'IA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Démonstration Technique
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outils et Logiciels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Outils et Logiciels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Détecteurs de Deepfake
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Bibliothèques Python
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Extensions Navigateur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Liens Utiles */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Liens Utiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Recherche Académique</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-blue-600 hover:underline">Papers sur les GANs</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Détection de Deepfakes</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Éthique de l'IA</a></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Communautés</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-blue-600 hover:underline">Forum Deep Learning</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Discord IA Éthique</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Reddit r/MachineLearning</a></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
