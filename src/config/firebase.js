// config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDObafx6H51pDuf2pbSh6uwnqzQuAjy_BQ",
    authDomain: "hunch-dating-app.firebaseapp.com",
    projectId: "hunch-dating-app",
    storageBucket: "hunch-dating-app.firebasestorage.app",
    messagingSenderId: "758569439540",
    appId: "1:758569439540:web:9165c22679f4e36d9f1561"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
