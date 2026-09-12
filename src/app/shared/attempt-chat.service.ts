import { Injectable } from '@angular/core';
import { runtimeConfig } from './runtime-config';
import { Attempt } from './attempt.model';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class AttemptChatService {
  /**
   * Builds the system context prompt from the full reservation data.
   * This is injected as the first message so Gemini knows everything.
   */
  buildSystemContext(attempt: Attempt): string {
    const docs = (arr: { name: string; extracted?: { documentType?: string; fullName?: string; documentNumber?: string; extraInfo?: string } | null; plateInfo?: { plateNumber?: string; vehicleCondition?: string; fuelLevel?: string; mileage?: string; notes?: string } | null; contractInfo?: { totalPrice?: number | null; deposit?: number | null; notes?: string | null } | null }[]) =>
      arr.map(a => {
        if (a.plateInfo) return `  - ${a.name}: plaque=${a.plateInfo.plateNumber || 'ND'}, état=${a.plateInfo.vehicleCondition || 'ND'}, carburant=${a.plateInfo.fuelLevel || 'ND'}, km=${a.plateInfo.mileage || 'ND'}`;
        if (a.contractInfo) return `  - ${a.name}: prix=${a.contractInfo.totalPrice || 'ND'} DT, caution=${a.contractInfo.deposit || 'ND'} DT`;
        if (a.extracted) return `  - ${a.name}: type=${a.extracted.documentType || 'ND'}, nom=${a.extracted.fullName || 'ND'}, num=${a.extracted.documentNumber || 'ND'}`;
        return `  - ${a.name}`;
      }).join('\n') || '  Aucun';

    const historyLines = attempt.history
      .slice(-20)
      .map(h => `  [${new Date(h.at).toLocaleString('fr-FR')}] ${h.action}: ${h.note}${h.aiSummary ? ' | Résumé IA: ' + h.aiSummary : ''}`)
      .join('\n') || '  Aucun';

    return `Tu es un assistant intelligent pour une agence de location de voitures "Dada Rent Car" en Tunisie.
Tu as accès à toutes les données de cette réservation et tu dois répondre aux questions de l'administrateur.
Réponds en français, de manière concise et précise. Si une information n'est pas disponible, dis-le clairement.

=== RÉSERVATION #${attempt.id ?? 'N/A'} ===

CLIENT:
  Nom: ${attempt.customerName}
  Téléphone: ${attempt.customerPhone}

VÉHICULE:
  Catégorie: ${attempt.category}

PÉRIODE:
  Départ: ${attempt.startDate}
  Retour: ${attempt.endDate}

STATUT: ${attempt.status}

PRIX:
  Source: ${attempt.pricing.source === 'contrat' ? 'Contrat signé' : 'Estimation'}
  Total: ${attempt.pricing.total} DT
  ${attempt.pricing.source !== 'contrat' ? `(Taux journalier: ${attempt.pricing.dailyRate} DT x ${attempt.pricing.days} jours)` : ''}
  ${attempt.pricing.discountPct > 0 ? `Remise: ${attempt.pricing.discountPct}%` : ''}

${attempt.promoCode ? `CODE PROMO: ${attempt.promoCode}` : ''}

CONTRATS SCANNÉS:
${docs(attempt.contractDocs)}

VIDÉOS DÉPART (état des lieux):
${docs(attempt.departureVideos)}

VIDÉOS RETOUR (état des lieux):
${docs(attempt.returnVideos)}

DOCUMENTS VÉHICULE:
${docs(attempt.vehicleDocs)}

DOCUMENTS CLIENT:
${docs(attempt.clientDocs)}

HISTORIQUE DES ACTIONS (20 derniers):
${historyLines}

Tu peux répondre à des questions comme:
- Quelle est l'immatriculation du véhicule ?
- Quel est le niveau de carburant au départ ?
- Le client a-t-il fourni son permis ?
- Y a-t-il des dommages détectés ?
- Quel est le prix total ?
- Quand est-ce que le contrat a été créé ?
- etc.`;
  }

  async sendMessage(
    systemContext: string,
    history: ChatMessage[],
    userMessage: string,
  ): Promise<string> {
    if (!runtimeConfig.geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Build conversation contents for Gemini
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // System context as first user message + model acknowledgment
    contents.push({
      role: 'user',
      parts: [{ text: systemContext }],
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Compris. J\'ai bien pris connaissance de toutes les données de cette réservation. Je suis prêt à répondre à vos questions.' }],
    });

    // Add conversation history
    for (const msg of history) {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.text }],
      });
    }

    // Add new user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${runtimeConfig.geminiModel}:generateContent?key=${runtimeConfig.geminiApiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini error: ${err}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Pas de reponse.';
  }

  /** Uses Web Speech API to get a transcript from the microphone */
  startVoiceInput(onResult: (text: string) => void, onEnd: () => void): SpeechRecognition | null {
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return null;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onend = onEnd;
    recognition.start();
    return recognition;
  }
}
