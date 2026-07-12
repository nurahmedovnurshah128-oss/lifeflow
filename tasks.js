/*
==================================
 LifeFlow Ultimate
 Tasks Manager v3
 Firebase Storage
==================================
*/


// ================================
// Переменные
// ================================


let tasks = [];





// ================================
// Загрузка задач
// ================================


async function loadTasks(){


    tasks =
    await LifeStorage.get();



    tasks =
    tasks.tasks || [];



    renderTasks();


    updateTaskStats();


}







// ================================
// Отображение задач
// ================================


function renderTasks(){


    const container =
    document.getElementById(
        "taskContainer"
    );



    if(!container)
    return;



    container.innerHTML = "";



    if(tasks.length === 0){


        container.innerHTML = `

        <div class="card">

        <h3>
        Нет задач
        </h3>

        <p>
        Создай свою первую задачу
        </p>

        </div>

        `;


        return;

    }






    tasks.forEach(task=>{


        const item =
        document.createElement(
            "div"
        );


        item.className =
        "task-item";



        item.innerHTML = `


        <div class="task-left">


        <input 
        class="task-check"
        type="checkbox"
        ${task.completed ? "checked":""}
        onchange="completeTask('${task.id}')">


        <div>


        <div class="task-title">

        ${task.title}

        </div>


        <div class="task-description">

        ${task.description || ""}

        </div>


        </div>


        </div>



        <div>


        <span class="
        priority-${task.priority}
        ">

        ${task.priority}

        </span>



        <button
        onclick="deleteTask('${task.id}')">

        🗑

        </button>


        </div>


        `;



        container.appendChild(item);



    });


}








// ================================
// Создать задачу
// ================================


async function createTask(){



    const title =
    document.getElementById(
        "taskTitle"
    ).value;



    const description =
    document.getElementById(
        "taskDescription"
    ).value;



    const priority =
    document.getElementById(
        "taskPriority"
    ).value;



    const date =
    document.getElementById(
        "taskDate"
    ).value;





    if(!title){


        showToast(
            "Введите название задачи"
        );


        return;


    }







    const task = {


        id:
        Date.now().toString(),


        title,


        description,


        priority,


        date,


        completed:false,


        created:
        new Date().toISOString()


    };





    tasks.push(task);




    await LifeStorage.update(

        "tasks",

        tasks

    );





    renderTasks();



    updateTaskStats();




    closeModal();



    showToast(

        "Задача создана"

    );



}








// ================================
// Выполнить задачу
// ================================


async function completeTask(id){



    const task =
    tasks.find(

        t =>
        t.id === id

    );



    if(task){


        task.completed =
        !task.completed;



    }




    await LifeStorage.update(

        "tasks",

        tasks

    );



    renderTasks();



    updateTaskStats();



}








// ================================
// Удаление
// ================================


async function deleteTask(id){



    tasks =

    tasks.filter(

        t =>
        t.id !== id

    );



    await LifeStorage.update(

        "tasks",

        tasks

    );



    renderTasks();


    updateTaskStats();



}








// ================================
// Статистика
// ================================


function updateTaskStats(){



    const total =
    document.getElementById(
        "totalTasks"
    );



    const complete =
    document.getElementById(
        "completedTasks"
    );



    if(total)

    total.innerText =
    tasks.length;



    if(complete)

    complete.innerText =

    tasks.filter(

        t =>
        t.completed

    ).length;



}








// ================================
// Запуск
// ================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadTasks();


}

);





window.createTask =
createTask;


window.completeTask =
completeTask;


window.deleteTask =
deleteTask;
