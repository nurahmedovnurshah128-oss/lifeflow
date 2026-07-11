/*
==================================
 LifeFlow Ultimate
 Storage Engine v2
==================================
*/


const LifeStorage = {


    key: "lifeflow_data",



    defaultData:{


        tasks:[],


        habits:[],


        finance:[],


        goals:[],


        templates:[],


        settings:{


            theme:"light",


            username:"Пользователь"


        }


    },





    // Получение данных

    get(){


        let data = localStorage.getItem(this.key);



        if(!data){


            this.save(this.defaultData);


            return this.defaultData;


        }



        try{


            return JSON.parse(data);


        }

        catch(error){


            console.log("Ошибка базы данных");


            this.save(this.defaultData);


            return this.defaultData;


        }


    },







    // Сохранение данных

    save(data){


        localStorage.setItem(

            this.key,

            JSON.stringify(data)

        );


    },







    // Обновить раздел

    update(section,value){


        let data=this.get();



        data[section]=value;



        this.save(data);


    },







    // Добавить элемент

    add(section,item){


        let data=this.get();



        data[section].push(item);



        this.save(data);


    },







    // Удалить элемент

    remove(section,id){


        let data=this.get();



        data[section]=data[section].filter(

            item=>item.id!==id

        );



        this.save(data);


    },







    // Очистка

    clear(){


        localStorage.removeItem(

            this.key

        );


    }


};








// ==============================
// Экспорт
// ==============================


function exportData(){


    let data=LifeStorage.get();



    let file=new Blob(

        [

        JSON.stringify(data,null,2)

        ],


        {

        type:"application/json"

        }

    );



    let url=URL.createObjectURL(file);



    let link=document.createElement("a");



    link.href=url;


    link.download="lifeflow_backup.json";


    link.click();



}








// ==============================
// Импорт
// ==============================


function importData(){



    let input=document.createElement("input");


    input.type="file";


    input.accept=".json";



    input.onchange=function(e){


        let file=e.target.files[0];



        let reader=new FileReader();



        reader.onload=function(){


            let data=JSON.parse(

                reader.result

            );



            LifeStorage.save(data);



            location.reload();


        };



        reader.readAsText(file);


    };



    input.click();


}
