/*
==================================
 LifeFlow Ultimate
 Main Application
==================================
*/


// ===============================
// Переключение страниц
// ===============================


function openPage(page){



    let pages=document.querySelectorAll(

        ".page"

    );



    pages.forEach(p=>{


        p.classList.add("hidden");


    });




    let current=document.getElementById(page);



    if(current){


        current.classList.remove("hidden");


    }






    let buttons=document.querySelectorAll(

        ".menuButton"

    );



    buttons.forEach(btn=>{


        btn.classList.remove("active");


    });




    event?.currentTarget?.classList.add(

        "active"

    );




    if(page==="dashboard"){


        updateDashboard();


    }



}







// ===============================
// Тема
// ===============================


function toggleTheme(){



    document.body.classList.toggle(

        "dark"

    );



    let data=Storage.get();



    data.settings.theme =

    document.body.classList.contains("dark")

    ? "dark"

    : "light";



    Storage.save(data);



}







// ===============================
// Загрузка темы
// ===============================


function loadTheme(){



    let data=Storage.get();



    if(

        data.settings.theme==="dark"

    ){


        document.body.classList.add(

            "dark"

        );


    }



}







// ===============================
// Поиск
// ===============================


function searchContent(){



    let value=document

    .getElementById("search")

    .value

    .toLowerCase();



    let tasks=document.querySelectorAll(

        ".taskCard"

    );



    tasks.forEach(task=>{


        task.style.display =

        task.innerText

        .toLowerCase()

        .includes(value)

        ? "flex"

        : "none";


    });



}







// ===============================
// Dashboard
// ===============================


function updateDashboard(){



    if(typeof updateDashboardTasks==="function")

        updateDashboardTasks();



    if(typeof updateHabitProgress==="function")

        updateHabitProgress();



    if(typeof updateFinanceStats==="function")

        updateFinanceStats();



    if(typeof updateGoalProgress==="function")

        updateGoalProgress();



    if(typeof renderRecentTasks==="function")

        renderRecentTasks();



    if(typeof updateChart==="function")

        updateChart();



}







// ===============================
// Приветствие
// ===============================


function setGreeting(){



    let hour=new Date().getHours();



    let text="Добро пожаловать 👋";



    if(hour<12)

        text="Доброе утро ☀️";

    else if(hour<18)

        text="Добрый день 🌤";

    else

        text="Добрый вечер 🌙";




    let box=document.getElementById(

        "helloText"

    );



    if(box)

        box.innerText=text;



}







// ===============================
// Запуск приложения
// ===============================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadTheme();



    setGreeting();



    updateDashboard();



    let search=document.getElementById(

        "search"

    );



    if(search){


        search.addEventListener(

            "input",

            searchContent

        );


    }



});
