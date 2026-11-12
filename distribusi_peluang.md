# DISTRIBUSI PELUANG KONTINU --- SPESIFIKASI FITUR KALKULATOR INTERAKTIF

## 1. Tujuan

Dokumen ini menjadi panduan implementasi materi **Distribusi Peluang
Kontinu** pada aplikasi Probability 3D. Fitur dibuat sebagai kumpulan
kalkulator interaktif: pengguna membaca konsep dan komponen rumus
terlebih dahulu, mengisi nilai pada kalkulator, melihat hasil
perhitungan, lalu mempelajari pembahasan langkah demi langkah.

Materi mengikuti modul *Distribusi Peluang Kontinu: Seragam Kontinu,
Normal, Pendekatan Binomial--Normal* dari SML \| IT Del. Kalkulator yang
dibuat:

1.  Distribusi Seragam Kontinu (Uniform)
2.  Distribusi Normal (peluang, standardisasi Z, dan mencari nilai batas)
3.  Distribusi Rata-Rata Sampel (X̄) dan Standard Error
4.  Pendekatan Binomial dengan Distribusi Normal (koreksi kontinuitas)

**Catatan ruang lingkup:**

-   Modul menyebut Exponential, Gamma, dan Weibull hanya sebagai contoh
    distribusi kontinu lain. Jangan membuat kalkulator untuk ketiganya.
    Cukup tampilkan sebagai satu kalimat pengantar di halaman konsep
    dasar (bagian 4.0).
-   Distribusi Binomial sendiri adalah materi **diskrit** dan sudah
    dibahas di fitur Distribusi Diskrit. Pada fitur ini Binomial hanya
    muncul sebagai objek yang **dihampiri** oleh Normal. Jangan
    menduplikasi kalkulator Binomial.
-   Pada distribusi kontinu, fungsi yang dipakai adalah **fungsi
    densitas peluang (PDF)** dan **fungsi distribusi kumulatif (CDF)**.
    Jangan memakai istilah PMF di fitur ini, kecuali saat menjelaskan
    Binomial pada bagian pendekatan.

------------------------------------------------------------------------

## 2. Konsep pengalaman pengguna

Setiap distribusi menggunakan pola halaman yang konsisten. Urutan konten
dari atas ke bawah wajib seperti berikut.

### A. Pengenalan materi

Tampilkan:

-   Nama distribusi.
-   Penjelasan singkat dengan bahasa sederhana.
-   Kapan distribusi tersebut digunakan.
-   Ciri-ciri atau syarat penggunaan.
-   Contoh situasi sehari-hari.

### B. Rumus dan komponen rumus

Tampilkan rumus utama dengan format matematika yang mudah dibaca. Tepat
di bawah rumus, tampilkan penjelasan setiap simbol dalam bentuk daftar
atau kartu kecil.

Jangan hanya menampilkan simbol seperti `μ`, `σ`, atau `Z`. Jelaskan
arti simbol, satuan/konteksnya, dan contoh nilai.

### C. Kalkulator interaktif

Pengguna mengisi nilai sendiri melalui input angka, dropdown, atau
kontrol yang sesuai. Berikan nilai awal contoh agar kalkulator bisa
langsung dicoba.

Kalkulator minimal menyediakan:

-   Label input yang jelas.
-   Petunjuk singkat untuk setiap input (termasuk satuan, misalnya
    menit, gram, mm).
-   Validasi langsung.
-   Tombol **Hitung Peluang**.
-   Tombol **Reset**.
-   Pemilihan jenis kejadian (kurang dari, lebih dari, antara).
-   Daftar **Contoh dari Modul** (dropdown/tombol) yang mengisi input
    dengan soal contoh di modul, agar pengguna bisa langsung
    membandingkan hasil dengan pembahasan di modul.

Jangan meminta pengguna menulis rumus atau membuka tabel normal baku
secara manual. Aplikasi yang menyusun rumus, menstandardisasi, dan
menghitung hasil.

### D. Hasil perhitungan

Setelah tombol **Hitung Peluang** ditekan, tampilkan:

-   Jenis distribusi yang digunakan.
-   Nilai parameter yang dimasukkan.
-   Bentuk kejadian yang dihitung, misalnya `P(12 ≤ X ≤ 16)`.
-   Hasil dalam desimal.
-   Hasil dalam persentase.
-   Nilai antara yang penting: nilai `Z`, `SE`, `Φ(z)`, atau rasio
    panjang interval, sesuai distribusinya.

Hasil utama harus mudah ditemukan, tetapi jangan menyembunyikan proses
perhitungannya.

### E. Pembahasan langkah demi langkah

Di bawah hasil, tampilkan penjelasan yang berubah sesuai input pengguna.
Susun minimal menjadi:

1.  **Identifikasi distribusi** --- jelaskan mengapa distribusi tersebut
    sesuai dengan kondisi soal.
2.  **Tentukan nilai yang diketahui** --- tuliskan parameter dan
    artinya.
3.  **Terjemahkan soal menjadi kejadian peluang** --- ubah kalimat
    seperti "kurang dari", "lebih dari", atau "antara" menjadi bentuk
    `P(...)`.
4.  **Pilih rumus** --- tampilkan rumus yang sesuai dengan jenis
    kejadian.
5.  **Substitusi nilai** --- masukkan nilai pengguna ke rumus.
6.  **Perhitungan** --- standardisasi ke `Z`, hitung `SE`, terapkan
    koreksi kontinuitas, atau hitung rasio interval, secara bertahap.
7.  **Hasil akhir** --- tampilkan peluang desimal dan persentase.
8.  **Pemeriksaan kewajaran** --- konfirmasi bahwa `0 ≤ P ≤ 1`.
9.  **Interpretasi** --- jelaskan arti hasil dalam konteks soal dengan
    kalimat sederhana.

Gunakan kalimat yang mudah dipahami mahasiswa pemula. Hindari hanya
menampilkan rangkaian angka tanpa penjelasan.

### F. Visualisasi pendukung

Pada distribusi kontinu, **peluang adalah luas di bawah kurva**.
Visualisasi harus memperlihatkan hal itu:

-   Gambar kurva PDF sesuai parameter pengguna.
-   **Arsir daerah** yang sedang dihitung (di sebelah kiri, kanan, atau
    di antara dua batas).
-   Beri label batas pada sumbu `X` (dan sumbu `Z` bila relevan).
-   Visualisasi bersifat pendukung; nilai hasil tetap berasal dari
    fungsi matematika, bukan dari animasi atau perhitungan luas piksel.

------------------------------------------------------------------------

## 3. Navigasi dan susunan materi

Buat satu halaman atau bagian **Distribusi Peluang Kontinu** dengan satu
halaman konsep dasar dan empat kalkulator. Pengguna dapat berpindah
bagian melalui tab, kartu, atau navigasi samping.

Urutan yang disarankan:

1.  Konsep Dasar (PDF, CDF, peluang = luas)
2.  Seragam Kontinu (Uniform)
3.  Normal
4.  Rata-Rata Sampel (X̄)
5.  Pendekatan Binomial--Normal

Pada halaman utama, tampilkan ringkasan pemilihan distribusi:

  -----------------------------------------------------------------------
  Distribusi                          Kapan digunakan?
  ----------------------------------- -----------------------------------
  Seragam Kontinu                     Nilai bisa berada di mana saja pada
                                      interval `[a, b]` dengan kepadatan
                                      yang sama

  Normal                              Pengukuran berbentuk lonceng dengan
                                      mean `μ` dan simpangan baku `σ`

  Rata-Rata Sampel (X̄)                Peluang untuk **rata-rata** `n`
                                      pengamatan, bukan satu pengamatan

  Pendekatan Binomial--Normal         Peluang Binomial dengan `n` besar
                                      dan `p` tidak terlalu dekat 0 atau 1
  -----------------------------------------------------------------------

Tambahkan pengingat: **kenali jenis variabel (kontinu atau diskret)
terlebih dahulu, baru pilih distribusinya.**

Tambahkan juga panel **Alur Penyelesaian Soal** (lihat bagian 5.5) yang
dapat dibuka dari semua halaman.

------------------------------------------------------------------------

# 4. Rincian setiap kalkulator

## 4.0 Konsep Dasar Distribusi Kontinu

Halaman ini berupa materi bacaan dengan satu visualisasi sederhana. Tidak
perlu kalkulator tersendiri.

### Isi yang ditampilkan

1.  Variabel acak kontinu dapat mengambil nilai pada suatu interval.
    Peluang tepat pada satu titik adalah `P(X = x) = 0`.
2.  Peluang dinyatakan sebagai **luas di bawah kurva** fungsi densitas
    peluang (PDF) `f(x)`.
3.  Syarat PDF: `f(x) ≥ 0` dan luas total di bawah kurva `= 1`.
4.  CDF: `F(x) = P(X ≤ x)`, yaitu luas dari paling kiri sampai `x`.
5.  Karena `P(X = x) = 0`, batas terbuka dan tertutup tidak mengubah
    peluang: `P(X < c) = P(X ≤ c)`.
6.  Contoh distribusi kontinu lain (Exponential, Gamma, Weibull) hanya
    disebut sebagai informasi.
7.  Pilih distribusi berdasarkan bentuk data/proses dan asumsi model,
    bukan karena rumusnya mudah.

### Rumus

$$F(x)=P(X\le x)=\int_{-\infty}^{x} f(t)\,dt$$

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `f(x)`                              Fungsi densitas peluang (PDF):
                                      tinggi kurva di titik `x`. Bukan
                                      peluang itu sendiri

  `F(x)`                              CDF: peluang `X` bernilai kurang
                                      dari atau sama dengan `x`

  `∫`                                 Luas di bawah kurva `f` pada
                                      rentang tertentu

  `P(c ≤ X ≤ d)`                      Luas di bawah kurva antara `c` dan
                                      `d`, yaitu `F(d) − F(c)`
  -----------------------------------------------------------------------

### Visualisasi

Tampilkan satu kurva dengan satu daerah berarsir dan label
`Peluang = luas daerah arsir`. Berikan pengguna dua penggeser batas `c`
dan `d` sebagai ilustrasi saja; nilai peluang pada halaman ini tidak
perlu dihitung secara numerik.

------------------------------------------------------------------------

## 4.1 Distribusi Seragam Kontinu (Uniform)

### Pengertian

Jika `X ~ Uniform(a, b)`, semua nilai dalam interval `[a, b]` memiliki
kepadatan yang sama. Peluang hanya bergantung pada **panjang interval**
yang ditanyakan, selama interval berada di dalam `[a, b]`.

Contoh:

-   Waktu tunggu bus yang tiba kapan saja antara menit ke-10 dan ke-20.
-   Waktu proses mesin yang tersebar merata antara 4 dan 10 menit.
-   Galat pembulatan yang tersebar merata pada rentang tertentu.

### Syarat penggunaan

1.  Nilai `X` berada pada interval tertutup `[a, b]` dengan `a < b`.
2.  Semua nilai dalam interval dianggap sama mungkin (kepadatan
    konstan).
3.  Tidak ada nilai di luar `[a, b]`.

### Rumus

$$f(x)=\frac{1}{b-a},\quad a\le x\le b \qquad
F(x)=\frac{x-a}{b-a},\quad a\le x\le b$$

$$P(c\le X\le d)=\frac{d-c}{b-a}$$

$$E(X)=\frac{a+b}{2} \qquad Var(X)=\frac{(b-a)^2}{12}$$

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `a`                                 Batas bawah interval (nilai
                                      terkecil yang mungkin)

  `b`                                 Batas atas interval (nilai terbesar
                                      yang mungkin)

  `b − a`                             Panjang seluruh interval

  `f(x) = 1/(b−a)`                    Tinggi kurva yang sama di seluruh
                                      interval; berbentuk persegi panjang

  `c`, `d`                            Batas interval yang ditanyakan,
                                      dengan `a ≤ c ≤ d ≤ b`

  `d − c`                             Panjang interval yang ditanyakan

  `E(X)`                              Mean (rata-rata): titik tengah
                                      interval

  `Var(X)`                            Varians: ukuran sebaran nilai,
                                      bertambah cepat jika interval
                                      melebar
  -----------------------------------------------------------------------

### Desain kalkulator

Input:

-   **Batas bawah (`a`)** --- bilangan real.
-   **Batas atas (`b`)** --- bilangan real, harus `b > a`.
-   **Jenis kejadian**:
    -   Kurang dari `c`: `P(X < c)`
    -   Lebih dari `c`: `P(X > c)`
    -   Antara `c` dan `d`: `P(c ≤ X ≤ d)` (tampilkan dua input batas)
    -   Tepat `x`: `P(X = x)` (hasil selalu 0; tampilkan sebagai
        penjelasan konsep)
-   **Nilai `c`** (atau `c` dan `d` untuk kejadian antara).

Mean, varians, dan simpangan baku **selalu ditampilkan** di panel hasil
tambahan, apa pun jenis kejadian yang dipilih, karena modul menanyakan
ketiganya bersamaan (Contoh Soal 2).

Nilai awal contoh:

-   `a = 10`, `b = 20`
-   Jenis kejadian: antara, `c = 12`, `d = 16`

### Perhitungan

Interval yang ditanyakan dipotong (clamp) ke `[a, b]` lebih dahulu:

-   `c' = max(c, a)` dan `d' = min(d, b)`.
-   Jika `c' > d'` (interval sepenuhnya di luar `[a, b]`), peluang `= 0`.

Kurang dari `c`: $P(X<c)=F(c)=\dfrac{c-a}{b-a}$, dengan hasil 0 jika
`c ≤ a` dan 1 jika `c ≥ b`.

Lebih dari `c`: $P(X>c)=\dfrac{b-c}{b-a}$, dengan hasil 1 jika `c ≤ a`
dan 0 jika `c ≥ b`.

Antara: $P(c\le X\le d)=\dfrac{d'-c'}{b-a}$.

Jika pengguna memasukkan batas di luar `[a, b]`, **jangan menolak
input**. Hitung dengan pemotongan di atas dan jelaskan pada langkah
pembahasan, misalnya: "Batas `d = 25` berada di luar interval, sehingga
hanya bagian sampai `b = 20` yang dihitung."

Contoh pembahasan otomatis (Contoh Soal 1):

1.  Waktu tunggu bus bernilai kontinu dan tersebar merata antara 10 dan
    20 menit. Jadi gunakan Uniform.
2.  Diketahui `a = 10`, `b = 20`, `c = 12`, `d = 16`.
3.  Kejadian yang dicari: `P(12 ≤ X ≤ 16)`.
4.  Gunakan rumus `P(c ≤ X ≤ d) = (d − c) / (b − a)`.
5.  Substitusi: `P(12 ≤ X ≤ 16) = (16 − 12) / (20 − 10)`.
6.  Hitung: `4/10 = 0,40`.
7.  Jadi peluangnya `0,4000` atau `40,00%`.

Interpretasi: peluang menunggu bus antara 12 dan 16 menit adalah 40%.
Kuncinya, bandingkan panjang interval yang ditanya dengan panjang seluruh
interval.

Contoh pembahasan otomatis (Contoh Soal 2, `X ~ Uniform(5, 17)`):

1.  Mean: `(5 + 17)/2 = 11`.
2.  Varians: `(17 − 5)²/12 = 144/12 = 12`.
3.  `P(X > 14) = (17 − 14)/(17 − 5) = 3/12 = 0,25`.

### Visualisasi

Gambar persegi panjang setinggi `1/(b−a)` dari `a` sampai `b`. Arsir
bagian antara `c` dan `d` (atau sisi kiri/kanan `c`). Tampilkan label
tinggi `1/(b−a)`, titik `a` dan `b`, serta garis putus-putus vertikal
untuk mean `E(X)`. Tampilkan juga perbandingan tertulis: "panjang
arsir = ... dari panjang total = ...".

------------------------------------------------------------------------

## 4.2 Distribusi Normal

### Pengertian

Jika `X ~ N(μ, σ²)`, kurva densitasnya simetris berbentuk lonceng.
`μ` menentukan pusat kurva dan `σ` menentukan penyebarannya (semakin
besar `σ`, kurva semakin melebar). Peluang dihitung dengan mengubah `X`
menjadi skor baku `Z`, lalu membaca luasnya dari CDF normal baku `Φ`.

Contoh:

-   Nilai ujian mahasiswa.
-   Berat atau diameter produk hasil pabrik.
-   Panjang baut, tinggi badan, dan pengukuran sejenis.

### Syarat penggunaan

1.  Variabel bersifat kontinu dan datanya berbentuk lonceng simetris
    (atau diasumsikan normal oleh soal).
2.  Mean `μ` dan simpangan baku `σ` diketahui.
3.  `σ > 0`.

### Rumus

$$f(x)=\frac{1}{\sigma\sqrt{2\pi}}\exp\!\left[-\frac{(x-\mu)^2}{2\sigma^2}\right]$$

$$Z=\frac{X-\mu}{\sigma},\qquad Z\sim N(0,1)$$

$$P(c\le X\le d)=\Phi\!\left(\frac{d-\mu}{\sigma}\right)-\Phi\!\left(\frac{c-\mu}{\sigma}\right)$$

Aturan empiris: sekitar 68% data berada dalam `μ ± σ`, sekitar 95%
dalam `μ ± 2σ`, dan sekitar 99,7% dalam `μ ± 3σ`.

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `μ` (mu)                            Mean populasi: pusat dan sumbu
                                      simetri kurva

  `σ` (sigma)                         Simpangan baku populasi: ukuran
                                      penyebaran. `σ²` adalah varians

  `X`                                 Variabel yang diamati (nilai ujian,
                                      berat, diameter, dll.)

  `Z`                                 Skor baku: berapa simpangan baku `x`
                                      berada dari `μ`

  `Φ(z)`                              CDF normal baku: `P(Z ≤ z)`, luas di
                                      kiri `z`

  `Φ(−z)`                             Sama dengan `1 − Φ(z)` karena kurva
                                      simetris

  `c`, `d`                            Batas bawah dan atas interval yang
                                      ditanyakan
  -----------------------------------------------------------------------

### Desain kalkulator

Kalkulator Normal memiliki **dua mode** yang dipilih dengan tab.

**Mode 1 --- Hitung peluang**

Input:

-   **Mean (`μ`)** --- bilangan real.
-   **Simpangan baku (`σ`)** --- bilangan lebih dari 0. Berikan
    keterangan bahwa jika yang diketahui adalah varians `σ²`,
    pengguna harus memasukkan akarnya. Opsional: sediakan pilihan
    "Input varians `σ²`" yang otomatis mengakarkan.
-   **Jenis kejadian**:
    -   Kurang dari atau sama dengan `c`: `P(X ≤ c)`
    -   Lebih dari atau sama dengan `c`: `P(X ≥ c)`
    -   Antara `c` dan `d`: `P(c ≤ X ≤ d)` (tampilkan dua input batas)
-   **Nilai `c`** (dan `d` untuk kejadian antara).

Nilai awal contoh:

-   `μ = 70`, `σ = 10`
-   Jenis kejadian: lebih dari, `c = 85`

**Mode 2 --- Cari nilai batas dari peluang (kuantil)**

Input:

-   **Mean (`μ`)** dan **simpangan baku (`σ`)**.
-   **Peluang yang diketahui (`q`)** --- angka `0 < q < 1`. Berikan
    keterangan bahwa `0,95` berarti 95%.
-   **Sisi**: kiri `P(X ≤ x) = q` atau kanan `P(X ≥ x) = q`.

Nilai awal contoh: `μ = 60`, `σ = 8`, `q = 0,95`, sisi kiri.

Mode 2 menjawab pertanyaan seperti "tentukan `x` sehingga
`P(X ≤ x) = 0,95`" (Latihan Mandiri Normal nomor 3).

### Perhitungan

Mode 1:

-   `z = (c − μ) / σ`
-   `P(X ≤ c) = Φ(z)`
-   `P(X ≥ c) = 1 − Φ(z)`
-   `P(c ≤ X ≤ d) = Φ(z_d) − Φ(z_c)`, dengan `z_c = (c − μ)/σ` dan
    `z_d = (d − μ)/σ`

Mode 2:

-   Cari `z` sehingga `Φ(z) = q` (sisi kiri) atau `Φ(z) = 1 − q`
    (sisi kanan). Itu adalah fungsi kuantil/invers `Φ`.
-   `x = μ + z · σ`

Contoh pembahasan otomatis (Contoh Soal Normal 1, `X ~ N(70, 10²)`):

1.  Nilai ujian berbentuk lonceng dengan `μ` dan `σ` diketahui. Jadi
    gunakan Normal.
2.  Diketahui `μ = 70`, `σ = 10`, `c = 85`.
3.  Kejadian yang dicari: `P(X > 85)`.
4.  Standardisasi: `Z = (85 − 70)/10 = 1,50`.
5.  Maka `P(X > 85) = P(Z > 1,50) = 1 − Φ(1,50)`.
6.  Nilai `Φ(1,50) ≈ 0,9332`.
7.  Hitung: `1 − 0,9332 = 0,0668`.
8.  Jadi peluangnya `0,0668` atau `6,68%`.

Interpretasi: hanya sekitar 6,68% nilai yang diperkirakan berada di atas
85.

Contoh pembahasan otomatis (Contoh Soal Normal 2, `X ~ N(500, 20²)`):

1.  `Z₁ = (480 − 500)/20 = −1,00` dan `Z₂ = (530 − 500)/20 = 1,50`.
2.  `P(480 ≤ X ≤ 530) = Φ(1,50) − Φ(−1,00)`.
3.  `≈ 0,9332 − 0,1587 = 0,7745`, atau `77,45%`.

Contoh pembahasan otomatis (Mode 2, `X ~ N(60, 8²)`, `q = 0,95`):

1.  Cari `z` sehingga `Φ(z) = 0,95`, diperoleh `z ≈ 1,645`.
2.  `x = 60 + 1,645 × 8 ≈ 73,16`.
3.  Interpretasi: 95% nilai diperkirakan tidak lebih dari 73,16.

**Aturan tampilan nilai `Z` dan `Φ`:** di langkah pembahasan,
tampilkan `Z` dibulatkan 2 angka desimal (seperti dibaca dari tabel
normal baku) dan `Φ(z)` 4 angka desimal. Namun hasil akhir dihitung
dari `Z` yang **tidak dibulatkan**. Karena itu hasil bisa berbeda
sangat tipis (sekitar 0,0001) dari jawaban modul yang memakai tabel;
lihat catatan pada bagian 8.

### Visualisasi

Gambar kurva lonceng dengan `μ` di tengah. Arsir daerah yang dihitung
(kiri `c`, kanan `c`, atau antara `c` dan `d`). Tampilkan dua sumbu
label: nilai `X` dan nilai `Z` yang bersesuaian. Tandai `μ`, `μ ± σ`,
`μ ± 2σ`, `μ ± 3σ` sebagai pengingat aturan empiris. Pada Mode 2,
tampilkan garis batas `x` yang ditemukan dan daerah arsir sebesar `q`.

------------------------------------------------------------------------

## 4.3 Distribusi Rata-Rata Sampel (X̄)

### Pengertian

Kalkulator ini menghitung peluang untuk **rata-rata sampel** `X̄`,
bukan untuk satu pengamatan. Jika populasi normal dengan mean `μ` dan
simpangan baku `σ`, maka rata-rata `n` pengamatan juga normal tetapi
**lebih sempit sebarannya** karena dibagi `√n`.

Contoh:

-   Rata-rata panjang 16 baut yang diambil dari lini produksi.
-   Rata-rata diameter 64 komponen dari populasi yang diketahui.
-   Rata-rata nilai 36 mahasiswa dari satu angkatan.

### Syarat penggunaan

1.  Populasi berdistribusi normal dengan `μ` dan `σ` diketahui, **atau**
    `n` cukup besar sehingga pendekatan normal untuk `X̄` dapat dipakai
    (Teorema Limit Pusat).
2.  Sampel bersifat acak dan pengamatan saling independen.
3.  Ukuran sampel `n` diketahui.

### Rumus

$$\bar X\sim N\!\left(\mu,\ \frac{\sigma^2}{n}\right),\qquad
SE=\frac{\sigma}{\sqrt n},\qquad
Z=\frac{\bar x-\mu}{\sigma/\sqrt n}$$

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `X̄`                                 Rata-rata sampel (variabel acak
                                      yang peluangnya dihitung)

  `x̄`                                 Nilai rata-rata sampel yang
                                      ditanyakan pada soal

  `μ`                                 Mean populasi (juga mean `X̄`)

  `σ`                                 Simpangan baku **populasi** (satu
                                      pengamatan)

  `n`                                 Ukuran sampel

  `SE = σ/√n`                         Standard error: simpangan baku
                                      rata-rata sampel. Selalu lebih kecil
                                      dari `σ` jika `n > 1`

  `Z`                                 Skor baku untuk rata-rata sampel;
                                      penyebutnya `SE`, **bukan** `σ`
  -----------------------------------------------------------------------

### Desain kalkulator

Kalkulator memiliki **dua mode**.

**Mode 1 --- Hitung peluang `X̄`**

Input:

-   **Mean populasi (`μ`)** --- bilangan real.
-   **Simpangan baku populasi (`σ`)** --- bilangan lebih dari 0.
-   **Ukuran sampel (`n`)** --- bilangan bulat minimal 1.
-   **Jenis kejadian**: `P(X̄ ≤ c)`, `P(X̄ ≥ c)`, atau
    `P(c ≤ X̄ ≤ d)` (dua input batas).
-   **Asumsi populasi** (dropdown): "Populasi normal" atau "Populasi
    tidak diketahui (gunakan Teorema Limit Pusat)".

Nilai awal contoh: `μ = 50`, `σ = 2`, `n = 16`, jenis kejadian lebih dari
`c = 50,75`, populasi normal.

Jika memilih "Populasi tidak diketahui" dan `n < 30`, tampilkan
**peringatan** (bukan penolakan): pendekatan normal untuk `X̄` kurang
dapat diandalkan pada sampel kecil. Angka 30 adalah aturan praktis umum,
bukan angka dari modul; jelaskan dengan label "aturan praktis".

**Mode 2 --- Interval simetris di sekitar `μ`**

Input: `μ`, `σ`, `n`, dan **peluang yang dicakup (`q`)**, bernilai awal
`0,95`.

Hasil: interval `μ ± z · SE` yang memuat `X̄` dengan peluang `q`,
dengan `z` adalah nilai yang memenuhi `Φ(z) = (1 + q)/2`. Contoh dari
modul: `X ~ N(50, 5²)`, `n = 25`, `q = 0,95` menghasilkan
`SE = 1` dan interval sekitar `[48,04; 51,96]`.

### Perhitungan

Mode 1:

-   `SE = σ / √n`
-   `z = (x̄ − μ) / SE`
-   Selanjutnya sama dengan Normal: `Φ(z)`, `1 − Φ(z)`, atau selisih
    dua `Φ`.

Mode 2:

-   `SE = σ / √n`
-   `z = Φ⁻¹((1 + q)/2)`
-   Batas bawah `= μ − z · SE`; batas atas `= μ + z · SE`.

Contoh pembahasan otomatis (Contoh Soal X̄ 1):

1.  Yang ditanya adalah peluang rata-rata dari 16 baut, bukan satu
    baut. Panjang baut normal, jadi gunakan distribusi rata-rata sampel.
2.  Diketahui `μ = 50`, `σ = 2`, `n = 16`, `x̄ = 50,75`.
3.  Hitung standard error: `SE = 2/√16 = 0,5`.
4.  Standardisasi: `Z = (50,75 − 50)/0,5 = 1,5`.
5.  `P(X̄ > 50,75) = P(Z > 1,5) = 1 − 0,9332 = 0,0668`.
6.  Jadi peluangnya `0,0668` atau `6,68%`.

Interpretasi: standard error mengecilkan sebaran rata-rata sampel
dibanding sebaran individu, sehingga rata-rata 16 baut yang melebihi
50,75 mm adalah kejadian yang jarang (sekitar 6,68%).

Contoh pembahasan otomatis (Contoh Soal X̄ 2, `μ = 10`, `σ = 0,8`,
`n = 64`):

1.  `SE = 0,8/√64 = 0,1`.
2.  `Z₁ = (9,8 − 10)/0,1 = −2` dan `Z₂ = (10,2 − 10)/0,1 = 2`.
3.  `P = Φ(2) − Φ(−2) ≈ 0,9772 − 0,0228 = 0,9544`, atau `95,44%`.

### Visualisasi

Gambarkan **dua kurva normal pada sumbu yang sama**: kurva lebar untuk
satu pengamatan `X ~ N(μ, σ²)` dan kurva sempit untuk rata-rata sampel
`X̄ ~ N(μ, σ²/n)`. Arsir daerah yang dihitung hanya pada kurva `X̄`.
Beri label `σ` dan `SE`. Saat pengguna menaikkan `n`, kurva `X̄` harus
semakin sempit.

------------------------------------------------------------------------

## 4.4 Pendekatan Binomial dengan Distribusi Normal

### Pengertian

Peluang Binomial `X ~ Bin(n, p)` untuk `n` besar sulit dihitung
langsung karena harus menjumlahkan banyak suku. Jika `n` cukup besar
dan `p` tidak terlalu dekat 0 atau 1, distribusi Binomial dapat
dihampiri oleh distribusi Normal `Y ~ N(μ = np, σ² = np(1 − p))`.

Karena Binomial **diskret** dan Normal **kontinu**, diperlukan
**koreksi kontinuitas** sebesar 0,5.

Contoh:

-   Banyak transaksi gagal dari 200 transaksi sistem.
-   Banyak produk cacat dari 500 produk.
-   Banyak keberhasilan dari ratusan percobaan independen.

### Syarat penggunaan

1.  Variabel awalnya Binomial: `n` percobaan independen, dua hasil, `p`
    tetap.
2.  `n` cukup besar.
3.  Syarat praktis: `np ≥ 5` dan `n(1 − p) ≥ 5`.

### Rumus

$$X\sim Bin(n,p)\ \Rightarrow\ Y\sim N\big(\mu=np,\ \sigma^2=np(1-p)\big)$$

Koreksi kontinuitas dari modul:

$$P(X\le k)\approx P(Y<k+0{,}5),\quad
P(X\ge k)\approx P(Y>k-0{,}5),\quad
P(a\le X\le b)\approx P(a-0{,}5<Y<b+0{,}5)$$

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `n`                                 Jumlah percobaan Binomial

  `p`                                 Peluang sukses (atau "gagal/cacat",
                                      sesuai kejadian yang dihitung)
                                      pada satu percobaan

  `k`, `a`, `b`                       Bilangan **bulat** pada soal
                                      Binomial asli

  `μ = np`                            Mean Binomial, dipakai sebagai mean
                                      Normal

  `σ = √(np(1−p))`                    Simpangan baku Binomial, dipakai
                                      sebagai simpangan baku Normal

  `±0,5`                              Koreksi kontinuitas: memperluas
                                      bilangan bulat menjadi interval
                                      `[k − 0,5; k + 0,5]`

  `Y`                                 Variabel Normal pengganti `X`
  -----------------------------------------------------------------------

### Desain kalkulator

Input:

-   **Jumlah percobaan (`n`)** --- bilangan bulat positif.
-   **Peluang (`p`)** --- angka `0 < p < 1`. Berikan keterangan bahwa
    `0,10` berarti 10%.
-   **Jenis kejadian** (nilai `k`, `a`, `b` bilangan bulat `0..n`):
    -   Paling sedikit `k`: `P(X ≥ k)`
    -   Paling banyak `k`: `P(X ≤ k)`
    -   Kurang dari `k`: `P(X < k)`
    -   Lebih dari `k`: `P(X > k)`
    -   Antara `a` dan `b`: `P(a ≤ X ≤ b)` (dua input batas)
-   **Koreksi kontinuitas**: saklar, **aktif secara bawaan**. Jika
    dimatikan, tampilkan catatan bahwa hasil kurang akurat; fitur ini
    untuk belajar membandingkan.

Panel pemeriksaan syarat, tampil otomatis di dekat input:

-   `np = ...` (hijau jika `≥ 5`, kuning jika `< 5`).
-   `n(1 − p) = ...` (hijau jika `≥ 5`, kuning jika `< 5`).
-   Jika salah satu `< 5`, tampilkan peringatan: "Pendekatan Normal
    kurang dapat diandalkan". Kalkulator tetap boleh menghitung
    (peringatan, bukan penolakan).

Nilai awal contoh: `n = 200`, `p = 0,10`, jenis kejadian paling sedikit,
`k = 25`.

Opsional (disarankan): tombol **Bandingkan dengan Binomial eksak** yang
menjumlahkan PMF Binomial untuk kejadian yang sama dan menampilkan
selisihnya. Gunakan modul `utils` Distribusi Diskrit jika sudah ada.
Hasil eksak hanya untuk perbandingan, bukan pengganti hasil
pendekatan.

### Tabel koreksi kontinuitas

Tiga bentuk pertama berasal dari modul. Dua bentuk terakhir diturunkan
dengan logika yang sama untuk bilangan bulat.

  ------------------------------------------------------------------------
  Kejadian Binomial       Setara Normal          Sumber
  ----------------------- ---------------------- -------------------------
  `P(X ≤ k)`              `P(Y < k + 0,5)`       Modul

  `P(X ≥ k)`              `P(Y > k − 0,5)`       Modul

  `P(a ≤ X ≤ b)`          `P(a − 0,5 < Y < b +   Modul
                          0,5)`                  

  `P(X < k)` = `P(X ≤     `P(Y < k − 0,5)`       Diturunkan (Latihan 3)
  k − 1)`                                        

  `P(X > k)` = `P(X ≥     `P(Y > k + 0,5)`       Diturunkan
  k + 1)`                                        
  ------------------------------------------------------------------------

Jika koreksi dimatikan, gunakan `k`, `a`, `b` apa adanya sebagai batas
Normal.

### Perhitungan

-   `μ = np`
-   `σ = √(np(1 − p))`
-   Tentukan batas Normal yang sudah dikoreksi dari tabel di atas.
-   `z = (batas − μ) / σ`
-   Hitung peluang dengan `Φ`, sama seperti kalkulator Normal.

Contoh pembahasan otomatis (Contoh Soal Binomial→Normal 1):

1.  Terdapat 200 transaksi dengan peluang gagal tetap 0,10, sehingga
    modelnya `X ~ Bin(200; 0,10)`.
2.  Periksa syarat: `np = 20 ≥ 5` dan `n(1 − p) = 180 ≥ 5`. Pendekatan
    Normal layak dipakai.
3.  `μ = np = 20` dan `σ = √(np(1 − p)) = √18 ≈ 4,243`.
4.  Kejadian: `P(X ≥ 25)`. Dengan koreksi kontinuitas:
    `P(X ≥ 25) ≈ P(Y > 24,5)`.
5.  `Z = (24,5 − 20)/4,243 ≈ 1,061`.
6.  `P ≈ 1 − Φ(1,061) ≈ 1 − 0,8556`.
7.  Jadi peluangnya sekitar `0,1444` atau `14,44%`.

Interpretasi: peluang sedikitnya 25 transaksi gagal dari 200 transaksi
adalah sekitar 14,4%.

Contoh pembahasan otomatis (Contoh Soal Binomial→Normal 2,
`Bin(500; 0,04)`, `P(15 ≤ X ≤ 25)`):

1.  `μ = 20`, `σ = √(500 × 0,04 × 0,96) = √19,2 ≈ 4,382`.
2.  Koreksi: `P(15 ≤ X ≤ 25) ≈ P(14,5 < Y < 25,5)`.
3.  `Z₁ = (14,5 − 20)/4,382 ≈ −1,255` dan
    `Z₂ = (25,5 − 20)/4,382 ≈ 1,255`.
4.  `P ≈ Φ(1,255) − Φ(−1,255) ≈ 0,7906`, atau sekitar `79,06%`
    (modul: `≈ 79,0%`).

Penjelasan singkat yang selalu ditampilkan di bawah hasil, untuk
menjawab Latihan Komprehensif nomor 5: *Koreksi kontinuitas diperlukan
karena Binomial hanya bernilai bilangan bulat, sedangkan Normal
kontinu. Pada Binomial, bilangan bulat `k` mewakili interval dari
`k − 0,5` sampai `k + 0,5` pada sumbu kontinu. Dengan menambah atau
mengurangi 0,5, luas di bawah kurva Normal menjadi lebih sesuai dengan
jumlah peluang batang Binomial.*

### Visualisasi

Gambarkan **batang peluang Binomial** untuk rentang `X` di sekitar
`μ` (misalnya `μ ± 4σ`, dibatasi `0..n`) dan **kurva Normal** di
atasnya. Arsir batang yang termasuk kejadian, dan tandai batas Normal
yang sudah dikoreksi (misalnya garis di `24,5`) sehingga pengguna
melihat bahwa garis berada di **tepi batang**, bukan di tengah batang.
Jika `n` terlalu besar untuk digambar, tampilkan hanya rentang di sekitar
`μ`.

------------------------------------------------------------------------

# 5. Aturan umum kalkulator

## 5.1 Jenis kejadian

Gunakan pilihan kejadian yang sesuai untuk setiap distribusi. Jangan
memaksakan pilihan yang tidak relevan.

  Distribusi              Pilihan kejadian
  ----------------------- ----------------------------------------------
  Seragam Kontinu         Kurang dari, lebih dari, antara, tepat (=0)
  Normal (Mode 1)         Kurang dari, lebih dari, antara
  Normal (Mode 2)         Cari `x` dari peluang sisi kiri atau kanan
  Rata-Rata Sampel        Kurang dari, lebih dari, antara; interval
                          simetris
  Binomial→Normal         Paling sedikit, paling banyak, kurang dari,
                          lebih dari, antara

Kata kunci yang harus diterjemahkan, tampilkan sebagai bantuan di
kalkulator:

  Kata di soal            Bentuk peluang
  ----------------------- ----------------------------------------------
  "kurang dari"           `X < c`
  "lebih dari"            `X > c`
  "antara"                `a < X < b`
  "paling banyak"         `X ≤ k`
  "paling sedikit",       `X ≥ k`
  "sedikitnya"            

Catatan: pada distribusi **kontinu** (Uniform, Normal, `X̄`),
`P(X < c) = P(X ≤ c)`. Pada Binomial (diskret) kedua bentuk itu
**berbeda**, sehingga koreksi kontinuitasnya berbeda (lihat bagian 4.4).

Untuk pilihan **antara**, tampilkan dua input batas dan validasi
batas bawah `≤` batas atas.

## 5.2 Format hasil

Gunakan format konsisten:

-   Desimal: minimal 4 angka di belakang koma.
-   Persentase: minimal 2 angka di belakang koma.
-   Nilai `Z` pada langkah pembahasan: 2 angka di belakang koma; pada
    kotak hasil antara boleh 3 angka.
-   Gunakan koma sebagai pemisah desimal pada tampilan (`0,0668`),
    tetapi titik pada pemrosesan internal.
-   Nilai internal jangan dibulatkan sebelum seluruh perhitungan
    selesai.
-   Hasil peluang harus berada pada rentang 0 sampai 1, dengan toleransi
    kecil untuk kesalahan floating-point (paksa ke 0 atau 1 jika
    keluar rentang oleh selisih sangat kecil).
-   Jika peluang sangat kecil sehingga bulat menjadi `0,0000`, tampilkan
    `< 0,0001` dan jelaskan bahwa nilainya mendekati 0, bukan tepat 0.

Contoh:

-   Peluang desimal: `0,0668`
-   Persentase: `6,68%`

## 5.3 Validasi input

Validasi dilakukan sebelum perhitungan.

  -----------------------------------------------------------------------
  Input                               Ketentuan
  ----------------------------------- -----------------------------------
  Semua input angka                   Harus berupa angka (bukan kosong,
                                      huruf, `NaN`, atau tak hingga).
                                      Terima koma dan titik sebagai
                                      pemisah desimal

  Uniform `a`, `b`                    `a < b`

  Uniform `c`, `d`                    Bilangan real; `c ≤ d` pada
                                      kejadian antara. Boleh di luar
                                      `[a, b]` (dipotong, lihat 4.1)

  Normal `μ`                          Bilangan real

  Normal `σ`                          `σ > 0`

  Normal `c`, `d`                     `c ≤ d` pada kejadian antara

  Normal kuantil `q`                  `0 < q < 1`

  X̄ `n`                               Bilangan bulat `n ≥ 1`

  X̄ `σ`                               `σ > 0`

  X̄ interval `q`                      `0 < q < 1`

  Binomial→Normal `n`                 Bilangan bulat `n ≥ 1`

  Binomial→Normal `p`                 `0 < p < 1`

  Binomial→Normal `k`, `a`, `b`       Bilangan bulat `0..n`; `a ≤ b`

  Binomial→Normal syarat              `np ≥ 5` dan `n(1 − p) ≥ 5`
                                      (peringatan, tidak memblokir)
  -----------------------------------------------------------------------

Jika input tidak valid:

-   Jangan menjalankan kalkulasi.
-   Tampilkan pesan di dekat input yang salah.
-   Jelaskan cara memperbaikinya dengan bahasa sederhana, misalnya
    "Simpangan baku harus lebih dari 0".
-   Pertahankan nilai input yang sudah benar agar pengguna tidak perlu
    mengisi ulang.

Kasus khusus:

-   Uniform dengan `c ≤ a` atau `d ≥ b`: dipotong ke batas interval.
-   Uniform dengan kejadian "tepat `x`": hasil `0`, tampilkan
    penjelasan bahwa pada distribusi kontinu peluang satu titik adalah
    0.
-   Normal dengan `|z| > 8`: `Φ(z)` dianggap 0 atau 1 sesuai arahnya
    dan tampilkan keterangan "nilai ekstrem".
-   `n = 1` pada `X̄`: `SE = σ`; tampilkan catatan bahwa `X̄` sama
    dengan satu pengamatan.
-   `p` terlalu dekat 0 atau 1 pada Binomial→Normal: tampilkan
    peringatan syarat sesuai panel pemeriksaan.

## 5.4 Perhitungan numerik

Buat fungsi matematika terpisah dari tampilan UI.

Fungsi yang dibutuhkan:

-   `normalPdf(x, mu, sigma)`
-   `normalCdf(z)` untuk `Φ(z)`. Implementasikan lewat fungsi `erf` atau
    `erfc` yang akurat (galat di bawah `1e-7`; lebih baik di bawah
    `1e-9`). Jangan memakai tabel dua angka desimal untuk hasil.
-   `normalQuantile(q)` untuk `Φ⁻¹(q)`. Bisa dengan algoritma rasional
    (mis. Acklam) atau pencarian biner pada `Φ` di rentang
    `[−10, 10]`, selama galat `Φ(Φ⁻¹(q)) − q` di bawah `1e-9`.
-   `uniformCdf(x, a, b)` dengan pemotongan ke `[0, 1]`.

Saran:

-   Untuk `P(Z > z)`, hitung langsung dengan `Φ(−z)`, bukan `1 − Φ(z)`,
    supaya tidak kehilangan ketelitian pada ekor yang kecil.
-   Untuk kejadian antara, hitung `Φ(z_d) − Φ(z_c)` dan paksa hasil
    negatif sangat kecil menjadi 0.
-   Jangan membulatkan `Z` sebelum memanggil `Φ`.
-   Tangani nilai ekstrem dengan aman dan tampilkan pesan jika
    perhitungan melampaui batas numerik implementasi.
-   Binomial eksak (untuk perbandingan opsional) harus dihitung dengan
    fungsi kombinasi yang aman (logaritma `lgamma` atau perkalian
    bertahap), bukan faktorial langsung.

## 5.5 Panel Alur Penyelesaian Soal

Tampilkan sebagai kartu atau panel yang dapat dibuka dari semua
halaman. Isinya sepuluh langkah dari modul:

1.  Kenali jenis variabel: kontinu atau diskret.
2.  Pilih distribusi sesuai asumsi: Uniform, Normal, atau Binomial.
3.  Tulis parameter `(a, b)`, atau `(μ, σ)`, atau `(n, p)`.
4.  Ubah pertanyaan menjadi kejadian peluang.
5.  Uniform → luas/rasio interval.
6.  Normal → standardisasi `Z` → tabel/CDF.
7.  Rata-rata sampel → gunakan `SE = σ/√n`.
8.  Binomial → jika layak, gunakan Normal dengan `μ = np` dan
    `σ = √(np(1−p))`.
9.  Binomial→Normal: selalu pertimbangkan koreksi kontinuitas.
10. Cek apakah jawaban masuk akal dan `0 ≤ P ≤ 1`.

Opsional: panel **Notasi dan Simbol** yang menjelaskan `Ω`, `A`, `Aᶜ`,
`P(A)`, `μ`, `σ`, `X̄`, `Z`, `Φ(z)`, dan notasi `Bin`, `N`, `U`
sebagaimana di halaman terakhir modul.

Tambahkan catatan pembelajaran dari modul: *notasi dan aturan
pendekatan dapat berbeda sedikit antar buku; gunakan definisi/konvensi
yang ditetapkan dosen saat mengerjakan tugas atau ujian.*

------------------------------------------------------------------------

# 6. Struktur fungsi yang disarankan

Pisahkan logika perhitungan dari komponen tampilan.

``` text
src/
└── features/
    └── distributions/
        └── continuous/
            ├── continuous-controller.js
            ├── continuous-data.js
            ├── continuous-ui.js
            ├── utils/
            │   ├── normal-pdf.js
            │   ├── normal-cdf.js
            │   ├── normal-quantile.js
            │   ├── standardize.js
            │   └── probability-format.js
            ├── concepts/
            │   └── concepts-ui.js
            ├── uniform/
            │   ├── uniform.js
            │   └── uniform-ui.js
            ├── normal/
            │   ├── normal.js
            │   └── normal-ui.js
            ├── sample-mean/
            │   ├── sample-mean.js
            │   └── sample-mean-ui.js
            └── binomial-normal/
                ├── binomial-normal.js
                └── binomial-normal-ui.js
```

Struktur tersebut adalah rekomendasi, bukan kewajiban. Sesuaikan dengan
struktur proyek yang sudah ada. Hindari membuat file duplikat jika
fungsi sejenis sudah tersedia, misalnya fungsi kombinasi atau format
peluang dari fitur Distribusi Diskrit (`utils/combination.js`,
`utils/probability-format.js`); impor dan gunakan ulang.

## 6.1 Kontrak fungsi perhitungan

Setiap kalkulator memiliki satu fungsi utama yang menerima objek input
dan mengembalikan data terstruktur. Fungsi tidak boleh langsung
memanipulasi DOM.

Contoh pola antarmuka fungsi (bukan implementasi final):

``` js
calculateUniform({ a, b, eventType, c, d });
// eventType: "lessThan" | "greaterThan" | "between" | "exact"

calculateNormal({ mode, mu, sigma, eventType, c, d, q, tail });
// mode: "probability" | "quantile"
// eventType: "lessThan" | "greaterThan" | "between"
// tail (mode quantile): "left" | "right"

calculateSampleMean({ mode, mu, sigma, n, eventType, c, d, q, assumption });
// mode: "probability" | "symmetricInterval"
// assumption: "normalPopulation" | "clt"

calculateBinomialNormal({
  n, p, eventType, k, a, b, continuityCorrection
});
// eventType: "atLeast" | "atMost" | "lessThan" | "greaterThan" | "between"
```

Hasil fungsi sebaiknya mengembalikan data terstruktur:

``` js
{
  probability: 0.0668,
  percentage: 6.68,
  distribution: "Normal",
  event: "P(X > 85)",
  parameters: { mu: 70, sigma: 10, c: 85 },
  intermediate: {          // nilai antara yang bergantung distribusi
    z: 1.5,
    phi: 0.9332
  },
  warnings: [],            // mis. syarat np >= 5 tidak terpenuhi
  chart: {                 // data untuk visualisasi, bukan hasil hitung
    type: "normal-curve",
    shade: { from: 85, to: null }
  },
  steps: [
    { title: "Identifikasi distribusi", explanation: "..." },
    { title: "Standardisasi", explanation: "..." }
  ]
}
```

Jika input tidak valid, kembalikan objek galat terstruktur, bukan
melempar teks mentah:

``` js
{
  ok: false,
  errors: [
    { field: "sigma", message: "Simpangan baku harus lebih dari 0." }
  ]
}
```

Angka di atas hanya contoh bentuk data. Nilai hasil sebenarnya harus
dihitung oleh fungsi.

------------------------------------------------------------------------

# 7. Desain tampilan yang disarankan

Untuk setiap submateri, gunakan susunan visual berikut:

``` text
┌──────────────────────────────────────────────┐
│ DISTRIBUSI NORMAL                            │
│ Penjelasan singkat dan kapan digunakan       │
├──────────────────────────────────────────────┤
│ RUMUS                                        │
│ Z = (X − μ) / σ                              │
│ P(c ≤ X ≤ d) = Φ(z_d) − Φ(z_c)               │
│                                              │
│ μ = mean populasi                            │
│ σ = simpangan baku populasi                  │
│ Z = skor baku                                │
│ Φ(z) = luas di kiri z pada kurva normal baku │
├──────────────────────────────────────────────┤
│ KALKULATOR NORMAL     [ Contoh dari modul ▼ ]│
│ [ Hitung peluang ] [ Cari nilai batas ]      │
│ Mean (μ)                 [ 70            ]    │
│ Simpangan baku (σ)       [ 10            ]    │
│ Jenis kejadian           [ Lebih dari  ▼ ]    │
│ Nilai batas (c)          [ 85            ]    │
│                                              │
│             [ HITUNG PELUANG ]               │
│                  [ RESET ]                   │
├──────────────────────────────────────────────┤
│ HASIL                                        │
│ P(X > 85)        Z = 1,50                    │
│ 0,0668                                       │
│ 6,68%                                        │
├──────────────────────────────────────────────┤
│ PEMBAHASAN LANGKAH DEMI LANGKAH              │
│ 1. Identifikasi distribusi                   │
│ 2. Nilai yang diketahui                      │
│ 3. Kejadian peluang                          │
│ 4. Rumus                                     │
│ 5. Substitusi                                │
│ 6. Standardisasi                             │
│ 7. Hasil dan interpretasi                    │
├──────────────────────────────────────────────┤
│ VISUALISASI KURVA                            │
│ Kurva lonceng dengan daerah arsir            │
└──────────────────────────────────────────────┘
```

Gunakan pola yang sama untuk distribusi lainnya, tetapi sesuaikan
jumlah input dan visualisasinya. Pada kalkulator dengan dua mode,
gunakan tab di dalam kartu kalkulator. Desain harus responsif untuk
desktop maupun layar ponsel; pada layar sempit, susun visualisasi di
bawah hasil dan izinkan grafik digulir horizontal jika perlu.

------------------------------------------------------------------------

# 8. Pengujian dan contoh acuan

Gunakan nilai dari modul sebagai test case. Modul membaca nilai `Φ`
dari tabel normal baku yang dibulatkan 4 angka desimal, sedangkan
aplikasi menghitung `Φ` secara eksak. Karena itu bandingkan dengan
**nilai eksak** (kolom "Nilai eksak") memakai toleransi `1e-4`. Kolom
"Nilai di modul" hanya untuk perbandingan dan boleh berbeda hingga
sekitar `1e-4` akibat pembulatan tabel.

## 8.1 Contoh soal dari modul

  ----------------------------------------------------------------------------------------------------
  Kalkulator   Input                      Kejadian             Nilai di modul   Nilai eksak
  ------------ -------------------------- -------------------- ---------------- ---------------------
  Uniform      `a=10, b=20`               `P(12 ≤ X ≤ 16)`     `0,40`           `0,4000`

  Uniform      `a=5, b=17`                Mean; Varians        `11`; `12`       `11`; `12`

  Uniform      `a=5, b=17`                `P(X > 14)`          `0,25`           `0,2500`

  Uniform      `a=4, b=10`                `P(X < 7)`           `0,50`           `0,5000`

  Normal       `μ=70, σ=10`               `P(X > 85)`          `0,0668`         `0,0668`

  Normal       `μ=500, σ=20`              `P(480 ≤ X ≤ 530)`   `0,7745`         `0,7745`

  Normal       `μ=20, σ=0,5`              `P(19,5 ≤ X ≤ 20,8)` `0,7865`         `0,7865`

  X̄            `μ=50, σ=2, n=16`          `P(X̄ > 50,75)`       `0,0668`         `0,0668`

  X̄            `μ=10, σ=0,8, n=64`        `P(9,8 ≤ X̄ ≤ 10,2)`  `0,9544`         `0,9545`

  Binomial→    `n=200, p=0,10`            `P(X ≥ 25)`          `≈ 0,144`        `0,1444`
  Normal                                                                          

  Binomial→    `n=500, p=0,04`            `P(15 ≤ X ≤ 25)`     `≈ 0,790`        `0,7906`
  Normal                                                                          
  ----------------------------------------------------------------------------------------------------

Catatan nilai antara untuk membandingkan langkah pembahasan:

-   Binomial→Normal contoh 1: `μ = 20`, `σ ≈ 4,2426`, `Z ≈ 1,0607`.
-   Binomial→Normal contoh 2: `μ = 20`, `σ ≈ 4,3818`, `Z ≈ ±1,2552`.
-   X̄ contoh 2: `SE = 0,1`, `Z = ±2`.

## 8.2 Soal latihan mandiri sebagai uji regresi

Modul tidak menyertakan kunci jawaban untuk latihan mandiri. Nilai di
bawah ini **dihitung ulang** dengan rumus modul dan fungsi `Φ` eksak,
bukan kunci resmi dari modul. Gunakan hanya sebagai uji regresi, dan
cocokkan dengan jawaban dosen jika tersedia.

  ----------------------------------------------------------------------------------
  Kalkulator   Input                      Kejadian             Hasil
  ------------ -------------------------- -------------------- ---------------------
  Uniform      `a=0, b=60`                `P(15 ≤ X ≤ 42)`     `0,4500`

  Uniform      `a=8, b=18`                Mean; Varians        `13`; `8,3333`

  Uniform      `a=20, b=50`               `P(X < 27)`          `0,2333`

  Uniform      `a=20, b=50`               `P(30 ≤ X ≤ 45)`     `0,5000`

  Uniform      `a=30, b=50`               `P(35 < X < 44)`     `0,4500`

  Normal       `μ=80, σ=12`               `P(X ≤ 92)`          `0,8413`

  Normal       `μ=100, σ=15`              `P(85 ≤ X ≤ 125)`    `0,7936`

  Normal       `μ=60, σ=8`                `x` dengan           `x ≈ 73,1588`
                                          `P(X ≤ x)=0,95`      (`z ≈ 1,6449`)

  Normal       `μ=40, σ=6`                `P(X > 49)`          `0,0668`

  Normal       `μ=100, σ=10`              `P(90 ≤ X ≤ 115)`    `0,7745`

  X̄            `μ=75, σ=12, n=36`         `P(X̄ > 78)`          `0,0668`

  X̄            `μ=200, σ=20, n=100`       `P(198 ≤ X̄ ≤ 204)`   `0,8186`

  X̄            `μ=50, σ=5, n=25,          Interval simetris    `[48,04; 51,96]`
               q=0,95`                                         

  Binomial→    `n=100, p=0,30`            `P(X ≥ 35)`          `0,1631`
  Normal                                                         

  Binomial→    `n=400, p=0,05`            `P(15 ≤ X ≤ 25)`     `0,7930`
  Normal                                                         

  Binomial→    `n=250, p=0,20`            `P(X < 45)`          `0,1923`
  Normal                                  (`= P(Y < 44,5)`)    
  ----------------------------------------------------------------------------------

## 8.3 Latihan komprehensif (regresi)

  ----------------------------------------------------------------------------------
  Kalkulator   Input                      Kejadian             Hasil
  ------------ -------------------------- -------------------- ---------------------
  Uniform      `a=5, b=15`                `P(7 ≤ X ≤ 12)`;     `0,5000`; `10`
                                          `E(X)`               

  Normal       `μ=72, σ=8`                `P(60 ≤ X ≤ 85)`     `0,8811`

  X̄            `μ=50, σ=10, n=25`         `P(48 ≤ X̄ ≤ 53)`     `0,7745`

  Binomial→    `n=300, p=0,08`            `P(X ≥ 30)`          `0,1209`
  Normal                                  (`μ=24`, `σ≈4,6989`) 
  ----------------------------------------------------------------------------------

Soal nomor 5 (esai koreksi kontinuitas) dijawab oleh teks penjelasan
tetap pada bagian 4.4.

## 8.4 Pengujian tambahan

Selain contoh dari modul, uji juga:

-   Input batas minimum dan maksimum.
-   Uniform dengan `a ≥ b` (harus ditolak).
-   Uniform dengan batas di luar `[a, b]` (dipotong dan dijelaskan).
-   Uniform dengan `c = a` dan `d = b` (hasil `1`).
-   Uniform kejadian "tepat `x`" (hasil `0`).
-   Normal dengan `σ ≤ 0` (harus ditolak).
-   Normal dengan batas ekstrem (`|z| > 8`).
-   Normal Mode 2 dengan `q ≤ 0` atau `q ≥ 1` (harus ditolak).
-   Konsistensi: `Φ(Φ⁻¹(q)) ≈ q` untuk beberapa nilai `q`.
-   Simetri: `P(Z ≤ −z) = P(Z ≥ z)`.
-   Aturan empiris: peluang antara `μ ± σ`, `μ ± 2σ`, `μ ± 3σ` sekitar
    `0,6827`, `0,9545`, `0,9973`.
-   `X̄` dengan `n = 1` (sama dengan Normal biasa).
-   `X̄` dengan `n` bertambah: peluang di sekitar `μ` harus naik.
-   Peringatan `n < 30` untuk asumsi "populasi tidak diketahui".
-   Binomial→Normal dengan `np < 5` atau `n(1 − p) < 5` (peringatan
    tampil, hasil tetap dihitung).
-   Binomial→Normal dengan koreksi kontinuitas dimatikan (hasil
    berbeda dari saat aktif).
-   Perbandingan dengan Binomial eksak: selisih harus kecil jika
    syarat terpenuhi.
-   Kejadian "antara" dengan batas bawah lebih besar dari batas atas
    (harus ditolak).
-   Tombol reset dan perubahan input setelah hasil ditampilkan.
-   Tombol "Contoh dari Modul" mengisi seluruh input dengan benar.

------------------------------------------------------------------------

# 9. Kriteria selesai (acceptance criteria)

Fitur Distribusi Peluang Kontinu dapat dianggap selesai jika:

-   [ ] Halaman Konsep Dasar dan keempat kalkulator tersedia dan dapat
    dibuka.
-   [ ] Setiap distribusi menjelaskan pengertian dan kapan digunakan.
-   [ ] Rumus dan seluruh komponennya dijelaskan dengan bahasa
    sederhana.
-   [ ] Kalkulator menerima input pengguna, bukan hanya contoh tetap.
-   [ ] Pengguna dapat memilih jenis kejadian yang didukung distribusi.
-   [ ] Normal dan X̄ memiliki mode kedua (kuantil / interval simetris).
-   [ ] Binomial→Normal memiliki panel pemeriksaan syarat `np ≥ 5` dan
    `n(1−p) ≥ 5`, serta saklar koreksi kontinuitas.
-   [ ] Validasi input berjalan dan memberikan pesan yang jelas.
-   [ ] Hasil desimal dan persentase tampil setelah tombol hitung
    ditekan.
-   [ ] Pembahasan langkah demi langkah menyesuaikan input pengguna dan
    menampilkan standardisasi `Z`, `SE`, atau koreksi kontinuitas
    sesuai distribusinya.
-   [ ] Visualisasi berupa kurva dengan daerah arsir yang mengikuti
    parameter dan kejadian yang dihitung.
-   [ ] Hasil sesuai dengan seluruh contoh acuan pada tabel 8.1
    (toleransi `1e-4` terhadap nilai eksak).
-   [ ] Tombol "Contoh dari Modul" tersedia untuk semua contoh pada
    tabel 8.1.
-   [ ] Panel Alur Penyelesaian Soal tersedia.
-   [ ] Tampilan responsif dan konsisten dengan desain Probability 3D.
-   [ ] Logika matematika terpisah dari animasi dan manipulasi UI.
-   [ ] `Φ` dihitung secara numerik (bukan tabel pembulatan) dan nilai
    `Z` tidak dibulatkan sebelum perhitungan akhir.
-   [ ] Tidak ada label "AI" yang memberi kesan kalkulator menggunakan
    model AI jika perhitungannya sebenarnya memakai rumus lokal.

## 10. Prinsip utama implementasi

1.  **Materi sebelum kalkulator.** Pengguna harus memahami arti simbol,
    PDF/CDF, dan "peluang = luas" sebelum diminta memasukkan angka.
2.  **Input fleksibel.** Pengguna dapat mengganti nilai dan mencoba
    berbagai kondisi, termasuk mengubah `n`, `σ`, atau `p` untuk melihat
    efeknya.
3.  **Hasil transparan.** Jangan hanya memberikan angka akhir; tunjukkan
    rumus, `Z`, `SE`, dan prosesnya.
4.  **Penjelasan dinamis.** Langkah pembahasan harus dibentuk dari nilai
    input, bukan teks contoh yang selalu sama.
5.  **Matematika sebagai sumber kebenaran.** Fungsi perhitungan
    menentukan hasil; grafik dan animasi hanya membantu pemahaman.
6.  **Bahasa sederhana.** Jelaskan istilah matematika dengan kalimat
    singkat, contoh, dan konteks nyata.
7.  **Bedakan satu pengamatan dan rata-rata.** Selalu tampilkan apakah
    yang dihitung adalah `X` atau `X̄` agar pengguna tidak memakai `σ`
    padahal seharusnya `SE`.
8.  **Ikuti konvensi dosen.** Tampilkan catatan bahwa aturan pendekatan
    dapat berbeda antar buku.

Dengan rancangan ini, bagian Distribusi Peluang Kontinu menjadi empat
laboratorium kalkulator yang bisa dieksplorasi pengguna, bukan sekadar
halaman berisi rumus dan contoh soal.
