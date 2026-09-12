import { Injectable } from '@angular/core';
import { runtimeConfig } from './runtime-config';
import { AdminsService } from './admins.service';
import { Attempt } from './attempt.model';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor(private readonly adminsService: AdminsService) {}

  async notifyNewAttempt(attempt: Attempt): Promise<void> {
    await this.send(
      `Nouvelle réservation : ${attempt.customerName}`,
      this.buildAttemptSummary(attempt, 'Nouvelle demande de réservation reçue.'),
    );
  }

  async notifyAction(attempt: Attempt, actionLabel: string): Promise<void> {
    await this.send(
      `${actionLabel} — ${attempt.customerName}`,
      this.buildAttemptSummary(attempt, actionLabel),
    );
  }

  private buildAttemptSummary(attempt: Attempt, headline: string): string {
    const link = `${window.location.origin}/admin/${attempt.id}`;
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #2a1c12;">
        <h2 style="margin-bottom: 4px;">${headline}</h2>
        <p style="color: #6b5a4a; margin-top: 0;">Dada Rent Car</p>
        <table style="border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Client</td><td><strong>${attempt.customerName}</strong></td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Téléphone</td><td>${attempt.customerPhone}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Véhicule</td><td>${attempt.category}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Dates</td><td>${attempt.startDate} → ${attempt.endDate}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Total estimé</td><td>${attempt.pricing?.total ?? '-'} DT</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Statut</td><td>${attempt.status}</td></tr>
          ${attempt.promoCode ? `<tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Code promo</td><td>${attempt.promoCode}</td></tr>` : ''}
        </table>
        <p style="margin-top: 20px;">
          <a href="${link}" style="background:#7a4a28;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;">Voir dans l'espace admin</a>
        </p>
      </div>
    `;
  }

  private async send(subject: string, htmlContent: string): Promise<void> {
    try {
      const adminEmails = await this.adminsService.listAdminEmails();
      const recipients = Array.from(new Set([runtimeConfig.brevoOwnerEmail, ...adminEmails])).map((email) => ({ email }));

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': runtimeConfig.brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: runtimeConfig.brevoSenderName, email: runtimeConfig.brevoSenderEmail },
          to: recipients,
          subject,
          htmlContent,
        }),
      });
    } catch (error) {
      console.error('Envoi email Brevo échoué', error);
    }
  }
}
