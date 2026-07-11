const AppStorage = {
    get(key) {
        const data = localStorage.getItem(key);

        if (!data) {
            return [];
        }

        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Storage read error:", e);
            return [];
        }
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    update(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};


// совместимость со старыми файлами
window.Storage = AppStorage;
window.Storage = {

    get(section){

        let data = LifeStorage.get();

        if(section){
            return data[section] || [];
        }

        return data;
    },


    set(data){

        LifeStorage.save(data);

    },


    update(section,value){

        LifeStorage.update(section,value);

    },


    add(section,item){

        LifeStorage.add(section,item);

    },


    remove(section,id){

        LifeStorage.remove(section,id);

    }

};
