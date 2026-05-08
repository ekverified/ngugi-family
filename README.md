# 🌳 Ngugi Family Portal

**Pamoja Daima** — A complete digital family portal for the Ngugi family.

---

## Features

| Section | Members | Admin |
|---|---|---|
| Home / Announcements | ✅ View | ✅ Post & pin |
| Family Kitty | ✅ View progress & rates | ✅ Record payments, adjust balance |
| Members directory | ✅ Browse & search | ✅ Add, edit, delete |
| Family Tree | ✅ Click to explore generations | ✅ Manage via members |
| Leadership | ✅ View committee | ✅ Edit roles & names |
| Meeting Minutes | ✅ Read all meetings | ✅ Add & edit records |
| Events | ✅ View upcoming & past | ✅ Add & edit events |
| Gallery | ✅ View & lightbox | ✅ Upload photos, add captions |
| Import | — | ✅ CSV upload, paste import, JSON export |

**PWA** — installable on Android & iPhone from the browser.  
**Offline** — works without internet after first load.  
**Cross-tab sync** — admin changes appear instantly in the member portal.

---

## 🚀 Hosting on GitHub Pages (free)

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in (or create an account).
2. Click **New repository**.
3. Name it: `ngugi-family` (or any name you like).
4. Set it to **Public** (required for free GitHub Pages).
5. Click **Create repository**.

### Step 2 — Upload the files

**Option A — Drag & drop (easiest)**
1. Open your new repository on GitHub.
2. Click **uploading an existing file**.
3. Drag the entire `ngugi-family` folder contents into the browser.
4. Make sure these are at the **root** of the repo (not inside a subfolder):
   - `index.html`
   - `admin.html`
   - `manifest.json`
   - `sw.js`
   - `404.html`
   - `css/` folder
   - `js/` folder
   - `assets/` folder
5. Click **Commit changes**.

**Option B — Git command line**
```bash
cd ngugi-family
git init
git add .
git commit -m "Initial commit — Ngugi Family Portal"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ngugi-family.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages**.
2. Under **Source**, select **Deploy from a branch**.
3. Set branch to **main** and folder to **/ (root)**.
4. Click **Save**.
5. Wait 1–2 minutes, then visit:
   ```
   https://YOUR-USERNAME.github.io/ngugi-family/
   ```

### Step 4 — Get a custom .co.ke domain (optional)

If you have a `.co.ke` domain from Truehost, HostPinnacle, or SasaHost:
1. In your domain registrar, add a **CNAME record**:
   - Name: `www`
   - Value: `YOUR-USERNAME.github.io`
2. Also add 4 **A records** pointing to GitHub's IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. In GitHub Pages settings, enter your custom domain (e.g. `www.ngugifamily.co.ke`).
4. Check **Enforce HTTPS**.

---

## 🔐 Admin access

- Go to `your-site.com/admin.html`
- Default PIN: **1234**
- **Change it immediately** after first login (Settings → Change PIN)
- The admin PIN is stored locally in each device's browser. Share it securely with your secretary/treasurer.

---

## 📱 Installing as an app (PWA)

**Android (Chrome):**
1. Open the site in Chrome.
2. Tap the **⋮ menu** → **Add to Home screen**.
3. The app installs like a native app.

**iPhone (Safari):**
1. Open the site in Safari.
2. Tap the **Share** button → **Add to Home Screen**.
3. Tap **Add**.

---

## 📥 Importing members

### From CSV file
Prepare a CSV with these columns:
```
name, parentName, generation, gender, dob, location, phone, tier, status
```

Example:
```csv
name,parentName,generation,gender,dob,location,phone,tier,status
Kamau,Watiri,3,M,1988-04-12,Nakuru,0712345678,g3,active
Paul,Watiri,3,M,1991-07-20,Nairobi,0723456789,g3,active
Nduta,Watiri,3,F,1994-01-05,Thika,0734567890,g3,active
```

**Tier values:**
| Value | Who |
|---|---|
| `founder` | Mzee Ngugi & Maitu Wangui |
| `g2` | Ngugi's 11 children (Ksh 200) |
| `g3` | Their children (Ksh 300) |
| `g4` | Great-grandchildren (Ksh 300) |
| `junior` | Anyone under 18 (Ksh 50) |

### From text paste
In Admin → Import, paste one line per member:
```
Name, ParentName, Generation, Location
Kamau, Watiri, 3, Nakuru
Paul, Watiri, 3, Nairobi
```

---

## 💾 Data storage

All data is stored in the browser's `localStorage` on the device where admin makes changes. This means:

- **One admin device** should be the "source of truth" (e.g. the secretary's phone or laptop).
- Use **Export → JSON** regularly to back up data.
- To move data to a new device: Export JSON → open admin on new device → use browser console:
  ```javascript
  localStorage.setItem('ngugiFamily', '<paste JSON here>');
  location.reload();
  ```

> **Note on multi-device editing:** Because data lives in the browser, two people editing on different devices will have separate copies. For shared editing, consider upgrading to a Firebase backend in the future (contact a developer for this upgrade).

---

## 📂 File structure

```
ngugi-family/
├── index.html          ← Member portal (share this link with family)
├── admin.html          ← Admin portal (keep link private)
├── manifest.json       ← PWA configuration
├── sw.js               ← Service worker (offline support)
├── 404.html            ← GitHub Pages SPA routing fix
├── generate-icons.py   ← Run once to regenerate icons
├── css/
│   └── style.css       ← Full design system
├── js/
│   ├── data.js         ← Data engine & localStorage operations
│   ├── tree.js         ← Interactive family tree renderer
│   └── sync.js         ← Cross-tab sync & hash routing

## 🛠 Future upgrades

- **WhatsApp notifications** — alert members of new announcements
- **M-Pesa Daraja API** — auto-record kitty payments from M-Pesa
- **Member login** — each member has their own PIN to see their profile

---

## Built with ❤️ for the Ngugi Family
*Pamoja Daima — Together Always*
