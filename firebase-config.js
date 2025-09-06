// Firebase Configuration for MultiBoost-Aventura
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcEfiepMniuaDnI9Ze-h7S-KAwGltJnEA",
  authDomain: "multiboost-aventura.firebaseapp.com",
  projectId: "multiboost-aventura",
  storageBucket: "multiboost-aventura.firebasestorage.app",
  messagingSenderId: "277366007404",
  appId: "1:277366007404:web:68d582b212e76d066d9a49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

console.log('🔥 Firebase inicializado correctamente para MultiBoost-Aventura');
