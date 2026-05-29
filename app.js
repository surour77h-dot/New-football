
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
function state(){const r=JSON.parse(localStorage.getItem('qatiyaState')||'{"players":[],"matches":[],"deposits":[],"teams":{},"settings":{}}');r.players=r.players||[];r.matches=r.matches||[];r.deposits=r.deposits||[];r.extraCharges=r.extraCharges||[];r.extraDiscounts=r.extraDiscounts||[];r.teams=r.teams||{};r.settings=r.settings||{};r.matches.forEach(m=>{if(!m.id)m.id=uid()});r.deposits.forEach(d=>{if(!d.id)d.id=uid()});r.extraCharges.forEach(x=>{if(!x.id)x.id=uid()});r.extraDiscounts.forEach(x=>{if(!x.id)x.id=uid()});r.players.sort((a,b)=>a.localeCompare(b,'ar'));return r}
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
 ['accounts','الحسابات'],
 ['backup','الإعدادات']
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
function setDepositType(t){
 depositType=t;

 depositTypeIn.className='';
 depositTypeOut.className='';
 if(typeof depositTypeLate!=='undefined' && depositTypeLate) depositTypeLate.className='';

 if(t==='in') depositTypeIn.className='primary selectedDepositBtn';
 if(t==='out'||t==='debt') depositTypeOut.className='danger selectedDepositBtn';
 if(t==='late' && typeof depositTypeLate!=='undefined' && depositTypeLate) depositTypeLate.className='lateActive selectedDepositBtn';
}
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
function teamHtml(s,m){
 const map=s.teams[m.id]||{};
 const names=participants(m);
 const a=names.filter(n=>map[n]==='A');
 const b=names.filter(n=>map[n]==='B');
 const no=names.filter(n=>!map[n]);

 const aHtml=a.map(x=>`<div class="teamName">${x}</div>`).join('')||'<p class="muted">لا يوجد</p>';
 const bHtml=b.map(x=>`<div class="teamName">${x}</div>`).join('')||'<p class="muted">لا يوجد</p>';

 if(a.length||b.length){
   return `
   <div class="newTeamsWrap">
      <div class="newTeamBox secondTeamBox">
         <h4>الفريق الثاني</h4>
         ${bHtml}
      </div>

      <div class="newTeamBox firstTeamBox">
         <h4>الفريق الأول</h4>
         ${aHtml}
      </div>
   </div>
   `+(no.length?`<p class="muted">بدون فريق: ${no.join('، ')}</p>`:'');
 }

 return names.map(n=>`<div class="item"><b>${n}</b></div>`).join('');
}
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

function escapeHtml(v){
  return String(v??'').replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}
function clsMoney(n){
  n=Number(n||0);
  return n<0?'neg':n>0?'pos':'';
}
function getLateTotal(s){
  return (s.deposits||[]).filter(d=>d.type==='late').reduce((sum,d)=>sum+Math.abs(Number(d.amount||0)),0);
}
function getExtraTotal(s){
  return (s.extraCharges||[]).reduce((sum,x)=>sum+Number(x.amount||0),0);
}
function getExtraDiscountTotal(s){
  return (s.extraDiscounts||[]).reduce((sum,x)=>sum+Number(x.amount||0),0);
}
function moneyNeg(v){ return money(-Math.abs(Number(v||0))); }
function renderAccounts(){
  const wrap=document.getElementById('accountsContent');
  if(!wrap)return;
  const s=state();
  s.extraDiscounts=s.extraDiscounts||[];
  const b=balances(s);
  const negative=s.players.filter(p=>Number(b[p]?.balance||0)<0).sort((a,c)=>Number(b[a]?.balance||0)-Number(b[c]?.balance||0));
  const extraTotal=getExtraTotal(s);
  const discountTotal=getExtraDiscountTotal(s);
  const lateTotal=getLateTotal(s);
  const negativeTotal=negative.reduce((sum,p)=>sum+Math.abs(Number(b[p]?.balance||0)),0);
  // المعادلة المعتمدة في صفحة الحسابات:
  // مجموع المديونية = اللاعبين المدانين + مشتريات
  // الإجمالي النهائي = الباقي + مجموع التأخير
  const debtTotal=negativeTotal+discountTotal;
  const finalTotal=extraTotal+lateTotal;

  const matchOptions=[...s.matches].sort((a,b)=>b.date.localeCompare(a.date)).map(m=>{
    const label=`${formatDateDisplay(m.date)}${m.place?' - '+m.place:''} | ${money(m.bookingCost||m.price||0)} د.ك`;
    return `<option value="${escapeHtml(m.id)}">${escapeHtml(label)}</option>`;
  }).join('');

  const negativeCards=negative.map(p=>{
    const safeName=String(p).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return `<div class="accountAlertItem negativePlayer clickableAlert" onclick="openPlayerProfileDirect('${safeName}')"><b>${escapeHtml(p)}</b><span>${money(b[p].balance)}</span></div>`;
  }).join('');

  const lateItems=[...(s.deposits||[])].filter(d=>d.type==='late').sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.createdAt||0)-(a.createdAt||0));
  const lateCards=lateItems.map(d=>{
    const player=d.player||'';
    const safeName=String(player).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return `<div class="accountAlertItem latePlayer clickableAlert" onclick="openPlayerProfileDirect('${safeName}')"><b>${escapeHtml(player)}</b><span>${money(Math.abs(Number(d.amount||0)))}</span></div>`;
  }).join('');
  const alertsHtml=(negativeCards||lateCards)?`<div class="negativePlayersGrid accountAlertsGrid">${negativeCards}${lateCards}</div>`:'<p class="muted">لا يوجد لاعبين مدانين أو متأخرين.</p>';

  const combinedRows=[
    ...(s.extraCharges||[]).map(x=>({...x,_type:'extra'})),
    ...(s.extraDiscounts||[]).map(x=>({...x,_type:'discount'}))
  ].sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.createdAt||0)-(a.createdAt||0)).map(x=>{
    const isExtra=x._type==='extra';
    const shownAmount=isExtra?Number(x.amount||0):-Math.abs(Number(x.amount||0));
    return `<div class="accountsTxRow ${isExtra?'accountsTxExtra':'accountsTxDiscount'}">
      <span class="accountsTxDate" title="${formatDateDisplay(x.date)}">${formatDateDisplay(x.date)}</span>
      <span class="accountsTxPlace">${escapeHtml(x.place||'')}</span>
      <span class="accountsTxAmount ${isExtra?'amountExtra':'amountDiscount'}"><b>${isExtra?'إضافة':'خصم'}</b>&nbsp;&nbsp;${money(shownAmount)}</span>
      <button class="accountsTxDelete" onclick="${isExtra?'deleteExtraCharge':'deleteExtraDiscount'}('${x.id}')">×</button>
    </div>`;
  }).join('');

  wrap.innerHTML=`
    <div class="summaryCards accountsSummary">
      <div class="summaryCard debtCard summaryMini"><span>اللاعبين المدانين</span><b class="negText">${moneyNeg(negativeTotal)}</b></div>
      <div class="summaryCard discountCard summaryMini"><span>مشتريات</span><b class="negText">${moneyNeg(discountTotal)}</b></div>
      <div class="summaryCard debtTotalCard"><span>مجموع المديونية</span><b class="negText">${moneyNeg(debtTotal)}</b></div>
      <div class="summaryCard extraCard"><span>الباقي</span><b class="posText">${money(extraTotal)}</b></div>
      <div class="summaryCard lateCard summaryMini"><span>مجموع التأخير</span><b class="lateText">${money(lateTotal)}</b></div>
      <div class="summaryCard finalTotalCard ${finalTotal<0?'finalNegativeCard':finalTotal>0?'finalPositiveCard':'finalNeutralCard'}"><span>الإجمالي النهائي</span><b class="${finalTotal<0?'negText':finalTotal>0?'posText':''}">${money(finalTotal)}</b></div>
    </div>

    <div class="card">
      <h3>اللاعبين المدانين والمتأخرين</h3>
      ${alertsHtml}
    </div>

    <div class="card">
      <h3>إضافة مبلغ إضافي</h3>
      <label>تاريخ اللعب من الألعاب المسجلة
        <select id="extraMatchSelect" onchange="fillExtraFromMatch()">
          <option value="">اختر تاريخ اللعب</option>
          ${matchOptions}
        </select>
      </label>
      <div class="two">
        <label>المكان<input id="extraPlace" readonly placeholder="يظهر تلقائياً"></label>
        <label>المبلغ الإضافي<input id="extraAmount" type="number" step="0.001" inputmode="decimal" placeholder="0.000"></label>
      </div>
      <button class="primary wide" onclick="saveExtraCharge()">حفظ</button>
      <p class="muted">عند اختيار تاريخ اللعب يتم تعبئة المكان وسعر الحجز كمبلغ إضافي، وتقدر تعدل المبلغ قبل الحفظ.</p>
    </div>

    <div class="card">
      <h3>إضافة خصم إضافي</h3>
      <label>تاريخ اللعب من الألعاب المسجلة
        <select id="discountMatchSelect" onchange="fillDiscountFromMatch()">
          <option value="">اختر تاريخ اللعب</option>
          ${matchOptions}
        </select>
      </label>
      <div class="two">
        <label>المكان<input id="discountPlace" readonly placeholder="يظهر تلقائياً"></label>
        <label>قيمة الخصم<input id="discountAmount" type="number" step="0.001" inputmode="decimal" placeholder="0.000"></label>
      </div>
      <button class="primary wide" onclick="saveExtraDiscount()">حفظ الخصم</button>
      <p class="muted">يتم احتساب الخصم الإضافي ضمن إجمالي المديونية، أما المبلغ الإضافي فيُخصم من الإجمالي النهائي.</p>
    </div>

    <div class="card">
      <h3>جدول المبالغ الإضافية والخصم الإضافي</h3>
      <div id="accountsExtraList" class="accountsTxList">${combinedRows||'<p class="muted">لا توجد مبالغ إضافية أو خصومات محفوظة.</p>'}</div>
    </div>`;
}
function fillExtraFromMatch(){
  const s=state();
  const id=document.getElementById('extraMatchSelect')?.value;
  const m=s.matches.find(x=>x.id===id);
  const placeEl=document.getElementById('extraPlace');
  const amountEl=document.getElementById('extraAmount');
  if(!m){ if(placeEl)placeEl.value=''; if(amountEl)amountEl.value=''; return; }
  if(placeEl)placeEl.value=m.place||'';
  if(amountEl)amountEl.value=money(m.bookingCost||0);
}
function saveExtraCharge(){
  const s=state();
  const id=document.getElementById('extraMatchSelect')?.value;
  const m=s.matches.find(x=>x.id===id);
  const amount=Number(document.getElementById('extraAmount')?.value||0);
  if(!m)return alert('اختر تاريخ اللعب أولاً');
  if(!amount || amount<=0)return alert('اكتب المبلغ الإضافي بشكل صحيح');
  s.extraCharges=s.extraCharges||[];
  s.extraCharges.push({id:uid(),matchId:m.id,date:m.date,place:m.place||'',amount,createdAt:Date.now()});
  save(s);
  alert('تم حفظ المبلغ الإضافي');
}
function deleteExtraCharge(id){
  if(!confirm('حذف هذا المبلغ الإضافي؟'))return;
  const s=state();
  s.extraCharges=(s.extraCharges||[]).filter(x=>x.id!==id);
  save(s);
}
function fillDiscountFromMatch(){
  const s=state();
  const id=document.getElementById('discountMatchSelect')?.value;
  const m=s.matches.find(x=>x.id===id);
  const placeEl=document.getElementById('discountPlace');
  const amountEl=document.getElementById('discountAmount');
  if(!m){ if(placeEl)placeEl.value=''; if(amountEl)amountEl.value=''; return; }
  if(placeEl)placeEl.value=m.place||'';
  if(amountEl)amountEl.value='';
}
function saveExtraDiscount(){
  const s=state();
  const id=document.getElementById('discountMatchSelect')?.value;
  const m=s.matches.find(x=>x.id===id);
  const amount=Number(document.getElementById('discountAmount')?.value||0);
  if(!m)return alert('اختر تاريخ اللعب أولاً');
  if(!amount || amount<=0)return alert('اكتب قيمة الخصم بشكل صحيح');
  s.extraDiscounts=s.extraDiscounts||[];
  s.extraDiscounts.push({id:uid(),matchId:m.id,date:m.date,place:m.place||'',amount,createdAt:Date.now()});
  save(s);
  alert('تم حفظ الخصم الإضافي');
}
function deleteExtraDiscount(id){
  if(!confirm('حذف هذا الخصم الإضافي؟'))return;
  const s=state();
  s.extraDiscounts=(s.extraDiscounts||[]).filter(x=>x.id!==id);
  save(s);
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
.join('');renderTempGuests();renderCalendar();renderCalendarList();renderMatchLog(s);renderTeams();renderTables(s,b);renderAccounts();updatePrettyDates()}
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



function fixTeamsVisualOrderAndHighlight(){
  try{
    document.querySelectorAll('#teamsPreview .calendarTeams, #calendarList .calendarTeams').forEach(box=>{
      box.style.direction='rtl';
      box.style.display='grid';
      box.style.gridTemplateColumns='1fr 1fr';
      const a=box.querySelector('.teamABox');
      const b=box.querySelector('.teamBBox');
      if(a){a.style.order='1';a.style.background='#fbffb8'}
      if(b){b.style.order='2';b.style.background='#ffd1f3'}
    });

    document.querySelectorAll('#teamsPlayers button.selA').forEach(btn=>{
      btn.style.background='#ffe066';
      btn.style.border='2px solid #b08900';
      btn.style.fontWeight='900';
      btn.style.transform='scale(1.06)';
      btn.style.boxShadow='0 0 0 3px rgba(255,224,102,.45), 0 4px 12px rgba(0,0,0,.18)';
    });
    document.querySelectorAll('#teamsPlayers button.selB').forEach(btn=>{
      btn.style.background='#ff8ccf';
      btn.style.border='2px solid #b83280';
      btn.style.fontWeight='900';
      btn.style.transform='scale(1.06)';
      btn.style.boxShadow='0 0 0 3px rgba(255,140,207,.38), 0 4px 12px rgba(0,0,0,.18)';
    });
  }catch(e){}
}

const __oldRenderTeamsFix=typeof renderTeams==='function'?renderTeams:null;
if(__oldRenderTeamsFix && !__oldRenderTeamsFix.__fixedTeamsVisual){
  renderTeams=function(){
    const r=__oldRenderTeamsFix.apply(this,arguments);
    setTimeout(fixTeamsVisualOrderAndHighlight,50);
    return r;
  };
  renderTeams.__fixedTeamsVisual=true;
}

const __oldRenderTeamsPreviewFix=typeof renderTeamsPreview==='function'?renderTeamsPreview:null;
if(__oldRenderTeamsPreviewFix && !__oldRenderTeamsPreviewFix.__fixedTeamsPreviewVisual){
  renderTeamsPreview=function(){
    const r=__oldRenderTeamsPreviewFix.apply(this,arguments);
    setTimeout(fixTeamsVisualOrderAndHighlight,50);
    return r;
  };
  renderTeamsPreview.__fixedTeamsPreviewVisual=true;
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(fixTeamsVisualOrderAndHighlight,300));
setInterval(fixTeamsVisualOrderAndHighlight,1500);



function fixTeamBoxesByTitle(){
 try{
   document.querySelectorAll('.calendarTeams').forEach(wrap=>{
      const boxes=[...wrap.children];
      let firstBox=null, secondBox=null;

      boxes.forEach(b=>{
         const txt=(b.innerText||'').trim();
         if(txt.includes('الأول')) firstBox=b;
         if(txt.includes('الثاني')) secondBox=b;
      });

      wrap.style.display='grid';
      wrap.style.gridTemplateColumns='1fr 1fr';
      wrap.style.direction='ltr';
      wrap.style.gap='18px';

      if(firstBox){
         firstBox.style.gridColumn='2';
         firstBox.style.background='#f6f3b1';
      }

      if(secondBox){
         secondBox.style.gridColumn='1';
         secondBox.style.background='#efc0e5';
      }
   });
 }catch(e){}
}

document.addEventListener('DOMContentLoaded',()=>{
 setTimeout(fixTeamBoxesByTitle,300);
});

setInterval(fixTeamBoxesByTitle,1200);




function forceSwapTeamBoxesByText(){
  try{
    document.querySelectorAll('#teamsPreview .calendarTeams, #calendarList .calendarTeams, .calendarTeams').forEach(wrap=>{
      const boxes=[...wrap.children].filter(el=>el && el.querySelector);
      let first=null, second=null;

      boxes.forEach(el=>{
        const t=(el.textContent||'').trim();
        if(t.includes('الفريق الأول') || t.includes('الأول')) first=el;
        if(t.includes('الفريق الثاني') || t.includes('الثاني')) second=el;
      });

      if(!first || !second) return;

      // Physical order in DOM: second first (left), first last (right)
      if(wrap.children[0] !== second) wrap.insertBefore(second, wrap.firstElementChild);
      if(wrap.lastElementChild !== first) wrap.appendChild(first);

      wrap.style.setProperty('display','grid','important');
      wrap.style.setProperty('grid-template-columns','1fr 1fr','important');
      wrap.style.setProperty('direction','ltr','important');
      wrap.style.setProperty('gap','18px','important');

      second.style.setProperty('background','#ffd1f3','important');
      second.style.setProperty('grid-column','1','important');
      second.style.setProperty('order','1','important');
      second.style.setProperty('direction','rtl','important');

      first.style.setProperty('background','#fbffb8','important');
      first.style.setProperty('grid-column','2','important');
      first.style.setProperty('order','2','important');
      first.style.setProperty('direction','rtl','important');
    });
  }catch(e){
    console.log('forceSwapTeamBoxesByText error',e);
  }
}

const __oldRenderAllTeamSwap=typeof renderAll==='function'?renderAll:null;
if(__oldRenderAllTeamSwap && !__oldRenderAllTeamSwap.__teamSwapWrapped){
  renderAll=function(){
    const r=__oldRenderAllTeamSwap.apply(this,arguments);
    setTimeout(forceSwapTeamBoxesByText,50);
    setTimeout(forceSwapTeamBoxesByText,250);
    return r;
  };
  renderAll.__teamSwapWrapped=true;
}

['renderTeams','renderTeamsPreview','renderCalendarList'].forEach(fn=>{
  const old=window[fn];
  if(typeof old==='function' && !old.__teamSwapWrapped){
    window[fn]=function(){
      const r=old.apply(this,arguments);
      setTimeout(forceSwapTeamBoxesByText,50);
      setTimeout(forceSwapTeamBoxesByText,250);
      return r;
    };
    window[fn].__teamSwapWrapped=true;
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(forceSwapTeamBoxesByText,200);
  setTimeout(forceSwapTeamBoxesByText,800);
});
setInterval(forceSwapTeamBoxesByText,1000);



/* === HARD OVERRIDE TEAM BOXES === */
(function(){
 function applyHardSwap(){
   try{
     document.querySelectorAll('.calendarTeams').forEach(function(wrap){

       let firstBox=null;
       let secondBox=null;

       Array.from(wrap.children).forEach(function(el){
         const txt=(el.innerText||'').trim();

         if(txt.indexOf('الفريق الأول')>-1 || txt.indexOf('الأول')>-1){
           firstBox=el;
         }

         if(txt.indexOf('الفريق الثاني')>-1 || txt.indexOf('الثاني')>-1){
           secondBox=el;
         }
       });

       if(!firstBox || !secondBox) return;

       // حذف الترتيب الحالي
       wrap.innerHTML='';

       // اليسار = الثاني الوردي
       secondBox.style.background='#efc0e5';
       secondBox.style.order='1';

       // اليمين = الأول الأصفر
       firstBox.style.background='#f6f3b1';
       firstBox.style.order='2';

       wrap.style.display='flex';
       wrap.style.flexDirection='row';
       wrap.style.direction='ltr';
       wrap.style.gap='18px';

       // أضف الثاني أولاً ثم الأول
       wrap.appendChild(secondBox);
       wrap.appendChild(firstBox);
     });
   }catch(e){}
 }

 window.applyHardSwap=applyHardSwap;

 setInterval(applyHardSwap,500);

 document.addEventListener('DOMContentLoaded',function(){
   setTimeout(applyHardSwap,100);
   setTimeout(applyHardSwap,500);
   setTimeout(applyHardSwap,1200);
 });
})();



function applyAppTitle(){
  try{
    const s=state();
    const title=(s.settings&&s.settings.appTitle)||'🏆 سجل وحسابات ⚽️ قروب الكورة 🏆';
    const h=document.getElementById('appTitle');
    if(h) h.textContent=title;
    document.title=title;
    const input=document.getElementById('appTitleInput');
    if(input && document.activeElement!==input) input.value=title;
  }catch(e){}
}

function saveAppTitle(){
  const input=document.getElementById('appTitleInput');
  if(!input)return;
  const s=state();
  if(!s.settings)s.settings={};
  s.settings.appTitle=(input.value||'').trim()||'🏆 سجل وحسابات ⚽️ قروب الكورة 🏆';
  saveNoRender(s);
  applyAppTitle();
  alert('تم حفظ العنوان');
}

const __oldRenderAllTitle=typeof renderAll==='function'?renderAll:null;
if(__oldRenderAllTitle && !__oldRenderAllTitle.__titleWrapped){
  renderAll=function(){
    const r=__oldRenderAllTitle.apply(this,arguments);
    applyAppTitle();
    return r;
  };
  renderAll.__titleWrapped=true;
}

const __oldShowTabTitle=typeof showTab==='function'?showTab:null;
if(__oldShowTabTitle && !__oldShowTabTitle.__titleWrapped){
  showTab=function(id){
    const r=__oldShowTabTitle.apply(this,arguments);
    if(id==='backup'){
      setTimeout(()=>{renderPageOrder();applyAppTitle();},50);
    }
    return r;
  };
  showTab.__titleWrapped=true;
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(applyAppTitle,100));



/* ===== Excel Export Full Workbook ===== */
function moneyExcel(v){
  const n = Number(v || 0);
  return Number.isFinite(n) ? Number(n.toFixed(3)) : 0;
}

function excelParticipants(match){
  try {
    const p = participants(match);
    if (Array.isArray(p)) return p.filter(Boolean);
  } catch(e) {}
  const arr = [];
  (match.players || match.participants || []).forEach(x => arr.push(typeof x === 'string' ? x : (x && x.name) || ''));
  (match.guests || []).forEach(g => arr.push(g.name || g.guest || g.guestName || g.player || ''));
  return arr.filter(Boolean);
}

function excelGuestName(g){
  return g.name || g.guest || g.guestName || g.player || '';
}

function excelGuestOwner(g){
  return g.owner || g.by || g.member || g.playerOwner || g.addedBy || '';
}

function appendExcelSheet(wb, rows, sheetName){
  const safeRows = rows && rows.length ? rows : [{'لا توجد بيانات':''}];
  const ws = Array.isArray(safeRows[0]) ? XLSX.utils.aoa_to_sheet(safeRows) : XLSX.utils.json_to_sheet(safeRows);
  const data = XLSX.utils.sheet_to_json(ws, {header:1});
  const widths = [];
  data.forEach(row => (row || []).forEach((cell, i) => {
    widths[i] = Math.max(widths[i] || 10, Math.min(String(cell || '').length + 2, 55));
  }));
  ws['!cols'] = widths.map(w => ({wch:w}));
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
}

function exportExcelData(){
  try{
    if (typeof XLSX === 'undefined'){
      alert('مكتبة Excel لم يتم تحميلها. تأكد من الاتصال بالإنترنت ثم حاول مرة أخرى.');
      return;
    }

    const s = state();
    const wb = XLSX.utils.book_new();

    const players = s.players || [];
    const matches = s.matches || [];
    const deposits = s.deposits || [];
    const settings = s.settings || {};
    const balanceData = balances(s);

    const totalDeposits = deposits.filter(d => Number(d.amount || 0) > 0).reduce((a,d)=>a+Number(d.amount||0),0);
    const totalDeductions = Math.abs(deposits.filter(d => Number(d.amount || 0) < 0).reduce((a,d)=>a+Number(d.amount||0),0));
    const totalBooking = matches.reduce((a,m)=>a+Number(m.bookingCost || m.cost || 0),0);

    appendExcelSheet(wb, [
      ['البند','القيمة'],
      ['عدد اللاعبين', players.length],
      ['عدد أيام اللعب / المباريات', matches.length],
      ['عدد الإيداعات والمديونيات', deposits.length],
      ['إجمالي الإيداعات', moneyExcel(totalDeposits)],
      ['إجمالي الخصومات / المديونيات', moneyExcel(totalDeductions)],
      ['إجمالي أسعار الحجوزات', moneyExcel(totalBooking)],
      ['تاريخ التصدير', new Date().toLocaleString('ar-KW')]
    ], 'الملخص');

    appendExcelSheet(wb, players.map((p, i) => ({
      'م': i + 1,
      'اسم اللاعب': p,
      'الرصيد': moneyExcel((balanceData[p] || {}).balance),
      'عدد اللعب': (balanceData[p] || {}).games || 0,
      'آخر لعب': (balanceData[p] || {}).last ? formatDateDisplay((balanceData[p] || {}).last) : '',
      'إجمالي الإيداعات': moneyExcel((balanceData[p] || {}).deposits || 0)
    })), 'اللاعبين');

    appendExcelSheet(wb, deposits
      .slice()
      .sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')))
      .map((d,i)=>({
        'م': i + 1,
        'التاريخ': d.date || '',
        'التاريخ المعروض': d.date ? formatDateDisplay(d.date) : '',
        'اللاعب': d.player || '',
        'النوع': typeof depositTypeLabel === 'function' ? depositTypeLabel(d) : (Number(d.amount||0) >= 0 ? 'إيداع' : 'خصم/مديونية'),
        'المبلغ': moneyExcel(d.amount),
        'ملاحظة': d.note || d.notes || ''
      })), 'الإيداعات');

    appendExcelSheet(wb, matches
      .slice()
      .sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')))
      .map((m,i)=>{
        const ps = excelParticipants(m);
        return {
          'م': i + 1,
          'التاريخ': m.date || '',
          'التاريخ المعروض': m.date ? formatDateDisplay(m.date) : '',
          'مكان اللعب': m.place || m.location || '',
          'سعر الحجز': moneyExcel(m.bookingCost || m.cost || 0),
          'عدد اللاعبين المطلوب': m.neededPlayers || m.count || '',
          'سعر اللاعب': moneyExcel(m.pricePerPlayer || m.playerPrice || (ps.length ? Number(m.bookingCost || m.cost || 0) / ps.length : 0)),
          'عدد المشاركين الفعلي': ps.length,
          'المشاركون': ps.join('، ')
        };
      }), 'أيام اللعب');

    const participantRows = [];
    matches.forEach(m => {
      const teamMap = (s.teams && s.teams[m.id]) || {};
      excelParticipants(m).forEach((p, i) => {
        participantRows.push({
          'تاريخ اللعب': m.date || '',
          'التاريخ المعروض': m.date ? formatDateDisplay(m.date) : '',
          'مكان اللعب': m.place || m.location || '',
          'الاسم': p,
          'الترتيب': i + 1,
          'الفريق': teamMap[p] === 'A' ? 'الفريق الأول' : teamMap[p] === 'B' ? 'الفريق الثاني' : '',
          'النوع': players.includes(p) ? 'لاعب أساسي' : 'ضيف'
        });
      });
    });
    appendExcelSheet(wb, participantRows, 'المشاركون');

    const guestRows = [];
    matches.forEach(m => {
      (m.guests || []).forEach((g, i) => {
        guestRows.push({
          'تاريخ اللعب': m.date || '',
          'التاريخ المعروض': m.date ? formatDateDisplay(m.date) : '',
          'مكان اللعب': m.place || m.location || '',
          'اسم الضيف': excelGuestName(g),
          'أحضره اللاعب': excelGuestOwner(g),
          'قيمة الخصم / القطية': moneyExcel(g.amount || g.price || g.cost || m.pricePerPlayer || 0),
          'ملاحظة': g.note || ''
        });
      });
    });
    appendExcelSheet(wb, guestRows, 'الضيوف');

    appendExcelSheet(wb, matches
      .slice()
      .sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')))
      .map(m => {
        const d = new Date(m.date);
        const ps = excelParticipants(m);
        return {
          'الشهر': m.date && !isNaN(d) ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` : '',
          'اليوم': m.date || '',
          'التاريخ المعروض': m.date ? formatDateDisplay(m.date) : '',
          'مكان اللعب': m.place || m.location || '',
          'سعر الحجز': moneyExcel(m.bookingCost || m.cost || 0),
          'عدد المشاركين': ps.length,
          'أسماء المشاركين': ps.join('، ')
        };
      }), 'التقويم');

    const teamRows = [];
    matches.forEach(m => {
      const teamMap = (s.teams && s.teams[m.id]) || {};
      Object.keys(teamMap).forEach(name => {
        teamRows.push({
          'تاريخ اللعب': m.date || '',
          'مكان اللعب': m.place || m.location || '',
          'الاسم': name,
          'الفريق': teamMap[name] === 'A' ? 'الفريق الأول' : teamMap[name] === 'B' ? 'الفريق الثاني' : teamMap[name]
        });
      });
    });
    appendExcelSheet(wb, teamRows, 'الفريقين');

    appendExcelSheet(wb, Object.keys(settings).map(k => ({
      'الإعداد': k,
      'القيمة': String(settings[k])
    })), 'الإعدادات');

    XLSX.writeFile(wb, 'football-data-' + new Date().toISOString().slice(0,10) + '.xlsx');
  } catch(err){
    console.error(err);
    alert('حدث خطأ أثناء تصدير ملف Excel.');
  }
}


/* Football Manager Pro dashboard + nav */
(function(){
  function safeMoney(n){n=Number(n||0); if(!isFinite(n)) n=0; return n.toFixed(3);}
  function setText(id,v){var el=document.getElementById(id); if(el) el.textContent=v;}
  function amountOf(x){return Number((x && (x.amount ?? x.value ?? x.total ?? 0)) || 0) || 0;}
  window.updateFootballManagerDashboard=function(){
    try{
      if(typeof state!=='function') return;
      var s=state()||{}, players=s.players||[], matches=s.matches||[], deposits=s.deposits||[];
      var late=deposits.filter(function(d){return d&&d.type==='late'}).reduce(function(a,d){return a+amountOf(d)},0);
      var debt=0;
      try{ if(typeof computeBalances==='function'){ var b=computeBalances(s)||{}; Object.keys(b).forEach(function(k){ var v=b[k], n=0; if(typeof v==='number') n=v; else if(v&&typeof v==='object') n=Number(v.balance ?? v.total ?? v.remaining ?? 0)||0; if(n<0) debt+=Math.abs(n); }); } }catch(e){}
      if(!debt){debt=deposits.filter(function(d){return d&&d.type==='debt'}).reduce(function(a,d){return a+amountOf(d)},0);}
      var latest=matches.slice().sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''))})[0];
      ['fmTopPlayers','fmPlayers'].forEach(function(id){setText(id,players.length)});
      ['fmTopMatches','fmMatches'].forEach(function(id){setText(id,matches.length)});
      ['fmTopDebt','fmDebt'].forEach(function(id){setText(id,safeMoney(debt))});
      setText('fmLate',safeMoney(late));
      setText('fmLatestGame', latest ? ((latest.date||'')+(latest.place?' • '+latest.place:'')) : 'جاهز للعبة القادمة');
    }catch(e){}
  };
  function mark(id){document.querySelectorAll('[data-tab]').forEach(function(btn){btn.classList.toggle('activeTab',btn.getAttribute('data-tab')===id);});document.body.dataset.page=id||'newMatch';}
  var oldSet=window.setActiveNavButton; window.setActiveNavButton=function(id){if(typeof oldSet==='function'){try{oldSet(id)}catch(e){}} mark(id); setTimeout(window.updateFootballManagerDashboard,0);};
  var oldShow=window.showTab; if(typeof oldShow==='function'){window.showTab=function(id){var r=oldShow.apply(this,arguments); mark(id); setTimeout(window.updateFootballManagerDashboard,0); return r;};}
  var oldRender=window.renderAll; if(typeof oldRender==='function'){window.renderAll=function(){var r=oldRender.apply(this,arguments); setTimeout(window.updateFootballManagerDashboard,0); return r;};}
  document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){mark(window.currentTabId||'newMatch');window.updateFootballManagerDashboard();},250);});
})();



/* =========================================================
   Football Manager Luxury V2 patches
   ========================================================= */

const FM_PAGE_TITLES = {
  newMatch:'الرئيسية',
  accounts:'الحسابات',
  players:'اللاعبين',
  playerFilter:'كشف لاعب',
  calendar:'التقويم',
  teams:'الفريقين',
  deposits:'الإيداعات',
  playerTable:'جدول اللاعبين',
  matchLog:'السجل',
  reports:'التقارير',
  backup:'الإعدادات',
  editPage:'ترتيب الصفحات'
};

function openDrawer(){ document.body.classList.add('drawerOpen'); }
function closeDrawer(){ document.body.classList.remove('drawerOpen'); }

function fmMoneyText(n){
  n = Number(n || 0);
  if(!isFinite(n)) n = 0;
  if(Math.abs(n) < 0.0005) return '';
  return n.toFixed(3);
}
function fmMoneyClass(n, kind){
  n = Number(n || 0);
  if(kind === 'late') return 'moneyLate';
  if(kind === 'deposit' || kind === 'add') return 'moneyPos';
  if(kind === 'debt' || kind === 'discount') return 'moneyNeg';
  if(n > 0) return 'moneyPos';
  if(n < 0) return 'moneyNeg';
  return 'moneyZero';
}
function fmFormatDate(d){
  if(!d) return '';
  const s = String(d);
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)){
    const [y,m,day]=s.split('-');
    return `${day}/${m}/${String(y).slice(2)}`;
  }
  return s;
}

(function(){
  const oldShowTab = window.showTab;
  window.showTab = function(id){
    const r = oldShowTab ? oldShowTab.apply(this, arguments) : undefined;
    document.body.dataset.page = id;
    document.querySelectorAll('[data-tab]').forEach(btn=>btn.classList.toggle('activeTab', btn.getAttribute('data-tab')===id));
    const box = document.getElementById('currentPageBox');
    if(box) box.textContent = FM_PAGE_TITLES[id] || id;
    setTimeout(applyLuxuryV2DomFixes, 0);
    return r;
  };
  const oldRenderAll = window.renderAll;
  if(typeof oldRenderAll === 'function'){
    window.renderAll = function(){
      const r = oldRenderAll.apply(this, arguments);
      setTimeout(applyLuxuryV2DomFixes, 0);
      return r;
    };
  }
})();

function applyLuxuryV2DomFixes(){
  try{
    document.querySelectorAll('.pos,.neg,.count').forEach(el=>{
      el.classList.add('textOnlyAmount');
    });
    document.querySelectorAll('td,span,b').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(/^0\.000$/.test(t) && !el.closest('.info')) el.textContent='';
    });
    // remove edit/save buttons from match log cards visually when labels match
    document.querySelectorAll('#matchLog button').forEach(btn=>{
      const t=(btn.textContent||'').trim();
      if(t==='تعديل' || t==='حفظ') btn.style.display='none';
    });
  }catch(e){}
}

let adjustEditorDraft = null;
function openAdjustEditor(){
  try{
    const s = state();
    adjustEditorDraft = {
      extraCharges: JSON.parse(JSON.stringify(s.extraCharges || [])),
      extraDiscounts: JSON.parse(JSON.stringify(s.extraDiscounts || []))
    };
    renderAdjustEditTable();
    document.getElementById('adjustEditModal')?.classList.add('show');
  }catch(e){}
}
function closeAdjustEditor(){ document.getElementById('adjustEditModal')?.classList.remove('show'); }
function removeAdjustRow(type,id){
  if(!adjustEditorDraft) return;
  const key = type === 'discount' ? 'extraDiscounts' : 'extraCharges';
  adjustEditorDraft[key] = (adjustEditorDraft[key]||[]).filter(x=>x.id!==id);
  renderAdjustEditTable();
}
function saveAdjustEditor(){
  if(!adjustEditorDraft) return closeAdjustEditor();
  const s = state();
  s.extraCharges = adjustEditorDraft.extraCharges || [];
  s.extraDiscounts = adjustEditorDraft.extraDiscounts || [];
  save(s);
  closeAdjustEditor();
  showTab('accounts');
}
function renderAdjustEditTable(){
  const box = document.getElementById('adjustEditTable');
  if(!box || !adjustEditorDraft) return;
  const rows = [];
  (adjustEditorDraft.extraCharges||[]).forEach(x=>rows.push({...x,_type:'add',_label:'إضافة'}));
  (adjustEditorDraft.extraDiscounts||[]).forEach(x=>rows.push({...x,_type:'discount',_label:'خصم'}));
  rows.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  box.innerHTML = `
    <div class="tHead"><span>التاريخ</span><span>العملية</span><span>المبلغ</span></div>
    ${rows.map(r=>`<div class="tRow" onclick="removeAdjustRow('${r._type}','${r.id}')">
      <span>${fmFormatDate(r.date||'')}</span>
      <span>${r._label}</span>
      <span class="${r._type==='discount'?'moneyNeg':'moneyPos'}">${Number(r.amount||0).toFixed(3)}</span>
    </div>`).join('') || '<div class="emptyState">لا توجد عمليات</div>'}
  `;
}

// Try to override account adjustment render if original uses known ids. This is safe visual fallback.
function renderLuxuryAdjustmentsBox(){
  const accounts = document.getElementById('accounts');
  if(!accounts) return;
  const existing = document.getElementById('luxuryAdjustBox');
  if(existing) existing.remove();
  const s = state();
  const charges = s.extraCharges || [];
  const discounts = s.extraDiscounts || [];
  if(!charges.length && !discounts.length) return;
  const rows = [];
  charges.forEach(x=>rows.push({...x,_label:'إضافة',_cls:'moneyPos'}));
  discounts.forEach(x=>rows.push({...x,_label:'خصم',_cls:'moneyNeg'}));
  rows.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const div=document.createElement('div');
  div.id='luxuryAdjustBox';
  div.className='card luxuryAdjustBox';
  div.innerHTML = `<div class="sectionTitleLine"><b>الخصم / الإضافة</b><button type="button" onclick="openAdjustEditor()">تعديل</button></div>
    <div class="compactTable">
      <div class="tHead"><span>التاريخ</span><span>العملية</span><span>المبلغ</span></div>
      ${rows.map(r=>`<div class="tRow"><span>${fmFormatDate(r.date||'')}</span><span>${r._label}</span><span class="${r._cls}">${Number(r.amount||0).toFixed(3)}</span></div>`).join('')}
    </div>`;
  accounts.appendChild(div);
}

setInterval(()=>{try{applyLuxuryV2DomFixes(); renderLuxuryAdjustmentsBox();}catch(e){}}, 800);
document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{showTab(window.currentTabId||'newMatch'); applyLuxuryV2DomFixes();},300));
