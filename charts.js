/*
==================================
 LifeFlow Ultimate
 Charts Manager
==================================
*/


let mainChart = null;




// Создание графика

function createChart(){


    let canvas = document.getElementById(

        "mainChart"

    );



    if(!canvas)return;



    let data = Storage.get();



    let completedTasks = data.tasks.filter(

        t=>t.completed

    ).length;



    let activeTasks = data.tasks.filter(

        t=>!t.completed

    ).length;



    let habitsDone = data.habits.filter(

        h=>h.completed

    ).length;




    if(mainChart){

        mainChart.destroy();

    }




    mainChart = new Chart(

        canvas,

        {


        type:"doughnut",



        data:{


            labels:[

                "Выполнено задач",

                "Активные задачи",

                "Привычки"

            ],



            datasets:[{


                data:[

                    completedTasks,

                    activeTasks,

                    habitsDone

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



    });



}







// Обновление графика


function updateChart(){


    createChart();


}








document.addEventListener(

"DOMContentLoaded",

()=>{


    setTimeout(()=>{


        createChart();


    },500);



});
