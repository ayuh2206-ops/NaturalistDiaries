import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkvTMW8uNIb5lz2P6RSSTzL6nCwTMX_Fw",
  authDomain: "naturalist-diaries-7ea90.firebaseapp.com",
  projectId: "naturalist-diaries-7ea90",
  storageBucket: "naturalist-diaries-7ea90.firebasestorage.app",
  messagingSenderId: "949344166462",
  appId: "1:949344166462:web:614e2de730404417b2276f",
  measurementId: "G-1P66TH00WC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function loadFromFirebase() {
  try {
    const adminDoc = await getDoc(doc(db, 'config', 'admin'));
    let adminData = null;
    let passwordHash = null;

    if (adminDoc.exists()) {
      const data = adminDoc.data();
      adminData = data.ADMIN;
      passwordHash = data.passwordHash;
    }

    const submissionsSnap = await getDocs(collection(db, 'submissions'));
    const submissions = [];
    submissionsSnap.forEach(docSnap => {
      submissions.push({ id: docSnap.id, ...docSnap.data() });
    });

    return { adminData, passwordHash, submissions };
  } catch (error) {
    console.error('Error loading from Firebase:', error);
    return { adminData: null, passwordHash: null, submissions: [] };
  }
}

export async function saveToFirebase(adminData, passwordHash) {
  try {
    await setDoc(doc(db, 'config', 'admin'), {
      ADMIN: adminData,
      passwordHash: passwordHash,
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return false;
  }
}

export async function saveSubmissionToFirebase(submission) {
  try {
    await setDoc(doc(db, 'submissions', submission.id.toString()), submission);
    return true;
  } catch (error) {
    console.error('Error saving submission:', error);
    return false;
  }
}
