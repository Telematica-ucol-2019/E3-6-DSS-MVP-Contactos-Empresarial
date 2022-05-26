// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, where, query, getDocs, getDocFromCache, getDoc, deleteDoc, updateDoc, onSnapshot} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"
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
export {doc, collection, getDocFromCache, getDoc, query, where, onSnapshot}
export const deleteUsersRev = id => deleteDoc(doc(db, 'users', id))
export const deleteContacts = id => deleteDoc(doc(db, 'contacts', id))

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

export const onGetUsers = (callback) => onSnapshot(collection(db, 'users'), callback)



export const addNewUser = async (area, email, name, phone, active) => {
  await addDoc(collection(db, 'users'), {area, email, name, phone, active })
}

//Update Contacts
export const getContact = (id) => getDoc(doc(db,'contacts', id));

export const updateContact = (id, newFields) => updateDoc(doc(db,'contacts', id), newFields);


//Update Users
export const getUser = (id) => getDoc(doc(db,'users',id));

export const updateUser = (id, newFields) => updateDoc(doc(db, 'users', id), newFields);