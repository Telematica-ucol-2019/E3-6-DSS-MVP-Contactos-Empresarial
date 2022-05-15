import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"
//console.log(auth);
const signupForm = document.querySelector('#signup-form')
const auth = getAuth();

//sign up
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const signupEmail = document.querySelector('#signup-email').value
    const signupPassword = document.querySelector('#signup-password').value

        createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
        .then(userCredential => {
            //clear the form
            signupForm.reset()
            
            //hide modal
            $('#signUpModal').modal('hide')
            //signUpModal.hide()
            console.log('sign up AAA')    
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

//logOut

const logout = document.querySelector('#logout')

logout.addEventListener('click', e =>{
    e.preventDefault();
    auth.signOut().then(() =>{
        console.log('señal afuera')
    })
})

//buttons
const loginButton = document.querySelector('#loginButton')
const signUpButton = document.querySelector('#signUpButton')
const logOutButton = document.querySelector('#logout')
const message = document.querySelector('#welcome-message')

auth.onAuthStateChanged(user => {
    if(user){
        loginButton.hidden = true
        signUpButton.hidden = true
        logOutButton.hidden = false
        message.hidden = false
        message.innerHTML = `Bienvenido: ${user.email}`
    } else {
        loginButton.hidden = false
        signUpButton.hidden = false
        logOutButton.hidden = true
        message.hidden = true
    }
})