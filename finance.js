/**
 * LifeFlow Ultimate - Finance Module
 * Income/Expense tracking with charts and balance (валюта: сом)
 */

const Finance = {
    data: [],
    pieChart: null,
    lineChart: null,

    init() {
        this.data = Storage.get(Storage.KEYS.FINANCE);
        this.bindEvents();
        this.render();
        this.renderCharts();
        console.log('[Finance] Initialized');
    },

    bindEvents() {
        const incomeBtn = document.getElementById('add-income-btn');
        if (incomeBtn) {
            incomeBtn.addEventListener('click', () => this.showAddModal('income'));
        }

        const expenseBtn = document.getElementById('add-expense-btn');
        if (expenseBtn) {
            expenseBtn.addEventListener('click', () => this.showAddModal('expense'));
        }

        const saveBtn = document.getElementById('save-finance-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveTransaction());
        }

        document.querySelectorAll('[data-modal="finance-modal"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    },

    render() {
        this.renderOverview();
        this.renderTransactions();
    },

    renderOverview() {
        let totalIncome = 0;
        let totalExpense = 0;

        this.data.forEach(t => {
            if (t.type === 'income') totalIncome += t.amount;
            else totalExpense += t.amount;
        });

        const balance = totalIncome - totalExpense;

        const balanceEl = document.getElementById('finance-balance');
        const incomeEl = document.getElementById('finance-total-income');
        const expenseEl = document.getElementById('finance-total-expense');

        if (balanceEl) balanceEl.textContent = this.formatMoney(balance);
        if (incomeEl) incomeEl.textContent = this.formatMoney(totalIncome);
        if (expenseEl) expenseEl.textContent = this.formatMoney(totalExpense);

        const dashBalance = document.getElementById('dash-balance');
        const dashIncome = document.getElementById('dash-income');
        const dashExpense = document.getElementById('dash-expense');

        if (dashBalance) dashBalance.textContent = this.formatMoney(balance);
        if (dashIncome) dashIncome.textContent = this.formatMoney(totalIncome);
        if (dashExpense) dashExpense.textContent = this.formatMoney(totalExpense);
    },

    formatMoney(amount) {
        return new Intl.NumberFormat('ru-RU').format(amount) + ' сом';
    },

    renderTransactions() {
        const container = document.getElementById('transactions-list');
        if (!container) return;

        container.innerHTML = '';

        const recent = [...this.data]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 8);

        if (recent.length === 0) {
            container.innerHTML = `<div style="padding:30px; text-align:center; color:var(--text-muted);">Транзакций пока нет</div>`;
            return;
        }

        recent.forEach(tx => {
            const item = document.createElement('div');
            item.className = 'transaction-item';

            const isIncome = tx.type === 'income';
            const iconClass = isIncome ? 'fa-arrow-up' : 'fa-arrow-down';
            const colorClass = isIncome ? 'income' : 'expense';

            item.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-icon ${colorClass}">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="transaction-details">
                        <div class="amount ${colorClass}">${isIncome ? '+' : '-'}${this.formatMoney(tx.amount)}</div>
                        <div class="transaction-meta">${tx.category} • ${new Date(tx.date).toLocaleDateString('ru-RU')}</div>
                        ${tx.note ? `<div style="font-size:12px; color:var(--text-muted);">${tx.note}</div>` : ''}
                    </div>
                </div>
                <button class="btn-icon delete-tx-btn" data-id="${tx.id}" style="width:32px; height:32px;">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            item.querySelector('.delete-tx-btn').addEventListener('click', () => {
                if (confirm('Удалить транзакцию?')) {
                    Storage.remove(Storage.KEYS.FINANCE, tx.id);
                    Storage.showToast('Транзакция удалена');
                    this.refresh();
                }
            });

            container.appendChild(item);
        });
    },

    showAddModal(type) {
        const modal = document.getElementById('finance-modal');
        const form = document.getElementById('finance-form');
        const categorySelect = document.getElementById('finance-category');
        const titleEl = document.getElementById('finance-modal-title');

        form.reset();
        document.getElementById('finance-id').value = '';
        document.getElementById('finance-type').value = type;
        titleEl.textContent = type === 'income' ? 'Добавить доход' : 'Добавить расход';

        categorySelect.innerHTML = '';
        const categories = type === 'income' 
            ? ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарок', 'Другое']
            : ['Продукты', 'Транспорт', 'Жильё', 'Развлечения', 'Здоровье', 'Одежда', 'Другое'];

        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            categorySelect.appendChild(opt);
        });

        const dateInput = document.getElementById('finance-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

        modal.classList.add('active');
    },

    closeModal() {
        document.getElementById('finance-modal').classList.remove('active');
    },

    saveTransaction() {
        const type = document.getElementById('finance-type').value;
        const amount = parseFloat(document.getElementById('finance-amount').value);
        const category = document.getElementById('finance-category').value;

        if (!amount || amount <= 0) {
            Storage.showToast('Введите корректную сумму', 'error');
            return;
        }

        const txData = {
            type,
            amount,
            category,
            date: document.getElementById('finance-date').value || new Date().toISOString().split('T')[0],
            note: document.getElementById('finance-note').value.trim()
        };

        const newTx = {
            id: 'tx_' + Date.now(),
            ...txData,
            createdAt: new Date().toISOString()
        };

        Storage.add(Storage.KEYS.FINANCE, newTx);
        Storage.showToast(type === 'income' ? 'Доход добавлен' : 'Расход добавлен');

        this.closeModal();
        this.refresh();
    },

    renderCharts() {
        this.renderPieChart();
        this.renderLineChart();
    },

    renderPieChart() {
        const ctx = document.getElementById('finance-pie-chart');
        if (!ctx) return;

        if (this.pieChart) this.pieChart.destroy();

        const expenses = this.data.filter(t => t.type === 'expense');
        const categoryTotals = {};

        expenses.forEach(tx => {
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        if (labels.length === 0) {
            ctx.parentElement.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:40px 0;">Нет данных для графика расходов</p>';
            return;
        }

        this.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#e07a5f', '#f4a261', '#4ade80', '#fbbf24', '#60a5fa', '#c084fc', '#f87171'],
                    borderWidth: 2,
                    borderColor: '#1a1433'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#b8a9d4', padding: 16 } }
                }
            }
        });
    },

    renderLineChart() {
        const ctx = document.getElementById('finance-line-chart');
        if (!ctx) return;

        if (this.lineChart) this.lineChart.destroy();

        const last30Days = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            last30Days.push(d.toISOString().split('T')[0]);
        }

        const incomeData = last30Days.map(date => {
            return this.data
                .filter(t => t.type === 'income' && t.date === date)
                .reduce((sum, t) => sum + t.amount, 0);
        });

        const expenseData = last30Days.map(date => {
            return this.data
                .filter(t => t.type === 'expense' && t.date === date)
                .reduce((sum, t) => sum + t.amount, 0);
        });

        this.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days.map(d => d.slice(5)),
                datasets: [
                    {
                        label: 'Доходы',
                        data: incomeData,
                        borderColor: '#4ade80',
                        backgroundColor: 'rgba(74, 222, 128, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Расходы',
                        data: expenseData,
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#b8a9d4' } } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a7aa8' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8a7aa8' } }
                }
            }
        });
    },

    refresh() {
        this.data = Storage.get(Storage.KEYS.FINANCE);
        this.render();
        this.renderCharts();
        if (window.App) window.App.updateDashboard();
    }
};

window.Finance = Finance;
