/*
==================================
 LifeFlow Ultimate
 Habits Manager
==================================
*/


let habits = [];



// Загрузка привычек

function loadHabits(){


    let data = Storage.get();


    habits = data.habits || [];


    renderHabits();


    updateHabitProgress();


}






// Создание привычки

function createHabit(){


    let input = document.getElementById("habitName");


    let name = input.value.trim();



    if(!name){

        alert("Введите название привычки");

        return;

    }



    let habit = {


        id: Date.now(),


        name:name,


        days:0,


        completed:false,


        created:new Date().toLocaleDateString()


    };



    habits.push(habit);



    Storage.update(

        "habits",

        habits

    );



    input.value="";



    renderHabits();


    updateHabitProgress();



}







// Отображение привычек


function renderHabits(){



    let box=document.getElementById(

        "habitList"

    );



    if(!box)return;



    box.innerHTML="";




    if(habits.length===0){


        box.innerHTML=

        `

        <div class="empty">

        Нет привычек

        </div>

        `;


        return;

    }






    habits.forEach(habit=>{



        let item=document.createElement("div");


        item.className="habitCard";



        item.innerHTML=



        `

        <div>


        <h3>

        ${habit.name}

        </h3>


        <p>

        Выполнено дней:
        ${habit.days}

        </p>


        </div>



        <div>


        <button onclick="completeHabit(${habit.id})">

        ${habit.completed ? "✔ Сегодня":"+1"}

        </button>



        <button onclick="deleteHabit(${habit.id})">

        🗑

        </button>


        </div>


        `;



        box.appendChild(item);



    });


}







// Выполнить привычку


function completeHabit(id){



    habits = habits.map(h=>{


        if(h.id===id && !h.completed){


            h.days++;

            h.completed=true;


        }


        return h;


    });



    Storage.update(

        "habits",

        habits

    );



    renderHabits();


    updateHabitProgress();



}







// Удаление


function deleteHabit(id){



    habits = habits.filter(

        h=>h.id!==id

    );



    Storage.update(

        "habits",

        habits

    );



    renderHabits();


    updateHabitProgress();


}







// Процент выполнения


function updateHabitProgress(){



    let output=document.getElementById(

        "habitProgress"

    );



    if(!output)return;




    if(habits.length===0){


        output.innerText="0%";

        return;


    }




    let completed = habits.filter(

        h=>h.completed

    ).length;



    let percent = Math.round(

        completed / habits.length * 100

    );



    output.innerText = percent+"%";



}








// Новый день - сброс отметок


function resetDailyHabits(){



    habits = habits.map(h=>{


        h.completed=false;


        return h;


    });



    Storage.update(

        "habits",

        habits

    );



    renderHabits();


}







document.addEventListener(

"DOMContentLoaded",

()=>{

    loadHabits();

}

);
