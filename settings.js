/**
 * LifeFlow Ultimate - Settings Module
 * Profile, export/import, data management + logout + notifications
 */

const Settings = {
    init() {
        this.loadProfile();
        this.bindEvents();
        console.log('[Settings] Initialized');
    },

    loadProfile() {
        const settings = Storage.get(Storage.KEYS.SETTINGS);
        const username = settings.username || 'Пользователь';

        document.querySelectorAll('#dashboard-username, #topbar-username, #sidebar-username').forEach(el => {
            if (el) el.textContent = username;
        });

        const input = document.getElementById('settings-username');
        if (input) input.value = username;

        document.querySelectorAll('.avatar').forEach(avatar => {
            if (avatar.id.includes('avatar') || avatar.classList.contains('avatar')) {
                avatar.textContent = username.charAt(0).toUpperCase();
            }
        });
    },

    bindEvents() {
        const saveProfileBtn = document.getElementById('save-profile-btn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }

        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        const importBtn = document.getElementById('import-data-btn');
        const fileInput = document.getElementById('import-file');
        
        if (importBtn && fileInput) {
            importBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.importData(e));
        }

        const clearBtn = document.getElementById('clear-data-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }

        const notifBtn = document.getElementById('enable-notifications-btn');
        if (notifBtn) {
            notifBtn.addEventListener('click', async () => {
                if (window.App) {
                    const granted = await window.App.requestNotificationPermission();
                    if (granted) {
                        notifBtn.innerHTML = '<i class="fas fa-check"></i> Уведомления включены';
                        notifBtn.disabled = true;
                    }
                }
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.App && window.App.logout) {
                    window.App.logout();
                }
            });
        }
    },

    saveProfile() {
        const input = document.getElementById('settings-username');
        if (!input) return;

        const newName = input.value.trim() || 'Пользователь';
        
        let settings = Storage.get(Storage.KEYS.SETTINGS);
        settings.username = newName;
        Storage.save(Storage.KEYS.SETTINGS, settings);

        document.querySelectorAll('#dashboard-username, #topbar-username, #sidebar-username').forEach(el => {
            if (el) el.textContent = newName;
        });

        document.querySelectorAll('.avatar').forEach(avatar => {
            avatar.textContent = newName.charAt(0).toUpperCase();
        });

        Storage.showToast('Профиль сохранён');
    },

    exportData() {
        const data = Storage.exportAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `lifeflow_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Storage.showToast('Данные экспортированы');
    },

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                const success = Storage.importAll(importedData);
                
                if (success) {
                    Storage.showToast('Данные успешно импортированы! Перезагрузка...');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1200);
                } else {
                    Storage.showToast('Ошибка импорта', 'error');
                }
            } catch (err) {
                Storage.showToast('Неверный формат файла', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    },

    clearAllData() {
        if (!confirm('Вы уверены? ВСЕ данные будут удалены безвозвратно!')) return;
        if (!confirm('Это действие необратимо. Продолжить?')) return;

        Storage.clearAll();
        Storage.showToast('Все данные очищены. Перезагрузка...');
        
        setTimeout(() => {
            window.location.reload();
        }, 800);
    }
};

window.Settings = Settings;
