// ==================== نظام اللغتين والترجمة ====================
let currentLang = localStorage.getItem('qatiyaLang') || 'ar';

const i18n = {
  ar: {
    pageTitle: "🏆 سجل وحسابات ⚽️ قروب الكورة 🏆",
    mainHeader: "🏆 سجل وحسابات ⚽️ قروب الكورة 🏆",
    langBtn: "English",
    tab_newMatch: "لعبة",
    tab_teams: "الفريقين",
    tab_deposits: "الإيداعات",
    tab_calendar: "التقويم",
    tab_playerTable: "الجدول",
    tab_playerFilter: "كشف لاعب",
    tab_matchLog: "السجل",
    tab_players: "اللاعبين",
    tab_settings: "الترتيب",
    tab_backup: "النسخ",
    matchFormTitle: "لعبة جديدة",
    matchFormTitleEdit: "تعديل لعبة",
    lblMatchDate: "تاريخ اللعب",
    lblPlace: "المكان",
    lblBookingCost: "الحجز",
    lblNeededPlayers: "العدد",
    lblPricePerPlayer: "سعر اللاعب:",
    lblParticipants: "المشاركون",
    lblAddGuest: "إضافة ضيف",
    btnBtnAddGuest: "إضافة ضيف",
    btnSaveMatch: "حفظ",
    btnClearMatch: "تفريغ",
    lblPlayersTitle: "اللاعبين",
    btnAddPlayer: "إضافة",
    btnEditPlayer: "تعديل",
    btnDeletePlayer: "حذف",
    lblDepositsTitle: "الإيداعات",
    lblDepositDate: "تاريخ الإيداع",
    lblDepositPlayer: "اللاعب",
    lblDepositAmount: "المبلغ",
    btnSaveDeposit: "حفظ",
    btnClearDeposit: "تفريغ",
    lblCalendarTitle: "التقويم",
    btnPrevMonth: "السابق",
    btnNextMonth: "التالي",
    calendarSelectedTitle: "المشاركون",
    lblMatchLogTitle: "سجل اللعب",
    lblAllOperations: "جميع العمليات",
    lblTeamsTitle: "الفريقين",
    lblTeamsMatchSelect: "اللعبة",
    btnRandomTeams: "تقسيم عشوائي",
    btnSaveTeams: "حفظ الفريقين",
    lblPlayerTableTitle: "جدول اللاعبين",
    lblReportsTitle: "التقارير",
    lblPlayerFilterTitle: "كشف لاعب",
    lblSelectPlayer: "اختر اللاعب",
    lblSettingsTitle: "ترتيب الصفحات",
    lblSettingsDesc: "اختر الصفحة ثم حرّكها للأعلى أو للأسفل، وسيتم حفظ الترتيب تلقائيًا.",
    lblBackupTitle: "النسخة الاحتياطية",
    btnExportData: "تصدير البيانات",
    lblImportData: "استيراد",
    btnSaveEditPage: "حفظ التعديل",
    btnCancelEditPage: "إلغاء",
    editPageTitleMatch: "تعديل اللعبة",
    editPageTitleDeposit: "تعديل الإيداع",
    // نصوص ديناميكية وتنبيهات
    initialDeposit: "إيداع مبدئي",
    lateDeposit: "تأخير",
    debtDeposit: "خصم",
    inDeposit: "إيداع",
    noData: "لا يوجد",
    noGames: "لا توجد ألعاب محفوظة.",
    noOps: "لا توجد عمليات",
    total: "المجموع",
    summary_deposits: "الإيداعات",
    summary_gamesCount: "عدد اللعب",
    summary_deductions: "الخصومات",
    summary_balance: "الرصيد",
    summary_players: "اللاعبين",
    summary_matches: "الألعاب",
    summary_totalBalance: "إجمالي الرصيد",
    daysPlayed: "أيام اللعب",
    depAndDebts: "الإيداعات والمديونيات",
    broughtNames: "الأسماء التي أحضرها",
    addedNames: "الأسماء المضافة",
    editParticipantsAndGuests: "تعديل المشاركين والأسماء المضافة",
    teamFirst: "الفريق الأول",
    teamSecond: "الفريق الثاني",
    noTeam: "بدون فريق",
    clickCalendar: "اضغط على يوم من التقويم.",
    noGameDate: "لا توجد لعبة بهذا التاريخ.",
    gamePrice: "السعر",
    gamePlayers: "المشاركين",
    gamePlay: "لعب",
    choosePlayer: "اختر لاعب",
    firstSavePreset: "احفظ أول مبلغ ليظهر كزر سريع.",
    alertWriteName: "اكتب اسم اللاعب",
    alertPlayerExists: "اللاعب موجود",
    alertNewName: "اكتب الاسم الجديد",
    alertNameExists: "الاسم موجود",
    alertDeleteConfirm: "حذف ؟",
    alertChooseMember: "اكتب اسم الواختر العضو",
    alertWriteDate: "اكتب التاريخ بالشكل 11-5-2026",
    alertEnterCost: "أدخل سعر الحجز وعدد اللاعبين",
    alertSelectParticipants: "اختر المشاركين أو أضف ضيوف",
    alertSaved: "تم الحفظ",
    alertDeleteMatch: "حذف اللعبة؟",
    alertChoosePlayerAmount: "اختر اللاعب واكتب مبلغ صحيح",
    alertDeleteDeposit: "حذف الإيداع؟",
    alertSavedTeams: "تم حفظ الفريقين",
    alertImported: "تم الاستيراد",
    placePlaceholder: "اختياري",
    guestNamePlaceholder: "اسم الضيف",
    playerNamePlaceholder: "اسم اللاعب",
    thM: "م",
    thName: "الاسم",
    thBalance: "الرصيد",
    thGames: "لعب",
    thLastGame: "آخر لعب",
    thLastGameReport: "آخر لعبة",
    thDepositsReport: "الإيداعات",
    depositTypeInBtn: "إيداع",
    depositTypeOutBtn: "خصم/مديونية",
    depositTypeLateBtn: "تأخير"
  },
  en: {
    pageTitle: "🏆 Log & Accounts ⚽️ Football Group 🏆",
    mainHeader: "🏆 Log & Accounts ⚽️ Football Group 🏆",
    langBtn: "العربية",
    tab_newMatch: "Game",
    tab_teams: "Teams",
    tab_deposits: "Deposits",
    tab_calendar: "Calendar",
    tab_playerTable: "Table",
    tab_playerFilter: "Player Sheet",
    tab_matchLog: "Log",
    tab_players: "Players",
    tab_settings: "Order",
    tab_backup: "Backup",
    matchFormTitle: "New Game",
    matchFormTitleEdit: "Edit Game",
    lblMatchDate: "Match Date",
    lblPlace: "Location",
    lblBookingCost: "Booking Cost",
    lblNeededPlayers: "Players Needed",
    lblPricePerPlayer: "Price per Player:",
    lblParticipants: "Participants",
    lblAddGuest: "Add Guest",
    btnBtnAddGuest: "Add Guest",
    btnSaveMatch: "Save",
    btnClearMatch: "Clear",
    lblPlayersTitle: "Players",
    btnAddPlayer: "Add",
    btnEditPlayer: "Edit",
    btnDeletePlayer: "Delete",
    lblDepositsTitle: "Deposits",
    lblDepositDate: "Deposit Date",
    lblDepositPlayer: "Player",
    lblDepositAmount: "Amount",
    btnSaveDeposit: "Save",
    btnClearDeposit: "Clear",
    lblCalendarTitle: "Calendar",
    btnPrevMonth: "Prev",
    btnNextMonth: "Next",
    calendarSelectedTitle: "Participants",
    lblMatchLogTitle: "Match Log",
    lblAllOperations: "All Operations",
    lblTeamsTitle: "Teams",
    lblTeamsMatchSelect: "Game",
    btnRandomTeams: "Random Split",
    btnSaveTeams: "Save Teams",
    lblPlayerTableTitle: "Players Table",
    lblReportsTitle: "Reports",
    lblPlayerFilterTitle: "Player Sheet",
    lblSelectPlayer: "Select Player",
    lblSettingsTitle: "Page Order",
    lblSettingsDesc: "Select page then move up or down. Order is auto-saved.",
    lblBackupTitle: "Backup",
    btnExportData: "Export Data",
    lblImportData: "Import",
    btnSaveEditPage: "Save Changes",
    btnCancelEditPage: "Cancel",
    editPageTitleMatch: "Edit Match",
    editPageTitleDeposit: "Edit Deposit",
    initialDeposit: "Initial Deposit",
    lateDeposit: "Late fee",
    debtDeposit: "Deduction",
    inDeposit: "Deposit",
    noData: "None",
    noGames: "No saved games.",
    noOps: "No operations found",
    total: "Total",
    summary_deposits: "Deposits",
    summary_gamesCount: "Games Played",
    summary_deductions: "Deductions",
    summary_balance: "Balance",
    summary_players: "Players",
    summary_matches: "Games",
    summary_totalBalance: "Total Balance",
    daysPlayed: "Days Played",
    depAndDebts: "Deposits & Debts",
    broughtNames: "Brought Guests",
    addedNames: "Added Names",
    editParticipantsAndGuests: "Edit Participants & Guests",
    teamFirst: "First Team",
    teamSecond: "Second Team",
    noTeam: "No Team",
    clickCalendar: "Click on a calendar day.",
    noGameDate: "No game on this date.",
    gamePrice: "Price",
    gamePlayers: "Participants",
    gamePlay: "Play",
    choosePlayer: "Choose Player",
    firstSavePreset: "Save first amount to show quick button.",
    alertWriteName: "Please write player name",
    alertPlayerExists: "Player already exists",
    alertNewName: "Please write the new name",
    alertNameExists: "Name already exists",
    alertDeleteConfirm: "Delete ",
    alertChooseMember: "Write name and choose member",
    alertWriteDate: "Write date format as 11-5-2026",
    alertEnterCost: "Enter booking cost and players count",
    alertSelectParticipants: "Select participants or add guests",
    alertSaved: "Saved successfully",
    alertDeleteMatch: "Delete this game?",
    alertChoosePlayerAmount: "Select player and enter a valid amount",
    alertDeleteDeposit: "Delete this deposit?",
    alertSavedTeams: "Teams saved successfully",
    alertImported: "Imported successfully",
    placePlaceholder: "Optional",
    guestNamePlaceholder: "Guest Name",
    playerNamePlaceholder: "Player Name",
    thM: "No.",
    thName: "Name",
    thBalance: "Balance",
    thGames: "Played",
    thLastGame: "Last Match",
    thLastGameReport: "Last Match",
    thDepositsReport: "Deposits",
    depositTypeInBtn: "Deposit",
    depositTypeOutBtn: "Deduction/Debt",
    depositTypeLateBtn: "Late"
  }
};

function msg(key) {
  return i18n[currentLang][key] || key;
}

function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('qatiyaLang', currentLang);
  applyLanguageHTML();
  renderAll();
}

function applyLanguageHTML() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  
  // ترجمة العناصر الثابتة التي تملك ID
  Object.keys(i18n[currentLang]).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.tagName === 'INPUT') {
        el.placeholder = msg(key);
      } else {
        el.textContent = msg(key);
      }
    }
  });

  // ترجمة الـ Placeholders يدوياً للأشياء الديناميكية
  const placeEl = document.getElementById('place');
  if (placeEl) placeEl.placeholder = msg('placePlaceholder');
  const guestNameEl = document.getElementById('guestName');
  if (guestNameEl) guestNameEl.placeholder = msg('guestNamePlaceholder');
  const playerNameEl = document.getElementById('playerName');
  if (playerNameEl) playerNameEl.placeholder = msg('playerNamePlaceholder');
  
  // تحديث أزرار الإيداع الثابتة نصوصها
  const depIn = document.getElementById('depositTypeIn');
  if (depIn) depIn.textContent = msg('depositTypeInBtn');
  const depOut = document.getElementById('depositTypeOut');
  if (depOut) depOut.textContent = msg('depositTypeOutBtn');
  const depLate = document.getElementById('depositTypeLate');
  if (depLate) depLate.textContent = msg('depositTypeLateBtn');
}

// تعديل أسماء التبويبات الافتراضية لتعتمد على اللغة
const defaultPages = [
 ['newMatch', 'tab_newMatch'],
 ['teams', 'tab_teams'],
 ['deposits', 'tab_deposits'],
 ['calendar', 'tab_calendar'],
 ['playerTable', 'tab_playerTable'],
 ['playerFilter', 'tab_playerFilter'],
 ['matchLog', 'tab_matchLog'],
 ['players', 'tab_players'],
 ['settings', 'tab_settings'],
 ['backup', 'tab_backup']
];

function getPageOrder(){
 const s=state();
 return s.settings.pageOrder || defaultPages.map(x=>x[0]);
}

function latestPlayedDateOnly(b){
  return Object.values(b||{}).map(x=>x.last||'').filter(Boolean).sort().pop()||'';
}

function isLatestPlayedDate(b,lastDate){
  if(!lastDate)return false;
  const latest=Object.values(b||{}).map(x=>x.last||'').filter(Boolean).sort().pop();
  return latest===lastDate;
}

function depositTypeLabel(d){
 const dt=(d.date||'').replace(/-/g,'/');
 if(dt==='2026/01/01'||dt==='1/1/2026') return msg('initialDeposit');
 if(d.type==='initial') return msg('initialDeposit');
 if(d.type==='late') return msg('lateDeposit');
 if(d.type==='debt') return msg('debtDeposit');
 return msg('inDeposit');
}

let currentTabId='newMatch';
const FREE_START='2026-05-01'; let tempGuests=[]; let selectedCalendarDate=''; let depositType='in'; let tempTeamMap={}; let calendarView=new Date();

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}

function state(){
  const r=JSON.parse(localStorage.getItem('qatiyaState')||'{"players":[],"matches":[],"deposits":[],"teams":{},"settings":{}}');
  r.players=r.players||[]; r.matches=r.matches||[]; r.deposits=r.deposits||[]; r.teams=r.teams||{}; r.settings=r.settings||{};
  r.matches.forEach(m=>{if(!m.id)m.id=uid()});
  r.deposits.forEach(d=>{if(!d.id)d.id=uid()});
  r.players.sort((a,b)=>a.localeCompare(b, currentLang==='ar'?'ar':'en'));
  return r;
}

function save(s){
  s.players.sort((a,b)=>a.localeCompare(b, currentLang==='ar'?'ar':'en'));
  localStorage.setItem('qatiyaState',JSON.stringify(s));
  renderAll();
}

function saveNoRender(s){localStorage.setItem('qatiyaState',JSON.stringify(s))}
function today(){return new Date().toISOString().slice(0,10)}
function money(n){return Number(n||0).toFixed(3)}

function parseDisplayDate(value){
  if(!value)return '';
  value=String(value).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(value))return value;
  const parts=value.split(/[-\/]/).map(x=>x.trim()).filter(Boolean);
  if(parts.length!==3)return '';
  let d=Number(parts[0]),m=Number(parts[1]),y=Number(parts[2]);
  if(!d||!m||!y)return '';
  if(y<100)y+=2000;
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function setDateDisplay(id,iso){
  const el=document.getElementById(id);
  if(el)el.value=formatDateDisplay(iso||today());
}

function getDateValue(id){
  const el=document.getElementById(id);
  return parseDisplayDate(el?.value||'');
}

function formatDateDisplay(dateStr){
  if(!dateStr)return '';
  const parts=String(dateStr).split('-');
  if(parts.length!==3)return dateStr;
  return `${Number(parts[2])}-${Number(parts[1])}-${parts[0]}`;
}

function moneyHideZero(n){
  n=Number(n||0);
  return n===0?'':money(n);
}

function isInactiveFiveMonths(lastDate){
  if(!lastDate)return true;
  const last=new Date(lastDate+'T00:00:00');
  const now=new Date();
  const limit=new Date(now.getFullYear(), now.getMonth()-5, now.getDate());
  return last<=limit;
}

function guestLabel(g){
  return `${g.guest} (${g.owner})`;
}

function moneyBlank(n){n=Number(n||0);return n===0?'':money(n)}

function savePageOrder(order){
 const s=state();
 s.settings.pageOrder=order;
 saveNoRender(s);
 renderNav();
 renderPageOrder();
}

function setActiveNavButton(id){
 document.querySelectorAll('nav button').forEach(b=>{
   b.classList.remove('activeTab');
   const onclick=b.getAttribute('onclick')||'';
   if(onclick.includes(`'${id}'`)) b.classList.add('activeTab');
 });
}

function renderNav(){
 const order=getPageOrder();
 const nav=document.getElementById('mainNav');
 if(!nav)return;
 nav.innerHTML=order.map(id=>{
   const pageKey = defaultPages.find(p => p[0] === id)[1];
   return `<button class="${id===currentTabId?'activeTab':''}" onclick="showTab('${id}')">${msg(pageKey)}</button>`;
 }).join('');
}

function renderPlayerFilter(){
 const wrap=document.getElementById('playerFilterContent');
 const sel=document.getElementById('playerFilterSelect');
 if(!wrap||!sel)return;
 const s=state();
 const player=sel.value;
 if(!player){wrap.innerHTML='';return;}
 const b=balances(s)[player]||{};
 const deposits=s.deposits
   .filter(d=>d.player===player)
   .sort((a,b)=>new Date(b.date||'1900-01-01')-new Date(a.date||'1900-01-01') || (b.createdAt||0)-(a.createdAt||0));
 const games=s.matches
   .filter(m=>(m.players||[]).includes(player))
   .sort((a,b)=>new Date(b.date||'1900-01-01')-new Date(a.date||'1900-01-01'));
 const guestMatches=s.matches
   .filter(m=>(m.guests||[]).some(g=>g.owner===player))
   .sort((a,b)=>new Date(b.date||'1900-01-01')-new Date(a.date||'1900-01-01'));
 const guestDeductTotal=guestMatches.reduce((sum,m)=>sum+(m.guests||[]).filter(g=>g.owner===player).length*Number(m.price||0),0);
 const totalDep=deposits.filter(d=>d.amount>0).reduce((a,b)=>a+b.amount,0);
 const gameDeductTotal=games.reduce((sum,g)=>sum+Number(g.price||0),0);
 const totalDebt=gameDeductTotal+guestDeductTotal;

 wrap.innerHTML=`
 <div class="summaryCards">
   <div class="summaryCard"><span>${msg('summary_deposits')}</span><b class="posText">${moneyBlank(totalDep)}</b></div>
   <div class="summaryCard"><span>${msg('summary_gamesCount')}</span><b>${b.games||''}</b></div>
   <div class="summaryCard"><span>${msg('summary_deductions')}</span><b class="negText">${moneyBlank(totalDebt)}</b></div>
   <div class="summaryCard"><span>${msg('summary_balance')}</span><b class="${(b.balance||0)<0?'negText':(b.balance||0)>0?'posText':''}">${moneyBlank(b.balance)}</b></div>
 </div>

 <div class="card">
   <h3>${msg('daysPlayed')}</h3>
   ${(games.length?games.map(g=>`<div class="item"><span>${formatDateDisplay(g.date)}</span><span class="count">${money(g.price)}</span></div>`).join(''):`<p class="muted">${msg('noData')}</p>`)}
   <div class="item gamesTotalRow"><b>${msg('total')}</b><span class="gamesTotalAmount">${money(gameDeductTotal*-1)}</span></div>
 </div>

 <div class="card">
   <h3>${msg('depAndDebts')}</h3>
   ${(deposits.length?deposits.map(d=>`<div class="item">
     <span>${formatDateDisplay(d.date)}</span>
     <span class="${clsMoney(d.amount)} depoAmountGroup"><b>${depositTypeLabel(d)}</b>&nbsp;&nbsp;${money(d.amount)}</span>
   </div>`).join(''):`<p class="muted">${msg('noData')}</p>`)}
 </div>

 <div class="card">
   <h3>${msg('broughtNames')}</h3>
   ${(guestMatches.length?guestMatches.map(m=>(m.guests||[]).filter(g=>g.owner===player).map(g=>`<div class="item"><span>${formatDateDisplay(m.date)}</span><span style="text-align:center;flex:1;">${g.guest}</span><span class="neg">${money(Number(m.price||0)*-1)}</span></div>`).join('')).join(''):`<p class="muted">${msg('noData')}</p>`)}
   <div class="item guestTotalRow"><b>${msg('total')}</b><span class="guestTotalAmount">${money(guestDeductTotal*-1)}</span></div>
 </div>`;
}

function renderPageOrder(){
 const el=document.getElementById('pageOrderList');
 if(!el)return;
 const order=getPageOrder();
 el.innerHTML=order.map((id,i)=>{
   const pageKey = defaultPages.find(p => p[0] === id)[1];
   return `<div class="item pageOrderItem"><b>${msg(pageKey)}</b><div class="actions"><button onclick="movePage('${id}',-1)">↑</button><button onclick="movePage('${id}',1)">↓</button></div></div>`;
 }).join('');
}

function movePage(id,dir){
 const order=getPageOrder();
 const i=order.indexOf(id);
 const j=i+dir;
 if(i<0||j<0||j>=order.length)return;
 [order[i],order[j]]=[order[j],order[i]];
 savePageOrder(order);
}

function clsMoney(n){n=Number(n||0);return n<0?'neg':n>0?'pos':''}

function updatePrettyDates(){}

function showTab(id){
currentTabId=id;
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
const tab=document.getElementById(id);
if(tab)tab.classList.add('active');
renderAll();
setActiveNavButton(id);
}

function calcPrice(){const c=Number(bookingCost.value||0),n=Number(neededPlayers.value||0);return n>0?c/n:0}
document.addEventListener('change',e=>{if(e.target&&e.target.classList&&e.target.classList.contains('playerCheck'))renderMatchParticipantsPreview();});
document.addEventListener('input',e=>{if(['bookingCost','neededPlayers'].includes(e.target.id))pricePerPlayer.textContent=money(calcPrice())})

function addPlayer(){
  const name=playerName.value.trim();
  if(!name)return alert(msg('alertWriteName'));
  const s=state();
  if(s.players.includes(name))return alert(msg('alertPlayerExists'));
  s.players.push(name);
  playerName.value='';
  save(s);
}

function showPlayerEditBox(){
  const s=state();
  playerActionBox.innerHTML=`<div class="actionBox"><label>${msg('lblSelectPlayer')}<select id="editOld">${s.players.map(p=>`<option>${p}</option>`).join('')}</select></label><label>${msg('lblNewName') || 'New Name'}<input id="editNew"></label><button class="primary wide" onclick="confirmPlayerEdit()">${msg('btnSaveEditPage')}</button></div>`;
}

function confirmPlayerEdit(){
  const oldName=editOld.value,newName=editNew.value.trim();
  if(!newName)return alert(msg('alertNewName'));
  const s=state();
  if(s.players.includes(newName))return alert(msg('alertNameExists'));
  s.players=s.players.map(x=>x===oldName?newName:x);
  s.matches.forEach(m=>{m.players=(m.players||[]).map(x=>x===oldName?newName:x);(m.guests||[]).forEach(g=>{if(g.owner===oldName)g.owner=newName})});
  s.deposits.forEach(d=>{if(d.player===oldName)d.player=newName});
  Object.values(s.teams||{}).forEach(t=>Object.keys(t).forEach(k=>{if(k===oldName){t[newName]=t[k];delete t[k]}}));
  playerActionBox.innerHTML='';
  save(s);
}

function showPlayerDeleteBox(){
  const s=state();
  playerActionBox.innerHTML=`<div class="actionBox"><label>${msg('lblSelectPlayer')}<select id="deletePlayer">${s.players.map(p=>`<option>${p}</option>`).join('')}</select></label><button class="danger wide" onclick="confirmPlayerDelete()">${msg('btnDeletePlayer')}</button></div>`;
}

function confirmPlayerDelete(){
  const name=deletePlayer.value;
  if(!confirm(msg('alertDeleteConfirm') + name + '؟'))return;
  const s=state();
  s.players=s.players.filter(x=>x!==name);
  playerActionBox.innerHTML='';
  save(s);
}

function addGuestTemp(){
  const guest=guestName.value.trim(),owner=guestOwner.value;
  if(!guest||!owner)return alert(msg('alertChooseMember'));
  tempGuests.push({guest,owner});
  guestName.value='';
  renderTempGuests();
}

function removeGuestTemp(i){tempGuests.splice(i,1);renderTempGuests()}

function renderMatchParticipantsPreview(){
  const el=document.getElementById('matchParticipantsPreview');
  if(!el)return;
  const selected=[...document.querySelectorAll('.playerCheck:checked')].map(x=>x.value);
  const rows=[
    ...selected.map(n=>`<div class="chip memberChip">${n}</div>`),
    ...tempGuests.map(g=>`<div class="chip guestChip">${guestLabel(g)}</div>`)
  ];
  el.innerHTML=rows.length?`<h3>${msg('lblParticipants')} <span id="livePlayersGuestsCount" class="liveCount"></span></h3><div class="chipGrid">${rows.join('')}</div>`:'';
}

function renderTempGuests(){
  const el=document.getElementById('tempGuests');
  if(!el) return;
  el.innerHTML=tempGuests.length?`<table><thead><tr><th>${msg('thName')}</th><th>${msg('lblDepositPlayer')}</th></tr></thead><tbody>${tempGuests.map((g,i)=>`<tr><td>${g.guest}</td><td>${g.owner} <button onclick="removeGuestTemp(${i})">×</button></td></tr>`).join('')}</tbody></table>`:'';
  renderMatchParticipantsPreview();
}

function clearMatchForm(){
  editingMatchId.value='';
  document.getElementById('matchFormTitle').textContent=msg('matchFormTitle');
  setDateDisplay('matchDate',today());
  place.value='';bookingCost.value='';neededPlayers.value='';tempGuests=[];
  document.querySelectorAll('.playerCheck').forEach(x=>x.checked=false);
  renderTempGuests();
  pricePerPlayer.textContent='0.000';
}

function saveMatch(){
  const date=getDateValue('matchDate')||today(),bc=Number(bookingCost.value||0),np=Number(neededPlayers.value||0),selected=[...document.querySelectorAll('.playerCheck:checked')].map(x=>x.value);
  if(!date)return alert(msg('alertWriteDate'));
  if(bc<=0||np<=0)return alert(msg('alertEnterCost'));
  if(selected.length===0&&tempGuests.length===0)return alert(msg('alertSelectParticipants'));
  const s=state(),id=editingMatchId.value||uid(),match={id,date,place:place.value.trim(),bookingCost:bc,neededPlayers:np,price:bc/np,players:selected,guests:[...tempGuests]};
  const idx=s.matches.findIndex(m=>m.id===id);
  if(idx>=0)s.matches[idx]=match;else s.matches.push(match);
  editingMatchId.value='';tempGuests=[];
  save(s);clearMatchForm();alert(msg('alertSaved'));
}

function editMatch(id){
  const s=state(),m=s.matches.find(x=>x.id===id);if(!m)return;
  showTab('newMatch');
  editingMatchId.value=m.id;
  document.getElementById('matchFormTitle').textContent=msg('matchFormTitleEdit');
  setDateDisplay('matchDate',m.date);
  place.value=m.place||'';bookingCost.value=m.bookingCost||'';neededPlayers.value=m.neededPlayers||'';
  tempGuests=[...(m.guests||[])];
  renderAll();
  document.querySelectorAll('.playerCheck').forEach(x=>x.checked=(m.players||[]).includes(x.value));
  pricePerPlayer.textContent=money(calcPrice());
  renderTempGuests();
}

function deleteMatch(id){
  if(!confirm(msg('alertDeleteMatch')))return;
  const s=state();s.matches=s.matches.filter(m=>m.id!==id);delete s.teams[id];save(s);
}

function setDepositType(t){
 depositType=t;
 depositTypeIn.className='';
 depositTypeOut.className='';
 const depositTypeLate = document.getElementById('depositTypeLate');
 if(depositTypeLate) depositTypeLate.className='';

 if(t==='in') depositTypeIn.className='primary selectedDepositBtn';
 if(t==='out'||t==='debt') depositTypeOut.className='danger selectedDepositBtn';
 if(t==='late' && depositTypeLate) depositTypeLate.className='lateActive selectedDepositBtn';
}

function getDepositPresets(s){const saved=(s.settings.depositPresets||[]).map(Number).filter(x=>x>0),from=s.deposits.map(d=>Math.abs(Number(d.amount||0))).filter(x=>x>0),del=(s.settings.deletedDepositPresets||[]).map(Number);return[...new Set([...saved,...from])].filter(x=>!del.includes(Number(x))).sort((a,b)=>a-b)}
function setDepositAmount(v){depositAmount.value=money(v)}
function deleteDepositPreset(v){const s=state();v=Number(v);s.settings.deletedDepositPresets=[...new Set([...(s.settings.deletedDepositPresets||[]).map(Number),v])];s.settings.depositPresets=(s.settings.depositPresets||[]).map(Number).filter(x=>x!==v);save(s)}
function addDepositPresetAmount(s,a){a=Math.abs(Number(a||0));if(a<=0)return;s.settings.deletedDepositPresets=(s.settings.deletedDepositPresets||[]).map(Number).filter(x=>x!==a);const p=(s.settings.depositPresets||[]).map(Number);if(!p.includes(a))p.push(a);s.settings.depositPresets=p.sort((x,y)=>x-y)}

function clearDepositForm(){
  editingDepositId.value='';depositAmount.value='';const s=state();
  setDateDisplay('depositDate',s.settings.lastDepositDate||today());setDepositType('in');
}

function saveDeposit(){
  const player=depositPlayer.value;
  let raw=String(depositAmount.value||'').trim();
  let amount=Number(raw);
  const date=getDateValue('depositDate')||today();
  if(!date)return alert(msg('alertWriteDate'));
  if(!player||isNaN(amount)||amount===0)return alert(msg('alertChoosePlayerAmount'));
  if((depositType==='out'||depositType==='debt'||depositType==='late') && amount>0) amount=-amount;
  if(depositType==='in' && amount<0) amount=Math.abs(amount);
  const s=state(),id=editingDepositId.value||uid(),dep={id,player,amount,date,type:depositType,createdAt:Date.now()};
  const idx=s.deposits.findIndex(d=>d.id===id);
  if(idx>=0){ dep.createdAt=s.deposits[idx].createdAt||Date.now(); s.deposits[idx]=dep; }
  else s.deposits.push(dep);
  s.settings.lastDepositDate=date;
  addDepositPresetAmount(s,Math.abs(amount));
  editingDepositId.value='';depositAmount.value='';
  save(s);
}

function editDeposit(id){const s=state(),d=s.deposits.find(x=>x.id===id);if(!d)return;showTab('deposits');editingDepositId.value=d.id;depositPlayer.value=d.player;depositAmount.value=money(Math.abs(d.amount));setDateDisplay('depositDate',d.date);setDepositType(d.amount<0?'out':'in')}
function deleteDeposit(id){if(!confirm(msg('alertDeleteDeposit')))return;const s=state();s.deposits=s.deposits.filter(d=>d.id!==id);save(s)}

function depositOptions(id){
const s=state();
const d=s.deposits.find(x=>x.id===id);
if(!d)return;
const msgBody=`${msg('lblDepositsTitle')}

${msg('lblDepositPlayer')}: ${d.player}
${msg('lblDepositDate')}: ${d.date}
${msg('lblDepositAmount')}: ${money(d.amount)}`;
const act=confirm(msgBody);
if(act){openEditPage('deposit',id,'deposits')}
else{
 if(confirm(msg('alertDeleteDeposit'))) deleteDeposit(id);
}
}

function balances(s){const r={};s.players.forEach(p=>r[p]={balance:0,games:0,free:0,streak:0,guestFreeCredits:0,last:'',deposits:0});s.deposits.forEach(d=>{if(r[d.player]){r[d.player].balance+=Number(d.amount||0);if(Number(d.amount)>0)r[d.player].deposits+=Number(d.amount)}});const ms=[...s.matches].sort((a,b)=>a.date.localeCompare(b.date));ms.forEach((m,idx)=>{const present=new Set(m.players||[]);Object.keys(r).forEach(name=>{if(present.has(name)){let free=false;if(m.date>=FREE_START&&r[name].streak>=5){free=true;r[name].streak=0;r[name].free++}if(!free&&r[name].guestFreeCredits>0){free=true;r[name].guestFreeCredits--;r[name].free++}r[name].games++;r[name].last=m.date;if(!free)r[name].balance-=Number(m.price||0);r[name].streak++}else r[name].streak=0});(m.guests||[]).forEach(g=>{if(r[g.owner])r[g.owner].balance-=Number(m.price||0);const count=ms.slice(0,idx+1).reduce((n,mm)=>n+(mm.guests||[]).filter(x=>x.guest===g.guest&&x.owner===g.owner).length,0);if(count>0&&count%3===0&&r[g.owner])r[g.owner].guestFreeCredits++})});return r}
function participants(m){return[...(m.players||[]),...(m.guests||[]).map(g=>guestLabel(g))]}
function moveMonth(n){calendarView.setMonth(calendarView.getMonth()+n);renderCalendar()}

function renderCalendar(){
  const s=state(),y=calendarView.getFullYear(),mo=calendarView.getMonth(),first=new Date(y,mo,1),last=new Date(y,mo+1,0);
  const localeStr = currentLang === 'ar' ? 'ar-KW' : 'en-US';
  calendarMonthTitle.textContent=calendarView.toLocaleDateString(localeStr,{month:'long',year:'numeric'});
  
  const daysAr = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const daysEn = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const days = currentLang === 'ar' ? daysAr : daysEn;
  
  let html=days.map(d=>`<div class="day"><b>${d}</b></div>`).join('');
  for(let i=0;i<first.getDay();i++)html+='<div></div>';
  for(let d=1;d<=last.getDate();d++){
    const mm=String(mo+1).padStart(2,'0'),dd=String(d).padStart(2,'0'),date=`${y}-${mm}-${dd}`,has=s.matches.some(x=>x.date===date);
    html+=`<div class="day ${has?'hasGame':''} ${selectedCalendarDate===date?'selected':''}" onclick="selectCalendarDate('${date}')"><b>${d}</b>${has?`<br><span class="small">${msg('gamePlay')}</span>`:''}</div>`
  }
  monthCalendar.innerHTML=html;
}

function selectCalendarDate(date){selectedCalendarDate=date;renderCalendar();renderCalendarList()}

function teamHtml(s,m){
 const map=s.teams[m.id]||{};
 const names=participants(m);
 const a=names.filter(n=>map[n]==='A');
 const b=names.filter(n=>map[n]==='B');
 const no=names.filter(n=>!map[n]);

 const aHtml=a.map(x=>`<div class="teamName">${x}</div>`).join('')||`<p class="muted">${msg('noData')}</p>`;
 const bHtml=b.map(x=>`<div class="teamName">${x}</div>`).join('')||`<p class="muted">${msg('noData')}</p>`;

 if(a.length||b.length){
   return `
   <div class="calendarTeams">
      <div class="teamBBox">
         <h4>${msg('teamSecond')}</h4>
         ${bHtml}
      </div>
      <div class="teamABox">
         <h4>${msg('teamFirst')}</h4>
         ${aHtml}
      </div>
   </div>
   `+(no.length?`<p class="muted">${msg('noTeam')}: ${no.join('، ')}</p>`:'');
 }

 return names.map(n=>`<div class="item"><b>${n}</b></div>`).join('');
}

function renderCalendarList(){
  const s=state(),date=selectedCalendarDate;
  calendarSelectedTitle.textContent=date?msg('calendarSelectedTitle')+' '+formatDateDisplay(date):msg('calendarSelectedTitle');
  if(!date){calendarList.innerHTML=`<p class="muted">${msg('clickCalendar')}</p>`;return}
  const ms=s.matches.filter(m=>m.date===date);
  calendarList.innerHTML=ms.length?ms.map(m=>`<h3>${formatDateDisplay(m.date)}${m.place?' - '+m.place:''}</h3>${teamHtml(s,m)}<button onclick="openEditPage('match','${m.id}','matchLog')">${msg('btnEditPlayer')}</button>`).join(''):`<p class="muted">${msg('noGameDate')}</p>`;
}

let currentEdit={type:null,id:null,back:'matchLog'};

function openEditPage(type,id,back){
  currentEdit={type,id,back:back||currentTabId||'matchLog'};
  const s=state();
  let html='';
  if(type==='match'){
    const m=s.matches.find(x=>x.id===id);
    if(!m)return;
    const players=s.players.map(p=>`<label class="editCheck"><input type="checkbox" class="editPlayerCheck" value="${p}" ${(m.players||[]).includes(p)?'checked':''}> ${p}</label>`).join('');
    const guests=(m.guests||[]).map((g,i)=>`<div class="guestEditRow"><input data-guest-index="${i}" data-field="guest" value="${g.guest}"><select data-guest-index="${i}" data-field="owner">${s.players.map(p=>`<option ${p===g.owner?'selected':''}>${p}</option>`).join('')}</select><button class="danger" onclick="this.closest('.guestEditRow').remove()">${msg('btnDeletePlayer')}</button></div>`).join('');
    html=`<label>${msg('lblMatchDate')}<input type="text" inputmode="numeric" id="editMatchDate" value="${formatDateDisplay(m.date)||''}"></label>
    <label>${msg('lblPlace')}<input id="editMatchPlace" value="${m.place||''}"></label>
    <div class="two"><label>${msg('lblBookingCost')}<input type="number" step="0.001" id="editMatchCost" value="${m.bookingCost||''}"></label><label>${msg('lblNeededPlayers')}<input type="number" id="editMatchNeeded" value="${m.neededPlayers||''}"></label></div>
    <h3>${msg('lblParticipants')}</h3><div class="editPlayersGrid">${players}</div>
    <h3>${msg('addedNames')}</h3><div id="editGuestsList">${guests||`<p class="muted">${msg('noData')}</p>`}</div>
    <div class="two"><input id="newEditGuestName" placeholder="${msg('guestNamePlaceholder')}"><select id="newEditGuestOwner">${s.players.map(p=>`<option>${p}</option>`).join('')}</select></div>
    <button onclick="addEditGuest()">${msg('btnAddPlayer')}</button>`;
    document.getElementById('editPageTitle').textContent=msg('editPageTitleMatch');
  }
  if(type==='deposit'){
    const d=s.deposits.find(x=>x.id===id);
    if(!d)return;
    html=`<label>${msg('lblDepositDate')}<input type="text" inputmode="numeric" id="editDepositDate" value="${formatDateDisplay(d.date)||''}"></label>
    <label>${msg('lblDepositPlayer')}<select id="editDepositPlayer">${s.players.map(p=>`<option ${p===d.player?'selected':''}>${p}</option>`).join('')}</select></label>
    <label>${msg('lblDepositAmount')}<input type="number" step="0.001" id="editDepositAmount" value="${d.amount||0}"></label>`;
    document.getElementById('editPageTitle').textContent=msg('editPageTitleDeposit');
  }
  document.getElementById('editPageContent').innerHTML=html;
  showTab('editPage');
}

function closeEditPage(){
  showTab(currentEdit.back||'matchLog');
  currentEdit={type:null,id:null,back:'matchLog'};
}

function addEditGuest(){
  const name=document.getElementById('newEditGuestName')?.value.trim();
  const owner=document.getElementById('newEditGuestOwner')?.value;
  if(!name||!owner)return alert(msg('alertChooseMember'));
  const list=document.getElementById('editGuestsList');
  const s=state();
  const index=document.querySelectorAll('.guestEditRow').length+1000;
  const row=document.createElement('div');
  row.className='guestEditRow';
  row.innerHTML=`<input data-guest-index="${index}" data-field="guest" value="${name}"><select data-guest-index="${index}" data-field="owner">${s.players.map(p=>`<option ${p===owner?'selected':''}>${p}</option>`).join('')}</select><button class="danger" onclick="this.closest('.guestEditRow').remove()">${msg('btnDeletePlayer')}</button>`;
  if(list.querySelector('.muted'))list.innerHTML='';
  list.appendChild(row);
  document.getElementById('newEditGuestName').value='';
}

function saveEditPage(){
  const s=state();
  if(currentEdit.type==='match'){
    const m=s.matches.find(x=>x.id===currentEdit.id);
    if(!m)return;
    m.date=parseDisplayDate(document.getElementById('editMatchDate').value)||m.date;
    m.place=document.getElementById('editMatchPlace').value.trim();
    m.bookingCost=Number(document.getElementById('editMatchCost').value||0);
    m.neededPlayers=Number(document.getElementById('editMatchNeeded').value||0);
    m.price=m.neededPlayers>0?m.bookingCost/m.neededPlayers:0;
    m.players=[...document.querySelectorAll('.editPlayerCheck:checked')].map(x=>x.value);
    const rows=[...document.querySelectorAll('.guestEditRow')];
    m.guests=rows.map(r=>({guest:r.querySelector('[data-field="guest"]').value.trim(),owner:r.querySelector('[data-field="owner"]').value})).filter(g=>g.guest&&g.owner);
    save(s);closeEditPage();return;
  }
  if(currentEdit.type==='deposit'){
    const d=s.deposits.find(x=>x.id===currentEdit.id);
    if(!d)return;
    d.date=parseDisplayDate(document.getElementById('editDepositDate').value)||d.date;
    d.player=document.getElementById('editDepositPlayer').value;
    d.amount=Number(document.getElementById('editDepositAmount').value||0);
    save(s);closeEditPage();return;
  }
}

function renderMatchLog(s){
  matchLogList.innerHTML=[...s.matches].sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<div class="card"><b>${formatDateDisplay(m.date)}${m.place?' - '+m.place:''}</b><p>${msg('gamePrice')}: <span class="count">${money(m.price)}</span> | ${msg('gamePlayers')}: <span class="count">${(m.players||[]).length+(m.guests||[]).length}</span></p>${teamHtml(s,m)}<div class="actions"><button onclick="openEditPage('match','${m.id}','matchLog')">${msg('btnEditPlayer')}</button><button class="danger" onclick="deleteMatch('${m.id}')">${msg('btnDeletePlayer')}</button></div></div>`).join('')||`<p class="muted">${msg('noGames')}</p>`
}

function renderTeams(){
  const s=state(),id=teamsMatchSelect.value,m=s.matches.find(x=>x.id===id);
  if(!m){teamsPlayers.innerHTML='';renderTeamsPreview();return}
  if(!tempTeamMap.__matchId || tempTeamMap.__matchId!==id){
    tempTeamMap={...(s.teams[id]||{}),__matchId:id};
  }
  const names=participants(m);
  
  const lblFirst = currentLang === 'ar' ? 'الأول' : '1st';
  const lblSecond = currentLang === 'ar' ? 'الثاني' : '2nd';
  
  teamsPlayers.innerHTML=names.map(n=>`<div class="teamPick"><b>${n}</b><button class="${tempTeamMap[n]==='A'?'selA':''}" onclick="pickTeam('${n.replace(/'/g,"\'")}','A')">${lblFirst}</button><button class="${tempTeamMap[n]==='B'?'selB':''}" onclick="pickTeam('${n.replace(/'/g,"\'")}','B')">${lblSecond}</button></div>`).join('');
  renderTeamsPreview();
}

function pickTeam(n,t){tempTeamMap[n]=t;renderTeamsPreview();renderTeams()}
function randomTeams(){const s=state(),id=teamsMatchSelect.value,m=s.matches.find(x=>x.id===id);if(!m)return;const arr=participants(m).sort(()=>Math.random()-.5);tempTeamMap={__matchId:id};arr.forEach((n,i)=>tempTeamMap[n]=i%2?'B':'A');renderTeamsPreview();renderTeams()}
function saveTeams(){const s=state(),id=teamsMatchSelect.value;if(!id)return;const clean={...tempTeamMap};delete clean.__matchId;s.teams[id]=clean;save(s);alert(msg('alertSavedTeams'));renderTeamsPreview()}

function renderTeamsPreview(){
  const s=state();const id=teamsMatchSelect.value;const m=s.matches.find(x=>x.id===id);const el=document.getElementById('teamsPreview');if(!el)return;if(!m){el.innerHTML='';return;}
  let map={};if(tempTeamMap && tempTeamMap.__matchId===id){map={...tempTeamMap};delete map.__matchId;}else{map={...(s.teams[id]||{})};}
  const names=participants(m);const teamA=names.filter(n=>map[n]==='A');const teamB=names.filter(n=>map[n]==='B');

  el.innerHTML=`<div class="calendarTeams">
      <div class="teamBBox">
        <h4>${msg('teamSecond')}</h4>
        ${teamB.length?teamB.map(n=>`<div class="teamName">${n}</div>`).join(''):`<p class="muted">${msg('noData')}</p>`}
      </div>
      <div class="teamABox">
        <h4>${msg('teamFirst')}</h4>
        ${teamA.length?teamA.map(n=>`<div class="teamName">${n}</div>`).join(''):`<p class="muted">${msg('noData')}</p>`}
      </div>
    </div>`;
}

function renderTables(s,b){
  const latestDate=latestPlayedDateOnly(b);

  playerTableWrap.innerHTML=reportSummary.innerHTML+`<div class="tableWrap"><table>
    <thead><tr><th>${msg('thM')}</th><th>${msg('thName')}</th><th>${msg('thBalance')}</th><th>${msg('thGames')}</th><th>${msg('thLastGame')}</th></tr></thead>
    <tbody>${s.players.map((p,i)=>`<tr>
      <td>${i+1}</td>
      <td class="${isInactiveFiveMonths(b[p]?.last)?'inactiveName':''}" style="${isInactiveFiveMonths(b[p]?.last)?'background:#f8d7da;color:#842029;font-weight:900;':''}"><span class="tablePlayerLink" onclick="openPlayerProfileDirect('${String(p).replace(/'/g,"\'")}')">${p}</span></td>
      <td class="${clsMoney(b[p]?.balance)}">${moneyBlank(b[p]?.balance)}</td>
      <td>${b[p]?.games||''}</td>
      <td class="${b[p]?.last && b[p]?.last===latestDate ? 'latestPlayedCell' : ''}">${formatDateDisplay(b[p]?.last)||''}</td>
    </tr>`).join('')}</tbody>
  </table></div>`;

  const total=s.players.reduce((sum,p)=>sum+(b[p]?.balance||0),0);

  reportSummary.innerHTML=`<div class="summaryCards">
    <div class="summaryCard"><span>${msg('summary_players')}</span><b>${s.players.length}</b></div>
    <div class="summaryCard"><span>${msg('summary_matches')}</span><b>${s.matches.length}</b></div>
    <div class="summaryCard"><span>${msg('summary_totalBalance')}</span><b class="${total<0?'negText':total>0?'posText':''}">${moneyBlank(total)}</b></div>
  </div>`;

  reportsList.innerHTML=`<div class="tableWrap"><table>
    <thead><tr><th>${msg('thName')}</th><th>${msg('thBalance')}</th><th>${msg('thGames')}</th><th>${msg('thLastGameReport')}</th><th>${msg('thDepositsReport')}</th></tr></thead>
    <tbody>${s.players.map(p=>{
      const r=b[p]||{};
      return `<tr>
        <td><span class="tablePlayerLink" onclick="openPlayerProfileDirect('${String(p).replace(/'/g,"\'")}')">${p}</span></td>
        <td class="${clsMoney(r.balance)}">${moneyBlank(r.balance)}</td>
        <td>${r.games||''}</td>
        <td class="${r.last && r.last===latestDate ? 'latestPlayedCell' : ''}">${formatDateDisplay(r.last)||''}</td>
        <td class="pos">${moneyBlank(r.deposits)}</td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

function renderAll(){
  applyLanguageHTML();
  renderNav();
  setActiveNavButton(currentTabId);
  renderPageOrder();
  const s=state();
  saveNoRender(s);
  if(!matchDate.value)setDateDisplay('matchDate',today());
  if(!depositDate.value)setDateDisplay('depositDate',s.settings.lastDepositDate||today());
  pricePerPlayer.textContent=money(calcPrice());
  const b=balances(s);
  playersList.innerHTML=s.players.map(p=>`<div class="nameOnly">${p}</div>`).join('')||`<p class="muted">${msg('noGames')}</p>`;
  const opts=s.players.map(p=>`<option>${p}</option>`).join('');
  guestOwner.innerHTML=opts;depositPlayer.innerHTML=opts;
  const pf=document.getElementById('playerFilterSelect');
  if(pf){
    pf.innerHTML=`<option value="">${msg('choosePlayer')}</option>`+opts; 
    if(!pf.value&&s.players[0])pf.value=s.players[0]; 
    renderPlayerFilter();renderDepositHistory();
  }
  matchPlayers.innerHTML=s.players.map(p=>`<label><input class="playerCheck" type="checkbox" value="${p}"> <span>${p}</span></label>`).join('');
  renderMatchParticipantsPreview();
  depositQuickButtons.innerHTML=getDepositPresets(s).map(v=>`<span class="quick"><button class="x" type="button" onclick="event.stopPropagation();deleteDepositPreset('${v}')">×</button><span onclick="setDepositAmount('${v}')">${money(v)}</span></span>`).join('')||`<span class="muted">${msg('firstSavePreset')}</span>`;
  
  depositsList.innerHTML=[...s.deposits]
  .map((d,i)=>({...d,_i:i,type:(String(d.date||'').replace(/-/g,'/')==='2026/01/01'||String(d.date||'').replace(/-/g,'/')==='1/1/2026')&&!d.type?'initial':d.type}))
  .sort((a,b)=>{
   const da=(a.date?new Date(a.date).getTime():0)||0;const db=(b.date?new Date(b.date).getTime():0)||0;
   if(db!==da)return db-da;return (b.createdAt||b._i||0)-(a.createdAt||a._i||0);
  })
  .map(d=>`<div class="item depositRow" onclick="depositOptions('${d.id}')">
  <span class="depositDateNameRow"><span class="depositDateCell">${formatDateDisplay(d.date)}</span><span class="depositPlayerCell">${d.player}</span></span>
  <span class="${clsMoney(d.amount)} depoAmountGroup"><b>${depositTypeLabel(d)}</b>&nbsp;&nbsp;${money(d.amount)}</span>
  </div>`).join('');
  
  teamsMatchSelect.innerHTML=s.matches
  .sort((a,b)=>b.date.localeCompare(a.date))
  .map(m=>`<option value="${m.id}">${formatDateDisplay(m.date)} | ${m.place||''}</option>`)
  .join('');
  renderTempGuests();renderCalendar();renderCalendarList();renderMatchLog(s);renderTeams();renderTables(s,b);
}

function exportData(){const blob=new Blob([JSON.stringify(state(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='qatiya-backup.json';a.click()}
function importData(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{localStorage.setItem('qatiyaState',r.result);renderAll();alert(msg('alertImported'))};r.readAsText(f)}

if('serviceWorker'in navigator){navigator.serviceWorker.register('sw.js')}
setDepositType('in');
renderAll();
setTimeout(()=>{const first=document.querySelector("nav button");if(first)first.classList.add('activeTab')},100);

function renderDepositHistory(){
  const box=document.getElementById('depositHistoryList');
  if(!box)return;
  const s=state();
  const list=[...(s.deposits||[])].map(d=>{
    const raw=String(d.date||'').replace(/-/g,'/');
    if((raw==='2026/01/01'||raw==='1/1/2026') && !d.type){ return {...d,type:'initial'}; }
    return d;
  }).sort((a,b)=>{
    const da=new Date(a.date||'1900-01-01').getTime();const db=new Date(b.date||'1900-01-01').getTime();
    if(db!==da)return db-da;return (b.createdAt||0)-(a.createdAt||0);
  });
  if(!list.length){ box.innerHTML=`<p class="muted">${msg('noOps')}</p>`; return; }
  box.innerHTML=list.map(d=>`
    <div class="item depositHistoryRow">
      <span>${formatDateDisplay(d.date)}</span>
      <span style="flex:1;text-align:center">${d.player||''}</span>
      <span class="${clsMoney(d.amount)} depoAmountGroup">
        <b>${depositTypeLabel(d)}</b>&nbsp;&nbsp;${money(d.amount)}
      </span>
    </div>
  `).join('');
}

function openPlayerProfileDirect(playerName){
  currentTabId='playerFilter';
  document.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  const sec=document.getElementById('playerFilter');
  if(sec) sec.classList.add('active');
  setTimeout(()=>{
    const select=document.getElementById('playerFilterSelect');
    if(select){ select.value=playerName; renderPlayerFilter(); }
  },150);
}

function updatePlayersGuestsCount(){
  const el=document.getElementById('livePlayersGuestsCount');if(!el)return;
  const players=document.querySelectorAll('#matchPlayers input.playerCheck:checked').length;
  el.textContent='('+players+')';
}
document.addEventListener('change',function(e){ if(e.target && e.target.classList.contains('playerCheck')){ updatePlayersGuestsCount(); } });
setInterval(function(){ try{updatePlayersGuestsCount()}catch(e){} },1000);

function fixTeamsVisualOrderAndHighlight(){
  try{
    document.querySelectorAll('.calendarTeams').forEach(box=>{
      box.style.direction= 'ltr';
      box.style.display='flex';
      box.style.gap='18px';
      const a=box.querySelector('.teamABox');const b=box.querySelector('.teamBBox');
      if(a){a.style.order=currentLang==='ar'?'2':'1'; a.style.flex='1';}
      if(b){b.style.order=currentLang==='ar'?'1':'2'; b.style.flex='1';}
    });
    document.querySelectorAll('#teamsPlayers button.selA').forEach(btn=>{
      btn.style.background='#ffe066';btn.style.border='2px solid #b08900';btn.style.fontWeight='900';btn.style.transform='scale(1.06)';
    });
    document.querySelectorAll('#teamsPlayers button.selB').forEach(btn=>{
      btn.style.background='#ff8ccf';btn.style.border='2px solid #b83280';btn.style.fontWeight='900';btn.style.transform='scale(1.06)';
    });
  }catch(e){}
}

const __oldRenderTeamsFix=typeof renderTeams==='function'?renderTeams:null;
if(__oldRenderTeamsFix && !__oldRenderTeamsFix.__fixedTeamsVisual){
  renderTeams=function(){ const r=__oldRenderTeamsFix.apply(this,arguments); setTimeout(fixTeamsVisualOrderAndHighlight,50); return r; };
  renderTeams.__fixedTeamsVisual=true;
}
const __oldRenderTeamsPreviewFix=typeof renderTeamsPreview==='function'?renderTeamsPreview:null;
if(__oldRenderTeamsPreviewFix && !__oldRenderTeamsPreviewFix.__fixedTeamsPreviewVisual){
  renderTeamsPreview=function(){ const r=__oldRenderTeamsPreviewFix.apply(this,arguments); setTimeout(fixTeamsVisualOrderAndHighlight,50); return r; };
  renderTeamsPreview.__fixedTeamsPreviewVisual=true;
}

/* === HARD OVERRIDE TEAM BOXES === */
(function(){
 function applyHardSwap(){
   try{
     document.querySelectorAll('.calendarTeams').forEach(function(wrap){
       let firstBox=null; let secondBox=null;
       Array.from(wrap.children).forEach(function(el){
         const txt=(el.innerText||'').trim();
         if(txt.indexOf('الفريق الأول')>-1 || txt.indexOf('الأول')>-1 || txt.indexOf('First')>-1 || txt.indexOf('1st')>-1){ firstBox=el; }
         if(txt.indexOf('الفريق الثاني')>-1 || txt.indexOf('الثاني')>-1 || txt.indexOf('Second')>-1 || txt.indexOf('2nd')>-1){ secondBox=el; }
       });
       if(!firstBox || !secondBox) return;
       wrap.innerHTML='';
       secondBox.style.background='#efc0e5';
       secondBox.style.order=currentLang==='ar'?'1':'2';
       secondBox.style.flex='1';
       secondBox.style.padding='10px';
       secondBox.style.borderRadius='12px';
       
       firstBox.style.background='#f6f3b1';
       firstBox.style.order=currentLang==='ar'?'2':'1';
       firstBox.style.flex='1';
       firstBox.style.padding='10px';
       firstBox.style.borderRadius='12px';

       wrap.style.display='flex';
       wrap.style.flexDirection='row';
       wrap.style.direction='ltr';
       wrap.style.gap='18px';

       if(currentLang === 'ar') {
         wrap.appendChild(secondBox); wrap.appendChild(firstBox);
       } else {
         wrap.appendChild(firstBox); wrap.appendChild(secondBox);
       }
     });
   }catch(e){}
 }
 window.applyHardSwap=applyHardSwap;
 setInterval(applyHardSwap,400);
})();
