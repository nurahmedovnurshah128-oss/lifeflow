/*
==================================
 LifeFlow Ultimate
 Tasks Manager
==================================
*/


let tasks = [];




// Загрузка задач

function loadTasks(){

    let data = Storage.get();

    tasks = data.tasks || [];

    renderTasks();

    updateDashboardTasks();

}





// Создание задачи

function createTask(){


    let title = document.getElementById("taskTitle").value.trim();

    let priority = document.getElementById("taskPriority").value;

    let date = document.getElementById("taskDate").value;



    if(!title){

        alert("Введите название задачи");

        return;

    }



    let task = {


        id: Date.now(),


        title:title,


        priority:priority,


        date:date,


        completed:false,


        created:new Date().toLocaleDateString()


    };



    tasks.push(task);


    Storage.update("tasks",tasks);



    document.getElementById("taskTitle").value="";



    renderTasks();

    updateDashboardTasks();


}







// Вывод задач


function renderTasks(){


    let container=document.getElementById("taskList");


    if(!container) return;



    container.innerHTML="";



    if(tasks.length===0){


        container.innerHTML=

        `

        <div class="empty">

        Нет задач

        </div>

        `;


        return;

    }





    tasks.forEach(task=>{


        let div=document.createElement("div");


        div.className="taskCard";



        if(task.completed){

            div.classList.add("completed");

        }



        div.innerHTML=


        `

        <div class="taskInfo">


        <h3>

        ${task.title}

        </h3>


        <p>

        Приоритет:
        ${getPriority(task.priority)}

        </p>



        <small>

        ${task.date || "Без даты"}

        </small>



        </div>



        <div class="taskActions">


        <button onclick="completeTask(${task.id})">

        ✔

        </button>



        <button onclick="deleteTask(${task.id})">

        🗑

        </button>


        </div>


        `;



        container.appendChild(div);



    });



}







// Завершение задачи


function completeTask(id){



    tasks = tasks.map(task=>{


        if(task.id===id){

            task.completed=!task.completed;

        }


        return task;


    });



    Storage.update("tasks",tasks);



    renderTasks();


    updateDashboardTasks();


}







// Удаление задачи


function deleteTask(id){


    tasks = tasks.filter(

        task=>task.id!==id

    );



    Storage.update("tasks",tasks);



    renderTasks();


    updateDashboardTasks();



}







// Приоритеты


function getPriority(priority){


    if(priority==="high")

        return "🔴 Высокий";


    if(priority==="medium")

        return "🟡 Средний";


    return "🟢 Низкий";


}








// Статистика на главной


function updateDashboardTasks(){



    let counter=document.getElementById(

        "todayTasks"

    );



    if(!counter) return;



    let active = tasks.filter(

        t=>!t.completed

    ).length;



    counter.innerText=active;



}





// Последние задачи


function renderRecentTasks(){



    let box=document.getElementById(

        "recentTasks"

    );



    if(!box)return;



    box.innerHTML="";



    tasks.slice(-5).reverse().forEach(task=>{


        box.innerHTML +=


        `

        <div class="miniTask">

        ${task.completed ? "✔":"○"}

        ${task.title}

        </div>

        `;


    });



}







// Запуск

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadTasks();

}

);
