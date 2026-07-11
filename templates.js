// =============================
// LifeFlow Templates
// Готовые планеры
// =============================



const templates = [



{
    id:1,

    name:"🌱 30 дней привычек",

    category:"Привычки",

    description:
    "Создай полезные привычки и следи за серией дней",

    habits:[

        "Пить воду 💧",

        "Читать 20 минут 📚",

        "Спорт 🏋️",

        "Ранний сон 😴"

    ]

},




{
    id:2,

    name:"💰 Финансовый план",

    category:"Финансы",

    description:
    "Контроль доходов и расходов",

    finance:[

        "Еда 🍔",

        "Транспорт 🚗",

        "Дом 🏠",

        "Развлечения 🎮"

    ]

},




{
    id:3,

    name:"📚 Учеба",

    category:"Обучение",

    description:
    "План изучения нового навыка",

    tasks:[

        "Изучить тему",

        "Посмотреть урок",

        "Сделать практику",

        "Повторить материал"

    ]

},




{
    id:4,

    name:"🏋️ Спорт программа",

    category:"Здоровье",

    description:
    "30 дней тренировок",

    habits:[

        "Кардио",

        "Силовая тренировка",

        "Растяжка",

        "Контроль питания"

    ]

},




{
    id:5,

    name:"🎯 Цель на год",

    category:"Цели",

    description:
    "Большая цель с этапами",

    goals:[

        "Определить цель",

        "Разбить на шаги",

        "Отслеживать прогресс"

    ]

}




];








function loadTemplate(id){



    let template =
    templates.find(
        t=>t.id===id
    );



    if(!template)
    return;




    let data =
    getData();





    if(template.habits){



        template.habits.forEach(
        item=>{


            data.habits.push({

                id:Date.now()
                +
                Math.random(),


                name:item,


                done:false,


                streak:0,


                progress:0


            });



        });


    }





    if(template.tasks){



        template.tasks.forEach(
        item=>{


            data.tasks.push({

                id:Date.now()
                +
                Math.random(),


                title:item,


                priority:"medium",


                done:false


            });


        });



    }






    if(template.goals){



        template.goals.forEach(
        item=>{


            data.goals.push({

                id:Date.now()
                +
                Math.random(),


                name:item,


                progress:0


            });


        });


    }






    saveData(data);



    alert(
        "Шаблон добавлен 🌸"
    );



    renderHabits();

    renderTasks();

}






function showTemplates(){


    let box =
    document.getElementById(
        "templates"
    );



    if(!box)
    return;



    box.innerHTML="";



    templates.forEach(
    template=>{


        let card =
        document.createElement(
            "div"
        );



        card.className =
        "card";



        card.innerHTML = `


        <h3>
        ${template.name}
        </h3>


        <p>
        ${template.description}
        </p>


        <button onclick="
        loadTemplate(${template.id})
        ">

        Использовать

        </button>


        `;



        box.appendChild(card);



    });



}