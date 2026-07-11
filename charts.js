// =============================
// LifeFlow Charts
// Графики и статистика
// =============================



let mainChart = null;




function createChart(){



    let canvas =
    document.getElementById(
        "mainChart"
    );



    if(!canvas)
    return;



    let data =
    getData();



    let expenses = {};



    data.finance.forEach(
    item=>{


        if(
        item.type==="expense"
        ){


            if(
            !expenses[item.category]
            ){

                expenses[item.category]=0;

            }


            expenses[item.category]
            += item.amount;


        }


    });





    let labels =
    Object.keys(expenses);



    let values =
    Object.values(expenses);





    if(mainChart){

        mainChart.destroy();

    }






    mainChart =
    new Chart(
        canvas,
        {


        type:"doughnut",


        data:{


            labels:
            labels.length
            ? labels
            : [
                "Нет данных"
              ],



            datasets:[{


                data:
                values.length
                ? values
                : [1],



                backgroundColor:[

                    "#ff8fab",
                    "#ffd166",
                    "#a8dadc",
                    "#cdb4db",
                    "#caffbf"

                ]



            }]


        },



        options:{


            responsive:true,


            plugins:{


                legend:{


                    position:
                    "bottom"


                }


            }



        }



    });



}








function updateStatistics(){



    let data =
    getData();



    let totalTasks =
    data.tasks.length;



    let doneTasks =
    data.tasks.filter(
        t=>t.done
    ).length;




    let percent = 0;



    if(totalTasks>0){


        percent =
        Math.round(
            doneTasks /
            totalTasks *
            100
        );


    }



    console.log(
        "Прогресс:",
        percent+"%"
    );



    return percent;



}