/* ============================================================
   NGUGI FAMILY PORTAL — Data Engine v3.0
   localStorage key: "ngugiFamily"
   All counts, balances and tiers computed live from data.
   ============================================================ */

const DB_KEY = 'ngugiFamily';

const SEED = {
  settings: {
    familyName:'Ngugi Family', slogan:'Pamoja Daima', foundingYear:1947,
    adminPin:'1234', mpesaTill:'', currency:'Ksh',
    g2Rate:200, adultRate:300, juniorRate:50, adultAge:18,
  },
  leadership:[
    {id:'l1',role:'Chairperson',      name:'',phone:''},
    {id:'l2',role:'Vice-Chairperson', name:'',phone:''},
    {id:'l3',role:'Secretary',        name:'',phone:''},
    {id:'l4',role:'Treasurer',        name:'',phone:''},
    {id:'l5',role:'Welfare Officer',  name:'',phone:''},
  ],
  members:[
    {id:'m0',  name:'Mzee Ngugi',   parentId:null, spouseId:'m00',generation:1,gender:'M',dob:'1920-01-01',location:'Nyahururu',phone:'',tier:'founder',status:'deceased',joined:''},
    {id:'m00', name:'Maitu Wangui', parentId:null, spouseId:'m0', generation:1,gender:'F',dob:'1925-01-01',location:'Nyahururu',phone:'',tier:'founder',status:'deceased',joined:''},
    {id:'m1',  name:'Maina',    parentId:'m0',generation:2,gender:'M',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m2',  name:'Gacii',    parentId:'m0',generation:2,gender:'F',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m3',  name:'Watiri',   parentId:'m0',generation:2,gender:'F',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m4',  name:'Muthoni',  parentId:'m0',generation:2,gender:'F',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m5',  name:'Wairimu',  parentId:'m0',generation:2,gender:'F',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m6',  name:'Wambui',   parentId:'m0',generation:2,gender:'F',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m7',  name:'Nyambura', parentId:'m0',generation:2,gender:'F',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m8',  name:'Gichuki',  parentId:'m0',generation:2,gender:'M',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m9',  name:'Muragori', parentId:'m0',generation:2,gender:'M',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m10', name:'Gikonyo',  parentId:'m0',generation:2,gender:'M',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m11', name:'Mwede',    parentId:'m0',generation:2,gender:'M',dob:'',location:'',phone:'',tier:'g2',status:'active',joined:''},
    {id:'m30', name:'Kamau', parentId:'m3',generation:3,gender:'M',dob:'1988-04-12',location:'Nakuru', phone:'',tier:'g3',status:'active',joined:''},
    {id:'m31', name:'Paul',  parentId:'m3',generation:3,gender:'M',dob:'1991-07-20',location:'Nairobi',phone:'',tier:'g3',status:'active',joined:''},
    {id:'m32', name:'Nduta', parentId:'m3',generation:3,gender:'F',dob:'1994-01-05',location:'Thika',  phone:'',tier:'g3',status:'active',joined:''},
  ],
  kittyPayments:[],
  kittyAdjustments:[],
  meetings:[{
    id:'mt1',title:'Annual Family Meeting 2025',date:'2025-01-18',
    location:'Nyahururu',attendance:34,status:'past',
    agenda:'1. Opening prayer\n2. Roll call: 34 members present\n3. Treasurer report\n4. Next meeting: August 2025\n5. Junior contribution set at Ksh 50\n6. AOB: Secretary to maintain WhatsApp group',
    notes:''
  }],
  events:[
    {id:'ev1',title:'Annual Family Meeting 2025',date:'2025-08-14',location:"Uncle James's compound, Nyahururu",status:'upcoming',notes:'Confirm attendance by 31 July.'},
    {id:'ev2',title:'Christmas Family Lunch 2025',date:'2025-12-25',location:'Venue TBD — Nakuru',status:'planning',notes:''},
  ],
  announcements:[
    {id:'an1',title:'Next meeting — Nyahururu, August 2025',body:'We meet at the family homestead. Please confirm attendance by July 31st.',date:'2025-05-01',pinned:true},
    {id:'an2',title:'Portal now live!',body:'All family members can view kitty status, minutes, events and photos here.',date:new Date().toISOString().slice(0,10),pinned:false},
  ],
  gallery:[],
};

/* ── DB core ─────────────────────────────────────────────────── */
const DB = {
  load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return this.reset();
      const d = JSON.parse(raw);
      _migrate(d);
      return d;
    } catch { return this.reset(); }
  },
  save(data) {
    try { localStorage.setItem(DB_KEY, JSON.stringify(data)); }
    catch(e) { if(e.name==='QuotaExceededError') alert('Storage full — remove some gallery photos.'); }
  },
  reset() { const f=JSON.parse(JSON.stringify(SEED)); this.save(f); return f; },
  get()   { return this.load(); },
  update(fn) { const d=this.load(); fn(d); this.save(d); return d; },
};

function _migrate(d) {
  const s = d.settings;
  if (!s.g2Rate)     s.g2Rate     = 200;
  if (!s.adultRate)  s.adultRate  = 300;
  if (!s.juniorRate) s.juniorRate = 50;
  if (!s.adultAge)   s.adultAge   = 18;
  // Migrate old kitty object to new payments array
  if (!d.kittyPayments) {
    d.kittyPayments    = [];
    d.kittyAdjustments = [];
    const oldBal = d.kitty?.balance || 0;
    if (oldBal > 0) d.kittyAdjustments.push({id:'adj_open',type:'credit',amount:oldBal,note:'Opening balance (migrated)',date:todayStr()});
    delete d.kitty;
  }
  if (!d.kittyAdjustments) d.kittyAdjustments = [];
  // Remove stale kittyPaid flags — paid status is now computed live
  d.members.forEach(m => { if ('kittyPaid' in m) delete m.kittyPaid; });
}

/* ── Age & tier ──────────────────────────────────────────────── */
const AgeCalc = {
  getAge(dob) {
    if (!dob) return null;
    const b = new Date(dob + 'T00:00:00');
    if (isNaN(b)) return null;
    const n = new Date();
    let a = n.getFullYear() - b.getFullYear();
    const mo = n.getMonth() - b.getMonth();
    if (mo < 0 || (mo===0 && n.getDate() < b.getDate())) a--;
    return a;
  },
  isMinor(dob) {
    const age = this.getAge(dob);
    return age !== null && age < (DB.get().settings.adultAge || 18);
  },
  effectiveTier(member) {
    if (member.tier==='founder' || member.generation===1) return 'founder';
    if (member.generation===2) return 'g2';
    if (this.isMinor(member.dob)) return 'junior';
    if (member.generation===3) return 'g3';
    return 'g4';
  },
  rateFor(member) {
    const s = DB.get().settings;
    const tier = this.effectiveTier(member);
    if (tier==='founder') return 0;
    if (tier==='g2')      return s.g2Rate    || 200;
    if (tier==='junior')  return s.juniorRate || 50;
    return s.adultRate || 300;
  },
  tierLabel(tier) {
    return {founder:'Founder',g2:"Ngugi's child",g3:'Grandchild',g4:'Great-grandchild',junior:'Junior (under 18)'}[tier] || tier;
  },
};

/* ── Members ─────────────────────────────────────────────────── */
const Members = {
  all()         { return DB.get().members; },
  active()      { return DB.get().members.filter(m => m.tier !== 'founder'); },
  byId(id)      { return DB.get().members.find(m => m.id===id); },
  children(pid) { return DB.get().members.filter(m => m.parentId===pid); },
  roots()       { return DB.get().members.filter(m => !m.parentId); },
  initials(n)   { return (n||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2); },
  add(member) {
    DB.update(d => {
      member.id = 'mb'+Date.now()+Math.floor(Math.random()*9999);
      if (!member.tier || member.tier==='auto') member.tier = AgeCalc.effectiveTier(member);
      d.members.push(member);
    });
    return member.id;
  },
  update(id, fields) {
    DB.update(d => { const i=d.members.findIndex(m=>m.id===id); if(i>=0) Object.assign(d.members[i],fields); });
  },
  remove(id) {
    DB.update(d => {
      const gone = new Set();
      const collect = pid => d.members.filter(m=>m.parentId===pid).forEach(m=>{gone.add(m.id);collect(m.id);});
      gone.add(id); collect(id);
      d.members = d.members.filter(m => !gone.has(m.id));
    });
  },
};

/* ── Kitty ───────────────────────────────────────────────────── */
const Kitty = {
  currentPeriod() {
    const n=new Date();
    return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0');
  },
  periodLabel(p) {
    if (!p) return '';
    const [y,m] = p.split('-');
    return new Date(+y,+m-1,1).toLocaleDateString('en-KE',{month:'long',year:'numeric'});
  },
  balance() {
    const d = DB.get();
    const fromPay = (d.kittyPayments||[]).reduce((s,p)=>s+(p.amount||0),0);
    const fromAdj = (d.kittyAdjustments||[]).reduce((s,a)=>s+(a.type==='debit'?-(a.amount||0):(a.amount||0)),0);
    return fromPay + fromAdj;
  },
  hasPaid(memberId, period) {
    return (DB.get().kittyPayments||[]).some(p=>p.memberId===memberId&&p.period===period);
  },
  getPayment(memberId, period) {
    return (DB.get().kittyPayments||[]).find(p=>p.memberId===memberId&&p.period===period);
  },
  recordPayment(tx) {
    DB.update(d => {
      if (!d.kittyPayments) d.kittyPayments=[];
      tx.id = 'tx'+Date.now();
      tx.recordedAt = new Date().toISOString();
      d.kittyPayments.push(tx);
    });
  },
  deletePayment(txId) {
    DB.update(d => { d.kittyPayments=(d.kittyPayments||[]).filter(p=>p.id!==txId); });
  },
  addAdjustment(adj) {
    DB.update(d => {
      if (!d.kittyAdjustments) d.kittyAdjustments=[];
      adj.id='adj'+Date.now();
      adj.date=adj.date||todayStr();
      d.kittyAdjustments.push(adj);
    });
  },
  periodStats(period) {
    const members = Members.active();
    const payments = (DB.get().kittyPayments||[]).filter(p=>p.period===period);
    const paidIds  = new Set(payments.map(p=>p.memberId));
    return {
      paid:      members.filter(m=>paidIds.has(m.id)),
      unpaid:    members.filter(m=>!paidIds.has(m.id)),
      expected:  members.reduce((s,m)=>s+AgeCalc.rateFor(m),0),
      collected: payments.reduce((s,p)=>s+(p.amount||0),0),
      payments,
    };
  },
  allPeriods() {
    const periods = new Set((DB.get().kittyPayments||[]).map(p=>p.period));
    periods.add(this.currentPeriod());
    return [...periods].sort().reverse();
  },
};

/* ── Auth ────────────────────────────────────────────────────── */
const Auth = {
  check(pin) { return DB.get().settings.adminPin===pin; },
  isAdmin()  { return sessionStorage.getItem('ngAdmin')==='yes'; },
  login(pin) { if(this.check(pin)){sessionStorage.setItem('ngAdmin','yes');return true;}return false; },
  logout()   { sessionStorage.removeItem('ngAdmin'); },
};

/* ── Utilities ───────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(String(d).length===10 ? d+'T00:00:00' : d);
  return isNaN(dt) ? String(d) : dt.toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'});
}
function genColor(g){return['#0F6E56','#185FA5','#854F0B','#993556','#3B6D11','#534AB7'][(g-1)%6];}
function genBg(g)   {return['#E1F5EE','#E6F1FB','#FAEEDA','#FBEAF0','#EAF3DE','#EEEDFE'][(g-1)%6];}
function fmtMoney(n){return(DB.get().settings.currency||'Ksh')+' '+Number(n||0).toLocaleString();}
function todayStr() {return new Date().toISOString().slice(0,10);}
function fileToBase64(file){
  return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=()=>rej(new Error('Read failed'));r.readAsDataURL(file);});
}

/* ── Shared UI helpers ───────────────────────────────────────── */
function toast(msg, type='success') {
  document.querySelectorAll('.toast').forEach(t=>t.remove());
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `<span>${type==='success'?'✓':type==='error'?'✕':'ℹ'}</span> ${msg}`;
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('toast--show'));
  setTimeout(()=>{el.classList.remove('toast--show');setTimeout(()=>el.remove(),350);},3200);
}
function btnLoading(btn,text='Saving…'){
  if(!btn)return; btn._orig=btn.innerHTML;
  btn.innerHTML=`<span class="spin">⟳</span> ${text}`; btn.disabled=true;
}
function btnDone(btn){
  if(!btn||!btn._orig)return; btn.innerHTML=btn._orig; btn.disabled=false; delete btn._orig;
}
function confirmDlg(msg,onYes,yesLabel='Delete',yesCls='btn-danger'){
  const id='dlg'+Date.now();
  const el=document.createElement('div');
  el.className='modal-overlay'; el.id=id;
  el.innerHTML=`<div class="modal" style="max-width:360px;text-align:center">
    <div style="font-size:36px;margin-bottom:12px">⚠️</div>
    <p style="font-size:14px;color:var(--txt2);line-height:1.6;margin-bottom:22px">${msg}</p>
    <div class="modal-footer" style="justify-content:center">
      <button class="btn btn-outline" onclick="document.getElementById('${id}').remove()">Cancel</button>
      <button class="btn ${yesCls}" id="${id}y">${yesLabel}</button>
    </div></div>`;
  document.body.appendChild(el);
  document.getElementById(id+'y').onclick=()=>{el.remove();onYes();};
  el.addEventListener('click',e=>{if(e.target===el)el.remove();});
}
