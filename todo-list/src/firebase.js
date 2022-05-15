// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAhiZOCk82AAynabDM5IUjOZRDPaezOwdw",
  authDomain: "todo-list-d0b4e.firebaseapp.com",
  databaseURL: "https://todo-list-d0b4e-default-rtdb.firebaseio.com",
  projectId: "todo-list-d0b4e",
  storageBucket: "todo-list-d0b4e.appspot.com",
  messagingSenderId: "391135693709",
  appId: "1:391135693709:web:dbfa60d329fe201df48bc4",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
