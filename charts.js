/**
 * LifeFlow Ultimate - Charts Module
 * Productivity chart for Dashboard + shared utilities
 */

const Charts = {
    productivityChart: null,

    init() {
        console.log('[Charts] Module ready');
    },

    renderProductivityChart(weeklyData) {
        const ctx = document.getElementById('productivity-chart');
        if (!ctx) return;

        if (this.productivityChart) {
            this.productivityChart.destroy();
        }

        const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const data = weeklyData || [65, 78, 82, 70, 90, 55, 40];

        this.productivityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Продуктивность (%)',
                    data: data,
                    backgroundColor: 'rgba(224, 122, 95, 0.7)',
                    borderColor: '#e07a5f',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255,255,255,0.06)' },
                        ticks: { color: '#8a7aa8', stepSize: 20 }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.06)' },
                        ticks: { color: '#8a7aa8' }
                    }
                }
            }
        });
    },

    getWeeklyProductivityData() {
        const tasks = Storage.get(Storage.KEYS.TASKS);
        const now = new Date();
        const data = [0, 0, 0, 0, 0, 0, 0];

        tasks.forEach(task => {
            if (task.status === 'done' && task.date) {
                const taskDate = new Date(task.date);
                const dayDiff = Math.floor((now - taskDate) / (1000 * 3600 * 24));
                if (dayDiff >= 0 && dayDiff < 7) {
                    let jsDay = taskDate.getDay();
                    let index = jsDay === 0 ? 6 : jsDay - 1;
                    data[index] += 15;
                }
            }
        });

        const max = Math.max(...data, 30);
        return data.map(v => Math.min(100, Math.round((v / max) * 100)));
    }
};

window.Charts = Charts;
