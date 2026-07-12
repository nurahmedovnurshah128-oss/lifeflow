// ==========================================================
// CHARTS.JS — статистика недели и месячный график
// ==========================================================
function renderStats(){
  const monday = startOfWeek(selectedDate);
  const weekDays = [];
  for(let i=0;i<7;i++) weekDays.push(addDays(monday,i));
 
  let totalTasks=0, doneTasks=0, habitTicks=0, habitPossible=0, activeDays=0, progressSum=0, progressCount=0;
  weekDays.forEach(d=>{
    const dkey = fmtKey(d);
    const day = data.days[dkey];
    if(day){ totalTasks += day.tasks.length; doneTasks += day.tasks.filter(t=>t.done).length; }
    data.habits.forEach(h=>{ habitPossible++; if(habitIsComplete(h, dkey)) habitTicks++; });
    const p = dayProgress(dkey);
    if(p !== null){ progressSum += p; progressCount++; if(p>0) activeDays++; }
  });
 
  const avgProgress = progressCount ? Math.round(progressSum/progressCount) : 0;
  const habitRate = habitPossible ? Math.round((habitTicks/habitPossible)*100) : 0;
 
  const grid = document.getElementById('statsGrid');
  const stat = (label, value, color) => `
    <div class="stat-box"><div class="stat-val" style="color:${color};">${value}</div><div class="stat-lbl">${label}</div></div>`;
  grid.innerHTML =
    stat('Средний прогресс', avgProgress+'%', 'var(--plum-dark)') +
    stat('Активных дней', activeDays+'/7', 'var(--sage)') +
    stat('Задачи выполнены', doneTasks+'/'+totalTasks, 'var(--clay)') +
    stat('Привычки, %', habitRate+'%', 'var(--danger)');
 
  const mChart = document.getElementById('monthChart');
  const mLabels = document.getElementById('monthChartLabels');
  mChart.innerHTML=''; mLabels.innerHTML='';
  for(let i=29;i>=0;i--){
    const d = addDays(new Date(),-i);
    const dkey = fmtKey(d);
    const p = dayProgress(dkey) || 0;
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = Math.max(p,3)+'%';
    bar.title = dkey+': '+p+'%';
    mChart.appendChild(bar);
    const lbl = document.createElement('span');
    lbl.textContent = (i % 5 === 0) ? d.getDate() : '';
    mLabels.appendChild(lbl);
  }
}
