let currentTabId='newMatch'; let depositType='in';
function state(){ return JSON.parse(localStorage.getItem('qatiyaState')||'{"players":[],"matches":[],"deposits":[],"teams":{},"settings":{}}'); }
function saveState(s){ localStorage.setItem('qatiyaState',JSON.stringify(s)); }
function showTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  const el = document.getElementById(id); if(el) el.classList.add('active'); currentTabId=id;
}
function setDepositType(type){
  depositType=type;
  document.getElementById('depositTypeIn').classList.remove('selectedDepositBtn');
  document.getElementById('depositTypeOut').classList.remove('selectedDepositBtn');
  document.getElementById('depositTypeLate').classList.remove('selectedDepositBtn');
  if(type==='in') document.getElementById('depositTypeIn').classList.add('selectedDepositBtn');
  if(type==='debt') document.getElementById('depositTypeOut').classList.add('selectedDepositBtn');
  if(type==='late') document.getElementById('depositTypeLate').classList.add('selectedDepositBtn');
}
function exportData(){
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state()));
  let a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "qatiya_backup.json");
  document.body.appendChild(a); a.click(); a.remove();
}
function importData(e){
  let reader = new FileReader();
  reader.onload = function(event){
    try { let parsed = JSON.parse(event.target.result); if(parsed) { saveState(parsed); alert('تم استيراد البيانات بنجاح!'); location.reload(); } } catch(err) { alert('ملف غير صالح'); }
  };
  reader.readAsText(e.target.files[0]);
}