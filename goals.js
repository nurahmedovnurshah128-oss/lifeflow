/**
 * LifeFlow Ultimate - Goals Module
 * Goals with subtasks and progress tracking
 */

const Goals = {
    data: [],

    init() {
        this.data = Storage.get(Storage.KEYS.GOALS);
        this.bindEvents();
        this.render();
        console.log('[Goals] Initialized');
    },

    bindEvents() {
        const addBtn = document.getElementById('add-goal-btn');
        if (addBtn) addBtn.addEventListener('click', () => this.showAddModal());

        const saveBtn = document.getElementById('save-goal-btn');
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveGoal());

        document.querySelectorAll('[data-modal="goal-modal"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        const saveSubtaskBtn = document.getElementById('save-subtask-btn');
        if (saveSubtaskBtn) {
            saveSubtaskBtn.addEventListener('click', () => this.saveSubtask());
        }

        document.querySelectorAll('[data-modal="subtask-modal"]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('subtask-modal').classList.remove('active');
            });
        });
    },

    render() {
        const container = document.getElementById('goals-grid');
        if (!container) return;

        container.innerHTML = '';

        if (this.data.length === 0) {
            container.innerHTML = `
                <div class="glass-card" style="grid-column:1/-1; text-align:center; padding:50px;">
                    <i class="fas fa-bullseye" style="font-size:52px; color:var(--accent);"></i>
                    <h3 style="margin:16px 0 8px;">У вас пока нет целей</h3>
                    <p style="color:var(--text-muted);">Создайте первую цель и разбейте её на подзадачи.</p>
                </div>
            `;
            return;
        }

        this.data.forEach(goal => {
            const card = this.createGoalCard(goal);
            container.appendChild(card);
        });
    },

    createGoalCard(goal) {
        const card = document.createElement('div');
        card.className = 'goal-card';

        const progress = goal.progress || 0;
        const deadline = goal.deadline ? new Date(goal.deadline).toLocaleDateString('ru-RU') : 'Без дедлайна';
        const subtasks = goal.subtasks || [];

        const completedSubtasks = subtasks.filter(s => s.completed).length;
        const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : progress;

        card.innerHTML = `
            <div class="goal-header">
                <div class="goal-name">${goal.name}</div>
                <div class="goal-deadline"><i class="fas fa-clock"></i> ${deadline}</div>
            </div>
            
            ${goal.description ? `<p style="color:var(--text-secondary); font-size:14px; margin-bottom:12px;">${goal.description}</p>` : ''}
            
            <div class="goal-progress-container">
                <div class="goal-progress-text">
                    <span>Прогресс</span>
                    <span><strong>${subtaskProgress}%</strong></span>
                </div>
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${subtaskProgress}%"></div>
                </div>
            </div>

            <div class="subtasks-list">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong style="font-size:13px;">Подзадачи (${completedSubtasks}/${subtasks.length})</strong>
                </div>
                
                ${subtasks.length > 0 ? subtasks.map((sub, index) => `
                    <div class="subtask-item ${sub.completed ? 'completed' : ''}">
                        <input type="checkbox" ${sub.completed ? 'checked' : ''} data-goal-id="${goal.id}" data-index="${index}">
                        <span style="flex:1;">${sub.title}</span>
                    </div>
                `).join('') : `<div style="color:var(--text-muted); font-size:13px;">Нет подзадач</div>`}
            </div>

            <button class="add-subtask-btn" data-goal-id="${goal.id}">
                <i class="fas fa-plus"></i> Добавить подзадачу
            </button>

            <div style="display:flex; gap:8px; margin-top:12px;">
                <button class="btn-secondary btn-small edit-goal-btn" data-id="${goal.id}" style="flex:1;">
                    <i class="fas fa-edit"></i> Редактировать
                </button>
                <button class="btn-danger btn-small delete-goal-btn" data-id="${goal.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        card.querySelectorAll('.subtask-item input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const gId = e.target.dataset.goalId;
                const idx = parseInt(e.target.dataset.index);
                this.toggleSubtask(gId, idx, e.target.checked);
            });
        });

        card.querySelector('.add-subtask-btn').addEventListener('click', (e) => {
            const gId = e.target.closest('.add-subtask-btn').dataset.goalId;
            this.showSubtaskModal(gId);
        });

        card.querySelector('.edit-goal-btn').addEventListener('click', () => {
            this.showEditModal(goal);
        });

        card.querySelector('.delete-goal-btn').addEventListener('click', () => {
            if (confirm('Удалить цель и все её подзадачи?')) {
                Storage.remove(Storage.KEYS.GOALS, goal.id);
                Storage.showToast('Цель удалена');
                this.refresh();
            }
        });

        return card;
    },

    toggleSubtask(goalId, subtaskIndex, completed) {
        const goal = this.data.find(g => g.id === goalId);
        if (!goal || !goal.subtasks) return;

        goal.subtasks[subtaskIndex].completed = completed;

        const completedCount = goal.subtasks.filter(s => s.completed).length;
        goal.progress = Math.round((completedCount / goal.subtasks.length) * 100);

        Storage.update(Storage.KEYS.GOALS, goalId, { 
            subtasks: goal.subtasks, 
            progress: goal.progress 
        });

        this.refresh();
        if (window.App) window.App.updateDashboard();
    },

    showAddModal() {
        const modal = document.getElementById('goal-modal');
        document.getElementById('goal-form').reset();
        document.getElementById('goal-id').value = '';
        document.getElementById('goal-modal-title').textContent = 'Новая цель';
        modal.classList.add('active');
    },

    showEditModal(goal) {
        const modal = document.getElementById('goal-modal');
        
        document.getElementById('goal-id').value = goal.id;
        document.getElementById('goal-name').value = goal.name || '';
        document.getElementById('goal-description').value = goal.description || '';
        document.getElementById('goal-deadline').value = goal.deadline || '';
        document.getElementById('goal-progress').value = goal.progress || 0;
        
        document.getElementById('goal-modal-title').textContent = 'Редактировать цель';
        modal.classList.add('active');
    },

    closeModal() {
        document.getElementById('goal-modal').classList.remove('active');
    },

    saveGoal() {
        const id = document.getElementById('goal-id').value;
        const name = document.getElementById('goal-name').value.trim();

        if (!name) {
            Storage.showToast('Название цели обязательно', 'error');
            return;
        }

        const goalData = {
            name,
            description: document.getElementById('goal-description').value.trim(),
            deadline: document.getElementById('goal-deadline').value,
            progress: parseInt(document.getElementById('goal-progress').value) || 0,
            subtasks: id ? (this.data.find(g => g.id === id)?.subtasks || []) : []
        };

        if (id) {
            Storage.update(Storage.KEYS.GOALS, id, goalData);
            Storage.showToast('Цель обновлена');
        } else {
            const newGoal = {
                id: 'goal_' + Date.now(),
                ...goalData,
                createdAt: new Date().toISOString()
            };
            Storage.add(Storage.KEYS.GOALS, newGoal);
            Storage.showToast('Цель создана');
        }

        this.closeModal();
        this.refresh();
    },

    showSubtaskModal(goalId) {
        const modal = document.getElementById('subtask-modal');
        document.getElementById('subtask-form').reset();
        document.getElementById('subtask-goal-id').value = goalId;
        modal.classList.add('active');
    },

    saveSubtask() {
        const goalId = document.getElementById('subtask-goal-id').value;
        const title = document.getElementById('subtask-title').value.trim();

        if (!title) {
            Storage.showToast('Название подзадачи обязательно', 'error');
            return;
        }

        const goal = this.data.find(g => g.id === goalId);
        if (!goal) return;

        if (!goal.subtasks) goal.subtasks = [];

        goal.subtasks.push({
            id: 'sub_' + Date.now(),
            title,
            completed: false
        });

        const completed = goal.subtasks.filter(s => s.completed).length;
        goal.progress = Math.round((completed / goal.subtasks.length) * 100);

        Storage.update(Storage.KEYS.GOALS, goalId, { 
            subtasks: goal.subtasks,
            progress: goal.progress 
        });

        document.getElementById('subtask-modal').classList.remove('active');
        Storage.showToast('Подзадача добавлена');
        this.refresh();
    },

    refresh() {
        this.data = Storage.get(Storage.KEYS.GOALS);
        this.render();
    }
};

window.Goals = Goals;
