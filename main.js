import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"
import { getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"
import {newUser, newContact, db, doc, collection, getDocFromCache, getDoc, deleteContacts} from './firebase.js'
//console.log(auth);
const signupForm = document.querySelector('#signup-form')

const auth = getAuth();
const contactsContainer = document.getElementById('table')

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

const addNewContact = document.querySelector('#nContact-form')
// addContacts
addNewContact.addEventListener('submit', e =>{
    e.preventDefault();
    const addContName = document.querySelector('#nContact-name').value
    const addContPhone = document.querySelector('#nContact-phone').value
    const addContArea = document.querySelector('#nContact-area').value
    const addContEmail = document.querySelector('#nContact-email').value

    newContact(addContArea, addContEmail, addContName ,addContPhone)
    addNewContact.reset()
    //hide modal
        $('#addContModal').modal('hide')
        window.location.reload();
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
        const usersRef = collection(db, "users")
        // console.log(user.uid);
        // console.log(doc(db, "users", user.uid));
        // console.log(doc(usersRef, user.uid));
        
        
            
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)
            const userName = docSnap.data().name
            const userRole = docSnap.data().role
            
            // console.log("Document data: ");
            // console.log(docSnap.data());
            //console.log("User name: " + userName);

        console.log(userRole)

        if (userRole == "admin") {
            document.getElementById('table').hidden = false;

            const query = await getDocs(collection(db, "users"));
            query.forEach( (doc) => {
                 console.log(doc.id, " => ", doc.data());
                 // message.innerHTML = (`User: ${doc.id} => ${doc.data().role}`)
                 document.getElementById('table').innerHTML += 
               
                 `<tr>
                    <td style="border-width: 1px"> ${doc.data().name}</td> 
                    <td style="border-width: 1px"> ${doc.data().email}</td> 
                    <td style="border-width: 1px"> ${doc.data().phone}</td> 
                    <td style="border-width: 1px"> ${doc.data().role}</td> 
                    <td style="border-width: 1px"> ${doc.data().area}</td>
                    <td style="border-width: 1px">
                    <button class='editBtn' data-id="${doc.id}">Edit</button>
                    <button class='delBtn' data-id="${doc.id}">Delete</button></td>
                 </tr>`
            });
        }

        const btnsDelete = contactsContainer.querySelectorAll('.delBtn')
        const btnsEdit = contactsContainer.querySelectorAll('.editBtn')
        console.log(btnsDelete)

        btnsDelete.forEach(btn =>{
            btn.addEventListener('click', ({target: {dataset}}) => {
                // console.log(dataset.id)
                deleteContacts(dataset.id)
                window.location.reload();
            })
        })

        btnsEdit.forEach(btn =>{
            btn.addEventListener('click', ({target: {dataset}}) => {
                console.log(dataset.id)
            })
        })
        
        
        // console.log(usersRef);


        message.innerHTML = `Bienvenido: ${user.email}`
    } else {
        document.getElementById('table').hidden = true;
        loginButton.hidden = false
        signUpButton.hidden = false
        logOutButton.hidden = true
        message.hidden = true
    }
})

