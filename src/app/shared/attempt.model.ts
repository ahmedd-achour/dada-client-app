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

/** Read (OCR) from the signed rental contract — becomes the source of truth for pricing. */
export interface ContractExtraction {
  totalPrice: number | null;
  deposit: number | null;
  startDate: string;
  endDate: string;
  notes: string;
}

export interface AttemptAsset {
  url: string;
  path: string;
  name: string;
  contentType: string;
  uploadedAt: number;
  extracted?: ExtractedDocFields;
  plateInfo?: VehicleStateExtraction;
  contractInfo?: ContractExtraction;
}

export interface AttemptPricing {
  dailyRate: number;
  days: number;
  subtotal: number;
  discountPct: number;
  total: number;
  /** 'estimation' = computed from the tariff table (no contract yet); 'contrat' = read from the signed contract. */
  source: 'estimation' | 'contrat';
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
  departureReport: AttemptAsset | null;
  returnReport: AttemptAsset | null;
  comparisonReport: AttemptAsset | null;
  history: AttemptHistoryEntry[];
  createdAt: number;
  updatedAt: number;
}
