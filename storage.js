/*
==================================
 LifeFlow Ultimate
 Storage Engine v3
 Firebase + Local Cache
==================================
*/


import { db, auth } 
from "./firebase.js";


import {

doc,
setDoc,
getDoc

}
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";





const CACHE_KEY = "lifeflow_cache";





const defaultData = {


    tasks: [],


    habits: [],


    goals: [],


    finance: [],


    templates: [],


    settings: {


        theme:"dark",

        username:"Пользователь"

    }


};







// =================================
// Получить локальные данные
// =================================


function getLocal(){


    const data =
    localStorage.getItem(
        CACHE_KEY
    );



    if(data){


        return JSON.parse(data);


    }



    localStorage.setItem(

        CACHE_KEY,

        JSON.stringify(defaultData)

    );



    return defaultData;


}








// =================================
// Сохранить локально
// =================================


function saveLocal(data){


    localStorage.setItem(

        CACHE_KEY,

        JSON.stringify(data)

    );


}









// =================================
// Получить данные пользователя
// =================================


async function getData(){



    const user =
    auth.currentUser;



    if(!user){


        return getLocal();


    }




    try{


        const ref =
        doc(

            db,

            "users",

            user.uid

        );



        const snap =
        await getDoc(ref);



        if(snap.exists()){


            const data =
            snap.data();



            saveLocal(data);



            return data;


        }



        else{


            await saveData(defaultData);


            return defaultData;


        }


    }



    catch(error){



        console.log(
            "Cloud error:",
            error
        );



        return getLocal();


    }


}








// =================================
// Сохранить данные
// =================================


async function saveData(data){



    saveLocal(data);



    const user =
    auth.currentUser;



    if(!user){


        return;


    }



    try{


        await setDoc(

            doc(

                db,

                "users",

                user.uid

            ),

            data

        );


    }


    catch(error){


        console.log(
            error
        );


    }



}








// =================================
// Обновить раздел
// =================================


async function updateSection(

section,

value

){



    const data =
    await getData();



    data[section] =
    value;



    await saveData(data);



}








// =================================
// Добавить элемент
// =================================


async function addItem(

section,

item

){



    const data =
    await getData();



    if(!data[section]){


        data[section] = [];


    }



    data[section].push(item);



    await saveData(data);


}








// =================================
// Удалить элемент
// =================================


async function removeItem(

section,

id

){



    const data =
    await getData();



    data[section] =

    data[section].filter(

        item =>
        item.id !== id

    );



    await saveData(data);



}








// =================================
// Очистить всё
// =================================


async function clearStorage(){


    localStorage.removeItem(

        CACHE_KEY

    );


}








// =================================
// Экспорт
// =================================


window.LifeStorage = {


    get:getData,


    save:saveData,


    update:updateSection,


    add:addItem,


    remove:removeItem,


    clear:clearStorage


};
