// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from 'firebase/database';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMjywc2U5s3t3ie12Cw6uh9SUcHdM7_sQ",
  authDomain: "firewatch-server.firebaseapp.com",
  databaseURL: "https://firewatch-server-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "firewatch-server",
  storageBucket: "firewatch-server.appspot.com",
  messagingSenderId: "75589631691",
  appId: "1:75589631691:web:e28f6a106110b0cbde654e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database, ref, set, onValue };
