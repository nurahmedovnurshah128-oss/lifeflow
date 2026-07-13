/**
 * LifeFlow Ultimate - Main Application Controller
 * Senior Full-Stack Implementation • All modules connected
 */

const App = {
    currentSection: 'dashboard',
    isLoggedIn: false,

    init() {
        console.log('%c[LifeFlow Ultimate] Initializing full application...', 'color:#e07a5f; font-weight:600');

        // Check login state first
        this.checkLoginState();

        if (!this.isLoggedIn) {
            this.showLoginModal();
            return; // Stop initialization until logged in
        }

        // Initialize all modules in order
        Storage.initDefaults();
        
        if (window.Tasks) Tasks.init();
        if (window.Kanban) Kanban.init();
        if (window.Calendar) Calendar.init();
        if (window.Habits) Habits.init();
        if (window.Goals) Goals.init();
        if (window.Finance) Finance.init();
        if (window.Templates) Templates.init();
        if (window.AI) AI.init();
        if (window.Charts) Charts.init();
        if (window.Settings) Settings.init();

        // Navigation
        this.initNavigation();

        // Global search
        this.initGlobalSearch();

        // Quick add button
        this.initQuickAdd();

        // Initial dashboard render
        this.updateDashboard();

        // Show dashboard by default
        this.showSection('dashboard');

        // Keyboard shortcuts
        this.initKeyboardShortcuts();

        // Start notification checker (for tasks with time)
        this.startNotificationChecker();

        // PWA ready message (console)
        console.log('%c[LifeFlow] App ready. All features functional. Data persists in LocalStorage.', 'color:#4ade80');

        // Welcome toast on first load (if new)
        setTimeout(() => {
            const tasks = Storage.get(Storage.KEYS.TASKS);
            if (tasks.length === 0) {
                Storage.showToast('Добро пожаловать в LifeFlow Ultimate! Начните с создания первой задачи.');
            }
        }, 1800);
    },

    checkLoginState() {
        const settings = Storage.get(Storage.KEYS.SETTINGS);
        this.isLoggedIn = settings.loggedIn === true;
        
        if (this.isLoggedIn && settings.username) {
            // Update all username displays immediately
            document.querySelectorAll('#dashboard-username, #topbar-username, #sidebar-username').forEach(el => {
                if (el) el.textContent = settings.username;
            });
            document.querySelectorAll('.avatar').forEach(avatar => {
                avatar.textContent = settings.username.charAt(0).toUpperCase();
            });
        }
    },

    showLoginModal() {
        const loginModal = document.getElementById('login-modal');
        if (!loginModal) return;

        loginModal.classList.add('active');

        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');

        const handleAuth = (isRegister) => {
            const username = document.getElementById('login-username').value.trim() || 'Пользователь';
            const password = document.getElementById('login-password').value.trim();

            if (!username || !password) {
                Storage.showToast('Введите имя и пароль', 'error');
                return;
            }

            // Save user data (demo - password is not hashed, just stored)
            let settings = Storage.get(Storage.KEYS.SETTINGS);
            settings.username = username;
            settings.loggedIn = true;
            settings.lastLogin = new Date().toISOString();
            settings.password = password; // Demo only

            Storage.save(Storage.KEYS.SETTINGS, settings);

            loginModal.classList.remove('active');
            this.isLoggedIn = true;

            Storage.showToast(isRegister ? 'Аккаунт создан! Добро пожаловать!' : 'Вход выполнен успешно!');

            // Now fully initialize the app
            setTimeout(() => {
                this.initAfterLogin();
            }, 300);
        };

        if (loginBtn) loginBtn.onclick = () => handleAuth(false);
        if (registerBtn) registerBtn.onclick = () => handleAuth(true);

        // Allow Enter key
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleAuth(false);
                }
            });
        }
    },

    initAfterLogin() {
        // Re-initialize everything after successful login
        Storage.initDefaults();
        
        if (window.Tasks) Tasks.init();
        if (window.Kanban) Kanban.init();
        if (window.Calendar) Calendar.init();
        if (window.Habits) Habits.init();
        if (window.Goals) Goals.init();
        if (window.Finance) Finance.init();
        if (window.Templates) Templates.init();
        if (window.AI) AI.init();
        if (window.Charts) Charts.init();
        if (window.Settings) Settings.init();

        this.initNavigation();
        this.initGlobalSearch();
        this.initQuickAdd();
        this.updateDashboard();
        this.showSection('dashboard');
        this.initKeyboardShortcuts();
        this.startNotificationChecker();

        // Update UI with correct username
        const settings = Storage.get(Storage.KEYS.SETTINGS);
        document.querySelectorAll('#dashboard-username, #topbar-username, #sidebar-username').forEach(el => {
            if (el) el.textContent = settings.username;
        });
        document.querySelectorAll('.avatar').forEach(avatar => {
            avatar.textContent = settings.username.charAt(0).toUpperCase();
        });
    },

    logout() {
        let settings = Storage.get(Storage.KEYS.SETTINGS);
        settings.loggedIn = false;
        Storage.save(Storage.KEYS.SETTINGS, settings);
        
        Storage.showToast('Вы вышли из аккаунта');
        
        // Reload to show login again
        setTimeout(() => {
            window.location.reload();
        }, 800);
    },

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const closeBtn = document.getElementById('sidebar-close');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);

                // Close mobile sidebar
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                }
            });
        });

        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }

        // Close sidebar on content click (mobile)
        document.querySelector('.content-area').addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                sidebar.classList.remove('open');
            }
        });
    },

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show target
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
            this.currentSection = sectionId;
        }

        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        // Update page title
        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.getElementById('page-subtitle');

        const titles = {
            dashboard: { title: 'Dashboard', subtitle: 'Сегодня — отличный день для продуктивности' },
            tasks: { title: 'Задачи', subtitle: 'Управляйте всеми задачами в одном месте' },
            kanban: { title: 'Kanban Доска', subtitle: 'Визуальное управление потоком работы' },
            calendar: { title: 'Календарь', subtitle: 'Планируйте задачи по датам' },
            habits: { title: 'Привычки', subtitle: 'Строим лучшие версии себя каждый день' },
            goals: { title: 'Цели', subtitle: 'Большие цели начинаются с маленьких шагов' },
            finance: { title: 'Финансы', subtitle: 'Контролируйте свой денежный поток' },
            templates: { title: 'Шаблоны', subtitle: 'Готовые сценарии продуктивности' },
            ai: { title: 'AI Помощник', subtitle: 'Умные рекомендации на основе ваших данных' },
            settings: { title: 'Настройки', subtitle: 'Управление профилем и данными' }
        };

        if (titleEl && titles[sectionId]) {
            titleEl.textContent = titles[sectionId].title;
            if (subtitleEl) subtitleEl.textContent = titles[sectionId].subtitle;
        }

        // Refresh specific sections when opened
        if (sectionId === 'dashboard') {
            this.updateDashboard();
        } else if (sectionId === 'tasks' && window.Tasks) {
            Tasks.render();
        } else if (sectionId === 'kanban' && window.Kanban) {
            Kanban.render();
        } else if (sectionId === 'calendar' && window.Calendar) {
            Calendar.render();
        } else if (sectionId === 'habits' && window.Habits) {
            Habits.render();
        } else if (sectionId === 'goals' && window.Goals) {
            Goals.render();
        } else if (sectionId === 'finance' && window.Finance) {
            Finance.render();
            Finance.renderCharts();
        } else if (sectionId === 'templates' && window.Templates) {
            Templates.render();
        }
    },

    initGlobalSearch() {
        const searchInput = document.getElementById('global-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            if (!term) return;

            if (term.length > 2) {
                this.showSection('tasks');
                setTimeout(() => {
                    const taskSearch = document.getElementById('task-search');
                    if (taskSearch) {
                        taskSearch.value = term;
                        if (window.Tasks) Tasks.render();
                    }
                }, 50);
            }
        });
    },

    initQuickAdd() {
        const quickBtn = document.getElementById('quick-add-btn');
        if (!quickBtn) return;

        quickBtn.addEventListener('click', () => {
            if (window.Tasks) {
                Tasks.showAddModal();
            } else {
                this.showSection('tasks');
            }
        });
    },

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const search = document.getElementById('global-search');
                if (search) search.focus();
            }

            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }

            if (e.key >= '1' && e.key <= '9' && document.activeElement.tagName === 'BODY') {
                const sections = ['dashboard', 'tasks', 'kanban', 'calendar', 'habits', 'goals', 'finance', 'templates', 'ai'];
                const index = parseInt(e.key) - 1;
                if (sections[index]) {
                    this.showSection(sections[index]);
                }
            }
        });
    },

    // ==================== NOTIFICATIONS & TIME REMINDERS ====================
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            Storage.showToast('Ваш браузер не поддерживает уведомления', 'error');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                Storage.showToast('Уведомления включены! Вы будете получать напоминания о задачах.');
                return true;
            }
        }
        
        Storage.showToast('Разрешение на уведомления отклонено', 'error');
        return false;
    },

    startNotificationChecker() {
        setInterval(() => {
            this.checkDueTasksForNotification();
        }, 60000);

        setTimeout(() => this.checkDueTasksForNotification(), 5000);
    },

    checkDueTasksForNotification() {
        if (Notification.permission !== 'granted') return;

        const tasks = Storage.get(Storage.KEYS.TASKS);
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5);

        tasks.forEach(task => {
            if (task.status === 'done' || !task.date || !task.time) return;

            if (task.date !== today) return;

            if (task.time <= currentTime) {
                if (!task.notified) {
                    this.showTaskNotification(task);
                    Storage.update(Storage.KEYS.TASKS, task.id, { notified: true });
                    
                    if (this.currentSection === 'tasks' && window.Tasks) {
                        Tasks.refresh();
                    }
                }
            }
        });
    },

    showTaskNotification(task) {
        const title = `⏰ Напоминание: ${task.title}`;
        const body = task.description 
            ? task.description.substring(0, 80) 
            : `Задача на ${task.time} • ${task.category || ''}`;

        try {
            const notification = new Notification(title, {
                body: body,
                icon: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23e07a5f%22/%3E%3C/svg%3E',
                tag: task.id,
                requireInteraction: false
            });

            notification.onclick = () => {
                window.focus();
                this.showSection('tasks');
                notification.close();
            };
        } catch (e) {
            console.log('Notification error:', e);
        }
    },

    updateDashboard() {
        const settings = Storage.get(Storage.KEYS.SETTINGS);
        const username = settings.username || 'друг';
        document.querySelectorAll('#dashboard-username').forEach(el => el.textContent = username);

        const dateEl = document.getElementById('current-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            });
        }

        const tasks = Storage.get(Storage.KEYS.TASKS);
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const dashTotal = document.getElementById('dash-total-tasks');
        const dashCompleted = document.getElementById('dash-completed-tasks');
        const dashRate = document.getElementById('dash-completion-rate');
        const dashProgress = document.getElementById('dash-progress-fill');

        if (dashTotal) dashTotal.textContent = totalTasks;
        if (dashCompleted) dashCompleted.textContent = completedTasks;
        if (dashRate) dashRate.textContent = completionRate + '%';
        if (dashProgress) dashProgress.style.width = completionRate + '%';

        const todayTasksContainer = document.getElementById('dash-today-tasks');
        if (todayTasksContainer && window.Tasks) {
            const todayTasks = Tasks.getTodayTasks();
            todayTasksContainer.innerHTML = '';

            if (todayTasks.length === 0) {
                todayTasksContainer.innerHTML = `<div style="padding:12px; color:var(--text-muted); font-size:14px;">На сегодня задач нет — отличный день!</div>`;
            } else {
                todayTasks.slice(0, 4).forEach(task => {
                    const item = document.createElement('div');
                    item.className = 'task-mini-item';
                    item.innerHTML = `
                        <input type="checkbox" ${task.status === 'done' ? 'checked' : ''}>
                        <div class="task-info">${task.title}</div>
                        ${task.time ? `<div class="task-time">${task.time}</div>` : ''}
                    `;
                    item.querySelector('input').addEventListener('change', (e) => {
                        Tasks.toggleComplete(task.id, e.target.checked);
                        setTimeout(() => this.updateDashboard(), 300);
                    });
                    todayTasksContainer.appendChild(item);
                });
            }
        }

        const habitsContainer = document.getElementById('dash-habits-list');
        if (habitsContainer && window.Habits) {
            const habits = Habits.getAll();
            habitsContainer.innerHTML = '';

            if (habits.length === 0) {
                habitsContainer.innerHTML = `<div style="padding:8px 0; color:var(--text-muted); font-size:13px;">Добавьте привычки в разделе Привычки</div>`;
            } else {
                habits.slice(0, 3).forEach(habit => {
                    const progress = Habits.calculateProgress(habit);
                    const checked = Habits.isCheckedToday(habit);
                    const div = document.createElement('div');
                    div.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--glass-border);';
                    div.innerHTML = `
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:14px;">${habit.name}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:12px; color:var(--text-muted);">${progress}%</span>
                            <button class="btn-icon" style="width:28px; height:28px; font-size:12px;" data-habit-id="${habit.id}">
                                <i class="fas ${checked ? 'fa-check text-success' : 'fa-plus'}"></i>
                            </button>
                        </div>
                    `;
                    const btn = div.querySelector('button');
                    btn.addEventListener('click', () => {
                        Habits.toggleCheck(habit.id, btn);
                        setTimeout(() => this.updateDashboard(), 200);
                    });
                    habitsContainer.appendChild(div);
                });
            }
        }

        if (window.Charts) {
            const weeklyData = Charts.getWeeklyProductivityData();
            Charts.renderProductivityChart(weeklyData);
        }

        const sidebarName = document.getElementById('sidebar-username');
        if (sidebarName) sidebarName.textContent = username;
    }
};

// Boot the application
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;
