import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCyllNXNrHrwzdduEhmIVi5UiXGTFdGolI",
  authDomain: "clinica-medica-88ea7.firebaseapp.com",
  projectId: "clinica-medica-88ea7",
  storageBucket: "clinica-medica-88ea7.firebasestorage.app",
  messagingSenderId: "963956027487",
  appId: "1:963956027487:web:fdf2bd27706214ffc2ebea",
  measurementId: "G-2HBE3D9EDV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);