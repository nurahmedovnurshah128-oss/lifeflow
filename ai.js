/**
 * LifeFlow Ultimate - AI Assistant Module
 * Rule-based smart recommendations (ready for OpenAI integration)
 */

const AI = {
    init() {
        this.bindEvents();
        this.renderInsights();
        console.log('[AI] Assistant initialized (rule-based mode)');
    },

    bindEvents() {
        const analyzeBtn = document.getElementById('ai-analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeProductivity());
        }

        const sendBtn = document.getElementById('ai-send-btn');
        const input = document.getElementById('ai-input');

        if (sendBtn && input) {
            const sendMessage = () => {
                const msg = input.value.trim();
                if (msg) {
                    this.addUserMessage(msg);
                    this.processUserQuery(msg);
                    input.value = '';
                }
            };

            sendBtn.addEventListener('click', sendMessage);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
    },

    addMessage(text, isUser = false) {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${isUser ? 'user' : 'assistant'}`;
        msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    addUserMessage(text) {
        this.addMessage(text, true);
    },

    addAssistantMessage(text) {
        this.addMessage(text, false);
    },

    analyzeProductivity() {
        const tasks = Storage.get(Storage.KEYS.TASKS);
        const habits = Storage.get(Storage.KEYS.HABITS);
        const goals = Storage.get(Storage.KEYS.GOALS);

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        let avgStreak = 0;
        if (habits.length > 0) {
            const streaks = habits.map(h => h.history ? h.history.length : 0);
            avgStreak = Math.round(streaks.reduce((a, b) => a + b, 0) / habits.length);
        }

        let analysis = `📊 <strong>Анализ продуктивности</strong><br><br>`;
        analysis += `• Выполнено задач: <strong>${completedTasks}/${totalTasks}</strong> (${completionRate}%)<br>`;
        analysis += `• Активных привычек: <strong>${habits.length}</strong><br>`;
        analysis += `• Средняя серия: <strong>${avgStreak} дней</strong><br>`;
        analysis += `• Активных целей: <strong>${goals.length}</strong><br><br>`;

        if (completionRate < 50) {
            analysis += `💡 <strong>Рекомендация:</strong> Попробуй уменьшить количество задач и сосредоточься на 3-5 главных.<br>`;
        } else if (completionRate > 80) {
            analysis += `🎉 <strong>Отлично!</strong> Ты на высоком уровне продуктивности!<br>`;
        }

        if (habits.length < 3) {
            analysis += `🌱 <strong>Совет:</strong> Добавь 1-2 простые привычки — это даёт большой эффект.<br>`;
        }

        const highPriorityPending = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
        if (highPriorityPending > 2) {
            analysis += `⚠️ <strong>Внимание:</strong> У тебя ${highPriorityPending} задач с высоким приоритетом. Выполни их в первую очередь.<br>`;
        }

        this.addAssistantMessage(analysis);
        this.renderInsights(completionRate, highPriorityPending);
    },

    processUserQuery(query) {
        const q = query.toLowerCase();
        let response = '';

        if (q.includes('задач') || q.includes('сколько')) {
            const tasks = Storage.get(Storage.KEYS.TASKS);
            const done = tasks.filter(t => t.status === 'done').length;
            response = `На данный момент у тебя ${tasks.length} задач, из них выполнено ${done}.`;
        } 
        else if (q.includes('привычк') || q.includes('стreak')) {
            const habits = Storage.get(Storage.KEYS.HABITS);
            response = `У тебя ${habits.length} отслеживаемых привычек. Отмечай их каждый день!`;
        } 
        else if (q.includes('цель') || q.includes('goal')) {
            const goals = Storage.get(Storage.KEYS.GOALS);
            response = `Ты работаешь над ${goals.length} целями. Разбивай большие цели на маленькие подзадачи.`;
        } 
        else if (q.includes('совет') || q.includes('рекоменд')) {
            response = `Мой главный совет: начинай день с самой сложной задачи (правило "съешь лягушку").`;
        } 
        else if (q.includes('привет') || q.includes('здравствуй')) {
            response = `Привет! Я здесь, чтобы помочь тебе стать продуктивнее. Спроси меня о задачах, привычках или целях.`;
        } 
        else {
            response = `Я проанализировал твои данные. Нажми кнопку "Проанализировать мою продуктивность" для подробного отчёта.`;
        }

        setTimeout(() => {
            this.addAssistantMessage(response);
        }, 400);
    },

    renderInsights(completionRate = null, highPriority = null) {
        const container = document.getElementById('ai-insights');
        if (!container) return;

        container.innerHTML = '';

        const tasks = Storage.get(Storage.KEYS.TASKS);
        const habits = Storage.get(Storage.KEYS.HABITS);

        const insights = [
            {
                icon: 'fa-chart-line',
                title: 'Продуктивность',
                text: completionRate !== null ? `${completionRate}% задач выполнено` : `${tasks.length} всего задач`
            },
            {
                icon: 'fa-fire',
                title: 'Привычки',
                text: `${habits.length} активных привычек`
            },
            {
                icon: 'fa-exclamation-triangle',
                title: 'Приоритет',
                text: highPriority !== null ? `${highPriority} высокоприоритетных` : 'Фокус на важном'
            }
        ];

        insights.forEach(ins => {
            const div = document.createElement('div');
            div.className = 'insight-card';
            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fas ${ins.icon}" style="color:var(--accent); font-size:18px;"></i>
                    <div>
                        <div style="font-weight:600; font-size:14px;">${ins.title}</div>
                        <div style="font-size:13px; color:var(--text-secondary);">${ins.text}</div>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }
};

window.AI = AI;
