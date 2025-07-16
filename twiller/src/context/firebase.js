import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJIDk3m5t_MIcQabXcyUDar_8pQNB27M8",
  authDomain: "twiller-16074.firebaseapp.com",
  projectId: "twiller-16074",
  storageBucket: "twiller-16074.appspot.com",
  messagingSenderId: "1067280755074",
  appId: "1:1067280755074:web:1b7b78cfbb8fd0726ab70d",
  measurementId: "G-TN2H2B1KR5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
