/*
==================================
 LifeFlow Ultimate
 Firebase Authentication
==================================
*/


import {
    auth
}
from "./firebase.js";


import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";





// ================================
// Регистрация
// ================================


async function registerUser(){


    const email =
    document.getElementById("registerEmail").value;


    const password =
    document.getElementById("registerPassword").value;



    try {


        const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


        showToast(
            "Аккаунт создан"
        );


        console.log(
            userCredential.user
        );


    }


    catch(error){


        console.log(error);


        showToast(
            error.message
        );


    }


}







// ================================
// Вход
// ================================


async function loginUser(){


    const email =
    document.getElementById("loginEmail").value;



    const password =
    document.getElementById("loginPassword").value;




    try{


        const result =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        showToast(
            "Вход выполнен"
        );


        console.log(
            result.user
        );


    }


    catch(error){


        console.log(error);


        showToast(
            "Ошибка входа"
        );


    }


}








// ================================
// Google Login
// ================================


async function googleLogin(){


    const provider =
    new GoogleAuthProvider();



    try{


        const result =
        await signInWithPopup(
            auth,
            provider
        );



        showToast(
            "Google вход успешен"
        );



        console.log(
            result.user
        );


    }


    catch(error){


        console.log(error);


        showToast(
            error.message
        );


    }


}








// ================================
// Выход
// ================================


async function logoutUser(){


    await signOut(auth);


    showToast(
        "Вы вышли из аккаунта"
    );


}








// ================================
// Проверка пользователя
// ================================


onAuthStateChanged(
    
    auth,

    (user)=>{


        if(user){


            console.log(
                "Пользователь:",
                user.email
            );



            const name =
            document.getElementById(
                "userName"
            );


            const email =
            document.getElementById(
                "userEmail"
            );



            if(name){

                name.innerText =
                user.displayName ||
                "Пользователь";

            }



            if(email){

                email.innerText =
                user.email;

            }


        }


        else{


            console.log(
                "Нет пользователя"
            );


        }


    }

);







// ================================
// Глобальные функции
// ================================


window.registerUser =
registerUser;


window.loginUser =
loginUser;


window.googleLogin =
googleLogin;


window.logoutUser =
logoutUser;
