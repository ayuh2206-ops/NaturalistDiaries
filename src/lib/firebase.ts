import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkvTMW8uNIb5lz2P6RSSTzL6nCwTMX_Fw",
  authDomain: "naturalist-diaries-7ea90.firebaseapp.com",
  projectId: "naturalist-diaries-7ea90",
  storageBucket: "naturalist-diaries-7ea90.firebasestorage.app",
  messagingSenderId: "949344166462",
  appId: "1:949344166462:web:614e2de730404417b2276f",
  measurementId: "G-1P66TH00WC"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
