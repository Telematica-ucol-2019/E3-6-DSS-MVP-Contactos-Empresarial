// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjzD-oDcLBCCuBP2vAil4o9UAEx0ght5k",
  authDomain: "contactos-empresarial.firebaseapp.com",
  projectId: "contactos-empresarial",
  storageBucket: "contactos-empresarial.appspot.com",
  messagingSenderId: "503126630615",
  appId: "1:503126630615:web:438aacabd20f4e424c1092"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth();
const firestore = getFirestore();
