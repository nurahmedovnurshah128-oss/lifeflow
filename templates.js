/*
==================================
 LifeFlow Ultimate
 Templates Manager v3
==================================
*/


let templates = [];




// ================================
// Загрузка шаблонов
// ================================


async function loadTemplates(){


    const data =
    await LifeStorage.get();



    templates =
    data.templates || [];



    createDefaultTemplates();



    renderTemplates();


}








// ================================
// Стандартные шаблоны
// ================================


async function createDefaultTemplates(){



    if(templates.length>0)
    return;




    templates = [


        {


        id:"morning",


        name:"Утро продуктивности",


        tasks:[

            "Зарядка",

            "Душ",

            "Планирование дня"

        ]


        },



        {


        id:"study",


        name:"Учёба",


        tasks:[

            "Повторить тему",

            "Сделать домашнее задание",

            "Подготовиться к уроку"

        ]


        },



        {


        id:"workout",


        name:"Тренировка",


        tasks:[

            "Разминка",

            "Основная тренировка",

            "Растяжка"

        ]


        }



    ];



    await LifeStorage.update(

        "templates",

        templates

    );


}








// ================================
// Отображение
// ================================


function renderTemplates(){



    const container =
    document.getElementById(
        "templatesContainer"
    );



    if(!container)
    return;




    container.innerHTML="";






    templates.forEach(template=>{



        const card =
        document.createElement(
            "div"
        );



        card.className =
        "template-card";



        card.innerHTML = `


        <h3>

        ${template.name}

        </h3>



        <p>

        ${template.tasks.length}
        задач

        </p>



        <button
        onclick="useTemplate('${template.id}')">

        Использовать

        </button>



        `;




        container.appendChild(card);



    });



}








// ================================
// Использовать шаблон
// ================================


async function useTemplate(id){



    const template =
    templates.find(

        t=>
        t.id===id

    );





    if(!template)
    return;






    const data =
    await LifeStorage.get();




    template.tasks.forEach(task=>{



        data.tasks.push({


            id:
            Date.now()
            +
            Math.random()
            .toString(),


            title:task,


            description:
            "Создано из шаблона",


            priority:
            "medium",


            completed:false,


            created:
            new Date()
            .toISOString()



        });



    });





    await LifeStorage.save(
        data
    );





    if(
    typeof loadTasks==="function"
    ){


        loadTasks();


    }






    showToast(

    "Шаблон добавлен"

    );



}








// ================================
// Создать свой шаблон
// ================================


async function createTemplate(){



    const name =
    document.getElementById(
        "templateName"
    ).value;




    const tasksText =
    document.getElementById(
        "templateTasks"
    ).value;





    if(!name || !tasksText)
    return;






    const item = {


        id:
        Date.now()
        .toString(),


        name,


        tasks:
        tasksText
        .split("\n")
        .filter(Boolean)


    };






    templates.push(
        item
    );





    await LifeStorage.update(

        "templates",

        templates

    );





    renderTemplates();



    showToast(
        "Шаблон создан"
    );



}








// ================================
// Запуск
// ================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadTemplates();



});






window.useTemplate =
useTemplate;


window.createTemplate =
createTemplate;
