/**
 * LifeFlow Ultimate - Habits Module
 * Daily check-ins, streaks, progress calculation
 */

const Habits = {
    data: [],

    init() {
        this.data = Storage.get(Storage.KEYS.HABITS);
        this.bindEvents();
        this.render();
        console.log('[Habits] Initialized with', this.data.length, 'habits');
    },

    bindEvents() {
        const addBtn = document.getElementById('add-habit-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddModal());
        }

        const saveBtn = document.getElementById('save-habit-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveHabit());
        }

        document.querySelectorAll('[data-modal="habit-modal"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    },

    render() {
        const container = document.getElementById('habits-grid');
        if (!container) return;

        container.innerHTML = '';

        if (this.data.length === 0) {
            container.innerHTML = `
                <div class="glass-card" style="grid-column: 1 / -1; text-align:center; padding:60px 20px;">
                    <i class="fas fa-check-double" style="font-size:48px; color:var(--accent); margin-bottom:16px;"></i>
                    <h3>Начните отслеживать привычки</h3>
                    <p style="color:var(--text-muted); max-width:300px; margin:12px auto;">Создайте первую привычку и отмечайте её каждый день.</p>
                </div>
            `;
            return;
        }

        this.data.forEach(habit => {
            const card = this.createHabitCard(habit);
            container.appendChild(card);
        });
    },

    createHabitCard(habit) {
        const card = document.createElement('div');
        card.className = 'habit-card';

        const streak = this.calculateStreak(habit);
        const progress = this.calculateProgress(habit);
        const todayChecked = this.isCheckedToday(habit);

        card.innerHTML = `
            <div class="habit-header">
                <div>
                    <div class="habit-name">${habit.name}</div>
                    ${habit.description ? `<div style="font-size:13px; color:var(--text-muted); margin-top:4px;">${habit.description}</div>` : ''}
                </div>
                <div class="habit-streak">
                    <i class="fas fa-fire"></i>
                    <span>${streak} дней</span>
                </div>
            </div>

            <div class="habit-progress">
                <div class="progress-text">
                    <span>Прогресс за 30 дней</span>
                    <span><strong>${progress}%</strong></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>

            <div class="habit-actions">
                <button class="habit-check-btn ${todayChecked ? 'checked' : ''}" data-id="${habit.id}">
                    <i class="fas ${todayChecked ? 'fa-check' : 'fa-plus'}"></i> 
                    ${todayChecked ? 'Отмечено сегодня' : 'Отметить сегодня'}
                </button>
                
                <button class="btn-icon delete-habit-btn" data-id="${habit.id}" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        const checkBtn = card.querySelector('.habit-check-btn');
        checkBtn.addEventListener('click', () => {
            this.toggleCheck(habit.id, checkBtn);
        });

        card.querySelector('.delete-habit-btn').addEventListener('click', () => {
            if (confirm('Удалить привычку?')) {
                Storage.remove(Storage.KEYS.HABITS, habit.id);
                Storage.showToast('Привычка удалена');
                this.refresh();
            }
        });

        return card;
    },

    calculateStreak(habit) {
        if (!habit.history || habit.history.length === 0) return 0;

        const sorted = [...habit.history].sort((a, b) => new Date(b) - new Date(a));
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < sorted.length; i++) {
            const checkDate = new Date(sorted[i]);
            checkDate.setHours(0, 0, 0, 0);

            const diffDays = Math.floor((currentDate - checkDate) / (1000 * 60 * 60 * 24));

            if (i === 0 && diffDays > 1) return 0;
            if (diffDays === streak) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    },

    calculateProgress(habit) {
        if (!habit.history || habit.history.length === 0) return 0;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentChecks = habit.history.filter(date => new Date(date) >= thirtyDaysAgo);
        return Math.min(100, Math.round((recentChecks.length / 30) * 100));
    },

    isCheckedToday(habit) {
        if (!habit.history) return false;
        const today = new Date().toISOString().split('T')[0];
        return habit.history.includes(today);
    },

    toggleCheck(habitId, btnElement) {
        const habit = this.data.find(h => h.id === habitId);
        if (!habit) return;

        const today = new Date().toISOString().split('T')[0];

        if (!habit.history) habit.history = [];

        const index = habit.history.indexOf(today);

        if (index === -1) {
            habit.history.push(today);
            btnElement.classList.add('checked');
            btnElement.innerHTML = `<i class="fas fa-check"></i> Отмечено сегодня`;
            Storage.showToast('Отлично! Привычка отмечена');
        } else {
            habit.history.splice(index, 1);
            btnElement.classList.remove('checked');
            btnElement.innerHTML = `<i class="fas fa-plus"></i> Отметить сегодня`;
        }

        Storage.update(Storage.KEYS.HABITS, habitId, { history: habit.history });
        this.refresh();
        
        if (window.App) window.App.updateDashboard();
    },

    showAddModal() {
        const modal = document.getElementById('habit-modal');
        document.getElementById('habit-form').reset();
        document.getElementById('habit-id').value = '';
        document.getElementById('habit-modal-title').textContent = 'Новая привычка';
        modal.classList.add('active');
    },

    closeModal() {
        document.getElementById('habit-modal').classList.remove('active');
    },

    saveHabit() {
        const id = document.getElementById('habit-id').value;
        const name = document.getElementById('habit-name').value.trim();

        if (!name) {
            Storage.showToast('Название привычки обязательно', 'error');
            return;
        }

        const habitData = {
            name,
            description: document.getElementById('habit-description').value.trim(),
            history: []
        };

        if (id) {
            Storage.update(Storage.KEYS.HABITS, id, habitData);
            Storage.showToast('Привычка обновлена');
        } else {
            const newHabit = {
                id: 'habit_' + Date.now(),
                ...habitData,
                createdAt: new Date().toISOString()
            };
            Storage.add(Storage.KEYS.HABITS, newHabit);
            Storage.showToast('Привычка создана');
        }

        this.closeModal();
        this.refresh();
    },

    refresh() {
        this.data = Storage.get(Storage.KEYS.HABITS);
        this.render();
    },

    getAll() {
        return this.data;
    }
};

window.Habits = Habits;
