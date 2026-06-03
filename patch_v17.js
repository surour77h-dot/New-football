
/* === v17 CLEAN REAL APPLY: accounts/deposits/player-report same money rules === */
(function(){
  const EPS=0.0005;
  function val(n){ return Number(n||0); }
  function isZero(n){ return Math.abs(val(n)) < EPS; }
  function m(n){ return Math.abs(val(n)).toFixed(3); }
  function normType(d){
    const t=String((d&&(d.type||d.kind||d.operation||d.label))||'').trim().toLowerCase();
    const ar=String((d&&(d.operation||d.label||d.typeName))||'').trim();
    const raw=String((d&&d.date)||'').replace(/-/g,'/');
    if(t==='late'||ar.includes('تأخير')) return 'late';
    if(t==='out'||t==='debt'||t==='discount'||ar.includes('مديونية')||ar.includes('خصم')) return (t==='discount'||ar.includes('خصم'))?'discount':'debt';
    if(t==='initial'||ar.includes('مبدئي')||raw==='2026/01/01'||raw==='1/1/2026') return 'initial';
    return 'deposit';
  }
  function cls(k){ return k==='late'?'moneyLate':((k==='debt'||k==='discount')?'moneyNeg':'moneyPos'); }
  function lbl(k){ return k==='late'?'تأخير':(k==='discount'?'خصم':(k==='debt'?'مديونية':(k==='initial'?'إيداع.م':'إيداع'))); }
  function amt(n,k){ if(isZero(n)) return ''; const s=m(n); return (k==='late'||k==='debt'||k==='discount'||val(n)<0)?s+'-':s; }
  function signed(n){ if(isZero(n)) return ''; const s=m(n); return val(n)<0?s+'-':s; }
  function balCls(n){ return val(n)<0?'moneyNeg':'moneyPos'; }

  window.depositTypeLabel=function(d){ return lbl(normType(d)); };
  window.fmAmount=function(n){ return signed(n); };
  window.amountClass=function(n){ return balCls(n); };

  window.renderDeposits = function(s){
    const rows=[...((s&&s.deposits)||[])].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(d=>{
      const k=normType(d), c=cls(k), a=amt(d.amount,k), text=a?`${lbl(k)} ${a}`:lbl(k);
      return `<div class="tRow" onclick="openDepositEditor('${escAttr(d.id||'')}')"><span>${escapeHtml(d.player||'')}</span><span>${fmDate(d.date)}</span><span class="${c}" data-money-kind="${k}">${text}</span></div>`;
    }).join('');
    depositsList.innerHTML=`<div class="compactTable depositsMoneyTable v17MoneyTable"><div class="tHead"><span>اللاعب</span><span>التاريخ</span><span class="amountHead">المبلغ</span></div>${rows||'<p class="muted">لا توجد عمليات</p>'}</div>`;
    v17PostFormat();
  };

  window.renderPlayerReport = function(){
    const s=state(), p=playerFilterSelect.value; if(!p){playerFilterContent.innerHTML='';return;}
    const b=balances(s)[p]||{}, deps=(s.deposits||[]).filter(d=>d.player===p), games=(s.matches||[]).filter(m=>(m.players||[]).includes(p));
    const playPlusDebt=(b.playTotal||0)+(b.debtDeposits||0);
    const gameRows=games.map(g=>`<div class="tRow"><span>${fmDate(g.date)}</span><span>${escapeHtml(g.place||'')}</span><span class="moneyNeg" data-money-kind="debt">${amt(g.price||0,'debt')}</span></div>`).join('');
    const depRows=deps.map(d=>{const k=normType(d), c=cls(k);return `<div class="tRow"><span>${fmDate(d.date)}</span><span class="${c}" data-money-kind="${k}">${lbl(k)}</span><span class="${c}" data-money-kind="${k}">${amt(d.amount,k)}</span></div>`}).join('');
    playerFilterContent.innerHTML=`<div class="reportStats"><div class="statBox depositStat"><span>الإيداعات</span><b class="moneyPos" data-money-kind="deposit">${amt(b.deposits,'deposit')}</b></div><div class="statBox gamesStat"><span>اللعب</span><b>${b.games||''}</b></div><div class="statBox playTotalStat"><span>إجمالي اللعب + المديونية</span><b class="moneyNeg" data-money-kind="debt">${amt(playPlusDebt,'debt')}</b></div><div class="statBox lateStat"><span>التأخير</span><b class="moneyLate" data-money-kind="late">${amt(b.late,'late')}</b></div><div class="statBox balanceStat"><span>الرصيد</span><b class="${balCls(b.balance)}">${signed(b.balance)}</b></div></div><div class="card"><h3>أيام اللعب</h3><div class="compactTable reportTable v17MoneyTable"><div class="tHead"><span>التاريخ</span><span>المكان</span><span class="amountHead">المبلغ</span></div>${gameRows||'<p class="muted">لا يوجد</p>'}</div></div><div class="card"><h3>الإيداعات والمديونيات</h3><div class="compactTable reportTable v17MoneyTable"><div class="tHead"><span>التاريخ</span><span>العملية</span><span class="amountHead">المبلغ</span></div>${depRows||'<p class="muted">لا يوجد</p>'}</div></div>`;
    v17PostFormat();
  };

  window.renderAccounts = function(s){
    const b=balances(s), neg=(s.players||[]).filter(p=>(b[p]?.balance||0)<0), late=(s.deposits||[]).filter(d=>normType(d)==='late');
    const extra=(s.extraCharges||[]).reduce((a,x)=>a+val(x.amount),0), discount=(s.extraDiscounts||[]).reduce((a,x)=>a+val(x.amount),0);
    const lateTotal=late.reduce((a,d)=>a+Math.abs(val(d.amount)),0), debt=neg.reduce((a,p)=>a+Math.abs(b[p].balance),0)+discount, final=extra+lateTotal-debt;
    const debtRows=neg.map(p=>`<div class="tRow" onclick="openPlayerReport('${escAttr(p)}')"><span>${escapeHtml(p)}</span><span>${fmDate(b[p].last)}</span><span class="moneyNeg" data-money-kind="debt">${amt(Math.abs(b[p].balance),'debt')}</span></div>`).join('');
    const lateRows=late.map(d=>`<div class="tRow" onclick="openPlayerReport('${escAttr(d.player)}')"><span>${escapeHtml(d.player)}</span><span>${fmDate(d.date)}</span><span class="moneyLate" data-money-kind="late">${amt(d.amount,'late')}</span></div>`).join('');
    accountsContent.innerHTML=`<div class="accountMiniCards"><div><span>المديونية</span><b class="moneyNeg" data-money-kind="debt">${amt(debt,'debt')}</b></div><div><span>التأخير</span><b class="moneyLate" data-money-kind="late">${amt(lateTotal,'late')}</b></div><div><span>الإضافي</span><b class="moneyPos" data-money-kind="deposit">${amt(extra,'deposit')}</b></div><div><span>الإجمالي</span><b class="${balCls(final)}">${signed(final)}</b></div></div><div class="card"><h3>اللاعبين المدانين والمتأخرين</h3><div class="compactTable accountsMoneyTable v17MoneyTable"><div class="tHead"><span>الاسم</span><span>التاريخ</span><span class="amountHead">المبلغ</span></div>${debtRows}${lateRows}${(!debtRows&&!lateRows)?'<p class="muted">لا يوجد</p>':''}</div></div><div class="card"><div class="sectionTitleLine"><b>سجل الخصم / الإضافة</b><button onclick="openAdjustEditor()">تعديل</button></div>${renderAdjustRows(s)}</div><div class="card"><div class="sectionTitleLine"><b>خصم / إضافة</b></div><div class="grid2 accountsExtraGrid"><label>النوع<select id="extraType"><option value="extra">إضافة</option><option value="discount">خصم</option></select></label><label>التاريخ<button id="extraDateBtn" class="fakeDateInput" type="button" onclick="openDatePicker('extraDate')">${fmDate(today())}</button><input id="extraDate" type="hidden" value="${today()}"></label><label>المبلغ<input id="extraAmount" type="number" step="0.001"></label><label>الملاحظة<input id="extraNote"></label></div><button class="primary wide saveBtn" onclick="saveExtraUnified()">حفظ</button></div>`;
    if(typeof updateDateButtons==='function') updateDateButtons();
    v17PostFormat();
  };

  window.renderAdjustRows = function(s){
    let rows=[...((s.extraCharges||[]).map(x=>({...x,t:'إضافة',kind:'deposit'}))),...((s.extraDiscounts||[]).map(x=>({...x,t:'خصم',kind:'discount'})))].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    return `<div class="compactTable accountsMoneyTable v17MoneyTable"><div class="tHead"><span>التاريخ</span><span>العملية</span><span class="amountHead">المبلغ</span></div>${rows.map(r=>{const c=cls(r.kind);return `<div class="tRow"><span>${fmDate(r.date)}</span><span class="${c}" data-money-kind="${r.kind}">${r.t}</span><span class="${c}" data-money-kind="${r.kind}">${amt(r.amount,r.kind)}</span></div>`}).join('')||'<p class="muted">لا يوجد</p>'}</div>`;
  };

  window.v17PostFormat=function(){
    document.querySelectorAll('.accountMiniCards b,.reportStats b,.v17MoneyTable .tRow span,.depositsMoneyTable .tRow span,.accountsMoneyTable .tRow span,.reportTable .tRow span').forEach(el=>{
      let t=(el.textContent||'');
      t=t.replace(/\+/g,'').replace(/(^|\s)-(\d+\.\d{3})(?=\s|$)/g,'$1$2-');
      if(/^\s*-?0\.000-?\s*$/.test(t)) t='';
      el.textContent=t;
    });
  };

  const previousRenderAll=window.renderAll;
  if(typeof previousRenderAll==='function'){
    window.renderAll=function(){ const r=previousRenderAll.apply(this,arguments); v17PostFormat(); setTimeout(v17PostFormat,50); return r; };
  }
  setTimeout(()=>{try{renderAll(); v17PostFormat();}catch(e){}},120);
})();
