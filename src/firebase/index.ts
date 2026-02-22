import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Re-export hooks and providers
export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';

export const initializeFirebase = () => {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
};
