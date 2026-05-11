const FREE_START='2026-05-01';let tempGuests=[];let selectedCalendarDate='';let depositType='in';let tempTeamMap={};let calendarView=new Date();
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function state(){const r=JSON.parse(localStorage.getItem('qatiyaState')||'{"players":[],"matches":[],"deposits":[],"teams":{},"settings":{}}');r.players=r.players||[];r.matches=r.matches||[];r.deposits=r.deposits||[];r.teams=r.teams||{};r.settings=r.settings||{};r.matches.forEach(m=>{if(!m.id)m.id=uid()});r.deposits.forEach(d=>{if(!d.id)d.id=uid()});r.players.sort((a,b)=>a.localeCompare(b,'ar'));return r}
function save(s){s.players.sort((a,b)=>a.localeCompare(b,'ar'));localStorage.setItem('qatiyaState',JSON.stringify(s));renderAll()}
function saveNoRender(s){localStorage.setItem('qatiyaState',JSON.stringify(s))}
function today(){return new Date().toISOString().slice(0,10)}function money(n){return Number(n||0).toFixed(3)}

function moneyBlank(n){n=Number(n||0);return n===0?'':money(n)}
const defaultPages=[
 ['newMatch','لعبة'],['players','اللاعبين'],['deposits','الإيداعات'],['calendar','التقويم'],
 ['matchLog','السجل'],['teams','الفريقين'],['playerTable','الجدول'],['reports','التقارير'],
 ['backup','النسخ'],['playerFilter','كشف لاعب'],['settings','الترتيب']
];
function getPageOrder(){
 const s=state();
 const saved=s.settings.pageOrder;
 const ids=defaultPages.map(x=>x[0]);
 if(Array.isArray(saved)){
   const clean=saved.filter(x=>ids.includes(x));
   ids.forEach(id=>{if(!clean.includes(id))clean.push(id)});
   return clean;
 }
 return ids;
}
function savePageOrder(order){
 const s=state();
 s.settings.pageOrder=order;
 saveNoRender(s);
 renderNav();
 renderPageOrder();
}
function renderNav(){
 const labels=Object.fromEntries(defaultPages);
 const order=getPageOrder();
 const nav=document.querySelector('nav');
 if(!nav)return;
 nav.innerHTML=order.map(id=>`<button onclick="showTab('${id}')">${labels[id]}</button>`).join('');
}

function renderPlayerFilter(){
 const wrap=document.getElementById('playerFilterContent');
 const sel=document.getElementById('playerFilterSelect');
 if(!wrap||!sel)return;
 const s=state();
 const player=sel.value;
 if(!player){wrap.innerHTML='';return;}
 const b=balances(s)[player]||{};
 const deposits=s.deposits.filter(d=>d.player===player);
 const games=s.matches.filter(m=>(m.players||[]).includes(player));
 const guestMatches=s.matches.filter(m=>(m.guests||[]).some(g=>g.owner===player));
 const totalDep=deposits.filter(d=>d.amount>0).reduce((a,b)=>a+b.amount,0);
 const totalDebt=Math.abs(deposits.filter(d=>d.amount<0).reduce((a,b)=>a+b.amount,0));
 wrap.innerHTML=`
 <div class="summaryCards">
   <div class="summaryCard"><span>الرصيد</span><b class="${(b.balance||0)<0?'negText':(b.balance||0)>0?'posText':''}">${moneyBlank(b.balance)}</b></div>
   <div class="summaryCard"><span>عدد اللعب</span><b>${b.games||''}</b></div>
   <div class="summaryCard"><span>الإيداعات</span><b class="posText">${moneyBlank(totalDep)}</b></div>
   <div class="summaryCard"><span>الخصومات</span><b class="negText">${moneyBlank(totalDebt)}</b></div>
 </div>
 <div class="card">
   <h3>أيام اللعب</h3>
   ${(games.length?games.map(g=>`<div class="item"><span>${g.date}</span><span class="count">${money(g.price)}</span></div>`).join(''):'<p class="muted">لا يوجد</p>')}
 </div>
 <div class="card">
   <h3>الإيداعات والمديونيات</h3>
   ${(deposits.length?deposits.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).map(d=>`<div class="item"><span>${d.date}</span><span class="${clsMoney(d.amount)}">${money(d.amount)}</span></div>`).join(''):'<p class="muted">لا يوجد</p>')}
 </div>
 <div class="card">
   <h3>الضيوف الذين أحضرهم</h3>
   ${(guestMatches.length?guestMatches.map(m=>(m.guests||[]).filter(g=>g.owner===player).map(g=>`<div class="item"><span>${g.guest}</span><span>${m.date}</span></div>`).join('')).join(''):'<p class="muted">لا يوجد</p>')}
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

function clsMoney(n){n=Number(n||0);return n<0?'neg':n>0?'pos':'count'}
function showTab(id){
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
document.getElementById(id).classList.add('active');
document.querySelectorAll('nav button').forEach(b=>b.classList.remove('activeTab'));
const btn=[...document.querySelectorAll('nav button')].find(b=>b.getAttribute('onclick')===`showTab('${id}')`);
if(btn)btn.classList.add('activeTab');
renderAll()
}
function calcPrice(){const c=Number(bookingCost.value||0),n=Number(neededPlayers.value||0);return n>0?c/n:0}
document.addEventListener('input',e=>{if(['bookingCost','neededPlayers'].includes(e.target.id))pricePerPlayer.textContent=money(calcPrice())})
function addPlayer(){const name=playerName.value.trim();if(!name)return alert('اكتب اسم اللاعب');const s=state();if(s.players.includes(name))return alert('اللاعب موجود');s.players.push(name);playerName.value='';save(s)}
function showPlayerEditBox(){const s=state();playerActionBox.innerHTML=`<div class="actionBox"><label>اختر اللاعب<select id="editOld">${s.players.map(p=>`<option>${p}</option>`).join('')}</select></label><label>الاسم الجديد<input id="editNew"></label><button class="primary wide" onclick="confirmPlayerEdit()">حفظ التعديل</button></div>`}
function confirmPlayerEdit(){const oldName=editOld.value,newName=editNew.value.trim();if(!newName)return alert('اكتب الاسم الجديد');const s=state();if(s.players.includes(newName))return alert('الاسم موجود');s.players=s.players.map(x=>x===oldName?newName:x);s.matches.forEach(m=>{m.players=(m.players||[]).map(x=>x===oldName?newName:x);(m.guests||[]).forEach(g=>{if(g.owner===oldName)g.owner=newName})});s.deposits.forEach(d=>{if(d.player===oldName)d.player=newName});Object.values(s.teams||{}).forEach(t=>Object.keys(t).forEach(k=>{if(k===oldName){t[newName]=t[k];delete t[k]}}));playerActionBox.innerHTML='';save(s)}
function showPlayerDeleteBox(){const s=state();playerActionBox.innerHTML=`<div class="actionBox"><label>اختر اللاعب<select id="deletePlayer">${s.players.map(p=>`<option>${p}</option>`).join('')}</select></label><button class="danger wide" onclick="confirmPlayerDelete()">تأكيد الحذف</button></div>`}
function confirmPlayerDelete(){const name=deletePlayer.value;if(!confirm('حذف '+name+'؟'))return;const s=state();s.players=s.players.filter(x=>x!==name);playerActionBox.innerHTML='';save(s)}
function addGuestTemp(){const guest=guestName.value.trim(),owner=guestOwner.value;if(!guest||!owner)return alert('اكتب اسم الضيف واختر العضو');tempGuests.push({guest,owner});guestName.value='';renderTempGuests()}
function removeGuestTemp(i){tempGuests.splice(i,1);renderTempGuests()}
function renderTempGuests(){tempGuests.innerHTML=tempGuests.length?`<table><thead><tr><th>ضيف</th><th>العضو</th></tr></thead><tbody>${tempGuests.map((g,i)=>`<tr><td>${g.guest}</td><td>${g.owner} <button onclick="removeGuestTemp(${i})">×</button></td></tr>`).join('')}</tbody></table>`:''}
function clearMatchForm(){editingMatchId.value='';matchFormTitle.textContent='لعبة جديدة';matchDate.value=today();place.value='';bookingCost.value='';neededPlayers.value='';tempGuests=[];document.querySelectorAll('.playerCheck').forEach(x=>x.checked=false);renderTempGuests();pricePerPlayer.textContent='0.000'}
function saveMatch(){const date=matchDate.value||today(),bc=Number(bookingCost.value||0),np=Number(neededPlayers.value||0),selected=[...document.querySelectorAll('.playerCheck:checked')].map(x=>x.value);if(bc<=0||np<=0)return alert('أدخل سعر الحجز وعدد اللاعبين');if(selected.length===0&&tempGuests.length===0)return alert('اختر المشاركين أو أضف ضيوف');const s=state(),id=editingMatchId.value||uid(),match={id,date,place:place.value.trim(),bookingCost:bc,neededPlayers:np,price:bc/np,players:selected,guests:[...tempGuests]};const idx=s.matches.findIndex(m=>m.id===id);if(idx>=0)s.matches[idx]=match;else s.matches.push(match);editingMatchId.value='';tempGuests=[];save(s);clearMatchForm();alert('تم الحفظ')}
function editMatch(id){const s=state(),m=s.matches.find(x=>x.id===id);if(!m)return;showTab('newMatch');editingMatchId.value=m.id;matchFormTitle.textContent='تعديل لعبة';matchDate.value=m.date;place.value=m.place||'';bookingCost.value=m.bookingCost||'';neededPlayers.value=m.neededPlayers||'';tempGuests=[...(m.guests||[])];renderAll();document.querySelectorAll('.playerCheck').forEach(x=>x.checked=(m.players||[]).includes(x.value));pricePerPlayer.textContent=money(calcPrice());renderTempGuests()}
function deleteMatch(id){if(!confirm('حذف اللعبة؟'))return;const s=state();s.matches=s.matches.filter(m=>m.id!==id);delete s.teams[id];save(s)}
function setDepositType(t){depositType=t;depositTypeIn.className=t==='in'?'primary':'';depositTypeOut.className=t==='out'?'danger':''}
function getDepositPresets(s){const saved=(s.settings.depositPresets||[]).map(Number).filter(x=>x>0),from=s.deposits.map(d=>Math.abs(Number(d.amount||0))).filter(x=>x>0),del=(s.settings.deletedDepositPresets||[]).map(Number);return[...new Set([...saved,...from])].filter(x=>!del.includes(Number(x))).sort((a,b)=>a-b)}
function setDepositAmount(v){depositAmount.value=money(v)}
function deleteDepositPreset(v){const s=state();v=Number(v);s.settings.deletedDepositPresets=[...new Set([...(s.settings.deletedDepositPresets||[]).map(Number),v])];s.settings.depositPresets=(s.settings.depositPresets||[]).map(Number).filter(x=>x!==v);save(s)}
function addDepositPresetAmount(s,a){a=Math.abs(Number(a||0));if(a<=0)return;s.settings.deletedDepositPresets=(s.settings.deletedDepositPresets||[]).map(Number).filter(x=>x!==a);const p=(s.settings.depositPresets||[]).map(Number);if(!p.includes(a))p.push(a);s.settings.depositPresets=p.sort((x,y)=>x-y)}
function clearDepositForm(){editingDepositId.value='';depositAmount.value='';const s=state();depositDate.value=s.settings.lastDepositDate||today();setDepositType('in')}
function saveDeposit(){
const player=depositPlayer.value;
let raw=String(depositAmount.value||'').trim();
let amount=Number(raw);
const date=depositDate.value||today();
if(!player||isNaN(amount)||amount===0)return alert('اختر اللاعب واكتب مبلغ صحيح');
if(depositType==='out' && amount>0) amount=-amount;
if(depositType==='in' && amount<0) amount=Math.abs(amount);
const s=state(),id=editingDepositId.value||uid(),dep={id,player,amount,date,createdAt:Date.now()};
const idx=s.deposits.findIndex(d=>d.id===id);
if(idx>=0){ dep.createdAt=s.deposits[idx].createdAt||Date.now(); s.deposits[idx]=dep; }
else s.deposits.push(dep);
s.settings.lastDepositDate=date;
addDepositPresetAmount(s,Math.abs(amount));
editingDepositId.value='';
depositAmount.value='';
save(s)
}
function editDeposit(id){const s=state(),d=s.deposits.find(x=>x.id===id);if(!d)return;showTab('deposits');editingDepositId.value=d.id;depositPlayer.value=d.player;depositAmount.value=money(Math.abs(d.amount));depositDate.value=d.date;setDepositType(d.amount<0?'out':'in')}
function deleteDeposit(id){if(!confirm('حذف الإيداع؟'))return;const s=state();s.deposits=s.deposits.filter(d=>d.id!==id);save(s)}
function depositOptions(id){
const s=state();
const d=s.deposits.find(x=>x.id===id);
if(!d)return;
const msg=`عملية الإيداع / المديونية

اللاعب: ${d.player}
التاريخ: ${d.date}
المبلغ: ${money(d.amount)}

اضغط موافق للتعديل.
اضغط إلغاء للانتقال لخيار الحذف.`;
const act=confirm(msg);
if(act){editDeposit(id)}
else{
 if(confirm(`هل تريد حذف هذه العملية؟

${d.player}
${d.date}
${money(d.amount)}`)) deleteDeposit(id);
}
}
function balances(s){const r={};s.players.forEach(p=>r[p]={balance:0,games:0,free:0,streak:0,guestFreeCredits:0,last:'',deposits:0});s.deposits.forEach(d=>{if(r[d.player]){r[d.player].balance+=Number(d.amount||0);if(Number(d.amount)>0)r[d.player].deposits+=Number(d.amount)}});const ms=[...s.matches].sort((a,b)=>a.date.localeCompare(b.date));ms.forEach((m,idx)=>{const present=new Set(m.players||[]);Object.keys(r).forEach(name=>{if(present.has(name)){let free=false;if(m.date>=FREE_START&&r[name].streak>=5){free=true;r[name].streak=0;r[name].free++}if(!free&&r[name].guestFreeCredits>0){free=true;r[name].guestFreeCredits--;r[name].free++}r[name].games++;r[name].last=m.date;if(!free)r[name].balance-=Number(m.price||0);r[name].streak++}else r[name].streak=0});(m.guests||[]).forEach(g=>{if(r[g.owner])r[g.owner].balance-=Number(m.price||0);const count=ms.slice(0,idx+1).reduce((n,mm)=>n+(mm.guests||[]).filter(x=>x.guest===g.guest&&x.owner===g.owner).length,0);if(count>0&&count%3===0&&r[g.owner])r[g.owner].guestFreeCredits++})});return r}
function participants(m){return[...(m.players||[]),...(m.guests||[]).map(g=>g.guest+' (ضيف '+g.owner+')')]}
function moveMonth(n){calendarView.setMonth(calendarView.getMonth()+n);renderCalendar()}
function renderCalendar(){const s=state(),y=calendarView.getFullYear(),mo=calendarView.getMonth(),first=new Date(y,mo,1),last=new Date(y,mo+1,0);calendarMonthTitle.textContent=calendarView.toLocaleDateString('ar-KW',{month:'long',year:'numeric'});let html=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'].map(d=>`<div class="day"><b>${d}</b></div>`).join('');for(let i=0;i<first.getDay();i++)html+='<div></div>';for(let d=1;d<=last.getDate();d++){const mm=String(mo+1).padStart(2,'0'),dd=String(d).padStart(2,'0'),date=`${y}-${mm}-${dd}`,has=s.matches.some(x=>x.date===date);html+=`<div class="day ${has?'hasGame':''} ${selectedCalendarDate===date?'selected':''}" onclick="selectCalendarDate('${date}')"><b>${d}</b>${has?'<br><span class="small">لعب</span>':''}</div>`}monthCalendar.innerHTML=html}
function selectCalendarDate(date){selectedCalendarDate=date;renderCalendar();renderCalendarList()}
function teamHtml(s,m){const map=s.teams[m.id]||{},names=participants(m),a=names.filter(n=>map[n]==='A'),b=names.filter(n=>map[n]==='B'),no=names.filter(n=>!map[n]);if(a.length||b.length)return`<div class="calendarTeams"><div class="calendarTeam teamABox"><h4>الفريق الأول</h4>${a.map(x=>`<div class="teamName">${x}</div>`).join('')||'<p class="muted">لا يوجد</p>'}</div><div class="calendarTeam teamBBox"><h4>الفريق الثاني</h4>${b.map(x=>`<div class="teamName">${x}</div>`).join('')||'<p class="muted">لا يوجد</p>'}</div></div>`+(no.length?`<p class="muted">بدون فريق: ${no.join('، ')}</p>`:'');return names.map(n=>`<div class="item"><b>${n}</b></div>`).join('')}
function renderCalendarList(){const s=state(),date=selectedCalendarDate;calendarSelectedTitle.textContent=date?'المشاركون '+date:'المشاركون';if(!date){calendarList.innerHTML='<p class="muted">اضغط على يوم من التقويم.</p>';return}const ms=s.matches.filter(m=>m.date===date);calendarList.innerHTML=ms.length?ms.map(m=>`<h3>${m.date}${m.place?' - '+m.place:''}</h3>${teamHtml(s,m)}<button onclick="editMatch('${m.id}')">تعديل اللعبة</button>`).join(''):'<p class="muted">لا توجد لعبة بهذا التاريخ.</p>'}
function renderMatchLog(s){matchLogList.innerHTML=[...s.matches].sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<div class="card"><b>${m.date}${m.place?' - '+m.place:''}</b><p>السعر: <span class="count">${money(m.price)}</span> | المشاركين: <span class="count">${(m.players||[]).length+(m.guests||[]).length}</span></p>${teamHtml(s,m)}<div class="actions"><button onclick="editMatch('${m.id}')">تعديل</button><button class="danger" onclick="deleteMatch('${m.id}')">حذف</button></div></div>`).join('')||'<p class="muted">لا توجد ألعاب محفوظة.</p>'}
function renderTeams(){const s=state(),id=teamsMatchSelect.value,m=s.matches.find(x=>x.id===id);if(!m){teamsPlayers.innerHTML='';teamsPreview.innerHTML='';return}if(Object.keys(tempTeamMap).length===0)if(!tempTeamMap.__matchId || tempTeamMap.__matchId!==id){tempTeamMap={...(s.teams[id]||{}),__matchId:id};}const names=participants(m);teamsPlayers.innerHTML=names.map(n=>`<div class="teamPick"><b>${n}</b><button class="${tempTeamMap[n]==='A'?'selA':''}" onclick="pickTeam('${n.replace(/'/g,"\\'")}','A')">الأول</button><button class="${tempTeamMap[n]==='B'?'selB':''}" onclick="pickTeam('${n.replace(/'/g,"\\'")}','B')">الثاني</button></div>`).join('');renderTeamsPreview()}
function pickTeam(n,t){tempTeamMap[n]=t;renderTeamsPreview();renderTeams()}
function randomTeams(){const s=state(),id=teamsMatchSelect.value,m=s.matches.find(x=>x.id===id);if(!m)return;const arr=participants(m).sort(()=>Math.random()-.5);tempTeamMap={__matchId:id};arr.forEach((n,i)=>tempTeamMap[n]=i%2?'B':'A');renderTeamsPreview();renderTeams()}
function saveTeams(){const s=state(),id=teamsMatchSelect.value;if(!id)return;const clean={...tempTeamMap};delete clean.__matchId;s.teams[id]=clean;save(s);alert('تم حفظ الفريقين')}
function renderTeamsPreview(){const a=Object.keys(tempTeamMap).filter(k=>k!=='__matchId'&&tempTeamMap[k]==='A'),b=Object.keys(tempTeamMap).filter(k=>k!=='__matchId'&&tempTeamMap[k]==='B');teamsPreview.innerHTML=`<div class="teamBox teamABox"><h3>الأول</h3>${a.map(x=>`<div class="teamName">${x}</div>`).join('')||'<p class="muted">لا يوجد</p>'}</div><div class="teamBox teamBBox"><h3>الثاني</h3>${b.map(x=>`<div class="teamName">${x}</div>`).join('')||'<p class="muted">لا يوجد</p>'}</div>`}
function renderTables(s,b){playerTableWrap.innerHTML=`<div class="tableWrap"><table><thead><tr><th>م</th><th>الاسم</th><th>الرصيد</th><th>لعب</th><th>آخر لعب</th></tr></thead><tbody>${s.players.map((p,i)=>`<tr><td>${i+1}</td><td>${p}</td><td class="${clsMoney(b[p]?.balance)}">${moneyBlank(b[p]?.balance)}</td><td>${b[p]?.games||''}</td><td>${b[p]?.last||''}</td></tr>`).join('')}</tbody></table></div>`;const debt=s.players.filter(p=>(b[p]?.balance||0)<0).length,total=s.players.reduce((sum,p)=>sum+(b[p]?.balance||0),0);reportSummary.innerHTML=`<div class="summaryCards">
<div class="summaryCard"><span>اللاعبين</span><b>${s.players.length}</b></div>
<div class="summaryCard"><span>الألعاب</span><b>${s.matches.length}</b></div>
<div class="summaryCard"><span>مديونيات</span><b class="${debt?'negText':''}">${debt||''}</b></div>
<div class="summaryCard"><span>إجمالي الأرصدة</span><b class="${total<0?'negText':total>0?'posText':''}">${moneyBlank(total)}</b></div>
</div>`;reportsList.innerHTML=`<div class="tableWrap"><table><thead><tr><th>الاسم</th><th>الرصيد</th><th>لعب</th><th>آخر لعبة</th><th>الإيداعات</th></tr></thead><tbody>${s.players.map(p=>{const r=b[p]||{};return`<tr><td>${p}</td><td class="${clsMoney(r.balance)}">${moneyBlank(r.balance)}</td><td>${r.games||''}</td><td>${r.last||''}</td><td class="pos">${moneyBlank(r.deposits)}</td></tr>`}).join('')}</tbody></table></div>`}
function renderAll(){renderNav();renderPageOrder();const s=state();saveNoRender(s);matchDate.value ||= today();if(!depositDate.value)depositDate.value=s.settings.lastDepositDate||today();pricePerPlayer.textContent=money(calcPrice());const b=balances(s);playersList.innerHTML=s.players.map(p=>`<div class="nameOnly">${p}</div>`).join('')||'<p class="muted">أضف اللاعبين أولًا.</p>';const opts=s.players.map(p=>`<option>${p}</option>`).join('');guestOwner.innerHTML=opts;depositPlayer.innerHTML=opts;const pf=document.getElementById('playerFilterSelect');if(pf){pf.innerHTML='<option value="">اختر لاعب</option>'+opts; if(!pf.value&&s.players[0])pf.value=s.players[0]; renderPlayerFilter();}matchPlayers.innerHTML=s.players.map(p=>`<label><input class="playerCheck" type="checkbox" value="${p}"> <span>${p}</span></label>`).join('');depositQuickButtons.innerHTML=getDepositPresets(s).map(v=>`<span class="quick"><button class="x" type="button" onclick="event.stopPropagation();deleteDepositPreset('${v}')">×</button><span onclick="setDepositAmount('${v}')">${money(v)}</span></span>`).join('')||'<span class="muted">احفظ أول مبلغ ليظهر كزر سريع.</span>';depositsList.innerHTML=[...s.deposits].map((d,i)=>({...d,_i:i})).sort((a,b)=>(b.createdAt||b._i)-(a.createdAt||a._i)).slice(0,50).map(d=>`<div class="item depositRow" onclick="depositOptions('${d.id}')"><span>${d.date} - ${d.player}</span><span class="${clsMoney(d.amount)}">${money(d.amount)}</span></div>`).join('');teamsMatchSelect.innerHTML=s.matches.sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<option value="${m.id}">${m.date}${m.place?' - '+m.place:''}</option>`).join('');renderTempGuests();renderCalendar();renderCalendarList();renderMatchLog(s);renderTeams();renderTables(s,b)}
function exportData(){const blob=new Blob([JSON.stringify(state(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='qatiya-backup.json';a.click()}
function importData(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{localStorage.setItem('qatiyaState',r.result);renderAll();alert('تم الاستيراد')};r.readAsText(f)}
if('serviceWorker'in navigator){navigator.serviceWorker.register('sw.js')}setDepositType('in');renderAll();
setTimeout(()=>{const first=document.querySelector("nav button");if(first)first.classList.add('activeTab')},100);