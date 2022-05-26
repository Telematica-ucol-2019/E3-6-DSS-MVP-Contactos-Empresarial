import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"
import { getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"
import {newUser, db, doc, collection, getDocFromCache, 
    getDoc, deleteContacts, getContact, updateContact, 
    query, where, onGetContacts, deleteUsersRev, getUser, updateUser, addNewUser} from './firebase.js'
//import tools from './functions.js'

//console.log(auth);
const signupForm = document.querySelector('#signup-form')
const auth = getAuth();
const usersContainer = document.getElementById('table')

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

    if (!editStatus){
        addNewUser(addContArea, addContEmail, addContName ,addContPhone, true)
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
        
       setTimeout(() => {window.location.reload();}, 400);  
})

//logOut

const logout = document.querySelector('#logout')

logout.addEventListener('click', e =>{
    e.preventDefault();
    auth.signOut().then(() =>{
        console.log('Logged out')
    })
})

//buttons
const loginButton = document.querySelector('#loginButton')
const signUpButton = document.querySelector('#signUpButton')
const logOutButton = document.querySelector('#logout')


const message = document.querySelector('#welcome-message')


auth.onAuthStateChanged(async user => {
    if(user){
        loginButton.hidden = true
        signUpButton.hidden = true
        logOutButton.hidden = false

        //const q = query(usersRef, where(, "==", "CA"));
        // console.log(user.uid);
        // console.log(doc(db, "users", user.uid));
        // console.log(doc(usersRef, user.uid));
        
        
        const usersRef = collection(db, "users")
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        const userName = docSnap.data().name
        const userRole = docSnap.data().role
        const userArea = docSnap.data().area
            
            // console.log("Document data: ");
            // console.log(docSnap.data());
            //console.log("User name: " + userName);

        console.log(userRole)




        if (userRole == "reviewer") {
            
            usersContainer.hidden = false;
            //addContactButton.hidden = false

            const queryInactiveUsers = query(usersRef, where("active", "==", false))
            const queryDocsInactiveUsers = await getDocs(queryInactiveUsers);
                //onGetContacts(async (querySnapshot) => {
            
                usersContainer.innerHTML = ""
                usersContainer.innerHTML += 
                    `<tr>
                        <th colspan="1" width="200" style="border-width: 1px">Name</th>
                        <th colspan="1" width="189" style="border-width: 1px">Email</th>
                        <th colspan="1" width="100" style="border-width: 1px">Phone</th>
                        <th colspan="1" width="150" style="border-width: 1px">Area</th>
                        <th colspan="1" width="150" style="border-width: 1px">Manage</th>  
                    </tr>`
                    
                    //DB LISTENING
                    //querySnapshot.forEach((doc) => {
                        

                    //MAMARRACHA WAY
                    // const query = await getDocs(collection(db, "contacts"));


                    queryDocsInactiveUsers.forEach( (doc) => {

                    usersContainer.innerHTML += 
                    `<tr>
                       <td style="border-width: 1px"> ${doc.data().name}</td> 
                       <td style="border-width: 1px"> ${doc.data().email}</td> 
                       <td style="border-width: 1px"> ${doc.data().phone}</td> 
                       <td style="border-width: 1px"> ${doc.data().area}</td>
                       <td style="border-width: 1px">
                       <button class='editBtn' data-id="${doc.id}" href="#"
                       data-bs-toggle="modal" data-bs-target="#addContModal">Edit</button>
                       <button class='actBtn' data-id="${doc.id}">Activate</button></td>
                    </tr>`
               });

            //})
        }


        if (userRole == "admin") {
            
            usersContainer.hidden = false;
            addContactButton.hidden = false

            const queryActiveUsers = query(usersRef, where("active", "==", true))
            const queryDocsActiveUsers = await getDocs(queryActiveUsers);
                //onGetContacts(async (querySnapshot) => {
            
                
                usersContainer.innerHTML = ""
                usersContainer.innerHTML += 
                    `<tr>
                        <th colspan="1" width="200" style="border-width: 1px">Name</th>
                        <th colspan="1" width="189" style="border-width: 1px">Email</th>
                        <th colspan="1" width="100" style="border-width: 1px">Phone</th>
                        <th colspan="1" width="150" style="border-width: 1px">Area</th>
                        <th colspan="1" width="150" style="border-width: 1px">Manage</th>  
                    </tr>`
                    
                    //DB LISTENING
                    //querySnapshot.forEach((doc) => {
                    
                    //MAMARRACHA WAY
                    // const query = await getDocs(collection(db, "contacts"));
                

                    //No listening
                    queryDocsActiveUsers.forEach( (doc) => {

                    usersContainer.innerHTML += 
                    `<tr>
                       <td style="border-width: 1px"> ${doc.data().name}</td> 
                       <td style="border-width: 1px"> ${doc.data().email}</td> 
                       <td style="border-width: 1px"> ${doc.data().phone}</td> 
                       <td style="border-width: 1px"> ${doc.data().area}</td>
                       <td style="border-width: 1px">
                       <button class='editBtn' data-id="${doc.id}" href="#"
                       data-bs-toggle="modal" data-bs-target="#addContModal">Edit</button>
                       <button class='delBtn' data-id="${doc.id}">Delete</button>
                       <button class='deactBtn' data-id="${doc.id}">Deactivate</button></td>
                    </tr>`
                    //No listening
                    });

                    //listening
                    //}
            //})

        }




        if (userRole == "user") {
            
            usersContainer.hidden = false;


            const queryActiveUsers = query(usersRef, where("active", "==", true), where("area", "==", userArea))
            const queryDocsActiveUsers = await getDocs(queryActiveUsers);
                //onGetContacts(async (querySnapshot) => {
            
                
                usersContainer.innerHTML = ""
                usersContainer.innerHTML += 
                    `<tr>
                        <th colspan="1" width="200" style="border-width: 1px">Name</th>
                        <th colspan="1" width="189" style="border-width: 1px">Email</th>
                        <th colspan="1" width="100" style="border-width: 1px">Phone</th>
                        <th colspan="1" width="150" style="border-width: 1px">Area</th>
                    </tr>`
                    
                    //DB LISTENING
                    //querySnapshot.forEach((doc) => {
                        

                    //MAMARRACHA WAY
                    // const query = await getDocs(collection(db, "contacts"));


                    queryDocsActiveUsers.forEach( (doc) => {

                    usersContainer.innerHTML += 
                    `<tr>
                       <td style="border-width: 1px"> ${doc.data().name}</td> 
                       <td style="border-width: 1px"> ${doc.data().email}</td> 
                       <td style="border-width: 1px"> ${doc.data().phone}</td> 
                       <td style="border-width: 1px"> ${doc.data().area}</td>
                    </tr>`
               });

            //})

        }

        // Revisor btns
        const btnsActivate = usersContainer.querySelectorAll('.actBtn')
        const btnsEditRev = usersContainer.querySelectorAll('.editBtn')
        //console.log(btnsActivate)
        //console.log(btnsEditRev)
        //console.log(usersContainer)



        //Admin btns

        const btnsDelete = usersContainer.querySelectorAll('.delBtn')
        const btnsEdit = usersContainer.querySelectorAll('.editBtn')
        const btnsDeactivate = usersContainer.querySelectorAll('.deactBtn')
        
        // console.log(btnsDelete)
        // console.log(btnsEdit)
        // console.log(btnsDeactivate)

        btnsEditRev.forEach((btn) =>{
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

        btnsDelete.forEach(btn =>{
            // btn.addEventListener('click', ({target: {dataset}}) => {
            //     console.log(dataset.id)
            //     // deleteContacts(dataset.id)
            //     // setTimeout(() => {window.location.reload();}, 500);
                
                
            //     //user = getUser(dataset.id)
            //     deleteUser(dataset.id).then(() => {

            //         console.log(`User deleted`)
            //     })
            // })
        })


        btnsDeactivate.forEach((btn) => {
            btn.addEventListener('click', ({target: {dataset}}) =>{
                console.log(dataset.id)
                updateUser(dataset.id, {
                    active: false
                })
                setTimeout(() => {window.location.reload();}, 500);
            })
        })

        btnsActivate.forEach((btn) => {
            btn.addEventListener('click', ({target: {dataset}}) =>{
                console.log(dataset.id)
                updateUser(dataset.id, {
                    active: true
                })
                setTimeout(() => {window.location.reload();}, 500);
            })
        })


        btnsEdit.forEach((btn) =>{
            btn.addEventListener('click', async (e) => {
               const doc = await getUser(e.target.dataset.id)
               //console.log(doc.data())
               const user = doc.data()

               newContactForm['nContact-name'].value = user.name + "oo"
               newContactForm['nContact-phone'].value = user.phone
               newContactForm['nContact-area'].value = user.area
               newContactForm['nContact-email'].value = user.email

               editStatus = true;
               id = doc.id;

               newContactForm['updateFormBtn'].innerText = 'Update'
               
            })
        })

        message.innerHTML = `Bienvenido: ${user.email}`
    } else {
        usersContainer.hidden = true;
        addContactButton.hidden = true;
        loginButton.hidden = false
        signUpButton.hidden = false
        logOutButton.hidden = true
        message.hidden = true
    }
})

