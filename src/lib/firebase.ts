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

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export initialized instances
export { auth, analytics, db };