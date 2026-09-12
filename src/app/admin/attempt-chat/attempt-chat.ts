import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Attempt } from '../../shared/attempt.model';
import { AttemptChatService, ChatMessage } from '../../shared/attempt-chat.service';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-attempt-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './attempt-chat.html',
  styleUrl: './attempt-chat.css',
})
export class AttemptChat implements OnInit, OnDestroy, AfterViewChecked {
  @Input({ required: true }) attempt!: Attempt;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLElement>;

  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly inputText = signal('');
  protected readonly isLoading = signal(false);
  protected readonly isListening = signal(false);
  protected readonly isOpen = signal(false);

  protected readonly hasMessages = computed(() => this.messages().length > 0);

  private systemContext = '';
  private recognition: SpeechRecognition | null = null;
  private shouldScrollToBottom = false;

  readonly quickQuestions = [
    'Quelle est l\'immatriculation du vehicule?',
    'Quel est l\'etat du vehicule au depart?',
    'Le client a fourni son permis?',
    'Y a-t-il des dommages detectes?',
    'Quel est le prix total de la location?',
    'Quand est-ce que la reservation a ete creee?',
    'Le contrat est-il signe?',
  ];

  constructor(
    private readonly chatService: AttemptChatService,
    private readonly alerts: AlertService,
  ) {}

  ngOnInit(): void {
    this.systemContext = this.chatService.buildSystemContext(this.attempt);
  }

  ngOnDestroy(): void {
    this.recognition?.abort();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  protected toggle(): void {
    this.isOpen.update(v => !v);
    if (this.isOpen() && !this.hasMessages()) {
      // Auto-welcome message
      this.messages.set([
        {
          role: 'model',
          text: `Bonjour ! Je suis votre assistant IA pour la reservation de **${this.attempt.customerName}**.\n\nJe connais toutes les donnees de ce dossier : documents, videos, historique, prix, etc. Posez-moi vos questions !`,
          timestamp: Date.now(),
        },
      ]);
      this.shouldScrollToBottom = true;
    }
  }

  protected async send(text?: string): Promise<void> {
    const msg = text ?? this.inputText().trim();
    if (!msg || this.isLoading()) return;

    this.inputText.set('');
    const userMessage: ChatMessage = { role: 'user', text: msg, timestamp: Date.now() };
    this.messages.update(msgs => [...msgs, userMessage]);
    this.isLoading.set(true);
    this.shouldScrollToBottom = true;

    try {
      const response = await this.chatService.sendMessage(
        this.systemContext,
        this.messages().slice(0, -1), // exclude the message we just added
        msg,
      );
      const modelMessage: ChatMessage = { role: 'model', text: response, timestamp: Date.now() };
      this.messages.update(msgs => [...msgs, modelMessage]);
      this.shouldScrollToBottom = true;
    } catch (err) {
      this.alerts.error('Erreur de connexion avec l\'IA. Verifiez la cle API Gemini.');
      // Remove the user message on failure
      this.messages.update(msgs => msgs.slice(0, -1));
    } finally {
      this.isLoading.set(false);
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected toggleVoice(): void {
    if (this.isListening()) {
      this.recognition?.stop();
      this.isListening.set(false);
      return;
    }

    this.recognition = this.chatService.startVoiceInput(
      (transcript) => {
        this.inputText.set(transcript);
        this.isListening.set(false);
        // Auto-send after voice input
        setTimeout(() => this.send(), 300);
      },
      () => {
        this.isListening.set(false);
      },
    );

    if (this.recognition) {
      this.isListening.set(true);
    } else {
      this.alerts.error('La reconnaissance vocale n\'est pas disponible dans ce navigateur.');
    }
  }

  protected clearChat(): void {
    this.messages.set([]);
    this.toggle();
    setTimeout(() => this.toggle(), 10);
  }

  /** Format markdown-like bold **text** */
  protected formatText(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
}
