import { Injectable } from '@angular/core';
import { runtimeConfig } from './runtime-config';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  async upload(file: File, folder: string): Promise<CloudinaryUploadResult> {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { folder, timestamp };
    const signature = await this.sign(paramsToSign);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', runtimeConfig.cloudinaryApiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('folder', folder);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${runtimeConfig.cloudinaryCloudName}/auto/upload`,
      { method: 'POST', body: formData },
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${await response.text()}`);
    }

    const data = await response.json();
    return { url: data.secure_url as string, publicId: data.public_id as string };
  }

  /** Cloudinary's signing algorithm: sort params, join as key=value&..., append api_secret, SHA-1 hex. */
  private async sign(params: Record<string, string | number>): Promise<string> {
    const toSign =
      Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&') + runtimeConfig.cloudinaryApiSecret;

    const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(toSign));
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
