// firebase-config.js
export const firebaseConfig = {
  apiKey: "AIzaSyCeFmBgw6VhgDgI3vKl3zXL-YoZ5Pdc4VY",
  authDomain: "derivpro-sbs.firebaseapp.com",
  databaseURL: "https://derivpro-sbs-default-rtdb.firebaseio.com",
  projectId: "derivpro-sbs",
  storageBucket: "derivpro-sbs.appspot.com",
  messagingSenderId: "707548772783",
  appId: "1:707548772783:web:5294e6201ad77dda20575a",
  measurementId: "G-LML8XKR731"
};
FIREBASE_API_KEY="AIzaSyCeFmBgw6VhgDgI3vKl3zXL-YoZ5Pdc4VY"
FIREBASE_AUTH_DOMAIN="derivpro-sbs.firebaseapp.com"
FIREBASE_DATABASEURL="https://derivpro-sbs-default-rtdb.firebaseio.com"
FIREBASE_PROJECT_ID= "derivpro-sbs"


export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain:  process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL:  process.env.FIREBASE_DATABASEURL,
  projectId:  process.env.FIREBASE_PROJECT_ID,
  storageBucket:  process.env.FIREBASE_STORAGE_ID,
  messagingSenderId:  process.env.FIREBASE_API_KEY,
  appId:  process.env.FIREBASE_API_KEY,
  measurementId:  process.env.FIREBASE_API_KEY,
};
