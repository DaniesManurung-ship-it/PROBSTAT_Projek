# DESIGN.md --- Probability 3D

## Panduan Desain UI/UX, Visual, Animasi, dan Design System

Dokumen ini menjadi pedoman utama desain antarmuka Probability 3D. Semua
halaman, komponen, visualisasi, dan interaksi harus mengikuti aturan ini
agar tampilan website konsisten.

------------------------------------------------------------------------

# 1. Arah dan Identitas Desain

Buat Probability 3D sebagai platform pembelajaran Probabilitas dan
Statistika yang modern, segar, interaktif, dan premium.

**Konsep visual utama: Soft Green Glassmorphism + Pastel Gradient +
Smooth Motion.**

Karakter desain: - Estetik, minimalis, bersih, dan elegan. - Terang dan
menyegarkan, bukan dark theme. - Glassmorphism pada navbar, sidebar,
card, panel, modal, dan komponen tertentu. - Background pastel dengan
gradasi lembut. - Animasi halus pada interaksi. - Keterbacaan dan
kenyamanan belajar tetap menjadi prioritas. - Tidak terlihat seperti
template dashboard generik.

Gunakan gambar referensi glassmorphism yang diberikan sebagai arah
visual: latar pastel hijau-mint, bentuk lingkaran transparan yang
melayang, panel kaca buram, border putih tipis, dan pencahayaan lembut.
Terapkan prinsip visualnya, bukan menyalin komposisinya secara mentah.

# 2. Sistem Warna

Putih dan hijau adalah identitas utama website. Namun, bukan berarti
semua objek di dalam website harus berwarna hijau.

## 2.1 Warna UI dan lingkungan

  Token            Warna       Penggunaan
  ---------------- ----------- ---------------------------------
  Primary Green    `#249B68`   Tombol utama, menu aktif, aksen
  Deep Green       `#176B4B`   Heading dan teks aksen
  Soft Mint        `#DDF5E8`   Highlight dan permukaan lembut
  Pale Green       `#ECF9EF`   Background pendukung
  White            `#FFFFFF`   Panel dan permukaan utama
  Warm White       `#FAFCFA`   Background konten
  Main Text        `#24352D`   Teks utama
  Secondary Text   `#718078`   Deskripsi dan label
  Border           `#E3EEE7`   Garis pembatas

## 2.2 Warna pendukung

Gunakan biru lembut, ungu lembut, kuning pastel, oranye lembut, dan
merah lembut hanya untuk membedakan kategori atau status. Setiap warna
harus memiliki fungsi yang jelas.

## 2.3 Warna objek pembelajaran --- aturan penting

Palet hijau-putih hanya untuk lingkungan website dan komponen UI.
**Jangan memaksa objek pembelajaran mengikuti palet tersebut.**

-   Dadu: putih atau ivory dengan titik hitam.
-   Koin: emas, perak, atau tembaga.
-   Bola: merah, biru, kuning, atau warna kategori yang dibutuhkan.
-   Kartu remi: kartu putih dengan simbol merah dan hitam.
-   Grafik: gunakan beberapa warna kategori yang mudah dibedakan.
-   Objek lain: pilih warna berdasarkan bentuk, konteks, dan ketepatan
    konsep.

Jangan otomatis membuat dadu, koin, bola, atau objek eksperimen menjadi
hijau, transparan, atau seperti kaca.

# 3. Background dan Dekorasi

Background harus hidup tetapi tetap lembut dan tidak mengganggu konten.

Gunakan: - Gradient putih ke mint atau hijau pastel. - Soft radial
gradient. - Lingkaran besar transparan di beberapa sudut. - Abstract
blobs dengan blur lembut. - Bentuk geometris transparan sebagai
dekorasi. - Pencahayaan lembut di belakang panel utama.

Contoh gradient:

``` css
background: linear-gradient(135deg, #F7FFF8 0%, #E7F8ED 48%, #EAF9F5 100%);
```

Aturan: 1. Dekorasi boleh berada sebagian di luar viewport agar terasa
organik. 2. Jangan menempatkan dekorasi tepat di belakang teks padat. 3.
Gunakan opacity rendah dan blur secukupnya. 4. Background tidak boleh
membuat teks atau kontrol sulit dibaca. 5. Jangan menggunakan terlalu
banyak bentuk dekoratif dalam satu halaman.

# 4. Glassmorphism System

Glassmorphism harus terlihat seperti kaca buram yang lembut, bukan
sekadar card putih transparan.

Karakteristik: - Background putih semi-transparan. -
`backdrop-filter: blur(...)`. - Border putih transparan. - Shadow lembut
dan menyebar. - Sudut membulat. - Highlight tipis pada tepi atau bagian
atas.

Contoh CSS awal:

``` css
.glass {
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow:
    0 8px 32px rgba(43, 112, 76, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  border-radius: 22px;
}
```

Buat beberapa tingkat permukaan: - **Glass Light:** transparan untuk
navbar dan floating control. - **Glass Medium:** untuk card dan panel
umum. - **Glass Strong:** lebih opaque untuk form atau panel berisi
teks. - **Solid Surface:** putih solid untuk area yang membutuhkan
keterbacaan tinggi.

Jangan menggunakan blur terlalu kuat, menumpuk terlalu banyak lapisan
kaca, atau membuat teks samar. Sediakan fallback background solid jika
`backdrop-filter` tidak didukung.

# 5. Navbar dan Navigasi

Navbar harus menjadi salah satu komponen visual utama.

## 5.1 Top navbar

Jika menggunakan top navbar: - Gunakan floating glass navbar. - Posisi
sticky di bagian atas jika sesuai. - Bentuk rounded pill atau rounded
rectangle. - Background putih transparan. - Border putih tipis dan
shadow lembut. - Logo Probability 3D di sebelah kiri. - Navigasi utama
di tengah. - Profil atau pengaturan di sebelah kanan.

Hover menu: - Background berubah menjadi mint transparan. - Ikon dan
teks berubah menjadi hijau. - Transisi halus sekitar 200--300ms.

Menu aktif: - Background hijau muda. - Ikon dan label hijau tua. -
Hindari indikator aktif yang terlalu mencolok.

## 5.2 Sidebar

Jika halaman membutuhkan sidebar: - Gunakan panel glass yang ringan. -
Lebar konsisten dan tidak terlalu besar. - Ikon Lucide sederhana. -
Label mudah dibaca. - Jarak antarmenu cukup. - Menu aktif menggunakan
highlight hijau pastel.

Jangan menampilkan top navbar dan sidebar dengan terlalu banyak menu
yang sama. Pilih struktur navigasi paling sederhana untuk halaman
tersebut.

# 6. Card Design

Card harus konsisten dan memiliki hierarki visual yang jelas.

## 6.1 Card umum

Gunakan: - Background glass medium atau solid white. - Border tipis. -
Radius sekitar 18--24px. - Padding yang cukup. - Shadow lembut. - Jarak
yang jelas antara judul dan deskripsi.

## 6.2 Card interaktif

Saat hover: - Card bergerak naik sedikit, sekitar 3--5px. - Shadow
bertambah sedikit. - Border berubah menjadi hijau transparan. -
Ilustrasi dapat bergerak sangat halus. - Semua perubahan menggunakan
transisi smooth.

Jangan membuat card membesar berlebihan atau bergerak terus-menerus
tanpa alasan.

## 6.3 Card distribusi

Setiap card distribusi dapat berisi: - Ilustrasi sesuai distribusi. -
Nama distribusi. - Deskripsi singkat. - Status atau progres. - Tombol
atau affordance untuk membuka detail.

Jaga konsistensi ukuran, alignment, dan jarak antarkomponen.

# 7. Button, Input, dan Kontrol

## 7.1 Button

Buat variasi: - Primary: hijau. - Secondary: putih atau glass. -
Tertiary: transparan dengan teks hijau. - Destructive: merah lembut.

Interaksi: - Hover: sedikit lebih terang dan naik tipis. - Active:
sedikit mengecil. - Focus: outline jelas dan accessible. - Disabled:
kontras lebih rendah tetapi tetap terbaca. - Loading: indikator loading
halus.

## 7.2 Input

Input harus: - Memiliki label jelas. - Menggunakan background putih
semi-transparan atau solid. - Border tipis. - Radius sekitar 12--16px. -
Focus ring hijau lembut. - Pesan validasi di dekat input.

Jangan mengandalkan placeholder sebagai pengganti label.

## 7.3 Slider dan dropdown

-   Track slider menggunakan hijau muda.
-   Thumb menggunakan hijau utama.
-   Dropdown memiliki permukaan solid atau glass yang cukup opaque.
-   State hover, focus, selected, dan disabled harus konsisten.

# 8. Tipografi dan Spacing

Gunakan **Plus Jakarta Sans** atau **Inter**.

Aturan: - Heading menggunakan warna hijau tua atau charcoal kehijauan. -
Body text menggunakan warna gelap yang nyaman dibaca. - Secondary text
menggunakan abu-abu kehijauan. - Hindari ukuran teks terlalu kecil. -
Rumus matematika harus memiliki ruang tersendiri.

Gunakan sistem spacing konsisten, misalnya kelipatan 4 atau 8px. Jangan
membuat halaman terlalu padat. Berikan whitespace yang cukup antara
heading, deskripsi, card, dan section.

# 9. Animasi dan Motion Design

Website harus terasa hidup dan interaktif. Terapkan animasi secara
konsisten, tetapi jangan membuat semua objek bergerak tanpa tujuan.

## 9.1 Page transition

-   Fade in ketika halaman dibuka.
-   Sedikit slide-up pada konten utama.
-   Transisi antarhalaman halus.
-   Hindari perpindahan layout mendadak.

## 9.2 Background motion

-   Lingkaran dekoratif bergerak perlahan.
-   Gradient berubah sangat halus.
-   Floating blobs bergerak dengan durasi panjang.
-   Gunakan gerakan kecil agar tidak mengganggu.

## 9.3 Navbar motion

-   Menu highlight berpindah dengan transisi.
-   Ikon memiliki micro-animation ringan.
-   Transparansi navbar dapat berubah secara halus saat scroll.

## 9.4 Card motion

-   Fade-up saat pertama muncul.
-   Stagger animation untuk daftar card.
-   Hover lift.
-   Shadow dan border berubah smooth.

## 9.5 Button motion

-   Hover transition.
-   Active press feedback.
-   Loading animation.
-   Success feedback setelah aksi berhasil.

## 9.6 Learning interaction

-   Progress bar terisi secara animatif.
-   Grafik berubah dengan transisi.
-   Hasil kalkulator muncul bertahap.
-   Simulasi objek bergerak sesuai tindakan pengguna.
-   Feedback kuis muncul dengan animasi singkat.

## 9.7 Durasi dan performa

Panduan awal: - Micro-interaction: 150--250ms. - Hover card:
200--300ms. - Page transition: 250--450ms. - Entrance animation:
350--600ms. - Floating background: 12--25 detik per siklus.

Gunakan easing lembut seperti `ease-out` atau cubic-bezier yang sesuai.
Utamakan transform dan opacity. Hindari animasi berat pada blur, shadow,
dan filter setiap frame.

Hormati `prefers-reduced-motion`. Jika pengguna mengurangi animasi,
nonaktifkan gerakan dekoratif dan pertahankan transisi penting seminimal
mungkin.

# 10. Ilustrasi dan Objek 3D

Gunakan ilustrasi 3D sebagai aksen dan alat bantu pembelajaran, bukan
sebagai dekorasi di setiap bagian.

Arah visual: - Soft lighting. - Natural material. - Bayangan lembut. -
Proporsi realistis. - Warna objek sesuai konteks. - Komposisi sederhana.

Contoh: - Dadu putih dengan titik hitam. - Koin berwarna metalik. - Bola
berwarna sesuai kategori. - Kartu remi dengan warna simbol asli. -
Grafik dan diagram dengan warna kategori berbeda.

**Jangan mengubah semua objek menjadi hijau, mint, transparan, atau
glass material.** Glassmorphism berlaku untuk lingkungan dan UI, bukan
otomatis untuk objek pembelajaran.

# 11. Visualisasi Statistik

Visualisasi harus mudah dibaca dan akurat.

Gunakan: - Background chart putih atau transparan yang cukup opaque. -
Gridline tipis. - Label sumbu jelas. - Tooltip mudah dipahami. - Warna
kategori berbeda. - Animasi perubahan data yang halus.

Hindari: - Grid terlalu kuat. - Label terlalu kecil. - Warna kategori
yang sulit dibedakan. - Efek 3D yang membuat data sulit dibaca. -
Animasi yang mengubah persepsi nilai data.

Jangan mengorbankan akurasi visualisasi demi estetika.

# 12. Modal, Tooltip, dan Feedback

Modal: - Gunakan panel glass strong atau putih solid. - Background
overlay lembut. - Radius konsisten. - Animasi scale kecil dan fade.

Tooltip: - Ringkas. - Kontras cukup. - Muncul dengan fade. - Tidak
menutupi kontrol penting.

Feedback: - Success menggunakan hijau. - Warning menggunakan kuning atau
oranye lembut. - Error menggunakan merah lembut. - Gunakan ikon dan
teks, jangan hanya mengandalkan warna.

# 13. Responsive Design

Pastikan desain tetap estetik dan fungsional pada desktop, laptop,
tablet, dan smartphone.

Ketentuan: - Navbar desktop dapat berubah menjadi drawer atau bottom
navigation. - Grid card menyesuaikan lebar layar. - Panel kalkulator
berubah menjadi susunan vertikal. - Grafik tetap dapat dibaca. - Modal
tidak keluar dari viewport. - Ukuran tombol dan kontrol nyaman
disentuh. - Background dekoratif dapat dikurangi pada layar kecil untuk
menjaga performa.

# 14. Accessibility dan Kenyamanan

-   Pastikan kontras teks memadai.
-   Jangan menggunakan warna sebagai satu-satunya penanda status.
-   Sediakan focus state untuk navigasi keyboard.
-   Gunakan label input yang jelas.
-   Pastikan tombol memiliki area interaksi cukup.
-   Hindari animasi berkedip atau gerakan terlalu cepat.
-   Pastikan konten tetap dapat dibaca tanpa efek blur.
-   Sediakan dukungan reduced motion.

# 15. Konsistensi Implementasi

Sebelum membuat halaman baru, gunakan kembali komponen dan token desain
yang sudah tersedia.

Buat design tokens untuk: - Warna. - Gradient. - Glass surface. -
Shadow. - Border. - Radius. - Typography. - Spacing. - Motion
duration. - Easing.

Gunakan komponen bersama untuk: - Navbar. - Sidebar. - Card. - Button. -
Input. - Dropdown. - Modal. - Progress bar. - Tooltip. - Section
heading.

Jangan membuat style berbeda-beda untuk komponen yang sebenarnya sama.

Jika project sudah memiliki struktur dan komponen yang berfungsi,
pertahankan fungsinya. Fokus pada peningkatan tampilan tanpa merusak
logika aplikasi.

# 16. Checklist Sebelum Desain Dianggap Selesai

-   [ ] Website menggunakan tema terang, bukan dark theme.
-   [ ] Putih dan hijau menjadi identitas utama.
-   [ ] Background memiliki gradient pastel yang lembut.
-   [ ] Dekorasi lingkaran dan blob tidak mengganggu konten.
-   [ ] Navbar memiliki desain glassmorphism yang rapi.
-   [ ] Card memiliki glass effect yang konsisten.
-   [ ] Button dan input memiliki hover, focus, active, dan disabled
    state.
-   [ ] Animasi terasa halus dan tidak berlebihan.
-   [ ] Objek pembelajaran tetap memiliki warna natural.
-   [ ] Grafik statistik mudah dibaca dan akurat.
-   [ ] Seluruh halaman menggunakan design system yang sama.
-   [ ] Tampilan responsif di desktop dan mobile.
-   [ ] Reduced motion didukung.
-   [ ] Tidak ada teks yang sulit dibaca karena transparansi.
-   [ ] Tidak ada dekorasi yang mengganggu interaksi utama.

------------------------------------------------------------------------

# FINAL DESIGN DIRECTION

**Probability 3D harus memiliki tampilan Soft Green Glassmorphism yang
estetik, terang, elegan, dan penuh micro-interactions.**

Bayangkan background pastel mint dengan lingkaran transparan yang
bergerak perlahan, navbar seperti kaca buram yang melayang, card putih
transparan dengan border lembut, tombol hijau yang responsif, serta
ilustrasi dan objek pembelajaran dengan warna aslinya.

Desain harus terasa premium dan menyenangkan untuk digunakan dalam waktu
lama.

**Prioritas tertinggi:** 1. Kenyamanan visual. 2. Konsistensi desain. 3.
Keterbacaan. 4. Animasi yang halus. 5. Glassmorphism yang terlihat nyata
tetapi tidak mengganggu. 6. Objek pembelajaran yang realistis dan mudah
dibedakan.

Jadikan dokumen ini sebagai sumber aturan desain utama untuk seluruh
pengembangan UI Probability 3D.
