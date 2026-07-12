// ==========================================================
// AUTH.JS — вход, регистрация, Google-логин, выход
// ==========================================================
let firebaseApp, auth, db;
let currentUser = null;
 
function initFirebase(){
  try{
    firebaseApp = firebase.initializeApp(window.firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    return true;
  }catch(e){
    console.error('Firebase init error', e);
    showLoginError('Ошибка настройки Firebase. Проверь firebase-config.js');
    return false;
  }
}
 
function showLoginError(msg){
  const el = document.getElementById('loginError');
  el.textContent = msg;
  el.classList.add('show');
}
function clearLoginError(){
  document.getElementById('loginError').classList.remove('show');
}
 
function translateAuthError(code){
  const map = {
    'auth/invalid-email': 'Некорректный email',
    'auth/user-not-found': 'Пользователь не найден',
    'auth/wrong-password': 'Неверный пароль',
    'auth/email-already-in-use': 'Этот email уже зарегистрирован',
    'auth/weak-password': 'Пароль слишком простой (минимум 6 символов)',
    'auth/invalid-credential': 'Неверный email или пароль',
    'auth/popup-closed-by-user': 'Окно входа закрыто',
    'auth/network-request-failed': 'Проблема с сетью'
  };
  return map[code] || 'Ошибка входа. Попробуй снова.';
}
 
document.getElementById('loginSubmitBtn').addEventListener('click', ()=>{
  clearLoginError();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  if(!email || !pass){ showLoginError('Заполни email и пароль'); return; }
  auth.signInWithEmailAndPassword(email, pass).catch(err=>{
    showLoginError(translateAuthError(err.code));
  });
});
 
document.getElementById('registerSubmitBtn').addEventListener('click', ()=>{
  clearLoginError();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  if(!email || !pass){ showLoginError('Заполни email и пароль'); return; }
  if(pass.length < 6){ showLoginError('Пароль должен быть от 6 символов'); return; }
  auth.createUserWithEmailAndPassword(email, pass).catch(err=>{
    showLoginError(translateAuthError(err.code));
  });
});
 
document.getElementById('googleLoginBtn').addEventListener('click', ()=>{
  clearLoginError();
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err=>{
    showLoginError(translateAuthError(err.code));
  });
});
 
document.getElementById('logoutBtn').addEventListener('click', ()=>{
  if(confirm('Выйти из аккаунта?')) auth.signOut();
});
 
function onAuthReady(callback){
  auth.onAuthStateChanged(user=>{
    currentUser = user;
    if(user){
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      callback(user);
    } else {
      document.getElementById('app').style.display = 'none';
      document.getElementById('loginScreen').style.display = 'flex';
    }
  });
}
 
