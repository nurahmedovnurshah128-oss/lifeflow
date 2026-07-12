// ==========================================================
// GOALS.JS — долгосрочные цели с прогрессом
// ==========================================================
function renderGoals(){
  const list = document.getElementById('goalList');
  list.innerHTML = '';
  document.getElementById('goalEmptyHint').style.display = data.goals.length ? 'none' : 'block';
  document.getElementById('goalCount').textContent = data.goals.length;
 
  data.goals.forEach((goal, idx)=>{
    const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current/goal.target)*100)) : 0;
    const card = document.createElement('div');
    card.className = 'goal-card';
    card.innerHTML = `
      <div class="goal-top">
        <div class="goal-name">${escapeHtml(goal.name)}</div>
        <div class="goal-progress-text">${goal.current}/${goal.target}</div>
      </div>
      <div class="goal-bar-bg"><div class="goal-bar-fg" style="width:${pct}%"></div></div>
      <div class="goal-actions">
        <div class="goal-btn" data-act="minus" data-idx="${idx}">−</div>
        <div class="goal-btn" data-act="plus" data-idx="${idx}">+</div>
        <div class="goal-btn goal-del" data-act="del" data-idx="${idx}">Удалить</div>
      </div>
    `;
    list.appendChild(card);
  });
 
  list.querySelectorAll('.goal-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = +btn.dataset.idx;
      const act = btn.dataset.act;
      const goal = data.goals[idx];
      if(act==='plus') goal.current = Math.min(goal.target, goal.current+1);
      if(act==='minus') goal.current = Math.max(0, goal.current-1);
      if(act==='del'){
        if(!confirm(`Удалить цель "${goal.name}"?`)) return;
        data.goals.splice(idx,1);
      }
      saveData(); renderGoals();
    });
  });
}
 
document.getElementById('addGoalBtn').addEventListener('click', ()=>{
  const nameInp = document.getElementById('goalInput');
  const targetInp = document.getElementById('goalTargetInput');
  const name = nameInp.value.trim();
  const target = +targetInp.value || 1;
  if(!name) return;
  data.goals.push({ id:'g'+Date.now(), name, target, current:0 });
  nameInp.value = ''; targetInp.value = '';
  saveData(); renderGoals();
  showToast('Цель добавлена');
});
 
