import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, FileText, Eye, Users } from "lucide-react";
import { Link } from "wouter";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
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

        <div className="space-y-6">
          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Politique de Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                Cette application deepfake est conçue à des fins éducatives et de démonstration uniquement.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Collecte de données :</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>Images uploadées : traitées localement, supprimées après traitement</li>
                  <li>Données vidéo : traitées en temps réel, non stockées</li>
                  <li>Aucune donnée biométrique n'est conservée de façon permanente</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Terms of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Conditions d'Utilisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Usage autorisé :</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>Démonstration technique et éducative</li>
                  <li>Tests de technologie deepfake</li>
                  <li>Recherche académique</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-600">Usage interdit :</h4>
                <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                  <li>Création de contenu trompeur ou malveillant</li>
                  <li>Usurpation d'identité</li>
                  <li>Diffusion sans consentement</li>
                  <li>Usage commercial non autorisé</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AI Ethics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Éthique de l'IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                Nous nous engageons à promouvoir un usage responsable de la technologie deepfake.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Nos engagements :</h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>Filigrane obligatoire sur tout contenu généré</li>
                  <li>Transparence sur la nature artificielle du contenu</li>
                  <li>Formation à la détection de deepfakes</li>
                  <li>Respect de la vie privée et du consentement</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Pour toute question concernant ces mentions légales ou l'utilisation de cette application :
              </p>
              <div className="mt-2 text-sm text-slate-600">
                <p>Email : legal@deepfake-demo.com</p>
                <p>Support : support@deepfake-demo.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}