// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, where, query, getDocs, getDocFromCache, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"
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
export const db = getFirestore();
export {doc, collection, getDocFromCache, getDoc}
export const deleteContacts = id => deleteDoc(doc(db, 'users', id))

/*
export const newUser = (correo, rol, area) => {
  addDoc(collection(db, 'usuarios'), {
    correo,
    rol,
    area
  })
}

*/


/*
export const newUser = (id, correo, rol, area) => {

  db.collection('usuarios').doc(id).set({
    correo,
    rol,
    area
  })

}
*/

export const newUser = async (id, email, role, name, phone, area, active) => {
  await setDoc(doc(db, 'users', id), {email, role, name, phone, area, active})
}

export const newContact = async (area, email, name, phone) => {
  await addDoc(collection(db, 'contacts'), {area, email, name, phone})
}