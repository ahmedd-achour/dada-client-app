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

  /** New admin requesting an account: the code goes to the super admin's inbox for approval. */
  async sendAdminSignupOtp(request: { phone: string; name: string; email: string; code: string }): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #2a1c12;">
        <h2 style="margin-bottom: 4px;">Nouvel appareil demandant l'accès admin</h2>
        <p style="color: #6b5a4a; margin-top: 0;">Dada Rent Car — Espace admin</p>
        <table style="border-collapse: collapse; margin-top: 12px;">
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Nom</td><td><strong>${request.name}</strong></td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Téléphone</td><td>${request.phone}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Email</td><td>${request.email}</td></tr>
        </table>
        <p style="margin-top: 20px;">Code de vérification :</p>
        <p style="font-size: 2rem; font-weight: 700; letter-spacing: 0.3em; color: #7a4a28;">${request.code}</p>
        <p style="color: #6b5a4a; font-size: 0.85rem;">Valable 1 heure. Transmettez ce code à la personne ci-dessus pour qu'elle puisse confirmer son appareil.</p>
      </div>
    `;
    await this.sendOtpEmail(runtimeConfig.superAdminEmail, 'Code de vérification — création compte admin', html);
  }

  /** Already-registered admin on an unrecognized device: the code goes to their OWN inbox. */
  async sendAdminLoginOtp(request: { phone: string; name: string; email: string; code: string }): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #2a1c12;">
        <h2 style="margin-bottom: 4px;">Connexion depuis un nouvel appareil</h2>
        <p style="color: #6b5a4a; margin-top: 0;">Dada Rent Car — Espace admin</p>
        <p>Bonjour ${request.name}, une connexion est demandée pour le ${request.phone} depuis un appareil non reconnu.</p>
        <p style="margin-top: 20px;">Code de vérification :</p>
        <p style="font-size: 2rem; font-weight: 700; letter-spacing: 0.3em; color: #7a4a28;">${request.code}</p>
        <p style="color: #6b5a4a; font-size: 0.85rem;">Valable 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `;
    await this.sendOtpEmail(request.email, 'Code de vérification — connexion espace admin', html);
  }

  private async sendOtpEmail(toEmail: string, subject: string, htmlContent: string): Promise<void> {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': runtimeConfig.brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        // A verified, real-domain sender — a gmail.com "From" relayed through Brevo to another
        // gmail.com recipient gets silently dropped/spam-filtered by Gmail's DMARC checks even
        // when Brevo reports success. This address is already verified and deliverable (same one
        // used by the Shnell project's contact form on the same Brevo account).
        sender: { name: runtimeConfig.brevoSenderName, email: 'service@xschnell.com' },
        to: [{ email: toEmail }],
        subject,
        htmlContent,
      }),
    });
    if (!response.ok) {
      throw new Error(`Échec de l'envoi du code OTP (${response.status})`);
    }
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
          <tr><td style="padding: 4px 12px 4px 0; color: #6b5a4a;">Véhicule</td><td>${attempt.vehicleLabel ? `<strong>${attempt.vehicleLabel}</strong> (${attempt.category})` : attempt.category}</td></tr>
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
