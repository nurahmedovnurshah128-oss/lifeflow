// ==========================================================
// HABITS.JS
// ==========================================================
function habitDoneCount(habit, key){
  return (data.habitLog[habit.id] && data.habitLog[habit.id][key]) || 0;
}
function habitIsComplete(habit, key){
  return habitDoneCount(habit, key) >= (habit.target || 1);
}
function habitStreak(habit){
  let streak = 0;
  let d = new Date(); d.setHours(0,0,0,0);
  while(true){
    const key = fmtKey(d);
    if(habitIsComplete(habit, key)){ streak++; d = addDays(d,-1); }
    else break;
  }
  return streak;
}
 
function renderHabits(){
  const monday = startOfWeek(selectedDate);
  const weekDays = [];
  for(let i=0;i<7;i++) weekDays.push(addDays(monday,i));
  const wk = getWeekKey(selectedDate);
 
  document.getElementById('habitWeekLabel').textContent =
    weekDays[0].getDate()+' — '+weekDays[6].getDate()+' '+MONTHS[weekDays[6].getMonth()];
 
  if(!data.weekGoals[wk]) data.weekGoals[wk] = ['',''];
  const goalsBox = document.getElementById('weekGoals');
  goalsBox.innerHTML = '';
  data.weekGoals[wk].forEach((g, i)=>{
    const inp = document.createElement('input');
    inp.className = 'goal-input';
    inp.placeholder = 'Цель недели #' + (i+1);
    inp.value = g;
    inp.maxLength = 60;
    inp.addEventListener('input', ()=>{ data.weekGoals[wk][i] = inp.value; saveData(); });
    goalsBox.appendChild(inp);
  });
 
  const headRow = document.getElementById('habitHeadRow');
  headRow.innerHTML = '<th class="name-col">Привычка</th>' + weekDays.map(d=>`<th>${DOW[d.getDay()]}</th>`).join('');
 
  const body = document.getElementById('habitBody');
  body.innerHTML = '';
  document.getElementById('habitEmptyHint').style.display = data.habits.length ? 'none':'block';
 
  data.habits.forEach(habit=>{
    const streak = habitStreak(habit);
    const tr = document.createElement('tr');
    let cells = `<td class="name-col"><div class="habit-name-wrap">
      <div class="habit-name" data-hid="${habit.id}">${escapeHtml(habit.name)}</div>
      ${streak>0 ? `<span class="habit-streak">🔥${streak}</span>` : ''}
    </div></td>`;
    weekDays.forEach(d=>{
      const dkey = fmtKey(d);
      const count = habitDoneCount(habit, dkey);
      const target = habit.target || 1;
      const complete = count >= target;
      cells += `<td><div class="hbox ${complete?'on':''}" data-habit="${habit.id}" data-date="${dkey}">${target>1 ? (count>0?count:'') : checkIcon()}</div></td>`;
    });
    tr.innerHTML = cells;
    body.appendChild(tr);
  });
 
  body.querySelectorAll('.hbox').forEach(box=>{
    box.addEventListener('click', ()=>{
      const hid = box.dataset.habit, dkey = box.dataset.date;
      const habit = data.habits.find(h=>h.id===hid);
      const target = habit.target || 1;
      if(!data.habitLog[hid]) data.habitLog[hid] = {};
      let cur = data.habitLog[hid][dkey] || 0;
      cur = (cur + 1) > target ? 0 : cur + 1;
      data.habitLog[hid][dkey] = cur;
      saveData(); renderAll();
    });
  });
 
  body.querySelectorAll('.habit-name').forEach(nameEl=>{
    nameEl.addEventListener('click', ()=>{
      const hid = nameEl.dataset.hid;
      const habit = data.habits.find(h=>h.id===hid);
      if(!habit) return;
      const newName = prompt('Название привычки:', habit.name);
      if(newName === null) return;
      if(newName.trim() === ''){
        if(confirm(`Удалить привычку "${habit.name}"?`)){
          data.habits = data.habits.filter(h=>h.id!==hid);
          delete data.habitLog[hid];
          saveData(); renderAll();
        }
        return;
      }
      habit.name = newName.trim();
      saveData(); renderAll();
    });
  });
 
  const chart = document.getElementById('weekChart');
  const labels = document.getElementById('weekChartLabels');
  chart.innerHTML = ''; labels.innerHTML = '';
  weekDays.forEach(d=>{
    const dkey = fmtKey(d);
    const p = dayProgress(dkey) || 0;
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = Math.max(p,3) + '%';
    bar.title = p + '%';
    chart.appendChild(bar);
    const lbl = document.createElement('span');
    lbl.textContent = DOW[d.getDay()];
    labels.appendChild(lbl);
  });
}
 
document.getElementById('addHabitBtn').addEventListener('click', addHabit);
document.getElementById('habitInput').addEventListener('keydown', e=>{ if(e.key==='Enter') addHabit(); });
function addHabit(){
  const inp = document.getElementById('habitInput');
  const val = inp.value.trim();
  if(!val) return;
  const target = +document.getElementById('habitTargetSelect').value;
  data.habits.push({ id: 'h'+Date.now(), name: val, target });
  inp.value = '';
  saveData(); renderAll();
  showToast('Привычка добавлена');
}
 
