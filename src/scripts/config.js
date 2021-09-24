import { initializeApp } from 'firebase/app';

export default function configFirebase(){
    const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId:  process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId:  process.env.MESSAGING_SENDER_ID,
    appId: process.env.APPID
  };
  
  initializeApp(firebaseConfig);
}
