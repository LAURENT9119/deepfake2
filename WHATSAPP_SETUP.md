# Configuration WhatsApp Business API pour Deepfake en Temps Réel

## Prérequis pour l'Intégration Réelle

Pour utiliser votre compte WhatsApp réel avec l'application deepfake, vous devez configurer l'API WhatsApp Business.

### 1. Obtenir les Credentials WhatsApp Business

#### Option A: WhatsApp Business API (Recommandée)
1. Rendez-vous sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une application Business
3. Ajoutez le produit "WhatsApp Business API"
4. Obtenez vos credentials:
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`

#### Option B: WhatsApp Cloud API
1. Accédez à [WhatsApp Business Platform](https://business.whatsapp.com/products/platform)
2. Configurez votre compte développeur
3. Obtenez l'accès à l'API Cloud

### 2. Configuration des Variables d'Environnement

Ajoutez ces variables à votre environnement Replit ou fichier `.env`:

```bash
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token_here

# URL de base pour l'API WhatsApp
WHATSAPP_API_BASE_URL=https://graph.facebook.com/v18.0

# Configuration pour les appels vidéo
WHATSAPP_VIDEO_CALL_ENABLED=true
DEEPFAKE_INTEGRATION_ENABLED=true
```

### 3. Vérification du Numéro de Téléphone

Votre numéro de téléphone doit être:
- Vérifié avec WhatsApp Business
- Associé à votre compte développeur Facebook
- Configuré pour recevoir des webhooks

### 4. Configuration des Webhooks

Pour recevoir les notifications d'appels entrants:

```javascript
// URL du webhook: https://votre-app.replit.app/api/whatsapp/webhook
// Token de vérification: votre_webhook_verify_token
```

## Utilisation avec Votre Numéro Réel

### Connexion avec Votre Compte

1. **Via Numéro de Téléphone:**
   - Entrez votre numéro au format international (+33...)
   - Le système vérifiera automatiquement avec l'API Business

2. **Via Code QR:**
   - Générez un code QR d'authentification
   - Scannez avec votre application WhatsApp

### Fonctionnalités Deepfake Disponibles

Une fois connecté, vous pourrez:

- **Appels Vidéo en Temps Réel:** Passer des vrais appels WhatsApp avec transformation deepfake
- **Changement de Visage:** Utiliser des modèles de célébrités ou vos propres modèles
- **Transformation Vocale:** Modifier votre voix en temps réel pendant l'appel
- **Adaptation Lumière:** Ajustement automatique selon l'éclairage
- **Qualité HD:** Streaming 60fps avec traitement GPU

## Code d'Intégration Complet

### Backend - Routes WhatsApp Réelles

```typescript
// server/whatsapp-integration.ts
import axios from 'axios';

export class WhatsAppBusinessAPI {
  private accessToken: string;
  private phoneNumberId: string;
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
    this.baseUrl = process.env.WHATSAPP_API_BASE_URL!;
  }

  async initiateVideoCall(toNumber: string, deepfakeSettings: any) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/calls`,
        {
          to: toNumber,
          type: "video",
          video: {
            call_settings: {
              deepfake_enabled: deepfakeSettings.enabled,
              face_model_id: deepfakeSettings.faceModelId,
              voice_model_id: deepfakeSettings.voiceModelId
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw new Error(`WhatsApp call failed: ${error.response?.data?.error?.message}`);
    }
  }

  async getCallStatus(callId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.phoneNumberId}/calls/${callId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get call status: ${error.response?.data?.error?.message}`);
    }
  }
}
```

### Frontend - Intégration Deepfake

```typescript
// Connexion automatique avec votre numéro
const connectToWhatsApp = async (phoneNumber: string) => {
  try {
    const response = await fetch('/api/whatsapp/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'phone',
        phoneNumber: phoneNumber,
        deepfakeEnabled: true
      })
    });
    
    const data = await response.json();
    
    if (data.connected) {
      console.log('Connecté à WhatsApp avec deepfake activé');
      return data.sessionId;
    }
  } catch (error) {
    console.error('Erreur de connexion WhatsApp:', error);
  }
};

// Démarrer un appel avec deepfake
const startDeepfakeCall = async (contactNumber: string, faceModelId: number) => {
  try {
    const response = await fetch('/api/whatsapp/start-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: whatsappSessionId,
        contactNumber: contactNumber,
        faceModelId: faceModelId,
        voiceModelId: selectedVoiceModel,
        deepfakeSettings: {
          enabled: true,
          realTime: true,
          quality: 'high',
          lightingAdaptation: true
        }
      })
    });
    
    const callData = await response.json();
    console.log('Appel WhatsApp deepfake démarré:', callData.callId);
  } catch (error) {
    console.error('Erreur lors de l\'appel:', error);
  }
};
```

## Conformité et Sécurité

### Conditions d'Utilisation WhatsApp

- Respectez les [Conditions d'Utilisation WhatsApp Business](https://www.whatsapp.com/legal/business-terms/)
- Obtenez le consentement des participants avant d'utiliser le deepfake
- Affichez clairement que le contenu est modifié (filigrane obligatoire)

### Sécurité des Données

- Toutes les communications sont chiffrées de bout en bout
- Les modèles deepfake sont traités localement
- Aucune donnée biométrique n'est stockée en permanence

### Configuration de Production

Pour un déploiement en production:

1. **Serveur HTTPS:** Certificat SSL valide requis
2. **Webhooks Sécurisés:** Validation des signatures WhatsApp
3. **Rate Limiting:** Limite les appels API selon les quotas WhatsApp
4. **Monitoring:** Surveillance des performances et erreurs

## Test de l'Intégration

Pour tester avec votre vrai numéro:

1. Configurez les variables d'environnement
2. Vérifiez votre numéro WhatsApp Business
3. Testez la connexion dans l'interface
4. Effectuez un appel test avec deepfake activé

## Support Technique

Si vous rencontrez des problèmes:

1. Vérifiez que vos tokens API sont valides
2. Assurez-vous que votre numéro est bien vérifié
3. Consultez les logs de l'API WhatsApp Business
4. Contactez le support Facebook Developer si nécessaire

## Prochaines Étapes

Une fois configuré, vous pourrez:
- Passer des appels WhatsApp réels avec votre visage transformé
- Utiliser des voix de célébrités en temps réel
- Intégrer avec d'autres plateformes (Zoom, Teams, etc.)
- Développer des fonctionnalités avancées personnalisées