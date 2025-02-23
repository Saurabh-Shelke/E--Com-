// firebaseconfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAU23vy0LfrdnQPHdpkjIf0wGKaTac2pCM",
  authDomain: "ymlmart-aa864.firebaseapp.com",
  projectId: "ymlmart-aa864",
  storageBucket: "ymlmart-aa864.appspot.com",
  messagingSenderId: "186532123927",
  appId: "1:186532123927:web:44c64fa809c49e104c5352",
  measurementId: "G-PX73E70EV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
