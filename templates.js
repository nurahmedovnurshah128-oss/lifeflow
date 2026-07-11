/*
==================================
 LifeFlow Ultimate
 Templates Manager
==================================
*/


const templates = {


    study: {

        name:"Учёба",

        tasks:[

            "Повторить тему",

            "Сделать домашнее задание",

            "Подготовиться к тесту"

        ]

    },



    work: {

        name:"Работа",

        tasks:[

            "Проверить задачи",

            "Сделать отчёт",

            "Запланировать день"

        ]

    },



    sport: {

        name:"Спорт",

        tasks:[

            "Разминка",

            "Основная тренировка",

            "Растяжка"

        ]

    }


};






// Использовать шаблон


function useTemplate(type){


    let template = templates[type];



    if(!template){

        return;

    }



    let data = Storage.get();



    template.tasks.forEach(task=>{


        data.tasks.push({


            id:Date.now()+Math.random(),


            title:task,


            priority:"medium",


            date:"",


            completed:false,


            created:new Date().toLocaleDateString()


        });



    });



    Storage.update(

        "tasks",

        data.tasks

    );



    alert(

        "Шаблон «"+template.name+"» добавлен"

    );



    if(typeof loadTasks==="function"){

        loadTasks();

    }


}







// Создание своего шаблона


function createTemplate(){


    let name = prompt(

        "Название шаблона"

    );



    let task = prompt(

        "Первая задача"

    );



    if(!name || !task){

        return;

    }



    let data = Storage.get();



    data.templates.push({


        id:Date.now(),


        name:name,


        tasks:[task]


    });



    Storage.update(

        "templates",

        data.templates

    );



    alert(

        "Шаблон создан"

    );


}
