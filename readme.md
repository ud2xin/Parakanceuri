# 🍃 Website Kampung Wisata Parakanceuri

Website ini adalah profil digital dan pusat informasi resmi untuk mempromosikan potensi pariwisata yang ada di **Kampung Wisata Parakanceuri**, Desa Pusakamulya, Kecamatan Kiarapedes, Kabupaten Purwakarta, Jawa Barat. 

Proyek ini dibangun untuk memudahkan wisatawan mencari informasi mengenai destinasi alam, ragam kebudayaan, dan paket wisata edukasi yang ditawarkan oleh desa.

---

## 📑 Struktur Halaman

Website ini terdiri dari 4 halaman utama, masing-masing dengan file HTML, CSS, dan JavaScript yang dipisah agar lebih rapi dan mudah dimodifikasi:

1. **Beranda (`index.html`)**
   Halaman utama yang menampilkan ringkasan profil desa, *hero banner*, dan navigasi cepat ke paket-paket wisata lainnya.
2. **Wisata Alam (`alam.html`)**
   Menampilkan potensi alam Parakanceuri seperti Curug Cilamaya, jalur *trekking*, dan area perkemahan.
3. **Wisata Budaya (`budaya.html`)**
   Mendokumentasikan kearifan lokal, kesenian tradisional (Maenpo, Angklung, Tutunggulan), dan *kaulinan lembur*.
4. **Wisata Edukasi (`edukasi.html`)**
   Menawarkan program *agrowisata* dan *living with local* (bertani padi, UMKM lokal seperti Seroja, serta pengolahan kopi dan teh).

---

## 🛠️ Teknologi yang Digunakan

Website ini dibangun murni menggunakan teknologi web dasar (*Vanilla*), sehingga ringan dan tidak memerlukan instalasi *framework* tambahan:
* **HTML5** (Semantik web)
* **CSS3** (Styling, transisi, animasi *scroll*, dan desain responsif)
* **Vanilla JavaScript** (Interaksi DOM, *smooth scrolling*, manipulasi *navbar*, dan animasi *Intersection Observer*)

## ✨ Lapisan Interaktif (assets/css/interactive.css & assets/js/interactive.js)

Kedua file ini dimuat di **semua halaman** dan berisi seluruh fitur interaktif/animasi tambahan, terpisah dari CSS/JS khusus tiap halaman:
* **Lightbox galeri foto** — klik gambar mana pun untuk melihat versi penuh layar, bisa geser dengan tombol panah/keyboard.
* **Reveal-on-scroll dengan stagger** — kartu-kartu muncul bergantian, bukan bersamaan.
* **Tilt 3D halus** pada kartu & gambar saat kursor mouse bergerak di atasnya.
* **Efek ripple** pada tombol saat diklik.
* **Kalkulator Estimasi Biaya** di halaman Paket Wisata — pilih paket & jumlah peserta, total otomatis terhitung dan tombol booking WhatsApp otomatis terisi pesannya.
* **Count-up angka harga** paket saat kartu masuk ke area pandang.
* **Progress bar scroll**, **tombol kembali ke atas**, dan **tombol WhatsApp mengambang** di semua halaman.
* **Parallax halus** pada ilustrasi kontur gunung di hero, serta transisi *fade* saat berpindah halaman.

Semua fitur menghormati pengaturan *prefers-reduced-motion* pengguna, dan tetap 100% frontend (tanpa backend/build step) sehingga bisa langsung di-hosting di GitHub Pages seperti sebelumnya.

---

## 📂 Struktur Folder Proyek

Pastikan semua file diletakkan dalam satu folder (*root directory*) yang sama agar semua *link* dan gambar berfungsi dengan baik:

```text
/kampung-wisata-parakanceuri
│
├── 📄 index.html        
├── 📄 style.css         
├── 📄 script.js         
│
├── 📄 alam.html         
├── 📄 alam.css          
├── 📄 alam.js           
│
├── 📄 budaya.html       
├── 📄 budaya.css        
├── 📄 budaya.js         
│
├── 📄 edukasi.html      
├── 📄 edukasi.css       
├── 📄 edukasi.js        
│
└── 🖼️ Assets Gambar