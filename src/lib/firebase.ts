// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCR_nmVYlA_ZwvKEnaGNKsIzNWfN67G6TQ",
  authDomain: "playdelivery-82118.firebaseapp.com",
  projectId: "playdelivery-82118",
  storageBucket: "playdelivery-82118.firebasestorage.app",
  messagingSenderId: "266732761695",
  appId: "1:266732761695:web:175c12e1a0d0070432e1ea",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
