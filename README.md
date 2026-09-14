# IsoBuy (WebIsoPurchasing)

Aplikasi web purchasing / kasir berbasis katalog. Pengguna login, memilih produk, mengatur keranjang, checkout, lalu mencetak struk. Data produk, autentikasi, dan cart memakai [Fake Store API](https://fakestoreapi.com/).

Tampilan katalog mengikuti mockup `design.html` (header promo, grid produk, filter, footer).

## Fitur

### Login (`/`)
- Form username dan password.
- Token JWT disimpan di `localStorage` (`TOKEN`).
- Setelah login berhasil, diarahkan ke katalog (`/pos`) dalam 2 detik.

Akun demo Fake Store API:

| Field | Nilai |
| --- | --- |
| Username | `mor_2314` |
| Password | `83r5^_` |

### Katalog (`/pos`)
- Banner promo: 15% off first purchase.
- Header IsoBuy: pencarian, wishlist (UI), ikon keranjang dengan jumlah item.
- Filter kiri: kategori (dari data produk), harga min/max, rating, reset.
- Grid produk: gambar, judul, harga IDR, tombol tambah ke keranjang.
- Urutan: Featured, harga naik/turun, rating tertinggi.
- Pencarian memfilter judul dan deskripsi.
- Produk yang sama tidak bisa ditambah dua kali ke keranjang.

Kategori Shop di footer ikut data produk yang sedang dimuat, misalnya:

- men's clothing
- jewelery
- electronics
- women's clothing

### Keranjang
- Drawer dari kanan (shopping bag).
- Ubah kuantitas, hapus item, subtotal per baris.
- Grand total = subtotal + PPN 11%.
- Checkout memanggil `POST /carts` (user id dari JWT, tanggal hari ini, daftar `productId` + `quantity`).
- Setelah sukses, keranjang dikosongkan. Pengguna bisa langsung cetak struk.

### Cetak struk (`/pos/print`)
- Tabel: judul, harga, kuantitas, subtotal, total.
- `window.print()` otomatis saat halaman terbuka; tombol Print dan Back tersedia.

### Footer katalog
- Kontak, live chat, message, Instagram / YouTube / Facebook.
- Shop (kategori produk nyata).
- Loyalty, Quick Links, tombol App Store / Google Play, tautan legal.
- Tautan selain Shop masih placeholder (`#`), sesuai mockup.

## Stack

| Bagian | Teknologi |
| --- | --- |
| UI | React 18, Create React App |
| Routing | react-router-dom v6 |
| HTTP | axios |
| Komponen form/kartu | Bootstrap 5, react-bootstrap |
| Ikon | react-icons |
| API | Fake Store API (`https://fakestoreapi.com`) |
| Styling | `src/App.css` (katalog + login), `src/index.css` |

Tidak memakai Tailwind di runtime aplikasi. File `design.html` hanya referensi visual (Tailwind CDN + Phosphor).

## Rute

| Path | Halaman | File |
| --- | --- | --- |
| `/` | Login | `src/pages/LoginPage.js` |
| `/pos` | Katalog + keranjang | `src/pages/POSPage.js` |
| `/pos/print` | Struk | `src/pages/POSPrintPage.js` |

Router ada di `src/App.js`. `ContainerOutletWidget` hanya membungkus `<Outlet />`.

## Struktur kode

```
src/
  App.js
  App.css
  config.js                 # BASE_URL Fake Store API
  pages/
    LoginPage.js
    POSPage.js
    POSPrintPage.js
  components/catalog/
    CatalogHeader.js
    CatalogFilters.js
    CatalogFooter.js
    ProductGrid.js
    ProductCard.js
    TransactionPanel.js
  services/
    AuthService.js          # POST /auth/login, token JWT
    ProductService.js       # GET /products
    CheckoutService.js      # POST /carts
  utils/helpers.js          # duplikat item, format IDR
  widgets/commons/
    ContainerOutletWidget.js
design.html                 # mockup UI katalog + footer
```

State katalog (produk, filter, keranjang, total) hidup di `POSPage`. Komponen catalog hanya menerima props.

## API yang dipakai

Base URL: `https://fakestoreapi.com` (`src/config.js`).

| Method | Endpoint | Dipakai untuk |
| --- | --- | --- |
| `POST` | `/auth/login` | Login |
| `GET` | `/products` | Daftar katalog |
| `POST` | `/carts` | Checkout |

Payload checkout:

```json
{
  "userId": 1,
  "date": "2026-09-14",
  "products": [{ "productId": 1, "quantity": 2 }]
}
```

`userId` diambil dari claim `sub` di JWT.

## Alur transaksi

1. Login → token disimpan.
2. `GET /products` mengisi grid dan kategori footer/filter.
3. Tambah produk ke `productChoices` (quantity awal 1, subtotal = harga).
4. Ubah quantity → `subtotal = quantity * price`.
5. Total tampilan = `(sum subtotal) * 1.11` (PPN 11%).
6. Checkout → `POST /carts` → konfirmasi print → `/pos/print` dengan `location.state`.

## Menjalankan

Butuh Node.js dan npm.

```bash
npm install
npm start
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah lain:

```bash
npm test          # test runner CRA
npm run build     # production build ke folder build/
```

Jangan `npm run eject` kecuali memang perlu mengubah konfigurasi webpack secara permanen.

## Deploy ke GitHub Pages

Aplikasi ini project site, URL-nya:

`https://dickyadem.github.io/WebIsoPurchasing`

Yang sudah disiapkan di repo:

- `homepage` di `package.json` (path aset `/WebIsoPurchasing`)
- `BrowserRouter basename={process.env.PUBLIC_URL}` agar rute `/pos` tidak bentrok dengan path repo
- `postbuild` menyalin `index.html` → `404.html` supaya refresh/deep link SPA tidak 404
- script `predeploy` / `deploy` memakai paket `gh-pages`

Yang perlu kamu lakukan sekali di GitHub:

1. Repo **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `gh-pages` / `/ (root)` — branch ini muncul setelah deploy pertama

Lalu dari mesin lokal (setelah perubahan di-commit):

```bash
npm run deploy
```

Perintah itu `npm run build`, lalu push folder `build/` ke branch `gh-pages`. Tunggu 1–2 menit, buka URL di atas.

Catatan Pages:

- Fake Store API mengizinkan request dari browser (tidak perlu backend).
- Token login tetap di `localStorage` browser pengunjung.
- `npm start` lokal tidak memakai prefix `/WebIsoPurchasing`.

## Catatan

- Katalog `/pos` bisa dibuka tanpa login; checkout butuh token karena membaca JWT.
- Harga API dalam USD, ditampilkan sebagai IDR via `toLocaleString("id-ID")` tanpa konversi kurs.
- Wishlist, live chat, loyalty, dan tautan legal di footer belum punya halaman sendiri.
- `design.html` bukan bagian runtime; ubah UI aplikasi di komponen React + `App.css`.
