import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getRemoteConfig } from 'firebase/remote-config';
import { environment } from '../../environments/environment';

export const firebaseApp = initializeApp(environment.firebase);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const remoteConfig = getRemoteConfig(firebaseApp);
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

isAnalyticsSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(firebaseApp);
    }
  })
  .catch(() => undefined);
