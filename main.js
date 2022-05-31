import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"
import { getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"
import {newUser, db, doc, collection, getDocFromCache, 
    getDoc, deleteContacts, getContact, updateContact, 
    query, where, onGetUsers, deleteUsersRev, getUser, updateUser, addNewUser, onSnapshot} from './firebase.js'

import tools from './functions.js'


//console.log(auth);
const signupForm = document.querySelector('#signup-form')
const auth = getAuth();
const usersContainer = document.getElementById('table')
console.log(usersContainer.class);
var unsubscribe 

let editStatus = false;
let id = '';

//sign up
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const signupEmail = document.querySelector('#signup-email').value
    const signupPassword = document.querySelector('#signup-password').value
    const signupName = document.querySelector('#signup-name').value
    const signupPhone = document.querySelector('#signup-phone').value
    const signupArea = document.querySelector('#signup-area').value
        createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
        .then(userCredential => {
            //clear the form
            signupForm.reset()
            
            //hide modal
            $('#signUpModal').modal('hide')
            //signUpModal.hide()
            console.log('sign up AAA')
            console.log(userCredential.user.uid);
            newUser(userCredential.user.uid, signupEmail, 'user', signupName, signupPhone, signupArea, false)    
        }).catch (error => {
            console.log(error.code)
            switch(error.code) {
                case "auth/invalid-email":
                    alert("Invalid Email")
                    break;
                case "auth/email-already-in-use":
                    alert("Email already in use")
                    break;    
                case   "auth/weak-password":
                    alert("Weak password")
                    break;
                default:
                    alert('error:' + error.code)
                    break;              
            }
        })

        
    })

//login
const loginForm = document.querySelector('#login-form')

loginForm.addEventListener('submit', e =>{
    e.preventDefault();
    const loginEmail = document.querySelector('#login-email').value
    const loginPassword = document.querySelector('#login-password').value
    
            signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            .then(userCredential => {
                //clear the form
                loginForm.reset()
                
                //hide modal
                $('#loginModal').modal('hide')
                //signUpModal.hide()
            }).catch (error => {
                console.log(error.code)

                switch (error.code){
                    case 'auth/invalid-email':
                        alert('Invalid Email')
                        break;
                    case 'auth/user-not-found': 
                        alert('Email not registered')
                        break;
                    case 'auth/wrong-password':
                        alert('Wrong password') 
                        break;
                    default:
                        alert('error:' + error.code)
                        break;
                }
            }) 
})
//console.log(editStatus);
const newContactForm = document.querySelector('#nContact-form')
// addContacts

const addContactButton = document.querySelector('#addContBtn')
addContactButton.addEventListener('click', () =>{
    editStatus = false;
    newContactForm.reset()
    newContactForm['updateFormBtn'].innerText = 'Add contact'
    console.log(editStatus);
})
newContactForm.addEventListener('submit', e =>{
    e.preventDefault();
    const addContName = document.querySelector('#nContact-name').value
    const addContPhone = document.querySelector('#nContact-phone').value
    const addContArea = document.querySelector('#nContact-area').value
    const addContEmail = document.querySelector('#nContact-email').value
console.log(editStatus);
    if (!editStatus){
        addNewUser(addContArea, addContEmail, addContName ,addContPhone, "user", true)
    } else {
        updateUser(id, {
            area: addContArea,
            email: addContEmail, 
            name: addContName,
            phone: addContPhone
        })
        editStatus = false;
    }
        newContactForm.reset()
        //hide modal
        $('#addContModal').modal('hide')
        
       //setTimeout(() => {window.location.reload();}, 400);  
})

//logOut

const logout = document.querySelector('#logout')

logout.addEventListener('click', e =>{

    e.preventDefault();
    auth.signOut().then(() =>{
        unsubscribe();
        usersContainer.innerHTML = ""
        mainHeaderMessage.hidden = false
        mainBodyMessage.hidden = false
        console.log('Logged out')
    })
})

//buttons
const loginButton = document.querySelector('#loginButton')
const signUpButton = document.querySelector('#signUpButton')
const logOutButton = document.querySelector('#logout')

//messages
const headerMessage = document.querySelector('#welcome-headerMessage')
const bodyMessage = document.querySelector('#welcome-bodyMessage')
const mainHeaderMessage = document.querySelector('#mainPage-headerMessage')
const mainBodyMessage = document.querySelector('#mainPage-bodyMessage')

auth.onAuthStateChanged(async user => {
    
    if(user){
        loginButton.hidden = true
        signUpButton.hidden = true
        logOutButton.hidden = false
        mainHeaderMessage.hidden = true
        mainBodyMessage.hidden = true

        const usersRef = collection(db, "users")
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        const userName = docSnap.data().name
        const userRole = docSnap.data().role
        const userArea = docSnap.data().area
            
        console.log(userRole)

        if (userRole == "reviewer") {

            usersContainer.hidden = false;

            const queryInactiveUsers = query(usersRef, where("active", "==", false), where("role", "==", "user"))
                        
                    unsubscribe = onSnapshot(queryInactiveUsers, (querySnapshot) => {
                    tools.buildTable(userRole, usersContainer, querySnapshot)

                    const btnsEdit = usersContainer.querySelectorAll('.editBtn')
                    const btnsActivate = usersContainer.querySelectorAll('.actBtn')

                    btnsEdit.forEach((btn) =>{
                        btn.addEventListener('click', async (e) => {
                           const doc = await getUser(e.target.dataset.id)
                           const user = doc.data()
                           newContactForm['nContact-name'].value = user.name
                           newContactForm['nContact-phone'].value = user.phone
                           newContactForm['nContact-area'].value = user.area
                           newContactForm['nContact-email'].value = user.email
                           editStatus = true;
                           id = doc.id;
                           newContactForm['updateFormBtn'].innerText = 'Update'
                           
                        })
                    })

                    btnsActivate.forEach((btn) => {
                        btn.addEventListener('click', ({target: {dataset}}) =>{
                            console.log("USER ROLE: " + userRole)
                            console.log(dataset.id)
                            updateUser(dataset.id, {
                                active: true
                            })
                            //setTimeout(() => {window.location.reload();}, 500);
                        })
                    })

                })
        }

        if (userRole == "admin") {
            
            usersContainer.hidden = false;
            addContactButton.hidden = false

            const queryActiveUsers = query(usersRef, where("active", "==", true), where("role", "==", "user"))
            
        
                    unsubscribe = onSnapshot(queryActiveUsers, (querySnapshot) => {
                    tools.buildTable(userRole, usersContainer, querySnapshot)

                    const btnsEdit = usersContainer.querySelectorAll('.editBtn')
                    const btnsDeactivate = usersContainer.querySelectorAll('.deactBtn')

                    // console.log(btnsDelete);
                     console.log(btnsEdit);
                     console.log(btnsDeactivate);

                     btnsDeactivate.forEach((btn) => {
                        btn.addEventListener('click', ({target: {dataset}}) =>{
                            console.log(dataset.id)
                            console.log("USER ROLE: " + userRole)
                            updateUser(dataset.id, {
                                active: false
                            })
                            //setTimeout(() => {window.location.reload();}, 500);
                        })
                    })

                    btnsEdit.forEach((btn) =>{
                        btn.addEventListener('click', async (e) => {
                           const doc = await getUser(e.target.dataset.id)
                           //console.log(doc.data())
                           const user = doc.data()
            
                           newContactForm['nContact-name'].value = user.name
                           newContactForm['nContact-phone'].value = user.phone
                           newContactForm['nContact-area'].value = user.area
                           newContactForm['nContact-email'].value = user.email
            
                           editStatus = true;
                           id = doc.id;
            
                           newContactForm['updateFormBtn'].innerText = 'Update'
                           
                        })
                    })
                })
               
        }
        if (userRole == "user") {
            
            usersContainer.hidden = false;
            headerMessage.hidden = false;
            bodyMessage.hidden = false;
            const queryActiveUsers = query(usersRef, where("active", "==", true), where("area", "==", userArea), where("role", "==", "user"))
            const queryDocsActiveUsers = await getDocs(queryActiveUsers);
            
            tools.buildTable(userRole, usersContainer, queryDocsActiveUsers)
        }

        // Revisor btns
        headerMessage.innerHTML = `Welcome ${userName}!`
        bodyMessage.innerHTML = `Showing contacts from ${userArea} area`

    } else {
        usersContainer.hidden = true;
        addContactButton.hidden = true;
        loginButton.hidden = false
        signUpButton.hidden = false
        logOutButton.hidden = true
        headerMessage.hidden = true
        bodyMessage.hidden = true
        mainHeaderMessage.hidden = false
        mainBodyMessage.hidden = false
    }
})