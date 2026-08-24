import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Strip stray whitespace/newlines/quotes that can sneak into env values
// (e.g. a trailing newline pasted into a Vercel env var corrupts the Firestore URL).
const clean = (v) => (typeof v === "string" ? v.trim().replace(/^['"]|['"]$/g, "").replace(/\s+/g, "") : v);

const firebaseConfig = {
  apiKey: clean(process.env.REACT_APP_FIREBASE_API_KEY),
  authDomain: clean(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
  projectId: clean(process.env.REACT_APP_FIREBASE_PROJECT_ID),
  storageBucket: clean(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(process.env.REACT_APP_FIREBASE_APP_ID),
};

let auth = null;
let db = null;
let storage = null;

if (firebaseConfig.apiKey) {
  const app = getApps()[0] || initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage };
export const firebaseReady = Boolean(auth);
