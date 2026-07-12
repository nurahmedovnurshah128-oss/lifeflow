import { 
    auth 
} from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


// Регистрация

const registerForm = document.getElementById("registerForm");

if(registerForm){

registerForm.addEventListener("submit", async (e)=>{

e.preventDefault();


const name = document.getElementById("registerName").value;

const email = document.getElementById("registerEmail").value;

const password = document.getElementById("registerPassword").value;


try{

const user = await createUserWithEmailAndPassword(
auth,
email,
password
);


localStorage.setItem(
"userName",
name
);


alert("Аккаунт создан");


location.reload();


}catch(error){

alert(error.message);

}


});

}



// Вход

const loginForm = document.getElementById("loginForm");


if(loginForm){

loginForm.addEventListener("submit", async(e)=>{

e.preventDefault();


const email =
document.getElementById("loginEmail").value;


const password =
document.getElementById("loginPassword").value;



try{


await signInWithEmailAndPassword(
auth,
email,
password
);


location.reload();


}catch(error){

alert(error.message);

}



});


}




// Google вход

const googleBtn =
document.getElementById("googleLogin");


if(googleBtn){

googleBtn.onclick = async()=>{


try{


const provider =
new GoogleAuthProvider();


await signInWithPopup(
auth,
provider
);


location.reload();


}catch(error){

alert(error.message);

}


};


}





// Проверка пользователя

onAuthStateChanged(auth,(user)=>{


const screen =
document.getElementById("authScreen");


const app =
document.getElementById("app");



if(user){


if(screen)
screen.style.display="none";


if(app)
app.style.display="block";



console.log(
"Пользователь:",
user.email
);



}else{


if(screen)
screen.style.display="flex";


if(app)
app.style.display="none";


console.log(
"Нет пользователя"
);


}



});




// Выход

const logout =
document.getElementById("logoutBtn");


if(logout){

logout.onclick=async()=>{

await signOut(auth);

location.reload();

};


}
