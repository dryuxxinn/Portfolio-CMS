# Port-sin: Dynamic Portfolio & MikroTik Hotspot/PPPoE Management System (PostgreSQL Edition)

Sistem web dinamis modern yang memadukan **Next.js 16 (React 19)** di sisi Frontend dan **Node.js (Express) + PostgreSQL (Sequelize)** di sisi Backend API, dilengkapi integrasi otomatis ke **MikroTik RouterOS**.

---

## 🚀 Arsitektur & Tech Stack

```
Port-sin/
├── backend/                       # REST API (Express.js + PostgreSQL + Sequelize)
│   ├── src/
│   │   ├── config/db.js           # Koneksi Sequelize ke PostgreSQL (port 5433 / 5432)
│   │   ├── middleware/            # JWT Token Authentication & Role Guard
│   │   ├── modules/               # Model Sequelize: Admin, WebConfig, Project, Certificate, SinRegistration, ContactMessage, Visitor
│   │   ├── services/              # Service integrasi RouterOS MikroTik
│   │   ├── scripts/seed.js        # Script Seeder data awal ke database PostgreSQL
│   │   └── server.js              # Entrypoint API & Swagger Docs
│   └── .env                       # DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, JWT_SECRET
│
├── frontend/                      # Next.js App Router + Tailwind CSS Glassmorphism
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js            # Beranda dinamis (Hero typed, snippets, featured projects)
│   │   │   ├── about/page.js      # Profil, Pendidikan, Pengalaman, Tools, & Galeri Sertifikat
│   │   │   ├── project/page.js    # Katalog Proyek dengan live search & filter kategori
│   │   │   ├── project/[slug]/    # Detail studi kasus proyek & galeri
│   │   │   ├── contact/page.js    # Info Kontak & Form Kirim Pesan Interaktif
│   │   │   └── admin/             # CMS Admin Panel (Login, Dashboard, Projects, Certificates, Pesan)
│   │   └── components/            # Navbar, Footer, BackgroundGlow
│   └── package.json
│
├── start-all.bat                  # Script 1-klik untuk menjalankan backend & frontend
└── README-SETUP.md                # Dokumentasi lengkap sistem
```

---

## ⚙️ Konfigurasi Database PostgreSQL (`backend/.env`)

Sistem dikonfigurasi untuk terhubung ke layanan **PostgreSQL 17** di komputer lokal Anda:

```env
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5433
DB_NAME=port_sin_db
DB_USER=postgres
DB_PASS=PASSWORD_POSTGRES_ANDA
```

> [!IMPORTANT]
> **Langkah Inisialisasi Database:**
> 1. Masukkan password PostgreSQL lokal Anda pada parameter `DB_PASS` di file `backend/.env`.
> 2. Pastikan database `port_sin_db` telah dibuat di pgAdmin / psql (`CREATE DATABASE port_sin_db;`).
> 3. Jalankan seeding data awal dengan perintah:
>    ```bash
>    cd backend
>    npm run seed
>    ```
>    *Tabel dan data (Admin, Profil Bergas, 7 Proyek, 15 Sertifikat) akan otomatis di-*generate* ke PostgreSQL.*

---

## 🔑 Kredensial Default CMS Admin

* **URL Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
* **Username**: `admin`
* **Password**: `admin123`

---

## 🌐 Layanan & Port

| Layanan | URL | Keterangan |
| :--- | :--- | :--- |
| **Frontend Web Publik** | `http://localhost:3000` | Website portfolio utama (Modern Dark Glassmorphism) |
| **CMS Dasbor Admin** | `http://localhost:3000/admin` | Panel kendali konten proyek, profil, sertifikat, & pesan |
| **Backend REST API** | `http://localhost:5000` | Server API Express & PostgreSQL |
| **Dokumentasi Swagger** | `http://localhost:5000/api-docs` | Dokumentasi interaktif seluruh endpoint API |

---

## 💻 Cara Menjalankan

Cukup klik dua kali berkas **`start-all.bat`**, atau jalankan via terminal:

```bash
# 1. Jalankan Backend (Terminal 1)
cd backend
node src/server.js

# 2. Jalankan Frontend (Terminal 2)
cd frontend
npx.cmd next dev --webpack -p 3000
```
