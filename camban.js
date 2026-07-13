/**
 * LifeFlow Ultimate - Kanban Module
 * Drag & Drop board synced with Tasks data
 */

const Kanban = {
    data: [],

    init() {
        this.data = Storage.get(Storage.KEYS.TASKS);
        this.bindEvents();
        this.render();
        console.log('[Kanban] Initialized');
    },

    bindEvents() {
        const addBtn = document.getElementById('add-kanban-task-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                if (window.Tasks) {
                    window.Tasks.showAddModal();
                }
            });
        }
    },

    render() {
        const columns = {
            todo: document.getElementById('kanban-todo'),
            inprogress: document.getElementById('kanban-inprogress'),
            done: document.getElementById('kanban-done')
        };

        Object.values(columns).forEach(col => {
            if (col) col.innerHTML = '';
        });

        const counts = { todo: 0, inprogress: 0, done: 0 };

        this.data.forEach(task => {
            const status = task.status || 'todo';
            if (columns[status]) {
                const card = this.createKanbanCard(task);
                columns[status].appendChild(card);
                counts[status]++;
            }
        });

        Object.keys(counts).forEach(status => {
            const countEl = document.getElementById(`kanban-${status}-count`);
            if (countEl) countEl.textContent = counts[status];
        });
    },

    createKanbanCard(task) {
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.dataset.id = task.id;

        const priorityClass = task.priority || 'medium';
        const dateStr = task.date ? new Date(task.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '';

        card.innerHTML = `
            <div class="card-title">${task.title}</div>
            ${task.description ? `<div style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">${task.description.substring(0, 80)}${task.description.length > 80 ? '...' : ''}</div>` : ''}
            
            <div class="card-meta">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span class="priority-dot ${priorityClass}"></span>
                    <span style="font-size:12px;">${this.getPriorityLabel(task.priority)}</span>
                </div>
                ${dateStr ? `<span style="margin-left:auto; font-size:12px; color:var(--text-muted);"><i class="fas fa-calendar"></i> ${dateStr}</span>` : ''}
            </div>
            
            <div class="card-actions">
                <button class="edit-card-btn" title="Редактировать"><i class="fas fa-edit"></i></button>
                <button class="delete-card-btn" title="Удалить"><i class="fas fa-trash"></i></button>
            </div>
        `;

        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            card.style.opacity = '0.5';
        });

        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });

        card.querySelector('.edit-card-btn').addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            if (window.Tasks) window.Tasks.showEditModal(task);
        });

        card.querySelector('.delete-card-btn').addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            if (confirm('Удалить задачу?')) {
                Storage.remove(Storage.KEYS.TASKS, task.id);
                Storage.showToast('Задача удалена');
                this.refresh();
                if (window.Tasks) window.Tasks.refresh();
            }
        });

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-actions')) {
                if (window.Tasks) window.Tasks.showEditModal(task);
            }
        });

        return card;
    },

    getPriorityLabel(priority) {
        return { high: 'Высокий', medium: 'Средний', low: 'Низкий' }[priority] || 'Средний';
    },

    refresh() {
        this.data = Storage.get(Storage.KEYS.TASKS);
        this.render();
    }
};

window.allowDrop = function(ev) {
    ev.preventDefault();
};

window.dropKanban = function(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData('text/plain');
    const column = ev.currentTarget || ev.target.closest('.kanban-cards');
    
    if (!column || !taskId) return;
    
    const newStatus = column.id.replace('kanban-', '');
    
    Storage.update(Storage.KEYS.TASKS, taskId, { 
        status: newStatus,
        completed: newStatus === 'done'
    });
    
    if (window.Kanban) window.Kanban.refresh();
    if (window.Tasks) window.Tasks.refresh();
    if (window.App) window.App.updateDashboard();
};

window.Kanban = Kanban;
