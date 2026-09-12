export type AttemptStatus = 'nouveau' | 'confirme' | 'en_cours' | 'termine' | 'annule';

export const ATTEMPT_STATUSES: { value: AttemptStatus; label: string }[] = [
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'confirme', label: 'Confirmé' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
  { value: 'annule', label: 'Annulé' },
];

export interface ExtractedDocFields {
  documentType: string;
  fullName: string;
  documentNumber: string;
  extraInfo: string;
}

/** Read from a departure/return état des lieux video. */
export interface VehicleStateExtraction {
  plateNumber: string;
  vehicleCondition: string;
  fuelLevel: string;
  mileage: string;
  notes: string;
}

/** Read (OCR) from the signed rental contract — informational only, not trusted for confirmed revenue. */
export interface ContractExtraction {
  totalPrice: number | null;
  deposit: number | null;
  startDate: string;
  endDate: string;
  notes: string;
}

/**
 * Read from a bank/cash receipt (reçu, virement, ticket de caisse...). This is the only
 * source trusted for confirmed revenue — a contract price can be renegotiated after signing,
 * but a receipt reflects money actually paid or received.
 */
export interface ReceiptExtraction {
  amountPaid: number | null;
  paymentMethod: string;
  paymentDate: string;
  notes: string;
}

export const ASSET_RETENTION_DAYS = 30;

/** Same retention window as assets, but for a whole archived reservation — see [[Attempt.archivedAt]]. */
export const ATTEMPT_RETENTION_DAYS = 30;

export interface AttemptAsset {
  url: string;
  path: string;
  name: string;
  contentType: string;
  uploadedAt: number;
  extracted?: ExtractedDocFields;
  plateInfo?: VehicleStateExtraction;
  contractInfo?: ContractExtraction;
  receiptInfo?: ReceiptExtraction;
  /**
   * Set when the asset is archived (moved to the "Corbeille") instead of deleted outright —
   * protects against accidental data loss. Cleared on restore. An asset archived for more
   * than ASSET_RETENTION_DAYS becomes eligible for permanent deletion (manual or swept
   * automatically next time the reservation is opened). Re-archiving resets the timer.
   */
  archivedAt?: number;
}

export interface AttemptPricing {
  dailyRate: number;
  days: number;
  subtotal: number;
  discountPct: number;
  total: number;
  /**
   * 'estimation' = computed from the tariff table (no contract yet); 'contrat' = read from the
   * signed contract (informational, not confirmed); 'recus' = sum of uploaded financial receipts —
   * the only source counted as confirmed revenue, since it reflects money actually collected.
   */
  source: 'estimation' | 'contrat' | 'recus';
}

export interface AttemptHistoryEntry {
  action: string;
  note: string;
  at: number;
  assetUrl?: string;
  assetType?: string;
  assetName?: string;
  aiSummary?: string;
}

export interface ClientDocChecklist {
  permis: boolean;
  cin: boolean;
  passeport: boolean;
}

export interface VehicleDocChecklist {
  carteGrise: boolean;
  matricule: boolean;
  visiteTechnique: boolean;
  vignette: boolean;
  assurance: boolean;
  carteExploitation: boolean;
}

export interface Attempt {
  id?: string;
  customerName: string;
  customerPhone: string;
  category: string;
  startDate: string;
  endDate: string;
  promoCode: string;
  status: AttemptStatus;
  source: 'site' | 'admin';
  pricing: AttemptPricing;
  departureVideos: AttemptAsset[];
  returnVideos: AttemptAsset[];
  vehicleDocs: AttemptAsset[];
  clientDocs: AttemptAsset[];
  contractDocs: AttemptAsset[];
  receiptDocs: AttemptAsset[];
  departureReport: AttemptAsset | null;
  returnReport: AttemptAsset | null;
  comparisonReport: AttemptAsset | null;
  history: AttemptHistoryEntry[];
  createdAt: number;
  updatedAt: number;
  /**
   * Set when the whole reservation is archived instead of deleted outright — it disappears from
   * the home list but stays recoverable from the Archives tab. Cleared on restore. A reservation
   * archived for more than ATTEMPT_RETENTION_DAYS becomes eligible for permanent deletion.
   * Re-archiving (after a restore) resets the timer.
   */
  archivedAt?: number;
}
