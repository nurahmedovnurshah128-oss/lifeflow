/*
==================================
 LifeFlow Ultimate
 Analytics & Charts v3
==================================
*/


let lifeChart = null;





// ================================
// Загрузка статистики
// ================================


async function createChart(){



    const data =
    await LifeStorage.get();





    const tasks =
    data.tasks || [];





    const completed =

    tasks.filter(

        task =>
        task.completed

    ).length;





    const active =

    tasks.length -
    completed;







    const canvas =
    document.getElementById(
        "lifeChart"
    );



    if(!canvas)
    return;






    if(lifeChart){


        lifeChart.destroy();


    }






    lifeChart =
    new Chart(

        canvas,

        {


        type:"doughnut",



        data:{



            labels:[

            "Выполнено",

            "В процессе"

            ],



            datasets:[{


                data:[

                completed,

                active

                ]



            }]



        },



        options:{


            responsive:true,


            plugins:{


                legend:{


                    position:"bottom"


                }


            }


        }



        }


    );



}








// ================================
// Общая статистика
// ================================


async function loadStatistics(){



    const data =
    await LifeStorage.get();





    const tasks =
    data.tasks || [];



    const habits =
    data.habits || [];



    const goals =
    data.goals || [];






    const total =
    document.getElementById(
        "statTasks"
    );



    const done =
    document.getElementById(
        "statCompleted"
    );



    const habitsEl =
    document.getElementById(
        "statHabits"
    );



    const goalsEl =
    document.getElementById(
        "statGoals"
    );






    if(total)

    total.innerText =
    tasks.length;





    if(done)

    done.innerText =

    tasks.filter(

        t =>
        t.completed

    ).length;





    if(habitsEl)

    habitsEl.innerText =
    habits.length;




    if(goalsEl)

    goalsEl.innerText =
    goals.length;



}









// ================================
// Запуск
// ================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    createChart();


    loadStatistics();


});
