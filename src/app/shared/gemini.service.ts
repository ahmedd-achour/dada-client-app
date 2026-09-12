import { Injectable } from '@angular/core';
import { runtimeConfig } from './runtime-config';
import { ContractExtraction, ExtractedDocFields, VehicleStateExtraction } from './attempt.model';

const DOC_PROMPT = `Tu analyses un document pour une agence de location de voitures en Tunisie.
Le document est soit une pièce d'identité / permis de conduire / passeport du client, soit un document
véhicule (carte grise, vignette, assurance, visite technique, carte d'exploitation).
L'entrée peut être une photo, un scan/PDF, ou une vidéo filmée à la main montrant le document
(l'agent l'a filmé au comptoir) — dans ce cas, examine les images du document visibles dans la vidéo.
Réponds uniquement avec un objet JSON strict au format :
{"documentType": "...", "fullName": "...", "documentNumber": "...", "extraInfo": "..."}
- documentType : le type exact du document, ex. "Carte d'identité", "Permis de conduire", "Passeport",
  "Carte grise", "Vignette", "Assurance", "Visite technique", "Carte d'exploitation".
- fullName : nom complet du titulaire s'il s'agit d'un document client, sinon laisse vide.
- documentNumber : le numéro principal visible sur le document.
- extraInfo : toute autre info utile en une courte phrase (date d'expiration, marque/modèle...).
Si un champ est illisible, laisse une chaîne vide. Ne réponds rien d'autre que ce JSON.`;

const STATE_PROMPT = `Tu analyses une vidéo d'état des lieux d'une voiture de location en Tunisie.
Repère la plaque d'immatriculation (matricule tunisien), l'état général visible du véhicule
(rayures, propreté, dommages visibles...), le niveau de carburant affiché au tableau de bord,
et le kilométrage affiché au compteur.
Réponds uniquement avec un objet JSON strict au format :
{"plateNumber": "...", "vehicleCondition": "...", "fuelLevel": "...", "mileage": "...", "notes": "..."}
- plateNumber : le numéro de plaque tel que lu (ex. "123 TUN 4567"), chaîne vide si illisible.
- vehicleCondition : une évaluation courte ("Bon état", "Rayure avant droite", ...), chaîne vide si non déterminable.
- fuelLevel : niveau lu sur la jauge (ex. "Plein", "3/4", "1/2", "1/4", "Vide"), chaîne vide si non visible.
- mileage : kilométrage lu au compteur (ex. "45210 km"), chaîne vide si non visible.
- notes : tout autre détail utile en une courte phrase.
Ne réponds rien d'autre que ce JSON.`;

const CONTRACT_PROMPT = `Tu analyses un contrat de location de voiture signé, en Tunisie.
L'entrée peut être une photo, un scan/PDF, ou une vidéo filmée à la main montrant le contrat —
dans ce cas, examine les pages du contrat visibles dans la vidéo.
Repère le prix total convenu, la caution/dépôt de garantie, et les dates de location.
Réponds uniquement avec un objet JSON strict au format :
{"totalPrice": 000, "deposit": 000, "startDate": "AAAA-MM-JJ", "endDate": "AAAA-MM-JJ", "notes": "..."}
- totalPrice et deposit : nombres en dinars tunisiens (DT), sans texte ni symbole. Mets null si illisible.
- startDate / endDate : format AAAA-MM-JJ si visible, sinon chaîne vide.
- notes : toute clause ou remarque importante en une courte phrase.
Ne réponds rien d'autre que ce JSON.`;

const MAX_INLINE_BYTES = 18 * 1024 * 1024; // stay under Gemini's inline request payload limits

@Injectable({ providedIn: 'root' })
export class GeminiService {
  get isConfigured(): boolean { return !!runtimeConfig.geminiApiKey; }

  async extractDocumentFields(file: File): Promise<ExtractedDocFields | null> {
    if (!this.isConfigured || !this.isSupportedDocInput(file)) {
      return null;
    }
    return this.generateStructured<ExtractedDocFields>(file, DOC_PROMPT);
  }

  async extractVehicleState(file: File): Promise<VehicleStateExtraction | null> {
    if (!this.isConfigured || !file.type.startsWith('video/')) {
      return null;
    }
    if (file.size > MAX_INLINE_BYTES) {
      console.warn('Vidéo trop volumineuse pour une analyse automatique (limite ~18 Mo).');
      return null;
    }
    return this.generateStructured<VehicleStateExtraction>(file, STATE_PROMPT);
  }

  async extractContractData(file: File): Promise<ContractExtraction | null> {
    if (!this.isConfigured || !this.isSupportedDocInput(file)) {
      return null;
    }
    return this.generateStructured<ContractExtraction>(file, CONTRACT_PROMPT);
  }

  /** Accepts a photo, a PDF/scan, or a hand-filmed video of the document (agents film docs at the counter). */
  private isSupportedDocInput(file: File): boolean {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      return true;
    }
    if (file.type.startsWith('video/')) {
      return file.size <= MAX_INLINE_BYTES;
    }
    return false;
  }

  async compareVehicleStates(
    departure: VehicleStateExtraction,
    arrival: VehicleStateExtraction,
  ): Promise<{ summary: string; damageDetected: boolean; details: string } | null> {
    if (!this.isConfigured) {
      return null;
    }
    const prompt = `Tu compares l'état d'une voiture de location au départ et au retour, pour une agence
en Tunisie. Voici les deux relevés (JSON) faits par analyse vidéo :
Départ : ${JSON.stringify(departure)}
Retour : ${JSON.stringify(arrival)}
Compare-les et réponds uniquement avec un objet JSON strict au format :
{"summary": "...", "damageDetected": true, "details": "..."}
- summary : une phrase résumant s'il y a un souci (nouveau dommage, kilométrage anormal, carburant manquant...)
  ou si tout est conforme.
- damageDetected : true si un nouveau dommage, une différence de kilométrage suspecte, ou un souci de
  carburant est probable, false sinon.
- details : explication plus complète en 2-3 phrases, en français, utilisable telle quelle dans un rapport.
Ne réponds rien d'autre que ce JSON.`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${runtimeConfig.geminiModel}:generateContent?key=${runtimeConfig.geminiApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      if (!response.ok) {
        console.error('Gemini comparison failed', await response.text());
        return null;
      }
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error('Gemini comparison error', error);
      return null;
    }
  }

  async generateSummaryFromAudio(file: File): Promise<string | null> {
    if (!this.isConfigured || !file.type.startsWith('audio/')) {
      return null;
    }
    
    if (file.size > MAX_INLINE_BYTES) {
      console.warn('Audio trop volumineux');
      return null;
    }

    const prompt = `Résume cette note vocale en une seule ligne très courte, pour qu'elle serve de rappel rapide. Réponds uniquement par le résumé.`;
    
    try {
      const base64 = await this.fileToBase64(file);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${runtimeConfig.geminiModel}:generateContent?key=${runtimeConfig.geminiApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: file.type,
                    data: base64,
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error('Gemini audio summary failed', await response.text());
        return null;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ? text.trim() : null;
    } catch (error) {
      console.error('Gemini audio summary error', error);
      return null;
    }
  }

  private async generateStructured<T>(file: File, prompt: string): Promise<T | null> {
    try {
      const base64 = await this.fileToBase64(file);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${runtimeConfig.geminiModel}:generateContent?key=${runtimeConfig.geminiApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ inline_data: { mime_type: file.type, data: base64 } }, { text: prompt }],
            },
          ],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!response.ok) {
        console.error('Gemini extraction failed', await response.text());
        return null;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        return null;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('Gemini extraction error', error);
      return null;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] ?? '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
