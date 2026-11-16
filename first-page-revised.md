# FIRST-PAGE.md --- Opening Experience Probability 3D

Dokumen ini adalah instruksi implementasi halaman pertama Probability 3D
dengan menjadikan Table Tales
(`https://tabletales.crz.studio/`) sebagai referensi visual dan interaksi
UTAMA. Targetnya adalah kemiripan setinggi mungkin pada struktur komposisi,
proporsi elemen, hierarki tipografi, penempatan ilustrasi, ritme visual,
perilaku scroll, transisi, dan kualitas animasi. Jangan hanya membuat
halaman yang sekadar "terinspirasi" atau memakai template hero generik.
Adaptasikan pendekatan desain tersebut ke identitas Probability 3D:
gunakan teks, warna, ilustrasi, simbol, dan aset orisinal Probability 3D.
Jangan menyalin logo, ilustrasi, aset berhak cipta, teks, atau identitas
merek Table Tales.

## 1. Tujuan

Buat pengalaman pembuka sinematik yang menjadi halaman pertama saat
website dibuka. Setelah pengguna scroll, opening harus bertransisi
secara mulus ke **beranda Probability 3D yang sudah ada**.

Alur: 1. Website dibuka dan menampilkan opening full-screen. 2. Judul
besar `PROBABILITAS` dan `STATISTIKA` menjadi fokus utama. 3. Ilustrasi
objek probabilitas dan statistika muncul dengan animasi. 4. Petunjuk
`SCROLL TO EXPLORE` terlihat di bagian bawah. 5. Saat scroll, judul dan
ilustrasi bergerak secara sinematik. 6. Opening memudar/bergeser dan
beranda lama muncul. 7. Seluruh fitur beranda lama tetap berfungsi
seperti sebelumnya.

**Jangan membuat ulang beranda dari nol.** Pertahankan komponen,
navigasi, kalkulator, laboratorium, materi, state, dan fungsi yang sudah
ada. Pekerjaan utama adalah membuat opening page dan mengintegrasikannya
sebelum beranda saat ini.

## 2. Arah desain: Editorial Mathematical Experience

Buat tampilan yang: - Dramatis, artistik, modern, dan elegan.
- Mengikuti sedekat mungkin komposisi editorial, skala, keseimbangan,
  layering, dan karakter visual Table Tales.
- Menggunakan tipografi display yang sangat besar. - Memiliki ilustrasi utama
berukuran besar. - Menggunakan ornamen garis, kurva, grid, dan simbol
matematika. - Memiliki depth melalui komposisi foreground,
middle-ground, dan background. - Terasa seperti pembukaan pengalaman
belajar, bukan dashboard atau template SaaS.

Jangan menggunakan dark theme. Ikuti identitas Probability 3D dari
`design.md`: putih dan hijau sebagai warna utama, dengan warna pendukung
yang serasi.

## 3. Palet warna

  Elemen                Warna
  --------------------- -----------------------
  Background            `#F5FFF7` / `#EAF8EF`
  Hijau utama           `#218B5B`
  Hijau tua             `#174B35`
  Putih                 `#FFFFFF`
  Mint                  `#CDEEDB`
  Aksen kuning hangat   `#F2B84B`
  Aksen biru lembut     `#83B9D8`
  Teks sekunder         `#52665A`

Boleh menggunakan gradient putih-hijau pastel. Pastikan judul dan teks
memiliki kontras tinggi.

**Warna objek pembelajaran tidak harus hijau.** Gunakan warna
berdasarkan karakter objek: - Dadu: putih/ivory dengan titik hitam. -
Koin: emas, perak, atau tembaga. - Bola: merah, biru, kuning, atau warna
kategori. - Kartu: putih dengan simbol merah dan hitam. - Grafik:
beberapa warna kategori yang mudah dibedakan.

Palet hijau-putih berlaku untuk UI dan background, bukan untuk mewarnai
semua objek.

## 4. Komposisi hero

### 4.1 Navigasi minimal

-   Logo Probability 3D kecil di kiri atas.
-   Label kecil seperti `AN INTERACTIVE LEARNING EXPERIENCE`.
-   Tombol menu minimal di kanan jika diperlukan.
-   Navbar transparan dan tidak mendominasi.
-   Jangan tampilkan seluruh navigasi aplikasi di opening. Navigasi
    utama tetap berada di beranda.

### 4.2 Eyebrow text

Tampilkan teks kecil di atas judul, misalnya:

`EXPLORE THE WORLD OF CHANCE & DATA`

Gunakan uppercase, letter spacing lebar, dan warna aksen.

### 4.3 Judul utama

Teks wajib:

**PROBABILITAS**

**STATISTIKA**

Ketentuan: - Huruf kapital dan ukuran sangat besar. - Dominan memenuhi
sebagian besar lebar viewport. - Gunakan display serif editorial seperti
Bodoni Moda, Playfair Display, DM Serif Display, atau Cormorant
Garamond. - Gunakan Plus Jakarta Sans atau Inter untuk teks UI. -
Maksimal dua keluarga font utama. - Judul boleh memiliki layer
outline/garis dekoratif di belakangnya. - Boleh ada overlap terkontrol,
tetapi jangan sampai huruf sulit dibaca. - Skala judul harus responsif
terhadap lebar layar.

### 4.4 Ilustrasi utama

Letakkan ilustrasi utama di tengah hingga bawah hero. Buat komposisi
artistik dari objek: - Dadu 3D. - Koin. - Kartu remi. - Bola
eksperimen. - Kurva distribusi Normal. - Histogram. - Diagram
lingkaran. - Grafik garis. - Simbol P(A), μ, σ, Σ, dan x̄. - Grid
koordinat dan pola geometri.

Atur layering: - Judul sebagai layer belakang/tengah. - Ilustrasi utama
sebagai foreground. - Objek pendukung di sisi kiri dan kanan. - Jangan
menutupi judul atau supporting statement. - Gunakan pencahayaan dan
shadow yang lembut. - Sisakan whitespace agar komposisi tidak terlalu
padat.

Objek harus memiliki material dan warna yang masuk akal. Jangan membuat
semua objek hijau, transparan, atau berbahan kaca.

### 4.5 Supporting statement

Gunakan satu kalimat singkat:

`Jelajahi peluang, pahami data, dan temukan cerita di balik setiap angka.`

Hindari paragraf panjang pada hero.

### 4.6 Scroll indicator

Tampilkan `SCROLL TO EXPLORE` di bagian bawah dengan ikon panah ke
bawah. Berikan animasi naik-turun kecil. Indikator dapat diklik untuk
scroll ke awal beranda.

## 5. Animasi saat halaman dibuka

Gunakan entrance animation bertahap: 1. Background fade-in. 2. Ornamen
dekoratif muncul perlahan. 3. Eyebrow text fade dan slide sedikit. 4.
Huruf `PROBABILITAS` muncul dengan stagger. 5. Huruf `STATISTIKA` muncul
setelahnya. 6. Ilustrasi utama masuk dari bawah dengan opacity dan
transform. 7. Objek pendukung muncul satu per satu. 8. Supporting
statement dan scroll indicator muncul terakhir.

Durasi awal yang disarankan: - Background: 400--700ms. - Eyebrow:
400--600ms. - Judul: 700--1200ms. - Ilustrasi: 800--1400ms. - Detail
akhir: 300--600ms.

Jangan membuat intro terlalu lama atau menghalangi pengguna untuk
langsung scroll.

## 6. Floating object dan parallax

Objek dekoratif dapat memiliki gerakan ringan: - Dadu berputar
perlahan. - Koin melakukan rotasi kecil. - Kartu memiliki tilt lembut. -
Simbol matematika melayang perlahan. - Garis grafik tergambar secara
animatif.

Gunakan parallax dengan kecepatan berbeda: - Background paling lambat. -
Ornamen sedikit lebih cepat. - Judul bergerak sedang. - Ilustrasi
foreground bergerak lebih cepat.

Gerakan harus lembut, tidak membuat pusing, dan tidak mengganggu
keterbacaan.

## 7. Scroll transition --- bagian paling penting

Jangan hanya menampilkan hero lalu memotong langsung ke beranda. Gunakan
scroll sebagai storytelling.

Saat pengguna scroll: - Hero dapat menggunakan `position: sticky` selama
rentang transisi. - Judul bergerak ke atas dan sedikit mengecil. -
Ilustrasi bergerak mengikuti arah scroll. - Objek pendukung berpindah
atau memudar. - Background berubah perlahan menuju background beranda. -
Beranda mulai muncul dari bawah. - Transisi berakhir tanpa lompatan
layout atau flash.

Gunakan CSS `position: sticky`, `transform`, `opacity`, CSS variables,
dan `IntersectionObserver`. Jika membutuhkan timeline scroll yang lebih
presisi, GSAP + ScrollTrigger boleh digunakan setelah memeriksa
dependency project. Jangan menambahkan library besar jika implementasi
sederhana sudah cukup.

Jangan mengunci scroll pengguna. Pengguna harus dapat scroll naik dan
turun secara normal.

## 8. Integrasi dengan beranda yang sekarang

-   Beranda saat ini menjadi section setelah opening.
-   Jangan menghapus atau menulis ulang komponen beranda.
-   Pertahankan seluruh fitur dan event handler.
-   Pertahankan routing, navigasi, kalkulator, laboratorium, materi, dan
    state.
-   Jika beranda memiliki navbar, tampilkan navbar tersebut ketika
    section beranda mulai terlihat.
-   Hindari dua navbar yang tampil bersamaan.
-   Ketika pengguna scroll kembali ke atas, opening harus muncul lagi
    secara normal.
-   Pastikan pengguna dapat melewati opening dengan scroll tanpa
    menunggu animasi selesai.

Opsional: tambahkan satu scene narasi singkat di antara opening dan
beranda:

**DARI KEMUNGKINAN MENUJU PEMAHAMAN**

`Setiap percobaan memiliki kemungkinan. Setiap data menyimpan pola. Mulailah menjelajah dan pahami bagaimana angka menjelaskan dunia.`

Jika scene ini membuat alur terlalu panjang, gabungkan narasi dengan
bagian awal beranda.

## 9. Detail dekoratif

Gunakan ornamen yang berhubungan dengan matematika: - Garis lengkung
seperti kurva distribusi. - Grid koordinat sangat tipis. - Lingkaran
konsentris. - Titik-titik data. - Angka kecil sebagai detail
editorial. - Rumus pendek sebagai aksen. - Garis penghubung antarobjek.

Gunakan opacity rendah. Jangan memenuhi hero dengan rumus karena opening
adalah pengantar visual, bukan halaman materi.

## 10. Interaksi

-   Scroll indicator dapat diklik.
-   Objek dekoratif boleh memiliki hover tilt ringan pada desktop.
-   Hover tidak boleh menjadi satu-satunya cara berinteraksi.
-   Elemen yang dapat diklik harus memiliki feedback yang jelas.
-   Jangan membuat semua objek dapat diklik jika tidak memiliki fungsi.
-   Pada perangkat touch, gunakan interaksi tap hanya untuk elemen yang
    benar-benar interaktif.

## 11. Responsive design

**Desktop** - Judul sangat besar. - Ilustrasi memiliki komposisi luas. -
Parallax dan hover dapat aktif jika performa memadai.

**Tablet** - Skala judul dan jumlah objek disesuaikan. - Pastikan
ilustrasi tidak menutupi teks.

**Mobile** - Judul dibagi menjadi baris yang jelas. - Ilustrasi ditata
ulang agar tetap terbaca. - Kurangi atau nonaktifkan parallax berat. -
Gunakan animasi opacity dan transform sederhana. - Hindari horizontal
overflow. - Pastikan pengguna dapat langsung scroll.

## 12. Performa dan accessibility

-   Utamakan animasi `transform` dan `opacity`.
-   Hindari animasi layout yang memicu reflow terus-menerus.
-   Optimalkan gambar dan model 3D.
-   Lazy-load aset yang tidak langsung terlihat.
-   Batasi objek 3D aktif bersamaan.
-   Sediakan fallback jika WebGL tidak tersedia.
-   Dukung `prefers-reduced-motion`.
-   Jika reduced motion aktif, matikan parallax dan floating animation,
    tetapi tampilkan semua konten.
-   Jangan memutar audio/video secara otomatis.
-   Jangan mengunci scroll.
-   Pastikan teks tetap terbaca selama animasi.

## 13. Instruksi implementasi untuk AI Coding Agent

Sebelum mengubah kode: 1. Periksa struktur project dan entry point. 2.
Temukan komponen beranda yang sekarang digunakan. 3. Periksa sistem
routing, CSS, dan library animasi yang tersedia. 4. Pahami cara beranda
dirender agar integrasi tidak merusak fungsi. 5. Identifikasi aset
visual yang dapat digunakan kembali.

Saat implementasi: 1. Buat komponen khusus `OpeningPage` atau nama yang
sesuai arsitektur project. 2. Pisahkan opening dari komponen beranda. 3.
Render opening sebelum beranda. 4. Buat entrance animation dan scroll
transition. 5. Gunakan aset yang tersedia jika sesuai. 6. Gunakan aset
orisinal jika membutuhkan ilustrasi baru. 7. Jangan mengambil atau
menggunakan aset Table Tales. 8. Pastikan opening tidak memblokir akses
ke beranda. 9. Uji seluruh fitur lama setelah integrasi. 10. Uji
desktop, tablet, dan mobile.

Contoh struktur (sesuaikan dengan project yang ada):

``` text
src/
├── features/
│   ├── opening/
│   │   ├── OpeningPage.js
│   │   ├── OpeningScene.js
│   │   ├── ScrollTransition.js
│   │   └── opening.css
│   └── ...
└── main.js
```

Jangan memaksakan struktur contoh jika project sudah memiliki pola
arsitektur sendiri.

## 14. Checklist selesai

-   [ ] Opening tampil sebagai halaman pertama.
-   [ ] Judul tepat: `PROBABILITAS` dan `STATISTIKA`.
-   [ ] Judul besar, jelas, dan dominan.
-   [ ] Ilustrasi sesuai tema probabilitas dan statistika.
-   [ ] Warna objek sesuai karakter aslinya.
-   [ ] Entrance animation berjalan halus.
-   [ ] Floating objects tidak mengganggu teks.
-   [ ] Scroll mengubah opening menjadi transisi menuju beranda.
-   [ ] Beranda lama tetap utuh dan berfungsi.
-   [ ] Navbar opening dan beranda tidak bertabrakan.
-   [ ] Pengguna dapat scroll kembali ke opening.
-   [ ] Tidak ada horizontal overflow.
-   [ ] Responsive pada desktop, tablet, dan mobile.
-   [ ] Performa tetap baik.
-   [ ] Reduced motion didukung.
-   [ ] Tidak ada aset Table Tales yang disalin.

## 15. Hasil akhir yang diharapkan

Saat pengguna membuka Probability 3D, tampil background terang yang
elegan dengan tagline kecil di bagian atas. Tulisan **PROBABILITAS** dan
**STATISTIKA** memenuhi area hero dengan tipografi editorial berukuran
besar. Di belakang judul terdapat garis kurva dan ornamen matematika. Di
bagian depan, ilustrasi dadu, koin, kartu, grafik, dan simbol statistik
tersusun artistik dengan warna aslinya.

Elemen masuk secara bertahap. Beberapa objek bergerak perlahan untuk
menciptakan kedalaman. Di bagian bawah terdapat petunjuk scroll.

Ketika pengguna scroll, judul dan ilustrasi bergerak secara sinematik.
Opening perlahan menghilang dan beranda Probability 3D yang sekarang
muncul dengan mulus. Seluruh fitur beranda tetap sama dan langsung dapat
digunakan.

**Prioritas tertinggi:** opening yang kuat secara visual, tipografi
editorial, animasi entrance dan scroll yang sinematik, transisi mulus ke
beranda lama, serta tidak merusak fitur yang sudah ada.

Gunakan dokumen ini bersama `design.md`. `first-page.md` mengatur
opening dan transisi scroll, sedangkan `design.md` tetap menjadi pedoman
visual global untuk seluruh halaman dan komponen Probability 3D.


## 16. Acuan utama: kemiripan desain dan interaksi Table Tales

Bagian ini memperjelas prioritas referensi. Jika ada perbedaan penafsiran
antara kata "inspirasi" pada bagian lain dan instruksi di sini, ikuti
bagian ini: **buat opening Probability 3D dengan tingkat kemiripan visual
dan perilaku yang sangat tinggi terhadap halaman utama Table Tales**,
tetapi tetap memakai identitas dan aset Probability 3D.

Referensi wajib:
- Website: https://tabletales.crz.studio/
- Screenshot referensi yang dilampirkan pengguna.
- File hasil Inspect/HTML yang dilampirkan pengguna.

### 16.1 Jangan membuat desain generik

Jangan mengubah referensi menjadi landing page SaaS, dashboard, template
edukasi biasa, atau hero standar yang hanya berisi judul di tengah.
Pelajari halaman referensi secara langsung dan tiru prinsip implementasi
visualnya secara dekat, khususnya:
- Komposisi hero memenuhi viewport dan penempatan elemen di setiap sudut.
- Hubungan ukuran, posisi, overlap, dan jarak antara tagline, judul,
  ilustrasi utama, serta objek dekoratif.
- Tipografi display yang tinggi, ekspresif, dan dominan.
- Layering objek yang terasa memiliki kedalaman, bukan kumpulan ikon
  datar yang disusun seperti grid.
- Kontras warna, ruang kosong, detail dekoratif, dan keseimbangan visual.
- Cara konten mengalir dari hero ke section berikutnya.
- Timing, easing, arah gerak, dan kesinambungan animasi saat scroll.

Jangan menyalin konten atau aset Table Tales. Ganti setiap elemen dengan
padanan Probability 3D, tetapi pertahankan fungsi visual dan perannya
dalam komposisi. Contoh: ilustrasi pusat Table Tales diganti dengan
ilustrasi artistik bertema probabilitas/statistika; ornamen permainan
diganti dadu, kartu probabilitas, koin, kurva distribusi, histogram,
grafik, dan simbol statistik.

### 16.2 Standar kemiripan visual

Sebelum coding, bandingkan screenshot referensi dan hasil implementasi
pada ukuran viewport yang sama. Cocokkan:
1. Posisi relatif setiap elemen utama.
2. Skala judul terhadap lebar dan tinggi layar.
3. Ukuran dan titik pusat ilustrasi utama.
4. Persebaran objek pendukung di sekitar ilustrasi.
5. Margin tepi, whitespace, dan kepadatan komposisi.
6. Urutan layer foreground, middle-ground, dan background.
7. Penempatan navigasi, tagline, dan indikator scroll.

Hasil tidak boleh hanya "mirip secara tema". Hasil harus terasa memakai
art direction dan komposisi yang sama, dengan konten Probability 3D.
Lakukan beberapa iterasi screenshot-comparison sampai proporsi dan
hierarki visualnya mendekati referensi.

### 16.3 Standar interaksi dan animasi

Buat pengalaman yang benar-benar interaktif dan kaya animasi, bukan
sekadar elemen yang muncul dengan fade sederhana. Adaptasikan perilaku
yang terlihat pada referensi, termasuk:
- Intro/loading transition yang singkat dan halus, tanpa menahan akses
  pengguna ke halaman.
- Entrance animation berurutan untuk tagline, judul, ilustrasi, dan
  ornamen.
- Gerakan objek yang memiliki variasi timing dan kecepatan.
- Parallax berlapis berdasarkan posisi pointer (desktop) dan scroll.
- Hover interaction yang halus pada objek yang memang sesuai untuk
  diberi respons.
- Scroll-driven animation: elemen bergerak, berubah skala, rotasi,
  posisi, dan opacity secara terkoordinasi.
- Perpindahan antar-scene/section yang terasa menyatu, tanpa flash,
  lompatan layout, atau jeda yang mengganggu.
- Easing yang natural dan konsisten; hindari gerakan linear kaku.
- Interaksi harus tetap berfungsi dengan mouse, keyboard, touch, dan
  perangkat mobile.

Animasi harus terasa seperti satu rangkaian koreografi. Jangan membuat
setiap elemen bergerak secara acak atau terus-menerus dengan kecepatan
sama. Tentukan timeline dan hubungan antaranimasi dengan jelas.

### 16.4 Pemeriksaan website dan file Inspect

Gunakan website referensi dan file Inspect yang dilampirkan sebagai
bahan analisis sebelum implementasi.

File Inspect yang diberikan berupa hasil HTML/server-rendered markup dan
referensi chunk JavaScript/CSS, bukan source code lengkap komponen asli.
Informasi yang terlihat mengindikasikan penggunaan Next.js, komponen
bernama Hero, Portal, SmoothScroll, Loader, PageTransition, dan Navbar,
serta class `lenis`. Nama-nama ini hanya petunjuk untuk memahami struktur
dan perilaku halaman; jangan menganggap file Inspect sebagai source code
asli yang dapat langsung dijalankan atau disalin.

Lakukan hal berikut:
- Periksa website secara langsung melalui browser pada desktop dan mobile.
- Amati urutan animasi saat pertama kali dibuka.
- Amati perubahan posisi dan skala elemen saat scroll ke bawah dan ke atas.
- Amati apakah ada smooth scrolling, transisi halaman, efek pointer,
  hover, atau interaksi khusus.
- Periksa CSS/DOM yang relevan jika browser developer tools tersedia.
- Gunakan hasil Inspect untuk mengenali struktur, font, komponen, dan
  aset yang dirujuk, bukan untuk menyalin bundle minified atau identitas
  visualnya.
- Jangan mengasumsikan nama library tertentu hanya dari nama komponen.
  Pilih implementasi yang cocok dengan project Probability 3D.

### 16.5 Implementasi teknis

- Pertahankan framework, arsitektur, dan dependency yang sudah digunakan
  oleh project Probability 3D.
- Periksa dependency sebelum menambahkan library animasi.
- Jika project sudah menggunakan GSAP, Framer Motion, Motion, Lenis,
  atau library sejenis, evaluasi apakah dapat digunakan kembali.
- Jika belum ada, pilih solusi paling ringan yang dapat menghasilkan
  kualitas gerak yang dibutuhkan. GSAP + ScrollTrigger dapat digunakan
  untuk timeline dan scroll-driven animation jika memang diperlukan.
- Smooth scrolling bersifat opsional dan harus diuji bersama native
  scroll, anchor link, keyboard, touch, dan accessibility.
- Jangan menambahkan dua sistem smooth-scroll sekaligus.
- Gunakan `requestAnimationFrame` atau mekanisme library yang sesuai
  untuk animasi berbasis pointer/scroll; hindari listener berat yang
  memicu render berlebihan.
- Gunakan `transform` dan `opacity` jika memungkinkan.
- Bersihkan event listener, observer, dan animation context saat
  komponen unmount.
- Hormati `prefers-reduced-motion`; sediakan versi gerak minimal.
- Jangan mengunci scroll dan jangan memaksa pengguna menonton intro.

### 16.6 Identitas Probability 3D tetap dipertahankan

Kemiripan dengan Table Tales berlaku untuk art direction, layout,
komposisi, ritme, dan perilaku interaksi—bukan untuk menyalin merek.
Wajib tetap menggunakan:
- Nama dan logo Probability 3D.
- Judul `PROBABILITAS` dan `STATISTIKA`.
- Palet putih-hijau Probability 3D yang sudah ditentukan.
- Ilustrasi orisinal bertema probabilitas dan statistika.
- Bahasa dan supporting statement Probability 3D.
- Seluruh konten, fitur, navigasi, dan fungsi beranda Probability 3D.

Jangan memakai screenshot Table Tales sebagai background website atau
menjadikan satu gambar screenshot sebagai pengganti implementasi HTML,
CSS, dan animasi yang sebenarnya.

### 16.7 Kriteria penerimaan tambahan

Implementasi dianggap selesai hanya jika:
- [ ] Komposisi opening secara visual sangat dekat dengan referensi.
- [ ] Skala, posisi, dan layering elemen telah dibandingkan pada viewport
      yang sama.
- [ ] Entrance animation memiliki urutan dan timing yang disengaja.
- [ ] Scroll mengendalikan perubahan scene secara halus dan konsisten.
- [ ] Pointer/hover interaction berfungsi di desktop jika relevan.
- [ ] Mobile tetap terasa dirancang, bukan sekadar desktop yang dikecilkan.
- [ ] Animasi tidak mengganggu keterbacaan atau navigasi.
- [ ] Tidak ada aset, logo, atau teks Table Tales yang disalin.
- [ ] Beranda Probability 3D dan semua fiturnya tetap berfungsi.

**Instruksi akhir untuk coding agent:** jangan berhenti setelah membuat
versi pertama. Jalankan project, buka hasilnya di browser, bandingkan
dengan referensi pada ukuran layar yang sama, perbaiki perbedaan
komposisi dan animasi, lalu ulangi sampai kualitas visual dan interaksinya
mendekati referensi semaksimal mungkin tanpa menyalin aset atau identitas
Table Tales.
