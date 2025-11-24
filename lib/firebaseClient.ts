// lib/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC_rwpbEejIjln4g87S70ECeKQ3rvPlw98",
  authDomain: "comedoruaz.firebaseapp.com",
  databaseUrl: "https://comedoruaz-default-rtdb.firebaseio.com/",
  projectId: "comedoruaz",
  storageBucket: "comedoruaz.firebasestorage.app",
  messagingSenderId: "180553463544",
  appId: "1:180553463544:web:13128378ea3d158265ed0d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getDatabase(app);
export default app;
