/**
 * LifeFlow Ultimate - Calendar Module
 * Monthly view with task indicators and day click to add/view tasks
 */

const Calendar = {
    currentDate: new Date(),
    data: [],

    init() {
        this.data = Storage.get(Storage.KEYS.TASKS);
        this.bindEvents();
        this.render();
        console.log('[Calendar] Initialized');
    },

    bindEvents() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        const addBtn = document.getElementById('add-calendar-task-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        if (addBtn) addBtn.addEventListener('click', () => {
            if (window.Tasks) window.Tasks.showAddModal();
        });
    },

    render() {
        const grid = document.getElementById('calendar-grid');
        const monthLabel = document.getElementById('current-month');
        if (!grid || !monthLabel) return;

        grid.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        monthLabel.textContent = this.currentDate.toLocaleDateString('ru-RU', { 
            month: 'long', 
            year: 'numeric' 
        });

        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const dayEl = this.createDayElement(daysInPrevMonth - i, true, year, month - 1);
            grid.appendChild(dayEl);
        }

        const todayStr = new Date().toISOString().split('T')[0];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const dayEl = this.createDayElement(day, false, year, month, dateStr, isToday);
            grid.appendChild(dayEl);
        }

        const totalCells = 42;
        const remaining = totalCells - (adjustedFirstDay + daysInMonth);
        for (let day = 1; day <= remaining; day++) {
            const dayEl = this.createDayElement(day, true, year, month + 1);
            grid.appendChild(dayEl);
        }
    },

    createDayElement(dayNum, isOtherMonth, year, month, dateStr = null, isToday = false) {
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;

        const displayDateStr = dateStr || `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

        dayEl.innerHTML = `
            <div class="day-number">${dayNum}</div>
            <div class="day-events"></div>
        `;

        if (!isOtherMonth && dateStr) {
            const dayTasks = this.getTasksForDate(dateStr);
            const eventsContainer = dayEl.querySelector('.day-events');

            dayTasks.slice(0, 4).forEach(task => {
                const dot = document.createElement('div');
                dot.className = `event-dot ${task.priority || 'medium'}`;
                eventsContainer.appendChild(dot);
            });

            if (dayTasks.length > 4) {
                const more = document.createElement('span');
                more.style.fontSize = '10px';
                more.style.color = 'var(--text-muted)';
                more.style.marginLeft = '4px';
                more.textContent = `+${dayTasks.length - 4}`;
                eventsContainer.appendChild(more);
            }

            dayEl.addEventListener('click', () => {
                this.showDayModal(dateStr, dayTasks);
            });
        } else {
            dayEl.addEventListener('click', () => {
                if (window.Tasks) window.Tasks.showAddModal();
            });
        }

        return dayEl;
    },

    getTasksForDate(dateStr) {
        return this.data.filter(task => task.date === dateStr);
    },

    showDayModal(dateStr, tasks) {
        const modalHTML = `
            <div class="modal active" id="day-modal">
                <div class="modal-content glass" style="max-width: 480px;">
                    <div class="modal-header">
                        <h3>${new Date(dateStr).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                        <button class="modal-close" id="close-day-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        ${tasks.length > 0 ? `
                            <div style="margin-bottom: 20px;">
                                <strong>Задачи на этот день (${tasks.length}):</strong>
                                <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                                    ${tasks.map(task => `
                                        <div style="display:flex; align-items:center; gap:10px; padding:8px 12px; background:var(--bg-primary); border-radius:8px;">
                                            <span class="task-priority ${task.priority}" style="padding:2px 8px; font-size:11px;">${task.priority}</span>
                                            <span style="flex:1;">${task.title}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : `<p style="color:var(--text-muted); margin-bottom:20px;">На этот день задач нет.</p>`}
                        
                        <button class="btn-primary" style="width:100%;" id="add-task-for-day">
                            <i class="fas fa-plus"></i> Добавить задачу на этот день
                        </button>
                    </div>
                </div>
            </div>
        `;

        const existing = document.getElementById('day-modal');
        if (existing) existing.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const newModal = document.getElementById('day-modal');
        const closeBtn = document.getElementById('close-day-modal');
        const addBtn = document.getElementById('add-task-for-day');

        closeBtn.addEventListener('click', () => newModal.remove());

        addBtn.addEventListener('click', () => {
            newModal.remove();
            if (window.Tasks) {
                setTimeout(() => {
                    window.Tasks.showAddModal();
                    const dateInput = document.getElementById('task-date');
                    if (dateInput) dateInput.value = dateStr;
                }, 150);
            }
        });

        newModal.addEventListener('click', (e) => {
            if (e.target === newModal) newModal.remove();
        });
    },

    refresh() {
        this.data = Storage.get(Storage.KEYS.TASKS);
        this.render();
    }
};

window.Calendar = Calendar;
