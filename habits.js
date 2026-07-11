// =============================
// LifeFlow Habits
// Модуль привычек
// =============================



function addHabit(){


    let input =
    document.getElementById(
        "habitName"
    );


    let name =
    input.value.trim();



    if(name===""){

        alert(
            "Введите название привычки"
        );

        return;

    }



    let data =
    getData();



    data.habits.push({

        id:Date.now(),

        name:name,

        done:false,

        streak:0,

        progress:0,

        created:
        new Date()
        .toLocaleDateString()

    });



    saveData(data);



    input.value="";


    renderHabits();


}







function toggleHabit(id){


    let data =
    getData();



    let habit =
    data.habits.find(
        h=>h.id===id
    );



    if(habit){


        habit.done =
        !habit.done;



        if(habit.done){

            habit.streak++;

            habit.progress =
            Math.min(
                habit.progress+10,
                100
            );


        }
        else{


            habit.streak =
            Math.max(
                0,
                habit.streak-1
            );


            habit.progress =
            Math.max(
                0,
                habit.progress-10
            );


        }



    }



    saveData(data);


    renderHabits();


}







function deleteHabit(id){


    let data =
    getData();



    data.habits =
    data.habits.filter(
        h=>h.id!==id
    );



    saveData(data);


    renderHabits();



}







function renderHabits(){



    let box =
    document.getElementById(
        "habitList"
    );



    if(!box)
    return;



    box.innerHTML="";



    let data =
    getData();



    data.habits.forEach(
    habit=>{



        let div =
        document.createElement(
            "div"
        );



        div.className =
        "item";



        div.innerHTML = `


        <div>


        <h3>
        🌱 ${habit.name}
        </h3>


        <p>
        🔥 Серия:
        ${habit.streak}
        дней
        </p>


        <div class="progress">

        <div style="
        width:${habit.progress}%
        "></div>

        </div>


        <small>
        ${habit.progress}%
        </small>


        </div>



        <div>


        <button onclick="
        toggleHabit(${habit.id})
        ">

        ${habit.done
        ? "✅"
        : "⬜"}

        </button>



        <button onclick="
        deleteHabit(${habit.id})
        ">

        🗑

        </button>


        </div>


        `;



        box.appendChild(div);



    });



}