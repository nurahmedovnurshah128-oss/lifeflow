// =============================
// LifeFlow Storage
// Локальная база данных
// =============================


const defaultLifeData = {


    habits: [],


    tasks: [],


    finance: [],


    goals: [],


    settings: {

        theme:"light"

    }


};





function getData(){


    let data =
    localStorage.getItem(
        "LifeFlowData"
    );


    if(data){

        return JSON.parse(data);

    }


    localStorage.setItem(
        "LifeFlowData",
        JSON.stringify(defaultLifeData)
    );


    return defaultLifeData;


}






function saveData(data){


    localStorage.setItem(

        "LifeFlowData",

        JSON.stringify(data)

    );


}






function clearData(){


    localStorage.removeItem(
        "LifeFlowData"
    );


}





function exportData(){


    let data =
    JSON.stringify(
        getData(),
        null,
        2
    );


    let file =
    new Blob(
        [data],
        {
            type:"application/json"
        }
    );



    let link =
    document.createElement("a");


    link.href =
    URL.createObjectURL(file);


    link.download =
    "LifeFlow_backup.json";


    link.click();


}