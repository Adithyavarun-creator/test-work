// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPR-eYbfVi5a373UzhAaYO427bkIMvvdE",
  authDomain: "blog-angular-udemy-2023.firebaseapp.com",
  projectId: "blog-angular-udemy-2023",
  storageBucket: "blog-angular-udemy-2023.appspot.com",
  messagingSenderId: "979067536826",
  appId: "1:979067536826:web:4f2942bd4db91336fb4983",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
