import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGSdyOdCsr2RJ0b28bpphJWw_7HSs2yQg",
  authDomain: "sambucketlist-45a80.firebaseapp.com",
  databaseURL: "https://sambucketlist-45a80-default-rtdb.firebaseio.com",
  projectId: "sambucketlist-45a80",
  storageBucket: "sambucketlist-45a80.firebasestorage.app",
  messagingSenderId: "612403534850",
  appId: "1:612403534850:web:7234e5e3ae9f8cb0f25b1b",
  measurementId: "G-LFMLY46V2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firebase Auth State Listener (to monitor if the user is logged in)
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in:", user);
    // You can call the function to fetch bucket lists or handle UI updates here
  } else {
    console.log("No user is logged in.");
    // Handle UI changes to indicate the user is not logged in, if needed
  }
});

// Register Function
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User registered:", user);
    alert("Registration successful!");
  } catch (error) {
    console.error("Error during registration:", error);
    alert(error.message);
  }
}

// Login Function
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in:", user);
    alert("Login successful!");
    window.location.href = "main.html";
  } catch (error) {
    console.error("Error during login:", error);
    alert(error.message);
  }
}

// Add Bucket List
export async function addBucketList(title, description) {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You need to log in first!");
        return;
      }
  
      // Reference to the authenticated user's bucketLists collection
      const bucketRef = collection(db, "users", user.uid, "bucketLists");
      await addDoc(bucketRef, {
        title,
        description,
        email: user.email, // Store the user's email for reference
        createdAt: new Date(), // Optional: Add a timestamp
      });
  
      alert("Bucket list item added successfully!");
    } catch (error) {
      console.error("Error adding bucket list item:", error);
      alert("Failed to add bucket list item. " + error.message);
    }
  }

// Fetch Bucket Lists
export async function fetchBucketLists(displayCallback) {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          alert("You need to log in first!");
          return;
        }
  
        // Reference to the user's bucketLists subcollection
        const bucketRef = collection(db, "users", user.uid, "bucketLists");
        const querySnapshot = await getDocs(bucketRef);
  
        const bucketLists = [];
        querySnapshot.forEach((doc) => {
          bucketLists.push({ id: doc.id, ...doc.data() });
        });
        console.log("Auth currentUser:", auth.currentUser);
        console.log("User logged in:", user);
        
        displayCallback(bucketLists);
      });
    } catch (error) {
      console.error("Error fetching bucket lists:", error);
      alert("Failed to fetch bucket lists. " + error.message);
    }
  }
// Logout Function
export function logoutUser() {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
}

// Function to check if the user is logged in
export function checkAuthState() {
  return new Promise((resolve, reject) => {
    // Use onAuthStateChanged to check for the user state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();  // Unsubscribe after getting the user state
      resolve(user);  // Resolve with the user object (if logged in) or null (if not)
    }, reject);
  });
}
