# DISTRIBUSI DISKRIT --- SPESIFIKASI FITUR KALKULATOR INTERAKTIF

## 1. Tujuan

Dokumen ini menjadi panduan implementasi materi **Distribusi Diskrit**
pada aplikasi Probability 3D. Fitur dibuat sebagai kumpulan kalkulator
interaktif: pengguna membaca konsep dan komponen rumus terlebih dahulu,
mengisi nilai pada kalkulator, melihat hasil perhitungan, lalu
mempelajari pembahasan langkah demi langkah.

Materi mengikuti modul *Distribusi Diskrit: Contoh Soal, Pembahasan,
Latihan, dan Tugas Kelompok* dari SML \| IT Del. Distribusi yang
dibahas:

1.  Distribusi Binomial
2.  Distribusi Multinomial
3.  Distribusi Hipergeometrik
4.  Distribusi Geometrik
5.  Distribusi Binomial Negatif
6.  Distribusi Poisson

**Catatan ruang lingkup:** keenam materi di atas adalah distribusi
diskrit. Jangan menambahkan PMF/PDF sebagai distribusi tersendiri.
Istilah fungsi peluang massa (PMF) boleh digunakan untuk menjelaskan
peluang pada distribusi diskrit, tetapi tidak perlu membuat materi
distribusi kontinu.

------------------------------------------------------------------------

## 2. Konsep pengalaman pengguna

Setiap distribusi menggunakan pola halaman yang konsisten. Urutan konten
dari atas ke bawah wajib seperti berikut.

### A. Pengenalan materi

Tampilkan: - Nama distribusi. - Penjelasan singkat dengan bahasa
sederhana. - Kapan distribusi tersebut digunakan. - Ciri-ciri atau
syarat penggunaan. - Contoh situasi sehari-hari.

### B. Rumus dan komponen rumus

Tampilkan rumus utama dengan format matematika yang mudah dibaca. Tepat
di bawah rumus, tampilkan penjelasan setiap simbol dalam bentuk daftar
atau kartu kecil.

Jangan hanya menampilkan simbol seperti `n`, `p`, atau `x`. Jelaskan
arti simbol, satuan/konteksnya, dan contoh nilai.

### C. Kalkulator interaktif

Pengguna mengisi nilai sendiri melalui input angka, dropdown, atau
kontrol yang sesuai. Berikan nilai awal contoh agar kalkulator bisa
langsung dicoba.

Kalkulator minimal menyediakan: - Label input yang jelas. - Petunjuk
singkat untuk setiap input. - Validasi langsung. - Tombol **Hitung
Peluang**. - Tombol **Reset**. - Pemilihan jenis kejadian jika
distribusi mendukungnya, misalnya tepat, paling banyak, atau paling
sedikit.

Jangan meminta pengguna menulis rumus secara manual. Aplikasi yang
menyusun rumus dan menghitung hasil.

### D. Hasil perhitungan

Setelah tombol **Hitung Peluang** ditekan, tampilkan: - Jenis distribusi
yang digunakan. - Nilai parameter yang dimasukkan. - Bentuk kejadian
yang dihitung, misalnya `P(X = 2)`. - Hasil dalam desimal. - Hasil dalam
persentase. - Jika memungkinkan, tampilkan bentuk pecahan atau bentuk
kombinasi sebelum disederhanakan.

Hasil utama harus mudah ditemukan, tetapi jangan menyembunyikan proses
perhitungannya.

### E. Pembahasan langkah demi langkah

Di bawah hasil, tampilkan penjelasan yang berubah sesuai input pengguna.
Susun minimal menjadi:

1.  **Identifikasi distribusi** --- jelaskan mengapa distribusi tersebut
    sesuai dengan kondisi soal.
2.  **Tentukan nilai yang diketahui** --- tuliskan parameter dan
    artinya.
3.  **Pilih rumus** --- tampilkan rumus yang sesuai dengan jenis
    kejadian.
4.  **Substitusi nilai** --- masukkan nilai pengguna ke rumus.
5.  **Perhitungan** --- uraikan kombinasi, pangkat, faktorial, atau
    komponen lain secara bertahap.
6.  **Hasil akhir** --- tampilkan peluang desimal dan persentase.
7.  **Interpretasi** --- jelaskan arti hasil dalam konteks soal dengan
    kalimat sederhana.

Gunakan kalimat yang mudah dipahami mahasiswa pemula. Hindari hanya
menampilkan rangkaian angka tanpa penjelasan.

### F. Visualisasi pendukung

Gunakan visualisasi yang relevan dengan distribusi: - Grafik batang
peluang untuk nilai-nilai `X`. - Sorot batang atau nilai yang sedang
dihitung. - Untuk distribusi dengan beberapa kategori, tampilkan
ringkasan kategori. - Visualisasi bersifat pendukung; nilai hasil tetap
berasal dari fungsi matematika, bukan dari animasi.

------------------------------------------------------------------------

## 3. Navigasi dan susunan materi

Buat satu halaman atau bagian **Distribusi Diskrit** dengan enam
submateri. Pengguna dapat berpindah distribusi melalui tab, kartu, atau
navigasi samping.

Urutan yang disarankan: 1. Binomial 2. Multinomial 3. Hipergeometrik 4.
Geometrik 5. Binomial Negatif 6. Poisson

Pada halaman utama Distribusi Diskrit, tampilkan ringkasan pemilihan
distribusi:

  -----------------------------------------------------------------------
  Distribusi                          Kapan digunakan?
  ----------------------------------- -----------------------------------
  Binomial                            `n` percobaan independen, dua
                                      hasil, dan peluang sukses konstan

  Multinomial                         `n` percobaan dengan lebih dari dua
                                      kategori hasil

  Hipergeometrik                      Pengambilan tanpa pengembalian dari
                                      populasi terbatas

  Geometrik                           Menghitung percobaan sampai sukses
                                      pertama

  Binomial Negatif                    Menghitung percobaan sampai sukses
                                      ke-`k`

  Poisson                             Menghitung banyak kejadian dalam
                                      interval dengan rata-rata `λ`
  -----------------------------------------------------------------------

Tambahkan pengingat: **identifikasi kondisi percobaan terlebih dahulu,
baru pilih distribusinya.**

------------------------------------------------------------------------

# 4. Rincian setiap kalkulator

## 4.1 Distribusi Binomial

### Pengertian

Distribusi Binomial digunakan untuk menghitung peluang jumlah sukses
dalam sejumlah percobaan yang tetap. Setiap percobaan hanya memiliki dua
kemungkinan hasil, yaitu sukses atau gagal.

Contoh: - Menghitung jumlah produk cacat dari sejumlah produk yang
diperiksa. - Menghitung jumlah jawaban benar dari soal pilihan ganda. -
Menghitung jumlah keberhasilan dari beberapa percobaan independen.

### Syarat penggunaan

1.  Jumlah percobaan (`n`) sudah ditentukan.
2.  Setiap percobaan memiliki dua hasil: sukses atau gagal.
3.  Peluang sukses (`p`) sama pada setiap percobaan.
4.  Setiap percobaan saling independen.

### Rumus

\[ P(X=x)=`\binom{n}{x}`{=tex}p^x(1-p)^{n-x} \]

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `P(X = x)`                          Peluang memperoleh tepat `x` sukses

  `n`                                 Jumlah seluruh percobaan

  `x`                                 Jumlah sukses yang ingin dihitung

  `p`                                 Peluang sukses pada satu percobaan

  `1 - p`                             Peluang gagal pada satu percobaan

  `C(n,x)` atau `n! / (x!(n-x)!)`     Banyak cara memilih `x` sukses dari
                                      `n` percobaan
  -----------------------------------------------------------------------

### Desain kalkulator

Input: - **Jumlah percobaan (`n`)** --- bilangan bulat positif. -
**Peluang sukses (`p`)** --- angka dari 0 sampai 1. Berikan keterangan
bahwa `0,10` berarti 10%. - **Jumlah sukses (`x`)** --- bilangan bulat
dari 0 sampai `n`. - **Jenis kejadian**: - Tepat `x`: `P(X = x)` -
Paling banyak `x`: `P(X ≤ x)` - Paling sedikit `x`: `P(X ≥ x)` - Antara
`a` dan `b`: `P(a ≤ X ≤ b)` (tampilkan dua input batas, bukan input
`x`).

Nilai awal contoh: - `n = 8` - `p = 0,10` - `x = 2` - Jenis kejadian:
tepat

### Perhitungan

Untuk kejadian tepat: \[
P(X=x)=`\frac{n!}{x!(n-x)!}`{=tex}`\times `{=tex}p^x`\times`{=tex}(1-p)^{n-x}
\]

Untuk kejadian paling banyak: \[
P(X`\leq `{=tex}x)=`\sum`{=tex}\_{i=0}\^{x}P(X=i) \]

Untuk kejadian paling sedikit: \[
P(X`\geq `{=tex}x)=`\sum`{=tex}\_{i=x}\^{n}P(X=i) \]

Untuk kejadian antara: \[
P(a`\leq `{=tex}X`\leq `{=tex}b)=`\sum`{=tex}\_{i=a}\^{b}P(X=i) \]

### Contoh pembahasan otomatis

Soal contoh: sebuah mesin menghasilkan produk cacat dengan peluang
`0,10`. Dari 8 produk yang dipilih secara independen, berapa peluang
tepat 2 produk cacat?

Langkah: 1. Kondisi memiliki 8 percobaan, dua hasil (cacat/tidak cacat),
dan peluang cacat tetap. Jadi gunakan Binomial. 2. Diketahui `n = 8`,
`p = 0,10`, dan `x = 2`. 3. Gunakan rumus
`P(X=x) = C(n,x) × p^x × (1-p)^(n-x)`. 4. Substitusi:
`P(X=2) = C(8,2) × (0,10)^2 × (0,90)^6`. 5. Hitung kombinasi:
`C(8,2) = 8!/(2!6!) = 28`. 6. Hitung pangkat: `(0,10)^2 = 0,01` dan
`(0,90)^6 = 0,531441`. 7. Kalikan: `28 × 0,01 × 0,531441 = 0,14880348`.
8. Jadi peluangnya sekitar `0,1488` atau `14,88%`.

Interpretasi: dari kondisi percobaan tersebut, peluang mendapatkan tepat
2 produk cacat adalah sekitar 14,88%.

### Visualisasi

Buat grafik batang untuk `X = 0` sampai `X = n`. Sorot nilai `x` yang
dipilih pengguna. Untuk kejadian kumulatif, sorot seluruh batang yang
termasuk dalam rentang kejadian.

------------------------------------------------------------------------

## 4.2 Distribusi Multinomial

### Pengertian

Distribusi Multinomial merupakan perluasan Distribusi Binomial.
Distribusi ini digunakan ketika setiap percobaan memiliki lebih dari dua
kategori hasil.

Contoh: - Pilihan transportasi mahasiswa: motor, mobil, atau angkutan
umum. - Pilihan produk pelanggan: A, B, atau C. - Pengelompokan hasil
survei ke beberapa kategori.

### Syarat penggunaan

1.  Jumlah percobaan (`n`) tetap.
2.  Setiap percobaan masuk tepat ke satu kategori.
3.  Terdapat dua kategori atau lebih.
4.  Peluang setiap kategori tetap pada setiap percobaan.
5.  Percobaan saling independen.

### Rumus

\[ P(X_1=x_1,`\ldots`{=tex},X_k=x_k)=
`\frac{n!}{x_1!x_2!\cdots x_k!}`{=tex}
p_1^{x_1}p_2^{x_2}`\cdots `{=tex}p_k\^{x_k} \]

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `n`                                 Jumlah seluruh percobaan

  `k`                                 Jumlah kategori hasil

  `xᵢ`                                Jumlah hasil pada kategori ke-i

  `pᵢ`                                Peluang kategori ke-i pada satu
                                      percobaan

  `Σxᵢ = n`                           Jumlah seluruh frekuensi kategori
                                      harus sama dengan jumlah percobaan

  `Σpᵢ = 1`                           Jumlah peluang semua kategori harus
                                      sama dengan 1

  `n!/(x₁!x₂!...xₖ!)`                 Koefisien multinomial, yaitu banyak
                                      susunan hasil dengan jumlah tiap
                                      kategori yang ditentukan
  -----------------------------------------------------------------------

### Desain kalkulator

Input: - **Jumlah percobaan (`n`)**. - **Daftar kategori** yang dapat
ditambah atau dihapus, minimal 2 kategori. - Untuk setiap kategori: -
Nama kategori. - Peluang kategori (`pᵢ`). - Jumlah hasil yang diinginkan
(`xᵢ`).

Contoh nilai awal: - `n = 6` - Motor: `p = 0,50`, jumlah `x = 3` -
Mobil: `p = 0,20`, jumlah `x = 2` - Angkutan umum: `p = 0,30`, jumlah
`x = 1`

Tampilkan indikator jumlah peluang dan jumlah frekuensi secara
langsung: - Total peluang harus `1`. - Total frekuensi harus `n`.

Tombol **Tambah Kategori** memungkinkan pengguna menambahkan kategori
baru. Jangan membatasi kalkulator hanya pada tiga kategori.

### Perhitungan

\[
P=`\frac{n!}{x_1!x_2!\cdots x_k!}`{=tex}`\prod`{=tex}\_{i=1}^{k}p_i^{x_i}
\]

Contoh pembahasan otomatis: 1. Terdapat 6 mahasiswa dan 3 kategori
transportasi. Karena hasilnya lebih dari dua kategori, gunakan
Multinomial. 2. Diketahui `n = 6`; motor `(p=0,50, x=3)`; mobil
`(p=0,20, x=2)`; angkutan umum `(p=0,30, x=1)`. 3. Periksa total
frekuensi: `3 + 2 + 1 = 6`, sesuai dengan `n`. 4. Periksa total peluang:
`0,50 + 0,20 + 0,30 = 1`. 5. Substitusi:
`P = 6!/(3!2!1!) × (0,50)^3 × (0,20)^2 × (0,30)^1`. 6. Hitung koefisien:
`6!/(3!2!1!) = 60`. 7. Hitung peluang kategori: `(0,50)^3 = 0,125`;
`(0,20)^2 = 0,04`; `(0,30)^1 = 0,30`. 8. Kalikan:
`60 × 0,125 × 0,04 × 0,30 = 0,09`. 9. Jadi peluangnya `0,09` atau `9%`.

Interpretasi: peluang mendapatkan tepat 3 pilihan motor, 2 mobil, dan 1
angkutan umum dari 6 mahasiswa adalah 9%.

### Visualisasi

Gunakan diagram kategori (batang atau kartu) yang memperlihatkan: - Nama
kategori. - Peluang setiap kategori. - Jumlah hasil yang diminta. -
Persentase peluang kategori.

Di bagian hasil, tampilkan tabel ringkas kategori, `pᵢ`, `xᵢ`, dan
`pᵢ^xᵢ`.

------------------------------------------------------------------------

## 4.3 Distribusi Hipergeometrik

### Pengertian

Distribusi Hipergeometrik digunakan untuk menghitung peluang memperoleh
sejumlah objek dengan karakteristik tertentu ketika pengambilan
dilakukan **tanpa pengembalian** dari populasi yang jumlahnya terbatas.

Contoh: - Mengambil komponen dari kotak yang berisi komponen baik dan
cacat. - Memilih bibit dari kumpulan bibit unggul dan biasa. - Memilih
kartu dari satu dek tanpa mengembalikan kartu yang sudah diambil.

### Syarat penggunaan

1.  Populasi berjumlah tetap dan terbatas.
2.  Populasi terdiri atas dua kelompok: sukses dan bukan sukses.
3.  Sampel diambil tanpa pengembalian.
4.  Jumlah sampel sudah ditentukan.

### Rumus

\[ P(X=x)=`\frac{\binom{K}{x}\binom{N-K}{n-x}}{\binom{N}{n}}`{=tex} \]

### Komponen rumus

  Simbol         Arti
  -------------- ----------------------------------------------------
  `N`            Jumlah seluruh objek dalam populasi
  `K`            Jumlah objek yang termasuk kategori sukses
  `N-K`          Jumlah objek yang bukan kategori sukses
  `n`            Jumlah objek yang diambil
  `x`            Jumlah objek sukses yang ingin diperoleh
  `C(K,x)`       Cara memilih `x` objek sukses
  `C(N-K,n-x)`   Cara memilih sisa objek dari kelompok bukan sukses
  `C(N,n)`       Seluruh cara memilih sampel berukuran `n`

### Desain kalkulator

Input: - **Jumlah populasi (`N`)**. - **Jumlah objek sukses dalam
populasi (`K`)**. - **Jumlah sampel yang diambil (`n`)**. - **Jumlah
sukses yang diinginkan (`x`)**. - Jenis kejadian: tepat, paling banyak,
paling sedikit, atau antara dua batas.

Nilai awal contoh: - `N = 10` - `K = 4` - `n = 3` - `x = 2` - Jenis
kejadian: tepat

Keterangan di dekat input: **tanpa pengembalian**. Tampilkan ringkasan
populasi, misalnya 4 objek sukses dan 6 objek bukan sukses.

### Batas nilai yang valid

Nilai `x` harus berada pada rentang:

\[ `\max`{=tex}(0,n-(N-K))`\leq `{=tex}x`\leq`{=tex}`\min`{=tex}(n,K) \]

Rentang ini mencegah hasil yang secara fisik tidak mungkin terjadi.

### Perhitungan

Untuk kejadian tepat: \[
P(X=x)=`\frac{C(K,x)\times C(N-K,n-x)}{C(N,n)}`{=tex} \]

Untuk kejadian kumulatif, jumlahkan peluang setiap nilai `x` yang valid
dalam rentang kejadian.

Contoh pembahasan otomatis: 1. Pengambilan dilakukan tanpa pengembalian
dari populasi terbatas, sehingga gunakan Hipergeometrik. 2. Diketahui
`N = 10`, `K = 4`, `n = 3`, dan `x = 2`. 3. Jumlah objek bukan sukses
adalah `N-K = 10-4 = 6`. 4. Gunakan rumus
`P(X=x) = C(K,x) × C(N-K,n-x) / C(N,n)`. 5. Substitusi:
`P(X=2) = C(4,2) × C(6,1) / C(10,3)`. 6. Hitung pembilang: `C(4,2) = 6`
dan `C(6,1) = 6`, sehingga pembilang `= 36`. 7. Hitung penyebut:
`C(10,3) = 120`. 8. Bagi: `36/120 = 0,30`. 9. Jadi peluangnya `0,30`
atau `30%`.

Interpretasi: peluang memperoleh tepat 2 komponen cacat ketika mengambil
3 komponen dari kotak tersebut tanpa pengembalian adalah 30%.

### Visualisasi

Tampilkan kumpulan objek dengan dua warna berbeda, misalnya sukses dan
bukan sukses. Ketika pengguna mengubah `N`, `K`, atau `n`, visualisasi
ikut berubah. Visualisasi hanya ilustrasi komposisi populasi;
perhitungan tetap menggunakan rumus Hipergeometrik.

------------------------------------------------------------------------

## 4.4 Distribusi Geometrik

### Pengertian

Distribusi Geometrik digunakan untuk menghitung peluang bahwa sukses
pertama terjadi pada percobaan ke-`x`.

Contoh: - Percobaan mengirim data sampai pengiriman pertama berhasil. -
Memindai paket sampai pemindaian pertama berhasil. - Melakukan percobaan
sampai memperoleh keberhasilan pertama.

### Syarat penggunaan

1.  Setiap percobaan hanya memiliki dua hasil: sukses atau gagal.
2.  Peluang sukses (`p`) tetap.
3.  Percobaan saling independen.
4.  Percobaan dilakukan sampai sukses pertama terjadi.

### Rumus

\[ P(X=x)=(1-p)\^{x-1}p \]

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `P(X=x)`                            Peluang sukses pertama terjadi
                                      tepat pada percobaan ke-`x`

  `x`                                 Nomor percobaan ketika sukses
                                      pertama terjadi

  `p`                                 Peluang sukses pada setiap
                                      percobaan

  `1-p`                               Peluang gagal pada setiap percobaan

  `x-1`                               Jumlah kegagalan sebelum sukses
                                      pertama
  -----------------------------------------------------------------------

### Desain kalkulator

Input: - **Peluang sukses (`p`)** --- angka lebih dari 0 dan
maksimal 1. - **Nomor percobaan (`x`)** --- bilangan bulat minimal 1. -
Jenis kejadian: - Sukses pertama tepat pada percobaan ke-`x`:
`P(X = x)`. - Sukses pertama paling lambat pada percobaan ke-`x`:
`P(X ≤ x)`. - Sukses pertama setelah percobaan ke-`x`: `P(X > x)`.

Nilai awal contoh: - `p = 0,20` - `x = 4` - Jenis kejadian: tepat

### Perhitungan

Tepat pada percobaan ke-`x`: \[ P(X=x)=(1-p)\^{x-1}p \]

Paling lambat pada percobaan ke-`x`: \[ P(X`\leq `{=tex}x)=1-(1-p)\^x \]

Setelah percobaan ke-`x`: \[ P(X\>x)=(1-p)\^x \]

Contoh pembahasan otomatis: 1. Yang dicari adalah kapan sukses pertama
terjadi. Jadi gunakan Geometrik. 2. Diketahui `p = 0,20` dan `x = 4`. 3.
Gunakan rumus `P(X=x) = (1-p)^(x-1) × p`. 4. Substitusi:
`P(X=4) = (1-0,20)^(4-1) × 0,20`. 5. Sederhanakan:
`P(X=4) = (0,80)^3 × 0,20`. 6. Hitung pangkat: `(0,80)^3 = 0,512`. 7.
Kalikan: `0,512 × 0,20 = 0,1024`. 8. Jadi peluangnya `0,1024` atau
`10,24%`.

Interpretasi: peluang baru mendapatkan sukses pertama pada percobaan
keempat adalah 10,24%. Artinya, tiga percobaan pertama harus gagal dan
percobaan keempat berhasil.

### Visualisasi

Tampilkan urutan percobaan dalam bentuk kotak/lingkaran. Untuk `x = 4`,
gambarkan tiga percobaan pertama sebagai gagal dan percobaan keempat
sebagai sukses. Beri label bahwa visual tersebut adalah pola kejadian
yang dihitung, bukan hasil acak simulasi.

------------------------------------------------------------------------

## 4.5 Distribusi Binomial Negatif

### Pengertian

Distribusi Binomial Negatif digunakan untuk menghitung peluang sukses
ke-`k` terjadi tepat pada percobaan ke-`x`. Dengan kata lain, pengguna
menentukan berapa keberhasilan yang ingin dicapai, lalu menghitung
peluang keberhasilan ke-`k` baru tercapai pada percobaan tertentu.

Contoh: - Peluang transaksi berhasil yang kedua terjadi pada percobaan
kelima. - Peluang keberhasilan ketiga terjadi pada percobaan ketujuh.

### Syarat penggunaan

1.  Setiap percobaan memiliki dua hasil: sukses atau gagal.
2.  Peluang sukses (`p`) tetap.
3.  Percobaan saling independen.
4.  Percobaan berlanjut sampai sukses ke-`k` tercapai.

### Rumus

\[ P(X=x)=`\binom{x-1}{k-1}`{=tex}p^k(1-p)^{x-k} \]

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `P(X=x)`                            Peluang sukses ke-`k` terjadi tepat
                                      pada percobaan ke-`x`

  `x`                                 Nomor percobaan ketika sukses
                                      ke-`k` terjadi

  `k`                                 Jumlah sukses yang ditargetkan

  `p`                                 Peluang sukses pada setiap
                                      percobaan

  `1-p`                               Peluang gagal pada setiap percobaan

  `C(x-1,k-1)`                        Banyak cara menempatkan `k-1`
                                      sukses pada `x-1` percobaan pertama

  `p^k`                               Peluang untuk memperoleh total `k`
                                      sukses

  `(1-p)^(x-k)`                       Peluang untuk memperoleh `x-k`
                                      kegagalan sebelum sukses ke-`k`
  -----------------------------------------------------------------------

### Desain kalkulator

Input: - **Peluang sukses (`p`)** --- angka lebih dari 0 dan
maksimal 1. - **Target jumlah sukses (`k`)** --- bilangan bulat
minimal 1. - **Nomor percobaan (`x`)** --- bilangan bulat dan harus
`x ≥ k`. - Jenis kejadian: - Sukses ke-`k` tepat pada percobaan ke-`x`:
`P(X = x)`. - Sukses ke-`k` paling lambat pada percobaan ke-`x`:
`P(X ≤ x)`. - Sukses ke-`k` setelah percobaan ke-`x`: `P(X > x)`.

Nilai awal contoh: - `p = 0,40` - `k = 3` - `x = 7` - Jenis kejadian:
tepat

### Perhitungan

Tepat pada percobaan ke-`x`: \[ P(X=x)=C(x-1,k-1)p^k(1-p)^{x-k} \]

Untuk kejadian kumulatif, jumlahkan peluang dari nilai percobaan valid
yang termasuk dalam rentang kejadian. Nilai `X` dimulai dari `k`, bukan
dari 0.

Contoh pembahasan otomatis: 1. Yang dicari adalah sukses ketiga terjadi
pada percobaan ketujuh. Jadi gunakan Binomial Negatif. 2. Diketahui
`p = 0,40`, `k = 3`, dan `x = 7`. 3. Gunakan rumus
`P(X=x) = C(x-1,k-1) × p^k × (1-p)^(x-k)`. 4. Substitusi:
`P(X=7) = C(6,2) × (0,40)^3 × (0,60)^4`. 5. Hitung kombinasi:
`C(6,2) = 15`. 6. Hitung pangkat: `(0,40)^3 = 0,064` dan
`(0,60)^4 = 0,1296`. 7. Kalikan: `15 × 0,064 × 0,1296 = 0,124416`. 8.
Jadi peluangnya sekitar `0,1244` atau `12,44%`.

Interpretasi: peluang keberhasilan ketiga baru tercapai tepat pada
percobaan ketujuh adalah sekitar 12,44%.

### Visualisasi

Tampilkan `x` posisi percobaan. Pada `x-1` percobaan pertama, tunjukkan
bahwa tepat `k-1` posisi berisi sukses dan posisi terakhir adalah sukses
ke-`k`. Sisanya adalah kegagalan. Berikan keterangan bahwa kombinasi
menghitung banyak susunan yang mungkin.

------------------------------------------------------------------------

## 4.6 Distribusi Poisson

### Pengertian

Distribusi Poisson digunakan untuk menghitung peluang banyaknya kejadian
dalam interval waktu atau ruang tertentu berdasarkan rata-rata kejadian
(`λ`).

Contoh: - Jumlah pelanggan yang datang ke loket setiap 10 menit. -
Jumlah permintaan yang diterima server setiap menit. - Jumlah kejadian
dalam area atau periode tertentu.

### Syarat penggunaan

1.  Menghitung banyak kejadian pada interval waktu atau ruang tertentu.
2.  Rata-rata kejadian (`λ`) untuk interval tersebut diketahui.
3.  Kejadian dihitung sebagai jumlah kejadian dalam interval yang
    ditentukan.

### Rumus

\[ P(X=x)=`\frac{e^{-\lambda}\lambda^x}{x!}`{=tex} \]

### Komponen rumus

  -----------------------------------------------------------------------
  Simbol                              Arti
  ----------------------------------- -----------------------------------
  `P(X=x)`                            Peluang terjadi tepat `x` kejadian

  `x`                                 Jumlah kejadian yang ingin dihitung

  `λ` (lambda)                        Rata-rata jumlah kejadian dalam
                                      interval yang ditentukan

  `e`                                 Konstanta matematika sekitar
                                      `2,71828`

  `x!`                                Faktorial dari jumlah kejadian
  -----------------------------------------------------------------------

### Desain kalkulator

Input: - **Rata-rata kejadian (`λ`)** --- bilangan lebih besar atau sama
dengan 0. - **Jumlah kejadian (`x`)** --- bilangan bulat minimal 0. -
**Keterangan interval** --- misalnya per menit, per 10 menit, per jam,
atau per hari. Ini merupakan label konteks yang diisi pengguna. - Jenis
kejadian: - Tepat `x`: `P(X = x)`. - Paling banyak `x`: `P(X ≤ x)`. -
Paling sedikit `x`: `P(X ≥ x)`. - Antara `a` dan `b`: `P(a ≤ X ≤ b)`.

Nilai awal contoh: - `λ = 3` - `x = 2` - Interval: 10 menit - Jenis
kejadian: tepat

**Penting:** `λ` harus sesuai dengan interval yang sedang dihitung. Jika
rata-rata 3 pelanggan per 10 menit, jangan langsung menggunakan `λ = 3`
untuk interval 20 menit. Untuk laju yang sama, rata-rata interval baru
perlu disesuaikan secara proporsional.

### Perhitungan

Untuk kejadian tepat: \[ P(X=x)=`\frac{e^{-\lambda}\lambda^x}{x!}`{=tex}
\]

Untuk kejadian paling banyak: \[
P(X`\leq `{=tex}x)=`\sum`{=tex}\_{i=0}\^{x}`\frac{e^{-\lambda}\lambda^i}{i!}`{=tex}
\]

Untuk kejadian paling sedikit: \[
P(X`\geq `{=tex}x)=1-P(X`\leq `{=tex}x-1) \]

Untuk kejadian antara: \[
P(a`\leq `{=tex}X`\leq `{=tex}b)=`\sum`{=tex}\_{i=a}\^{b}`\frac{e^{-\lambda}\lambda^i}{i!}`{=tex}
\]

Contoh pembahasan otomatis: 1. Soal menghitung banyak pelanggan dalam
interval 10 menit dengan rata-rata yang diketahui. Jadi gunakan Poisson.
2. Diketahui `λ = 3` pelanggan per 10 menit dan `x = 2`. 3. Gunakan
rumus `P(X=x) = e^(-λ) × λ^x / x!`. 4. Substitusi:
`P(X=2) = e^(-3) × 3^2 / 2!`. 5. Hitung pangkat dan faktorial: `3^2 = 9`
dan `2! = 2`. 6. Masukkan nilai konstanta: `e^(-3) ≈ 0,049787`. 7.
Hitung: `0,049787 × 9 / 2 ≈ 0,2240`. 8. Jadi peluangnya sekitar `0,2240`
atau `22,40%`.

Interpretasi: peluang tepat 2 pelanggan datang dalam 10 menit ketika
rata-rata kedatangan 3 pelanggan per 10 menit adalah sekitar 22,40%.

### Visualisasi

Tampilkan grafik batang peluang untuk beberapa jumlah kejadian, misalnya
`X = 0` sampai batas tampilan yang sesuai dengan `λ`. Sorot nilai `x`
atau rentang yang dipilih pengguna. Pastikan grafik tidak mengubah hasil
perhitungan.

------------------------------------------------------------------------

# 5. Aturan umum kalkulator

## 5.1 Jenis kejadian

Gunakan pilihan kejadian yang sesuai untuk setiap distribusi. Jangan
memaksakan pilihan yang tidak relevan.

  Distribusi         Pilihan kejadian
  ------------------ ----------------------------------------------
  Binomial           Tepat, paling banyak, paling sedikit, antara
  Multinomial        Susunan jumlah kategori yang ditentukan
  Hipergeometrik     Tepat, paling banyak, paling sedikit, antara
  Geometrik          Tepat, paling lambat, setelah
  Binomial Negatif   Tepat, paling lambat, setelah
  Poisson            Tepat, paling banyak, paling sedikit, antara

Untuk pilihan **antara**, tampilkan dua input batas `a` dan `b`.
Validasi `a ≤ b`.

## 5.2 Format hasil

Gunakan format konsisten: - Desimal: minimal 4 angka di belakang koma. -
Persentase: minimal 2 angka di belakang koma. - Nilai internal jangan
dibulatkan sebelum seluruh perhitungan selesai. - Hasil peluang harus
berada pada rentang 0 sampai 1, dengan toleransi kecil untuk kesalahan
floating-point.

Contoh: - Peluang desimal: `0,1488` - Persentase: `14,88%`

## 5.3 Validasi input

Validasi dilakukan sebelum perhitungan.

  -----------------------------------------------------------------------
  Input                               Ketentuan
  ----------------------------------- -----------------------------------
  `n`, `N`, `K`, `x`, `k`, `a`, `b`   Bilangan bulat sesuai batas
                                      distribusinya

  `p`                                 `0 ≤ p ≤ 1` untuk Binomial dan
                                      `0 < p ≤ 1` untuk
                                      Geometrik/Binomial Negatif

  `λ`                                 `λ ≥ 0`

  Multinomial `pᵢ`                    Setiap peluang `0 ≤ pᵢ ≤ 1` dan
                                      totalnya 1

  Multinomial `xᵢ`                    Bilangan bulat tidak negatif dan
                                      totalnya sama dengan `n`

  Hipergeometrik                      `0 ≤ K ≤ N`, `0 ≤ n ≤ N`, dan `x`
                                      berada pada rentang yang mungkin

  Binomial                            `0 ≤ x ≤ n`

  Geometrik                           `x ≥ 1`

  Binomial Negatif                    `k ≥ 1` dan `x ≥ k`

  Poisson                             `x ≥ 0`
  -----------------------------------------------------------------------

Jika input tidak valid: - Jangan menjalankan kalkulasi. - Tampilkan
pesan di dekat input yang salah. - Jelaskan cara memperbaikinya dengan
bahasa sederhana. - Pertahankan nilai input yang sudah benar agar
pengguna tidak perlu mengisi ulang.

Kasus khusus: - Binomial dengan `p=0` atau `p=1` dapat dihitung secara
langsung sesuai hasil yang pasti. - Geometrik dan Binomial Negatif
menggunakan `0 < p ≤ 1`; `p=0` tidak pernah menghasilkan sukses. -
Poisson dengan `λ=0` berarti peluang `X=0` adalah 1 dan peluang nilai
lainnya 0.

## 5.4 Perhitungan numerik

Buat fungsi matematika terpisah dari tampilan UI. Gunakan fungsi
kombinasi dan faktorial yang aman untuk bilangan yang cukup besar.
Hindari menghitung faktorial besar secara langsung jika berisiko
overflow.

Saran: - Implementasikan `factorial`, `combination`, dan fungsi peluang
tiap distribusi dalam modul utilitas matematika. - Untuk peluang
kumulatif, jumlahkan PMF pada rentang nilai yang valid. - Jangan
membulatkan setiap suku sebelum penjumlahan selesai. - Tangani nilai
ekstrem secara aman dan tampilkan pesan jika perhitungan melampaui batas
numerik implementasi.

------------------------------------------------------------------------

# 6. Struktur fungsi yang disarankan

Pisahkan logika perhitungan dari komponen tampilan.

``` text
src/
└── features/
    └── distributions/
        ├── distributions-controller.js
        ├── distributions-data.js
        ├── distributions-ui.js
        ├── utils/
        │   ├── factorial.js
        │   ├── combination.js
        │   ├── probability-format.js
        │   └── cumulative-probability.js
        ├── binomial/
        │   ├── binomial.js
        │   └── binomial-ui.js
        ├── multinomial/
        │   ├── multinomial.js
        │   └── multinomial-ui.js
        ├── hypergeometric/
        │   ├── hypergeometric.js
        │   └── hypergeometric-ui.js
        ├── geometric/
        │   ├── geometric.js
        │   └── geometric-ui.js
        ├── negative-binomial/
        │   ├── negative-binomial.js
        │   └── negative-binomial-ui.js
        └── poisson/
            ├── poisson.js
            └── poisson-ui.js
```

Struktur tersebut adalah rekomendasi, bukan kewajiban. Sesuaikan dengan
struktur proyek yang sudah ada dan hindari membuat file duplikat jika
fungsi sejenis sudah tersedia.

## 6.1 Kontrak fungsi perhitungan

Setiap distribusi sebaiknya memiliki fungsi PMF dan fungsi untuk jenis
kejadian yang didukung.

Contoh pola antarmuka fungsi:

``` js
// Contoh pola, bukan implementasi final.
calculateBinomial({
  n,
  p,
  eventType,
  x,
  lower,
  upper
});
```

Hasil fungsi sebaiknya mengembalikan data terstruktur, bukan langsung
memanipulasi DOM.

``` js
{
  probability: 0.1488,
  percentage: 14.88,
  distribution: "Binomial",
  event: "P(X = 2)",
  parameters: {
    n: 8,
    p: 0.1,
    x: 2
  },
  steps: [
    {
      title: "Identifikasi distribusi",
      explanation: "..."
    },
    {
      title: "Substitusi nilai",
      explanation: "..."
    }
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
│ DISTRIBUSI BINOMIAL                          │
│ Penjelasan singkat dan kapan digunakan       │
├──────────────────────────────────────────────┤
│ RUMUS                                        │
│ P(X = x) = C(n,x) p^x (1-p)^(n-x)            │
│                                              │
│ n = jumlah percobaan                         │
│ p = peluang sukses                           │
│ x = jumlah sukses yang dicari                │
│ 1-p = peluang gagal                          │
├──────────────────────────────────────────────┤
│ KALKULATOR BINOMIAL                          │
│ Jumlah percobaan (n)     [ 8             ]    │
│ Peluang sukses (p)       [ 0,10          ]    │
│ Jumlah sukses (x)        [ 2             ]    │
│ Jenis kejadian           [ Tepat       ▼ ]    │
│                                              │
│             [ HITUNG PELUANG ]               │
│                  [ RESET ]                   │
├──────────────────────────────────────────────┤
│ HASIL                                        │
│ P(X = 2)                                     │
│ 0,1488                                       │
│ 14,88%                                       │
├──────────────────────────────────────────────┤
│ PEMBAHASAN LANGKAH DEMI LANGKAH              │
│ 1. Identifikasi distribusi                   │
│ 2. Nilai yang diketahui                      │
│ 3. Rumus                                      │
│ 4. Substitusi                                │
│ 5. Perhitungan                               │
│ 6. Kesimpulan                                │
├──────────────────────────────────────────────┤
│ VISUALISASI DISTRIBUSI                       │
│ Grafik peluang untuk nilai X                 │
└──────────────────────────────────────────────┘
```

Gunakan pola yang sama untuk lima distribusi lainnya, tetapi sesuaikan
jumlah input dan visualisasinya. Desain harus responsif untuk desktop
maupun layar ponsel.

------------------------------------------------------------------------

# 8. Pengujian dan contoh acuan

Gunakan nilai dari modul sebagai test case. Toleransi pembandingan yang
disarankan adalah `1e-4`, kecuali hasil ditampilkan dengan pembulatan.

  --------------------------------------------------------------------------------
  Distribusi       Input                    Kejadian                   Hasil acuan
  ---------------- ------------------------ ---------------- ---------------------
  Binomial         `n=8, p=0,10`            `P(X=2)`                      `0,1488`

  Binomial         `n=10, p=0,25`           `P(X=3)`                      `0,2503`

  Multinomial      `n=6`;                   Kombinasi                       `0,09`
                   `p=[0,5; 0,2; 0,3]`;     kategori         
                   `x=[3; 2; 1]`                             

  Multinomial      `n=5`;                   Kombinasi                      `0,147`
                   `p=[0,4; 0,35; 0,25]`;   kategori         
                   `x=[2; 2; 1]`                             

  Hipergeometrik   `N=10, K=4, n=3`         `P(X=2)`                        `0,30`

  Hipergeometrik   `N=12, K=5, n=4`         `P(X=3)`                      `0,1414`

  Geometrik        `p=0,20, x=4`            `P(X=4)`                      `0,1024`

  Geometrik        `p=0,70, x=3`            `P(X=3)`                       `0,063`

  Binomial Negatif `p=0,40, k=3, x=7`       `P(X=7)`                    `0,124416`

  Binomial Negatif `p=0,30, k=2, x=5`       `P(X=5)`                     `0,12348`

  Poisson          `λ=3, x=2`               `P(X=2)`                      `0,2240`

  Poisson          `λ=5, x=7`               `P(X=7)`                      `0,1044`
  --------------------------------------------------------------------------------

### Pengujian tambahan

Selain contoh dari modul, uji juga: - Input batas minimum dan
maksimum. - Peluang `p=0` dan `p=1` pada Binomial. - `λ=0` pada
Poisson. - Nilai `x` di luar rentang yang mungkin. - Jumlah peluang
Multinomial yang tidak sama dengan 1. - Jumlah frekuensi Multinomial
yang tidak sama dengan `n`. - Pengambilan Hipergeometrik yang tidak
mungkin. - `x < k` pada Binomial Negatif. - Kejadian kumulatif dan
kejadian antara. - Tombol reset dan perubahan input setelah hasil
ditampilkan.

------------------------------------------------------------------------

# 9. Kriteria selesai (acceptance criteria)

Fitur Distribusi Diskrit dapat dianggap selesai jika:

-   [ ] Keenam distribusi tersedia dan dapat dibuka.
-   [ ] Setiap distribusi menjelaskan pengertian dan kapan digunakan.
-   [ ] Rumus dan seluruh komponennya dijelaskan dengan bahasa
    sederhana.
-   [ ] Kalkulator menerima input pengguna, bukan hanya contoh tetap.
-   [ ] Pengguna dapat memilih jenis kejadian yang didukung distribusi.
-   [ ] Validasi input berjalan dan memberikan pesan yang jelas.
-   [ ] Hasil desimal dan persentase tampil setelah tombol hitung
    ditekan.
-   [ ] Pembahasan langkah demi langkah menyesuaikan input pengguna.
-   [ ] Grafik atau visualisasi berubah mengikuti parameter yang
    dihitung.
-   [ ] Hasil sesuai dengan seluruh contoh acuan pada tabel pengujian.
-   [ ] Tampilan responsif dan konsisten dengan desain Probability 3D.
-   [ ] Logika matematika terpisah dari animasi dan manipulasi UI.
-   [ ] Tidak ada label "AI" yang memberi kesan kalkulator menggunakan
    model AI jika perhitungannya sebenarnya memakai rumus lokal.

## 10. Prinsip utama implementasi

1.  **Materi sebelum kalkulator.** Pengguna harus memahami arti simbol
    dan rumus sebelum diminta memasukkan angka.
2.  **Input fleksibel.** Pengguna dapat mengganti nilai dan mencoba
    berbagai kondisi.
3.  **Hasil transparan.** Jangan hanya memberikan angka akhir; tunjukkan
    rumus dan prosesnya.
4.  **Penjelasan dinamis.** Langkah pembahasan harus dibentuk dari nilai
    input, bukan teks contoh yang selalu sama.
5.  **Matematika sebagai sumber kebenaran.** Fungsi perhitungan
    menentukan hasil; grafik dan animasi hanya membantu pemahaman.
6.  **Bahasa sederhana.** Jelaskan istilah matematika dengan kalimat
    singkat, contoh, dan konteks nyata.

Dengan rancangan ini, bagian Distribusi Diskrit menjadi enam
laboratorium kalkulator yang bisa dieksplorasi pengguna, bukan sekadar
halaman berisi rumus dan contoh soal.
