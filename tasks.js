// ==========================================================
// TASKS.JS
// ==========================================================
let activeTaskFilter = 'all';
 
function getDay(key){
  if(!data.days[key]) data.days[key] = { tasks: [], note: '' };
  if(!data.days[key].tasks) data.days[key].tasks = [];
  return data.days[key];
}
 
function dayProgress(key){
  const day = data.days[key];
  const tasks = day ? day.tasks : [];
  const habitsCount = data.habits.length;
  let habitDone = 0;
  data.habits.forEach(h => { if(habitIsComplete(h, key)) habitDone++; });
  const totalItems = tasks.length + habitsCount;
  const doneItems = tasks.filter(t=>t.done).length + habitDone;
  if(totalItems === 0) return null;
  return Math.round((doneItems/totalItems)*100);
}
 
function populateCategorySelect(sel){
  const cur = sel.value;
  sel.innerHTML = data.categories.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  if(cur) sel.value = cur;
}
 
function renderTaskFilters(){
  const row = document.getElementById('taskFilterRow');
  const cats = ['all','high', ...data.categories];
  row.innerHTML = '';
  const labelFor = c => c==='all' ? 'Все' : c==='high' ? '🔥 Важные' : c;
  cats.forEach(c=>{
    const chip = document.createElement('div');
    chip.className = 'filter-chip' + (activeTaskFilter===c ? ' active' : '');
    chip.textContent = labelFor(c);
    chip.addEventListener('click', ()=>{ activeTaskFilter = c; renderToday(); });
    row.appendChild(chip);
  });
}
 
function checkIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
}
 
function renderToday(){
  const key = fmtKey(selectedDate);
  const day = getDay(key);
 
  renderTaskFilters();
  populateCategorySelect(document.getElementById('taskCatSelect'));
 
  let visibleTasks = day.tasks.map((t,idx)=>({...t, idx}));
  if(activeTaskFilter === 'high') visibleTasks = visibleTasks.filter(t=>t.prio==='high');
  else if(activeTaskFilter !== 'all') visibleTasks = visibleTasks.filter(t=>t.cat===activeTaskFilter);
 
  visibleTasks.sort((a,b)=>{
    if(!!a.time !== !!b.time) return a.time ? -1 : 1;
    if(a.time && b.time) return a.time.localeCompare(b.time);
    return 0;
  });
 
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  document.getElementById('taskEmptyHint').style.display = visibleTasks.length ? 'none' : 'block';
  document.getElementById('taskCount').textContent = day.tasks.filter(t=>t.done).length + '/' + day.tasks.length;
 
  const prioLabel = {high:'Важно', mid:'Средне', low:'Не срочно'};
 
  visibleTasks.forEach(task => {
    const row = document.createElement('div');
    row.className = 'task-row';
    row.innerHTML = `
      <div class="checkbox ${task.done?'checked':''}" data-idx="${task.idx}">${checkIcon()}</div>
      <div class="task-mid">
        <div class="task-text ${task.done?'done':''}">${escapeHtml(task.text)}</div>
        <div class="task-meta">
          ${task.time ? `<span class="task-tag time-tag">⏰ ${task.time}</span>` : ''}
          ${task.prio ? `<span class="task-tag prio-${task.prio}">${prioLabel[task.prio]}</span>` : ''}
          ${task.cat ? `<span class="task-tag cat-tag">${escapeHtml(task.cat)}</span>` : ''}
        </div>
      </div>
      <div class="task-del" data-idx="${task.idx}">✕</div>
    `;
    list.appendChild(row);
  });
 
  list.querySelectorAll('.checkbox').forEach(cb=>{
    cb.addEventListener('click', ()=>{
      const idx = +cb.dataset.idx;
      day.tasks[idx].done = !day.tasks[idx].done;
      saveData();
      renderAll();
    });
  });
  list.querySelectorAll('.task-del').forEach(del=>{
    del.addEventListener('click', ()=>{
      const idx = +del.dataset.idx;
      day.tasks.splice(idx,1);
      saveData();
      renderAll();
    });
  });
 
  document.getElementById('noteInput').value = day.note || '';
 
  const prog = dayProgress(key);
  const ring = document.getElementById('dayRing');
  const circumference = 226;
  const pct = prog === null ? 0 : prog;
  ring.style.strokeDashoffset = circumference - (circumference * pct/100);
  document.getElementById('dayRingLabel').textContent = pct + '%';
 
  const heroTitle = document.getElementById('heroTitle');
  const heroSub = document.getElementById('heroSub');
  const isToday = fmtKey(selectedDate) === fmtKey(new Date());
  const dowName = DOW_FULL[selectedDate.getDay()];
  if(prog === null){
    heroTitle.textContent = isToday ? 'Пока пусто' : 'Ничего не запланировано';
    heroSub.textContent = 'Добавь задачи или привычки — и прогресс появится тут';
  } else if(prog === 100){
    heroTitle.textContent = 'Всё сделано! 🎉';
    heroSub.textContent = `${capitalize(dowName)}, ${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`;
  } else {
    heroTitle.textContent = `Прогресс дня: ${pct}%`;
    heroSub.textContent = `${capitalize(dowName)}, ${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`;
  }
}
 
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keydown', e=>{ if(e.key==='Enter') addTask(); });
function addTask(){
  const inp = document.getElementById('taskInput');
  const val = inp.value.trim();
  if(!val) return;
  const key = fmtKey(selectedDate);
  const prio = document.getElementById('taskPrioSelect').value;
  const cat = document.getElementById('taskCatSelect').value;
  const time = document.getElementById('taskTimeInput').value;
  getDay(key).tasks.push({ text: val, done: false, prio, cat, time: time || null });
  inp.value = '';
  document.getElementById('taskTimeInput').value = '';
  saveData();
  renderAll();
  showToast('Задача добавлена');
}
 
document.getElementById('noteInput').addEventListener('input', e=>{
  const key = fmtKey(selectedDate);
  getDay(key).note = e.target.value;
  saveData();
});
 
