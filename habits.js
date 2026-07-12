/*
==================================
 LifeFlow Ultimate
 Habits Manager v3
==================================
*/


let habits = [];




// ================================
// Загрузка привычек
// ================================


async function loadHabits(){


    const data =
    await LifeStorage.get();



    habits =
    data.habits || [];



    renderHabits();


}








// ================================
// Отображение
// ================================


function renderHabits(){


    const container =
    document.getElementById(
        "habitsContainer"
    );



    if(!container)
    return;



    container.innerHTML = "";




    if(habits.length===0){


        container.innerHTML = `

        <div class="card">

        <h3>
        Нет привычек
        </h3>

        <p>
        Добавь новую привычку
        </p>

        </div>

        `;


        return;


    }






    habits.forEach(habit=>{


        let percent =
        Math.round(

            (
            habit.progress /
            habit.days
            )
            *
            100

        );



        if(percent>100)
        percent=100;





        const card =
        document.createElement(
            "div"
        );



        card.className =
        "habit-card";



        card.innerHTML = `


        <h3>

        ${habit.name}

        </h3>



        <p>

        ${habit.progress}
        /
        ${habit.days}
        дней

        </p>




        <div class="habit-progress">


        <div style="
        width:${percent}%
        "></div>


        </div>




        <button
        class="primary-btn"
        onclick="increaseHabit('${habit.id}')">

        + Выполнить

        </button>



        <button
        onclick="deleteHabit('${habit.id}')">

        🗑

        </button>


        `;




        container.appendChild(card);



    });


}








// ================================
// Создание
// ================================


async function createHabit(){



    const name =
    document.getElementById(
        "habitName"
    ).value;



    const days =
    Number(
    document.getElementById(
        "habitDays"
    ).value
    );





    if(!name || !days){


        showToast(
            "Заполни данные"
        );


        return;


    }





    const habit = {


        id:
        Date.now()
        .toString(),


        name,


        days,


        progress:0,


        created:
        new Date()
        .toISOString()


    };




    habits.push(
        habit
    );




    await LifeStorage.update(

        "habits",

        habits

    );




    renderHabits();



    closeModal();



    showToast(
        "Привычка добавлена"
    );


}








// ================================
// Выполнение дня
// ================================


async function increaseHabit(id){



    const habit =
    habits.find(

        h=>
        h.id===id

    );



    if(habit){


        if(habit.progress <
        habit.days){


            habit.progress++;


        }


    }



    await LifeStorage.update(

        "habits",

        habits

    );



    renderHabits();


}








// ================================
// Удаление
// ================================


async function deleteHabit(id){



    habits =

    habits.filter(

        h=>
        h.id!==id

    );



    await LifeStorage.update(

        "habits",

        habits

    );



    renderHabits();


}








// ================================
// Запуск
// ================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadHabits();



    const btn =
    document.getElementById(
        "saveHabit"
    );



    if(btn){


        btn.onclick =
        createHabit;


    }


});





window.createHabit =
createHabit;


window.increaseHabit =
increaseHabit;


window.deleteHabit =
deleteHabit;
