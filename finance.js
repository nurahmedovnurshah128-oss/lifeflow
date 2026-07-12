/*
==================================
 LifeFlow Ultimate
 Finance Manager v3
==================================
*/


let finance = [];




// ================================
// Загрузка финансов
// ================================


async function loadFinance(){


    const data =
    await LifeStorage.get();



    finance =
    data.finance || [];



    renderFinance();


    updateFinance();


}








// ================================
// Отображение операций
// ================================


function renderFinance(){


    const container =
    document.getElementById(
        "financeContainer"
    );



    if(!container)
    return;




    container.innerHTML = "";




    if(finance.length===0){


        container.innerHTML = `

        <div class="card">

        <h3>
        Нет операций
        </h3>

        <p>
        Добавь доход или расход
        </p>

        </div>

        `;


        return;


    }







    finance.forEach(item=>{


        const div =
        document.createElement(
            "div"
        );



        div.className =
        "finance-item";



        div.innerHTML = `


        <div>


        <h3>

        ${item.title}

        </h3>


        <small>

        ${item.date}

        </small>


        </div>




        <div>


        <b class="
        ${item.type}
        ">


        ${item.type==="income"
        ? "+"
        :
        "-"
        }

        ${item.amount}


        </b>



        <button
        onclick="deleteFinance('${item.id}')">

        🗑

        </button>



        </div>


        `;




        container.appendChild(div);



    });



}








// ================================
// Добавление
// ================================


async function createFinance(){



    const title =
    document.getElementById(
        "financeTitle"
    ).value;



    const amount =
    Number(
    document.getElementById(
        "financeAmount"
    ).value
    );



    const type =
    document.getElementById(
        "financeType"
    ).value;






    if(!title || !amount){


        showToast(
            "Заполни данные"
        );


        return;


    }







    const item = {


        id:
        Date.now()
        .toString(),


        title,


        amount,


        type,


        date:
        new Date()
        .toLocaleDateString(
            "ru-RU"
        )


    };







    finance.push(
        item
    );






    await LifeStorage.update(

        "finance",

        finance

    );





    renderFinance();



    updateFinance();



    closeModal();



    showToast(
        "Операция добавлена"
    );



}








// ================================
// Подсчёт денег
// ================================


function updateFinance(){



    let income = 0;


    let expense = 0;




    finance.forEach(item=>{


        if(item.type==="income"){


            income +=
            item.amount;


        }


        else{


            expense +=
            item.amount;


        }


    });





    const balance =
    income - expense;





    const incomeEl =
    document.getElementById(
        "totalIncome"
    );



    const expenseEl =
    document.getElementById(
        "totalExpense"
    );



    const balanceEl =
    document.getElementById(
        "financeBalance"
    );





    if(incomeEl)

    incomeEl.innerText =
    income;



    if(expenseEl)

    expenseEl.innerText =
    expense;



    if(balanceEl)

    balanceEl.innerText =
    balance;



}








// ================================
// Удаление
// ================================


async function deleteFinance(id){



    finance =

    finance.filter(

        item=>
        item.id!==id

    );



    await LifeStorage.update(

        "finance",

        finance

    );



    renderFinance();



    updateFinance();



}








// ================================
// Запуск
// ================================


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadFinance();



    const btn =
    document.getElementById(
        "saveFinance"
    );



    if(btn){


        btn.onclick =
        createFinance;


    }


});







window.createFinance =
createFinance;


window.deleteFinance =
deleteFinance;
