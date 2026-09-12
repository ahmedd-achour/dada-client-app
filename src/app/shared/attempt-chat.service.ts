import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Attempt } from './attempt.model';

const GEMINI_API_KEY = environment.gemini.apiKey;
const GEMINI_MODEL = environment.gemini.model;

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
        if (a.plateInfo) return `  - ${a.name}: plaque=${a.plateInfo.plateNumber || 'ND'}, etat=${a.plateInfo.vehicleCondition || 'ND'}, carburant=${a.plateInfo.fuelLevel || 'ND'}, km=${a.plateInfo.mileage || 'ND'}`;
        if (a.contractInfo) return `  - ${a.name}: prix=${a.contractInfo.totalPrice || 'ND'} DT, caution=${a.contractInfo.deposit || 'ND'} DT`;
        if (a.extracted) return `  - ${a.name}: type=${a.extracted.documentType || 'ND'}, nom=${a.extracted.fullName || 'ND'}, num=${a.extracted.documentNumber || 'ND'}`;
        return `  - ${a.name}`;
      }).join('\n') || '  Aucun';

    const historyLines = attempt.history
      .slice(-20)
      .map(h => `  [${new Date(h.at).toLocaleString('fr-FR')}] ${h.action}: ${h.note}${h.aiSummary ? ' | Resume IA: ' + h.aiSummary : ''}`)
      .join('\n') || '  Aucun';

    return `Tu es un assistant intelligent pour une agence de location de voitures "Dada Rent Car" en Tunisie.
Tu as acces a toutes les donnees de cette reservation et tu dois repondre aux questions de l'administrateur.
Reponds en francais, de maniere concise et precise. Si une information n'est pas disponible, dis-le clairement.

=== RESERVATION #${attempt.id ?? 'N/A'} ===

CLIENT:
  Nom: ${attempt.customerName}
  Telephone: ${attempt.customerPhone}

VEHICULE:
  Categorie: ${attempt.category}

PERIODE:
  Depart: ${attempt.startDate}
  Retour: ${attempt.endDate}

STATUT: ${attempt.status}

PRIX:
  Source: ${attempt.pricing.source === 'contrat' ? 'Contrat signe' : 'Estimation'}
  Total: ${attempt.pricing.total} DT
  ${attempt.pricing.source !== 'contrat' ? `(Taux journalier: ${attempt.pricing.dailyRate} DT x ${attempt.pricing.days} jours)` : ''}
  ${attempt.pricing.discountPct > 0 ? `Remise: ${attempt.pricing.discountPct}%` : ''}

${attempt.promoCode ? `CODE PROMO: ${attempt.promoCode}` : ''}

CONTRATS SCANNÉS:
${docs(attempt.contractDocs)}

VIDEOS DEPART (etat des lieux):
${docs(attempt.departureVideos)}

VIDEOS RETOUR (etat des lieux):
${docs(attempt.returnVideos)}

DOCUMENTS VEHICULE:
${docs(attempt.vehicleDocs)}

DOCUMENTS CLIENT:
${docs(attempt.clientDocs)}

HISTORIQUE DES ACTIONS (20 derniers):
${historyLines}

Tu peux repondre a des questions comme:
- Quelle est l'immatriculation du vehicule?
- Quel est le niveau de carburant au depart?
- Le client a-t-il fourni son permis?
- Y a-t-il des dommages detectes?
- Quel est le prix total?
- Quand est-ce que le contrat a ete cree?
- etc.`;
  }

  async sendMessage(
    systemContext: string,
    history: ChatMessage[],
    userMessage: string,
  ): Promise<string> {
    if (!GEMINI_API_KEY) {
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
      parts: [{ text: 'Compris. J\'ai bien pris connaissance de toutes les donnees de cette reservation. Je suis pret a repondre a vos questions.' }],
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
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
