import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, FileText, Eye, Users } from "lucide-react";
import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Mentions Légales</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Mentions Légales & Conditions d'Utilisation</h1>

          <div className="space-y-10">

            {/* Avertissement Important */}
            <section className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Avertissement Important
              </h2>
              <div className="text-red-700 space-y-3">
                <p className="font-semibold">Cette plateforme est EXCLUSIVEMENT destinée à des fins éducatives et de recherche.</p>
                <p>L'utilisation malveillante des technologies deepfake est strictement interdite et peut constituer une infraction pénale.</p>
                <p>Tous les contenus générés sont automatiquement filigranés et tracés pour prévenir les abus.</p>
              </div>
            </section>

            {/* Conditions d'Utilisation */}
            <section className="bg-white p-6 border border-slate-200 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">1. Conditions d'Utilisation</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-lg font-medium text-slate-800">1.1 Acceptation des Conditions</h3>
                <p>En utilisant cette plateforme, vous acceptez intégralement les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, vous devez cesser immédiatement d'utiliser le service.</p>

                <h3 className="text-lg font-medium text-slate-800">1.2 Usage Autorisé</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Recherche académique et éducation sur l'IA</li>
                  <li>Démonstrations techniques contrôlées</li>
                  <li>Sensibilisation aux technologies deepfake</li>
                  <li>Tests de détection de contenus synthétiques</li>
                </ul>

                <h3 className="text-lg font-medium text-slate-800">1.3 Usages Strictement Interdits</h3>
                <ul className="list-disc pl-6 space-y-2 text-red-600">
                  <li>Création de contenus trompeurs ou malveillants</li>
                  <li>Usurpation d'identité ou fraude</li>
                  <li>Contenus pornographiques ou à caractère sexuel</li>
                  <li>Harcèlement ou intimidation</li>
                  <li>Diffusion sans consentement de la personne imitée</li>
                  <li>Utilisation à des fins commerciales non autorisées</li>
                </ul>
              </div>
            </section>

            {/* Responsabilités */}
            <section className="bg-white p-6 border border-slate-200 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">2. Responsabilités</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-lg font-medium text-slate-800">2.1 Responsabilité de l'Utilisateur</h3>
                <p>L'utilisateur est seul responsable de l'usage qu'il fait de la plateforme et des contenus qu'il génère. Il s'engage à :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Respecter les lois et réglementations en vigueur</li>
                  <li>Ne pas porter atteinte aux droits d'autrui</li>
                  <li>Informer les tiers de la nature synthétique des contenus</li>
                  <li>Utiliser la technologie de manière éthique et responsable</li>
                </ul>

                <h3 className="text-lg font-medium text-slate-800">2.2 Limitation de Responsabilité</h3>
                <p>La plateforme décline toute responsabilité quant aux dommages directs ou indirects résultant de l'utilisation du service, notamment en cas d'usage non conforme aux présentes conditions.</p>
              </div>
            </section>

            {/* Protection des Données */}
            <section className="bg-white p-6 border border-slate-200 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">3. Protection des Données</h2>
              <div className="space-y-4 text-slate-700">
                <h3 className="text-lg font-medium text-slate-800">3.1 Collecte de Données</h3>
                <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Images et contenus uploadés (temporairement)</li>
                  <li>Métadonnées techniques de traitement</li>
                  <li>Logs d'utilisation à des fins de sécurité</li>
                </ul>

                <h3 className="text-lg font-medium text-slate-800">3.2 Conservation et Suppression</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Les contenus uploadés sont automatiquement supprimés après traitement</li>
                  <li>Aucun stockage permanent des données biométriques</li>
                  <li>Logs conservés 30 jours maximum pour la sécurité</li>
                  <li>Droit à l'effacement sur demande</li>
                </ul>
              </div>
            </section>

            {/* Propriété Intellectuelle */}
            <section className="bg-white p-6 border border-slate-200 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">4. Propriété Intellectuelle</h2>
              <div className="space-y-4 text-slate-700">
                <p>L'utilisateur garantit disposer de tous les droits nécessaires sur les contenus qu'il uploade. En cas d'utilisation d'images de personnes, il doit s'assurer :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>D'avoir le consentement explicite des personnes concernées</li>
                  <li>De respecter le droit à l'image et la vie privée</li>
                  <li>De ne pas violer les droits d'auteur ou droits voisins</li>
                </ul>
              </div>
            </section>

            {/* Sanctions */}
            <section className="bg-orange-50 p-6 border border-orange-200 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-orange-800">5. Sanctions et Mesures Correctives</h2>
              <div className="space-y-4 text-orange-700">
                <p>En cas de violation des présentes conditions :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Suspension immédiate de l'accès au service</li>
                  <li>Signalement aux autorités compétentes si nécessaire</li>
                  <li>Poursites judiciaires en cas de dommages</li>
                  <li>Obligation de dédommagement des victimes</li>
                </ul>
              </div>
            </section>

            {/* Cadre Légal */}
            <section className="bg-blue-50 p-6 border border-blue-200 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-blue-800">6. Cadre Légal Applicable</h2>
              <div className="space-y-4 text-blue-700">
                <h3 className="text-lg font-medium text-blue-800">6.1 Réglementation Européenne</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>RGPD (Règlement Général sur la Protection des Données)</li>
                  <li>Directive sur les services numériques (DSA)</li>
                  <li>AI Act de l'Union Européenne</li>
                </ul>

                <h3 className="text-lg font-medium text-blue-800">6.2 Droit Français</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Code civil (droit à l'image, vie privée)</li>
                  <li>Code pénal (usurpation d'identité, escroquerie)</li>
                  <li>Loi Informatique et Libertés</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-slate-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">7. Contact et Signalement</h2>
              <div className="space-y-4 text-slate-700">
                <p>Pour toute question légale ou signalement d'abus :</p>
                <div className="bg-white p-4 rounded border">
                  <p><strong>Email :</strong> legal@deepfake-education.com</p>
                  <p><strong>Signalement d'abus :</strong> abuse@deepfake-education.com</p>
                  <p><strong>Délégué à la Protection des Données :</strong> dpo@deepfake-education.com</p>
                </div>
                <p className="text-sm text-slate-600">
                  Toute violation des présentes conditions peut être signalée 24h/24 et 7j/7.
                  Nous nous engageons à traiter chaque signalement dans les 24 heures.
                </p>
              </div>
            </section>

            {/* Mise à jour */}
            <section className="text-center text-slate-600 text-sm border-t pt-6">
              <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
              <p>Version 2.1 - Ces conditions peuvent être modifiées à tout moment</p>
              <p>En cas de modification substantielle, les utilisateurs seront informés par email</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}