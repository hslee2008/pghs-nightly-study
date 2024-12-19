import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getPerformance } from "firebase/performance";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCUdFnPtX-8oWFua2ItdEjnZdIv7PYWxnA",
  authDomain: "pghs-nightly-study.firebaseapp.com",
  databaseURL:
    "https://pghs-nightly-study-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pghs-nightly-study",
  storageBucket: "pghs-nightly-study.firebasestorage.app",
  messagingSenderId: "895963056233",
  appId: "1:895963056233:web:7356d74a9244de5a387af8",
  measurementId: "G-JZBZFSN12W",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getDatabase(app);
const storage = getStorage(app);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:transition:finish", () => {
    getPerformance(app);
    getAnalytics(app);
  });

  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);

  nuxtApp.vueApp.provide("db", db);
  nuxtApp.provide("db", db);

  nuxtApp.vueApp.provide("storage", storage);
  nuxtApp.provide("storage", storage);

  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.provide("firestore", firestore);
});

export { db };
