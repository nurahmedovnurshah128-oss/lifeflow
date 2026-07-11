/*
==================================
 LifeFlow Ultimate
 Finance Manager
==================================
*/


let finances = [];




// Загрузка финансов

function loadFinance(){


    let data = Storage.get();


    finances = data.finance || [];


    renderFinance();


    updateFinanceStats();


}






// Добавление операции

function saveFinance(){


    let title = document.getElementById("financeTitle").value.trim();

    let amount = Number(
        document.getElementById("financeAmount").value
    );

    let type = document.getElementById("financeType").value;



    if(!title || !amount){

        alert("Заполните все поля");

        return;

    }



    let item = {


        id: Date.now(),


        title:title,


        amount:amount,


        type:type,


        date:new Date().toLocaleDateString()


    };



    finances.push(item);



    Storage.update(

        "finance",

        finances

    );



    document.getElementById("financeTitle").value="";

    document.getElementById("financeAmount").value="";



    renderFinance();


    updateFinanceStats();



}







// Отображение операций


function renderFinance(){


    let box=document.getElementById(

        "financeList"

    );



    if(!box)return;



    box.innerHTML="";



    if(finances.length===0){


        box.innerHTML=

        `

        <div class="empty">

        Нет операций

        </div>

        `;


        return;

    }





    finances
    .slice()
    .reverse()
    .forEach(item=>{


        let div=document.createElement("div");


        div.className="financeItem";



        div.innerHTML=


        `

        <div>


        <h3>

        ${item.title}

        </h3>


        <small>

        ${item.date}

        </small>


        </div>



        <div>


        <b>

        ${
            item.type==="income"
            ? "+"
            : "-"
        }

        ${item.amount} сом

        </b>


        <button onclick="deleteFinance(${item.id})">

        🗑

        </button>


        </div>


        `;



        box.appendChild(div);



    });



}








// Удаление операции


function deleteFinance(id){


    finances = finances.filter(

        f=>f.id!==id

    );



    Storage.update(

        "finance",

        finances

    );



    renderFinance();


    updateFinanceStats();


}








// Статистика


function updateFinanceStats(){


    let income = 0;

    let expense = 0;



    finances.forEach(item=>{


        if(item.type==="income"){

            income += item.amount;

        }

        else{

            expense += item.amount;

        }


    });




    let balance = income-expense;



    let incomeBox=document.getElementById("income");

    let expenseBox=document.getElementById("expense");

    let balanceBox=document.getElementById("totalBalance");

    let card=document.getElementById("balanceCard");



    if(incomeBox)

        incomeBox.innerText =
        income+" сом";



    if(expenseBox)

        expenseBox.innerText =
        expense+" сом";



    if(balanceBox)

        balanceBox.innerText =
        balance+" сом";



    if(card)

        card.innerText =
        balance+" сом";


}






// Быстрое добавление

function addFinance(){

    document
    .getElementById("financeTitle")
    .focus();

}






document.addEventListener(

"DOMContentLoaded",

()=>{

    loadFinance();

}

);
