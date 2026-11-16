
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB_dgYNLa7YYNa3LOxm6l36Nve2u8kui4s",
    authDomain: "offbet-4e7a8-1421f.firebaseapp.com",
    projectId: "offbet-4e7a8-1421f",
    storageBucket: "offbet-4e7a8-1421f.firebasestorage.app",
    messagingSenderId: "377718271501",
    appId: "1:377718271501:web:4f2bae9f0e41f6d2366f44",
    measurementId: "G-JW3ZM0RGMB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };