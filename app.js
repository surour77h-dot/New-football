
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
 if(dt==='2026/01/01'||dt==='1/1/2026') return 'إيداع مبدئي';
 if(d.type==='initial') return 'إيداع مبدئي';
  if(d.type==='late') return 'تأخير';
 if(d.type==='debt') return 'خصم';
 return 'إيداع';
}
let currentTabId='newMatch';
const FREE_START='2026-05-01';let tempGuests=[];let selectedCalendarDate='';let depositType='in';let tempTeamMap={};let calendarView=new Date();
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function state(){const r=JSON.parse(localStorage.getItem('qatiyaState')||'{"players":[],"matches":[],"deposits":[],"teams":{},"settings":{}}');r.players=r.players||[];r.matches=r.matches||[];r.deposits=r.deposits||[];r.teams=r.teams||{};r.settings=r.settings||{};r.matches.forEach(m=>{if(!m.id)m.id=uid()});r.deposits.forEach(d=>{if(!d.id)d.id=uid()});r.players.sort((a,b)=>a.localeCompare(b,'ar'));return r}
function save(s){s.players.sort((a,b)=>a.localeCompare(b,'ar'));localStorage.setItem('qatiyaState',JSON.stringify(s));renderAll()}
function saveNoRender(s){localStorage.setItem('qatiyaState',JSON.stringify(s))}
function today(){return new Date().toISOString().slice(0,10)}function money(n){return Number(n||0).toFixed(3)}


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
const defaultPages=[
 ['newMatch','لعبة'],
 ['teams','الفريقين'],
 ['deposits','الإيداعات'],
 ['calendar','التقويم'],
 ['playerTable','الجدول'],
 ['playerFilter','كشف لاعب'],
 ['matchLog','السجل'],
 ['players','اللاعبين'],
 ['settings','الترتيب'],
 ['backup','النسخ']
];
function getPageOrder(){
 return defaultPages.map(x=>x[0]);
}
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
 const labels=Object.fromEntries(defaultPages);
 const order=getPageOrder();
 const nav=document.querySelector('nav');
 if(!nav)return;
 nav.innerHTML=order.map(id=>`<button class=\"${id===currentTabId?'activeTab':''}\" onclick=\"showTab('${id}')\">${labels[id]}</button>`).join('');
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
   <div class="summaryCard"><span>الإيداعات</span><b class="posText">${moneyBlank(totalDep)}</b></div>
   <div class="summaryCard"><span>عدد اللعب</span><b>${b.games||''}</b></div>
   <div class="summaryCard"><span>الخصومات</span><b class="negText">${moneyBlank(totalDebt)}</b></div>
   <div class="summaryCard"><span>الرصيد</span><b class="${(b.balance||0)<0?'negText':(b.balance||0)>0?'posText':''}">${moneyBlank(b.balance)}</b></div>
 </div>

 <div class="card">
   <h3>أيام اللعب</h3>
   ${(games.length?games.map(g=>`<div class="item"><span>${formatDateDisplay(g.date)}</span><span class="count">${money(g.price)}</span></div>`).join(''):'<p class="muted">لا يوجد</p>')}
   <div class="item gamesTotalRow"><b>المجموع</b><span class="gamesTotalAmount">${money(gameDeductTotal*-1)}</span></div>
 </div>

 <div class="card">
   <h3>الإيداعات والمديونيات</h3>
   ${(deposits.length?deposits.map(d=>`<div class="item">
     <span>${formatDateDisplay(d.date)}</span>
     <span class="${clsMoney(d.amount)} depoAmountGroup"><b>${depositTypeLabel(d)}</b>&nbsp;&nbsp;${money(d.amount)}</span>
   </div>`).join(''):'<p class="muted">لا يوجد</p>')}
 </div>

 <div class="card">
   <h3>الأسماء التي أحضرها</h3>
   ${(guestMatches.length?guestMatches.map(m=>(m.guests||[]).filter(g=>g.owner===player).map(g=>`<div class="item"><span>${formatDateDisplay(m.date)}</span><span style="text-align:center;flex:1;">${g.guest}</span><span class="neg">${money(Number(m.price||0)*-1)}</span></div>`).join('')).join(''):'<p class="muted">لا يوجد</p>')}
   <div class="item guestTotalRow"><b>المجموع</b><span class="guestTotalAmount">${money(guestDeductTotal*-1)}</span></div>
 </div>`;
}

function renderPageOrder(){
 const el=document.getElementById('pageOrderList');
 if(!el)return;
 const labels=Object.fromEntries(defaultPages);
 const order=getPageOrder();
 el.innerHTML=order.map((id,i)=>`<div class="item pageOrderItem"><b>${labels[id]}</b><div class="actions"><button onclick="movePage('${id}',-1)">↑</button><button onclick="movePage('${id}',1)">↓</button></div></div>`).join('');
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
document.addEventListener('change',e=>{
  if(e.target&&['matchDate','depositDate'].includes(e.target.id))updatePrettyDates();
});

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
function addPlayer(){const name=playerName.value.trim();if(!name)return alert('اكتب اسم اللاعب');const s=state();if(s.players.includes(name))return alert('اللاعب موجود');s.players.push(name);playerName.value='';save(s)}
function showPlayerEditBox(){const s=state();playerActionBox.innerHTML=`<div class="actionBox"><label>اختر اللاعب<select id="editOld">${s.players.map(p=>`<option>${p}</option>`).join('')}</select></label><label>الاسم الجديد<input id="editNew"></label><button class="primary wide" onclick="confirmPlayerEdit()">حفظ التعديل</button></div>`}
function confirmPlayerEdit(){const oldName=editOld.value,newName=editNew.value.trim();if(!newName)return alert('اكتب الاسم الجديد');const s=state();if(s.players.includes(newName))return alert('الاسم موجود');s.players=s.players.map(x=>x===oldName?newName:x);s.matches.forEach(m=>{m.players=(m.players||[]).map(x=>x===oldName?newName:x);(m.guests||[]).forEach(g=>{if(g.owner===oldName)g.owner=newName})});s.deposits.forEach(d=>{if(d.player===oldName)d.player=newName});Object.values(s.teams||{}).forEach(t=>Object.keys(t).forEach(k=>{if(k===oldName){t[newName]=t[k];delete t[k]}}));playerActionBox.innerHTML='';save(s)}
function showPlayerDeleteBox(){const s=state();playerActionBox.innerHTML=`<div class="actionBox"><label>اختر اللاعب<select id="deletePlayer">${s.players.map(p=>`<option>${p}</option>`).join('')}</select></label><button class="danger wide" onclick="confirmPlayerDelete()">تأكيد الحذف</button></div>`}
function confirmPlayerDelete(){const name=deletePlayer.value;if(!confirm('حذف '+name+'؟'))return;const s=state();s.players=s.players.filter(x=>x!==name);playerActionBox.innerHTML='';save(s)}
function addGuestTemp(){const guest=guestName.value.trim(),owner=guestOwner.value;if(!guest||!owner)return alert('اكتب اسم الواختر العضو');tempGuests.push({guest,owner});guestName.value='';renderTempGuests()}
function removeGuestTemp(i){tempGuests.splice(i,1);renderTempGuests()}

function renderMatchParticipantsPreview(){
  const el=document.getElementById('matchParticipantsPreview');
  if(!el)return;
  const selected=[...document.querySelectorAll('.playerCheck:checked')].map(x=>x.value);
  const rows=[
    ...selected.map(n=>`<div class="chip memberChip">${n}</div>`),
    ...tempGuests.map(g=>`<div class="chip guestChip">${guestLabel(g)}</div>`)
  ];
  el.innerHTML=rows.length?`<h3>المشاركون <span id="livePlayersGuestsCount" class="liveCount"></span> المسجلون</h3><div class="chipGrid">${rows.join('')}</div>`:'';
}

function renderTempGuests(){
  tempGuests.innerHTML=tempGuests.length?`<table><thead><tr><th>الاسم</th><th>العضو</th></tr></thead><tbody>${tempGuests.map((g,i)=>`<tr><td>${g.guest}</td><td>${g.owner} <button onclick="removeGuestTemp(${i})">×</button></td></tr>`).join('')}</tbody></table>`:'';
  renderMatchParticipantsPreview();
}
function clearMatchForm(){editingMatchId.value='';matchFormTitle.textContent='لعبة جديدة';setDateDisplay('matchDate',today());place.value='';bookingCost.value='';neededPlayers.value='';tempGuests=[];document.querySelectorAll('.playerCheck').forEach(x=>x.checked=false);renderTempGuests();pricePerPlayer.textContent='0.000'}
function saveMatch(){const date=getDateValue('matchDate')||today(),bc=Number(bookingCost.value||0),np=Number(neededPlayers.value||0),selected=[...document.querySelectorAll('.playerCheck:checked')].map(x=>x.value);if(!date)return alert('اكتب التاريخ بالشكل 11-5-2026');if(bc<=0||np<=0)return alert('أدخل سعر الحجز وعدد اللاعبين');if(selected.length===0&&tempGuests.length===0)return alert('اختر المشاركين أو أضف ضيوف');const s=state(),id=editingMatchId.value||uid(),match={id,date,place:place.value.trim(),bookingCost:bc,neededPlayers:np,price:bc/np,players:selected,guests:[...tempGuests]};const idx=s.matches.findIndex(m=>m.id===id);if(idx>=0)s.matches[idx]=match;else s.matches.push(match);editingMatchId.value='';tempGuests=[];save(s);clearMatchForm();alert('تم الحفظ')}
function editMatch(id){const s=state(),m=s.matches.find(x=>x.id===id);if(!m)return;showTab('newMatch');editingMatchId.value=m.id;matchFormTitle.textContent='تعديل لعبة';setDateDisplay('matchDate',m.date);place.value=m.place||'';bookingCost.value=m.bookingCost||'';neededPlayers.value=m.neededPlayers||'';tempGuests=[...(m.guests||[])];renderAll();document.querySelectorAll('.playerCheck').forEach(x=>x.checked=(m.players||[]).includes(x.value));pricePerPlayer.textContent=money(calcPrice());renderTempGuests()}
function deleteMatch(id){if(!confirm('حذف اللعبة؟'))return;const s=state();s.matches=s.matches.filter(m=>m.id!==id);delete s.teams[id];save(s)}
function setDepositType(t){depositType=t;depositTypeIn.className=t==='in'?'primary':'';depositTypeOut.className=t==='out'?'danger':''}
function getDepositPresets(s){const saved=(s.settings.depositPresets||[]).map(Number).filter(x=>x>0),from=s.deposits.map(d=>Math.abs(Number(d.amount||0))).filter(x=>x>0),del=(s.settings.deletedDepositPresets||[]).map(Number);return[...new Set([...saved,...from])].filter(x=>!del.includes(Number(x))).sort((a,b)=>a-b)}
function setDepositAmount(v){depositAmount.value=money(v)}
function deleteDepositPreset(v){const s=state();v=Number(v);s.settings.deletedDepositPresets=[...new Set([...(s.settings.deletedDepositPresets||[]).map(Number),v])];s.settings.depositPresets=(s.settings.depositPresets||[]).map(Number).filter(x=>x!==v);save(s)}
function addDepositPresetAmount(s,a){a=Math.abs(Number(a||0));if(a<=0)return;s.settings.deletedDepositPresets=(s.settings.deletedDepositPresets||[]).map(Number).filter(x=>x!==a);const p=(s.settings.depositPresets||[]).map(Number);if(!p.includes(a))p.push(a);s.settings.depositPresets=p.sort((x,y)=>x-y)}
function clearDepositForm(){editingDepositId.value='';depositAmount.value='';const s=state();setDateDisplay('depositDate',s.settings.lastDepositDate||today());setDepositType('in')}
function saveDeposit(){
const player=depositPlayer.value;
let raw=String(depositAmount.value||'').trim();
let amount=Number(raw);
const date=getDateValue('depositDate')||today();
if(!date)return alert('اكتب التاريخ بالشكل 11-5-2026');if(!player||isNaN(amount)||amount===0)return alert('اختر اللاعب واكتب مبلغ صحيح');
if((depositType==='out'||depositType==='debt'||depositType==='late') && amount>0) amount=-amount;
if(depositType==='in' && amount<0) amount=Math.abs(amount);
const s=state(),id=editingDepositId.value||uid(),dep={id,player,amount,date,type:depositType,createdAt:Date.now()};
const idx=s.deposits.findIndex(d=>d.id===id);
if(idx>=0){ dep.createdAt=s.deposits[idx].createdAt||Date.now(); s.deposits[idx]=dep; }
else s.deposits.push(dep);
s.settings.lastDepositDate=date;
addDepositPresetAmount(s,Math.abs(amount));
editingDepositId.value='';
depositAmount.value='';
save(s)
}
function editDeposit(id){const s=state(),d=s.deposits.find(x=>x.id===id);if(!d)return;showTab('deposits');editingDepositId.value=d.id;depositPlayer.value=d.player;depositAmount.value=money(Math.abs(d.amount));setDateDisplay('depositDate',d.date);setDepositType(d.amount<0?'out':'in')}
function deleteDeposit(id){if(!confirm('حذف الإيداع؟'))return;const s=state();s.deposits=s.deposits.filter(d=>d.id!==id);save(s)}
function depositOptions(id){
const s=state();
const d=s.deposits.find(x=>x.id===id);
if(!d)return;
const msg=`عملية الإيداع / المديونية

اللاعب: ${d.player}
التاريخ: ${d.date}
المبلغ: <div class="depositRow">
<span class="depositTypeText">${depositTypeLabel(d)}</span>
<span class="depositAmountText">${money(d.amount)}</span>
</div>

اضغط موافق للتعديل.
اضغط إلغاء للانتقال لخيار الحذف.`;
const act=confirm(msg);
if(act){openEditPage('deposit',id,'deposits')}
else{
 if(confirm(`هل تريد حذف هذه العملية؟

${d.player}
${d.date}
<div class="depositRow">
<span class="depositTypeText">${depositTypeLabel(d)}</span>
<span class="depositAmountText">${money(d.amount)}</span>
</div>`)) deleteDeposit(id);
}
}
function balances(s){const r={};s.players.forEach(p=>r[p]={balance:0,games:0,free:0,streak:0,guestFreeCredits:0,last:'',deposits:0});s.deposits.forEach(d=>{if(r[d.player]){r[d.player].balance+=Number(d.amount||0);if(Number(d.amount)>0)r[d.player].deposits+=Number(d.amount)}});const ms=[...s.matches].sort((a,b)=>a.date.localeCompare(b.date));ms.forEach((m,idx)=>{const present=new Set(m.players||[]);Object.keys(r).forEach(name=>{if(present.has(name)){let free=false;if(m.date>=FREE_START&&r[name].streak>=5){free=true;r[name].streak=0;r[name].free++}if(!free&&r[name].guestFreeCredits>0){free=true;r[name].guestFreeCredits--;r[name].free++}r[name].games++;r[name].last=m.date;if(!free)r[name].balance-=Number(m.price||0);r[name].streak++}else r[name].streak=0});(m.guests||[]).forEach(g=>{if(r[g.owner])r[g.owner].balance-=Number(m.price||0);const count=ms.slice(0,idx+1).reduce((n,mm)=>n+(mm.guests||[]).filter(x=>x.guest===g.guest&&x.owner===g.owner).length,0);if(count>0&&count%3===0&&r[g.owner])r[g.owner].guestFreeCredits++})});return r}
function participants(m){return[...(m.players||[]),...(m.guests||[]).map(g=>guestLabel(g))]}
function moveMonth(n){calendarView.setMonth(calendarView.getMonth()+n);renderCalendar()}
function renderCalendar(){const s=state(),y=calendarView.getFullYear(),mo=calendarView.getMonth(),first=new Date(y,mo,1),last=new Date(y,mo+1,0);calendarMonthTitle.textContent=calendarView.toLocaleDateString('ar-KW',{month:'long',year:'numeric'});let html=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'].map(d=>`<div class="day"><b>${d}</b></div>`).join('');for(let i=0;i<first.getDay();i++)html+='<div></div>';for(let d=1;d<=last.getDate();d++){const mm=String(mo+1).padStart(2,'0'),dd=String(d).padStart(2,'0'),date=`${y}-${mm}-${dd}`,has=s.matches.some(x=>x.date===date);html+=`<div class="day ${has?'hasGame':''} ${selectedCalendarDate===date?'selected':''}" onclick="selectCalendarDate('${date}')"><b>${d}</b>${has?'<br><span class="small">لعب</span>':''}</div>`}monthCalendar.innerHTML=html}
function selectCalendarDate(date){selectedCalendarDate=date;renderCalendar();renderCalendarList()}
function teamHtml(s,m){const map=s.teams[m.id]||{},names=participants(m),a=names.filter(n=>map[n]==='A'),b=names.filter(n=>map[n]==='B'),no=names.filter(n=>!map[n]);if(a.length||b.length)return`<div class="calendarTeams"><div class="calendarTeam teamABox"><h4>الفريق الأول</h4>${a.map(x=>`<div class="teamName">${x}</div>`).join('')||'<p class="muted">لا يوجد</p>'}</div><div class="calendarTeam teamBBox"><h4>الفريق الثاني</h4>${b.map(x=>`<div class="teamName">${x}</div>`).join('')||'<p class="muted">لا يوجد</p>'}</div></div>`+(no.length?`<p class="muted">بدون فريق: ${no.join('، ')}</p>`:'');return names.map(n=>`<div class="item"><b>${n}</b></div>`).join('')}
function renderCalendarList(){const s=state(),date=selectedCalendarDate;calendarSelectedTitle.textContent=date?'المشاركون '+formatDateDisplay(date):'المشاركون';if(!date){calendarList.innerHTML='<p class="muted">اضغط على يوم من التقويم.</p>';return}const ms=s.matches.filter(m=>m.date===date);calendarList.innerHTML=ms.length?ms.map(m=>`<h3>${formatDateDisplay(m.date)}${m.place?' - '+m.place:''}</h3>${teamHtml(s,m)}<button onclick="openEditPage('match','${m.id}','matchLog')">تعديل اللعبة</button>`).join(''):'<p class="muted">لا توجد لعبة بهذا التاريخ.</p>'}

let currentEdit={type:null,id:null,back:'matchLog'};

function openEditPage(type,id,back){
  currentEdit={type,id,back:back||currentTabId||'matchLog'};
  const s=state();
  let html='';
  if(type==='match'){
    const m=s.matches.find(x=>x.id===id);
    if(!m)return;
    const players=s.players.map(p=>`<label class="editCheck"><input type="checkbox" class="editPlayerCheck" value="${p}" ${(m.players||[]).includes(p)?'checked':''}> ${p}</label>`).join('');
    const guests=(m.guests||[]).map((g,i)=>`<div class="guestEditRow"><input data-guest-index="${i}" data-field="guest" value="${g.guest}"><select data-guest-index="${i}" data-field="owner">${s.players.map(p=>`<option ${p===g.owner?'selected':''}>${p}</option>`).join('')}</select><button class="danger" onclick="this.closest('.guestEditRow').remove()">حذف</button></div>`).join('');
    html=`<label>تاريخ اللعب<input type="text" inputmode="numeric" id="editMatchDate" value="${formatDateDisplay(m.date)||''}"></label>
    <label>مكان اللعب<input id="editMatchPlace" value="${m.place||''}"></label>
    <div class="two"><label>سعر الحجز<input type="number" step="0.001" id="editMatchCost" value="${m.bookingCost||''}"></label><label>عدد اللاعبين<input type="number" id="editMatchNeeded" value="${m.neededPlayers||''}"></label></div>
    <h3>المشاركون</h3><div class="editPlayersGrid">${players}</div>
    <h3>الأسماء المضافة</h3><div id="editGuestsList">${guests||'<p class="muted">لا يوجد</p>'}</div>
    <div class="two"><input id="newEditGuestName" placeholder="اسم الشخص المضاف"><select id="newEditGuestOwner">${s.players.map(p=>`<option>${p}</option>`).join('')}</select></div>
    <button onclick="addEditGuest()">إضافة</button>`;
  }
  if(type==='deposit'){
    const d=s.deposits.find(x=>x.id===id);
    if(!d)return;
    html=`<label>التاريخ<input type="text" inputmode="numeric" id="editDepositDate" value="${formatDateDisplay(d.date)||''}"></label>
    <label>اللاعب<select id="editDepositPlayer">${s.players.map(p=>`<option ${p===d.player?'selected':''}>${p}</option>`).join('')}</select></label>
    <label>المبلغ<input type="number" step="0.001" id="editDepositAmount" value="${d.amount||0}"></label>`;
  }
  document.getElementById('editPageTitle').textContent=type==='match'?'تعديل اللعبة':'تعديل الإيداع';
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
  if(!name||!owner)return alert('اكتب الاسم واختر العضو');
  const list=document.getElementById('editGuestsList');
  const s=state();
  const index=document.querySelectorAll('.guestEditRow').length+1000;
  const row=document.createElement('div');
  row.className='guestEditRow';
  row.innerHTML=`<input data-guest-index="${index}" data-field="guest" value="${name}"><select data-guest-index="${index}" data-field="owner">${s.players.map(p=>`<option ${p===owner?'selected':''}>${p}</option>`).join('')}</select><button class="danger" onclick="this.closest('.guestEditRow').remove()">حذف</button>`;
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
    save(s);
    closeEditPage();
    return;
  }
  if(currentEdit.type==='deposit'){
    const d=s.deposits.find(x=>x.id===currentEdit.id);
    if(!d)return;
    d.date=parseDisplayDate(document.getElementById('editDepositDate').value)||d.date;
    d.player=document.getElementById('editDepositPlayer').value;
    d.amount=Number(document.getElementById('editDepositAmount').value||0);
    save(s);
    closeEditPage();
    return;
  }
}


function guestsEditorHtml(m){
  const gs=m.guests||[];
  return `<div class="guestEditor"><b>الأسماء المضافة</b>${gs.length?gs.map(g=>`<div class="item"><span>${guestLabel(g)}</span></div>`).join(''):'<p class="muted">لا يوجد</p>'}<button onclick="openEditPage('match','${m.id}','matchLog')">تعديل المشاركين والأسماء المضافة</button></div>`;
}

function renderMatchLog(s){matchLogList.innerHTML=[...s.matches].sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<div class="card"><b>${formatDateDisplay(m.date)}${m.place?' - '+m.place:''}</b><p>السعر: <span class="count">${money(m.price)}</span> | المشاركين: <span class="count">${(m.players||[]).length+(m.guests||[]).length}</span></p>${teamHtml(s,m)}<div class="actions"><button onclick="openEditPage('match','${m.id}','matchLog')">تعديل</button><button class="danger" onclick="deleteMatch('${m.id}')">حذف</button></div></div>`).join('')||'<p class="muted">لا توجد ألعاب محفوظة.</p>'}
function renderTeams(){
  const s=state(),id=teamsMatchSelect.value,m=s.matches.find(x=>x.id===id);
  if(!m){teamsPlayers.innerHTML='';renderTeamsPreview();return}
  if(!tempTeamMap.__matchId || tempTeamMap.__matchId!==id){
    tempTeamMap={...(s.teams[id]||{}),__matchId:id};
  }
  const names=participants(m);
  teamsPlayers.innerHTML=names.map(n=>`<div class="teamPick"><b>${n}</b><button class="${tempTeamMap[n]==='A'?'selA':''}" onclick="pickTeam('${n.replace(/'/g,"\\'")}','A')">الأول</button><button class="${tempTeamMap[n]==='B'?'selB':''}" onclick="pickTeam('${n.replace(/'/g,"\\'")}','B')">الثاني</button></div>`).join('');
  renderTeamsPreview();
}
function pickTeam(n,t){tempTeamMap[n]=t;renderTeamsPreview();renderTeams()}
function randomTeams(){const s=state(),id=teamsMatchSelect.value,m=s.matches.find(x=>x.id===id);if(!m)return;const arr=participants(m).sort(()=>Math.random()-.5);tempTeamMap={__matchId:id};arr.forEach((n,i)=>tempTeamMap[n]=i%2?'B':'A');renderTeamsPreview();renderTeams()}
function saveTeams(){const s=state(),id=teamsMatchSelect.value;if(!id)return;const clean={...tempTeamMap};delete clean.__matchId;s.teams[id]=clean;save(s);alert('تم حفظ الفريقين');renderTeamsPreview()}

function teamPreviewSameAsCalendar(id){
  const s=state();
  const m=s.matches.find(x=>x.id===id);
  if(!m)return '<p class="muted">اختر لعبة أولًا.</p>';
  let html=teamHtml(s,m);
  html=html.replace(/<button[^>]*>تعديل اللعبة<\/button>/g,'');
  return `<div class="card teamCalendarClone"><h3>المشاركون</h3>${html}</div>`;
}

function renderTeamsPreview(){
  const s=state();
  const id=teamsMatchSelect.value;
  const m=s.matches.find(x=>x.id===id);
  const el=document.getElementById('teamsPreview');
  if(!el)return;
  if(!m){el.innerHTML='';return;}

  // Use current unsaved choices if they belong to selected match; otherwise saved teams
  let map={};
  if(tempTeamMap && tempTeamMap.__matchId===id){
    map={...tempTeamMap};
    delete map.__matchId;
  }else{
    map={...(s.teams[id]||{})};
  }

  const names=participants(m);
  const teamA=names.filter(n=>map[n]==='A');
  const teamB=names.filter(n=>map[n]==='B');

  el.innerHTML=`<div class="ftCalendarBox">
    <h3>المشاركون ${formatDateDisplay(m.date)||''}</h3>
    <div class="ftMatchInfo">${m.place?formatDateDisplay(m.date)+' - '+m.place:formatDateDisplay(m.date)}</div>
    <div class="ftTeams">
      <div class="ftTeam ftTeamB">
        <h4>الفريق الثاني</h4>
        ${teamB.length?teamB.map(n=>`<div class="ftName">${n}</div>`).join(''):'<p class="muted">لا يوجد</p>'}
      </div>
      <div class="ftTeam ftTeamA">
        <h4>الفريق الأول</h4>
        ${teamA.length?teamA.map(n=>`<div class="ftName">${n}</div>`).join(''):'<p class="muted">لا يوجد</p>'}
      </div>
    </div>
  </div>`;
}
function renderTables(s,b){
  const latestDate=latestPlayedDateOnly(b);

  playerTableWrap.innerHTML=reportSummary.innerHTML+`<div class="tableWrap"><table>
    <thead><tr><th>م</th><th>الاسم</th><th>الرصيد</th><th>لعب</th><th>آخر لعب</th></tr></thead>
    <tbody>${s.players.map((p,i)=>`<tr>
      <td>${i+1}</td>
      <td class="${isInactiveFiveMonths(b[p]?.last)?'inactiveName':''}" style="${isInactiveFiveMonths(b[p]?.last)?'background:#f8d7da;color:#842029;font-weight:900;':''}"><span class="tablePlayerLink" onclick="openPlayerProfileDirect('${String(p).replace(/'/g,"\\'")}')">${p}</span></td>
      <td class="${clsMoney(b[p]?.balance)}">${moneyBlank(b[p]?.balance)}</td>
      <td>${b[p]?.games||''}</td>
      <td class="${b[p]?.last && b[p]?.last===latestDate ? 'latestPlayedCell' : ''}">${formatDateDisplay(b[p]?.last)||''}</td>
    </tr>`).join('')}</tbody>
  </table></div>`;

  const debt=s.players.filter(p=>(b[p]?.balance||0)<0).length;
  const total=s.players.reduce((sum,p)=>sum+(b[p]?.balance||0),0);

  reportSummary.innerHTML=`<div class="summaryCards">
    <div class="summaryCard"><span>اللاعبين</span><b>${s.players.length}</b></div>
    <div class="summaryCard"><span>الألعاب</span><b>${s.matches.length}</b></div>
    <div class="summaryCard"><span>إجمالي الرصيد</span><b class="${total<0?'negText':total>0?'posText':''}">${moneyBlank(total)}</b></div>
  </div>`;

  reportsList.innerHTML=`<div class="tableWrap"><table>
    <thead><tr><th>الاسم</th><th>الرصيد</th><th>لعب</th><th>آخر لعبة</th><th>الإيداعات</th></tr></thead>
    <tbody>${s.players.map(p=>{
      const r=b[p]||{};
      return `<tr>
        <td><span class="tablePlayerLink" onclick="openPlayerProfileDirect('${String(p).replace(/'/g,"\\'")}')">${p}</span></td>
        <td class="${clsMoney(r.balance)}">${moneyBlank(r.balance)}</td>
        <td>${r.games||''}</td>
        <td class="${r.last && r.last===latestDate ? 'latestPlayedCell' : ''}">${formatDateDisplay(r.last)||''}</td>
        <td class="pos">${moneyBlank(r.deposits)}</td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}
function renderAll(){renderNav();setActiveNavButton(currentTabId);renderPageOrder();const s=state();saveNoRender(s);if(!matchDate.value)setDateDisplay('matchDate',today());if(!depositDate.value)setDateDisplay('depositDate',s.settings.lastDepositDate||today());pricePerPlayer.textContent=money(calcPrice());const b=balances(s);playersList.innerHTML=s.players.map(p=>`<div class="nameOnly">${p}</div>`).join('')||'<p class="muted">أضف اللاعبين أولًا.</p>';const opts=s.players.map(p=>`<option>${p}</option>`).join('');guestOwner.innerHTML=opts;depositPlayer.innerHTML=opts;const pf=document.getElementById('playerFilterSelect');if(pf){pf.innerHTML='<option value="">اختر لاعب</option>'+opts; if(!pf.value&&s.players[0])pf.value=s.players[0]; renderPlayerFilter();renderDepositHistory();}matchPlayers.innerHTML=s.players.map(p=>`<label><input class="playerCheck" type="checkbox" value="${p}"> <span>${p}</span></label>`).join('');renderMatchParticipantsPreview();depositQuickButtons.innerHTML=getDepositPresets(s).map(v=>`<span class="quick"><button class="x" type="button" onclick="event.stopPropagation();deleteDepositPreset('${v}')">×</button><span onclick="setDepositAmount('${v}')">${money(v)}</span></span>`).join('')||'<span class="muted">احفظ أول مبلغ ليظهر كزر سريع.</span>';depositsList.innerHTML=[...s.deposits]
.map((d,i)=>({...d,_i:i,type:(String(d.date||'').replace(/-/g,'/')==='2026/01/01'||String(d.date||'').replace(/-/g,'/')==='1/1/2026')&&!d.type?'initial':d.type}))
.sort((a,b)=>{
 const da=(a.date?new Date(a.date).getTime():0)||0;
 const db=(b.date?new Date(b.date).getTime():0)||0;
 if(db!==da)return db-da;
 return (b.createdAt||b._i||0)-(a.createdAt||a._i||0);
})
.map(d=>`<div class="item depositRow" onclick="depositOptions('${d.id}')">
<span class="depositDateNameRow"><span class="depositDateCell">${formatDateDisplay(d.date)}</span><span class="depositPlayerCell">${d.player}</span></span>
<span class="${clsMoney(d.amount)} depoAmountGroup"><b>${depositTypeLabel(d)}</b>&nbsp;&nbsp;${money(d.amount)}</span>
</div>`).join('');teamsMatchSelect.innerHTML=s.matches
.sort((a,b)=>b.date.localeCompare(a.date))
.map(m=>`<option value="${m.id}">${formatDateDisplay(m.date)} | ${m.place||m.location||''}</option>`)
.join('');renderTempGuests();renderCalendar();renderCalendarList();renderMatchLog(s);renderTeams();renderTables(s,b);updatePrettyDates()}
function exportData(){const blob=new Blob([JSON.stringify(state(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='qatiya-backup.json';a.click()}
function importData(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{localStorage.setItem('qatiyaState',r.result);renderAll();alert('تم الاستيراد')};r.readAsText(f)}
if('serviceWorker'in navigator){navigator.serviceWorker.register('sw.js')}setDepositType('in');renderAll();
setTimeout(()=>{const first=document.querySelector("nav button");if(first)first.classList.add('activeTab')},100);


function renderDepositHistory(){
  const box=document.getElementById('depositHistoryList') || document.getElementById('depositsList');
  if(!box)return;

  const s=state();
  const list=[...(s.deposits||[])].map(d=>{
    const raw=String(d.date||'').replace(/-/g,'/');
    if((raw==='2026/01/01'||raw==='1/1/2026') && !d.type){
      return {...d,type:'initial'};
    }
    return d;
  }).sort((a,b)=>{
    const da=new Date(a.date||'1900-01-01').getTime();
    const db=new Date(b.date||'1900-01-01').getTime();
    if(db!==da)return db-da;
    return (b.createdAt||0)-(a.createdAt||0);
  });

  if(!list.length){
    box.innerHTML='<p class="muted">لا توجد عمليات</p>';
    return;
  }

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
    if(select){
      select.value=playerName;
      renderPlayerFilter();
    }
  },150);
}


function updatePlayersGuestsCount(){
  const el=document.getElementById('livePlayersGuestsCount');
  if(!el)return;

  const players=document.querySelectorAll('#matchPlayers input.playerCheck:checked').length;

  let guests=0;

  const guestWrap=document.getElementById('guestList');
  if(guestWrap){
    guests=guestWrap.querySelectorAll('.item').length;
  }

  el.textContent='('+(players+guests)+')';
}

document.addEventListener('change',function(e){
  if(e.target && e.target.classList.contains('playerCheck')){
    updatePlayersGuestsCount();
  }
});

setInterval(function(){
  try{updatePlayersGuestsCount()}catch(e){}
},1000);
