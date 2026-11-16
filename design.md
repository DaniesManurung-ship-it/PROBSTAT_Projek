# DESIGN.md — Probability 3D Interactive Library Homepage

## 1. Tujuan desain

Bangun beranda Probability 3D sebagai **perpustakaan interaktif 3D** yang menjadikan buku-buku di rak sebagai navigasi utama website.

Gunakan screenshot referensi yang dilampirkan sebagai acuan utama untuk suasana, komposisi, interaksi, dan cara konten ditampilkan. Hasil akhir harus terasa seperti pengunjung sedang melihat sebuah perpustakaan fisik yang hidup: ada rak kayu, buku-buku dengan sampul berbeda, pencahayaan hangat, jendela, lampu, jam, dan objek dekoratif.

Jangan membuat landing page biasa yang hanya memakai gambar rak sebagai background. Rak, buku, preview, zoom, dan perpindahan tampilan harus benar-benar interaktif dan menjadi bagian dari antarmuka.

**Konsep utama:** setiap buku adalah satu menu/fitur Probability 3D. Pengunjung menjelajahi rak, mengarahkan cursor ke buku untuk melihat preview, membuka buku untuk membaca informasi lebih lengkap, lalu masuk ke halaman fitur yang dipilih.

## 2. Referensi visual dan prinsip desain

Gunakan screenshot yang diberikan sebagai referensi untuk:
- Perpustakaan dengan suasana malam, hangat, tenang, dan sedikit sinematik.
- Rak buku kayu besar sebagai objek utama di tengah halaman.
- Buku-buku berdiri berjajar dengan tinggi, ketebalan, warna, dan kemiringan yang bervariasi.
- Dinding, jendela malam, lampu gantung, jam, vas, dan ornamen sebagai latar.
- Pencahayaan amber/gold yang jatuh pada rak dan punggung buku.
- Informasi buku yang muncul di dekat area buku terpilih.
- Mode eksplorasi berupa buku-buku besar yang tersusun berjajar.
- Transisi yang terasa seperti kamera bergerak mendekati rak atau buku.

Jadikan referensi sebagai pedoman art direction dan pola interaksi. Jangan menyalin logo, nama, teks, ilustrasi, foto, atau aset eksklusif website referensi. Buat seluruh aset dan konten Probability 3D sendiri.

## 3. Art direction

### 3.1 Suasana

- Nuansa perpustakaan klasik yang elegan, hangat, dan imersif.
- Dominasi warna kayu gelap, cokelat tua, espresso, beige, krem, amber, dan gold.
- Gunakan pencahayaan lembut dengan bayangan yang realistis.
- Background dibuat lebih gelap daripada buku agar buku menjadi fokus.
- Berikan tekstur halus pada kayu, sampul buku, kertas, dan dinding.
- Hindari tampilan terlalu ramai, terlalu terang, atau seperti dashboard.

Warna Probability 3D tetap dapat digunakan sebagai aksen identitas pada detail tertentu, label, ikon, atau halaman tujuan. Namun, suasana perpustakaan pada beranda harus tetap menjadi karakter visual utama.

### 3.2 Komposisi utama

- Rak buku menjadi pusat perhatian dan mengisi sebagian besar area visual.
- Rak harus terlihat memiliki kedalaman: sisi kayu, papan horizontal, sekat, bayangan bagian dalam, dan beberapa tingkat rak.
- Buku disusun dengan variasi ukuran dan warna yang terkontrol.
- Sisakan ruang untuk navigasi dan panel informasi agar tidak menutupi seluruh rak.
- Elemen dekorasi seperti jendela, lampu, jam, vas, atau globe mendukung suasana tetapi tidak mengalahkan buku.
- Gunakan perspektif kamera yang konsisten. Jangan membuat rak tampak datar seperti ilustrasi 2D.

### 3.3 Tipografi

- Gunakan tipografi editorial yang elegan dan mudah dibaca.
- Judul buku dapat memakai serif/display font.
- Deskripsi, label, dan kontrol memakai sans-serif yang bersih.
- Teks pada punggung buku harus terbaca pada ukuran desktop yang wajar.
- Jangan menampilkan terlalu banyak paragraf di atas rak.

## 4. Struktur scene beranda

### 4.1 Scene perpustakaan

Scene utama menampilkan satu rak besar dengan beberapa tingkat. Setiap tingkat berisi buku yang dapat dipilih.

Elemen lingkungan yang dapat digunakan:
- Rak kayu besar.
- Jendela dengan pemandangan malam.
- Lampu gantung dengan cahaya hangat.
- Jam dinding atau jam meja.
- Vas dan tanaman/ranting dekoratif.
- Buku-buku tambahan yang tidak menjadi menu.
- Objek kecil seperti dadu, kartu, bola, koin, atau globe sebagai dekorasi bertema pembelajaran.

Objek dekoratif yang bukan menu tidak boleh terlihat seperti tombol navigasi. Buku menu harus dapat dikenali sebagai elemen interaktif.

### 4.2 Navigasi atas

Sediakan navigasi minimal:
- Logo Probability 3D di kiri atas.
- Link seperti About dan Contact bila memang tersedia di project.
- Tombol mode tampilan/menu di kanan atas.
- Ikon garis tiga (hamburger) di pojok kanan atas untuk membuka mode daftar buku.

Navigasi harus tetap terlihat di berbagai tingkat zoom, tetapi tidak mendominasi scene.

### 4.3 Label scene

Tambahkan label kecil, misalnya `Probability 3D Library`, pada area bawah/kiri atau posisi lain yang tidak mengganggu rak. Label ini berfungsi sebagai penanda konteks, bukan judul besar yang menutupi scene.

## 5. Buku sebagai menu navigasi

Setiap buku merupakan pintu masuk ke satu halaman atau fitur Probability 3D.

Contoh kategori buku/menu (sesuaikan dengan halaman yang benar-benar tersedia di project):
- **Dadu** — simulasi pelemparan dadu dan peluang hasil.
- **Kartu** — simulasi kartu, pengambilan kartu, dan peluang kombinasi.
- **Bola** — pengambilan bola dari kotak/urna dan peluang kejadian.
- **Koin** — simulasi lempar koin dan peluang sisi.
- **Probabilitas** — materi dan konsep dasar probabilitas.
- **Statistika** — materi, visualisasi, dan analisis statistika.
- **Distribusi** — distribusi peluang dan visualisasinya.
- **Kalkulator** — alat bantu perhitungan jika fitur tersedia.
- **Latihan** — latihan soal atau kuis jika fitur tersedia.

Jangan membuat menu yang mengarah ke halaman kosong. Jika suatu halaman belum tersedia, tandai sebagai belum tersedia atau jangan tampilkan sebagai buku aktif.

### 5.1 Desain buku

Setiap buku memiliki:
- Warna sampul/punggung berbeda tetapi tetap harmonis dengan palet perpustakaan.
- Judul pendek yang terbaca pada punggung buku.
- Nomor atau kode kecil bila sesuai.
- Ketebalan dan tinggi yang bervariasi.
- Material seperti kain, kulit, kertas, atau hardcover.
- Bayangan kontak pada rak agar terasa menempel secara fisik.

Buku-buku menu harus memiliki hit area yang cukup besar. Area klik tidak boleh hanya berupa teks kecil pada punggung buku.

## 6. Interaksi hover: buku maju dan preview muncul

Saat cursor diarahkan ke salah satu buku dalam mode rak normal:

1. Buku bergerak maju keluar dari rak ke arah kamera.
2. Buku dapat sedikit membesar dan berotasi untuk menonjolkan punggung atau sampulnya.
3. Buku lain tetap berada di rak dan sedikit meredup bila diperlukan.
4. Muncul jendela informasi ringkas untuk buku yang sedang di-hover.
5. Muncul preview kecil yang menggambarkan halaman tujuan.
6. Preview menampilkan judul halaman, ilustrasi/thumbnail fitur, dan deskripsi singkat.
7. Transisi harus halus, tidak berkedip, dan tidak membuat layout meloncat.

Isi panel hover:
- Nama fitur.
- Satu kalimat penjelasan.
- Ilustrasi kecil atau cuplikan antarmuka halaman tujuan.
- Petunjuk tindakan, misalnya `Klik untuk membuka buku`.

Panel preview harus muncul pada posisi yang tidak menutupi buku yang sedang dipilih. Jika ruang tidak cukup, pindahkan panel ke sisi layar yang memiliki ruang lebih luas.

### 6.1 Perilaku cursor

- Hover harus terasa responsif, tetapi tidak terlalu sensitif.
- Gunakan jeda singkat yang wajar sebelum preview muncul agar panel tidak berkedip ketika cursor melewati banyak buku.
- Ketika cursor keluar dari buku dan panel preview, buku kembali ke posisi semula.
- Perpindahan cursor dari buku ke panel preview tidak boleh langsung menutup panel.
- Pada perangkat touch, gunakan tap untuk memilih buku; jangan mengandalkan hover.

## 7. Klik buku pada mode rak normal

Gunakan interaksi dua tahap agar pengunjung dapat melihat informasi sebelum berpindah halaman.

### Tahap 1 — Buka buku

Ketika buku diklik:
- Buku bergerak lebih jauh ke depan.
- Buku menampilkan animasi terbuka, seolah sampulnya dibuka.
- Tampilkan jendela/detail panel yang lebih besar daripada preview hover.
- Background/rak dapat sedikit diredupkan untuk menonjolkan detail.
- Panel menampilkan informasi fitur yang lebih lengkap.

Isi jendela detail:
- Nama fitur.
- Deskripsi yang lebih lengkap.
- Gambaran/thumbnail halaman tujuan.
- Informasi singkat tentang apa yang dapat dilakukan pengunjung di halaman tersebut.
- Tombol `Masuk ke halaman` atau `Buka fitur`.
- Kontrol `Tutup` atau cara kembali ke rak.

### Tahap 2 — Masuk ke halaman

Ketika pengunjung mengklik tombol `Masuk ke halaman`, atau mengklik buku yang sudah terbuka sesuai pola interaksi yang dipilih:
- Jalankan transisi masuk ke halaman tujuan.
- Gunakan animasi kamera mendekat, halaman buku terbuka, atau transisi visual lain yang konsisten.
- Navigasikan ke route/URL fitur yang benar.
- Jangan mengarahkan pengguna hanya berdasarkan teks judul; gunakan mapping route yang eksplisit untuk setiap buku.

Penting:
- Klik pertama pada buku dalam mode rak normal membuka detail buku, bukan langsung berpindah halaman.
- Aksi kedua yang jelas membawa pengguna ke halaman fitur.
- Sediakan cara kembali ke rak tanpa harus me-refresh browser.
- Klik di luar panel hanya menutup panel jika tidak berisiko menghilangkan progres atau mengganggu navigasi.

## 8. Tombol hamburger: mode semua buku berjajar

Ketika tombol garis tiga di pojok kanan atas diklik, aktifkan **Book Overview / Book Selection Mode**.

Perilaku:
1. Rak dan lingkungan dapat bergerak mundur, mengecil, atau sedikit diredupkan.
2. Buku-buku menu keluar dari posisi rak secara terkoordinasi.
3. Semua buku tersusun berjajar dalam satu baris atau susunan horizontal yang rapi.
4. Susunan harus menyesuaikan lebar layar. Jika jumlah buku banyak, gunakan horizontal scrolling, carousel, atau baris bertingkat yang tetap mudah dipahami.
5. Buku tetap tampak tiga dimensi dan memiliki jarak yang cukup.
6. Tampilkan judul/label mode, misalnya `Pilih Buku`.
7. Tombol hamburger berubah menjadi tombol close/back yang jelas untuk kembali ke mode rak normal.

### 8.1 Hover pada mode semua buku

Saat cursor diarahkan ke salah satu buku:
- Buku yang dipilih maju ke depan dan sedikit membesar.
- Buku lain dapat sedikit bergeser atau meredup, tetapi tetap terlihat.
- Muncul jendela preview berisi judul, deskripsi singkat, dan gambaran kecil halaman tujuan.
- Preview berpindah dengan halus ketika cursor berpindah ke buku lain.
- Jangan menampilkan beberapa preview sekaligus.

### 8.2 Klik pada mode semua buku

Ketika buku diklik:
- Buka detail buku atau langsung tampilkan panel detail yang sama dengan tahap pertama pada mode rak normal.
- Dari panel detail, pengguna dapat menekan `Masuk ke halaman`.
- Jangan membuat perilaku klik berbeda-beda antar buku.

Mode ini harus menjadi alternatif navigasi yang lebih cepat, bukan halaman baru yang memutus konteks perpustakaan.

## 9. Zoom in dan zoom out

Beranda harus mendukung zoom in dan zoom out agar pengunjung dapat melihat rak secara dekat maupun keseluruhan.

Sediakan:
- Zoom in.
- Zoom out.
- Reset zoom / kembali ke tampilan awal.
- Dukungan scroll wheel atau trackpad dengan perilaku yang terkontrol.
- Dukungan pinch-to-zoom pada perangkat touch jika memungkinkan.

Aturan zoom:
- Zoom berpusat pada posisi pointer atau titik fokus yang masuk akal.
- Zoom tidak boleh membuat pengunjung kehilangan rak atau tidak tahu posisi kamera.
- Batasi nilai minimum dan maksimum zoom.
- Pergerakan kamera harus halus dan tidak melompat.
- Navigasi atas dan kontrol zoom tetap dapat diakses.
- Ketika detail buku terbuka, hindari zoom scene yang mengganggu panel detail.
- Sediakan tombol reset agar pengguna dapat kembali ke komposisi awal kapan saja.

Jika implementasi menggunakan kamera 3D, kontrol zoom dapat mengubah jarak kamera terhadap rak. Jika menggunakan scene 2.5D, gunakan transform scale/position dengan batas yang tepat. Jangan memperbesar seluruh halaman secara membabi buta hingga navigasi dan teks ikut rusak.

## 10. Animasi dan transisi

Animasi harus terasa seperti objek fisik yang memiliki berat, bukan elemen UI yang bergerak kaku.

### 10.1 Animasi ambient

- Cahaya lampu sedikit berdenyut secara sangat halus.
- Partikel debu kecil dapat terlihat di area cahaya jika performa memungkinkan.
- Ornamen tertentu dapat bergerak perlahan.
- Hindari gerakan dekorasi berlebihan yang mengalihkan fokus.

### 10.2 Animasi buku

- Hover: buku maju, sedikit membesar, dan dapat berotasi.
- Unhover: buku kembali ke posisi rak dengan easing yang natural.
- Select: buku bergerak lebih jauh ke depan.
- Open: sampul buku terbuka dengan gerakan engsel yang meyakinkan jika aset/teknologi memungkinkan.
- Detail: panel informasi muncul dengan transisi opacity dan transform.
- Navigate: gunakan transisi visual yang menghubungkan buku dengan halaman tujuan.

### 10.3 Animasi mode overview

- Buku bergerak keluar dari rak secara berurutan atau staggered.
- Susunan buku terbentuk secara halus.
- Buku terpilih merespons hover dengan jelas.
- Saat kembali ke mode rak, buku kembali ke posisi awalnya secara terkoordinasi.

### 10.4 Kualitas gerak

- Gunakan easing natural seperti ease-out untuk gerak mendekat dan ease-in-out untuk transisi antar-mode.
- Gunakan durasi yang konsisten dan tidak terlalu lambat.
- Hindari animasi yang membuat pengguna menunggu.
- Hindari efek bounce berlebihan.
- Jangan menjalankan banyak animasi berat secara bersamaan tanpa alasan.
- Hormati `prefers-reduced-motion` dengan menyediakan versi animasi minimal.

## 11. Responsif: desktop, tablet, dan mobile

### Desktop

- Pengalaman utama menggunakan pointer dan hover.
- Rak tampil besar dan menjadi pusat komposisi.
- Hover preview dan zoom harus berfungsi.
- Mode semua buku berjajar mudah diakses.

### Tablet

- Sesuaikan ukuran rak dan jumlah buku yang terlihat.
- Gunakan tap untuk memilih buku.
- Panel detail tidak boleh menutupi seluruh konteks jika masih ada ruang.

### Mobile

- Jangan memaksakan tampilan desktop yang diperkecil.
- Gunakan tap untuk memilih buku dan membuka preview/detail.
- Sediakan tombol zoom yang mudah dijangkau.
- Mode overview dapat memakai horizontal carousel atau daftar buku yang dapat digeser.
- Panel detail dapat tampil sebagai drawer atau modal layar penuh.
- Pastikan tombol close/back selalu terlihat.
- Hindari interaksi yang hanya bisa dilakukan dengan hover.

## 12. Aksesibilitas dan kemudahan penggunaan

- Semua buku menu harus dapat dipilih dengan keyboard.
- Tampilkan focus state yang terlihat.
- Gunakan label aksesibel untuk tombol hamburger, zoom, close, dan navigasi.
- Jangan mengandalkan warna saja untuk menunjukkan buku yang aktif.
- Kontras teks harus cukup.
- Berikan alternatif navigasi berbasis daftar untuk pengguna yang kesulitan menggunakan scene 3D.
- Pastikan pengguna dapat keluar dari mode overview dan panel detail dengan tombol Escape jika sesuai.
- Jangan mengunci scroll atau membuat pengguna terjebak dalam scene.

## 13. Arsitektur konten dan routing

Data buku sebaiknya dikelola secara terstruktur, bukan ditulis berulang di banyak komponen.

Setiap item buku minimal memiliki:
- `id`
- `title`
- `shortDescription`
- `description`
- `coverColor` atau referensi material
- `thumbnail` / preview image
- `route`
- `shelfPosition`
- `overviewPosition` atau urutan pada mode overview
- `available`

Gunakan satu sumber data untuk:
- Buku yang muncul di rak.
- Buku pada mode overview.
- Panel hover.
- Panel detail.
- Navigasi ke halaman tujuan.

Pastikan setiap `route` sesuai dengan halaman yang benar-benar ada. Jangan membuat tautan palsu atau tombol yang tidak memiliki aksi.

## 14. Ketentuan implementasi teknis

Sebelum mengubah kode:
1. Periksa framework, struktur folder, routing, dependency, dan komponen yang sudah ada.
2. Pertahankan arsitektur project Probability 3D yang sudah berjalan.
3. Identifikasi apakah project menggunakan Three.js, React Three Fiber, Spline, GSAP, Motion, atau library lain.
4. Gunakan teknologi yang sudah tersedia jika memadai.
5. Jangan memasang beberapa library yang memiliki fungsi sama tanpa kebutuhan jelas.

Pilih pendekatan visual sesuai kemampuan project:
- 3D penuh untuk rak, kamera, buku, pencahayaan, dan interaksi fisik jika project mendukung.
- 2.5D/parallax dengan layer terpisah jika lebih ringan dan cukup untuk hasil yang dituju.
- Jangan mengganti scene dengan satu screenshot statis.
- Jika memakai model 3D, optimalkan polygon, tekstur, ukuran file, dan loading.
- Lazy-load aset yang tidak langsung terlihat.
- Sediakan fallback jika WebGL atau fitur 3D tidak tersedia.

Performa:
- Targetkan pengalaman yang lancar pada perangkat desktop menengah.
- Hindari render ulang seluruh scene hanya karena cursor bergerak.
- Gunakan event handling dan animation loop yang efisien.
- Batasi jumlah partikel, shadow map, dan efek post-processing.
- Bersihkan event listener, observer, dan animation context ketika komponen dilepas.
- Tampilkan loading state yang elegan jika aset 3D perlu dimuat.

## 15. Struktur komponen yang disarankan

Nama komponen berikut adalah saran, bukan kewajiban. Sesuaikan dengan struktur project yang sudah ada.

- `LibraryScene` — scene utama dan pengaturan kamera.
- `LibraryEnvironment` — dinding, jendela, lampu, jam, dan dekorasi.
- `Bookshelf` — model rak dan tingkat rak.
- `BookItem` — satu buku yang dapat di-hover dan dipilih.
- `BookHoverPreview` — panel informasi ringkas saat hover.
- `BookDetailPanel` — jendela detail setelah buku dipilih.
- `BookOverviewMode` — mode semua buku berjajar.
- `LibraryNavigation` — logo, link, hamburger, dan kontrol navigasi.
- `ZoomControls` — zoom in, zoom out, dan reset.
- `PageTransition` — transisi menuju halaman fitur.

Hindari menaruh seluruh logika scene, data buku, panel, dan routing dalam satu komponen besar.

## 16. Alur interaksi yang wajib diuji

### Alur A — Menjelajahi rak

1. Pengunjung membuka beranda.
2. Scene perpustakaan terlihat dengan buku-buku di rak.
3. Pengunjung mengarahkan cursor ke buku Dadu.
4. Buku Dadu bergerak maju.
5. Preview Dadu muncul berisi deskripsi dan gambaran kecil halaman.
6. Pengunjung menggerakkan cursor ke buku lain.
7. Preview berpindah dan buku sebelumnya kembali ke posisi semula.

### Alur B — Membuka detail dan masuk fitur

1. Pengunjung mengklik buku Kartu.
2. Buku bergerak ke depan dan terbuka.
3. Panel detail Kartu muncul.
4. Panel menampilkan deskripsi dan preview yang lebih besar.
5. Pengunjung menekan `Masuk ke halaman`.
6. Website berpindah ke halaman Kartu yang benar.

### Alur C — Mode semua buku

1. Pengunjung mengklik hamburger di kanan atas.
2. Semua buku menu bergerak keluar dari rak.
3. Buku tersusun berjajar dengan rapi.
4. Pengunjung mengarahkan cursor ke buku Bola.
5. Buku Bola maju dan preview halaman Bola muncul.
6. Pengunjung memilih buku dan membuka detail.
7. Pengunjung dapat masuk ke halaman Bola atau kembali ke mode rak.

### Alur D — Zoom

1. Pengunjung melakukan zoom in.
2. Kamera mendekati rak tanpa mengubah proporsi objek secara aneh.
3. Pengunjung melakukan zoom out.
4. Pengunjung menekan reset.
5. Scene kembali ke komposisi awal.

### Alur E — Mobile

1. Pengunjung membuka beranda melalui smartphone.
2. Pengunjung tap salah satu buku.
3. Preview/detail muncul tanpa memerlukan hover.
4. Pengunjung dapat menutup detail dan memilih buku lain.
5. Pengunjung dapat masuk ke halaman tujuan.
6. Semua kontrol tetap dapat digunakan dengan touch.

## 17. Kriteria penerimaan

Desain dianggap selesai jika semua poin berikut terpenuhi:

- [ ] Beranda benar-benar terasa seperti perpustakaan interaktif sesuai screenshot referensi.
- [ ] Rak buku menjadi pusat visual dan bukan sekadar background.
- [ ] Buku menu memiliki tampilan 3D/berlapis dan posisi yang konsisten.
- [ ] Hover membuat buku maju dari rak.
- [ ] Hover menampilkan informasi singkat dan preview visual halaman tujuan.
- [ ] Klik pertama pada buku di mode rak membuka buku dan menampilkan detail lebih lengkap.
- [ ] Pengunjung dapat masuk ke halaman tujuan melalui aksi yang jelas.
- [ ] Hamburger mengaktifkan mode semua buku berjajar.
- [ ] Hover pada mode berjajar juga menampilkan preview.
- [ ] Pengunjung dapat kembali dari mode berjajar ke mode rak.
- [ ] Zoom in, zoom out, dan reset berfungsi.
- [ ] Semua buku memiliki route yang benar.
- [ ] Interaksi dapat digunakan pada desktop, tablet, dan mobile.
- [ ] Tidak ada tombol atau buku yang terlihat interaktif tetapi tidak berfungsi.
- [ ] Animasi halus dan tidak mengganggu performa.
- [ ] Tersedia fallback untuk reduced motion dan perangkat tanpa dukungan 3D.
- [ ] Tidak ada aset atau identitas eksklusif dari website referensi yang disalin.

## 18. Instruksi akhir untuk coding agent

Jangan hanya membuat mockup visual. Implementasikan scene perpustakaan dan seluruh interaksi buku sebagai bagian nyata dari website.

Kerjakan secara bertahap:
1. Bangun environment perpustakaan dan rak.
2. Tambahkan buku-buku menu dengan data dan route yang benar.
3. Implementasikan hover: buku maju + preview.
4. Implementasikan klik: buku terbuka + detail panel + navigasi.
5. Implementasikan hamburger: semua buku berjajar + preview.
6. Implementasikan zoom in, zoom out, dan reset.
7. Tambahkan animasi dan transisi.
8. Optimalkan responsivitas dan performa.
9. Jalankan project dan uji seluruh alur interaksi.
10. Bandingkan hasil dengan screenshot referensi, lalu perbaiki komposisi, skala, pencahayaan, dan gerakan.

**Prioritas tertinggi:** pengalaman menjelajahi buku harus terasa intuitif dan memuaskan. Pengunjung harus langsung memahami bahwa buku-buku di rak adalah menu yang bisa dijelajahi, di-preview, dibuka, dan dipilih untuk masuk ke fitur Probability 3D.
