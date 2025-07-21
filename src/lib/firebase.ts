import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCukAjZakg6jHqxuS6ii-_S5FfxLJsCkDk",
  authDomain: "masschatroom01.firebaseapp.com",
  databaseURL: "https://masschatroom01-default-rtdb.firebaseio.com",
  projectId: "masschatroom01",
  storageBucket: "masschatroom01.firebasestorage.app",
  messagingSenderId: "1038183142990",
  appId: "1:1038183142990:web:4d746fca70818c3fbb151f",
  measurementId: "G-N4DFE39B2S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;