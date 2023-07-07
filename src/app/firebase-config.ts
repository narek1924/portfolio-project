import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDf7qaMQIs2zUfhCCkUVsnVWwcAkBPglJc',
  authDomain: 'portfolio-project-12.firebaseapp.com',
  projectId: 'portfolio-project-12',
  storageBucket: 'portfolio-project-12.appspot.com',
  messagingSenderId: '819795771909',
  appId: '1:819795771909:web:401f2df45c8462b8ab126c',
  measurementId: 'G-DY7MTCHT6C',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const storageRef = ref(storage);
export const imagesRef = ref(storage, 'images');
