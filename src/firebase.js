import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

// Placeholder Firebase Configuration
// Replace these with your project's Firebase credentials from Firebase Console
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if credentials are using defaults/placeholders
export const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("YOUR_API_KEY");

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL
};
