// Firebase configuration

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";


import { getAuth }
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



const firebaseConfig = {

apiKey: "AIzaSyDA2vJmOfiTdBlaSjo5uVw2ODHD3N0VB-Y",

authDomain: "lifeflow-3f39f.firebaseapp.com",

projectId: "lifeflow-3f39f",

storageBucket: "lifeflow-3f39f.firebasestorage.app",

messagingSenderId: "525748348994",

appId: "1:525748348994:web:4a0ee957514896e6cba5db",

measurementId: "G-XMLT67VBKF"

};



const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);


export const db = getFirestore(app);
