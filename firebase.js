// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVHOgRmL7gC0Zef0F1EpSyUpJjZUFhNZc",
  authDomain: "ai-writing-ddc52.firebaseapp.com",
  projectId: "ai-writing-ddc52",
  storageBucket: "ai-writing-ddc52.appspot.com",
  messagingSenderId: "631629110715",
  appId: "1:631629110715:web:46ab331ad0b3156fc3389e",
  measurementId: "G-9XWPML76HR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };