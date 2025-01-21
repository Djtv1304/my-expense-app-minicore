import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYA2RaRQ_1yj6jwwGSCNXjNnJTFqxDTow",
  authDomain: "expense-app-bd96b.firebaseapp.com",
  databaseURL: "https://expense-app-bd96b-default-rtdb.firebaseio.com",
  projectId: "expense-app-bd96b",
  storageBucket: "expense-app-bd96b.firebasestorage.app",
  messagingSenderId: "971612627056",
  appId: "1:971612627056:web:b3f8f8e8c1a428576fd4b5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
