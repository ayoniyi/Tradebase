import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tradebase-720bc.firebaseapp.com",
  //authDomain: "http://localhost:3000",
  projectId: "tradebase-720bc",
  storageBucket: "tradebase-720bc.appspot.com",
  messagingSenderId: "152261073632",
  appId: "1:152261073632:web:81e5f51e12b6dd84c8ce85",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
