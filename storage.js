const Storage = {
    get(key) {
        const data = localStorage.getItem(key);

        if (!data) {
            return [];
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            console.error("Ошибка чтения Storage:", error);
            return [];
        }
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};
