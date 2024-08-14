// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBS2em7bycgm9UCGT8nbAFVbopjvUpiYc",
  authDomain: "ai-writing-45138.firebaseapp.com",
  projectId: "ai-writing-45138",
  storageBucket: "ai-writing-45138.appspot.com",
  messagingSenderId: "1006626594067",
  appId: "1:1006626594067:web:a1df778142e3ffc9f00ee6",
  measurementId: "G-63V0657PQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
