/**
 * LifeFlow Ultimate - Storage Module
 * Senior Developer: Centralized LocalStorage manager with defaults.
 * Ready for easy Firebase migration (just replace methods).
 */

const Storage = {
    // Keys
    KEYS: {
        TASKS: 'lifeflow_tasks',
        HABITS: 'lifeflow_habits',
        GOALS: 'lifeflow_goals',
        FINANCE: 'lifeflow_finance',
        TEMPLATES: 'lifeflow_templates',
        SETTINGS: 'lifeflow_settings'
    },

    // Default data structures
    defaults: {
        tasks: [],
        habits: [],
        goals: [],
        finance: [],
        templates: [
            {
                id: 'tpl_morning',
                name: 'Утро продуктивного человека',
                description: 'Идеальное начало дня для максимальной продуктивности',
                tasks: [
                    'Проверить почту и ответить на важные письма',
                    'Составить план задач на день',
                    'Сделать 10-минутную зарядку',
                    'Выпить стакан воды и позавтракать'
                ]
            },
            {
                id: 'tpl_study',
                name: 'Учёба и саморазвитие',
                description: 'Фокус на обучении и личностном росте',
                tasks: [
                    'Посвятить 1 час изучению новой темы',
                    'Прочитать 20 страниц книги',
                    'Сделать конспект по ключевым моментам',
                    'Повторить вчерашний материал'
                ]
            },
            {
                id: 'tpl_sport',
                name: 'Спорт и здоровье',
                description: 'Поддержание физической формы и энергии',
                tasks: [
                    'Тренировка 45-60 минут',
                    'Прогулка на свежем воздухе',
                    'Приготовить полезный ужин',
                    'Выключить экраны за час до сна'
                ]
            },
            {
                id: 'tpl_work',
                name: 'Рабочий день',
                description: 'Эффективная организация рабочего процесса',
                tasks: [
                    'Разобрать входящие задачи и письма',
                    'Выполнить 3 приоритетные задачи',
                    'Сделать перерыв каждые 90 минут',
                    'Подвести итоги дня и запланировать завтра'
                ]
            }
        ],
        settings: {
            username: 'Пользователь',
            theme: 'dark',
            notifications: true,
            createdAt: new Date().toISOString()
        }
    },

    /**
     * Get data from LocalStorage or return default
     */
    get(key) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
            // Return default if not exists
            const defaultKey = key.replace('lifeflow_', '');
            return this.defaults[defaultKey] || [];
        } catch (e) {
            console.error('Storage get error:', e);
            return this.defaults[key.replace('lifeflow_', '')] || [];
        }
    },

    /**
     * Save data to LocalStorage
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            this.showToast('Ошибка сохранения данных', 'error');
            return false;
        }
    },

    /**
     * Add new item to array
     */
    add(key, item) {
        const data = this.get(key);
        data.push(item);
        this.save(key, data);
        return item;
    },

    /**
     * Update item by id
     */
    update(key, id, updates) {
        const data = this.get(key);
        const index = data.findIndex(item => item.id === id);
        
        if (index !== -1) {
            data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
            this.save(key, data);
            return data[index];
        }
        return null;
    },

    /**
     * Remove item by id
     */
    remove(key, id) {
        const data = this.get(key);
        const filtered = data.filter(item => item.id !== id);
        this.save(key, filtered);
        return filtered;
    },

    /**
     * Clear all data for a key
     */
    clear(key) {
        localStorage.removeItem(key);
    },

    /**
     * Clear ALL LifeFlow data
     */
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        // Re-initialize defaults
        this.initDefaults();
    },

    /**
     * Initialize defaults if empty
     */
    initDefaults() {
        Object.keys(this.KEYS).forEach(keyName => {
            const key = this.KEYS[keyName];
            if (!localStorage.getItem(key)) {
                const defaultKey = keyName.toLowerCase();
                if (this.defaults[defaultKey]) {
                    this.save(key, this.defaults[defaultKey]);
                }
            }
        });
    },

    /**
     * Export all data as JSON
     */
    exportAll() {
        const exportData = {};
        Object.keys(this.KEYS).forEach(keyName => {
            const key = this.KEYS[keyName];
            exportData[keyName] = this.get(key);
        });
        exportData.exportedAt = new Date().toISOString();
        exportData.version = '1.0.0';
        return exportData;
    },

    /**
     * Import data from JSON
     */
    importAll(jsonData) {
        try {
            Object.keys(this.KEYS).forEach(keyName => {
                if (jsonData[keyName]) {
                    this.save(this.KEYS[keyName], jsonData[keyName]);
                }
            });
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    },

    /**
     * Show toast notification (helper)
     */
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'all 0.3s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }
};

// Initialize defaults on load
Storage.initDefaults();

// Make available globally
window.Storage = Storage;
