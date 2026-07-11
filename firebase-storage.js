// firebase-storage.js
// Real storage backend for TidyCart once it's running as a standalone app (outside Claude.ai).
// It implements the SAME interface the app already calls — window.storage.get/set/delete/list —
// so none of the app logic in index.html has to change. It's just swapping what's underneath.
//
// "shared" data (shared === true) is what makes the grocery list sync across every device in
// your household — it's stored under a single shared path everyone reads/writes.
// "personal" data (shared === false) is namespaced per anonymous device/user, in case you ever
// add features that shouldn't be shared (not currently used by TidyCart, but supported).

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, get as dbGet, set as dbSet, remove as dbRemove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, HOUSEHOLD_ID } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let uid = null;
const authReady = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    if (user) { uid = user.uid; resolve(uid); }
  });
  signInAnonymously(auth).catch((err) => {
    console.error("TidyCart: anonymous sign-in failed — check that Anonymous auth is enabled in your Firebase console.", err);
    resolve(null);
  });
});

function sanitizeKey(key) {
  // Realtime Database paths can't contain . # $ [ ] /
  return String(key).replace(/[.#$\[\]/]/g, "_");
}

function pathFor(key, shared) {
  const safeKey = sanitizeKey(key);
  return shared ? `households/${HOUSEHOLD_ID}/${safeKey}` : `users/${uid}/${safeKey}`;
}

window.storage = {
  async get(key, shared) {
    if (!shared) await authReady;
    try {
      const snap = await dbGet(ref(db, pathFor(key, shared)));
      if (!snap.exists()) return null;
      return { key, value: snap.val(), shared: !!shared };
    } catch (err) {
      console.error("TidyCart storage.get failed:", err);
      throw err;
    }
  },
  async set(key, value, shared) {
    if (!shared) await authReady;
    await dbSet(ref(db, pathFor(key, shared)), value);
    return { key, value, shared: !!shared };
  },
  async delete(key, shared) {
    if (!shared) await authReady;
    await dbRemove(ref(db, pathFor(key, shared)));
    return { key, deleted: true, shared: !!shared };
  },
  async list(prefix, shared) {
    // Not used by TidyCart today (each feature has a fixed key), included for completeness/future use.
    return { keys: [], prefix, shared: !!shared };
  }
};

window.dispatchEvent(new Event("storage-ready"));
