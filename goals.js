/*
==================================
 LifeFlow Ultimate
 Goals Manager v3
==================================
*/


let goals = [];





// ================================
// Загрузка целей
// ================================


async function loadGoals(){


    const data =
    await LifeStorage.get();



    goals =
    data.goals || [];



    renderGoals();


}








// ================================
// Отображение целей
// ================================


function renderGoals(){


    const container =
    document.getElementById(
        "goalsContainer"
    );



    if(!container)
    return;



    container.innerHTML = "";



    if(goals.length===0){


        container.innerHTML = `

        <div class="card">

        <h3>
        Нет целей
        </h3>

        <p>
        Создай свою первую цель
        </p>

        </div>

        `;


        return;

    }





    goals.forEach(goal=>{



        const percent =
        goal.progress || 0;



        const card =
        document.createElement(
            "div"
        );



        card.className =
        "goal-card";



        card.innerHTML = `


        <h3>

        ${goal.title}

        </h3>



        <p>

        ${goal.description || ""}

        </p>



        <p>

        Дедлайн:
        ${goal.deadline || "нет"}

        </p>



        <div class="goal-progress">


        <span style="
        width:${percent}%
        "></span>


        </div>



        <p>

        ${percent}%

        </p>




        <button
        class="primary-btn"
        onclick="increaseGoal('${goal.id}')">

        +10%

        </button>




        <button
        onclick="deleteGoal('${goal.id}')">

        🗑

        </button>



        `;




        container.appendChild(card);



    });


}








// ================================
// Создание цели
// ================================


async function createGoal(){



    const title =
    document.getElementById(
        "goalTitle"
    ).value;



    const description =
    document.getElementById(
        "goalDescription"
    ).value;



    const deadline =
    document.getElementById(
        "goalDeadline"
    ).value;





    if(!title){


        showToast(
            "Введите цель"
        );


        return;


    }






    const goal = {


        id:
        Date.now()
        .toString(),


        title,


        description,


        deadline,


        progress:0,


        created:
        new Date()
        .toISOString()


    };






    goals.push(
        goal
    );





    await LifeStorage.update(

        "goals",

        goals

    );




    renderGoals();



    closeModal();



    showToast(
        "Цель создана"
    );



}








// ================================
// Прогресс цели
// ================================


async function increaseGoal(id){



    const goal =
    goals.find(

        g=>
        g.id===id

    );



    if(goal){



        goal.progress +=10;



        if(goal.progress>100)

        goal.progress=100;



    }






    await LifeStorage.update(

        "goals",

        goals

    );



    renderGoals();



}








// ================================
// Удаление
// ================================


async function deleteGoal(id){



    goals =

    goals.filter(

        g=>
        g.id!==id

    );



    await LifeStorage.update(

        "goals",

        goals

    );



    renderGoals();



}








// ================================
// Запуск
// ================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadGoals();



    const btn =
    document.getElementById(
        "saveGoal"
    );



    if(btn){


        btn.onclick =
        createGoal;


    }


});






window.createGoal =
createGoal;


window.increaseGoal =
increaseGoal;


window.deleteGoal =
deleteGoal;
