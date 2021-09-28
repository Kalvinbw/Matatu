// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5PK4Amm52LMXUVBLVlKmiO-OLFfr1AXY",
  authDomain: "matatu-202c3.firebaseapp.com",
  projectId: "matatu-202c3",
  storageBucket: "matatu-202c3.appspot.com",
  messagingSenderId: "1069834162609",
  appId: "1:1069834162609:web:ecbb9b5fb96b62f356ed90",
  measurementId: "G-T4P9J0J18Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);