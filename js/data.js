/* ============================================================
   NGUGI FAMILY PORTAL — Data Engine
   All data lives in localStorage under key "ngugiFamily"
   ============================================================ */

const DB_KEY = 'ngugiFamily';
const ADMIN_PIN = '1234'; // change this in admin settings

// ── Seed data ───────────────────────────────────────────────
const SEED = {
  settings: {
    familyName: 'Ngugi Family',
    slogan: 'Pamoja Daima',
    foundingYear: 1950,
    adminPin: ADMIN_PIN,
    mpesaTill: '',
    currency: 'Ksh',
  },
  leadership: [
    { id: 'l1', role: 'Chairperson',  name: '', phone: '' },
    { id: 'l2', role: 'Secretary',    name: '', phone: '' },
    { id: 'l3', role: 'Treasurer',    name: '', phone: '' },
    { id: 'l4', role: 'Vice-Chair',   name: '', phone: '' },
    { id: 'l5', role: 'Welfare',      name: '', phone: '' },
  ],
  // members: flat list; parentId links generations
  members: [
    // G1 — Founders
    { id: 'm0',  name: 'Mzee Ngugi',    parentId: null,  generation: 1, gender: 'M', dob: '', location: '', phone: '', tier: 'founder',   status: 'deceased', joined: '' },
    { id: 'm00', name: 'Maitu Wangui',  parentId: null,  generation: 1, gender: 'F', dob: '', location: '', phone: '', tier: 'founder',   status: 'deceased', joined: '' },
    // G2 — Ngugi children (11)
    { id: 'm1',  name: 'Maina',    parentId: 'm0', generation: 2, gender: 'M', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm2',  name: 'Gacii',    parentId: 'm0', generation: 2, gender: 'F', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm3',  name: 'Watiri',   parentId: 'm0', generation: 2, gender: 'F', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm4',  name: 'Muthoni',  parentId: 'm0', generation: 2, gender: 'F', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm5',  name: 'Wairimu',  parentId: 'm0', generation: 2, gender: 'F', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm6',  name: 'Wambui',   parentId: 'm0', generation: 2, gender: 'F', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm7',  name: 'Nyambura', parentId: 'm0', generation: 2, gender: 'F', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm8',  name: 'Gichuki',  parentId: 'm0', generation: 2, gender: 'M', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm9',  name: 'Muragori', parentId: 'm0', generation: 2, gender: 'M', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm10', name: 'Gikonyo',  parentId: 'm0', generation: 2, gender: 'M', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    { id: 'm11', name: 'Mwede',    parentId: 'm0', generation: 2, gender: 'M', dob: '', location: '', phone: '', tier: 'g2', status: 'active', joined: '', kittyPaid: false },
    // G3 — Watiri's children (sample)
    { id: 'm30', name: 'Kamau',  parentId: 'm3', generation: 3, gender: 'M', dob: '', location: '', phone: '', tier: 'g3', status: 'active', joined: '', kittyPaid: false },
    { id: 'm31', name: 'Paul',   parentId: 'm3', generation: 3, gender: 'M', dob: '', location: '', phone: '', tier: 'g3', status: 'active', joined: '', kittyPaid: false },
    { id: 'm32', name: 'Nduta',  parentId: 'm3', generation: 3, gender: 'F', dob: '', location: '', phone: '', tier: 'g3', status: 'active', joined: '', kittyPaid: false },
  ],
  kitty: {
    currentQuarter: 'Q2 2025',
    balance: 14200,
    tiers: { founder: 0, g2: 200, g3: 300, g4: 300, junior: 50 },
    transactions: [
      { id: 't1', memberId: 'm30', memberName: 'Kamau', amount: 300, date: '2025-04-10', quarter: 'Q2 2025', method: 'M-Pesa', ref: 'QKJ123' },
    ],
  },
  meetings: [
    {
      id: 'mt1', title: 'Annual Family Meeting 2025', date: '2025-01-18',
      location: 'Nyahururu', attendance: 34, status: 'past',
      agenda: '1. Opening prayer\n2. Roll call: 34 of 47 members present\n3. Treasurer report: Ksh 11,600 collected 2024, balance Ksh 6,200\n4. Next meeting agreed August 2025\n5. Resolution: Under-18 contribution raised from Ksh 30 to Ksh 50\n6. AOB: WhatsApp group to be maintained by secretary',
      minutes: '', attachments: []
    },
  ],
  events: [
    { id: 'ev1', title: 'Annual Family Meeting 2025', date: '2025-08-14', location: "Uncle James's compound, Nyahururu", status: 'upcoming', notes: 'All members requested to confirm attendance by July 31.' },
    { id: 'ev2', title: 'Christmas Family Lunch', date: '2025-12-25', location: 'Venue TBD — Nakuru', status: 'planning', notes: '' },
  ],
  announcements: [
    { id: 'an1', title: 'Next meeting confirmed — Nyahururu, August 2025', body: 'We shall meet at the family homestead. Members please confirm attendance by July 31.', date: '2025-05-01', pinned: true },
    { id: 'an2', title: 'Kitty contributions — Q2 reminder', body: 'All members please send Q2 contribution via M-Pesa before end of June. Contact the treasurer for queries.', date: '2025-04-20', pinned: false },
  ],
  gallery: [
    // { id, caption, date, dataUrl }
  ],
};

// ── DB helpers ───────────────────────────────────────────────
const DB = {
  load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return this.reset();
      return JSON.parse(raw);
    } catch { return this.reset(); }
  },
  save(data) {
    try { localStorage.setItem(DB_KEY, JSON.stringify(data)); } catch (e) {
      alert('Storage full — please clear some gallery images.');
    }
  },
  reset() {
    const fresh = JSON.parse(JSON.stringify(SEED));
    this.save(fresh);
    return fresh;
  },
  get() { return this.load(); },
  update(fn) {
    const data = this.load();
    fn(data);
    this.save(data);
    return data;
  },
};

// ── Member helpers ───────────────────────────────────────────
const Members = {
  all() { return DB.get().members; },
  byId(id) { return DB.get().members.find(m => m.id === id); },
  children(parentId) { return DB.get().members.filter(m => m.parentId === parentId); },
  add(member) {
    DB.update(d => {
      member.id = 'm' + Date.now();
      d.members.push(member);
    });
  },
  update(id, fields) {
    DB.update(d => {
      const i = d.members.findIndex(m => m.id === id);
      if (i >= 0) Object.assign(d.members[i], fields);
    });
  },
  remove(id) {
    DB.update(d => { d.members = d.members.filter(m => m.id !== id && m.parentId !== id); });
  },
  initials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  },
  tierLabel(tier) {
    const map = { founder: 'Founders', g2: "Ngugi's children", g3: 'Grandchildren', g4: 'Great-grandchildren', junior: 'Under 18' };
    return map[tier] || tier;
  },
  tierRate(tier, settings) {
    const rates = { founder: 0, g2: 200, g3: 300, g4: 300, junior: 50 };
    return rates[tier] || 300;
  },
};

// ── Kitty helpers ────────────────────────────────────────────
const Kitty = {
  get() { return DB.get().kitty; },
  recordPayment(tx) {
    DB.update(d => {
      tx.id = 'tx' + Date.now();
      d.kitty.transactions.push(tx);
      d.kitty.balance += tx.amount;
      const m = d.members.find(m => m.id === tx.memberId);
      if (m) m.kittyPaid = true;
    });
  },
  setPaid(memberId, quarter, paid) {
    DB.update(d => {
      const m = d.members.find(m => m.id === memberId);
      if (m) m.kittyPaid = paid;
    });
  },
};

// ── Auth ─────────────────────────────────────────────────────
const Auth = {
  check(pin) { return DB.get().settings.adminPin === pin; },
  isAdmin() { return sessionStorage.getItem('ngAdmin') === 'yes'; },
  login(pin) {
    if (this.check(pin)) { sessionStorage.setItem('ngAdmin', 'yes'); return true; }
    return false;
  },
  logout() { sessionStorage.removeItem('ngAdmin'); },
};

// ── Utility ──────────────────────────────────────────────────
function uid() { return 'i' + Math.random().toString(36).slice(2, 9); }
function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}
function genColor(gen) {
  const c = ['#0F6E56','#185FA5','#854F0B','#993556','#3B6D11','#534AB7'];
  return c[(gen - 1) % c.length];
}
function genBg(gen) {
  const c = ['#E1F5EE','#E6F1FB','#FAEEDA','#FBEAF0','#EAF3DE','#EEEDFE'];
  return c[(gen - 1) % c.length];
}
