# DuitTracker — Andrea & Ricky

Personal expense tracker built with **React + Vite + Recharts**.

## Tech Stack
- **React 19** — UI library
- **Vite** — build tool & dev server
- **Recharts** — charts (Area, Bar, Pie)
- **date-fns** — date utilities
- **localStorage** — data persistence (no backend needed)

## Project Structure
```
src/
├── data/
│   └── categories.js      # Semua kategori & quick entries
├── hooks/
│   ├── useTransactions.js  # State management transactions
│   └── useToast.jsx        # Toast notification context
├── utils/
│   └── format.js           # Formatting & data aggregation
├── components/
│   ├── Sidebar.jsx
│   └── TransactionItem.jsx
├── pages/
│   ├── Dashboard.jsx       # Charts & summary
│   ├── Transactions.jsx    # List & filter
│   └── AddTransaction.jsx  # Form input
├── App.jsx                 # Root component
└── index.css               # Global styles (CSS variables)
```

## Setup & Development

```bash
# Clone / extract zip, lalu:
npm install
npm run dev        # localhost:5173

npm run build      # production build → dist/
npm run preview    # preview production build
```

## Deploy ke Hosting

### Option 1: Netlify (Paling Mudah — FREE)
1. Buka https://app.netlify.com/drop
2. Drag folder `dist/` ke halaman tersebut
3. Done! URL langsung aktif

### Option 2: Vercel (Recommended)
```bash
npm install -g vercel
vercel              # ikuti promptnya
```

### Option 3: GitHub Pages
1. Push ke GitHub repo
2. Settings → Pages → Source: GitHub Actions
3. Tambah file `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Option 4: Cloudflare Pages
1. Login ke https://pages.cloudflare.com
2. Connect GitHub repo
3. Build command: `npm run build`
4. Output directory: `dist`

## Cara Enhance / Tambah Fitur

### Tambah Kategori Baru
Edit `src/data/categories.js`:
```js
export const EXPENSE_CATEGORIES = [
  // tambahkan di sini:
  { name: 'Kategori Baru', icon: '🆕', color: '#hex' },
  ...
]
```

### Tambah Halaman Baru
1. Buat file baru di `src/pages/HalamanBaru.jsx`
2. Import di `src/App.jsx`
3. Tambah navigasi di `src/components/Sidebar.jsx`

### Ganti Data Storage (localStorage → API/Supabase)
Edit `src/hooks/useTransactions.js` — ganti fungsi `load()` dan `save()`.

### Tambah Autentikasi
Tambahkan context di `src/App.jsx` menggunakan Firebase Auth / Supabase Auth.

## Data
Semua data tersimpan di `localStorage` browser dengan key `duit_transactions`.
Format tiap transaksi:
```json
{
  "id": 1234567890,
  "type": "expense",
  "amount": 50000,
  "category": "Makan & Minum",
  "date": "2026-05-16",
  "note": "Makan siang",
  "createdAt": "2026-05-16T10:00:00.000Z"
}
```
