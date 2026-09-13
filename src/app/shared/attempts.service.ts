import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
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
  ASSET_RETENTION_DAYS,
  ATTEMPT_RETENTION_DAYS,
  Attempt,
  AttemptAsset,
  AttemptHistoryEntry,
  AttemptStatus,
  ClientDocChecklist,
  ContractExtraction,
  ExtractedDocFields,
  ReceiptExtraction,
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
    receiptDocs: [],
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
  vehicleLabel?: string;
  vehicleId?: string;
  startDate: string;
  endDate: string;
  promoCode?: string;
  source: 'site' | 'admin';
}

export type AssetKind = 'departureVideos' | 'returnVideos' | 'vehicleDocs' | 'clientDocs' | 'contractDocs' | 'receiptDocs';

export const ASSET_KIND_LABELS: Record<AssetKind, string> = {
  departureVideos: 'vidéo de départ',
  returnVideos: 'vidéo de retour',
  vehicleDocs: 'document véhicule',
  clientDocs: 'document client',
  contractDocs: 'contrat',
  receiptDocs: 'reçu financier',
};

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
      ...(input.vehicleLabel ? { vehicleLabel: input.vehicleLabel } : {}),
      ...(input.vehicleId ? { vehicleId: input.vehicleId } : {}),
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
      receiptDocs: [],
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
    if (existing?.pricing?.source === 'estimation') {
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
    const updates: Partial<Attempt> = { category, vehicleLabel: deleteField(), vehicleId: deleteField(), updatedAt: Date.now() } as unknown as Partial<Attempt>;
    if (existing?.pricing?.source === 'estimation') {
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
    extracted?: ExtractedDocFields | VehicleStateExtraction | ContractExtraction | ReceiptExtraction | null,
  ): Promise<void> {
    const { url, publicId } = await this.cloudinaryService.upload(file, `attempts/${id}/${kind}`);
    const extractedKey =
      kind === 'departureVideos' || kind === 'returnVideos'
        ? 'plateInfo'
        : kind === 'contractDocs'
          ? 'contractInfo'
          : kind === 'receiptDocs'
            ? 'receiptInfo'
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
    if (kind === 'receiptDocs' && extracted) {
      await this.applyReceiptPricing(id);
    }
    if ((kind === 'departureVideos' || kind === 'returnVideos') && extracted) {
      await this.generateStateReport(id, kind, extracted as VehicleStateExtraction);
    }
  }

  /** Moves an asset to the Corbeille (soft-delete) instead of deleting it outright. */
  async archiveAsset(id: string, kind: AssetKind, assetUrl: string): Promise<void> {
    const asset = await this.updateAsset(id, kind, assetUrl, (a) => ({ ...a, archivedAt: Date.now() }));
    if (asset) {
      await this.pushHistory(id, { action: 'archive', note: `Fichier archivé (${ASSET_KIND_LABELS[kind]}) : ${asset.name}` });
      if (kind === 'receiptDocs') {
        await this.applyReceiptPricing(id);
      }
    }
  }

  /** Restores an archived asset — clears the archive timestamp, resetting the retention timer if re-archived later. */
  async restoreAsset(id: string, kind: AssetKind, assetUrl: string): Promise<void> {
    const asset = await this.updateAsset(id, kind, assetUrl, (a) => {
      const { archivedAt, ...rest } = a;
      return rest;
    });
    if (asset) {
      await this.pushHistory(id, { action: 'restauration', note: `Fichier restauré (${ASSET_KIND_LABELS[kind]}) : ${asset.name}` });
      if (kind === 'receiptDocs') {
        await this.applyReceiptPricing(id);
      }
    }
  }

  /** Permanently deletes an archived asset — from Cloudinary (best-effort) and from Firestore. */
  async deleteAssetPermanently(id: string, kind: AssetKind, assetUrl: string): Promise<void> {
    const attempt = await this.fetchAttempt(id);
    if (!attempt) return;
    const asset = attempt[kind].find((a) => a.url === assetUrl);
    if (!asset) return;

    try {
      await this.cloudinaryService.destroy(asset.path, CloudinaryService.resourceTypeFor(asset.contentType));
    } catch (error) {
      console.error('Cloudinary destroy failed, removing metadata anyway', error);
    }

    const remaining = attempt[kind].filter((a) => a.url !== assetUrl);
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), { [kind]: remaining, updatedAt: Date.now() });
    await this.pushHistory(id, { action: 'suppression', note: `Fichier supprimé définitivement (${ASSET_KIND_LABELS[kind]}) : ${asset.name}` });
  }

  /**
   * Permanently deletes any asset that has sat in the Corbeille for more than ASSET_RETENTION_DAYS.
   * Called opportunistically whenever a reservation is opened — there's no server-side cron here,
   * so cleanup happens lazily on the admin's next visit rather than on a fixed schedule.
   */
  async sweepExpiredArchives(attempt: Attempt): Promise<void> {
    if (!attempt.id) return;
    const cutoff = Date.now() - ASSET_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const kinds: AssetKind[] = ['departureVideos', 'returnVideos', 'vehicleDocs', 'clientDocs', 'contractDocs', 'receiptDocs'];
    for (const kind of kinds) {
      const expired = attempt[kind].filter((a) => a.archivedAt && a.archivedAt < cutoff);
      for (const asset of expired) {
        await this.deleteAssetPermanently(attempt.id, kind, asset.url);
      }
    }
  }

  /** Moves a whole reservation to the Archives (soft-delete) instead of deleting it outright. */
  async archiveAttempt(id: string): Promise<void> {
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), { archivedAt: Date.now(), updatedAt: Date.now() });
    await this.pushHistory(id, { action: 'archive', note: 'Réservation archivée' });
  }

  /** Restores an archived reservation — clears the archive timestamp, resetting the retention timer if re-archived later. */
  async restoreAttempt(id: string): Promise<void> {
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), { archivedAt: deleteField(), updatedAt: Date.now() });
    await this.pushHistory(id, { action: 'restauration', note: 'Réservation restaurée' });
  }

  /** Permanently deletes an archived reservation — its files from Cloudinary (best-effort) and its Firestore document. */
  async deleteAttemptPermanently(id: string): Promise<void> {
    const attempt = await this.fetchAttempt(id);
    if (!attempt) return;

    const assetKinds: AssetKind[] = ['departureVideos', 'returnVideos', 'vehicleDocs', 'clientDocs', 'contractDocs', 'receiptDocs'];
    const assets = [
      ...assetKinds.flatMap((kind) => attempt[kind]),
      attempt.departureReport,
      attempt.returnReport,
      attempt.comparisonReport,
    ].filter((a): a is AttemptAsset => !!a);

    for (const asset of assets) {
      try {
        await this.cloudinaryService.destroy(asset.path, CloudinaryService.resourceTypeFor(asset.contentType));
      } catch (error) {
        console.error('Cloudinary destroy failed, deleting reservation anyway', error);
      }
    }

    await deleteDoc(doc(db, ATTEMPTS_COLLECTION, id));
  }

  /**
   * Permanently deletes any reservation that has sat in the Archives for more than ATTEMPT_RETENTION_DAYS.
   * Called opportunistically whenever the Archives tab is opened — there's no server-side cron here,
   * so cleanup happens lazily on the admin's next visit rather than on a fixed schedule.
   */
  async sweepExpiredAttempts(attempts: Attempt[]): Promise<void> {
    const cutoff = Date.now() - ATTEMPT_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const expired = attempts.filter((a) => a.archivedAt && a.archivedAt < cutoff);
    for (const attempt of expired) {
      if (attempt.id) await this.deleteAttemptPermanently(attempt.id);
    }
  }

  private async updateAsset(
    id: string,
    kind: AssetKind,
    assetUrl: string,
    mutate: (asset: AttemptAsset) => AttemptAsset,
  ): Promise<AttemptAsset | null> {
    const attempt = await this.fetchAttempt(id);
    if (!attempt) return null;
    let mutated: AttemptAsset | null = null;
    const updated = attempt[kind].map((a) => {
      if (a.url !== assetUrl) return a;
      mutated = mutate(a);
      return mutated;
    });
    if (!mutated) return null;
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), { [kind]: updated, updatedAt: Date.now() });
    return mutated;
  }

  /**
   * Contract price is informational only — it can be renegotiated after signing, so it's never
   * trusted as confirmed revenue. It only fills in the displayed total while no receipt exists yet.
   */
  private async applyContractPricing(id: string, contract: ContractExtraction): Promise<void> {
    if (contract.totalPrice == null || contract.totalPrice <= 0) {
      return;
    }
    const attempt = await this.fetchAttempt(id);
    if (!attempt || attempt.pricing.source === 'recus') {
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
      note: `Prix (non confirmé) lu depuis le contrat : ${contract.totalPrice} DT`,
    });
  }

  /**
   * Financial receipts are the only trusted source of confirmed revenue — money actually paid
   * or received, unlike a contract price which can change after signing. Sums every receipt
   * uploaded so far; as long as at least one receipt has a readable amount, it wins over the
   * contract/estimation as the reservation's pricing source.
   */
  private async applyReceiptPricing(id: string): Promise<void> {
    const attempt = await this.fetchAttempt(id);
    if (!attempt) {
      return;
    }
    const amounts = attempt.receiptDocs
      .filter((a) => !a.archivedAt)
      .map((a) => a.receiptInfo?.amountPaid)
      .filter((v): v is number => typeof v === 'number' && v > 0);
    if (amounts.length === 0) {
      // No active receipt left (e.g. the only one was archived) — fall back to the contract
      // estimate if the source was 'recus', otherwise leave pricing untouched.
      if (attempt.pricing.source === 'recus') {
        const fallback = calculatePricing(attempt.category, attempt.startDate, attempt.endDate);
        await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), { pricing: fallback, updatedAt: Date.now() });
        await this.pushHistory(id, { action: 'prix', note: 'Revenu confirmé retiré (reçu archivé) — retour à une estimation' });
      }
      return;
    }
    const total = amounts.reduce((sum, v) => sum + v, 0);
    const pricing = {
      ...attempt.pricing,
      total,
      source: 'recus' as const,
    };
    await updateDoc(doc(db, ATTEMPTS_COLLECTION, id), { pricing, updatedAt: Date.now() });
    await this.pushHistory(id, {
      action: 'prix',
      note: `Revenu confirmé via reçu(s) : ${total} DT`,
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
        if (a.archivedAt) return false;
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
        if (a.archivedAt) return false;
        const type = (a.extracted?.documentType ?? '').toLowerCase();
        return keywords.some((k) => type.includes(k));
      });
    const hasPlate = [...departureVideos, ...returnVideos].some((a) => !a.archivedAt && !!a.plateInfo?.plateNumber);
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
