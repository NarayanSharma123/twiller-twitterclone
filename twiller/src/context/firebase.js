import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBJIDk3m5t_MIcQabXcyUDar_8pQNB27M8",
  authDomain: "twiller-16074.firebaseapp.com",
  projectId: "twiller-16074",
  storageBucket: "twiller-16074.firebasestorage.app",
  messagingSenderId: "58545193081",
  appId: "1:58545193081:web:850e8da72050329c7294a8",
  measurementId: "G-0MPZYTL8XV",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
const messaging = getMessaging(app);

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey:
      "BFbEwB8sPCV5vCSb4jH9mWEDx4KgAs3eGVIanKp5uCgg96TNvFyS7hrT2iDDxNgxS5y1x4fDi-9UA2A2R6_q2E0",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("Token client:", currentToken);
      } else {
        console.log("No registration token exists");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("onMessage payload: ", payload);
      resolve(payload);
    });
  });
};

export default app;
