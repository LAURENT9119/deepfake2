import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, FileText, Shield, Users, Calendar, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Legal() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Scale className="h-5 w-5 text-white" />
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
              <Link href="/legal" className="text-slate-600 hover:text-primary transition-colors font-medium text-primary">Légal</Link>
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
              Mentions Légales et Conditions d'Utilisation
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Informations légales et conditions d'utilisation de la plateforme DeepFake Éducatif
            </p>
            <div className="flex justify-center mt-4">
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </Badge>
            </div>
          </div>

          {/* Terms of Service */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Conditions Générales d'Utilisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">1. Objet et Champ d'Application</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  La présente plateforme "DeepFake Éducatif" est un outil de démonstration et d'éducation 
                  concernant les technologies de synthèse d'images et de voix par intelligence artificielle. 
                  Cette plateforme est strictement destinée à des fins pédagogiques, de recherche et de sensibilisation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">2. Utilisation Autorisée</h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• Recherche académique et scientifique</li>
                  <li>• Formation et éducation sur les technologies IA</li>
                  <li>• Sensibilisation aux enjeux de sécurité numérique</li>
                  <li>• Tests de systèmes de détection de contenu synthétique</li>
                  <li>• Démonstrations contrôlées en environnement sécurisé</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">3. Utilisations Interdites</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <ul className="text-red-700 text-sm space-y-2">
                    <li>• Création de contenu trompeur ou de désinformation</li>
                    <li>• Usurpation d'identité ou fraude</li>
                    <li>• Harcèlement, intimidation ou chantage</li>
                    <li>• Contenu pornographique non consensuel</li>
                    <li>• Manipulation d'élections ou de processus démocratiques</li>
                    <li>• Toute activité illégale ou nuisant à autrui</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">4. Responsabilités de l'Utilisateur</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  L'utilisateur s'engage à utiliser cette plateforme de manière éthique et légale. 
                  Il est seul responsable de l'usage qu'il fait des contenus générés et des conséquences 
                  qui peuvent en découler. L'utilisateur doit obtenir tous les consentements nécessaires 
                  avant d'utiliser l'image ou la voix d'une personne.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                Politique de Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Collecte de Données</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Cette plateforme de démonstration peut collecter temporairement les fichiers uploadés 
                  pour le traitement. Toutes les données sont supprimées automatiquement après utilisation 
                  et aucune donnée personnelle n'est stockée de manière permanente.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Traitement des Images et Voix</h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• Traitement local uniquement, pas de stockage cloud</li>
                  <li>• Suppression automatique après session</li>
                  <li>• Aucun partage avec des tiers</li>
                  <li>• Filigrane automatique sur tous les contenus générés</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Droits de l'Utilisateur</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Conformément au RGPD, l'utilisateur dispose d'un droit d'accès, de rectification, 
                  d'effacement et de portabilité de ses données. Pour toute demande, contactez-nous 
                  via la page support.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-orange-600" />
                Avertissements et Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Avertissement Important</h3>
                <p className="text-yellow-700 text-sm">
                  Cette technologie est en développement constant. Les résultats peuvent varier et 
                  ne doivent pas être considérés comme définitifs. L'utilisation malveillante de 
                  cette technologie peut avoir des conséquences légales graves.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Limitations Techniques</h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• Qualité dépendante de la qualité des images source</li>
                  <li>• Nécessite des conditions d'éclairage appropriées</li>
                  <li>• Performance variable selon le matériel utilisé</li>
                  <li>• Filigrane éducatif non supprimable</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Exclusion de Responsabilité</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Les créateurs de cette plateforme déclinent toute responsabilité concernant 
                  l'utilisation malveillante ou non autorisée de cette technologie. Cette plateforme 
                  est fournie "en l'état" sans garantie d'aucune sorte.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Support Technique</h3>
                  <p className="text-slate-600 text-sm mb-2">
                    Pour toute question technique ou problème d'utilisation
                  </p>
                  <Link href="/support">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Page Support
                    </Button>
                  </Link>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Questions Légales</h3>
                  <p className="text-slate-600 text-sm mb-2">
                    Pour toute question concernant les aspects légaux
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Contact Légal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicable Law */}
          <Card>
            <CardHeader>
              <CardTitle>Droit Applicable et Juridiction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Les présentes conditions sont soumises au droit français. En cas de litige, 
                les tribunaux français seront seuls compétents.
              </p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Références Légales</h4>
                <ul className="text-slate-600 text-xs space-y-1">
                  <li>• Règlement Général sur la Protection des Données (RGPD)</li>
                  <li>• Loi Informatique et Libertés</li>
                  <li>• Code de la propriété intellectuelle</li>
                  <li>• Loi pour la confiance dans l'économie numérique</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="text-center mt-12 space-y-4">
            <p className="text-slate-500 text-sm">
              En utilisant cette plateforme, vous acceptez les présentes conditions d'utilisation.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/ethics">
                <Button variant="outline">
                  Guide Éthique
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Scale, FileText } from "lucide-react";
import { Link } from "wouter";

export default function Legal() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Informations Légales</h1>
          <p className="text-slate-600">
            Conditions d'utilisation, politique de confidentialité et cadre légal
          </p>
        </div>

        {/* Avertissement Important */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Avertissement Important
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <p>
              Cette plateforme est destinée exclusivement à des fins éducatives et de recherche. 
              L'utilisation malveillante de la technologie deepfake est strictement interdite et 
              peut être passible de poursuites judiciaires.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conditions d'Utilisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Conditions d'Utilisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <h4 className="font-semibold">Usage Autorisé</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Recherche académique et éducative</li>
                  <li>Démonstrations techniques</li>
                  <li>Sensibilisation aux deepfakes</li>
                  <li>Tests de détection</li>
                </ul>
                
                <h4 className="font-semibold">Usage Interdit</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Création de contenu trompeur</li>
                  <li>Usurpation d'identité</li>
                  <li>Contenu à caractère pornographique</li>
                  <li>Diffamation ou harcèlement</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Politique de Confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Politique de Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <h4 className="font-semibold">Données Collectées</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Images téléchargées (temporaire)</li>
                  <li>Métadonnées de session</li>
                  <li>Logs d'utilisation (anonymes)</li>
                </ul>
                
                <h4 className="font-semibold">Protection des Données</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Chiffrement de bout en bout</li>
                  <li>Suppression automatique après 24h</li>
                  <li>Aucun stockage biométrique</li>
                  <li>Conformité RGPD</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cadre Légal */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Cadre Légal Applicable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Législation Française</h4>
                <ul className="text-sm space-y-1 text-slate-600">
                  <li>• Loi Informatique et Libertés</li>
                  <li>• Code Pénal (Art. 226-8)</li>
                  <li>• Droit à l'image</li>
                  <li>• RGPD</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Sanctions Encourues</h4>
                <ul className="text-sm space-y-1 text-slate-600">
                  <li>• Usurpation d'identité: 1 an + 15k€</li>
                  <li>• Atteinte à la vie privée: 1 an + 45k€</li>
                  <li>• Diffamation: 12k€ d'amende</li>
                  <li>• Revenge porn: 2 ans + 60k€</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsabilités */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Responsabilités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Responsabilité de l'Utilisateur</h4>
                <p className="text-slate-600">
                  L'utilisateur s'engage à utiliser cette plateforme de manière éthique et légale. 
                  Il est seul responsable du contenu qu'il génère et de l'usage qu'il en fait.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Responsabilité de la Plateforme</h4>
                <p className="text-slate-600">
                  Cette plateforme fournit des outils éducatifs et n'est pas responsable de l'usage 
                  malveillant qui pourrait en être fait. Nous nous réservons le droit de suspendre 
                  tout compte en cas d'usage non conforme.
                </p>
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
