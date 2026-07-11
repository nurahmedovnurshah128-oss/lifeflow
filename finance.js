// =============================
// LifeFlow Finance
// Модуль финансов
// =============================



function addFinance(){


    let input =
    document.getElementById(
        "moneyValue"
    );


    let amount =
    Number(
        input.value
    );



    if(!amount || amount <= 0){

        alert(
            "Введите сумму"
        );

        return;

    }



    let data =
    getData();



    data.finance.push({

        id: Date.now(),

        amount: amount,

        type:"expense",

        category:"Другое",

        date:
        new Date()
        .toLocaleDateString()

    });



    saveData(data);



    input.value="";


    renderFinance();


}







function addIncome(amount){


    let data =
    getData();



    data.finance.push({

        id:Date.now(),

        amount:Number(amount),

        type:"income",

        category:"Доход",

        date:
        new Date()
        .toLocaleDateString()

    });



    saveData(data);


    renderFinance();


}







function deleteFinance(id){


    let data =
    getData();



    data.finance =
    data.finance.filter(
        item=>item.id!==id
    );



    saveData(data);


    renderFinance();


}







function calculateBalance(){


    let data =
    getData();



    let balance = 0;



    data.finance.forEach(
    item=>{


        if(
        item.type==="income"
        ){

            balance += item.amount;

        }
        else{

            balance -= item.amount;

        }


    });



    return balance;


}







function renderFinance(){


    let box =
    document.getElementById(
        "financeList"
    );



    if(!box)
    return;



    box.innerHTML="";



    let data =
    getData();



    data.finance
    .reverse()
    .forEach(
    item=>{



        let div =
        document.createElement(
            "div"
        );



        div.className =
        "item";



        let sign =
        item.type==="income"
        ? "+"
        : "-";



        div.innerHTML = `


        <div>

        <h3>

        ${item.type==="income"
        ? "💚"
        : "💸"}

        ${sign}
        ${item.amount}
        сом

        </h3>


        <p>

        ${item.category}

        |

        ${item.date}

        </p>


        </div>



        <button onclick="
        deleteFinance(${item.id})
        ">

        🗑

        </button>


        `;



        box.appendChild(div);


    });



    let balance =
    document.getElementById(
        "balance"
    );



    if(balance){


        let value =
        calculateBalance();



        balance.innerHTML =

        "Баланс: "
        +
        value
        +
        " сом";


    }



}