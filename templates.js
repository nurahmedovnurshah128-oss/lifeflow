// ==========================================================
// TEMPLATES.JS — сохранение и применение шаблонов дня
// ==========================================================
function renderTemplates(){
  const list = document.getElementById('templateList');
  list.innerHTML = '';
  if(data.templates.length === 0){
    list.innerHTML = '<div class="empty-hint" style="display:block;">Пока нет шаблонов</div>';
  }
  data.templates.forEach((tpl, idx)=>{
    const row = document.createElement('div');
    row.className = 'template-row';
    row.innerHTML = `
      <div class="template-name">${escapeHtml(tpl.name)} <span style="color:var(--ink-soft);font-weight:400;">(${tpl.tasks.length} задач)</span></div>
      <div class="template-apply" data-idx="${idx}">Применить</div>
      <div class="template-del" data-idx="${idx}">✕</div>
    `;
    list.appendChild(row);
  });
 
  list.querySelectorAll('.template-apply').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const tpl = data.templates[+btn.dataset.idx];
      const key = fmtKey(selectedDate);
      const day = getDay(key);
      tpl.tasks.forEach(t=> day.tasks.push({...t, done:false}));
      saveData(); renderAll();
      showToast('Шаблон применён');
    });
  });
  list.querySelectorAll('.template-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      data.templates.splice(+btn.dataset.idx,1);
      saveData(); renderTemplates();
    });
  });
}
 
document.getElementById('saveTemplateBtn').addEventListener('click', ()=>{
  const nameInp = document.getElementById('templateNameInput');
  const name = nameInp.value.trim();
  if(!name) { showToast('Введи название шаблона'); return; }
  const key = fmtKey(selectedDate);
  const day = getDay(key);
  if(day.tasks.length === 0){ showToast('На сегодня нет задач'); return; }
  data.templates.push({
    id:'tpl'+Date.now(), name,
    tasks: day.tasks.map(t=>({ text:t.text, prio:t.prio, cat:t.cat, time:t.time }))
  });
  nameInp.value = '';
  saveData(); renderTemplates();
  showToast('Шаблон сохранён');
});
 
