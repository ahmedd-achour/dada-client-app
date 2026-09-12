/**
 * Central place for the app's Firebase project config.
 *
 * All other secrets (Gemini, Brevo, Cloudinary, Maps, Mapbox) live in Firebase
 * Remote Config instead of here — see `src/app/shared/runtime-config.ts`.
 * They can be rotated from the Firebase console without a rebuild/redeploy,
 * and they never touch source control.
 */
export const environment = {
  firebase: {
    apiKey: 'AIzaSyD4nfa3AE2HLRAQGpE-XP3rGvsst49-BH8',
    authDomain: 'car-rent-48943.firebaseapp.com',
    projectId: 'car-rent-48943',
    storageBucket: 'car-rent-48943.firebasestorage.app',
    messagingSenderId: '408390836684',
    appId: '1:408390836684:web:ef271a0014d762d0bf7d69',
    measurementId: 'G-SZZM6CHQLG',
  },
};
