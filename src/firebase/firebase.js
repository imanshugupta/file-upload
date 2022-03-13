// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCW1Hs5wMrLiYu2qVPjX88ZXqPHwxCMM8",
  authDomain: "saniya-vbskaq.firebaseapp.com",
  databaseURL: "https://saniya-vbskaq.firebaseio.com",
  projectId: "saniya-vbskaq",
  storageBucket: "saniya-vbskaq.appspot.com",
  messagingSenderId: "1080126752995",
  appId: "1:1080126752995:web:a11fccca92acca39b11dd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
export {
  storage, app as default
}