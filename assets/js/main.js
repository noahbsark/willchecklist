(function(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e){
      const action = form.getAttribute('action') || '';
      if(action.includes('PLACEHOLDER')){
        e.preventDefault();
        const status = form.querySelector('.form-status') || document.createElement('p');
        status.className = 'form-status';
        status.textContent = 'This form is ready for your email or lead provider endpoint. Replace the placeholder action before launch.';
        if(!form.querySelector('.form-status')) form.appendChild(status);
      }
    });
  });
  document.querySelectorAll('[data-print]').forEach(btn => btn.addEventListener('click', () => window.print()));
})();


(function(){
  const app = document.querySelector('[data-checklist-app]');
  if(!app) return;
  const storageKey = 'willchecklist.interactive.v1';
  const items = Array.from(app.querySelectorAll('[data-check-item]'));
  const notes = app.querySelector('[data-planning-notes]');
  const pctEl = app.querySelector('[data-progress-percent]');
  const countEl = app.querySelector('[data-progress-count]');
  const barEl = app.querySelector('[data-progress-bar]');
  function load(){
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch(e){ return {}; }
  }
  function save(){
    const data = { checked: {}, notes: notes ? notes.value : '' };
    items.forEach((item, index) => { data.checked[index] = item.checked; });
    localStorage.setItem(storageKey, JSON.stringify(data));
    updateProgress();
  }
  function hydrate(){
    const data = load();
    items.forEach((item, index) => { item.checked = Boolean(data.checked && data.checked[index]); });
    if(notes && typeof data.notes === 'string') notes.value = data.notes;
    updateProgress();
  }
  function updateProgress(){
    const done = items.filter(i => i.checked).length;
    const total = items.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    if(pctEl) pctEl.textContent = pct + '%';
    if(countEl) countEl.textContent = done + ' of ' + total + ' complete';
    if(barEl) barEl.style.width = pct + '%';
  }
  items.forEach(item => item.addEventListener('change', save));
  if(notes) notes.addEventListener('input', save);
  const reset = app.querySelector('[data-reset-checklist]');
  if(reset){
    reset.addEventListener('click', function(){
      const ok = window.confirm('Reset saved checklist progress in this browser?');
      if(!ok) return;
      localStorage.removeItem(storageKey);
      hydrate();
    });
  }
  const copy = app.querySelector('[data-copy-summary]');
  if(copy){
    copy.addEventListener('click', async function(){
      const done = items.filter(i => i.checked).length;
      const total = items.length;
      const grouped = {};
      items.forEach(item => {
        const category = item.getAttribute('data-category') || 'Checklist';
        grouped[category] = grouped[category] || [];
        grouped[category].push((item.checked ? '[x] ' : '[ ] ') + item.parentElement.textContent.trim());
      });
      let text = 'Will Checklist progress: ' + done + ' of ' + total + ' complete\n\n';
      Object.keys(grouped).forEach(cat => { text += cat + '\n' + grouped[cat].join('\n') + '\n\n'; });
      if(notes && notes.value.trim()) text += 'Private notes\n' + notes.value.trim() + '\n';
      try { await navigator.clipboard.writeText(text); copy.textContent = 'Copied summary'; app.classList.add('copied-flash'); setTimeout(() => { copy.textContent = 'Copy summary'; app.classList.remove('copied-flash'); }, 1800); }
      catch(e){ window.alert('Copy failed. You can use Print summary instead.'); }
    });
  }
  hydrate();
})();


(function(){
  const app = document.querySelector('[data-decision-helper]');
  if(!app) return;
  const boxes = Array.from(app.querySelectorAll('[data-decision]'));
  const result = app.querySelector('[data-decision-result]');
  const storageKey = 'willchecklist.decision.v1';
  function level(){
    const checked = boxes.filter(b => b.checked);
    if(checked.some(b => b.dataset.decision === 'high')) return 'high';
    if(checked.some(b => b.dataset.decision === 'medium')) return 'medium';
    if(checked.length) return 'low';
    return 'none';
  }
  function render(){
    const checked = boxes.filter(b => b.checked);
    const lvl = level();
    result.className = 'decision-result' + (lvl !== 'none' ? ' result-' + lvl : '');
    if(lvl === 'none'){
      result.innerHTML = '<h2>Suggested research path</h2><p>Check any boxes above to see a conservative starting point.</p>';
      return;
    }
    const issues = checked.map(b => '<li>' + b.value + '</li>').join('');
    const paths = {
      high: ['Attorney-first research path', 'Several answers suggest complexity or review needs. Consider prioritizing a licensed estate planning attorney or an attorney-reviewed service before relying on a purely DIY form.'],
      medium: ['Hybrid or guided-service research path', 'Your answers suggest a guided online service with optional attorney review may be worth comparing, along with official state resources.'],
      low: ['Simple-start research path', 'Your answers do not flag the higher-complexity items in this tool. You may still want to compare reputable online services, official state resources, and professional review options.']
    };
    result.innerHTML = '<h2>' + paths[lvl][0] + '</h2><p>' + paths[lvl][1] + '</p><h3>Issues to bring forward</h3><ul>' + issues + '</ul><p class="muted">This is an educational sorting tool, not legal advice or a validity determination.</p>';
  }
  function save(){ localStorage.setItem(storageKey, JSON.stringify(boxes.map(b => b.checked))); render(); }
  function hydrate(){ try{ const vals=JSON.parse(localStorage.getItem(storageKey)||'[]'); boxes.forEach((b,i)=> b.checked=Boolean(vals[i])); }catch(e){} render(); }
  boxes.forEach(b => b.addEventListener('change', save));
  const reset = app.querySelector('[data-reset-decision]');
  if(reset) reset.addEventListener('click', function(){ localStorage.removeItem(storageKey); boxes.forEach(b=>b.checked=false); render(); });
  const copy = app.querySelector('[data-copy-decision]');
  if(copy) copy.addEventListener('click', async function(){
    const text = result.textContent.replace(/\s+/g,' ').trim();
    try{ await navigator.clipboard.writeText(text); copy.textContent='Copied result'; setTimeout(()=>copy.textContent='Copy result', 1800); }catch(e){ alert('Copy failed. You can print this page instead.'); }
  });
  hydrate();
})();

(function(){
  const app = document.querySelector('[data-state-finder]');
  if(!app) return;
  const select = app.querySelector('[data-state-select]');
  const output = app.querySelector('[data-state-output]');
  function slugify(s){ return s.toLowerCase().replace(/district of columbia/,'district-columbia').replace(/[^a-z]+/g,'-').replace(/^-|-$/g,''); }
  function q(s){ return encodeURIComponent(s); }
  function render(state){
    if(!state){ output.innerHTML='<p class="muted">Select a state to generate links.</p>'; return; }
    const statePage = 'https://www.usa.gov/states/' + slugify(state);
    const courtQuery = 'https://www.google.com/search?q=' + q(state + ' probate court estate planning self help site:.gov');
    const barQuery = 'https://www.google.com/search?q=' + q(state + ' state bar lawyer referral estate planning');
    const legalAidQuery = 'https://www.google.com/search?q=' + q(state + ' legal aid estate planning wills');
    output.innerHTML = '<h2>' + state + ' starting points</h2><p>Use these links to begin with official or professional sources. Verify every requirement with a qualified source before signing documents.</p><div class="resource-actions"><a class="btn small secondary" href="' + statePage + '">USA.gov state page</a><a class="btn small secondary" href="' + courtQuery + '">Search official court resources</a><a class="btn small secondary" href="' + barQuery + '">Search bar/lawyer referral</a><a class="btn small secondary" href="' + legalAidQuery + '">Search legal aid</a></div><ul class="mini-list"><li>Look for official court, state government, state bar, legal aid, or licensed professional sources.</li><li>Save links in your planning notes before comparing will-making services.</li><li>Avoid unknown form downloads that do not explain state signing requirements.</li></ul>';
  }
  select.addEventListener('change', function(){ render(select.value); });
  document.querySelectorAll('[data-state-quick]').forEach(btn => btn.addEventListener('click', function(){ select.value = btn.dataset.stateQuick; render(select.value); app.scrollIntoView({behavior:'smooth', block:'start'}); }));
})();

(function(){
  const app = document.querySelector('[data-meeting-brief]');
  if(!app) return;
  const fields = Array.from(app.querySelectorAll('[data-brief-field]'));
  const status = app.querySelector('[data-brief-status]');
  const storageKey = 'willchecklist.brief.v1';
  function save(){ const data={}; fields.forEach(f=>data[f.id]=f.value); localStorage.setItem(storageKey, JSON.stringify(data)); }
  function hydrate(){ try{ const data=JSON.parse(localStorage.getItem(storageKey)||'{}'); fields.forEach(f=>{ if(data[f.id]) f.value=data[f.id]; }); }catch(e){} }
  fields.forEach(f=>f.addEventListener('input', save));
  const copy = app.querySelector('[data-copy-brief]');
  if(copy) copy.addEventListener('click', async function(){
    let text = 'Estate planning meeting brief\n\n';
    fields.forEach(f => { text += f.dataset.briefField + ':\n' + (f.value.trim() || '[not filled yet]') + '\n\n'; });
    try{ await navigator.clipboard.writeText(text); status.textContent='Meeting brief copied.'; setTimeout(()=>status.textContent='', 2200); }catch(e){ status.textContent='Copy failed. You can print the page instead.'; }
  });
  const clear = app.querySelector('[data-clear-brief]');
  if(clear) clear.addEventListener('click', function(){ if(confirm('Clear this worksheet in your browser?')){ fields.forEach(f=>f.value=''); localStorage.removeItem(storageKey); status.textContent='Worksheet cleared.'; } });
  hydrate();
})();


(function(){
  const app = document.querySelector('[data-locator-app]');
  if(!app) return;
  const key='willchecklist.locator.v1';
  const fields=Array.from(app.querySelectorAll('[data-locator-field]'));
  const preview=app.querySelector('[data-locator-preview]');
  const count=app.querySelector('[data-locator-complete]');
  function build(){
    const lines=['Will Checklist Document Locator','Educational organizer only - not legal advice. Do not include passwords or sensitive numbers.',''];
    fields.forEach(f=>{ if(f.value.trim()) lines.push(f.getAttribute('name')+': '+f.value.trim()); });
    if(lines.length===3) lines.push('Start filling fields to generate a shareable locator summary.');
    return lines.join('\n');
  }
  function save(){ const data={}; fields.forEach(f=>data[f.id]=f.value); localStorage.setItem(key,JSON.stringify(data)); render(); }
  function hydrate(){ try{ const data=JSON.parse(localStorage.getItem(key)||'{}'); fields.forEach(f=>{ if(data[f.id]) f.value=data[f.id]; }); }catch(e){} render(); }
  function render(){ const filled=fields.filter(f=>f.value.trim()).length; if(count) count.textContent=String(filled); if(preview) preview.textContent=build(); }
  fields.forEach(f=>f.addEventListener('input', save));
  const copy=app.querySelector('[data-copy-locator]');
  if(copy) copy.addEventListener('click', async function(){ try{ await navigator.clipboard.writeText(build()); copy.textContent='Copied locator'; setTimeout(()=>copy.textContent='Copy locator',1800); }catch(e){ alert('Copy failed. You can print this page instead.'); }});
  const reset=app.querySelector('[data-reset-locator]');
  if(reset) reset.addEventListener('click', function(){ if(confirm('Reset document locator entries saved in this browser?')){ localStorage.removeItem(key); fields.forEach(f=>f.value=''); render(); }});
  hydrate();
})();

(function(){
  const app=document.querySelector('[data-family-app]');
  if(!app) return;
  const key='willchecklist.family.v1';
  const fields=Array.from(app.querySelectorAll('[data-family-field]'));
  const output=app.querySelector('[data-family-output]');
  function val(id){ const el=app.querySelector('#'+id); return el ? el.value.trim() : ''; }
  function draft(){
    const person=val('fam-person')||'a trusted person';
    const tone=val('fam-tone')||'calm and practical';
    const purpose=val('fam-purpose')||'I am getting my estate planning notes organized and want to talk through a practical role or document-location question.';
    const boundaries=val('fam-boundaries')||'I do not need to share every financial detail right now.';
    const questions=val('fam-questions')||'Would you be comfortable talking about this role, and what information would you need to feel prepared?';
    return 'Draft note for '+person+'\nTone: '+tone+'\n\nHi, I am working on getting my estate planning information organized. '+purpose+'\n\nI want this to be practical and low-pressure. '+boundaries+'\n\nA few questions I would like to talk through:\n'+questions+'\n\nThis is not urgent, but I would appreciate a time to talk when you are comfortable.';
  }
  function save(){ const data={}; fields.forEach(f=>data[f.id]=f.value); localStorage.setItem(key,JSON.stringify(data)); }
  function hydrate(){ try{ const data=JSON.parse(localStorage.getItem(key)||'{}'); fields.forEach(f=>{ if(data[f.id]) f.value=data[f.id]; }); }catch(e){} }
  fields.forEach(f=>f.addEventListener('input', save)); fields.forEach(f=>f.addEventListener('change', save));
  const gen=app.querySelector('[data-generate-family]'); if(gen) gen.addEventListener('click',()=>{ output.textContent=draft(); save(); });
  const copy=app.querySelector('[data-copy-family]'); if(copy) copy.addEventListener('click',async()=>{ try{ await navigator.clipboard.writeText(output.textContent || draft()); copy.textContent='Copied draft'; setTimeout(()=>copy.textContent='Copy draft',1800); }catch(e){ alert('Copy failed. You can print this page instead.'); }});
  const reset=app.querySelector('[data-reset-family]'); if(reset) reset.addEventListener('click',()=>{ if(confirm('Reset saved conversation fields in this browser?')){ localStorage.removeItem(key); fields.forEach(f=>{ if(f.tagName==='SELECT') f.selectedIndex=0; else f.value=''; }); output.textContent='Use the fields above, then generate a draft.'; }});
  hydrate();
})();

(function(){
  const app=document.querySelector('[data-plan-app]');
  if(!app) return;
  const key='willchecklist.sevenDayPlan.v1';
  const items=Array.from(app.querySelectorAll('[data-plan-item]'));
  const notes=app.querySelector('[data-plan-notes]');
  const pct=app.querySelector('[data-plan-percent]');
  const count=app.querySelector('[data-plan-count]');
  const bar=app.querySelector('[data-plan-bar]');
  function update(){ const done=items.filter(i=>i.checked).length, total=items.length, p=total?Math.round(done/total*100):0; if(pct)pct.textContent=p+'%'; if(count)count.textContent=done+' of '+total+' complete'; if(bar)bar.style.width=p+'%'; }
  function save(){ const data={checked:items.map(i=>i.checked), notes:notes?notes.value:''}; localStorage.setItem(key,JSON.stringify(data)); update(); }
  function hydrate(){ try{ const data=JSON.parse(localStorage.getItem(key)||'{}'); if(Array.isArray(data.checked)) items.forEach((i,idx)=>i.checked=!!data.checked[idx]); if(notes&&data.notes) notes.value=data.notes; }catch(e){} update(); }
  function summary(){ const lines=['7-Day Will Preparation Plan']; items.forEach(i=>lines.push((i.checked?'[x] ':'[ ] ')+(i.getAttribute('data-day')||'Plan')+' - '+i.parentElement.textContent.trim())); if(notes&&notes.value.trim()) lines.push('\nNotes:\n'+notes.value.trim()); return lines.join('\n'); }
  items.forEach(i=>i.addEventListener('change',save)); if(notes) notes.addEventListener('input',save);
  const copy=app.querySelector('[data-copy-plan]'); if(copy) copy.addEventListener('click',async()=>{ try{ await navigator.clipboard.writeText(summary()); copy.textContent='Copied summary'; setTimeout(()=>copy.textContent='Copy summary',1800); }catch(e){ alert('Copy failed. You can print this page instead.'); }});
  const reset=app.querySelector('[data-reset-plan]'); if(reset) reset.addEventListener('click',()=>{ if(confirm('Reset 7-day plan progress in this browser?')){ localStorage.removeItem(key); items.forEach(i=>i.checked=false); if(notes)notes.value=''; update(); }});
  hydrate();
})();


(function(){
  const app=document.querySelector('[data-dashboard-app]');
  if(!app) return;
  const defs=[
    {id:'start',name:'Start here assessment',key:'willchecklist.startHere.v1',type:'fields'},
    {id:'checklist',name:'Interactive checklist',key:'willchecklist.interactive.v1',type:'checklist'},
    {id:'plan',name:'7-day prep plan',key:'willchecklist.sevenDayPlan.v1',type:'plan'},
    {id:'locator',name:'Document locator',key:'willchecklist.locator.v1',type:'fields'},
    {id:'decision',name:'Will-making path helper',key:'willchecklist.decision.v1',type:'decision'},
    {id:'family',name:'Family conversation guide',key:'willchecklist.family.v1',type:'fields'},
    {id:'meeting',name:'Attorney meeting prep',key:'willchecklist.attorneyPrep.v1',type:'fields'},
    {id:'readiness',name:'Readiness scorecard',key:'willchecklist.readiness.v1',type:'checkedArray',completeAt:10},
    {id:'beneficiaryReview',name:'Beneficiary review worksheet',key:'willchecklist.beneficiaryReview.v1',type:'beneficiaryRows'},
    {id:'binder',name:'Estate binder index',key:'willchecklist.binderIndex.v1',type:'checkedArray',completeAt:8},
    {id:'summary',name:'Planning summary builder',key:'willchecklist.summaryBuilder.v1',type:'fields'},
    {id:'final',name:'Final review checklist',key:'willchecklist.finalReview.v1',type:'plan'},
    {id:'review',name:'Annual review planner',key:'willchecklist.annualReview.v1',type:'fields'}
  ];
  const pct=app.querySelector('[data-dashboard-percent]');
  const count=app.querySelector('[data-dashboard-count]');
  const bar=app.querySelector('[data-dashboard-bar]');
  const summary=app.querySelector('[data-dashboard-summary]');
  function parse(key){ try{return JSON.parse(localStorage.getItem(key)||'null');}catch(e){return null;} }
  function status(def){
    const d=parse(def.key);
    if(!d) return {state:'none',text:'Not started yet.',detail:'not started'};
    if(def.type==='checklist'){
      const checked=d.checked?Object.values(d.checked).filter(Boolean).length:0;
      const hasNotes=!!(d.notes&&d.notes.trim());
      if(checked===0&&!hasNotes) return {state:'none',text:'Not started yet.',detail:'not started'};
      return {state:checked>=18?'complete':'started',text:checked+' checklist items checked'+(hasNotes?' plus notes.':'.'),detail:checked+' items checked'};
    }
    if(def.type==='plan'){
      const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0;
      const hasNotes=!!(d.notes&&d.notes.trim());
      if(checked===0&&!hasNotes) return {state:'none',text:'Not started yet.',detail:'not started'};
      return {state:checked>=14?'complete':'started',text:checked+' plan tasks checked'+(hasNotes?' plus notes.':'.'),detail:checked+' tasks checked'};
    }
    if(def.type==='decision'){
      const checked=Array.isArray(d)?d.filter(Boolean).length:0;
      if(!checked) return {state:'none',text:'Not started yet.',detail:'not started'};
      return {state:'started',text:checked+' decision factors selected.',detail:checked+' factors selected'};
    }
    if(def.type==='checkedArray'){
      const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0;
      const hasNotes=!!(d.notes&&d.notes.trim());
      if(!checked&&!hasNotes) return {state:'none',text:'Not started yet.',detail:'not started'};
      const completeAt=Number(def.completeAt||8);
      return {state:checked>=completeAt?'complete':'started',text:checked+' items selected'+(hasNotes?' plus notes.':'.'),detail:checked+' items selected'};
    }
    if(def.type==='beneficiaryRows'){
      const rows=Array.isArray(d.rows)?d.rows:[];
      const filled=rows.filter(r=>r && Object.values(r).some(v=>String(v||'').trim())).length;
      const hasNotes=!!(d.notes&&d.notes.trim());
      if(!filled&&!hasNotes) return {state:'none',text:'Not started yet.',detail:'not started'};
      return {state:filled>=3?'complete':'started',text:filled+' beneficiary review rows saved'+(hasNotes?' plus notes.':'.'),detail:filled+' review rows saved'};
    }
    if(def.type==='fields'){
      const values=d&&typeof d==='object'?Object.values(d).filter(v=>String(v||'').trim()).length:0;
      if(!values) return {state:'none',text:'Not started yet.',detail:'not started'};
      return {state:values>=5?'complete':'started',text:values+' fields filled.',detail:values+' fields filled'};
    }
    return {state:'none',text:'Not started yet.',detail:'not started'};
  }
  function render(){
    let started=0, complete=0;
    const lines=['Will Checklist planning snapshot','Educational organizer only - not legal advice. Do not include passwords or sensitive account details.',''];
    defs.forEach(def=>{
      const st=status(def);
      if(st.state!=='none') started++;
      if(st.state==='complete') complete++;
      const card=app.querySelector('[data-dashboard-card="'+def.id+'"]');
      if(card){
        card.classList.remove('started','complete');
        if(st.state!=='none') card.classList.add(st.state);
        const el=card.querySelector('[data-dashboard-status]');
        if(el) el.textContent=st.text;
      }
      lines.push(def.name+': '+st.detail);
    });
    const p=Math.round(started/defs.length*100);
    if(pct) pct.textContent=p+'%';
    if(count) count.textContent=started+' of '+defs.length+' areas started';
    if(bar) bar.style.width=p+'%';
    lines.push('');
    lines.push('Suggested next step: continue any area marked not started, then print the PDF packet or prepare a professional meeting brief.');
    if(summary) summary.textContent=lines.join('\n');
  }
  const copy=app.querySelector('[data-copy-dashboard]');
  if(copy) copy.addEventListener('click',async()=>{ try{ await navigator.clipboard.writeText(summary.textContent); copy.textContent='Copied snapshot'; setTimeout(()=>copy.textContent='Copy planning snapshot',1800); }catch(e){ alert('Copy failed. You can print this page instead.'); } });
  const clear=app.querySelector('[data-clear-dashboard]');
  if(clear) clear.addEventListener('click',()=>{ if(confirm('Clear saved progress for all Will Checklist tools in this browser?')){ defs.forEach(d=>localStorage.removeItem(d.key)); render(); } });

  function collectBackup(){
    const data={version:'willchecklist.v7',createdAt:new Date().toISOString(),notice:'Private browser-local organizer backup. Do not store passwords, SSNs, full account numbers, or private keys.',items:{}};
    Object.keys(localStorage).filter(k=>k.indexOf('willchecklist.')===0).sort().forEach(k=>{ data.items[k]=localStorage.getItem(k); });
    return JSON.stringify(data,null,2);
  }
  function applyBackup(text){
    let data;
    try{ data=JSON.parse(text); }catch(e){ throw new Error('Backup file is not valid JSON.'); }
    if(!data || !data.items || typeof data.items!=='object') throw new Error('Backup file does not include a Will Checklist items object.');
    Object.keys(data.items).forEach(k=>{ if(k.indexOf('willchecklist.')===0){ localStorage.setItem(k,String(data.items[k])); } });
    return Object.keys(data.items).filter(k=>k.indexOf('willchecklist.')===0).length;
  }
  const backupBox=app.querySelector('[data-backup-json]');
  const backupStatus=app.querySelector('[data-backup-status]');
  const exportBtn=app.querySelector('[data-export-progress]');
  if(exportBtn) exportBtn.addEventListener('click',()=>{
    const text=collectBackup();
    if(backupBox) backupBox.value=text;
    const blob=new Blob([text],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='will-checklist-progress-backup.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    if(backupStatus) backupStatus.textContent='Backup JSON created. Keep it private.';
  });
  const copyBackup=app.querySelector('[data-copy-backup]');
  if(copyBackup) copyBackup.addEventListener('click',async()=>{
    const text=collectBackup();
    if(backupBox) backupBox.value=text;
    try{ await navigator.clipboard.writeText(text); copyBackup.textContent='Copied backup'; setTimeout(()=>copyBackup.textContent='Copy backup JSON',1800); }
    catch(e){ alert('Copy failed. The backup text is visible in the box.'); }
  });
  const importInput=app.querySelector('[data-import-progress]');
  if(importInput) importInput.addEventListener('change',()=>{
    const file=importInput.files && importInput.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>{ try{ const n=applyBackup(String(reader.result||'')); if(backupBox) backupBox.value=String(reader.result||''); if(backupStatus) backupStatus.textContent='Imported '+n+' saved tool entries. Refreshing dashboard.'; render(); }catch(err){ if(backupStatus) backupStatus.textContent=err.message; else alert(err.message); } };
    reader.readAsText(file);
  });

  render();
})();

(function(){
  const app=document.querySelector('[data-help-app]');
  if(!app) return;
  const output=document.querySelector('[data-help-output]');
  const status=app.querySelector('.form-status');
  const fields=Array.from(app.querySelectorAll('[data-help-field]'));
  const email=app.querySelector('#help-email');
  function val(id){ const el=app.querySelector('#'+id); return el?el.value.trim():''; }
  function summary(){
    return ['Planning help request summary','General, non-confidential inquiry only. Not legal advice.','',
      'Goal: '+(val('help-goal')||'[not selected]'),
      'Possible complexity: '+(val('help-complexity')||'[not selected]'),
      'State/region: '+(val('help-state')||'[not provided]'),
      'Brief note: '+(val('help-message')||'[not provided]'),
      '',
      'Please do not include passwords, account numbers, Social Security numbers, or sensitive legal facts in an initial inquiry.'
    ].join('\n');
  }
  function save(){ const data={}; fields.forEach(f=>data[f.id]=f.value); if(email) data[email.id]=email.value; localStorage.setItem('willchecklist.helpRequest.v1',JSON.stringify(data)); }
  function hydrate(){ try{ const data=JSON.parse(localStorage.getItem('willchecklist.helpRequest.v1')||'{}'); fields.forEach(f=>{ if(data[f.id]) f.value=data[f.id]; }); if(email&&data[email.id]) email.value=data[email.id]; }catch(e){} }
  fields.forEach(f=>f.addEventListener('input',save)); fields.forEach(f=>f.addEventListener('change',save)); if(email) email.addEventListener('input',save);
  const build=app.querySelector('[data-build-help]'); if(build) build.addEventListener('click',()=>{ save(); if(output) output.textContent=summary(); if(status) status.textContent='Safe summary built. Replace the lead endpoint before public submission.'; });
  const copy=app.querySelector('[data-copy-help]'); if(copy) copy.addEventListener('click',async()=>{ const text=(output&&output.textContent&&!output.textContent.startsWith('Choose'))?output.textContent:summary(); try{ await navigator.clipboard.writeText(text); copy.textContent='Copied summary'; setTimeout(()=>copy.textContent='Copy summary',1800); }catch(e){ alert('Copy failed. You can select and copy the summary manually.'); } });
  hydrate();
})();


(function(){
  const app=document.querySelector('[data-summary-builder-app]');
  if(!app) return;
  const storeKey='willchecklist.summaryBuilder.v1';
  const output=app.querySelector('[data-summary-output]');
  const fields=Array.from(app.querySelectorAll('[data-summary-field]'));
  const includes=Array.from(app.querySelectorAll('[data-summary-include]'));
  const countEl=app.querySelector('[data-summary-area-count]');
  const sources=[
    {id:'checklist',label:'Interactive checklist',key:'willchecklist.interactive.v1'},
    {id:'plan',label:'7-day plan',key:'willchecklist.sevenDayPlan.v1'},
    {id:'locator',label:'Document locator',key:'willchecklist.locator.v1'},
    {id:'decision',label:'Decision helper',key:'willchecklist.decision.v1'},
    {id:'family',label:'Family conversation guide',key:'willchecklist.family.v1'},
    {id:'meeting',label:'Attorney meeting prep',key:'willchecklist.attorneyPrep.v1'},
    {id:'readiness',label:'Readiness scorecard',key:'willchecklist.readiness.v1'},
    {id:'beneficiary',label:'Beneficiary review worksheet',key:'willchecklist.beneficiaryReview.v1'},
    {id:'binder',label:'Estate binder index',key:'willchecklist.binderIndex.v1'},
    {id:'final',label:'Final review checklist',key:'willchecklist.finalReview.v1'}
  ];
  function parse(key){ try{return JSON.parse(localStorage.getItem(key)||'null');}catch(e){return null;} }
  function hasData(d){
    if(!d) return false;
    if(Array.isArray(d)) return d.some(Boolean);
    if(typeof d==='object') return Object.values(d).some(v=>Array.isArray(v)?v.some(Boolean):String(v||'').trim());
    return !!String(d).trim();
  }
  function sourceStatus(src){
    const d=parse(src.key);
    if(!hasData(d)) return 'not started';
    if(src.id==='checklist'){
      const checked=d.checked?Object.values(d.checked).filter(Boolean).length:0;
      return checked+' checklist items checked'+(d.notes&&d.notes.trim()?'; notes added':'');
    }
    if(src.id==='plan'){
      const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0;
      return checked+' 7-day plan tasks checked'+(d.notes&&d.notes.trim()?'; notes added':'');
    }
    if(src.id==='decision') return (Array.isArray(d)?d.filter(Boolean).length:0)+' decision factors selected';
    if(src.id==='final'){
      const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0;
      return checked+' final review items checked'+(d.notes&&d.notes.trim()?'; questions added':'');
    }
    const values=typeof d==='object'?Object.values(d).filter(v=>String(v||'').trim()).length:0;
    return values+' fields filled';
  }
  function getVal(id){const el=app.querySelector('#'+id);return el?el.value.trim():'';}
  function include(id){const el=app.querySelector('[data-summary-include="'+id+'"]');return !el || el.checked;}
  function build(){
    const found=sources.filter(s=>hasData(parse(s.key))).length;
    if(countEl) countEl.textContent=found;
    const lines=[];
    const label=getVal('summary-name') || 'Will Checklist planning brief';
    if(include('overview')){
      lines.push(label);
      lines.push('Created with Will Checklist. Educational organizer only - not legal advice.');
      lines.push('Privacy note: do not include passwords, full account numbers, Social Security numbers, private keys, or sensitive legal facts in this brief.');
      lines.push('');
    }
    if(include('checklist')) lines.push('Checklist progress: '+sourceStatus(sources.find(s=>s.id==='checklist')));
    if(include('locator')) lines.push('Document locator: '+sourceStatus(sources.find(s=>s.id==='locator')));
    if(include('beneficiary')) lines.push('Beneficiary review worksheet: '+sourceStatus(sources.find(s=>s.id==='beneficiary')));
    if(include('final')) lines.push('Final review checklist: '+sourceStatus(sources.find(s=>s.id==='final')));
    if(include('readiness')) lines.push('Readiness scorecard: '+sourceStatus(sources.find(s=>s.id==='readiness')));
    if(include('binder')) lines.push('Estate binder index: '+sourceStatus(sources.find(s=>s.id==='binder')));
    if(include('decision')) lines.push('Decision helper: '+sourceStatus(sources.find(s=>s.id==='decision')));
    if(include('family')) lines.push('Family conversation guide: '+sourceStatus(sources.find(s=>s.id==='family')));
    if(include('meeting')) lines.push('Attorney meeting prep: '+sourceStatus(sources.find(s=>s.id==='meeting')));
    const next=getVal('summary-next-step');
    if(next){ lines.push(''); lines.push('Preferred next step: '+next); }
    const questions=getVal('summary-questions');
    if(questions){ lines.push(''); lines.push('Questions to ask:'); lines.push(questions); }
    lines.push('');
    lines.push('Suggested use: print or copy this brief, then use it as a high-level agenda with a qualified professional or your chosen will-making research path.');
    return lines.join('\n');
  }
  function save(){ const d={}; fields.forEach(f=>d[f.id]=f.value); d.includes={}; includes.forEach(i=>d.includes[i.getAttribute('data-summary-include')]=i.checked); localStorage.setItem(storeKey,JSON.stringify(d)); }
  function hydrate(){ try{ const d=JSON.parse(localStorage.getItem(storeKey)||'{}'); fields.forEach(f=>{ if(d[f.id]) f.value=d[f.id]; }); if(d.includes) includes.forEach(i=>{ const k=i.getAttribute('data-summary-include'); if(k in d.includes) i.checked=!!d.includes[k]; }); }catch(e){} }
  fields.forEach(f=>f.addEventListener('input',save)); fields.forEach(f=>f.addEventListener('change',save)); includes.forEach(i=>i.addEventListener('change',save));
  const buildBtn=app.querySelector('[data-build-summary]'); if(buildBtn) buildBtn.addEventListener('click',()=>{ save(); output.textContent=build(); });
  const copy=app.querySelector('[data-copy-summary-brief]'); if(copy) copy.addEventListener('click',async()=>{ const text=(output&&output.textContent&&!output.textContent.startsWith('Choose'))?output.textContent:build(); try{ await navigator.clipboard.writeText(text); copy.textContent='Copied brief'; setTimeout(()=>copy.textContent='Copy brief',1800); }catch(e){ alert('Copy failed. You can select the brief and copy it manually.'); } });
  const reset=app.querySelector('[data-reset-summary-builder]'); if(reset) reset.addEventListener('click',()=>{ if(confirm('Reset summary builder notes in this browser?')){ localStorage.removeItem(storeKey); fields.forEach(f=>{ if(f.tagName==='SELECT') f.selectedIndex=0; else f.value=''; }); includes.forEach(i=>i.checked=true); output.textContent='Choose sections and build your planning brief.'; if(countEl) countEl.textContent=sources.filter(s=>hasData(parse(s.key))).length; } });
  hydrate(); if(countEl) countEl.textContent=sources.filter(s=>hasData(parse(s.key))).length;
})();

(function(){
  const app=document.querySelector('[data-final-review-app]');
  if(!app) return;
  const key='willchecklist.finalReview.v1';
  const items=Array.from(app.querySelectorAll('[data-final-review-item]'));
  const notes=app.querySelector('[data-final-review-notes]');
  const pct=app.querySelector('[data-final-percent]');
  const count=app.querySelector('[data-final-count]');
  const bar=app.querySelector('[data-final-bar]');
  function update(){ const done=items.filter(i=>i.checked).length,total=items.length,p=total?Math.round(done/total*100):0; if(pct)pct.textContent=p+'%'; if(count)count.textContent=done+' of '+total+' complete'; if(bar)bar.style.width=p+'%'; }
  function save(){ localStorage.setItem(key,JSON.stringify({checked:items.map(i=>i.checked),notes:notes?notes.value:''})); update(); }
  function hydrate(){ try{ const d=JSON.parse(localStorage.getItem(key)||'{}'); if(Array.isArray(d.checked)) items.forEach((i,idx)=>i.checked=!!d.checked[idx]); if(notes&&d.notes) notes.value=d.notes; }catch(e){} update(); }
  function summary(){ const lines=['Final Review Checklist','Educational organizer only - confirm legal requirements with a qualified professional or official state resource.','']; items.forEach(i=>lines.push((i.checked?'[x] ':'[ ] ')+i.parentElement.textContent.trim())); if(notes&&notes.value.trim()) lines.push('\nFinal questions to confirm:\n'+notes.value.trim()); return lines.join('\n'); }
  items.forEach(i=>i.addEventListener('change',save)); if(notes) notes.addEventListener('input',save);
  const copy=app.querySelector('[data-copy-final-review]'); if(copy) copy.addEventListener('click',async()=>{ try{ await navigator.clipboard.writeText(summary()); copy.textContent='Copied review'; setTimeout(()=>copy.textContent='Copy review summary',1800); }catch(e){ alert('Copy failed. You can print this page instead.'); } });
  const reset=app.querySelector('[data-reset-final-review]'); if(reset) reset.addEventListener('click',()=>{ if(confirm('Reset final review progress in this browser?')){ localStorage.removeItem(key); items.forEach(i=>i.checked=false); if(notes)notes.value=''; update(); } });
  hydrate();
})();

(function(){
  const app=document.querySelector('[data-glossary-app]');
  if(!app) return;
  const input=app.querySelector('[data-glossary-search]');
  const terms=Array.from(app.querySelectorAll('[data-glossary-term]'));
  if(!input) return;
  input.addEventListener('input',()=>{
    const q=input.value.toLowerCase().trim();
    terms.forEach(card=>{ const hit=!q || card.textContent.toLowerCase().includes(q); card.hidden=!hit; });
  });
})();


(function(){
  const app=document.querySelector('[data-start-here-app]');
  if(!app) return;
  const key='willchecklist.startHere.v1';
  const fields=Array.from(app.querySelectorAll('[data-start-field]'));
  const notes=app.querySelector('[data-start-text]');
  const output=app.querySelector('[data-start-output]');
  const score=app.querySelector('[data-start-score]');
  function selectedGoal(){ const g=app.querySelector('input[name="start-goal"]:checked'); return g?g.value:''; }
  function checkedVals(){ return fields.filter(f=>f.type==='checkbox'&&f.checked).map(f=>f.value); }
  function countAnswers(){ return (selectedGoal()?1:0)+checkedVals().length+(notes&&notes.value.trim()?1:0); }
  function save(){ const data={goal:selectedGoal(),checks:checkedVals(),notes:notes?notes.value:''}; localStorage.setItem(key,JSON.stringify(data)); update(); }
  function update(){ if(score) score.textContent=countAnswers(); }
  function hydrate(){ try{ const d=JSON.parse(localStorage.getItem(key)||'{}'); fields.forEach(f=>{ if(f.type==='radio') f.checked=d.goal===f.value; if(f.type==='checkbox') f.checked=Array.isArray(d.checks)&&d.checks.includes(f.value); }); if(notes&&d.notes) notes.value=d.notes; }catch(e){} update(); }
  function build(){
    const goal=selectedGoal(); const checks=checkedVals();
    const lines=['Will Checklist starter path','Educational organizer only - not legal advice.',''];
    if(!goal && !checks.length){ lines.push('Start with: Planning Dashboard'); lines.push('Why: You have not selected a specific priority yet. The dashboard gives you the full map.'); }
    else if(goal==='compare' || checks.includes('complex')){ lines.push('Start with: Will-Making Decision Helper'); lines.push('Then: Compare Options → State Resource Finder → Attorney Meeting Prep'); lines.push('Why: Your answers suggest you should flag complexity and compare professional, hybrid, online, and official-resource paths before relying on a simple form.'); }
    else if(goal==='meeting'){ lines.push('Start with: Attorney Meeting Prep'); lines.push('Then: Planning Summary Builder → Document Locator → Final Review Checklist'); lines.push('Why: Your priority is preparing a clear, non-confidential consultation brief.'); }
    else if(goal==='family' || checks.includes('children')){ lines.push('Start with: Family Conversation Guide'); lines.push('Then: Guardianship Checklist → Executor Checklist → Planning Summary Builder'); lines.push('Why: Your answers involve roles, trusted people, or family conversations.'); }
    else if(checks.includes('digital')){ lines.push('Start with: Document Locator'); lines.push('Then: Digital Assets Checklist → Interactive Checklist → Annual Review Planner'); lines.push('Why: Your documents and digital records may be scattered.'); }
    else if(checks.includes('urgent')){ lines.push('Start with: 7-Day Will Prep Plan'); lines.push('Then: Interactive Checklist → Summary Builder → Decision Helper'); lines.push('Why: A short sequence can help you make progress quickly without rushing legal decisions.'); }
    else { lines.push('Start with: Interactive Will Checklist'); lines.push('Then: Document Locator → Planning Summary Builder → Annual Review Planner'); lines.push('Why: Your main goal is getting organized.'); }
    if(notes&&notes.value.trim()){ lines.push(''); lines.push('Your notes:'); lines.push(notes.value.trim()); }
    lines.push(''); lines.push('Next action: open the recommended page, complete one section, then return to the dashboard.');
    return lines.join('\n');
  }
  fields.forEach(f=>{ f.addEventListener('change',save); f.addEventListener('input',save); }); if(notes) notes.addEventListener('input',save);
  const buildBtn=app.querySelector('[data-build-start-path]'); if(buildBtn) buildBtn.addEventListener('click',()=>{ save(); if(output) output.textContent=build(); });
  const copy=app.querySelector('[data-copy-start-path]'); if(copy) copy.addEventListener('click',async()=>{ const text=(output&&output.textContent&&!output.textContent.startsWith('Answer'))?output.textContent:build(); try{ await navigator.clipboard.writeText(text); copy.textContent='Copied path'; setTimeout(()=>copy.textContent='Copy path',1800); }catch(e){ alert('Copy failed. You can select and copy the path manually.'); } });
  const reset=app.querySelector('[data-reset-start-path]'); if(reset) reset.addEventListener('click',()=>{ if(confirm('Reset your starter assessment in this browser?')){ localStorage.removeItem(key); fields.forEach(f=>f.checked=false); if(notes)notes.value=''; if(output)output.textContent='Answer the questions above, then build your path.'; update(); } });
  hydrate();
})();

(function(){
  const app=document.querySelector('[data-annual-review-app]');
  if(!app) return;
  const key='willchecklist.annualReview.v1';
  const fields=Array.from(app.querySelectorAll('[data-review-field]'));
  const triggers=Array.from(app.querySelectorAll('[data-review-trigger]'));
  const pct=app.querySelector('[data-review-complete]');
  const count=app.querySelector('[data-review-count]');
  const output=app.querySelector('[data-review-output]');
  function val(id){ const el=app.querySelector('#'+id); return el?el.value.trim():''; }
  function update(){ const n=triggers.filter(t=>t.checked).length, total=triggers.length, p=total?Math.round(n/total*100):0; if(pct)pct.textContent=p+'%'; if(count)count.textContent=n+' of '+total+' triggers selected'; }
  function save(){ const data={fields:{},triggers:triggers.filter(t=>t.checked).map(t=>t.value)}; fields.forEach(f=>data.fields[f.id]=f.value); localStorage.setItem(key,JSON.stringify(data)); update(); }
  function hydrate(){ try{ const d=JSON.parse(localStorage.getItem(key)||'{}'); fields.forEach(f=>{ if(d.fields&&d.fields[f.id]) f.value=d.fields[f.id]; }); triggers.forEach(t=>t.checked=Array.isArray(d.triggers)&&d.triggers.includes(t.value)); }catch(e){} update(); }
  function build(){
    const month=val('review-month')||'[choose a month]'; const person=val('review-person')||'[trusted person]'; const loc=val('review-location')||'[document location]'; const notes=val('review-notes');
    const selected=triggers.filter(t=>t.checked).map(t=>'- '+t.value);
    const lines=['Annual estate planning prep review reminder','Educational organizer only - not legal advice.','',
      'Review month: '+month,
      'Person to remind/involve: '+person,
      'Where planning packet/location note is stored: '+loc,'',
      'Review triggers to watch:'];
    lines.push(selected.length?selected.join('\n'):'- [add life-change triggers]');
    if(notes){ lines.push(''); lines.push('Notes:'); lines.push(notes); }
    lines.push(''); lines.push('Suggested action: open Will Checklist dashboard, update the document locator, check beneficiary designation notes, and ask a qualified professional about legal questions.');
    return lines.join('\n');
  }
  fields.forEach(f=>{ f.addEventListener('input',save); f.addEventListener('change',save); }); triggers.forEach(t=>t.addEventListener('change',save));
  const buildBtn=app.querySelector('[data-build-review-plan]'); if(buildBtn) buildBtn.addEventListener('click',()=>{ save(); if(output) output.textContent=build(); });
  const copy=app.querySelector('[data-copy-review-plan]'); if(copy) copy.addEventListener('click',async()=>{ const text=(output&&output.textContent&&!output.textContent.startsWith('Choose'))?output.textContent:build(); try{ await navigator.clipboard.writeText(text); copy.textContent='Copied reminder'; setTimeout(()=>copy.textContent='Copy reminder',1800); }catch(e){ alert('Copy failed. You can select and copy the reminder manually.'); } });
  const reset=app.querySelector('[data-reset-review-plan]'); if(reset) reset.addEventListener('click',()=>{ if(confirm('Reset annual review planner in this browser?')){ localStorage.removeItem(key); fields.forEach(f=>{ if(f.tagName==='SELECT') f.selectedIndex=0; else f.value=''; }); triggers.forEach(t=>t.checked=false); if(output)output.textContent='Choose a review month and triggers, then build your reminder text.'; update(); } });
  hydrate();
})();


(function(){
  const app=document.querySelector('[data-readiness-app]');
  if(!app) return;
  const key='willchecklist.readiness.v1';
  const items=Array.from(app.querySelectorAll('[data-readiness-item]'));
  const notes=app.querySelector('[data-readiness-notes]');
  const pct=app.querySelector('[data-readiness-percent]');
  const count=app.querySelector('[data-readiness-count]');
  const bar=app.querySelector('[data-readiness-bar]');
  const result=app.querySelector('[data-readiness-result]');
  function load(){try{return JSON.parse(localStorage.getItem(key)||'{}');}catch(e){return{};}}
  function save(){const data={checked:items.map(i=>i.checked),notes:notes?notes.value:''};localStorage.setItem(key,JSON.stringify(data));render();}
  function hydrate(){const d=load();if(Array.isArray(d.checked))items.forEach((i,idx)=>i.checked=!!d.checked[idx]);if(notes&&d.notes)notes.value=d.notes;render();}
  function summaryText(){
    const total=items.reduce((n,i)=>n+Number(i.dataset.points||1),0);
    const done=items.filter(i=>i.checked).reduce((n,i)=>n+Number(i.dataset.points||1),0);
    const p=total?Math.round(done/total*100):0;
    const unchecked=items.filter(i=>!i.checked).sort((a,b)=>Number(b.dataset.points||1)-Number(a.dataset.points||1)).slice(0,5);
    const lines=['Will preparation readiness score: '+p+'%','Educational organization score only - not legal advice.',''];
    lines.push('Next actions:');
    if(unchecked.length){ unchecked.forEach(i=>lines.push('- '+i.parentElement.textContent.trim())); }
    else { lines.push('- All scorecard items are checked. Build a planning summary or schedule a professional review.'); }
    if(notes&&notes.value.trim()){lines.push('');lines.push('Notes:');lines.push(notes.value.trim());}
    return lines.join('\n');
  }
  function render(){
    const total=items.reduce((n,i)=>n+Number(i.dataset.points||1),0);
    const done=items.filter(i=>i.checked).reduce((n,i)=>n+Number(i.dataset.points||1),0);
    const p=total?Math.round(done/total*100):0;
    if(pct)pct.textContent=p+'%'; if(count)count.textContent=done+' of '+total+' points ready'; if(bar)bar.style.width=p+'%';
    const unchecked=items.filter(i=>!i.checked).sort((a,b)=>Number(b.dataset.points||1)-Number(a.dataset.points||1)).slice(0,5);
    let tier=p>=80?'Strong organization base':p>=50?'Good start with clear gaps':'Early planning stage';
    let html='<h2>'+tier+'</h2><p><strong>'+p+'%</strong> organization readiness based on the items checked above.</p><h3>Suggested next actions</h3><ul>';
    if(unchecked.length){unchecked.forEach(i=>html+='<li>'+i.parentElement.textContent.trim()+'</li>');} else {html+='<li>Build a planning summary and consider professional review before signing or updating documents.</li>';}
    html+='</ul><p class="muted">This is an organization aid, not a legal readiness or document validity score.</p>';
    if(result)result.innerHTML=html;
  }
  items.forEach(i=>i.addEventListener('change',save)); if(notes)notes.addEventListener('input',save);
  const copy=app.querySelector('[data-copy-readiness]'); if(copy)copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summaryText());copy.textContent='Copied plan';setTimeout(()=>copy.textContent='Copy readiness plan',1800);}catch(e){alert('Copy failed. You can print this page instead.');}});
  const reset=app.querySelector('[data-reset-readiness]'); if(reset)reset.addEventListener('click',()=>{if(confirm('Reset readiness scorecard in this browser?')){localStorage.removeItem(key);items.forEach(i=>i.checked=false);if(notes)notes.value='';render();}});
  hydrate();
})();

(function(){
  const app=document.querySelector('[data-beneficiary-app]');
  if(!app) return;
  const key='willchecklist.beneficiaryReview.v1';
  const tbody=app.querySelector('[data-beneficiary-rows]');
  const notes=app.querySelector('[data-beneficiary-notes]');
  const count=app.querySelector('[data-beneficiary-count]');
  const output=app.querySelector('[data-beneficiary-output]');
  function clean(v){return String(v||'').replace(/[<>]/g,'').trim();}
  function blank(){return {asset:'',who:'',checked:'',next:''};}
  function load(){try{const d=JSON.parse(localStorage.getItem(key)||'{}');return {rows:Array.isArray(d.rows)&&d.rows.length?d.rows:[blank()],notes:d.notes||''};}catch(e){return {rows:[blank()],notes:''};}}
  function rowHtml(r,idx){return '<tr data-row="'+idx+'"><td data-label="Item to check"><input aria-label="Item to check" data-field="asset" value="'+clean(r.asset)+'" placeholder="Life insurance — no policy #"></td><td data-label="Current note"><input aria-label="Current note" data-field="who" value="'+clean(r.who)+'" placeholder="Spouse / child / unsure"></td><td data-label="Last checked"><input aria-label="Last checked" data-field="checked" value="'+clean(r.checked)+'" placeholder="Month/year or unsure"></td><td data-label="Question to ask"><textarea aria-label="Question to ask" data-field="next" placeholder="Ask provider to confirm current form">'+clean(r.next)+'</textarea></td><td data-label=""><button class="btn small secondary" type="button" data-remove-row="'+idx+'">Remove row</button></td></tr>';}
  function collect(){const rows=Array.from(tbody.querySelectorAll('tr')).map(tr=>{const obj={};tr.querySelectorAll('[data-field]').forEach(f=>obj[f.dataset.field]=f.value);return obj;});return {rows:rows.length?rows:[blank()],notes:notes?notes.value:''};}
  function save(){localStorage.setItem(key,JSON.stringify(collect()));renderOutput();}
  function renderRows(data){tbody.innerHTML=data.rows.map(rowHtml).join(''); if(notes)notes.value=data.notes||''; tbody.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',save)); tbody.querySelectorAll('[data-remove-row]').forEach(btn=>btn.addEventListener('click',()=>{const data=collect();data.rows.splice(Number(btn.dataset.removeRow),1);if(!data.rows.length)data.rows.push(blank());localStorage.setItem(key,JSON.stringify(data));renderRows(data);renderOutput();}));renderOutput();}
  function renderOutput(){const d=collect();const filled=d.rows.filter(r=>Object.values(r).some(v=>String(v||'').trim())); if(count)count.textContent=filled.length; const lines=['Beneficiary designation review list','Do not include account numbers or private credentials. This worksheet does not change any designation.','']; d.rows.forEach((r,i)=>{if(Object.values(r).some(v=>String(v||'').trim())){lines.push((i+1)+'. '+(r.asset||'[asset label]'));lines.push('   Current note: '+(r.who||'[not listed]'));lines.push('   Last checked: '+(r.checked||'[not listed]'));lines.push('   Next action: '+(r.next||'[not listed]'));}}); if(notes&&notes.value.trim()){lines.push('');lines.push('Notes:');lines.push(notes.value.trim());} if(output)output.textContent=lines.join('\n');}
  const add=app.querySelector('[data-add-beneficiary-row]'); if(add)add.addEventListener('click',()=>{const data=collect();data.rows.push(blank());localStorage.setItem(key,JSON.stringify(data));renderRows(data);});
  const copy=app.querySelector('[data-copy-beneficiary]'); if(copy)copy.addEventListener('click',async()=>{renderOutput();try{await navigator.clipboard.writeText(output.textContent);copy.textContent='Copied list';setTimeout(()=>copy.textContent='Copy review list',1800);}catch(e){alert('Copy failed. You can select the text manually.');}});
  const reset=app.querySelector('[data-reset-beneficiary]'); if(reset)reset.addEventListener('click',()=>{if(confirm('Reset beneficiary review rows in this browser?')){localStorage.removeItem(key);renderRows(load());}});
  if(notes)notes.addEventListener('input',save);
  renderRows(load());
})();

(function(){
  const app=document.querySelector('[data-binder-app]');
  if(!app) return;
  const key='willchecklist.binderIndex.v1';
  const boxes=Array.from(app.querySelectorAll('[data-binder-section]'));
  const fields=Array.from(app.querySelectorAll('[data-binder-field]'));
  const notes=app.querySelector('[data-binder-notes]');
  const pct=app.querySelector('[data-binder-percent]');
  const count=app.querySelector('[data-binder-count]');
  const bar=app.querySelector('[data-binder-bar]');
  const out=app.querySelector('[data-binder-output]');
  function load(){try{return JSON.parse(localStorage.getItem(key)||'{}');}catch(e){return{};}}
  function save(){const data={checked:boxes.map(b=>b.checked),notes:notes?notes.value:''};fields.forEach(f=>data[f.id]=f.value);localStorage.setItem(key,JSON.stringify(data));render();}
  function hydrate(){const d=load();if(Array.isArray(d.checked))boxes.forEach((b,i)=>b.checked=!!d.checked[i]);fields.forEach(f=>{if(d[f.id])f.value=d[f.id];});if(notes&&d.notes)notes.value=d.notes;render();}
  function value(id){const el=app.querySelector('#'+id);return el?el.value.trim():'';}
  function text(){const selected=boxes.filter(b=>b.checked).map(b=>b.value);const lines=['Estate binder index','Educational organizer only - not legal advice. Do not include passwords or sensitive numbers.',''];lines.push('Binder label: '+(value('binder-owner')||'[not listed]'));lines.push('Storage location: '+(value('binder-location')||'[not listed]'));lines.push('Trusted person: '+(value('binder-contact')||'[not listed]'));lines.push('Next review: '+(value('binder-review')||'[not listed]'));lines.push('');lines.push('Sections:');if(selected.length){selected.forEach((s,i)=>lines.push((i+1)+'. '+s));}else{lines.push('[No sections selected yet]');}if(notes&&notes.value.trim()){lines.push('');lines.push('Notes:');lines.push(notes.value.trim());}return lines.join('\n');}
  function render(){const selected=boxes.filter(b=>b.checked).length;const p=Math.round(selected/boxes.length*100);if(pct)pct.textContent=p+'%';if(count)count.textContent=selected+' sections selected';if(bar)bar.style.width=p+'%';if(out)out.textContent=text();}
  boxes.forEach(b=>b.addEventListener('change',save));fields.forEach(f=>f.addEventListener('input',save));if(notes)notes.addEventListener('input',save);
  const copy=app.querySelector('[data-copy-binder]');if(copy)copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text());copy.textContent='Copied index';setTimeout(()=>copy.textContent='Copy binder index',1800);}catch(e){alert('Copy failed. You can select the text manually.');}});
  const reset=app.querySelector('[data-reset-binder]');if(reset)reset.addEventListener('click',()=>{if(confirm('Reset estate binder index in this browser?')){localStorage.removeItem(key);boxes.forEach(b=>b.checked=false);fields.forEach(f=>f.value='');if(notes)notes.value='';render();}});
  hydrate();
})();


/* V8: guided next-step engine shared by Guided Flow and Dashboard */
(function(){
  const root=document.querySelector('[data-flow-app]');
  const flowCards=Array.from(document.querySelectorAll('[data-flow-card]'));
  if(!root && !flowCards.length) return;
  const defs=[
    {id:'start',name:'Start Here assessment',key:'willchecklist.startHere.v1',type:'fields',href:'start-here.html',cta:'Answer the Start Here assessment'},
    {id:'readiness',name:'Readiness scorecard',key:'willchecklist.readiness.v1',type:'checkedArray',completeAt:10,href:'readiness-scorecard.html',cta:'Check your readiness score'},
    {id:'checklist',name:'Interactive will checklist',key:'willchecklist.interactive.v1',type:'checklist',href:'interactive-will-checklist.html',cta:'Complete the main checklist'},
    {id:'beneficiaryReview',name:'Beneficiary review worksheet',key:'willchecklist.beneficiaryReview.v1',type:'beneficiaryRows',href:'beneficiary-review-worksheet.html',cta:'Review beneficiary designations'},
    {id:'locator',name:'Document locator',key:'willchecklist.locator.v1',type:'fields',href:'document-locator.html',cta:'Create your document locator'},
    {id:'binder',name:'Estate binder index',key:'willchecklist.binderIndex.v1',type:'checkedArray',completeAt:8,href:'estate-binder-index.html',cta:'Build your estate binder index'},
    {id:'summary',name:'Planning summary builder',key:'willchecklist.summaryBuilder.v1',type:'fields',href:'planning-summary-builder.html',cta:'Build your planning summary'},
    {id:'final',name:'Final review checklist',key:'willchecklist.finalReview.v1',type:'plan',href:'final-review-checklist.html',cta:'Run the final review'},
    {id:'decision',name:'Will-making path helper',key:'willchecklist.decision.v1',type:'decision',href:'will-maker-decision-helper.html',cta:'Choose your will-making path'}
  ];
  function parse(key){try{return JSON.parse(localStorage.getItem(key)||'null');}catch(e){return null;}}
  function st(def){
    const d=parse(def.key); if(!d) return {state:'none',detail:'Not started yet.'};
    if(def.type==='checklist'){const checked=d.checked?Object.values(d.checked).filter(Boolean).length:0; const notes=!!(d.notes&&d.notes.trim()); if(!checked&&!notes)return {state:'none',detail:'Not started yet.'}; return {state:checked>=18?'complete':'started',detail:checked+' checklist items checked.'};}
    if(def.type==='plan'){const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0; const notes=!!(d.notes&&d.notes.trim()); if(!checked&&!notes)return {state:'none',detail:'Not started yet.'}; return {state:checked>=14?'complete':'started',detail:checked+' tasks checked.'};}
    if(def.type==='decision'){const checked=Array.isArray(d)?d.filter(Boolean).length:0; if(!checked)return {state:'none',detail:'Not started yet.'}; return {state:'started',detail:checked+' decision factors selected.'};}
    if(def.type==='checkedArray'){const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0; const notes=!!(d.notes&&d.notes.trim()); if(!checked&&!notes)return {state:'none',detail:'Not started yet.'}; return {state:checked>=Number(def.completeAt||8)?'complete':'started',detail:checked+' items selected.'};}
    if(def.type==='beneficiaryRows'){const rows=Array.isArray(d.rows)?d.rows:[]; const filled=rows.filter(r=>r && Object.values(r).some(v=>String(v||'').trim())).length; const notes=!!(d.notes&&d.notes.trim()); if(!filled&&!notes)return {state:'none',detail:'Not started yet.'}; return {state:filled>=3?'complete':'started',detail:filled+' review rows saved.'};}
    if(def.type==='fields'){const values=d&&typeof d==='object'?Object.values(d).filter(v=>String(v||'').trim()).length:0; if(!values)return {state:'none',detail:'Not started yet.'}; return {state:values>=5?'complete':'started',detail:values+' fields filled.'};}
    return {state:'none',detail:'Not started yet.'};
  }
  function render(){
    let started=0, complete=0, next=null;
    defs.forEach(def=>{const s=st(def); if(s.state!=='none')started++; if(s.state==='complete')complete++; if(!next && s.state!=='complete') next=def; const card=document.querySelector('[data-flow-card="'+def.id+'"]'); if(card){card.classList.remove('started','complete'); if(s.state!=='none')card.classList.add(s.state); const p=card.querySelector('[data-flow-status]'); if(p)p.textContent=s.detail;}});
    if(!next) next={href:'planning-dashboard.html',cta:'Review your completed dashboard',name:'Dashboard'};
    const pct=Math.round(started/defs.length*100);
    document.querySelectorAll('[data-flow-bar]').forEach(el=>el.style.width=pct+'%');
    document.querySelectorAll('[data-flow-count]').forEach(el=>el.textContent=started+' of '+defs.length+' guided steps started');
    document.querySelectorAll('[data-next-step-text]').forEach(el=>el.textContent=complete>=defs.length?'You have touched every guided step.':'Next: '+next.cta+'.');
    document.querySelectorAll('[data-next-step-detail]').forEach(el=>el.textContent=complete>=defs.length?'Use the final review, print/download what you need, and bring questions to a qualified source.':'Open this step, read the short instructions, save only safe labels/locations, then return here.');
    document.querySelectorAll('[data-next-step-link]').forEach(el=>{el.setAttribute('href',next.href); el.textContent=complete>=defs.length?'Open dashboard':'Open next step';});
  }
  render();
})();

/* V8: sensitive-input guardrail. It warns users before they save risky private details. */
(function(){
  const risky=[
    {re:/\b\d{3}-\d{2}-\d{4}\b/,msg:'This looks like a Social Security number. Please remove it and use a general label instead.'},
    {re:/\b(?:\d[ -]*?){13,19}\b/,msg:'This looks like a long account or card number. Please use a label, not the number.'},
    {re:/\b(password|passcode|pin code|access code|seed phrase|private key|recovery phrase)\b/i,msg:'Please do not save passwords, PINs, seed phrases, private keys, or access codes here.'}
  ];
  let toastTimer=null;
  function showToast(msg){let t=document.querySelector('.privacy-toast'); if(!t){t=document.createElement('div'); t.className='privacy-toast'; t.setAttribute('role','status'); document.body.appendChild(t);} t.innerHTML='<strong>Privacy check:</strong> '+msg; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{if(t)t.remove();},5200);}
  function warn(el,msg){el.classList.add('field-risk'); let w=el.nextElementSibling; if(!w || !w.classList || !w.classList.contains('privacy-warning')){w=document.createElement('span'); w.className='privacy-warning'; el.insertAdjacentElement('afterend',w);} w.textContent=msg; showToast(msg);}
  function clear(el){el.classList.remove('field-risk'); const w=el.nextElementSibling; if(w && w.classList && w.classList.contains('privacy-warning')) w.remove();}
  document.addEventListener('input',function(e){const el=e.target; if(!el || !('value' in el)) return; if(el.type==='email' || el.type==='url' || el.type==='search') return; const val=String(el.value||''); const hit=risky.find(r=>r.re.test(val)); if(hit) warn(el,hit.msg); else clear(el);});
})();

/* V8: highlight current nav item */
(function(){
  const here=(location.pathname.split('/').pop()||'index.html');
  document.querySelectorAll('.nav-links a').forEach(a=>{const href=a.getAttribute('href')||''; if(href.split('/').pop()===here){a.setAttribute('aria-current','page');}});
})();


// V9: always-available help panel and safer field examples
(function(){
  if(document.querySelector('.helper-launch')) return;
  const isPage = location.pathname.includes('/pages/');
  const base = isPage ? '' : 'pages/';
  const root = isPage ? '../' : '';
  const panel = document.createElement('aside');
  panel.className = 'helper-panel';
  panel.setAttribute('aria-label','Quick help');
  panel.innerHTML = '<button class="close-helper" type="button" aria-label="Close help">×</button><h2>Need help?</h2><p>This site works best one step at a time. You do not need to use every tool.</p><div class="helper-panel-actions"><a class="btn small" href="'+base+'onboarding-wizard.html">Start Step 1</a><a class="btn small secondary" href="'+base+'quick-start-guide.html">Quick start</a></div><ul class="mini-list"><li>Use general labels and locations.</li><li>Do not type passwords, SSNs, full account numbers, private keys, seed phrases, or access codes.</li><li>If a question does not apply, skip it.</li><li>This site organizes notes; it does not create a legal document.</li></ul><p><a href="'+base+'safe-input-examples.html">See safe input examples</a></p>';
  const btn = document.createElement('button');
  btn.className = 'helper-launch';
  btn.type = 'button';
  btn.setAttribute('aria-expanded','false');
  btn.textContent = 'Help';
  document.body.appendChild(btn);
  document.body.appendChild(panel);
  function setOpen(open){ panel.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); }
  btn.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  panel.querySelector('.close-helper').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') setOpen(false); });
})();

(function(){
  const skipTypes = new Set(['email','hidden','checkbox','radio','submit','button','reset','file','password','url','tel']);
  const fields = Array.from(document.querySelectorAll('textarea,input,select')).filter(el => {
    if(el.closest('.helper-panel')) return false;
    if(el.tagName === 'SELECT') return false;
    const type = (el.getAttribute('type') || 'text').toLowerCase();
    return !skipTypes.has(type) && !el.dataset.noHelper;
  });
  function labelText(el){
    if(el.id){ const lab=document.querySelector('label[for="'+CSS.escape(el.id)+'"]'); if(lab) return lab.textContent.toLowerCase(); }
    const parent=el.closest('label'); return parent ? parent.textContent.toLowerCase() : ((el.name||'') + ' ' + (el.id||'')).toLowerCase();
  }
  function helperFor(el){
    const t=labelText(el);
    if(t.includes('password') || t.includes('code') || t.includes('pin')) return '<strong>Do not enter secrets.</strong> Use “instructions stored separately” instead of actual access details.';
    if(t.includes('account') || t.includes('policy') || t.includes('beneficiary')) return '<strong>Safe example:</strong> “life insurance policy — verify with provider.” Do not enter account or policy numbers.';
    if(t.includes('location') || t.includes('stored') || t.includes('where')) return '<strong>Safe example:</strong> “fireproof box in office closet.” Do not enter safe codes or alarm codes.';
    if(t.includes('note') || t.includes('question') || el.tagName === 'TEXTAREA') return '<strong>Tip:</strong> write general notes or questions. Avoid confidential legal strategy, SSNs, full account numbers, passwords, and private keys.';
    return '<strong>Tip:</strong> use a broad label, not private numbers or access details.';
  }
  fields.forEach((el, idx) => {
    if(el.nextElementSibling && el.nextElementSibling.classList && el.nextElementSibling.classList.contains('field-helper')) return;
    if(!el.getAttribute('placeholder')){
      const t=labelText(el);
      if(t.includes('location')) el.setAttribute('placeholder','Example: Fireproof box in office closet');
      else if(t.includes('account')) el.setAttribute('placeholder','Example: Checking account at my bank');
      else if(t.includes('question')) el.setAttribute('placeholder','Example: Ask whether this needs professional review');
      else if(el.tagName === 'TEXTAREA') el.setAttribute('placeholder','Use general labels and questions only — no passwords, SSNs, full account numbers, or access codes.');
    }
    const id = el.id || ('field-helper-input-'+idx);
    if(!el.id) el.id = id;
    const hint = document.createElement('p');
    hint.className = 'field-helper';
    hint.id = id + '-hint';
    hint.innerHTML = helperFor(el);
    el.insertAdjacentElement('afterend', hint);
    const described = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if(!described.includes(hint.id)){ described.push(hint.id); el.setAttribute('aria-describedby', described.join(' ')); }
  });
})();

(function(){
  const main = document.getElementById('main');
  if(!main || document.querySelector('.page-purpose')) return;
  const title = (document.querySelector('h1') || {}).textContent || '';
  let message = '';
  if(/checklist/i.test(title)) message = 'Check items that apply, skip what does not apply, and use notes for questions rather than private numbers.';
  else if(/locator|binder/i.test(title)) message = 'Record where documents are stored. Do not type codes, passwords, account numbers, private keys, or seed phrases.';
  else if(/summary|brief|meeting|conversation/i.test(title)) message = 'Create a high-level summary or draft. Keep sensitive details out and bring private records directly to a qualified professional.';
  else if(/dashboard|guided|start/i.test(title)) message = 'Use this page to find your next step. You can always return here if you feel lost.';
  if(!message) return;
  const box = document.createElement('div');
  box.className = 'container page-purpose';
  box.innerHTML = '<strong>How to use this page:</strong> ' + message;
  const hero = main.querySelector('.page-hero');
  if(hero && hero.nextSibling) hero.insertAdjacentElement('afterend', box);
})();


// V53: one-question safety setup with direct checklist start.
(function(){
  const form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const key=form.getAttribute('data-save-key') || 'wc_onboarding_wizard_v1';
  const steps=Array.from(form.querySelectorAll('.wizard-step'));
  const nextBtn=form.querySelector('[data-wizard-next]');
  const backBtn=form.querySelector('[data-wizard-back]');
  const count=form.querySelector('[data-wizard-count]');
  const bar=form.querySelector('[data-wizard-progress]');
  const gateNote=document.querySelector('[data-wizard-gate-note]');
  const result=document.querySelector('[data-wizard-result]');
  const resultTitle=document.querySelector('[data-wizard-result-title]');
  const resultText=document.querySelector('[data-wizard-result-text]');
  const resultLink=document.querySelector('[data-wizard-primary]');
  const summary=document.querySelector('[data-wizard-answer-summary]');
  const restart=document.querySelector('[data-wizard-restart]');
  let step=0;
  const labels={
    goal:{start:'start from scratch',organize:'organize notes I already have',documents:'record document locations',people:'review names, roles, or beneficiaries'},
    for_whom:{me:'myself or my spouse/partner',parent:'a parent or older family member',executor:'someone who may need to help later',unsure:'not sure yet'},
    complexity:{none:'nothing complicated that I know of',children:'minor children, dependents, or guardian questions',family:'family disagreement, blended-family, or sensitive family issues',property:'business, out-of-state property, trust, tax, or special asset questions',unsure:'not sure'},
    safety_rule:{safe:'safe example selected'}
  };
  function data(){ const out={}; new FormData(form).forEach((v,k)=>out[k]=v); return out; }
  function save(){ try{localStorage.setItem(key, JSON.stringify({answers:data(), updated:new Date().toISOString()}));}catch(e){} }
  function restore(){ try{ const saved=JSON.parse(localStorage.getItem(key)||'null'); if(!saved||!saved.answers) return; Object.entries(saved.answers).forEach(([k,v])=>{ const el=form.querySelector('[name="'+CSS.escape(k)+'"][value="'+CSS.escape(v)+'"]'); if(el) el.checked=true; }); }catch(e){} }
  function current(){ return steps[step] || steps[0]; }
  function selectedCurrent(){
    const field=current();
    const radios=Array.from(field.querySelectorAll('input[type="radio"]'));
    if(!radios.length) return true;
    const names=[...new Set(radios.map(i=>i.name))];
    const answered=names.every(name=>!!field.querySelector('[name="'+CSS.escape(name)+'"]:checked'));
    if(!answered) return false;
    if(field.hasAttribute('data-requires-safe-answer')) return !!field.querySelector('input[data-safe-answer="true"]:checked');
    return true;
  }
  function unsafeChosen(){
    const field=current();
    return !!field.querySelector('input[data-unsafe-answer="true"]:checked');
  }
  function syncGate(){
    const ok=selectedCurrent();
    if(nextBtn){
      nextBtn.disabled=!ok;
      nextBtn.setAttribute('aria-disabled', String(!ok));
      if(!ok) nextBtn.setAttribute('title', unsafeChosen() ? 'Choose the safe example to continue.' : 'Choose one answer to continue.');
      else nextBtn.removeAttribute('title');
    }
    if(gateNote){
      gateNote.textContent = ok ? (steps.length === 1 ? 'Ready to start the checklist.' : 'Ready for the next question.') : (unsafeChosen() ? 'Choose the safe example to continue.' : 'Choose one answer to continue.');
      gateNote.classList.toggle('warning-text', unsafeChosen() && !ok);
    }
    if(backBtn) backBtn.hidden=step===0;
  }
  function show(){
    steps.forEach((s,i)=>s.hidden=i!==step);
    if(count) count.textContent='Question '+(step+1)+' of '+steps.length;
    if(bar) bar.style.width=Math.round(((step+1)/steps.length)*100)+'%';
    if(backBtn) backBtn.disabled=step===0;
    if(nextBtn) nextBtn.textContent=steps.length===1?'Start checklist':(step===steps.length-1?'Finish setup':'Next question');
    syncGate();
  }
  function line(mapName, value){ return (labels[mapName] && labels[mapName][value]) || value || 'not answered'; }
  function recommend(){
    const d=data();
    const rec={title:'Safety setup complete', text:'Next, use the checklist. Keep notes limited to names, labels, and general locations.', href:'interactive-will-checklist.html'};
    try{ localStorage.setItem('wc_wizard_recommendation_v1', JSON.stringify({answers:d, next:rec})); }catch(e){}
    if(resultTitle) resultTitle.textContent=rec.title;
    if(resultText) resultText.textContent=rec.text;
    if(summary){
      summary.innerHTML='<h3>Saved</h3><ul class="mini-list"><li>Safety rule confirmed: use general labels and locations only.</li></ul><p class="muted">Next, check what applies and skip what does not.</p>';
    }
    if(resultLink){
      resultLink.href=rec.href;
      resultLink.textContent='Next: Checklist';
      resultLink.setAttribute('data-v21-save-step','wizard');
      resultLink.setAttribute('data-v21-save-href','onboarding-wizard.html');
    }
    if(bar) bar.style.width='100%';
    if(result) result.hidden=false;
    form.hidden=true;
    if(result) result.scrollIntoView({behavior:'smooth',block:'start'});
  }
  restore(); show();
  form.addEventListener('change', function(){ save(); syncGate(); });
  if(nextBtn) nextBtn.addEventListener('click',()=>{ if(!selectedCurrent()){ const first=current().querySelector('input'); if(first) first.focus(); syncGate(); return; } save(); if(step<steps.length-1){step++; show();} else {recommend();} });
  if(backBtn) backBtn.addEventListener('click',()=>{ if(step>0){step--; show();} });
  if(restart) restart.addEventListener('click',()=>{ try{localStorage.removeItem(key);localStorage.removeItem('wc_wizard_recommendation_v1');}catch(e){} form.reset(); step=0; form.hidden=false; if(result) result.hidden=true; show(); form.scrollIntoView({behavior:'smooth',block:'start'}); });
})();

// V11: shared progress model, one-click Continue page, and next-step cards.
(function(){
  const steps=[
    {id:'wizard',name:'Safety Setup',key:'wc_onboarding_wizard_v1',type:'wizard',href:'onboarding-wizard.html',cta:'Start Step 1',why:'Confirm the safe-note rule before using the checklist.'},
    {id:'start',name:'Start Here Assessment',key:'willchecklist.startHere.v1',type:'fields',href:'start-here.html',cta:'Answer Start Here',why:'Choose the right planning path without reading every article first.'},
    {id:'readiness',name:'Readiness Scorecard',key:'willchecklist.readiness.v1',type:'checkedArray',completeAt:10,href:'readiness-scorecard.html',cta:'Check readiness',why:'See what is organized and what needs attention.'},
    {id:'checklist',name:'Interactive Will Checklist',key:'willchecklist.interactive.v1',type:'checklist',href:'interactive-will-checklist.html',cta:'Complete main checklist',why:'Collect people, asset, role, document, and question notes in one place.'},
    {id:'locator',name:'Document Locator',key:'willchecklist.locator.v1',type:'fields',href:'document-locator.html',cta:'Create document locator',why:'Record where documents are stored without typing access codes or private numbers.'},
    {id:'beneficiaryReview',name:'Beneficiary Review',key:'willchecklist.beneficiaryReview.v1',type:'beneficiaryRows',href:'beneficiary-review-worksheet.html',cta:'Review beneficiaries',why:'List which beneficiary designations should be verified directly with providers.'},
    {id:'binder',name:'Estate Binder Index',key:'willchecklist.binderIndex.v1',type:'checkedArray',completeAt:8,href:'estate-binder-index.html',cta:'Build binder index',why:'Create a clear table of contents for your physical or digital estate binder.'},
    {id:'summary',name:'Planning Summary Builder',key:'willchecklist.summaryBuilder.v1',type:'fields',href:'planning-summary-builder.html',cta:'Build planning summary',why:'Create a high-level brief you can print or copy.'},
    {id:'final',name:'Final Review Checklist',key:'willchecklist.finalReview.v1',type:'plan',href:'final-review-checklist.html',cta:'Run final review',why:'Check for common gaps before you rely on your packet.'},
    {id:'decision',name:'Will-Making Path Helper',key:'willchecklist.decision.v1',type:'decision',href:'will-maker-decision-helper.html',cta:'Choose will-making path',why:'Compare attorney-first, hybrid, online, and official-resource paths safely.'},
    {id:'review',name:'Annual Review Planner',key:'willchecklist.annualReview.v1',type:'fields',href:'annual-review-planner.html',cta:'Set annual review plan',why:'Pick when to review your packet again after major life changes.'}
  ];
  function parse(key){try{return JSON.parse(localStorage.getItem(key)||'null');}catch(e){return null;}}
  function state(def){
    const d=parse(def.key); if(!d) return 'none';
    if(def.type==='wizard'){return d.answers&&d.answers.safety_rule==='safe'?'complete':(d.answers?'started':'none');}
    if(def.type==='checklist'){const checked=d.checked?Object.values(d.checked).filter(Boolean).length:0; const notes=!!(d.notes&&String(d.notes).trim()); if(!checked&&!notes)return'none'; return checked>=18?'complete':'started';}
    if(def.type==='plan'){const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0; const notes=!!(d.notes&&String(d.notes).trim()); if(!checked&&!notes)return'none'; return checked>=14?'complete':'started';}
    if(def.type==='decision'){const checked=Array.isArray(d)?d.filter(Boolean).length:0; return checked? 'started':'none';}
    if(def.type==='checkedArray'){const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0; const notes=!!(d.notes&&String(d.notes).trim()); if(!checked&&!notes)return'none'; return checked>=(def.completeAt||8)?'complete':'started';}
    if(def.type==='beneficiaryRows'){const rows=Array.isArray(d.rows)?d.rows:[]; const filled=rows.filter(r=>r&&Object.values(r).some(v=>String(v||'').trim())).length; const notes=!!(d.notes&&String(d.notes).trim()); if(!filled&&!notes)return'none'; return filled>=3?'complete':'started';}
    if(def.type==='fields'){const values=d&&typeof d==='object'?Object.values(d).filter(v=>String(v||'').trim()).length:0; return values>=5?'complete':(values?'started':'none');}
    return 'none';
  }
  function currentFile(){return location.pathname.split('/').pop()||'index.html';}
  function pageHref(href){const inPages=location.pathname.includes('/pages/'); return inPages?href:'pages/'+href;}
  function snapshot(){const items=steps.map(s=>Object.assign({},s,{state:state(s)})); const started=items.filter(i=>i.state!=='none').length; const complete=items.filter(i=>i.state==='complete').length; let next=items.find(i=>i.state==='none')||items.find(i=>i.state==='started')||items[items.length-1]; const here=currentFile(); const idx=items.findIndex(i=>i.href===here); if(idx>=0){ next=items.slice(idx+1).find(i=>i.state!=='complete') || items.find(i=>i.state==='none') || items.find(i=>i.state==='started') || items[items.length-1]; } return {items,started,complete,total:items.length,next,pct:Math.round((started/items.length)*100)};}
  function renderRouter(){const root=document.querySelector('[data-continue-router]'); if(!root)return; const s=snapshot(); const first=s.started===0; const next=first?steps[0]:s.next; const title=root.querySelector('[data-router-title]'); const text=root.querySelector('[data-router-text]'); const count=root.querySelector('[data-router-count]'); const bar=root.querySelector('[data-router-bar]'); const link=root.querySelector('[data-router-primary]'); if(title) title.textContent=first?'Start with the setup.':'Next: '+next.name; if(text) text.textContent=first?'No saved progress was found in this browser. The setup is the easiest starting point.':next.why; if(count) count.textContent=s.started+' of '+s.total+' guided steps started'; if(bar) bar.style.width=s.pct+'%'; if(link){link.href=next.href; link.textContent=next.cta;}}
  function injectNextCard(){const main=document.getElementById('main'); if(!main||document.querySelector('[data-continue-router]'))return; const here=currentFile(); if(['index.html','about.html','contact.html','privacy.html','terms.html','disclosure.html','sitemap.html','editorial-policy.html','how-to-use.html','safe-input-examples.html','quick-start-guide.html'].includes(here))return; const s=snapshot(); const next=s.next; if(!next||next.href===here)return; const card=document.createElement('section'); card.className='container next-action-card'+(s.complete>=s.total?' complete':''); card.setAttribute('aria-label','Recommended next step'); card.innerHTML='<div><p class="eyebrow">Recommended next step</p><h2>'+ (s.complete>=s.total?'You have touched every guided step.':'Next: '+next.name) +'</h2><p>'+ (s.complete>=s.total?'Use the final review and dashboard to export, print, or revisit your plan.':next.why) +'</p><span class="resume-chip">'+s.started+' of '+s.total+' steps started</span></div><div class="action-stack"><a class="btn" href="'+pageHref(next.href)+'">'+(s.complete>=s.total?'Open finish page':next.cta)+'</a></div><div class="safety-line">Safety rule: use labels and locations only — no passwords, SSNs, full account numbers, private keys, seed phrases, or access codes.</div>'; main.appendChild(card);}
  renderRouter(); // V54: no global injected next card; the six-step flow has its own single next action.
})();

// V11 first-time welcome modal disabled in V12 to keep the interface calm and clean.
(function(){ return; })();

// V11: better fallback for forms that still use placeholder endpoints.
(function(){
  document.querySelectorAll('form').forEach(form=>{
    const action=form.getAttribute('action')||''; if(!/PLACEHOLDER/.test(action)) return;
    if(form.querySelector('.placeholder-fallback')) return;
    const isLead=/LEAD_FORM/.test(action); const inPages=location.pathname.includes('/pages/'); const pdf=inPages?'../assets/downloads/will-preparation-packet.pdf':'assets/downloads/will-preparation-packet.pdf'; const fallback=document.createElement('div'); fallback.className='placeholder-fallback';
    fallback.innerHTML=isLead?'<strong>This form is not connected yet.</strong><p>For usability testing, use the site tools and copy/print your own notes. Do not submit confidential details here until a real form endpoint and privacy workflow are connected.</p>':'<strong>Email delivery is not connected yet.</strong><p>You can still use the site right now: download the PDF packet directly instead of waiting for an email.</p><a class="btn small secondary" href="'+pdf+'">Download PDF directly</a>';
    form.appendChild(fallback);
  });
})();


// V12: simplified helper copy and visible step completion guidance.
(function(){
  const launch=document.querySelector('.helper-launch');
  if(launch) launch.textContent='Help';
  const panel=document.querySelector('.helper-panel');
  if(panel){
    const isPage=location.pathname.includes('/pages/');
    const base=isPage?'':'pages/';
    panel.innerHTML='<button class="close-helper" type="button" aria-label="Close help">×</button><h2>Help</h2><p><strong>Use the site in this order:</strong> Start → Organize → Finish.</p><ul class="mini-list"><li>Skip questions that do not apply.</li><li>Use labels and locations only.</li><li>Never type passwords, SSNs, account numbers, safe codes, private keys, or seed phrases.</li></ul><div class="helper-panel-actions"><a class="btn small" href="'+base+'onboarding-wizard.html">Start</a><a class="btn small secondary" href="'+base+'continue-where-left-off.html">Continue</a></div>';
    const close=panel.querySelector('.close-helper');
    if(close) close.addEventListener('click',()=>panel.classList.remove('open'));
  }
  document.querySelectorAll('.wizard-step legend').forEach((legend)=>{
    if(!legend.querySelector('.plain-language-label')){
      const span=document.createElement('span');
      span.className='plain-language-label';
      span.textContent='Choose one answer. You can skip anything that does not apply.';
      legend.insertAdjacentElement('afterend',span);
    }
  });
})();


// V13: public-test mode and explicit done/next flow.
(function(){
  const pdf = location.pathname.includes('/pages/') ? '../assets/downloads/will-preparation-packet.pdf' : 'assets/downloads/will-preparation-packet.pdf';
  document.querySelectorAll('form').forEach(form => {
    const action = form.getAttribute('action') || '';
    if(!/PLACEHOLDER/.test(action)) return;
    form.classList.add('form-paused');
    form.setAttribute('aria-describedby', (form.getAttribute('aria-describedby') || '') + ' public-test-form-note');
    form.querySelectorAll('input, select, textarea').forEach(el => { el.disabled = true; });
    form.querySelectorAll('button[type="submit"]').forEach(btn => { btn.disabled = true; btn.textContent = /LEAD_FORM/.test(action) ? 'Form not connected yet' : 'Email not connected yet'; });
    if(!form.querySelector('.public-test-note')){
      const note = document.createElement('div');
      note.className = 'public-test-note';
      note.id = 'public-test-form-note';
      note.innerHTML = /LEAD_FORM/.test(action)
        ? '<strong>Public-test mode:</strong> this request form is intentionally disabled until a real endpoint and privacy process are connected. Use the tools, then copy or print your notes.'
        : '<strong>Public-test mode:</strong> email delivery is intentionally disabled for now. Download the PDF directly instead.' + ' <a href="'+pdf+'">Download PDF</a>';
      form.insertAdjacentElement('afterbegin', note);
    }
  });
})();

(function(){
  const flow=[
    {id:'wizard',name:'Safety Setup',href:'onboarding-wizard.html',cta:'Start Step 1',why:'Confirm the safe-note rule before using the checklist.'},
    {id:'checklist',name:'Main Checklist',href:'interactive-will-checklist.html',cta:'Open checklist',why:'Check off the core people, assets, documents, and questions.'},
    {id:'locator',name:'Document Locator',href:'document-locator.html',cta:'Open document locator',why:'Record where important documents are stored using labels and locations only.'},
    {id:'beneficiary',name:'Beneficiary Review',href:'beneficiary-review-worksheet.html',cta:'Review beneficiaries',why:'List which beneficiary designations should be verified directly with providers.'},
    {id:'binder',name:'Estate Binder Index',href:'estate-binder-index.html',cta:'Build binder index',why:'Create a table of contents for your paper or digital estate planning folder.'},
    {id:'summary',name:'Planning Summary',href:'planning-summary-builder.html',cta:'Build summary',why:'Create a high-level brief you can copy, print, or bring to a qualified professional.'},
    {id:'final',name:'Final Review',href:'final-review-checklist.html',cta:'Run final review',why:'Check for common gaps before you rely on your planning packet.'},
    {id:'dashboard',name:'Dashboard',href:'planning-dashboard.html',cta:'Open dashboard',why:'Review your progress and choose what to revisit.'}
  ];
  const manualKey='willchecklist.manualDone.v13';
  function readManual(){try{return JSON.parse(localStorage.getItem(manualKey)||'{}')||{};}catch(e){return {};}}
  function writeManual(obj){try{localStorage.setItem(manualKey, JSON.stringify(obj));}catch(e){}}
  function file(){return location.pathname.split('/').pop()||'index.html';}
  function inPages(){return location.pathname.includes('/pages/');}
  function hrefFor(h){return inPages()?h:'pages/'+h;}
  function isStarted(step){
    const done=readManual(); if(done[step.href]) return true;
    // Light-touch signals from existing localStorage keys. This avoids reading private content.
    const keys={
      'onboarding-wizard.html':'wc_onboarding_wizard_v1',
      'interactive-will-checklist.html':'willchecklist.interactive.v1',
      'document-locator.html':'willchecklist.locator.v1',
      'beneficiary-review-worksheet.html':'willchecklist.beneficiaryReview.v1',
      'estate-binder-index.html':'willchecklist.binderIndex.v1',
      'planning-summary-builder.html':'willchecklist.summaryBuilder.v1',
      'final-review-checklist.html':'willchecklist.finalReview.v1'
    };
    const k=keys[step.href]; if(!k) return false;
    try{const raw=localStorage.getItem(k); return !!(raw && raw !== '{}' && raw !== '[]' && raw !== 'null');}catch(e){return false;}
  }
  function snapshot(){const started=flow.filter(isStarted); const next=flow.find(s=>!isStarted(s)) || flow[flow.length-1]; return {started:started.length,total:flow.length,next,pct:Math.round((started.length/flow.length)*100)};}
  function updateRouter(){
    const root=document.querySelector('[data-continue-router]'); if(!root) return;
    const s=snapshot(); const first=s.started===0; const next=first?flow[0]:s.next;
    const title=root.querySelector('[data-router-title]'); if(title) title.textContent=first?'Start with the setup.':'Next: '+next.name;
    const text=root.querySelector('[data-router-text]'); if(text) text.textContent=first?'No saved progress was found in this browser. Start with the setup.':next.why;
    const count=root.querySelector('[data-router-count]'); if(count) count.textContent=s.started+' of '+s.total+' core steps started or marked done';
    const bar=root.querySelector('[data-router-bar]'); if(bar) bar.style.width=s.pct+'%';
    const link=root.querySelector('[data-router-primary]'); if(link){link.href=next.href; link.textContent=next.cta;}
  }
  function replaceNextCard(){
    const here=file(); const idx=flow.findIndex(s=>s.href===here); if(idx<0) return;
    const existing=document.querySelector('.next-action-card'); if(existing) existing.remove();
    const main=document.getElementById('main'); if(!main) return;
    const done=readManual(); const current=flow[idx]; const next=flow[idx+1] || flow[flow.length-1]; const marked=!!done[current.href];
    const card=document.createElement('section'); card.className='container next-action-card v13-next'+(marked?' complete':''); card.setAttribute('aria-label','Finish this step and continue');
    card.innerHTML='<div><p class="eyebrow">Finish this step</p><h2>'+(marked?'This step is marked done.':'When you are finished here, go to: '+next.name)+'</h2><p>'+next.why+'</p><div class="done-row"><button class="btn small secondary" type="button" data-mark-step-done>'+(marked?'Marked done':'Mark this step done')+'</button><span class="done-state">'+(marked?'Saved in this browser.':'Optional — helps Continue choose the next step.')+'</span></div></div><div class="action-stack"><a class="btn" href="'+hrefFor(next.href)+'">Next: '+next.name+'</a><a class="btn secondary" href="'+hrefFor('continue-where-left-off.html')+'">Continue page</a></div><div class="safety-line"><strong>Safety rule:</strong> use labels and locations only. Do not type passwords, SSNs, full account numbers, safe codes, seed phrases, private keys, or confidential legal details.</div>';
    main.appendChild(card);
    const btn=card.querySelector('[data-mark-step-done]');
    btn.addEventListener('click',()=>{const d=readManual(); d[current.href]=new Date().toISOString(); writeManual(d); card.classList.add('complete'); btn.textContent='Marked done'; const state=card.querySelector('.done-state'); if(state) state.textContent='Saved in this browser.'; updateRouter();});
  }
  updateRouter(); // V54: removed duplicate finish card injection.
})();


// V14: simpler six-step core path, manual done states, and one obvious next action.
(function(){
  const steps=[
    {id:'wizard',num:'1',name:'Safety Setup',href:'onboarding-wizard.html',cta:'Start Step 1',why:'Confirm the safe-note rule before using the checklist.',key:'wc_onboarding_wizard_v1'},
    {id:'checklist',num:'2',name:'Main Checklist',href:'interactive-will-checklist.html',cta:'Open main checklist',why:'Check the core people, assets, document, and question categories that apply to you.',key:'willchecklist.interactive.v1'},
    {id:'locator',num:'3',name:'Document Locator',href:'document-locator.html',cta:'Open document locator',why:'Record where important documents are stored using labels and locations only.',key:'willchecklist.locator.v1'},
    {id:'beneficiary',num:'4',name:'Beneficiary Review',href:'beneficiary-review-worksheet.html',cta:'Review beneficiaries',why:'List which beneficiary designations should be verified directly with providers.',key:'willchecklist.beneficiaryReview.v1'},
    {id:'summary',num:'5',name:'Planning Summary',href:'planning-summary-builder.html',cta:'Build planning summary',why:'Create a short high-level brief you can copy, print, or bring to a qualified professional.',key:'willchecklist.summaryBuilder.v1'},
    {id:'final',num:'6',name:'Final Review',href:'final-review-checklist.html',cta:'Run final review',why:'Check for gaps, unsafe details, and questions before you rely on your planning packet.',key:'willchecklist.finalReview.v1'}
  ];
  const manualKey='willchecklist.manualDone.v14';
  const oldManualKey='willchecklist.manualDone.v13';
  function pagesBase(){ return location.pathname.includes('/pages/') ? '' : 'pages/'; }
  function href(h){ return pagesBase()+h; }
  function here(){ return location.pathname.split('/').pop() || 'index.html'; }
  function read(key){ try{return JSON.parse(localStorage.getItem(key)||'null');}catch(e){return null;} }
  function manual(){
    try{ return Object.assign({}, JSON.parse(localStorage.getItem(oldManualKey)||'{}')||{}, JSON.parse(localStorage.getItem(manualKey)||'{}')||{}); }
    catch(e){ return {}; }
  }
  function writeManual(obj){ try{ localStorage.setItem(manualKey, JSON.stringify(obj)); }catch(e){} }
  function hasContentFor(step){
    if(manual()[step.href] || manual()[step.id]) return 'done';
    const raw=localStorage.getItem(step.key);
    if(!raw || raw==='{}' || raw==='[]' || raw==='null') return 'none';
    const d=read(step.key);
    if(!d) return 'none';
    if(step.id==='wizard'){
      return d.answers && d.answers.safety_rule==='safe' ? 'done' : 'started';
    }
    if(step.id==='checklist'){
      const checked=d.checked?Object.values(d.checked).filter(Boolean).length:0;
      const notes=!!(d.notes && String(d.notes).trim());
      if(!checked && !notes) return 'none';
      return checked>=18 ? 'done' : 'started';
    }
    if(step.id==='beneficiary'){
      const rows=Array.isArray(d.rows)?d.rows:[];
      const filled=rows.filter(r=>r && Object.values(r).some(v=>String(v||'').trim())).length;
      const notes=!!(d.notes && String(d.notes).trim());
      if(!filled && !notes) return 'none';
      return filled>=3 ? 'done' : 'started';
    }
    if(step.id==='final'){
      const checked=Array.isArray(d.checked)?d.checked.filter(Boolean).length:0;
      const notes=!!(d.notes && String(d.notes).trim());
      if(!checked && !notes) return 'none';
      return checked>=10 ? 'done' : 'started';
    }
    if(typeof d==='object'){
      const values=Object.values(d).filter(v=>String(v||'').trim()).length;
      if(!values) return 'none';
      return values>=4 ? 'done' : 'started';
    }
    return 'started';
  }
  function snap(){
    const items=steps.map(s=>Object.assign({},s,{state:hasContentFor(s)}));
    const done=items.filter(i=>i.state==='done').length;
    const started=items.filter(i=>i.state!=='none').length;
    const next=items.find(i=>i.state!=='done') || items[items.length-1];
    return {items, done, started, total:items.length, next, pct:Math.round((done/items.length)*100)};
  }
  function renderCore(){
    const s=snap();
    document.querySelectorAll('[data-v14-core-title]').forEach(el=>{ el.textContent = s.done>=s.total ? 'You finished the six steps.' : s.next.name==='Setup'?'Start with setup':'Next: '+s.next.name; });
    document.querySelectorAll('[data-v14-core-detail]').forEach(el=>{ el.textContent = s.done>=s.total ? 'Review the finish page for the three safest next actions.' : s.next.why; });
    document.querySelectorAll('[data-v14-core-count]').forEach(el=>{ el.textContent = s.done+' of '+s.total+' core steps done'; });
    document.querySelectorAll('[data-v14-core-bar]').forEach(el=>{ el.style.width=s.pct+'%'; });
    document.querySelectorAll('[data-v14-core-link]').forEach(el=>{ el.href=s.done>=s.total?href('done.html'):href(s.next.href); el.textContent=s.done>=s.total?'Open finish page':s.next.cta; });
    document.querySelectorAll('[data-v14-core-card]').forEach(card=>{
      const id=card.getAttribute('data-v14-core-card');
      const item=s.items.find(i=>i.id===id); if(!item) return;
      card.setAttribute('data-state', item.state==='done'?'done':(item.state==='started'?'started':'none'));
      const pill=card.querySelector('[data-v14-state]'); if(pill) pill.textContent=item.state==='done'?'Done':(item.state==='started'?'Started':'Not started');
    });
  }
  function buildList(container){
    if(!container) return;
    container.innerHTML=steps.map(st=>'<article class="v14-core-step" data-v14-core-card="'+st.id+'"><span class="num">'+st.num+'</span><div><h3>'+st.name+'</h3><p>'+st.why+'</p></div><span class="v14-state-pill" data-v14-state>Not started</span></article>').join('');
  }
  document.querySelectorAll('[data-v14-core-list]').forEach(buildList);
  document.querySelectorAll('[data-v14-mark-done]').forEach(btn=>{
    const id=btn.getAttribute('data-v14-mark-done');
    const step=steps.find(s=>s.id===id || s.href===id); if(!step) return;
    const stateEl=document.querySelector('[data-v14-done-state="'+step.id+'"]');
    if(hasContentFor(step)==='done'){
      btn.textContent='Marked done'; if(stateEl) stateEl.textContent='Saved in this browser.';
    }
    btn.addEventListener('click',()=>{
      const d=manual(); d[step.href]=new Date().toISOString(); d[step.id]=new Date().toISOString(); writeManual(d);
      btn.textContent='Marked done'; if(stateEl) stateEl.textContent='Saved in this browser.';
      const panel=btn.closest('.v14-next-panel'); if(panel) panel.classList.add('complete');
      renderCore();
    });
  });
  renderCore();
})();


// V16: simple stepper labels and one-action helpers.
(function(){
  const labels={setup:'Setup', checklist:'Checklist', locator:'Documents', beneficiaries:'Beneficiaries', summary:'Summary', final:'Final review'};
  document.querySelectorAll('[data-simple-current-step]').forEach(function(el){
    const id=el.getAttribute('data-simple-current-step');
    el.textContent=labels[id]||el.textContent;
  });
})();


// V17: clearer completion feedback for the simplified six-step path.
(function(){
  document.querySelectorAll('.v17-one-next').forEach(function(panel){
    var btn = panel.querySelector('[data-v14-mark-done]');
    var heading = panel.querySelector('h2');
    var state = panel.querySelector('.v14-done-state');
    var next = panel.querySelector('.v14-core-actions .btn');
    if(state) state.setAttribute('aria-live','polite');
    if(!btn) return;
    btn.addEventListener('click', function(){
      panel.classList.add('complete');
      if(state) state.textContent = 'Done — saved in this browser.';
      if(heading && next){
        var label = (next.textContent || '').replace(/^Next:\s*/,'').trim();
        heading.textContent = label ? 'Saved. Next: ' + label : 'Saved. Go to the next step.';
      }
      if(next) next.focus({preventScroll:true});
    });
  });
})();


// V20: keep the simplified flow calm and obvious.
(function(){
  document.querySelectorAll('.v20-clean-core .v14-next-panel').forEach(function(panel){
    var btn=panel.querySelector('[data-v14-mark-done]');
    var next=panel.querySelector('.v14-core-actions a.btn');
    var state=panel.querySelector('.v14-done-state');
    if(!btn || !next) return;
    btn.addEventListener('click', function(){
      btn.textContent='Done';
      if(state) state.textContent='Saved here.';
      next.classList.add('pulse-once');
    });
  });
})();


// V56: prevent accidental progress if a field contains private-looking information.
(function(){
  function showBlockMessage(msg){
    var box=document.querySelector('.v56-blocked-next');
    if(!box){box=document.createElement('div');box.className='v56-blocked-next';box.setAttribute('role','alert');document.body.appendChild(box);}
    box.textContent=msg;
    clearTimeout(window.__v56BlockTimer);
    window.__v56BlockTimer=setTimeout(function(){ if(box && box.parentNode) box.parentNode.removeChild(box); }, 5200);
  }
  document.addEventListener('click', function(e){
    var link=e.target.closest('[data-v21-save-step]');
    if(!link) return;
    var risk=document.querySelector('.field-risk');
    if(risk){
      e.preventDefault();
      e.stopImmediatePropagation();
      showBlockMessage('Remove private numbers, passwords, codes, or keys before continuing. You can leave the field blank.');
      try{ risk.focus({preventScroll:false}); }catch(err){ risk.focus(); }
    }
  }, true);
})();


// V21: primary next buttons mark the current simplified step as done before moving on.
(function(){
  const manualKey='willchecklist.manualDone.v14';
  function read(){ try{return JSON.parse(localStorage.getItem(manualKey)||'{}')||{};}catch(e){return{};} }
  function write(obj){ try{localStorage.setItem(manualKey, JSON.stringify(obj));}catch(e){} }
  document.addEventListener('click', function(e){
    const link=e.target.closest('[data-v21-save-step]');
    if(!link) return;
    const step=link.getAttribute('data-v21-save-step');
    const href=link.getAttribute('data-v21-save-href') || location.pathname.split('/').pop();
    const d=read();
    const when=new Date().toISOString();
    if(step) d[step]=when;
    if(href) d[href]=when;
    write(d);
    const panel=link.closest('.v14-next-panel');
    if(panel){
      panel.classList.add('complete');
      const state=panel.querySelector('.v14-done-state');
      if(state) state.textContent='Saved.';
      const btn=panel.querySelector('[data-v14-mark-done]');
      if(btn) btn.textContent='Saved';
    }
  }, true);
})();


// V22: one-button finish flow. The primary next button is the save action.
(function(){
  document.querySelectorAll('.v22-one-button-finish').forEach(function(panel){
    var link = panel.querySelector('[data-v21-save-step]');
    var state = panel.querySelector('.v14-done-state');
    if(!link) return;
    link.addEventListener('click', function(){
      panel.classList.add('complete');
      if(state) state.textContent = 'Saved. Moving to the next step.';
      link.textContent = 'Saved — opening next step';
    }, true);
  });
})();


// V23: mobile-only bottom next button for the six core steps.
(function(){
  if(!document.body.classList.contains('v23-ultra-simple-core')) return;
  if(document.querySelector('.v23-mobile-next')) return;
  var finish=document.querySelector('.v22-one-button-finish');
  if(!finish) return;
  var next=finish.querySelector('[data-v21-save-step]');
  if(!next) return;
  var stepText=document.querySelector('.page-hero .eyebrow');
  var bar=document.createElement('div');
  bar.className='v23-mobile-next';
  bar.setAttribute('aria-label','Next step');
  var info=document.createElement('div');
  info.innerHTML='<span>'+(stepText ? stepText.textContent.trim() : 'Current step')+'</span><strong>Ready when you are.</strong>';
  var link=document.createElement('a');
  link.className='btn small';
  link.href=next.getAttribute('href') || '#';
  link.textContent='Next';
  ['data-v21-save-step','data-v21-save-href'].forEach(function(attr){
    var val=next.getAttribute(attr);
    if(val) link.setAttribute(attr,val);
  });
  link.addEventListener('click', function(){
    link.textContent='Saved';
  }, true);
  bar.appendChild(info);
  bar.appendChild(link);
  document.body.appendChild(bar);
})();


// V26: misuse-resistant form polish for simple public testing.
(function(){
  const safePlaceholder = 'Example: blue folder in file cabinet (no numbers or passwords)';
  document.querySelectorAll('.v26-calm-core textarea:not([placeholder]), .v26-calm-core input[type="text"]:not([placeholder])').forEach(function(el){
    el.setAttribute('placeholder', safePlaceholder);
  });
  document.addEventListener('click', function(e){
    const risky = e.target.closest('[data-reset-checklist], [data-clear-dashboard], .danger-light');
    if(!risky) return;
    const ok = window.confirm('Clear saved progress on this page? This only affects this browser.');
    if(!ok) e.preventDefault();
  }, true);
  document.addEventListener('click', function(e){
    const next = e.target.closest('[data-v21-save-step]');
    if(!next) return;
    let toast = document.querySelector('.v26-completion-toast');
    if(!toast){
      toast = document.createElement('div');
      toast.className = 'v26-completion-toast';
      toast.setAttribute('role','status');
      toast.setAttribute('aria-live','polite');
      document.body.appendChild(toast);
    }
    toast.textContent = 'Saved in this browser.';
    window.setTimeout(function(){ if(toast) toast.remove(); }, 1600);
  }, true);
})();


// V27: finish-page polish and safer completed-state routing.
(function(){
  if(document.body.classList.contains('v27-finish-page')){
    try{
      var done=JSON.parse(localStorage.getItem('willchecklist.manualDone.v14')||'{}')||{};
      if(!done['final-review-checklist.html'] && !done.final){
        done['final-review-checklist.html']=new Date().toISOString();
        done.final=new Date().toISOString();
        localStorage.setItem('willchecklist.manualDone.v14', JSON.stringify(done));
      }
    }catch(e){}
  }
})();


// V28: simple completed step states in the six-step strip.
(function(){
  if(!document.body.classList.contains('v28-step-status')) return;
  const steps = [
    {id:'wizard', href:'onboarding-wizard.html', label:'Setup'},
    {id:'checklist', href:'interactive-will-checklist.html', label:'Checklist'},
    {id:'locator', href:'document-locator.html', label:'Documents'},
    {id:'beneficiary', href:'beneficiary-review-worksheet.html', label:'Beneficiaries'},
    {id:'summary', href:'planning-summary-builder.html', label:'Summary'},
    {id:'final', href:'final-review-checklist.html', label:'Final Review'}
  ];
  function readDone(){
    try { return JSON.parse(localStorage.getItem('willchecklist.manualDone.v14') || '{}') || {}; }
    catch(e){ return {}; }
  }
  function isDone(done, step){ return Boolean(done[step.id] || done[step.href]); }
  function refreshStepper(){
    const done = readDone();
    let count = 0;
    document.querySelectorAll('.simple-stepper .simple-step').forEach(function(link){
      const file = (link.getAttribute('href') || link.getAttribute('data-step-href') || '').split('/').pop();
      const step = steps.find(function(s){ return s.href === file; });
      if(!step) return;
      const completed = isDone(done, step);
      link.classList.toggle('done', completed);
      if(completed) count += 1;
      const bubble = link.querySelector('span');
      if(bubble){
        if(!bubble.dataset.originalStepNumber) bubble.dataset.originalStepNumber = bubble.textContent.trim();
        bubble.textContent = completed ? '✓' : bubble.dataset.originalStepNumber;
      }
      link.setAttribute('aria-label', step.label + (completed ? ' complete' : ' not complete'));
    });
    const current = steps.find(function(s){ return location.pathname.endsWith('/' + s.href); });
    const holder = document.querySelector('[data-v28-step-status]');
    if(holder) holder.textContent = count + ' of 6 steps saved in this browser.';
    if(current){
      document.querySelectorAll('.v14-done-state[data-v14-done-state="'+current.id+'"]').forEach(function(el){
        if(isDone(done, current)) el.textContent = 'Saved in this browser.';
      });
    }
  }
  document.querySelectorAll('.simple-stepper').forEach(function(stepper){
    if(stepper.parentNode && !stepper.parentNode.querySelector('[data-v28-step-status]')){
      const status = document.createElement('p');
      status.className = 'v28-step-status-line';
      status.setAttribute('data-v28-step-status','');
      status.setAttribute('aria-live','polite');
      stepper.insertAdjacentElement('afterend', status);
    }
  });
  refreshStepper();
  document.addEventListener('click', function(e){
    if(e.target.closest('[data-v21-save-step]')) setTimeout(refreshStepper, 25);
  }, true);
  window.addEventListener('storage', refreshStepper);
})();


// V41: Step 1 has one visible action at a time.
(function(){
  const form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const fallback=document.querySelector('.v41-setup-fallback-next');
  if(fallback) fallback.hidden=true;
})();


// V42/V45: setup wizard gate fallback. Keeps the Next button disabled until the current answer is valid.
(function(){
  const form = document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const next = form.querySelector('[data-wizard-next]');
  const back = form.querySelector('[data-wizard-back]');
  const note = document.querySelector('[data-wizard-gate-note]');
  const steps = Array.from(form.querySelectorAll('.wizard-step'));
  function currentStep(){ return steps.find(s => !s.hidden) || steps[0]; }
  function currentIndex(){ return Math.max(0, steps.indexOf(currentStep())); }
  function unsafeChosen(){ const step=currentStep(); return !!(step && step.querySelector('input[data-unsafe-answer="true"]:checked')); }
  function hasAnswer(){
    const step = currentStep();
    if(!step) return true;
    const radios = Array.from(step.querySelectorAll('input[type="radio"]'));
    if(!radios.length) return true;
    const names = Array.from(new Set(radios.map(r => r.name)));
    const answered = names.every(name => !!step.querySelector('input[name="'+CSS.escape(name)+'"]:checked'));
    if(!answered) return false;
    if(step.hasAttribute('data-requires-safe-answer')) return !!step.querySelector('input[data-safe-answer="true"]:checked');
    return true;
  }
  function syncWizardGate(){
    const answered = hasAnswer();
    if(next){
      next.disabled = !answered;
      next.setAttribute('aria-disabled', String(!answered));
      if(!answered) next.setAttribute('title', unsafeChosen() ? 'Choose the safe example to continue.' : 'Choose one answer to continue.');
      else next.removeAttribute('title');
    }
    if(note){
      note.textContent = answered ? 'Ready for the next question.' : (unsafeChosen() ? 'Choose the safe example to continue.' : 'Choose one answer to continue.');
      note.classList.toggle('warning-text', unsafeChosen() && !answered);
    }
    if(back){ back.hidden = currentIndex() === 0; }
  }
  form.addEventListener('change', syncWizardGate);
  if(next) next.addEventListener('click', function(){ setTimeout(syncWizardGate, 0); }, true);
  if(back) back.addEventListener('click', function(){ setTimeout(syncWizardGate, 0); }, true);
  setTimeout(syncWizardGate, 0);
})();

// V43: if a core step was already saved, say so without adding another control.
(function(){
  if(!document.body.classList.contains('v43-next-minimal')) return;
  var manualKey='willchecklist.manualDone.v14';
  function read(){ try{return JSON.parse(localStorage.getItem(manualKey)||'{}')||{};}catch(e){return{};} }
  var d=read();
  var file=location.pathname.split('/').pop();
  var panel=document.querySelector('.v22-one-button-finish');
  if(!panel) return;
  var link=panel.querySelector('[data-v21-save-step]');
  var state=panel.querySelector('.v14-done-state');
  var step=link ? link.getAttribute('data-v21-save-step') : '';
  if(state && ((step && d[step]) || d[file])) {
    panel.classList.add('complete');
    state.textContent='Already saved in this browser.';
  }
})();


// V44: keep selection feedback visible without adding new controls.
(function(){
  function syncOne(input){
    var host = input.closest('.choice-card') || input.closest('label');
    if(!host) return;
    host.classList.toggle('is-selected', !!input.checked);
  }
  function syncGroup(input){
    if(input.type === 'radio' && input.name){
      document.querySelectorAll('input[type="radio"][name="'+CSS.escape(input.name)+'"]').forEach(syncOne);
    } else {
      syncOne(input);
    }
  }
  document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(syncGroup);
  document.addEventListener('change', function(e){
    var input = e.target;
    if(!input || !input.matches || !input.matches('input[type="checkbox"], input[type="radio"]')) return;
    syncGroup(input);
  });
})();


// V46: setup answer hints, safer storage, and inline unsafe-answer feedback.
(function(){
  const form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const key=form.getAttribute('data-save-key') || 'wc_onboarding_wizard_v1';
  const next=form.querySelector('[data-wizard-next]');
  const note=document.querySelector('[data-wizard-gate-note]');
  function currentStep(){ return Array.from(form.querySelectorAll('.wizard-step')).find(s=>!s.hidden) || form.querySelector('.wizard-step'); }
  function selectedLabel(){ const checked=currentStep() && currentStep().querySelector('input[type="radio"]:checked'); return checked ? checked.closest('.choice-card') : null; }
  function scrubUnsafeStorage(){
    try{
      const saved=JSON.parse(localStorage.getItem(key)||'null');
      if(saved && saved.answers && saved.answers.safety_rule && saved.answers.safety_rule !== 'safe'){
        delete saved.answers.safety_rule;
        saved.updated=new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(saved));
      }
    }catch(e){}
  }
  function feedback(){
    const step=currentStep();
    if(!step) return;
    form.querySelectorAll('.choice-card').forEach(l=>l.classList.remove('is-unsafe-selected','is-safe-selected'));
    const label=selectedLabel();
    let box=step.querySelector('[data-wizard-safe-feedback]');
    const safe=!!(step.querySelector('input[data-safe-answer="true"]:checked'));
    const unsafe=!!(step.querySelector('input[data-unsafe-answer="true"]:checked'));
    if(label && safe) label.classList.add('is-safe-selected');
    if(label && unsafe) label.classList.add('is-unsafe-selected');
    if(step.hasAttribute('data-requires-safe-answer')){
      if(!box){ box=document.createElement('p'); box.className='wizard-safe-feedback'; box.setAttribute('data-wizard-safe-feedback',''); step.appendChild(box); }
      if(safe){ box.textContent='Good choice. This is a general location, not private information.'; box.classList.add('is-ok'); }
      else if(unsafe){ box.textContent='That example is not safe to enter. Choose the general location example instead.'; box.classList.remove('is-ok'); scrubUnsafeStorage(); }
      else { box.textContent='Choose the general location example to finish setup.'; box.classList.remove('is-ok'); }
    }
    if(next && unsafe){ next.disabled=true; next.setAttribute('aria-disabled','true'); }
    if(note && unsafe){ note.textContent='That example is not safe. Choose the general location example to continue.'; note.classList.add('warning-text'); }
  }
  form.addEventListener('change', function(){ setTimeout(feedback, 0); });
  if(next) next.addEventListener('click', function(){ setTimeout(feedback, 0); }, true);
  setTimeout(feedback, 0);
})();


// V49: safety-first setup note and gentler completion copy.
(function(){
  const form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const note=document.querySelector('[data-wizard-gate-note]');
  function sync(){
    const current=Array.from(form.querySelectorAll('.wizard-step')).find(s=>!s.hidden);
    if(!current || !note) return;
    if(current.hasAttribute('data-requires-safe-answer')){
      const safe=current.querySelector('input[data-safe-answer="true"]:checked');
      const unsafe=current.querySelector('input[data-unsafe-answer="true"]:checked');
      note.textContent = safe ? 'Good. That is safe to write here.' : (unsafe ? 'That is private. Choose the general location example.' : 'Choose the safe example to continue.');
    }
  }
  form.addEventListener('change', function(){ setTimeout(sync, 0); });
  setTimeout(sync, 0);
})();


// V50: four-question setup polish and simpler completion confidence.
(function(){
  const form=document.querySelector('[data-onboarding-wizard]');
  if(form){
    const steps=Array.from(form.querySelectorAll('.wizard-step'));
    const count=form.querySelector('[data-wizard-count]');
    const bar=form.querySelector('[data-wizard-progress]');
    function syncCount(){
      const current=steps.findIndex(s=>!s.hidden);
      const idx=current>=0?current:0;
      if(count) count.textContent='Question '+(idx+1)+' of '+steps.length;
      if(bar) bar.style.width=Math.round(((idx+1)/(Math.max(1,steps.length)))*100)+'%';
    }
    form.addEventListener('click', function(){ setTimeout(syncCount, 0); }, true);
    form.addEventListener('change', function(){
      const selected=Array.from(form.querySelectorAll('.wizard-step:not([hidden]) input[type="radio"]:checked'))[0];
      form.querySelectorAll('.wizard-step:not([hidden]) .v50-selected-answer').forEach(el=>el.remove());
      if(selected){
        const card=selected.closest('.choice-card');
        if(card && !selected.hasAttribute('data-unsafe-answer')){
          const msg=document.createElement('p');
          msg.className='v50-selected-answer';
          msg.textContent='Selected. Use Next question to continue.';
          card.appendChild(msg);
        }
      }
      setTimeout(syncCount, 0);
    });
    setTimeout(syncCount, 0);
  }
  document.querySelectorAll('.v14-next-panel[data-v50-applied!="true"]').forEach(function(panel){
    panel.setAttribute('data-v50-applied','true');
    const h=panel.querySelector('h2');
    const p=panel.querySelector('p');
    if(h && /Done with/.test(h.textContent)) h.textContent='Ready?';
    if(p && /This saves/.test(p.textContent)) p.textContent='This saves this step in your browser.';
  });
})();


// V51: make setup progress feel natural and keep focus on the next visible question.
(function(){
  const form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const steps=Array.from(form.querySelectorAll('.wizard-step'));
  const count=form.querySelector('[data-wizard-count]');
  const bar=form.querySelector('[data-wizard-progress]');
  function visibleIndex(){ return Math.max(0, steps.findIndex(s=>!s.hidden)); }
  function sync(){
    const idx=visibleIndex();
    if(count) count.textContent='Question '+(idx+1)+' of '+steps.length;
    if(bar) bar.style.width=Math.round(((idx+1)/Math.max(1,steps.length))*100)+'%';
  }
  function focusQuestion(){
    const current=steps[visibleIndex()];
    if(!current) return;
    const legend=current.querySelector('legend');
    if(legend){
      legend.setAttribute('tabindex','-1');
      try{ legend.focus({preventScroll:true}); }catch(e){}
    }
    current.scrollIntoView({behavior:'smooth', block:'start'});
  }
  form.addEventListener('click', function(e){
    if(e.target && (e.target.matches('[data-wizard-next]') || e.target.matches('[data-wizard-back]'))){
      setTimeout(function(){ sync(); focusQuestion(); }, 30);
    }
  }, true);
  form.addEventListener('change', sync);
  setTimeout(sync, 0);
})();


// V52: keep setup short. The wizard now has only the safety check and one extra-care flag.
(function(){
  const form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const steps=Array.from(form.querySelectorAll('.wizard-step'));
  const count=form.querySelector('[data-wizard-count]');
  const bar=form.querySelector('[data-wizard-progress]');
  function sync(){
    const idx=Math.max(0, steps.findIndex(s=>!s.hidden));
    if(count) count.textContent='Question '+(idx+1)+' of '+steps.length;
    if(bar) bar.style.width=Math.round(((idx+1)/Math.max(1,steps.length))*100)+'%';
  }
  form.addEventListener('change', function(){ setTimeout(sync,0); });
  form.addEventListener('click', function(e){ if(e.target && (e.target.matches('[data-wizard-next]') || e.target.matches('[data-wizard-back]'))) setTimeout(sync,30); }, true);
  setTimeout(sync,0);
})();


// V53: single safety-confirmation setup. Keep Step 1 as one quick gate, not a questionnaire.
(function(){
  const form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const steps=Array.from(form.querySelectorAll('.wizard-step'));
  const count=form.querySelector('[data-wizard-count]');
  const bar=form.querySelector('[data-wizard-progress]');
  const next=form.querySelector('[data-wizard-next]');
  const back=form.querySelector('[data-wizard-back]');
  const note=document.querySelector('[data-wizard-gate-note]');
  function sync(){
    if(count) count.textContent='Question 1 of 1';
    if(bar) bar.style.width='100%';
    if(next) next.textContent='Start checklist';
    if(back) back.hidden=true;
    const safe=!!form.querySelector('input[data-safe-answer="true"]:checked');
    const unsafe=!!form.querySelector('input[data-unsafe-answer="true"]:checked');
    if(note){
      note.textContent=safe?'Ready. Start the checklist.':(unsafe?'That example is private. Use general labels only.':'Check the confirmation above to start.');
      note.classList.toggle('warning-text', unsafe && !safe);
    }
  }
  form.addEventListener('change', sync);
  form.addEventListener('click', function(){ setTimeout(sync, 0); }, true);
  setTimeout(sync,0);
})();


// V54: remove legacy injected recommendation cards so each page has one clear next action.
(function(){
  document.querySelectorAll('.next-action-card, .v13-next').forEach(function(card){ card.remove(); });
  // Step 1 uses the wizard result as its next action; no extra fallback finish panel.
  if(location.pathname.endsWith('/onboarding-wizard.html')){
    document.querySelectorAll('.v41-setup-fallback-next, .v21-more-help.v22-quiet-help').forEach(function(el){ el.remove(); });
  }
})();


// V57: simple usability polish — clearer rows, calmer summaries, and one obvious focus.
(function(){
  document.querySelectorAll('.v57-simple-usability.simple-core-page main').forEach(function(main){
    var firstTask = main.querySelector('.builder-shell, .wizard-card, .beneficiary-app, .locator-app, .summary-builder-app, .final-review-app');
    if(firstTask && !firstTask.getAttribute('aria-label')) firstTask.setAttribute('aria-label','Current step task');
  });
  document.querySelectorAll('.v57-simple-usability .utility-drawer').forEach(function(d){
    var summary=d.querySelector('summary');
    if(summary && !summary.getAttribute('aria-label')) summary.setAttribute('aria-label','Optional tools: print, copy, or clear');
  });
})();


// V59: self-explaining status and mobile next labels.
(function(){
  if(!document.body.classList.contains('v59-self-explaining')) return;
  document.querySelectorAll('.v14-done-state').forEach(function(el){
    if((el.textContent || '').trim() === 'Not saved yet.') el.textContent = 'Saves when you continue.';
  });
  document.querySelectorAll('.v23-mobile-next .btn').forEach(function(btn){
    if((btn.textContent || '').trim() === 'Next') btn.textContent = 'Continue';
  });
  document.addEventListener('click', function(e){
    var link=e.target.closest('[data-v21-save-step]');
    if(!link) return;
    var state=(link.closest('.v14-next-panel')||document).querySelector('.v14-done-state');
    if(state) state.textContent='Saved in this browser.';
  }, true);
})();


// V60: make Step 1 a simple confirmation instead of a quiz.
(function(){
  if(!document.body.classList.contains('v60-guided-confirmation')) return;
  const form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  const next=form.querySelector('[data-wizard-next]');
  const note=document.querySelector('[data-wizard-gate-note]');
  const safe=form.querySelector('input[data-safe-answer="true"]');
  function sync(){
    if(next) next.textContent='Start checklist';
    if(note) note.textContent = safe && safe.checked ? 'Ready. Start the checklist.' : 'Check the confirmation above to start.';
  }
  if(safe) safe.addEventListener('change', sync);
  form.addEventListener('click', function(){ setTimeout(sync,0); }, true);
  setTimeout(sync,0);
})();


// V80: Step 1 is a direct confirmation. Hide the old result card and go straight to Step 2.
(function(){
  if(!document.body.classList.contains('v80-live-pages')) return;
  var form=document.querySelector('[data-onboarding-wizard]');
  if(!form) return;
  var result=document.querySelector('[data-wizard-result]');
  var next=form.querySelector('[data-wizard-next]');
  var note=document.querySelector('[data-wizard-gate-note]');
  var safe=form.querySelector('input[data-safe-answer="true"]');
  if(result) result.hidden=true;
  function sync(){
    var ok=!!(safe && safe.checked);
    if(next){
      next.textContent='Start checklist';
      next.disabled=!ok;
      next.setAttribute('aria-disabled', String(!ok));
    }
    if(note) note.textContent = ok ? 'Ready. Start the checklist.' : 'Check the box above to start.';
  }
  form.addEventListener('change', sync, true);
  if(next){
    next.addEventListener('click', function(e){
      if(!safe || !safe.checked){ sync(); return; }
      e.preventDefault();
      e.stopImmediatePropagation();
      try{
        localStorage.setItem('wc_onboarding_wizard_v1', JSON.stringify({answers:{safety_rule:'safe'}, updated:new Date().toISOString()}));
        localStorage.setItem('wc_wizard_recommendation_v1', JSON.stringify({answers:{safety_rule:'safe'}, next:{title:'Safety setup complete', text:'Next, use the checklist.', href:'interactive-will-checklist.html'}}));
      }catch(err){}
      window.location.href='interactive-will-checklist.html';
    }, true);
  }
  sync();
})();
