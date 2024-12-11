import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCVuEBXkLZxFObwB7N7DDHCfBCx-4s6XeY",
  authDomain: "chat-app-9defa.firebaseapp.com",
  projectId: "chat-app-9defa",
  storageBucket: "chat-app-9defa.firebasestorage.app",
  messagingSenderId: "1067753168515",
  appId: "1:1067753168515:web:d35a4155499ffd18acc5b6",
  measurementId: "G-Q3E25JENGX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);