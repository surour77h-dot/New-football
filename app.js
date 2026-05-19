let currentTabId='newMatch';
let depositType='in';
let tempGuests=[];

const defaultTabs = [
  {id:'newMatch', label:'لعبة'},
  {id:'teams', label:'الفريقين'},
  {id:'deposits', label:'الإيداعات'},
  {id:'calendar', label:'التقويم'},
  {id:'playerTable', label:'الجدول'},
  {id:'playerFilter', label:'كشف لاعب'},
  {id:'matchLog', label:'السجل'},
  {id:'players', label:'اللاعبين'},
  {id:'reports', label:'التقارير'},
  {id:'settings', label:'الترتيب'},
  {id:'backup', label:'النسخ'}
];

function state(){
  let r=JSON.parse(localStorage.getItem('qatiyaState')||'{"players":[],"matches":[],"deposits":[],"teams":{},"settings":{}}');
  r.players=r.players||[]; r.matches=r.matches||[]; r.deposits=r.deposits||[]; r.teams=r.teams||{}; r.settings=r.settings||{};
  if(!r.settings.pageOrder) r.settings.pageOrder = defaultTabs.map(t=>t.id);
  return r;
}
function saveState(s){ localStorage.setItem('qatiyaState',JSON.stringify(s)); }

function init(){
  renderNav();
  showTab(currentTabId);
  renderPlayersList();
  renderMatchPlayersForm();
  setDepositType('in');
}

function renderNav(){
  let s=state();
  let order = s.settings.pageOrder || defaultTabs.map(t=>t.id);
  let h='';
  order.forEach(id=>{
    let found = defaultTabs.find(t=>t.id===id);
    if(found){
      h+=`<button onclick="showTab('${found.id}')">${found.label}</button>`;
    }
  });
  document.getElementById('mainNav').innerHTML=h;
}

function showTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
  currentTabId=id;
  
  if(id==='players') renderPlayersList();
  if(id==='deposits') { renderDepositSelects(); renderDepositsLog(); }
  if(id==='newMatch') { renderMatchPlayersForm(); }
  if(id==='playerFilter') { renderFilterSelect(); }
  if(id==='settings') { renderSettingsList(); }
}

function addGuestInput(){
  tempGuests.push({name:'', type:'guest'});
  renderGuestInputs();
}

function renderGuestInputs(){
  let h='';
  tempGuests.forEach((g, idx)=>{
    h+=`<div style="display:flex; gap:5px; margin-bottom:5px;">
      <input type="text" placeholder="اسم الضيف أو المدرب" value="${g.name}" oninput="tempGuests(${idx}, this.value)" style="margin-bottom:0;">
      <button type="button" class="danger" onclick="removeGuestInput(${idx})" style="min-height:auto;">حذف</button>
    </div>`;
  });
  document.getElementById('guestsContainer').innerHTML=h;
}
window.tempGuests = function(idx, val){ tempGuests[idx].name = val; }
window.removeGuestInput = function(idx){ tempGuests.splice(idx, 1); renderGuestInputs(); }

function renderMatchPlayersForm(){
  let s=state();
  let h='';
  s.players.forEach(p=>{
    h+=`<div class="player-row">
      <label style="margin:0; font-weight:normal; display:flex; align-items:center; gap:8px;">
        <input type="checkbox" class="match-player-cb" value="${p.id}" style="width:20px; height:20px;"> ${p.name}
      </label>
    </div>`;
  });
  document.getElementById('matchPlayersList').innerHTML=h||'<p class="muted">لا يوجد لاعبين مضافين حالياً</p>';
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

function renderPlayersList(){
  let s=state(); let h='';
  s.players.forEach(p=>{
    h+=`<div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:10px 15px;">
      <span style="font-weight:bold;">${p.name}</span>
      <button class="danger" onclick="deletePlayer('${p.id}')">حذف</button>
    </div>`;
  });
  document.getElementById('playersList').innerHTML=h;
}

function addPlayer(){
  let name=document.getElementById('newPlayerName').value.trim();
  if(!name) return;
  let s=state(); s.players.push({id:Date.now().toString(), name:name});
  saveState(s); document.getElementById('newPlayerName').value=''; renderPlayersList(); renderMatchPlayersForm();
}

function deletePlayer(id){
  if(confirm('هل أنت متأكد من حذف هذا اللاعب؟')){
    let s=state(); s.players=s.players.filter(p=>p.id!==id); saveState(s); renderPlayersList(); renderMatchPlayersForm();
  }
}

function renderDepositSelects(){
  let s=state();
  let opts='<option value="">اختر لاعب...</option>';
  s.players.forEach(p=>{ opts+=`<option value="${p.id}">${p.name}</option>`; });
  document.getElementById('depositPlayerSelect').innerHTML=opts;
}

function renderFilterSelect(){
  let s=state();
  let opts='<option value="">اختر لاعب...</option>';
  s.players.forEach(p=>{ opts+=`<option value="${p.id}">${p.name}</option>`; });
  document.getElementById('playerFilterSelect').innerHTML=opts;
}

function saveDeposit(){
  let pId=document.getElementById('depositPlayerSelect').value;
  let amt=parseFloat(document.getElementById('depositAmount').value)||0;
  if(!pId || amt<=0) { alert('يرجى اختيار اللاعب وتحديد المبلغ بشكل صحيح'); return; }
  let s=state();
  s.deposits.push({
    id:Date.now().toString(),
    playerId:pId,
    amount:amt,
    type:depositType,
    date:new Date().toISOString().split('T')[0]
  });
  saveState(s);
  document.getElementById('depositAmount').value='0';
  renderDepositsLog();
  alert('تم حفظ العملية بنجاح');
}

function renderDepositsLog(){
  let s=state(); let h='';
  s.deposits.slice().reverse().forEach(d=>{
    let p = s.players.find(x=>x.id===d.playerId);
    let name = p?p.name:'لاعب محذوف';
    let typeTxt = d.type==='in'?'إيداع':(d.type==='late'?'تأخير':'خصم');
    h+=`<div class="card" style="padding:10px 15px; margin-bottom:8px;">
      <strong>${name}</strong> - <span class="muted">${typeTxt}:</span> ${d.amount} د.ك <small style="float:left;">${d.date}</small>
    </div>`;
  });
  document.getElementById('depositsLog').innerHTML=h;
}

function renderSettingsList(){
  let s=state();
  let order = s.settings.pageOrder;
  let h='';
  order.forEach((id, idx)=>{
    let found = defaultTabs.find(t=>t.id===id);
    if(found){
      h+=`<div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 15px; margin-bottom:8px;">
        <span>${found.label}</span>
        <div>
          <button onclick="movePage(${idx}, -1)" ${idx===0?'disabled':''}>⬆️</button>
          <button onclick="movePage(${idx}, 1)" ${idx===order.length-1?'disabled':''}>⬇️</button>
        </div>
      </div>`;
    }
  });
  document.getElementById('pageOrderList').innerHTML=h;
}

window.movePage = function(idx, dir){
  let s=state();
  let order = s.settings.pageOrder;
  let target = idx + dir;
  if(target >= 0 && target < order.length){
    let temp = order[idx];
    order[idx] = order[target];
    order[target] = temp;
    s.settings.pageOrder = order;
    saveState(s);
    renderSettingsList();
    renderNav();
  }
}

function exportData(){
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state()));
  let downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "qatiya_football_backup.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importData(e){
  let file = e.target.files[0];
  if(!file) return;
  let reader = new FileReader();
  reader.onload = function(event){
    try {
      let parsed = JSON.parse(event.target.result);
      if(parsed && (parsed.players || parsed.matches || parsed.deposits)) {
        saveState(parsed);
        alert('تم استيراد واستعادة ملف البيانات بنجاح تام! سيتم إعادة تحديث الصفحة الآن.');
        location.reload();
      } else {
        alert('الملف المرفوع لا يحتوي على بنية بيانات القروب الصحيحة.');
      }
    } catch(err) {
      alert('فشل قراءة الملف، تأكد من اختيار ملف مدعوم وصحيح بصيغة .json');
    }
  };
  reader.readAsText(file);
}

window.onload = init;
