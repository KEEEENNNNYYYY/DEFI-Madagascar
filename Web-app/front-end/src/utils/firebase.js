import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFtrs9CFRyzwIgRIwLv0cVC_RhDPUrLvQ",
  authDomain: "defi-madagascar.firebaseapp.com",
  projectId: "defi-madagascar",
  storageBucket: "defi-madagascar.firebasestorage.app",
  messagingSenderId: "99847899508",
  appId: "1:99847899508:web:99a1c89ef6e7894d410421",
  measurementId: "G-GPG1BGTEZ2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };