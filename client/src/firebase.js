// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUnvORIBuDkJIoMsHsQbljOrtRUsQ3GRI",
  authDomain: "webdevskool.firebaseapp.com",
  projectId: "webdevskool",
  storageBucket: "webdevskool.appspot.com",
  messagingSenderId: "692137453099",
  appId: "1:692137453099:web:4e8937d072c8ab79a12c6e",
  measurementId: "G-XDY9LM2VZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);