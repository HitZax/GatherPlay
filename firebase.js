// Import Firebase scripts in your HTML before this file

// Your Firebase configuration
const firebaseConfig = {
  databaseURL: "https://gatherplay-zax-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();