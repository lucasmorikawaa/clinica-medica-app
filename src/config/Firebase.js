import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyllNXNrHrwzdduEhmIVi5UiXGTFdGolI",
  authDomain: "clinica-medica-88ea7.firebaseapp.com",
  projectId: "clinica-medica-88ea7",
  storageBucket: "clinica-medica-88ea7.firebasestorage.app",
  messagingSenderId: "963956027487",
  appId: "1:963956027487:web:fdf2bd27706214ffc2ebea",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);