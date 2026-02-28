const COLLECTION = "energyEntries";
const SETTINGS_COLLECTION = "userSettings";
const DEFAULT_THRESHOLD = 50;

async function getFirestoreDb() {
  const { getApps, initializeApp, cert } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");

  const apps = getApps();
  if (apps.length > 0) {
    return getFirestore(apps[0]);
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (json) {
    let credentials: { projectId?: string; clientEmail?: string; privateKey?: string };
    try {
      credentials = JSON.parse(json) as { projectId?: string; clientEmail?: string; privateKey?: string };
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON.");
    }
    initializeApp({ credential: cert(credentials) });
  } else if (keyPath) {
    initializeApp({ credential: cert(keyPath) });
  } else {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT_JSON (JSON string) or GOOGLE_APPLICATION_CREDENTIALS (path to key file). Get the key from Firebase Console → Project Settings → Service Accounts → Generate new private key."
    );
  }

  return getFirestore();
}

export async function getEntriesForUser(userId: string): Promise<{ date: string; units: number }[]> {
  const db = await getFirestoreDb();
  const snap = await db
    .collection(COLLECTION)
    .where("userId", "==", userId)
    .get();

  const entries = snap.docs.map((d) => {
    const data = d.data();
    return { date: data.date as string, units: data.units as number };
  });
  entries.sort((a, b) => a.date.localeCompare(b.date));
  return entries;
}

export async function addEntryForUser(
  userId: string,
  entry: { date: string; units: number }
): Promise<{ date: string; units: number }> {
  const db = await getFirestoreDb();
  const docRef = await db.collection(COLLECTION).add({
    userId,
    date: entry.date,
    units: entry.units,
  });
  const doc = await docRef.get();
  const data = doc.data()!;
  return { date: data.date as string, units: data.units as number };
}

export type UserSettings = {
  threshold: number;
};

export async function getSettingsForUser(userId: string): Promise<UserSettings> {
  const db = await getFirestoreDb();
  const doc = await db.collection(SETTINGS_COLLECTION).doc(userId).get();
  if (!doc.exists) {
    return { threshold: DEFAULT_THRESHOLD };
  }
  const data = doc.data()!;
  return {
    threshold: typeof data.threshold === "number" ? data.threshold : DEFAULT_THRESHOLD,
  };
}

export async function setSettingsForUser(
  userId: string,
  settings: Partial<UserSettings>
): Promise<UserSettings> {
  const db = await getFirestoreDb();
  const ref = db.collection(SETTINGS_COLLECTION).doc(userId);
  const current = await getSettingsForUser(userId);
  const next = { ...current, ...settings };
  await ref.set(next, { merge: true });
  return next;
}
