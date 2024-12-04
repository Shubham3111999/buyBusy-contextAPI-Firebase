import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCYKoOPMVKd0poh6jmTok0ASPyM6sBdik",  //save in env
  authDomain: "blog-49d4f.firebaseapp.com",
  projectId: "blog-49d4f",
  storageBucket: "blog-49d4f.firebasestorage.app",
  messagingSenderId: "1043845388244",
  appId: "1:1043845388244:web:8ddf2f0c5996c1e1c6a841"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const auth =getAuth(app);

