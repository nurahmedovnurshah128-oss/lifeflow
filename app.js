/*
==================================
 LifeFlow Ultimate
 Application Core v3
==================================
*/


// ================================
// Переключение страниц
// ================================


function openPage(pageId){


    document
    .querySelectorAll(".page")
    .forEach(page=>{


        page.classList.remove(
            "active"
        );


    });



    const page =
    document.getElementById(
        pageId
    );



    if(page){


        page.classList.add(
            "active"
        );


    }




    document
    .querySelectorAll(".menu")
    .forEach(btn=>{


        btn.classList.remove(
            "active"
        );


    });



    const activeButton =
    document.querySelector(
        `[data-page="${pageId}"]`
    );



    if(activeButton){


        activeButton.classList.add(
            "active"
        );


    }


}








// ================================
// Меню
// ================================


document.addEventListener(

"DOMContentLoaded",

()=>{



    document
    .querySelectorAll(".menu")
    .forEach(button=>{


        button.addEventListener(

        "click",

        ()=>{


            const page =
            button.dataset.page;


            openPage(page);


        }


        );


    });


});








// ================================
// Модальные окна
// ================================


function openModal(id){


    const modal =
    document.getElementById(
        id
    );



    if(modal){


        modal.classList.add(
            "active"
        );


    }


}






function closeModal(){


    document
    .querySelectorAll(".modal")
    .forEach(modal=>{


        modal.classList.remove(
            "active"
        );


    });


}








document.addEventListener(

"click",

(e)=>{



    if(
    e.target.classList.contains(
        "close-modal"
    )
    ){


        closeModal();


    }


});








// ================================
// Кнопки открытия
// ================================


document.addEventListener(

"DOMContentLoaded",

()=>{



const addTask =
document.getElementById(
"addTaskOpen"
);



if(addTask){


addTask.onclick =
()=>openModal(
"taskModal"
);


}





const addHabit =
document.getElementById(
"addHabit"
);



if(addHabit){


addHabit.onclick =
()=>openModal(
"habitModal"
);


}





const addGoal =
document.getElementById(
"addGoal"
);



if(addGoal){


addGoal.onclick =
()=>openModal(
"goalModal"
);


}





const addFinance =
document.getElementById(
"addFinance"
);



if(addFinance){


addFinance.onclick =
()=>openModal(
"financeModal"
);


}



});









// ================================
// Тема
// ================================


function loadTheme(){



const data =
localStorage.getItem(
"lifeflow_cache"
);



if(!data)
return;



const settings =
JSON.parse(data)
.settings;



if(
settings &&
settings.theme === "light"
){


document.body.classList.add(
"light"
);


}



}





function toggleTheme(){


document.body
.classList.toggle(
"light"
);



const light =
document.body
.classList.contains(
"light"
);



let data =
JSON.parse(

localStorage.getItem(
"lifeflow_cache"
)

)
|| {};



data.settings =
data.settings || {};



data.settings.theme =
light ?
"light":
"dark";



localStorage.setItem(

"lifeflow_cache",

JSON.stringify(data)

);


}








document.addEventListener(

"DOMContentLoaded",

()=>{


loadTheme();



const theme =
document.getElementById(
"themeToggle"
);



if(theme){


theme.onclick =
toggleTheme;


}



});









// ================================
// Дата
// ================================


function updateDate(){


const el =
document.getElementById(
"currentDate"
);



if(el){


el.innerText =
new Date()
.toLocaleDateString(
"ru-RU",
{

day:"numeric",

month:"long",

year:"numeric"

}

);


}



}



updateDate();








// ================================
// Toast
// ================================


function showToast(message){



const toast =
document.getElementById(
"toast"
);



if(!toast)
return;



toast.innerText =
message;



toast.classList.add(
"show"
);



setTimeout(()=>{


toast.classList.remove(
"show"
);


},3000);



}



window.openPage =
openPage;


window.openModal =
openModal;


window.closeModal =
closeModal;


window.showToast =
showToast;
