import { initializeApp } from 'firebase/app';
import { configFirebaseObj } from './variables.js';

export default function configFirebase(){
    const firebaseConfig = {
    apiKey: configFirebaseObj.apiKey,
    authDomain: configFirebaseObj.authDomain,
    projectId: configFirebaseObj.projectId,
    storageBucket: configFirebaseObj.storageBucket,
    messagingSenderId: configFirebaseObj.messagingSenderId,
    appId: configFirebaseObj.appId
  };
  
  initializeApp(firebaseConfig);
}
