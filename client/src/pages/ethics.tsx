import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Users, Scale, BookOpen, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Ethics() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">DeepFake Éducatif</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-slate-600 hover:text-primary transition-colors">Accueil</Link>
              <Link href="/video-call" className="text-slate-600 hover:text-primary transition-colors">Appel Vidéo</Link>
              <Link href="/workspace" className="text-slate-600 hover:text-primary transition-colors">Espace de Travail</Link>
              <Link href="/tutorials" className="text-slate-600 hover:text-primary transition-colors">Tutoriels</Link>
              <Link href="/ethics" className="text-slate-600 hover:text-primary transition-colors font-medium text-primary">Éthique</Link>
              <Link href="/legal" className="text-slate-600 hover:text-primary transition-colors">Légal</Link>
              <Link href="/support" className="text-slate-600 hover:text-primary transition-colors">Support</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Éthique et Usage Responsable
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Notre engagement envers une utilisation éthique et éducative de la technologie deepfake
            </p>
          </div>

          {/* Warning Alert */}
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              <strong>Avertissement Important:</strong> Cette technologie est uniquement destinée à des fins éducatives et de démonstration. 
              L'utilisation malveillante ou la création de contenu trompeur est strictement interdite.
            </AlertDescription>
          </Alert>

          {/* Main Content */}
          <div className="grid gap-8 mb-8">
            {/* Principles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-blue-600" />
                  Nos Principes Éthiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">1. Transparence</h3>
                      <p className="text-blue-700 text-sm">
                        Tous les contenus générés sont automatiquement marqués avec un filigrane "ÉDUCATIF - DÉMONSTRATION"
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">2. Consentement</h3>
                      <p className="text-green-700 text-sm">
                        Utilisation uniquement avec le consentement explicite de toutes les personnes concernées
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">3. Éducation</h3>
                      <p className="text-purple-700 text-sm">
                        Promouvoir la compréhension et la sensibilisation aux technologies deepfake
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h3 className="font-semibold text-orange-900 mb-2">4. Responsabilité</h3>
                      <p className="text-orange-700 text-sm">
                        Les utilisateurs sont responsables de l'usage qu'ils font de cette technologie
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  Directives d'Utilisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">✓</span>
                      Utilisations Acceptables
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600 ml-8">
                      <li>• Recherche académique et éducation</li>
                      <li>• Démonstrations techniques contrôlées</li>
                      <li>• Formation à la détection de deepfakes</li>
                      <li>• Sensibilisation aux enjeux de sécurité numérique</li>
                      <li>• Tests de robustesse des systèmes de détection</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-700">✗</span>
                      Utilisations Interdites
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600 ml-8">
                      <li>• Création de fausses informations ou désinformation</li>
                      <li>• Usurpation d'identité ou fraude</li>
                      <li>• Harcèlement ou intimidation</li>
                      <li>• Contenu pornographique non consensuel</li>
                      <li>• Manipulation d'élections ou processus démocratiques</li>
                      <li>• Chantage ou extorsion</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detection Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-600" />
                  Comment Détecter les Deepfakes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Signes Visuels</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Clignements d'yeux anormaux ou absents</li>
                      <li>• Asymétrie faciale inhabituelle</li>
                      <li>• Contours flous autour du visage</li>
                      <li>• Incohérences dans l'éclairage</li>
                      <li>• Mouvements de lèvres désynchronisés</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Outils de Détection</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Analyseurs de métadonnées</li>
                      <li>• Détecteurs IA spécialisés</li>
                      <li>• Vérification de la source</li>
                      <li>• Analyse temporelle des pixels</li>
                      <li>• Détection de compression artificielle</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Ressources Recommandées</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">DuckDuckGo</Badge>
                    <Badge variant="secondary">Microsoft Video Authenticator</Badge>
                    <Badge variant="secondary">Adobe Project Origin</Badge>
                    <Badge variant="secondary">Deepware Scanner</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reporting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  Signalement d'Abus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Si vous découvrez une utilisation malveillante de cette technologie ou de contenu deepfake non éthique, 
                  veuillez le signaler immédiatement.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Signaler un Abus
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contactez les Autorités
                  </Button>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Contact d'urgence:</strong> En cas d'utilisation criminelle, contactez immédiatement 
                    les forces de l'ordre locales et la cyberpolicre.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="text-center space-y-4">
            <p className="text-slate-500 text-sm">
              En utilisant cette plateforme, vous acceptez de respecter ces directives éthiques.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/legal">
                <Button variant="outline">
                  Mentions Légales
                </Button>
              </Link>
              <Link href="/support">
                <Button>
                  Obtenir de l'Aide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}