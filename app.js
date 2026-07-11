// =============================
// LifeFlow Ultimate
// Главная логика приложения
// =============================



function openPage(page){


    document
    .querySelectorAll(".page")
    .forEach(
        item=>{
            item.classList.add("hidden");
        }
    );


    document
    .getElementById(page)
    .classList.remove("hidden");


}





// =============================
// Темная тема
// =============================


function toggleTheme(){


    document
    .body
    .classList
    .toggle("dark");


    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );


}




// загрузка темы


if(
localStorage.getItem("theme")
==="true"
){

    document
    .body
    .classList
    .add("dark");

}






// =============================
// Поиск
// =============================


document
.getElementById("search")
.addEventListener(
"input",
function(){


let value =
this.value
.toLowerCase();



document
.querySelectorAll(".card")
.forEach(
card=>{


let text =
card.innerText
.toLowerCase();



if(
text.includes(value)
){

card.style.display="block";

}

else{

card.style.display="none";

}


});


}
);







// =============================
// Запуск
// =============================


document.addEventListener(
"DOMContentLoaded",
()=>{


openPage("home");


// строим график

if(
typeof createChart === "function"
){

createChart();

}



// загружаем данные

if(
typeof renderHabits === "function"
){

renderHabits();

}


if(
typeof renderTasks === "function"
){

renderTasks();

}


if(
typeof renderFinance === "function"
){

renderFinance();

}



}
);