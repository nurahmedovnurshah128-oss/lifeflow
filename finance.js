// ==========================================================
// FINANCE.JS
// ==========================================================
let activeTxFilter = 'all';
 
function fmtMoney(n){ return Math.round(n).toLocaleString('ru-RU') + ' ₽'; }
 
function renderFinance(){
  const monthKey = fmtMonthKey(selectedDate);
  document.getElementById('financeMonthLabel').textContent = MONTHS[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear();
 
  const txThisMonth = data.finance.transactions.filter(t => t.date.startsWith(monthKey));
  const income = txThisMonth.filter(t=>t.type==='in').reduce((s,t)=>s+t.amount,0);
  const expense = txThisMonth.filter(t=>t.type==='out').reduce((s,t)=>s+t.amount,0);
  const balance = income - expense;
  const budget = data.finance.budgetByMonth[monthKey] || 0;
  const budgetLeft = budget - expense;
 
  document.getElementById('fIncome').textContent = fmtMoney(income);
  document.getElementById('fExpense').textContent = fmtMoney(expense);
  document.getElementById('fBalance').textContent = fmtMoney(balance);
  document.getElementById('fBudgetLeft').textContent = budget ? fmtMoney(budgetLeft) : '—';
 
  const pct = budget ? Math.min(100, Math.round((expense/budget)*100)) : 0;
  document.getElementById('budgetPct').textContent = budget ? pct+'%' : 'не задан';
  const bar = document.getElementById('budgetBar');
  bar.style.width = pct + '%';
  bar.classList.toggle('over', expense > budget && budget>0);
  document.getElementById('budgetInput').value = budget || '';
 
  const byCat = {};
  txThisMonth.filter(t=>t.type==='out').forEach(t=>{ byCat[t.category] = (byCat[t.category]||0) + t.amount; });
  const catEntries = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxCat = Math.max(1, ...catEntries.map(e=>e[1]));
  const eChart = document.getElementById('expenseChart');
  const eLabels = document.getElementById('expenseChartLabels');
  eChart.innerHTML=''; eLabels.innerHTML='';
  if(catEntries.length===0){ eChart.innerHTML = '<div class="empty-hint" style="display:block;width:100%;">Пока нет расходов</div>'; }
  catEntries.forEach(([cat,val])=>{
    const bar2 = document.createElement('div');
    bar2.className = 'chart-bar money';
    bar2.style.height = Math.max((val/maxCat)*100, 4)+'%';
    bar2.title = cat+': '+fmtMoney(val);
    eChart.appendChild(bar2);
    const lbl = document.createElement('span');
    lbl.textContent = cat.length>6 ? cat.slice(0,5)+'…' : cat;
    eLabels.appendChild(lbl);
  });
 
  let filtered = txThisMonth;
  if(activeTxFilter !== 'all') filtered = filtered.filter(t=>t.type===activeTxFilter);
  filtered = filtered.slice().sort((a,b)=> b.date.localeCompare(a.date));
 
  const txList = document.getElementById('txList');
  txList.innerHTML = '';
  document.getElementById('txEmptyHint').style.display = filtered.length ? 'none' : 'block';
  document.getElementById('txCount').textContent = filtered.length;
 
  filtered.forEach(tx=>{
    const row = document.createElement('div');
    row.className = 'money-row';
    const d = new Date(tx.date);
    row.innerHTML = `
      <div class="money-icon ${tx.type}">${tx.type==='in'?'↑':'↓'}</div>
      <div class="money-info">
        <div class="money-cat">${escapeHtml(tx.category)}</div>
        <div class="money-note">${tx.note ? escapeHtml(tx.note)+' · ' : ''}${d.getDate()} ${MONTHS[d.getMonth()]}</div>
      </div>
      <div class="money-amt ${tx.type}">${tx.type==='in'?'+':'-'}${fmtMoney(tx.amount)}</div>
      <div class="task-del" data-txid="${tx.id}">✕</div>
    `;
    txList.appendChild(row);
  });
  txList.querySelectorAll('.task-del').forEach(del=>{
    del.addEventListener('click', ()=>{
      data.finance.transactions = data.finance.transactions.filter(t=>t.id!==del.dataset.txid);
      saveData(); renderAll();
    });
  });
}
 
document.getElementById('setBudgetBtn').addEventListener('click', ()=>{
  const monthKey = fmtMonthKey(selectedDate);
  const val = +document.getElementById('budgetInput').value || 0;
  data.finance.budgetByMonth[monthKey] = val;
  saveData(); renderAll();
  showToast('Бюджет обновлён');
});
 
document.querySelectorAll('#txFilter .seg-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('#txFilter .seg-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeTxFilter = btn.dataset.f;
    renderFinance();
  });
});
 
const moneyModal = document.getElementById('moneyModal');
let moneyType = 'out';
function openMoneyModal(){
  populateCategorySelect(document.getElementById('moneyCategory'));
  document.getElementById('moneyDate').value = fmtKey(selectedDate);
  document.getElementById('moneyAmount').value = '';
  document.getElementById('moneyNote').value = '';
  moneyModal.classList.add('show');
}
document.getElementById('quickAddFab').addEventListener('click', openMoneyModal);
document.getElementById('moneyCancelBtn').addEventListener('click', ()=> moneyModal.classList.remove('show'));
moneyModal.addEventListener('click', e=>{ if(e.target===moneyModal) moneyModal.classList.remove('show'); });
 
document.querySelectorAll('#moneyTypeSeg .seg-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('#moneyTypeSeg .seg-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    moneyType = btn.dataset.type;
  });
});
 
document.getElementById('moneySaveBtn').addEventListener('click', ()=>{
  const amount = +document.getElementById('moneyAmount').value;
  if(!amount || amount<=0){ showToast('Укажи сумму'); return; }
  const category = document.getElementById('moneyCategory').value;
  const date = document.getElementById('moneyDate').value || fmtKey(new Date());
  const note = document.getElementById('moneyNote').value.trim();
  data.finance.transactions.push({ id:'tx'+Date.now(), type:moneyType, amount, category, note, date });
  saveData();
  moneyModal.classList.remove('show');
  renderAll();
  showToast('Операция сохранена');
});
