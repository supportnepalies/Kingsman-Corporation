import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Silence internal offline connection logs so they don't produce false fatal errors in sandboxed iframes
try {
  setLogLevel('silent');
} catch {
  // Ignore in environments without setLogLevel
}

// Intercept console.error to reroute benign offline fallback logs to console.warn
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = function (...args: any[]) {
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      (args[0].includes('Could not reach Cloud Firestore backend') ||
       args[0].includes('@firebase/firestore') ||
       args[0].includes('code=unavailable'))
    ) {
      console.warn(...args);
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: The app will break without specifying firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot with timeout
export async function testFirestoreConnection() {
  try {
    const testPromise = getDocFromServer(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection test timed out')), 3000)
    );
    await Promise.race([testPromise, timeoutPromise]);
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('the client is offline') ||
      error.message.includes('unavailable') ||
      error.message.includes('timed out') ||
      (error as any)?.code === 'unavailable'
    )) {
      console.warn("Firestore connection: Backend initializing or operating in offline fallback mode.");
    }
  }
}

testFirestoreConnection().catch(() => {});
