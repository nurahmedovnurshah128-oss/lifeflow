/*
==================================
 LifeFlow Ultimate
 Goals Manager
==================================
*/


let goals = [];




// Загрузка целей

function loadGoals(){


    let data = Storage.get();


    goals = data.goals || [];



    renderGoals();


    updateGoalProgress();


}







// Создание цели


function saveGoal(){



    let name = document
    .getElementById("goalName")
    .value.trim();



    let progress = Number(
        document.getElementById("goalProgressInput").value
    );



    if(!name){

        alert("Введите цель");

        return;

    }



    if(progress < 0 || progress > 100){

        progress = 0;

    }




    let goal = {


        id: Date.now(),


        name:name,


        progress:progress,


        created:new Date().toLocaleDateString()


    };



    goals.push(goal);



    Storage.update(

        "goals",

        goals

    );



    document.getElementById("goalName").value="";

    document.getElementById("goalProgressInput").value="";



    renderGoals();


    updateGoalProgress();



}







// Отображение целей


function renderGoals(){



    let box=document.getElementById(

        "goalList"

    );



    if(!box)return;



    box.innerHTML="";



    if(goals.length===0){


        box.innerHTML=

        `

        <div class="empty">

        Нет целей

        </div>

        `;


        return;

    }





    goals.forEach(goal=>{


        let item=document.createElement("div");


        item.className="goalCard";



        item.innerHTML=


        `

        <div>


        <h3>

        ${goal.name}

        </h3>


        <p>

        Прогресс:
        ${goal.progress}%

        </p>



        <div class="progressBar">

        <div class="progress"

        style="width:${goal.progress}%">

        </div>

        </div>


        </div>



        <div>


        <button onclick="increaseGoal(${goal.id})">

        +10%

        </button>


        <button onclick="deleteGoal(${goal.id})">

        🗑

        </button>


        </div>


        `;



        box.appendChild(item);



    });



}







// Увеличение прогресса


function increaseGoal(id){



    goals = goals.map(goal=>{


        if(goal.id===id){


            goal.progress += 10;



            if(goal.progress>100)

                goal.progress=100;


        }



        return goal;


    });



    Storage.update(

        "goals",

        goals

    );



    renderGoals();


    updateGoalProgress();



}







// Удаление цели


function deleteGoal(id){


    goals = goals.filter(

        g=>g.id!==id

    );



    Storage.update(

        "goals",

        goals

    );



    renderGoals();


    updateGoalProgress();


}







// Процент целей на главной


function updateGoalProgress(){



    let box=document.getElementById(

        "goalProgress"

    );



    if(!box)return;



    if(goals.length===0){


        box.innerText="0%";

        return;

    }





    let total=0;



    goals.forEach(goal=>{


        total += goal.progress;


    });



    let result=Math.round(

        total / goals.length

    );



    box.innerText=result+"%";



}







document.addEventListener(

"DOMContentLoaded",

()=>{

    loadGoals();

}

);
