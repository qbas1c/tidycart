// firebase-config.js
// Fill this in with YOUR Firebase project's web app config (Firebase console →
// Project settings → General → Your apps → SDK setup and configuration → Config).
// See README.md, step "Create your Firebase project" for exact instructions.

export const firebaseConfig = {
  apiKey: "AIzaSyAGEsSEbrtcw2Vc3yL0tp5nqcNNvFKr1aQ",
  authDomain: "tidycart.firebaseapp.com",
  databaseURL: "https://tidycart-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tidycart",
  storageBucket: "tidycart.firebasestorage.app",
  messagingSenderId: "681716462871",
  appId: "1:681716462871:web:36d2abd4afb2470da97352"
};

// A single shared "household" board — everyone using this app instance sees the same list.
// If you ever want separate boards for different households, generate a unique ID per
// household (e.g. a short invite code) and swap this for a value read from user input.
export const HOUSEHOLD_ID = "default";
