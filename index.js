/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
//delete if this doesn't work!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!rgruhgregfbgfgougoih


/* === Firebase Setup === */
const firebaseConfig = {
    apiKey: "AIzaSyDSUaHbDndWVLrw9ZbVzDm3-FlDHnOsBOU",
    authDomain: "final-project---tech-ticketing.firebaseapp.com",
    projectId: "final-project---tech-ticketing",
    storageBucket: "final-project---tech-ticketing.firebasestorage.app",
    messagingSenderId: "581098690612",
    appId: "1:581098690612:web:dc9d81a8d6422cf3c09261"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
console.log(db)

/* === UI === */
const signOutButtonEl = document.getElementById("sign-out-btn")

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const userProfilePictureEl = document.getElementById("user-profile-picture")
const userGreetingEl = document.getElementById("user-greeting")

const textareaEl = document.getElementById("post-input") // not read
const postButtonEl = document.getElementById("post-btn")

//ticketing categories
const mainCategoryEl = document.getElementById("main-category")
const affectedItemsEl = document.getElementById("affected")
const adminPermsEl = document.getElementById("admin-permissions")
const describeIssueEl = document.getElementById("describe-issue")
const triedEl = document.getElementById("tried")
const roomEl = document.getElementById("room")
const teacherNameEl = document.getElementById("teacher-name")
const dateEl = document.getElementById("date")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)
signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)
signOutButtonEl.addEventListener("click", authSignOut)
postButtonEl.addEventListener("click", postButtonPressed)



/* === Main Code === */

showLoggedOutView()
signedInOrNot()

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    console.log("Sign in with Google")
    
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...

  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode)
    console.log(errorMessage)
    const email = error.customData.email;
    console.log(email)

    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(credential)

  });
}

function authSignInWithEmail() {
    console.log("Sign in with email and password")
    const email = emailInputEl.value 
    const password = passwordInputEl.value

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showLoggedInView()
            showProfilePicture(userProfilePictureEl, auth.currentUser)
            showUserGreeting(userGreetingEl, auth.currentUser)
        })
        .catch((error) => {
            const errorMessage = error.message 
            console.log(errorMessage)
        })
}

function authCreateAccountWithEmail() {
    console.log("Sign up with email and password")
    const email = emailInputEl.value 
    const password = passwordInputEl.value
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showLoggedInView()
        })
        .catch((error) => {
            const errorMessage = error.message 
            console.log(errorMessage)
        })
}

function authSignOut() {
   signOut(auth)
    .then(() => {
        showLoggedOutView()
    })
    .catch((error) => {
        const errorMessage = error.message 
        console.log(errorMessage)
    })
 }

 function signedInOrNot() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            showLoggedInView()
            showProfilePicture(userProfilePictureEl, auth.currentUser)
            showUserGreeting(userGreetingEl, auth.currentUser)
        } else {
            showLoggedOutView()
        }
    })
}

function showProfilePicture(imgElement, user) {
    if (user !== null) {
        if (user.photoURL === null) {
            imgElement.src = "assets/images/defaultPic.jpg"
        } else {
            imgElement.src = user.photoURL
        }
    }
}

function showUserGreeting(element, user) {
    if (user != null) {
        if (user.displayName === null) {
            element.textContent = "Hey friend, how are you?"
        } else {
            element.textContent = "Hello " + user.displayName + "!"
        }
    }
 }

async function addPostToDB(postBody, user) {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            body: postBody,
            uid: user.uid,
            createdAt: serverTimestamp()
        })
        console.log("Document written with ID:", docRef.id);
    } catch(e) {
        console.error("Error Adding Document:", e)
    }
 }
 
/* == Functions - UI Functions == */

function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
 }
 
 
 function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
 }
 
 
 function showView(view) {
    view.style.display = "flex"
 }
 
 
 function hideView(view) {
    view.style.display = "none"
 }

 

 function postButtonPressed() {
    const mainCat = mainCategoryEl.value
    const affected = affectedItemsEl.value
    const adminPerms = adminPermsEl.value
    const issue = describeIssueEl.value
    const tried = triedEl.value
    const room = roomEl.value
    const teacherName = teacherNameEl.value
    const date = date.value
   
    if (mainCat && 
        affected && 
        adminPerms &&
        issue &&
        tried &&
        room &&
        teacherName &&
        date) {

        //console logging
        console.log("issue:" + issue)
        console.log("tried:" + tried)

        //deleting the text from the boxes
        describeIssueEl.value = ""
        triedEl.value = ""
    }
    else {
        alert("ADD SOMETHING TO the boxes :D")
    }
}    
//credit: coursera