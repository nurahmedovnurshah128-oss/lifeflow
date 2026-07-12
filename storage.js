// ==========================================================
// STORAGE.JS — облачное сохранение (Firestore) + офлайн-кэш
// ==========================================================
const LOCAL_KEY = 'lifeflow_cache_v1';
 
function defaultData(){
  return {
    days: {},
    habits: [],
    habitLog: {},
    weekGoals: {},
    goals: [],
    categories: ['Работа','Дом','Здоровье','Учёба','Личное'],
    finance: { budgetByMonth: {}, transactions: [] },
    templates: [],
    theme: 'light'
  };
}
 
let data = defaultData();
let saveDebounceTimer = null;
let firestoreUnsub = null;
 
function loadLocalCache(){
  try{
    const raw = localStorage.getItem(LOCAL_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return null;
}
function saveLocalCache(){
  try{ localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); }catch(e){}
}
 
function mergeIntoDefault(loaded){
  const def = defaultData();
  const merged = Object.assign(def, loaded || {});
  merged.finance = Object.assign(def.finance, (loaded && loaded.finance) || {});
  return merged;
}
 
// Called once user is authenticated
function initStorageForUser(user){
  const cached = loadLocalCache();
  if(cached) data = mergeIntoDefault(cached);
 
  const docRef = db.collection('users').doc(user.uid).collection('data').doc('main');
 
  docRef.get().then(snap=>{
    if(snap.exists){
      data = mergeIntoDefault(snap.data());
      saveLocalCache();
    } else {
      docRef.set(data);
    }
    if(typeof renderAll === 'function') renderAll();
  }).catch(err=>{
    console.warn('Firestore недоступен, работаем офлайн', err);
    if(typeof renderAll === 'function') renderAll();
  });
 
  if(firestoreUnsub) firestoreUnsub();
  firestoreUnsub = docRef.onSnapshot(snap=>{
    if(!snap.exists) return;
    const remote = snap.data();
    if(JSON.stringify(remote) !== JSON.stringify(data)){
      data = mergeIntoDefault(remote);
      saveLocalCache();
      if(typeof renderAll === 'function') renderAll();
    }
  }, err=> console.warn('Sync error', err));
}
 
// Call this after ANY data mutation
function saveData(){
  saveLocalCache();
  clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(()=>{
    if(!currentUser) return;
    const docRef = db.collection('users').doc(currentUser.uid).collection('data').doc('main');
    docRef.set(data).catch(err=> console.warn('Cloud save failed, saved locally', err));
  }, 600);
}
 
function exportData(){
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lifeflow-backup-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
 
function importDataFromFile(file, onDone){
  const reader = new FileReader();
  reader.onload = evt=>{
    try{
      const imported = JSON.parse(evt.target.result);
      data = mergeIntoDefault(imported);
      saveData();
      onDone(true);
    }catch(e){
      onDone(false);
    }
  };
  reader.readAsText(file);
}
 
function resetAllData(){
  data = defaultData();
  saveData();
}
 
