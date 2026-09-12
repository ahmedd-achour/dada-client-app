import { Component, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AttemptsService, AssetKind } from '../../shared/attempts.service';
import {
  ATTEMPT_STATUSES,
  Attempt,
  AttemptStatus,
  ClientDocChecklist,
  VehicleDocChecklist,
} from '../../shared/attempt.model';
import { GeminiService } from '../../shared/gemini.service';
import { AlertService } from '../../shared/alert.service';
import { CloudinaryService } from '../../shared/cloudinary.service';
import { VehiclePicker } from '../../components/vehicle-picker/vehicle-picker';

type Panel = 'none' | 'vehicle' | 'dates' | 'status';
type CardKey = 'vehicle' | 'dates' | 'status' | 'cancel';

const CARD_HELP: Record<CardKey, string> = {
  vehicle:
    "Change la voiture réservée pour ce client. Choisissez le nouveau véhicule dans la liste : c'est enregistré tout de suite, le reste de la réservation ne bouge pas.",
  dates:
    "Modifie les dates de départ ou de retour, par exemple pour prolonger le séjour du client. Utilisez les boutons +1/+7/+30 jours pour aller plus vite.",
  status:
    "Montre où en est cette réservation (nouvelle, confirmée, en cours, terminée, annulée) et permet de la changer en un clic. Utile pour suivre les dossiers en cours d'un coup d'œil.",
  cancel:
    "Annule cette réservation : le client est marqué comme annulé. Ce n'est pas définitif — vous pouvez toujours revenir en arrière avec la carte Statut.",
};

@Component({
  selector: 'app-attempt-detail',
  imports: [CommonModule, FormsModule, RouterLink, VehiclePicker],
  templateUrl: './attempt-detail.html',
  styleUrl: './attempt-detail.css',
})
export class AttemptDetail {
  protected readonly statuses = ATTEMPT_STATUSES;

  private readonly id: string;
  private readonly attemptSignal: Signal<Attempt | null>;

  protected readonly activePanel = signal<Panel>('none');
  protected readonly editCategory = signal('');
  protected readonly editStart = signal('');
  protected readonly editEnd = signal('');
  protected readonly savingDates = signal(false);
  protected readonly savingVehicle = signal(false);
  protected readonly uploading = signal<AssetKind | null>(null);
  protected readonly uploadingHistoryFile = signal(false);
  protected readonly isRecordingVoice = signal(false);
  protected readonly flippedCard = signal<CardKey | null>(null);
  protected readonly cardHelp = CARD_HELP;

  protected readonly aiConfigured: boolean;
  
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly attemptsService: AttemptsService,
    private readonly geminiService: GeminiService,
    private readonly alerts: AlertService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.aiConfigured = this.geminiService.isConfigured;
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.attemptSignal = toSignal(this.attemptsService.watchAttempt(this.id), { initialValue: null });
  }

  protected get current(): Attempt | null {
    return this.attemptSignal();
  }

  protected readonly clientChecklist = computed<ClientDocChecklist | null>(() => {
    const attempt = this.current;
    return attempt ? this.attemptsService.computeClientChecklist(attempt.clientDocs) : null;
  });

  protected readonly vehicleChecklist = computed<VehicleDocChecklist | null>(() => {
    const attempt = this.current;
    return attempt
      ? this.attemptsService.computeVehicleChecklist(attempt.vehicleDocs, attempt.departureVideos, attempt.returnVideos)
      : null;
  });

  protected statusLabel(status: AttemptStatus): string {
    return this.statuses.find((s) => s.value === status)?.label ?? status;
  }

  protected async setStatus(status: AttemptStatus): Promise<void> {
    await this.attemptsService.updateStatus(this.id, status, this.statusLabel(status));
    this.alerts.toast(`Statut : ${this.statusLabel(status)}`);
  }

  protected openPanel(panel: 'vehicle' | 'dates' | 'status'): void {
    const attempt = this.current;
    if (!attempt) return;
    this.editCategory.set(attempt.category);
    this.editStart.set(attempt.startDate);
    this.editEnd.set(attempt.endDate);
    this.activePanel.set(this.activePanel() === panel ? 'none' : panel);
  }

  protected closePanel(): void {
    this.activePanel.set('none');
  }

  protected toggleInfo(key: CardKey, event: Event): void {
    event.stopPropagation();
    this.flippedCard.set(this.flippedCard() === key ? null : key);
  }

  protected async saveDates(): Promise<void> {
    if (!this.editStart() || !this.editEnd() || this.editEnd() < this.editStart()) {
      this.alerts.error('Vérifiez les dates saisies.');
      return;
    }
    const confirmed = await this.alerts.confirm(
      'Confirmer la prolongation ?',
      `Nouvelles dates : du ${this.editStart()} au ${this.editEnd()}`,
      'Confirmer',
    );
    if (!confirmed) return;

    this.savingDates.set(true);
    try {
      await this.attemptsService.updateDates(this.id, this.editCategory(), this.editStart(), this.editEnd());
      this.alerts.toast('Dates mises à jour');
      this.closePanel();
    } catch {
      this.alerts.error("Impossible d'enregistrer les dates.");
    } finally {
      this.savingDates.set(false);
    }
  }

  protected async saveVehicle(): Promise<void> {
    const confirmed = await this.alerts.confirm(
      'Confirmer le changement de véhicule ?',
      `Nouveau véhicule : ${this.editCategory()}`,
      'Confirmer',
    );
    if (!confirmed) return;

    this.savingVehicle.set(true);
    try {
      await this.attemptsService.updateVehicle(this.id, this.editCategory(), this.editStart(), this.editEnd());
      this.alerts.toast('Véhicule mis à jour');
      this.closePanel();
    } catch {
      this.alerts.error('Impossible de changer le véhicule.');
    } finally {
      this.savingVehicle.set(false);
    }
  }

  protected extendByDays(days: number): void {
    const base = this.editEnd() || this.current?.endDate;
    if (!base) return;
    const date = new Date(base);
    date.setDate(date.getDate() + days);
    this.editEnd.set(date.toISOString().slice(0, 10));
  }

  protected async onFileSelected(event: Event, kind: AssetKind): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploading.set(kind);
    try {
      const extracted =
        kind === 'departureVideos' || kind === 'returnVideos'
          ? await this.geminiService.extractVehicleState(file)
          : kind === 'contractDocs'
            ? await this.geminiService.extractContractData(file)
            : await this.geminiService.extractDocumentFields(file);
      await this.attemptsService.uploadAsset(this.id, file, kind, extracted);
      if (kind === 'contractDocs' && (extracted as { totalPrice?: number | null } | null)?.totalPrice) {
        this.alerts.toast('Contrat analysé — prix mis à jour');
      } else {
        this.alerts.toast('Fichier ajouté');
      }
    } catch {
      this.alerts.error("Le fichier n'a pas pu être envoyé. Réessayez.");
    } finally {
      this.uploading.set(null);
      input.value = '';
    }
  }

  protected async cancelAttempt(): Promise<void> {
    const confirmed = await this.alerts.confirmDanger(
      'Annuler cette réservation ?',
      'Cette action préviendra le client comme annulé. Vous pourrez toujours changer le statut plus tard.',
      'Oui, annuler',
    );
    if (!confirmed) return;
    await this.setStatus('annule');
  }

  protected isVideo(contentType: string): boolean {
    return contentType.startsWith('video/');
  }

  protected isImage(contentType: string): boolean {
    return contentType.startsWith('image/');
  }

  protected async addHistoryFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    this.uploadingHistoryFile.set(true);
    try {
      const { url, publicId } = await this.cloudinaryService.upload(file, `attempts/${this.id}/history`);
      await this.attemptsService.addCustomHistoryEntry(this.id, {
        action: 'fichier',
        note: `Fichier joint : ${file.name}`,
        assetUrl: url,
        assetType: file.type,
        assetName: file.name
      });
      this.alerts.toast('Fichier ajouté à l\'historique');
    } catch (e) {
      this.alerts.error('Erreur lors de l\'envoi du fichier');
    } finally {
      this.uploadingHistoryFile.set(false);
      input.value = '';
    }
  }

  protected async recordVocalNote(): Promise<void> {
    if (this.isRecordingVoice()) {
      this.mediaRecorder?.stop();
      this.isRecordingVoice.set(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };
      
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        const file = new File([audioBlob], 'vocal-note.webm', { type: 'audio/webm' });
        this.uploadingHistoryFile.set(true);
        
        try {
          const { url } = await this.cloudinaryService.upload(file, `attempts/${this.id}/history`);
          
          let aiSummary = '';
          try {
            // Generate summary using Gemini if configured
            if (this.aiConfigured) {
              const res = await this.geminiService.generateSummaryFromAudio(file);
              aiSummary = res || '';
            }
          } catch (e) {
            console.error('AI summary failed', e);
          }

          await this.attemptsService.addCustomHistoryEntry(this.id, {
            action: 'note_vocale',
            note: 'Note vocale ajoutée',
            assetUrl: url,
            assetType: file.type,
            assetName: file.name,
            aiSummary
          });
          this.alerts.toast('Note vocale ajoutée');
        } catch (e) {
          this.alerts.error('Erreur lors de l\'enregistrement de la note vocale');
        } finally {
          this.uploadingHistoryFile.set(false);
        }
      };
      
      this.mediaRecorder.start();
      this.isRecordingVoice.set(true);
    } catch (e) {
      this.alerts.error('Impossible d\'accéder au microphone');
    }
  }
}
