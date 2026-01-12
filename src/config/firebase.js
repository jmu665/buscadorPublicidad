import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA01gWKQTG28qCL8PKZcyv7_XOULXQnro4",
    authDomain: "inventarioapp360.firebaseapp.com",
    projectId: "inventarioapp360",
    storageBucket: "inventarioapp360.firebasestorage.app",
    messagingSenderId: "941685949326",
    appId: "1:941685949326:web:ae0424f5fc4547fa5d1adf",
    measurementId: "G-VKH87PNXTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export default app;
