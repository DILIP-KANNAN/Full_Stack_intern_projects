// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

// Your Firebase configuration (replace with your Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyDWE0CF7UADcb4imCrrXWXpLveM2w5VET0",
    authDomain: "agrosphere-groceries.firebaseapp.com",
    projectId: "agrosphere-groceries",
    storageBucket: "agrosphere-groceries.firebasestorage.app",
    messagingSenderId: "634116690147",
    appId: "1:634116690147:web:784b28c668936d1c9575d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

const addSeller = async (seller) => {
  try {
    const docRef = await addDoc(collection(db, "sellers"), seller);
    console.log("Seller added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding seller:", error);
  }
};

const addCropVariety = async (crop) => {
    try {
      const docRef = await addDoc(collection(db, "cropVarieties"), crop);
      console.log("Crop added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding crop variety:", error);
    }
  };

const addCropImage = async (image) => {
    try {
      const docRef = await addDoc(collection(db, "cropImages"), image);
      console.log("Image added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding crop image:", error);
    }
  };