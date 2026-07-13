/**
 * LifeFlow Ultimate - Tasks Module
 * Full CRUD, filters, search, sorting, drag & drop support
 */

const Tasks = {
    data: [],
    currentFilter: {},
    currentSort: 'date-desc',

    init() {
        this.data = Storage.get(Storage.KEYS.TASKS);
        this.bindEvents();
        console.log('[Tasks] Module initialized with', this.data.length, 'tasks');
    },

    bindEvents() {
        const searchInput = document.getElementById('task-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.render());
        }

        ['task-filter-status', 'task-filter-priority', 'task-filter-category'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => this.render());
        });

        const sortSelect = document.getElementById('task-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.render();
            });
        }

        const addBtn = document.getElementById('add-task-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddModal());
        }

        const saveBtn = document.getElementById('save-task-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveTask());
        }

        document.querySelectorAll('[data-modal="task-modal"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    },

    getFilteredAndSorted() {
        let filtered = [...this.data];

        const searchTerm = document.getElementById('task-search')?.value.toLowerCase() || '';
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm) ||
                (task.description && task.description.toLowerCase().includes(searchTerm))
            );
        }

        const statusFilter = document.getElementById('task-filter-status')?.value;
        if (statusFilter) {
            filtered = filtered.filter(t => t.status === statusFilter);
        }

        const priorityFilter = document.getElementById('task-filter-priority')?.value;
        if (priorityFilter) {
            filtered = filtered.filter(t => t.priority === priorityFilter);
        }

        const categoryFilter = document.getElementById('task-filter-category')?.value;
        if (categoryFilter) {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        switch (this.currentSort) {
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.date || '1970-01-01') - new Date(b.date || '1970-01-01'));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                filtered.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
                break;
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return filtered;
    },

    render() {
        const container = document.getElementById('tasks-list');
        if (!container) return;

        const tasks = this.getFilteredAndSorted();
        container.innerHTML = '';

        if (tasks.length === 0) {
            container.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; color: var(--text-muted);">
                    <i class="fas fa-tasks" style="font-size: 48px; margin-bottom: 16px; opacity: 0.4;"></i>
                    <p>Задач не найдено. Создайте новую задачу!</p>
                </div>
            `;
            return;
        }

        tasks.forEach(task => {
            const taskEl = this.createTaskElement(task);
            container.appendChild(taskEl);
        });
    },

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.status === 'done' ? 'completed' : ''}`;
        div.dataset.id = task.id;

        const priorityClass = task.priority || 'medium';
        const isCompleted = task.status === 'done';
        const dateStr = task.date ? new Date(task.date).toLocaleDateString('ru-RU') : 'Без даты';
        const timeStr = task.time ? task.time : '';

        div.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
            
            <div class="task-content">
                <div class="task-header">
                    <div class="task-title ${isCompleted ? 'completed' : ''}">${task.title}</div>
                    <div class="task-priority ${priorityClass}">${this.getPriorityLabel(task.priority)}</div>
                </div>
                
                ${task.description ? `<div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">${task.description}</div>` : ''}
                
                <div class="task-meta">
                    <span><i class="fas fa-calendar"></i> ${dateStr}</span>
                    ${timeStr ? `<span><i class="fas fa-clock"></i> ${timeStr}</span>` : ''}
                    <span><i class="fas fa-tag"></i> ${task.category || 'Без категории'}</span>
                    ${task.status !== 'done' ? `<span class="text-muted"><i class="fas fa-info-circle"></i> ${this.getStatusLabel(task.status)}</span>` : ''}
                </div>
            </div>
            
            <div class="task-actions">
                <button class="edit-btn" title="Редактировать"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Удалить"><i class="fas fa-trash"></i></button>
            </div>
        `;

        const checkbox = div.querySelector('.task-checkbox');
        checkbox.addEventListener('change', (e) => {
            e.stopImmediatePropagation();
            this.toggleComplete(task.id, checkbox.checked);
        });

        div.addEventListener('click', (e) => {
            if (!e.target.closest('.task-actions') && !e.target.closest('.task-checkbox')) {
                this.showEditModal(task);
            }
        });

        div.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            this.showEditModal(task);
        });

        div.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            this.deleteTask(task.id);
        });

        return div;
    },

    getPriorityLabel(priority) {
        const labels = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
        return labels[priority] || 'Средний';
    },

    getStatusLabel(status) {
        const labels = { todo: 'К выполнению', inprogress: 'В процессе', done: 'Выполнено' };
        return labels[status] || status;
    },

    showAddModal() {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');
        
        form.reset();
        document.getElementById('task-id').value = '';
        document.getElementById('task-modal-title').textContent = 'Новая задача';
        
        const dateInput = document.getElementById('task-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
        
        modal.classList.add('active');
    },

    showEditModal(task) {
        const modal = document.getElementById('task-modal');
        
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-title').value = task.title || '';
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-date').value = task.date || '';
        document.getElementById('task-time').value = task.time || '';
        document.getElementById('task-priority').value = task.priority || 'medium';
        document.getElementById('task-category').value = task.category || 'Работа';
        document.getElementById('task-status').value = task.status || 'todo';
        
        document.getElementById('task-modal-title').textContent = 'Редактировать задачу';
        modal.classList.add('active');
    },

    closeModal() {
        const modal = document.getElementById('task-modal');
        modal.classList.remove('active');
    },

    saveTask() {
        const id = document.getElementById('task-id').value;
        const title = document.getElementById('task-title').value.trim();
        
        if (!title) {
            Storage.showToast('Название задачи обязательно', 'error');
            return;
        }

        const taskData = {
            title,
            description: document.getElementById('task-description').value.trim(),
            date: document.getElementById('task-date').value,
            time: document.getElementById('task-time').value,
            priority: document.getElementById('task-priority').value,
            category: document.getElementById('task-category').value,
            status: document.getElementById('task-status').value,
            completed: document.getElementById('task-status').value === 'done'
        };

        if (id) {
            Storage.update(Storage.KEYS.TASKS, id, taskData);
            Storage.showToast('Задача обновлена');
        } else {
            const newTask = {
                id: 'task_' + Date.now(),
                ...taskData,
                createdAt: new Date().toISOString()
            };
            Storage.add(Storage.KEYS.TASKS, newTask);
            Storage.showToast('Задача создана');
        }

        this.closeModal();
        this.refresh();
        
        if (window.Kanban) window.Kanban.refresh();
        if (window.Calendar) window.Calendar.refresh();
        if (window.App) window.App.updateDashboard();
    },

    toggleComplete(id, completed) {
        const newStatus = completed ? 'done' : 'todo';
        Storage.update(Storage.KEYS.TASKS, id, { 
            status: newStatus, 
            completed: completed 
        });
        
        this.refresh();
        if (window.Kanban) window.Kanban.refresh();
        if (window.App) window.App.updateDashboard();
    },

    deleteTask(id) {
        if (!confirm('Удалить эту задачу?')) return;
        
        Storage.remove(Storage.KEYS.TASKS, id);
        Storage.showToast('Задача удалена');
        
        this.refresh();
        if (window.Kanban) window.Kanban.refresh();
        if (window.Calendar) window.Calendar.refresh();
        if (window.App) window.App.updateDashboard();
    },

    refresh() {
        this.data = Storage.get(Storage.KEYS.TASKS);
        this.render();
    },

    getAll() {
        return this.data.length ? this.data : Storage.get(Storage.KEYS.TASKS);
    },

    getByDate(dateStr) {
        return this.getAll().filter(task => task.date === dateStr);
    },

    getTodayTasks() {
        const today = new Date().toISOString().split('T')[0];
        return this.getAll().filter(task => task.date === today && task.status !== 'done');
    },

    updateStatus(id, newStatus) {
        Storage.update(Storage.KEYS.TASKS, id, { 
            status: newStatus,
            completed: newStatus === 'done'
        });
        this.refresh();
    }
};

window.Tasks = Tasks;
