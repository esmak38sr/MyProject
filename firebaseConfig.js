import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlRAXCNW35tOh6k-rG8zGYJiiewzS3ot0",
  authDomain: "tarotfaliapp.firebaseapp.com",
  projectId: "tarotfaliapp",
  storageBucket: "tarotfaliapp.appspot.com",
  messagingSenderId: "248803248879",
  appId: "1:248803248879:web:04b6c59730ac6d921f511a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
