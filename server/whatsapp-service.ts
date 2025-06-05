
export class WhatsAppBusinessService {
  private accessToken: string;
  private phoneNumberId: string;
  private businessAccountId: string;
  private baseUrl: string = "https://graph.facebook.com/v18.0";

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
    this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!;

    if (!this.accessToken || !this.phoneNumberId || !this.businessAccountId) {
      throw new Error("Variables d'environnement WhatsApp Business manquantes");
    }
  }

  async verifyPhoneNumber(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erreur de vérification du numéro');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Vérification du numéro échouée: ${error.message}`);
    }
  }

  async sendMessage(to: string, message: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace('+', ''),
          type: "text",
          text: {
            body: message
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erreur d\'envoi de message');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Envoi de message échoué: ${error.message}`);
    }
  }

  async initiateVideoCall(to: string, deepfakeSettings: any): Promise<any> {
    try {
      // Envoyer une invitation pour appel vidéo
      const message = `🎥 Invitation à un appel vidéo ${deepfakeSettings.enabled ? 'avec effets deepfake' : ''}. Cliquez pour rejoindre: https://your-app.replit.app/video-call?session=${Date.now()}`;
      
      return await this.sendMessage(to, message);
    } catch (error: any) {
      throw new Error(`Initiation d'appel vidéo échouée: ${error.message}`);
    }
  }

  async getAccountInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.businessAccountId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erreur de récupération des infos compte');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Récupération des infos compte échouée: ${error.message}`);
    }
  }
}
