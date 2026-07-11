// =============================
// LifeFlow Tasks
// Модуль задач
// =============================



function addTask(){


    let input =
    document.getElementById(
        "taskName"
    );


    let name =
    input.value.trim();



    if(name===""){

        alert(
            "Введите задачу"
        );

        return;

    }



    let data =
    getData();



    data.tasks.push({

        id: Date.now(),

        title:name,

        priority:"medium",

        done:false,

        date:
        new Date()
        .toLocaleDateString()

    });



    saveData(data);



    input.value="";


    renderTasks();


}







function toggleTask(id){


    let data =
    getData();



    let task =
    data.tasks.find(
        t=>t.id===id
    );



    if(task){

        task.done =
        !task.done;

    }



    saveData(data);


    renderTasks();



}







function deleteTask(id){


    let data =
    getData();



    data.tasks =
    data.tasks.filter(
        t=>t.id!==id
    );



    saveData(data);


    renderTasks();


}







function changePriority(
id,
priority
){


    let data =
    getData();



    let task =
    data.tasks.find(
        t=>t.id===id
    );



    if(task){

        task.priority =
        priority;

    }



    saveData(data);


    renderTasks();


}







function renderTasks(){



    let box =
    document.getElementById(
        "taskList"
    );



    if(!box)
    return;



    box.innerHTML="";



    let data =
    getData();



    data.tasks
    .sort(
    (a,b)=>{

        if(a.done===b.done)
        return 0;


        return a.done ? 1 : -1;

    })
    .forEach(
    task=>{



        let color =
        "#ffd166";


        if(
        task.priority==="high"
        ){

            color="#ff8fab";

        }



        if(
        task.priority==="low"
        ){

            color="#a8dadc";

        }




        let div =
        document.createElement(
            "div"
        );



        div.className =
        "item";



        if(task.done){

            div.classList.add(
                "done"
            );

        }



        div.innerHTML = `


        <div>


        <h3>
        ${task.done
        ? "✅"
        : "⬜"}

        ${task.title}

        </h3>



        <span style="
        background:${color};
        padding:5px 12px;
        border-radius:15px;
        ">

        ${task.priority}

        </span>



        </div>



        <div>


        <select onchange="
        changePriority(
        ${task.id},
        this.value
        )">

        <option>
        medium
        </option>


        <option>
        high
        </option>


        <option>
        low
        </option>


        </select>



        <button onclick="
        toggleTask(${task.id})
        ">

        ✔

        </button>



        <button onclick="
        deleteTask(${task.id})
        ">

        🗑

        </button>


        </div>


        `;



        box.appendChild(div);



    });



}