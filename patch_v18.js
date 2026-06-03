/* === v18 DIRECT REAL APPLY: reassign actual render functions, no screenshots === */
(function(){
  const EPS = 0.0005;
  function val(n){ return Number(n||0); }
  function isZero(n){ return Math.abs(val(n)) < EPS; }
  function num(n){ return Math.abs(val(n)).toFixed(3); }
  function kindOf(d){
    const t = String((d && (d.type||d.kind||d.operation||d.label)) || '').trim().toLowerCase();
    const ar = String((d && (d.operation||d.label||d.typeName)) || '').trim();
    const raw = String((d && d.date) || '').replace(/-/g,'/');
    if(t==='late' || ar.includes('تأخير')) return 'late';
    if(t==='out' || t==='debt' || ar.includes('مديونية')) return 'debt';
    if(t==='discount' || ar.includes('خصم')) return 'discount';
    if(t==='initial' || ar.includes('مبدئي') || raw==='2026/01/01' || raw==='1/1/2026') return 'initial';
    return 'deposit';
  }
  function label(k){
    if(k==='late') return 'تأخير';
    if(k==='debt') return 'مديونية';
    if(k==='discount') return 'خصم';
    if(k==='initial') return 'إيداع.م';
    return 'إيداع';
  }
  function cls(k){ return k==='late' ? 'moneyLate' : ((k==='debt'||k==='discount') ? 'moneyNeg' : 'moneyPos'); }
  function amount(n,k){
    if(isZero(n)) return '';
    const s = num(n);
    return (k==='late'||k==='debt'||k==='discount'||val(n)<0) ? (s+'-') : s;
  }
  function balanceAmount(n){
    if(isZero(n)) return '';
    return val(n)<0 ? (num(n)+'-') : num(n);
  }
  function balanceClass(n){ return val(n)<0 ? 'moneyNeg' : 'moneyPos'; }
  function cleanMoneyText(){
    document.querySelectorAll('.accountMiniCards b,.reportStats b,.depositsMoneyTable .tRow span,.accountsMoneyTable .tRow span,.reportTable .tRow span').forEach(el=>{
      let t = (el.textContent||'').trim();
      t = t.replace(/\+/g,'');
      t = t.replace(/(^|\s)-(\d+\.\d{3})(?=\s|$)/g,'$1$2-');
      if(/^0\.000-?$/.test(t) || /^-0\.000$/.test(t)) t='';
      el.textContent = t;
    });
  }

  try { depositTypeLabel = function(d){ return label(kindOf(d)); }; } catch(e) {}
  try { fmAmount = function(n){ return balanceAmount(n); }; } catch(e) {}
  try { amountClass = function(n){ return balanceClass(n); }; } catch(e) {}

  try { renderDeposits = function(s){
    const rows=[...((s&&s.deposits)||[])].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(d=>{
      const k=kindOf(d), c=cls(k), a=amount(d.amount,k);
      const text = a ? `${label(k)} ${a}` : label(k);
      return `<div class="tRow" onclick="openDepositEditor('${escAttr(d.id||'')}')"><span>${escapeHtml(d.player||'')}</span><span>${fmDate(d.date)}</span><span class="${c}" data-money-kind="${k}">${text}</span></div>`;
    }).join('');
    depositsList.innerHTML=`<div class="compactTable depositsMoneyTable"><div class="tHead"><span>اللاعب</span><span>التاريخ</span><span class="amountHead">المبلغ</span></div>${rows||'<p class="muted">لا توجد عمليات</p>'}</div>`;
    cleanMoneyText();
  }; } catch(e) {}

  try { renderAdjustRows = function(s){
    let rows=[...((s.extraCharges||[]).map(x=>({...x,t:'إضافة',kind:'deposit'}))),...((s.extraDiscounts||[]).map(x=>({...x,t:'خصم',kind:'discount'})))].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    return `<div class="compactTable accountsMoneyTable"><div class="tHead"><span>التاريخ</span><span>العملية</span><span class="amountHead">المبلغ</span></div>${rows.map(r=>{const c=cls(r.kind);return `<div class="tRow"><span>${fmDate(r.date)}</span><span class="${c}" data-money-kind="${r.kind}">${r.t}</span><span class="${c}" data-money-kind="${r.kind}">${amount(r.amount,r.kind)}</span></div>`}).join('')||'<p class="muted">لا يوجد</p>'}</div>`;
  }; } catch(e) {}

  try { renderPlayerReport = function(){
    const s=state(), p=playerFilterSelect.value;
    if(!p){ playerFilterContent.innerHTML=''; return; }
    const b=balances(s)[p]||{}, deps=(s.deposits||[]).filter(d=>d.player===p), games=(s.matches||[]).filter(m=>(m.players||[]).includes(p));
    const playPlusDebt=(b.playTotal||0)+(b.debtDeposits||0);
    const gameRows=games.map(g=>`<div class="tRow"><span>${fmDate(g.date)}</span><span>${escapeHtml(g.place||'')}</span><span class="moneyNeg" data-money-kind="debt">${amount(g.price||0,'debt')}</span></div>`).join('');
    const depRows=deps.map(d=>{const k=kindOf(d), c=cls(k); return `<div class="tRow"><span>${fmDate(d.date)}</span><span class="${c}" data-money-kind="${k}">${label(k)}</span><span class="${c}" data-money-kind="${k}">${amount(d.amount,k)}</span></div>`;}).join('');
    playerFilterContent.innerHTML=`<div class="reportStats"><div class="statBox depositStat"><span>الإيداعات</span><b class="moneyPos">${amount(b.deposits,'deposit')}</b></div><div class="statBox gamesStat"><span>اللعب</span><b>${b.games||''}</b></div><div class="statBox playTotalStat"><span>إجمالي اللعب + المديونية</span><b class="moneyNeg">${amount(playPlusDebt,'debt')}</b></div><div class="statBox lateStat"><span>التأخير</span><b class="moneyLate">${amount(b.late,'late')}</b></div><div class="statBox balanceStat"><span>الرصيد</span><b class="${balanceClass(b.balance)}">${balanceAmount(b.balance)}</b></div></div><div class="card"><h3>أيام اللعب</h3><div class="compactTable reportTable"><div class="tHead"><span>التاريخ</span><span>المكان</span><span class="amountHead">المبلغ</span></div>${gameRows||'<p class="muted">لا يوجد</p>'}</div></div><div class="card"><h3>الإيداعات والمديونيات</h3><div class="compactTable reportTable"><div class="tHead"><span>التاريخ</span><span>العملية</span><span class="amountHead">المبلغ</span></div>${depRows||'<p class="muted">لا يوجد</p>'}</div></div>`;
    cleanMoneyText();
  }; } catch(e) {}

  try { renderAccounts = function(s){
    const b=balances(s), neg=(s.players||[]).filter(p=>(b[p]?.balance||0)<0), late=(s.deposits||[]).filter(d=>kindOf(d)==='late');
    const extra=(s.extraCharges||[]).reduce((a,x)=>a+val(x.amount),0), discount=(s.extraDiscounts||[]).reduce((a,x)=>a+val(x.amount),0);
    const lateTotal=late.reduce((a,d)=>a+Math.abs(val(d.amount)),0), debt=neg.reduce((a,p)=>a+Math.abs(b[p].balance),0)+discount, final=extra+lateTotal-debt;
    const debtRows=neg.map(p=>`<div class="tRow" onclick="openPlayerReport('${escAttr(p)}')"><span>${escapeHtml(p)}</span><span>${fmDate(b[p].last)}</span><span class="moneyNeg" data-money-kind="debt">${amount(Math.abs(b[p].balance),'debt')}</span></div>`).join('');
    const lateRows=late.map(d=>`<div class="tRow" onclick="openPlayerReport('${escAttr(d.player)}')"><span>${escapeHtml(d.player)}</span><span>${fmDate(d.date)}</span><span class="moneyLate" data-money-kind="late">${amount(d.amount,'late')}</span></div>`).join('');
    accountsContent.innerHTML=`<div class="accountMiniCards"><div><span>المديونية</span><b class="moneyNeg">${amount(debt,'debt')}</b></div><div><span>التأخير</span><b class="moneyLate">${amount(lateTotal,'late')}</b></div><div><span>الإضافي</span><b class="moneyPos">${amount(extra,'deposit')}</b></div><div><span>الإجمالي</span><b class="${balanceClass(final)}">${balanceAmount(final)}</b></div></div><div class="card"><h3>اللاعبين المدانين والمتأخرين</h3><div class="compactTable accountsMoneyTable"><div class="tHead"><span>الاسم</span><span>التاريخ</span><span class="amountHead">المبلغ</span></div>${debtRows}${lateRows}${(!debtRows&&!lateRows)?'<p class="muted">لا يوجد</p>':''}</div></div><div class="card"><div class="sectionTitleLine"><b>سجل الخصم / الإضافة</b><button onclick="openAdjustEditor()">تعديل</button></div>${renderAdjustRows(s)}</div><div class="card"><div class="sectionTitleLine"><b>خصم / إضافة</b></div><div class="grid2 accountsExtraGrid"><label>النوع<select id="extraType"><option value="extra">إضافة</option><option value="discount">خصم</option></select></label><label>التاريخ<button id="extraDateBtn" class="fakeDateInput" type="button" onclick="openDatePicker('extraDate')">${fmDate(today())}</button><input id="extraDate" type="hidden" value="${today()}"></label><label>المبلغ<input id="extraAmount" type="number" step="0.001"></label><label>الملاحظة<input id="extraNote"></label></div><button class="primary wide saveBtn" onclick="saveExtraUnified()">حفظ</button></div>`;
    if(typeof updateDateButtons==='function') updateDateButtons();
    cleanMoneyText();
  }; } catch(e) {}

  const oldRenderAll = renderAll;
  renderAll = function(){ const r = oldRenderAll.apply(this, arguments); cleanMoneyText(); setTimeout(cleanMoneyText,50); return r; };
  setTimeout(()=>{ try{ renderAll(); cleanMoneyText(); }catch(e){} }, 80);
})();
