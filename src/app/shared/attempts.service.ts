import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { calculatePricing } from './pricing';
import { EmailService } from './email.service';
import { CloudinaryService } from './cloudinary.service';
import { GeminiService } from './gemini.service';
import { PdfReportService } from './pdf-report.service';
import {
  Attempt,
  AttemptAsset,
  AttemptHistoryEntry,
  AttemptStatus,
  ClientDocChecklist,
  ContractExtraction,
  ExtractedDocFields,
  VehicleDocChecklist,
  VehicleStateExtraction,
} from './attempt.model';

const ATTEMPTS_COLLECTION = 'attempts';

/** Backfills fields absent on documents created before this schema was introduced. */
function normalizeAttempt(data: DocumentData): Attempt {
  return {
    departureVideos: [],
    returnVideos: [],
    vehicleDocs: [],
    clientDocs: [],
    contractDocs: [],
    departureReport: null,
    returnReport: null,
    comparisonReport: null,
    ...data,
    pricing: { source: 'estimation', ...data['pricing'] },
  } as unknown as Attempt;
}

export interface NewAttemptInput {
  customerName: string;
  customerPhone: string;
  category: string;
  startDate: string;
  endDate: string;
  promoCode?: string;
  source: 'site' | 'admin';
}

export type AssetKind = 'departureVideos' | 'returnVideos' | 'vehicleDocs' | 'clientDocs' | 'contractDocs';

@Injectable({ providedIn: 'root' })
export class AttemptsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly geminiService: GeminiService,
    private readonly pdfReportService: PdfReportService,
  ) {}

  private async fetchAttempt(id: string): Promise<Attempt | null> {
    const snapshot = await getDoc(doc(db, ATTEMPTS_COLLECTION, id));
    return snapshot.exists() ? normalizeAttempt({ id: snapshot.id, ...snapshot.data() }) : null;
  }

  async createAttempt(input: NewAttemptInput): Promise<string> {
    const now = Date.now();
    const pricing = calculatePricing(input.category, input.startDate, input.endDate);
    const historyEntry: AttemptHistoryEntry = {
      action: 'creation',
      note: input.source === 'site' ? 'Créée depuis le site' : 'Créée par un administrateur',
      at: now,
    };
    const attempt: Omit<Attempt, 'id'> = {
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      category: input.category,
      startDate: input.startDate,
      endDate: input.endDate,
      promoCode: input.promoCode ?? '',
      status: 'nouveau',
      source: input.source,
      pricing,
      departureVideos: [],
      returnVideos: [],
      vehicleDocs: [],
      clientDocs: [],
      contractDocs: [],
      departureReport: null,
      returnReport: null,
      comparisonReport: null,
      history: [historyEntry],
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, ATTEMPTS_COLLECTION), attempt);
    this.emailService.notifyNewAttempt({ id: docRef.id, ...attempt });
    return docRef.id;
  }

  watchAttempts(): Observable<Attempt[]> {
    return new Observable<Attempt[]>((subscriber) => {
      const q = query(collection(db, ATTEMPTS_COLLECTION), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const attempts = snapshot.docs.map((docSnap) => normalizeAttempt({ id: docSnap.id, ...docSnap.data() }));
          subscriber.next(attempts);
        },
        (error) => subscriber.error(error),
      );
      return unsubscribe;
    });
  }

  watchAttempt(id: string): Observable<Attempt | null> {
    return new Observable<Attempt | null>((subscriber) => {
      const unsubscribe = onSnapshot(
        doc(db, ATTEMPTS_COLLECTION, id),
        (snapshot) => {
          subscriber.next(snapshot.exists() ? normalizeAttempt({ id: snapshot.id, ...snapshot.data() }) : null);
        },
        (error) => subscriber.error(error),
      );
      return unsubscribe;
    });
  }

  private async pushHistory(id: string, entry: Omit<AttemptHistoryEntry, 'at'>): Promise<void> {
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), {
      history: arrayUnion({ ...entry, at: Date.now() }),
      updatedAt: Date.now(),
    });
  }

  async addCustomHistoryEntry(id: string, entry: Omit<AttemptHistoryEntry, 'at'>): Promise<void> {
    await this.pushHistory(id, entry);
  }

  async updateStatus(id: string, status: AttemptStatus, statusLabel: string): Promise<void> {
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), { status, updatedAt: Date.now() });
    await this.pushHistory(id, { action: 'statut', note: `Statut changé : ${statusLabel}` });
    if (status === 'annule') {
      const attempt = await this.fetchAttempt(id);
      if (attempt) {
        this.emailService.notifyAction(attempt, 'Réservation annulée');
      }
    }
  }

  async updateDates(id: string, category: string, startDate: string, endDate: string): Promise<void> {
    const existing = await this.fetchAttempt(id);
    const updates: Partial<Attempt> = { startDate, endDate, updatedAt: Date.now() };
    if (existing?.pricing?.source !== 'contrat') {
      updates.pricing = calculatePricing(category, startDate, endDate);
    }
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), updates as DocumentData);
    await this.pushHistory(id, {
      action: 'dates',
      note: `Dates mises à jour : du ${startDate} au ${endDate}`,
    });
    const attempt = await this.fetchAttempt(id);
    if (attempt) {
      this.emailService.notifyAction(attempt, 'Dates modifiées (prolongation)');
    }
  }

  async updateVehicle(id: string, category: string, startDate: string, endDate: string): Promise<void> {
    const existing = await this.fetchAttempt(id);
    const updates: Partial<Attempt> = { category, updatedAt: Date.now() };
    if (existing?.pricing?.source !== 'contrat') {
      updates.pricing = calculatePricing(category, startDate, endDate);
    }
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), updates as DocumentData);
    await this.pushHistory(id, { action: 'vehicule', note: `Véhicule changé : ${category}` });
    const attempt = await this.fetchAttempt(id);
    if (attempt) {
      this.emailService.notifyAction(attempt, 'Véhicule échangé');
    }
  }

  async uploadAsset(
    id: string,
    file: File,
    kind: AssetKind,
    extracted?: ExtractedDocFields | VehicleStateExtraction | ContractExtraction | null,
  ): Promise<void> {
    const { url, publicId } = await this.cloudinaryService.upload(file, `attempts/${id}/${kind}`);
    const extractedKey =
      kind === 'departureVideos' || kind === 'returnVideos'
        ? 'plateInfo'
        : kind === 'contractDocs'
          ? 'contractInfo'
          : 'extracted';
    const asset: AttemptAsset = {
      url,
      path: publicId,
      name: file.name,
      contentType: file.type || 'application/octet-stream',
      uploadedAt: Date.now(),
      ...(extracted ? { [extractedKey]: extracted } : {}),
    };
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), {
      [kind]: arrayUnion(asset),
      updatedAt: Date.now(),
    });
    await this.pushHistory(id, { action: 'fichier', note: `Fichier ajouté (${kind}) : ${file.name}` });

    if (kind === 'contractDocs' && extracted) {
      await this.applyContractPricing(id, extracted as ContractExtraction);
    }
    if ((kind === 'departureVideos' || kind === 'returnVideos') && extracted) {
      await this.generateStateReport(id, kind, extracted as VehicleStateExtraction);
    }
  }

  private async applyContractPricing(id: string, contract: ContractExtraction): Promise<void> {
    if (contract.totalPrice == null || contract.totalPrice <= 0) {
      return;
    }
    const attempt = await this.fetchAttempt(id);
    if (!attempt) {
      return;
    }
    const pricing = {
      ...attempt.pricing,
      total: contract.totalPrice,
      source: 'contrat' as const,
    };
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), { pricing, updatedAt: Date.now() });
    await this.pushHistory(id, {
      action: 'prix',
      note: `Prix confirmé depuis le contrat : ${contract.totalPrice} DT`,
    });
  }

  private async generateStateReport(
    id: string,
    kind: 'departureVideos' | 'returnVideos',
    state: VehicleStateExtraction,
  ): Promise<void> {
    const attempt = await this.fetchAttempt(id);
    if (!attempt) {
      return;
    }

    const label = kind === 'departureVideos' ? 'Départ' : 'Arrivée';
    const reportFile = this.pdfReportService.buildStateReport(attempt, label, state);
    const { url, publicId } = await this.cloudinaryService.upload(reportFile, `attempts/${id}/reports`);
    const reportAsset: AttemptAsset = {
      url,
      path: publicId,
      name: reportFile.name,
      contentType: 'application/pdf',
      uploadedAt: Date.now(),
    };
    const reportField = kind === 'departureVideos' ? 'departureReport' : 'returnReport';
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), {
      [reportField]: reportAsset,
      updatedAt: Date.now(),
    });
    await this.pushHistory(id, {
      action: 'rapport',
      note: `Rapport d'état des lieux généré (${label.toLowerCase()})`,
    });

    const refreshed = await this.fetchAttempt(id);
    if (refreshed && refreshed.departureVideos.length > 0 && refreshed.returnVideos.length > 0) {
      const departureState = refreshed.departureVideos[refreshed.departureVideos.length - 1]?.plateInfo;
      const arrivalState = refreshed.returnVideos[refreshed.returnVideos.length - 1]?.plateInfo;
      if (departureState && arrivalState) {
        await this.generateComparisonReport(id, refreshed, departureState, arrivalState);
      }
    }
  }

  private async generateComparisonReport(
    id: string,
    attempt: Attempt,
    departure: VehicleStateExtraction,
    arrival: VehicleStateExtraction,
  ): Promise<void> {
    const comparison = await this.geminiService.compareVehicleStates(departure, arrival);
    if (!comparison) {
      return;
    }
    const reportFile = this.pdfReportService.buildComparisonReport(attempt, departure, arrival, comparison);
    const { url, publicId } = await this.cloudinaryService.upload(reportFile, `attempts/${id}/reports`);
    const reportAsset: AttemptAsset = {
      url,
      path: publicId,
      name: reportFile.name,
      contentType: 'application/pdf',
      uploadedAt: Date.now(),
    };
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), {
      comparisonReport: reportAsset,
      updatedAt: Date.now(),
    });
    await this.pushHistory(id, {
      action: 'rapport',
      note: comparison.damageDetected
        ? 'Rapport de comparaison généré — différence détectée'
        : 'Rapport de comparaison généré — aucun problème détecté',
    });
    if (comparison.damageDetected) {
      this.emailService.notifyAction(attempt, 'Différence détectée entre départ et arrivée');
    }
  }

  computeClientChecklist(clientDocs: AttemptAsset[]): ClientDocChecklist {
    const has = (keywords: string[]) =>
      clientDocs.some((a) => {
        const type = (a.extracted?.documentType ?? '').toLowerCase();
        return keywords.some((k) => type.includes(k));
      });
    return {
      permis: has(['permis']),
      cin: has(['identité', 'cin']),
      passeport: has(['passeport']),
    };
  }

  computeVehicleChecklist(vehicleDocs: AttemptAsset[], departureVideos: AttemptAsset[], returnVideos: AttemptAsset[]): VehicleDocChecklist {
    const has = (keywords: string[]) =>
      vehicleDocs.some((a) => {
        const type = (a.extracted?.documentType ?? '').toLowerCase();
        return keywords.some((k) => type.includes(k));
      });
    const hasPlate = [...departureVideos, ...returnVideos].some((a) => !!a.plateInfo?.plateNumber);
    return {
      carteGrise: has(['carte grise']),
      matricule: has(['matricule']) || hasPlate,
      visiteTechnique: has(['visite technique']),
      vignette: has(['vignette']),
      assurance: has(['assurance']),
      carteExploitation: has(["carte d'exploitation", 'carte exploitation']),
    };
  }
}
