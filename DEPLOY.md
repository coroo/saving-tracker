# Deploy LEXA SAVING ke Vercel

## Opsi 1: Vercel + GitHub (paling mudah)

1. Buka [vercel.com](https://vercel.com) dan login dengan GitHub.
2. **Add New Project** → pilih repo **s-tracker-fe** (atau nama repo kamu).
3. Vercel akan deteksi Vite:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install` (atau kosongkan biar pakai default)
4. Klik **Deploy**. Setiap push ke `main` akan auto-deploy.

Tidak perlu atur GitHub Actions untuk deploy kalau pakai cara ini; Vercel yang nge-deploy.  
Tetap bisa pakai workflow **CI** di repo ini hanya untuk **lint** (dan build) di GitHub Actions.

---

## Opsi 2: Deploy lewat GitHub Action (pakai workflow ini)

Agar job **Deploy to Vercel** di workflow jalan, tambahkan **secrets** di repo GitHub:

### 1. Buat token Vercel

1. Buka [Vercel Dashboard](https://vercel.com/account/tokens).
2. **Create Token** → nama misalnya `github-actions` → **Create**.
3. Copy token (hanya muncul sekali).

### 2. Dapatkan Org ID & Project ID

**Cara A – lewat Vercel (project sudah ada):**

1. Buka project di Vercel → **Settings** → **General**.
2. Di bagian **Project ID**, copy **Project ID**.
3. Di URL Vercel atau di **Team** / **Account** settings, cari **Team/Org ID** (bisa pakai [vercel.com/account](https://vercel.com/account) → lihat URL atau API).

**Cara B – lewat CLI (project belum pernah deploy):**

```bash
npm i -g vercel
vercel login
vercel link
```

Lalu buka folder project, cek file `.vercel/project.json`:

- `projectId` → ini **VERCEL_PROJECT_ID**
- `orgId` → ini **VERCEL_ORG_ID**

### 3. Tambah secrets di GitHub

1. Repo GitHub → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret** untuk masing-masing:

| Nama secret        | Nilai                          |
|--------------------|--------------------------------|
| `VERCEL_TOKEN`     | Token dari langkah 1           |
| `VERCEL_ORG_ID`    | Org/Team ID dari langkah 2     |
| `VERCEL_PROJECT_ID`| Project ID dari langkah 2      |

### 4. (Opsional) Environment "production"

Agar job deploy pakai environment **production**:

1. Repo → **Settings** → **Environments**.
2. Buat environment bernama **production** (atau sesuaikan nama di workflow).
3. Kalau mau, bisa set environment-specific secrets di sini.

Setelah itu, setiap **push ke `main`** (atau `master`), workflow akan:

1. **Lint** → jalankan ESLint.
2. **Build** → `npm run build`.
3. **Deploy** → `vercel build --prod` lalu `vercel deploy --prebuilt --prod`.

---

## Ringkasan yang dibutuhkan untuk deploy ke Vercel

- **Opsi 1 (Vercel + GitHub):**  
  Cukup connect repo di Vercel, tidak perlu token/secret di GitHub.

- **Opsi 2 (GitHub Action):**  
  Perlu 3 secrets di repo:
  - **VERCEL_TOKEN** – token dari Vercel Dashboard.
  - **VERCEL_ORG_ID** – ID tim/akun Vercel.
  - **VERCEL_PROJECT_ID** – ID project Vercel (dari Settings project atau `.vercel/project.json`).

Build command yang dipakai: **`npm run build`** (output: **`dist`**).
