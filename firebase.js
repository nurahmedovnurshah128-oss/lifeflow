/*
==================================
 LifeFlow Ultimate
 Firebase Configuration
==================================
*/


// Firebase SDK
import { initializeApp } 
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";


import { 
getAuth 
}
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


import {
getFirestore
}
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



// =================================
// ВАЖНО
// СЮДА ВСТАВИШЬ СВОЙ FIREBASE CONFIG
// =================================


const firebaseConfig = {

    apiKey: "ТВОЙ_API_KEY",

    authDomain: "lifeflow-3f39f.firebaseapp.com",

    projectId: "lifeflow-3f39f",

    storageBucket: "lifeflow-3f39f.firebasestorage.app",

    messagingSenderId: "525748348994",

    appId: "1:525748348994:web:4a0ee957514896e6cba5db",

    measurementId: "G-XMLT67VBKF"

};




// Инициализация

const app = initializeApp(firebaseConfig);




// Авторизация

const auth = getAuth(app);




// База данных

const db = getFirestore(app);




// Экспорт

export {
    app,
    auth,
    db
};
