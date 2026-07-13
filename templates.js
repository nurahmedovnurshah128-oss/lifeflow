/**
 * LifeFlow Ultimate - Templates Module
 * Predefined and custom productivity templates
 */

const Templates = {
    data: [],

    init() {
        this.data = Storage.get(Storage.KEYS.TEMPLATES);
        this.bindEvents();
        this.render();
        console.log('[Templates] Initialized');
    },

    bindEvents() {
        const createBtn = document.getElementById('create-template-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.showCreateModal());
        }

        const saveBtn = document.getElementById('save-template-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCustomTemplate());
        }

        document.querySelectorAll('[data-modal="template-modal"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    },

    render() {
        const container = document.getElementById('templates-grid');
        if (!container) return;

        container.innerHTML = '';

        this.data.forEach(template => {
            const card = this.createTemplateCard(template);
            container.appendChild(card);
        });
    },

    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'template-card';

        const taskCount = template.tasks ? template.tasks.length : 0;

        card.innerHTML = `
            <h4>${template.name}</h4>
            <p>${template.description || 'Готовый набор для продуктивности'}</p>
            
            <div style="margin: 12px 0; font-size:13px; color:var(--text-muted);">
                <i class="fas fa-tasks"></i> ${taskCount} задач в шаблоне
            </div>
            
            <button class="apply-btn" data-id="${template.id}">
                <i class="fas fa-magic"></i> Применить шаблон
            </button>
        `;

        card.querySelector('.apply-btn').addEventListener('click', () => {
            this.applyTemplate(template);
        });

        return card;
    },

    applyTemplate(template) {
        if (!template.tasks || template.tasks.length === 0) {
            Storage.showToast('В этом шаблоне нет задач', 'error');
            return;
        }

        let added = 0;

        template.tasks.forEach(taskTitle => {
            const newTask = {
                id: 'task_' + Date.now() + Math.random().toString(36).substr(2, 5),
                title: taskTitle,
                description: `Из шаблона: ${template.name}`,
                date: new Date().toISOString().split('T')[0],
                time: '',
                priority: 'medium',
                category: 'Работа',
                status: 'todo',
                completed: false,
                createdAt: new Date().toISOString()
            };
            Storage.add(Storage.KEYS.TASKS, newTask);
            added++;
        });

        Storage.showToast(`Применён шаблон "${template.name}". Добавлено ${added} задач.`);

        if (window.Tasks) window.Tasks.refresh();
        if (window.Kanban) window.Kanban.refresh();
        if (window.App) window.App.updateDashboard();
    },

    showCreateModal() {
        const modal = document.getElementById('template-modal');
        document.getElementById('template-form').reset();
        modal.classList.add('active');
    },

    closeModal() {
        document.getElementById('template-modal').classList.remove('active');
    },

    saveCustomTemplate() {
        const name = document.getElementById('template-name').value.trim();
        if (!name) {
            Storage.showToast('Название шаблона обязательно', 'error');
            return;
        }

        const tasksText = document.getElementById('template-tasks').value.trim();
        const tasks = tasksText ? tasksText.split('\n').filter(t => t.trim()) : [];

        const newTemplate = {
            id: 'tpl_custom_' + Date.now(),
            name,
            description: document.getElementById('template-description').value.trim(),
            tasks: tasks,
            isCustom: true
        };

        Storage.add(Storage.KEYS.TEMPLATES, newTemplate);
        Storage.showToast('Шаблон создан');

        this.closeModal();
        this.refresh();
    },

    refresh() {
        this.data = Storage.get(Storage.KEYS.TEMPLATES);
        this.render();
    }
};

window.Templates = Templates;
