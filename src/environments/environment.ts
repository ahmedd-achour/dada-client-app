/**
 * Central place for every secret/config value the app needs.
 *
 * ⚠️ These are bundled into the client-side JS and are visible to anyone who opens
 * dev tools. That's a deliberate, temporary trade-off ("ship fast, test now, secure
 * later") — before going to production, move the sensitive ones (Gemini, Brevo,
 * Cloudinary api_secret) behind a small backend / Cloud Function.
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

  gemini: {
    apiKey: 'REDACTED',
    model: 'gemini-3.5-flash-lite',
  },

  brevo: {
    apiKey: 'REDACTED',
    senderEmail: 'service@xschnell.com',
    senderName: 'Dada Rent Car',
    ownerEmail: 'achour.pages@gmail.com',
  },

  cloudinary: {
    cloudName: 'bubf0bim',
    apiKey: '919164853477356',
    apiSecret: 'REDACTED',
  },
};
