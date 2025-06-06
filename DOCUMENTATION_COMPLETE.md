
# 📖 Documentation Complète - Application Deepfake en Temps Réel

## 🎯 Vue d'ensemble de l'Application

Cette application est une plateforme de **deepfake en temps réel** qui permet de transformer votre visage et votre voix pendant des appels vidéo. Elle simule l'intégration avec WhatsApp Business pour des appels directs avec effets deepfake.

### ✨ Fonctionnalités Principales

- **🎭 Transformation de visage en temps réel** (60fps)
- **🗣️ Modification de voix en direct**
- **📱 Intégration WhatsApp simulée**
- **🎥 Appels vidéo P2P avec WebRTC**
- **🤖 Modèles de célébrités intégrés**
- **⚡ Traitement GPU optimisé**

---

## 🏗️ Architecture de l'Application

### Backend (Node.js + Express + Socket.IO)
```
server/
├── index.ts          # Point d'entrée du serveur
├── routes.ts          # Routes API et WebSocket
├── storage.ts         # Base de données SQLite
├── whatsapp-service.ts # Service WhatsApp Business
└── vite.ts           # Configuration Vite
```

### Frontend (React + TypeScript + Vite)
```
client/src/
├── components/
│   ├── whatsapp-integration.tsx  # Interface WhatsApp
│   ├── face-detector.tsx         # Détection de visage
│   ├── voice-transformer.tsx     # Transformation vocale
│   └── workspace.tsx             # Interface principale
├── pages/
│   ├── home.tsx                  # Page d'accueil
│   └── video-call.tsx            # Page d'appel vidéo
└── lib/
    ├── face-utils.ts             # Utilitaires deepfake
    └── queryClient.ts            # Client API
```

---

## 🚀 Comment Démarrer l'Application

### 1. Installation et Démarrage
```bash
# Cloner et installer
npm install

# Démarrer le serveur de développement
npm run dev
```

### 2. Accès à l'Application
- **URL locale**: `http://localhost:5000`
- **URL publique Replit**: `https://votre-repl.replit.app`

### 3. Navigation
- **Page d'accueil**: Upload d'images/audio et gestion des modèles
- **Appels vidéo**: `/video-call` pour les sessions en temps réel
- **API WhatsApp**: Routes `/api/whatsapp/*` pour l'intégration

---

## 📱 Simulation WhatsApp (Sans API Réelle)

### Mode Simulation Activé

L'application fonctionne actuellement en **mode simulation** car vous n'avez pas encore configuré les clés API WhatsApp Business.

#### Ce qui est simulé :
1. **Connexion WhatsApp** ✅
2. **Envoi de messages** ✅ 
3. **Invitations d'appels** ✅
4. **Webhooks entrants** ✅

#### Comment tester la simulation :

### 1. Interface de Connexion WhatsApp

```typescript
// Dans components/whatsapp-integration.tsx
// La connexion simule une vraie connexion WhatsApp Business

const simulateWhatsAppConnection = () => {
  return {
    sessionId: `whatsapp_demo_${Date.now()}`,
    phoneNumber: "+33612345678",
    connected: true,
    deepfakeEnabled: true,
    mode: "simulation"
  };
};
```

### 2. Test de l'Interface

1. **Allez sur la page d'accueil**
2. **Cliquez sur l'onglet "WhatsApp"**
3. **Choisissez "Connexion par numéro"**
4. **Entrez n'importe quel numéro** (ex: +33612345678)
5. **Activez le deepfake**
6. **Cliquez "Se connecter"**

Le système simulera une connexion réussie et affichera :
- ✅ Connexion WhatsApp réussie
- 📱 Interface d'appel disponible
- 🎭 Deepfake activé

### 3. Simulation d'Appel WhatsApp

```typescript
// Quand vous "appelez" un contact :
const simulateWhatsAppCall = async (contactNumber: string) => {
  // Simule l'envoi du message WhatsApp
  console.log(`📱 Message WhatsApp envoyé à ${contactNumber}`);
  console.log(`🎥 Invitation: "Rejoignez l'appel deepfake: https://votre-app.replit.app/video-call-direct?session=demo123"`);
  
  // Simule la réception du webhook
  setTimeout(() => {
    console.log(`✅ ${contactNumber} a rejoint l'appel deepfake`);
  }, 2000);
};
```

---

## 🎭 Fonctionnement du Deepfake en Temps Réel

### 1. Pipeline de Traitement Vidéo

```typescript
// Flux de traitement en temps réel (60fps)
const videoProcessingPipeline = {
  1: "Capture de la webcam",
  2: "Détection de visage (MediaPipe)",
  3: "Extraction des landmarks faciaux", 
  4: "Application du modèle deepfake",
  5: "Adaptation de l'éclairage",
  6: "Rendu final optimisé",
  7: "Transmission WebRTC"
};
```

### 2. Modèles Disponibles

#### Visages de Célébrités Pré-installés :
- 🎬 **Brad Pitt** (ID: 1)
- 👑 **Angelina Jolie** (ID: 2)  
- 🕶️ **Robert Downey Jr.** (ID: 3)
- 🌟 **Scarlett Johansson** (ID: 4)
- 🎭 **Leonardo DiCaprio** (ID: 5)

#### Voix de Célébrités :
- 🗣️ **Morgan Freeman** (ID: 1)
- 🎵 **Adele** (ID: 2)
- 🎤 **Elvis Presley** (ID: 3)

### 3. Utilisation des Modèles

```javascript
// Changer de visage en temps réel
socket.emit('face-model-changed', {
  roomId: 'session123',
  faceModelId: 1 // Brad Pitt
});

// Changer de voix
socket.emit('voice-model-changed', {
  roomId: 'session123', 
  voiceModelId: 1 // Morgan Freeman
});
```

---

## 🎥 Scénarios d'Utilisation Détaillés

### Scénario 1 : Appel Deepfake Direct

1. **Utilisateur A** se connecte à WhatsApp (simulation)
2. **Utilisateur A** appelle le **+33612345678**
3. **Système** envoie un message simulé :
   ```
   🎥 Invitation à un appel vidéo avec deepfake
   
   Vous pouvez choisir d'activer ou non la transformation 
   de visage pendant l'appel.
   
   [📹 Rejoindre l'appel] [📺 Appel normal]
   ```
4. **Utilisateur B** clique sur "Rejoindre l'appel"
5. **Redirection** vers `/video-call-direct?session=demo123&deepfake=true`
6. **Appel démarre** avec deepfake activé

### Scénario 2 : Changement de Visage en Direct

```typescript
// Pendant l'appel, changement de modèle
const changeCharacter = (newFaceId: number) => {
  socket.emit('face-model-changed', {
    roomId: currentSession,
    faceModelId: newFaceId
  });
  
  // Les autres participants voient le changement instantané
};

// Exemples de transformation :
changeCharacter(1); // Devient Brad Pitt
changeCharacter(2); // Devient Angelina Jolie
changeCharacter(3); // Devient Iron Man
```

### Scénario 3 : Voix + Visage Synchronisés

```typescript
// Transformation complète en célébrité
const transformToCelebrity = () => {
  // Visage de Leonardo DiCaprio
  socket.emit('face-model-changed', { faceModelId: 5 });
  
  // Voix de Morgan Freeman  
  socket.emit('voice-model-changed', { voiceModelId: 1 });
  
  console.log("🎭 Transformation en Leonardo DiCaprio avec la voix de Morgan Freeman");
};
```

---

## 🔧 API Endpoints Disponibles

### WhatsApp Simulation

```typescript
// POST /api/whatsapp/connect
{
  "method": "phone",
  "phoneNumber": "+33612345678", 
  "deepfakeEnabled": true
}
// Réponse : { sessionId, connected: true, mode: "simulation" }

// POST /api/whatsapp/start-call  
{
  "sessionId": "demo123",
  "contactNumber": "+33698765432",
  "faceModelId": 1,
  "voiceModelId": 1
}
// Réponse : { callId, status: "initiated", directUrl: "..." }

// GET /video-call-direct?session=demo123&deepfake=true
// Page HTML d'appel direct avec interface deepfake
```

### Gestion des Modèles

```typescript
// GET /api/face-models/public
// Récupère tous les modèles de visages disponibles

// GET /api/voice-models/public  
// Récupère tous les modèles de voix disponibles

// POST /api/face-models
// Upload d'un nouveau modèle de visage personnalisé

// POST /api/voice-models
// Upload d'un nouveau modèle de voix personnalisé
```

### Sessions Vidéo

```typescript
// POST /api/video-sessions
{
  "sessionId": "session123",
  "userId": "user456", 
  "faceModelId": 1,
  "voiceModelId": 1
}

// GET /api/video-sessions/session123
// Récupère les infos de la session active
```

---

## 🎮 Interface Utilisateur Détaillée

### Page d'Accueil (`/`)

#### Section 1 : Upload et Modèles
- **Zone de drop** pour images (visages) et audio (voix)
- **Galerie des modèles** de célébrités
- **Gestion des uploads** personnalisés

#### Section 2 : WhatsApp Integration
- **Méthodes de connexion** : Numéro ou QR Code
- **État de connexion** : Connecté/Déconnecté  
- **Contrôles d'appel** : Numéro à appeler + bouton d'appel

#### Section 3 : Sessions Actives
- **Liste des appels** en cours
- **Statistiques en temps réel**
- **Logs de l'activité**

### Page d'Appel Vidéo (`/video-call`)

#### Interface Principale
```
┌─────────────────────────────────────────┐
│  🎥 [Votre Vidéo]    [Vidéo Contact]    │
│                                         │  
│  🎭 Modèles:                           │
│  [Brad Pitt] [Angelina] [Iron Man]     │
│                                         │
│  🗣️ Voix:                              │
│  [Morgan Freeman] [Adele] [Elvis]      │
│                                         │
│  ⚙️ [Paramètres] 📱 [WhatsApp] 🔚 [Fin] │
└─────────────────────────────────────────┘
```

### Page d'Appel Direct (`/video-call-direct`)

#### Interface Optimisée Mobile
```
┌─────────────────────┐
│     📱 WhatsApp     │
│  Appel Vidéo Demo   │
│                     │
│ Session: demo123    │
│                     │
│ 🎭 Transformation   │
│ [✓] Activer deepfake│
│                     │
│ [🎥 Rejoindre]     │
│                     │
│ Auto-redirect: 3s   │
└─────────────────────┘
```

---

## 🔌 WebSocket Events (Temps Réel)

### Événements Côté Client

```typescript
// Rejoindre une session
socket.emit('join-room', sessionId, userId);

// Envoyer une frame vidéo pour traitement
socket.emit('video-frame', {
  frameData: base64VideoFrame,
  sessionId: 'demo123',
  faceModelId: 1,
  voiceSettings: { modelId: 1, enabled: true }
});

// Changer de modèle en direct
socket.emit('face-model-changed', { roomId, faceModelId: 2 });
socket.emit('voice-model-changed', { roomId, voiceModelId: 1 });
```

### Événements Côté Serveur

```typescript
// Réception d'une frame traitée
socket.on('processed-frame', (processedFrameData) => {
  // Afficher la frame avec deepfake appliqué
});

// Notification de changement de modèle
socket.on('face-model-update', ({ faceModelId }) => {
  console.log(`Nouveau visage appliqué: ${faceModelId}`);
});

// Appel WhatsApp entrant
socket.on('incoming-whatsapp-call', (callData) => {
  console.log('Appel WhatsApp reçu:', callData);
});
```

---

## 🧪 Tests et Démonstrations

### Test 1 : Connexion WhatsApp Simulée

```bash
# Dans le navigateur, ouvrir la console et tester :
fetch('/api/whatsapp/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    method: 'phone',
    phoneNumber: '+33612345678',
    deepfakeEnabled: true
  })
}).then(r => r.json()).then(console.log);

# Résultat attendu :
# { sessionId: "whatsapp_demo_...", connected: true, mode: "simulation" }
```

### Test 2 : Démarrage d'Appel Simulé

```bash
fetch('/api/whatsapp/start-call', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'demo123',
    contactNumber: '+33698765432',
    faceModelId: 1,
    voiceModelId: 1,
    deepfakeSettings: { enabled: true }
  })
}).then(r => r.json()).then(console.log);

# Résultat attendu :
# { callId: "call_...", status: "initiated", directUrl: "https://..." }
```

### Test 3 : Page d'Appel Direct

```
Ouvrir : https://votre-repl.replit.app/video-call-direct?session=demo123&deepfake=true

Résultat attendu :
- Page WhatsApp stylée en vert
- Checkbox deepfake cochée  
- Bouton "Rejoindre l'appel"
- Redirection automatique après 3s
```

---

## 🔮 Prochaines Étapes pour l'API WhatsApp Réelle

### 1. Configuration API WhatsApp Business

Quand vous serez prêt, ajoutez ces secrets dans Replit :

```bash
WHATSAPP_ACCESS_TOKEN=votre_token_facebook
WHATSAPP_PHONE_NUMBER_ID=votre_numero_id  
WHATSAPP_BUSINESS_ACCOUNT_ID=votre_account_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=votre_webhook_token
```

### 2. Webhook Configuration

```
URL Webhook: https://votre-repl.replit.app/api/whatsapp/webhook
Token de vérification: votre_webhook_token
Événements: messages, message_deliveries
```

### 3. Test avec Vraie API

Une fois configuré, l'application basculera automatiquement du mode simulation vers l'API réelle et vous pourrez :

- ✅ Envoyer de vrais messages WhatsApp
- ✅ Recevoir des webhooks réels
- ✅ Passer des appels avec de vrais contacts
- ✅ Utiliser le deepfake avec de vraies personnes

---

## 🎯 Utilisation Pratique

### Pour Développer/Tester :
1. **Utilisez le mode simulation actuel**
2. **Testez toutes les fonctionnalités**  
3. **Développez vos modèles deepfake**
4. **Configurez l'interface utilisateur**

### Pour la Production :
1. **Obtenez les clés API WhatsApp Business**
2. **Configurez les webhooks**
3. **Testez avec de vrais numéros**
4. **Déployez sur Replit**

L'application est **100% fonctionnelle** en mode simulation et bascule automatiquement vers l'API réelle dès que vous configurez les clés !

---

## 📞 Support

En cas de questions :
1. **Vérifiez les logs** dans la console du navigateur
2. **Consultez les logs serveur** dans Replit
3. **Testez en mode simulation** avant l'API réelle
4. **Utilisez les endpoints de test** fournis

🎭 **Bon deepfaking !** 🎭
