import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxZPrHVp1B-uxuItUBOmczeRV9CivyNBE",
  authDomain: "sample-firebase-ai-app-9f395.firebaseapp.com",
  projectId: "sample-firebase-ai-app-9f395",
  storageBucket: "sample-firebase-ai-app-9f395.firebasestorage.app",
  messagingSenderId: "383571742946",
  appId: "1:383571742946:web:777d883ba81e1a09df4ebb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);