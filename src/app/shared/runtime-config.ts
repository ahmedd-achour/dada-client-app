/**
 * Runtime-fetched secrets/config, sourced from Firebase Remote Config instead
 * of being hardcoded in the bundle. Values can be rotated from the Firebase
 * console without a rebuild/redeploy — see `remoteConfigReady` below, which
 * an app initializer awaits before the app finishes bootstrapping.
 */
import { fetchAndActivate, getValue } from 'firebase/remote-config';
import { remoteConfig } from './firebase';

export const remoteConfigReady: Promise<void> = fetchAndActivate(remoteConfig)
  .then(() => undefined)
  .catch((error) => {
    console.error('Remote Config fetch failed, values will be empty until it succeeds', error);
  });

function value(key: string): string {
  return getValue(remoteConfig, key).asString();
}

export const runtimeConfig = {
  get googleMapsApiKey(): string { return value('google_maps_api_key'); },
  get mapboxAccessToken(): string { return value('mapbox_access_token'); },
  get geminiApiKey(): string { return value('gemini_api_key'); },
  get geminiModel(): string { return value('gemini_model') || 'gemini-2.0-flash'; },
  get brevoApiKey(): string { return value('brevo_api_key'); },
  get brevoSenderEmail(): string { return value('brevo_sender_email'); },
  get brevoSenderName(): string { return value('brevo_sender_name'); },
  get brevoOwnerEmail(): string { return value('brevo_owner_email'); },
  get superAdminEmail(): string { return value('super_admin_email'); },
  get cloudinaryApiKey(): string { return value('cloudinary_api_key'); },
  get cloudinaryCloudName(): string { return value('cloudinary_cloud_name'); },
  get cloudinaryApiSecret(): string { return value('cloudinary_api_secret'); },
};
