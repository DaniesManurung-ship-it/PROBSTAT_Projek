# MATERI.md — Pembelajaran Probability 3D

## Tujuan
Buat halaman Materi Probability 3D yang mengajarkan probabilitas dan statistika dari dasar. Materi harus detail tetapi mudah dipahami pemula. Jangan hanya menampilkan definisi dan rumus: jelaskan alasan penggunaan rumus, arti simbol, contoh kehidupan sehari-hari, contoh soal, dan penyelesaian langkah demi langkah.

Setiap topik yang memiliki perhitungan harus menyediakan tombol **Coba Kalkulator Interaktif**. Kalkulator harus relevan dengan materi yang sedang dibaca, menerima input pengguna, menampilkan rumus, substitusi, proses hitung, hasil, dan interpretasi sederhana.

## Struktur halaman
- Header: `Materi Pembelajaran` dan subjudul singkat.
- Kategori: Probabilitas Dasar, Teknik Menghitung Peluang, Distribusi Peluang, Statistika Deskriptif, dan Simulasi.
- Daftar materi dengan judul, ringkasan, dan tingkat kesulitan.
- Halaman/bagian isi materi.
- Daftar isi, progres membaca, materi sebelumnya/berikutnya, dan kembali ke daftar.
- Desain mengikuti identitas visual Probability 3D yang telah ada. Prioritaskan keterbacaan, responsif, dan konsistensi komponen.

## Pola wajib untuk setiap materi
1. Tujuan pembelajaran.
2. Pengertian dengan bahasa sederhana.
3. Penjelasan konsep dan istilah penting.
4. Rumus dan arti setiap simbol.
5. Kapan rumus digunakan serta syaratnya.
6. Contoh kehidupan sehari-hari.
7. Contoh soal: diketahui, ditanya, dan penyelesaian bertahap.
8. Kesimpulan dan kesalahan umum.
9. Tombol kalkulator interaktif.
10. Latihan singkat dengan pembahasan.

---

# BAGIAN A — PROBABILITAS

## 1. Pengantar Probabilitas

Probabilitas atau peluang adalah ukuran kemungkinan suatu kejadian terjadi. Nilainya antara 0 dan 1:
- 0 berarti mustahil.
- 1 berarti pasti.
- Nilai di antara 0 dan 1 menunjukkan tingkat kemungkinan.

Peluang dapat ditulis sebagai pecahan, desimal, atau persentase. Contoh: 0,5 = 1/2 = 50%.

Untuk hasil yang sama-sama mungkin:

\[
P(A)=\frac{n(A)}{n(S)}
\]

`P(A)` adalah peluang kejadian A, `n(A)` jumlah hasil yang mendukung A, dan `n(S)` jumlah seluruh hasil yang mungkin.

**Contoh:** sebuah dadu memiliki sisi 1 sampai 6. Peluang muncul angka 4 adalah 1/6, karena hanya satu hasil yang diinginkan dari enam kemungkinan. Dalam persentase, hasilnya sekitar 16,67%.

**Kalkulator — Peluang Dasar**
Input jumlah seluruh kemungkinan dan jumlah hasil yang diinginkan. Tampilkan pecahan sederhana, desimal, persentase, dan substitusi ke rumus. Validasi total kemungkinan harus positif dan hasil yang diinginkan tidak boleh melebihi total kemungkinan.

Tombol: `Coba Kalkulator Peluang Dasar`.

## 2. Percobaan, Hasil, Ruang Sampel, dan Kejadian

- Percobaan: tindakan yang menghasilkan keluaran, misalnya melempar dadu.
- Hasil: satu keluaran, misalnya angka 3.
- Ruang sampel (S): kumpulan semua hasil yang mungkin.
- Kejadian (A): satu atau beberapa hasil yang menjadi perhatian.

Contoh satu dadu: `S={1,2,3,4,5,6}`. Kejadian angka genap adalah `A={2,4,6}`. Untuk dua lemparan koin, ruang sampelnya `{AA, AG, GA, GG}`; A berarti angka dan G berarti gambar.

Tekankan bahwa ruang sampel harus memuat semua kemungkinan dan tidak boleh menghitung hasil yang sama dua kali.

**Kalkulator — Pembentuk Ruang Sampel**
Pengguna memilih satu koin, dua koin, satu dadu, dua dadu, atau percobaan khusus. Tampilkan seluruh hasil, jumlah anggota ruang sampel, hasil yang memenuhi kriteria, dan peluangnya. Untuk dua dadu, pengguna dapat memilih jumlah mata dadu atau kriteria genap/ganjil.

Tombol: `Coba Pembentuk Ruang Sampel`.

## 3. Peluang Komplemen

Komplemen A adalah kejadian bahwa A tidak terjadi. Jika peluang hujan 30%, dan hanya ada dua kemungkinan hujan/tidak hujan, peluang tidak hujan adalah 70%.

\[
P(A^c)=1-P(A)
\]

Jelaskan bahwa komplemen sering lebih mudah dihitung daripada menghitung semua hasil yang bukan A satu per satu.

**Contoh:** peluang angka genap pada dadu adalah 3/6 = 0,5. Peluang bukan angka genap = 1 - 0,5 = 0,5.

**Kalkulator — Komplemen**
Input peluang A dalam pecahan/desimal/persentase. Tampilkan peluang A dan bukan A serta diagram bagian terjadi/tidak terjadi.

Tombol: `Coba Kalkulator Komplemen`.

## 4. Peluang Gabungan (A atau B)

Gabungan `A ∪ B` berarti A terjadi, B terjadi, atau keduanya terjadi. Jika ada hasil yang termasuk A sekaligus B, bagian tersebut terhitung dua kali saat peluang A dan B dijumlahkan. Karena itu, kurangi irisan.

\[
P(A\cup B)=P(A)+P(B)-P(A\cap B)
\]

Dua kejadian saling lepas jika tidak mungkin terjadi bersamaan. Untuk kejadian saling lepas, irisan bernilai nol sehingga `P(A ∪ B)=P(A)+P(B)`.

**Contoh dadu:** A = angka genap `{2,4,6}`, B = angka lebih dari 3 `{4,5,6}`. Gabungannya `{2,4,5,6}`, jadi peluangnya 4/6.

**Kalkulator — Peluang Gabungan**
Input banyak hasil A, banyak hasil B, banyak hasil irisan, dan total ruang sampel. Tampilkan peluang A, B, irisan, gabungan, dan diagram Venn. Validasi jumlah irisan tidak melebihi anggota A atau B.

Tombol: `Coba Kalkulator Peluang Gabungan`.

## 5. Peluang Irisan (A dan B)

Irisan `A ∩ B` adalah hasil ketika A dan B terjadi bersamaan.

Untuk kejadian independen:

\[
P(A\cap B)=P(A)\times P(B)
\]

Untuk kejadian dependen:

\[
P(A\cap B)=P(A)\times P(B|A)
\]

Jelaskan bahwa rumus perkalian langsung hanya digunakan untuk kejadian independen. `P(B|A)` berarti peluang B setelah diketahui A terjadi.

**Kalkulator — Peluang Irisan**
Sediakan pilihan independen atau dependen. Mode independen meminta P(A) dan P(B). Mode dependen meminta P(A) dan P(B|A). Tampilkan rumus yang digunakan dan proses hitung.

Tombol: `Coba Kalkulator Peluang Irisan`.

## 6. Peluang Bersyarat

Peluang bersyarat adalah peluang suatu kejadian ketika informasi bahwa kejadian lain sudah terjadi telah diketahui.

\[
P(B|A)=\frac{P(A\cap B)}{P(A)},\quad P(A)>0
\]

Contoh: dari 20 mahasiswa, 12 perempuan dan 5 dari 12 perempuan menggunakan kacamata. Jika diketahui mahasiswa terpilih adalah perempuan, peluang ia menggunakan kacamata adalah 5/12.

Jelaskan bahwa informasi syarat mengubah kelompok hasil yang sedang diperhitungkan.

**Kalkulator — Peluang Bersyarat**
Input P(A) dan P(A irisan B), atau jumlah anggota A dan anggota irisan. Tampilkan P(B|A), langkah substitusi, dan persentase. Tolak P(A)=0.

Tombol: `Coba Kalkulator Peluang Bersyarat`.

## 7. Kejadian Independen dan Dependen

Independen berarti hasil kejadian pertama tidak mengubah peluang kejadian berikutnya. Contoh: melempar koin dua kali. Dependen berarti kejadian pertama mengubah peluang berikutnya. Contoh: mengambil dua kartu tanpa mengembalikan kartu pertama.

Dengan pengembalian, komposisi benda kembali seperti semula. Tanpa pengembalian, komposisi berubah.

**Kalkulator — Simulasi Pengambilan**
Pengguna menentukan jumlah benda dalam dua kategori, jumlah pengambilan, dan memilih dengan pengembalian/tanpa pengembalian. Tampilkan peluang setiap tahap dan bandingkan kedua metode.

Tombol: `Coba Simulasi Independen dan Dependen`.

## 8. Permutasi

Permutasi adalah penyusunan objek dengan memperhatikan urutan. Susunan A-B berbeda dari B-A jika posisi atau peran berbeda.

Faktorial:

\[
n!=n(n-1)(n-2)\cdots 1,\quad 0!=1
\]

Rumus:

\[
P(n,r)=\frac{n!}{(n-r)!}
\]

`n` adalah jumlah objek dan `r` jumlah objek yang dipilih/disusun. Berlaku untuk bilangan bulat `0 ≤ r ≤ n`.

Contoh: memilih ketua, sekretaris, bendahara dari 5 orang:

\[
P(5,3)=\frac{5!}{2!}=60
\]

**Kalkulator — Permutasi**
Input n dan r. Tampilkan faktorial, rumus, substitusi, dan jumlah susunan. Batasi input untuk menghindari angka yang terlalu besar.

Tombol: `Coba Kalkulator Permutasi`.

## 9. Kombinasi

Kombinasi adalah pemilihan objek tanpa memperhatikan urutan. Tim A-B sama dengan tim B-A.

\[
C(n,r)=\binom nr=\frac{n!}{r!(n-r)!}
\]

Contoh memilih 2 anggota dari 5 orang:

\[
C(5,2)=\frac{5!}{2!3!}=10
\]

Perbedaan utama: permutasi memperhatikan urutan; kombinasi tidak. Contoh permutasi adalah menentukan juara pertama dan kedua. Contoh kombinasi adalah memilih anggota kelompok.

**Kalkulator — Kombinasi**
Input n dan r. Tampilkan rumus, substitusi, hasil, dan penjelasan bahwa urutan tidak diperhitungkan.

Tombol: `Coba Kalkulator Kombinasi`.

---

# BAGIAN B — DISTRIBUSI PROBABILITAS

## 10. Variabel Acak

Variabel acak adalah nilai numerik yang ditentukan oleh hasil percobaan acak. Contoh: koin dilempar dua kali dan X adalah jumlah kemunculan sisi angka. Nilai X yang mungkin adalah 0, 1, atau 2.

- Diskrit: nilainya dapat dihitung satu per satu, misalnya jumlah mata dadu.
- Kontinu: nilainya dapat berada pada interval, misalnya waktu atau tinggi badan.

**Simulasi — Variabel Acak**
Simulasikan lempar koin/dadu. Tampilkan hasil percobaan, nilai variabel acak, frekuensi, dan grafik frekuensi.

Tombol: `Coba Simulasi Variabel Acak`.

## 11. Distribusi Binomial

Binomial digunakan untuk menghitung jumlah keberhasilan dalam n percobaan jika:
1. Jumlah percobaan tetap.
2. Setiap percobaan memiliki dua hasil (sukses/gagal).
3. Peluang sukses p tetap.
4. Percobaan saling independen.

\[
P(X=k)=\binom nk p^k(1-p)^{n-k}
\]

`n` = jumlah percobaan, `k` = jumlah sukses, `p` = peluang sukses, dan `1-p` = peluang gagal.

Contoh: koin seimbang dilempar 5 kali. Peluang tepat 3 kali angka:

\[
P(X=3)=\binom53(0,5)^3(0,5)^2=0,3125
\]

Jadi peluangnya 31,25%.

**Kalkulator — Binomial**
Input n, p, k. Pilihan kejadian: tepat k (`P(X=k)`), paling banyak k (`P(X≤k)`), atau paling sedikit k (`P(X≥k)`). Tampilkan hasil, persentase, tabel peluang setiap nilai X, dan grafik distribusi. Validasi n bilangan bulat nonnegatif, 0≤k≤n, 0≤p≤1.

Tombol: `Coba Kalkulator Binomial`.

## 12. Nilai Harapan

Nilai harapan adalah rata-rata teoretis dalam jangka panjang jika percobaan diulang berkali-kali dalam kondisi yang sama. Nilai harapan bukan jaminan hasil setiap percobaan.

\[
E(X)=\sum x_iP(x_i)
\]

Contoh: hadiah Rp10.000 dengan peluang 0,2 dan Rp0 dengan peluang 0,8. Nilai harapan = 10.000(0,2)+0(0,8)=Rp2.000.

**Kalkulator — Nilai Harapan**
Pengguna menambah beberapa pasangan nilai hasil dan peluang. Tampilkan total peluang, setiap perkalian x dengan P(x), dan nilai harapan. Validasi total peluang sama dengan 1 dengan toleransi pembulatan.

Tombol: `Coba Kalkulator Nilai Harapan`.

## 13. Distribusi Seragam Kontinu (Uniform)

Pada distribusi Uniform, semua nilai dalam interval [a,b] memiliki kepadatan yang sama.

\[
f(x)=\frac{1}{b-a},\quad a\le x\le b
\]

Peluang interval:

\[
P(c\le X\le d)=\frac{d-c}{b-a}
\]

Mean dan varians:

\[
E(X)=\frac{a+b}{2},\quad Var(X)=\frac{(b-a)^2}{12}
\]

Contoh: waktu tunggu seragam antara 10 dan 20 menit. Peluang menunggu 12–16 menit = (16-12)/(20-10)=0,4 atau 40%.

**Kalkulator — Uniform**
Input a, b, batas bawah c, dan batas atas d. Tampilkan PDF, peluang interval, mean, varians, dan grafik kepadatan. Validasi a<b dan interval yang ditanyakan berada di domain atau tangani irisan interval dengan domain secara benar.

Tombol: `Coba Kalkulator Uniform`.

## 14. Distribusi Normal

Distribusi Normal berbentuk lonceng dan simetris. Parameter:
- μ (mu): mean/pusat distribusi.
- σ (sigma): simpangan baku/tingkat penyebaran.
- σ²: varians.

Standardisasi:

\[
Z=\frac{X-\mu}{\sigma}
\]

Setelah mengubah X menjadi Z, peluang dihitung menggunakan CDF normal baku Φ(z). Jelaskan bahwa peluang adalah luas di bawah kurva. Untuk distribusi kontinu, peluang tepat pada satu titik adalah nol.

Aturan empiris:
- Sekitar 68% data berada dalam μ±σ.
- Sekitar 95% berada dalam μ±2σ.
- Sekitar 99,7% berada dalam μ±3σ.

**Kalkulator — Normal**
Input μ, σ, dan batas x. Pilihan peluang: P(X≤x), P(X≥x), atau P(a≤X≤b). Tampilkan Z-score, nilai CDF, langkah pengurangan CDF untuk interval, persentase, dan kurva lonceng dengan area yang dimaksud diarsir. Validasi σ>0.

Tombol: `Coba Kalkulator Distribusi Normal`.

## 15. Distribusi Rata-Rata Sampel dan Standard Error

Rata-rata sampel adalah rata-rata dari data yang diambil sebagai sampel. Jika populasi normal, distribusi rata-rata sampel juga normal:

\[
\bar X\sim N\left(\mu,\frac{\sigma^2}{n}\right)
\]

Standard error:

\[
SE=\frac{\sigma}{\sqrt n}
\]

Standard error mengukur penyebaran distribusi rata-rata sampel. Semakin besar n, standard error semakin kecil. Jika populasi tidak normal, pendekatan normal untuk rata-rata sampel dapat digunakan ketika kondisi Teorema Limit Pusat memadai; jangan menyatakan satu batas n berlaku mutlak untuk semua distribusi.

**Kalkulator — Rata-Rata Sampel**
Input μ, σ, n, dan batas nilai rata-rata sampel. Tampilkan SE, Z-score, peluang, dan kurva distribusi sampling. Validasi σ>0 dan n bilangan bulat positif.

Tombol: `Coba Kalkulator Rata-Rata Sampel`.

## 16. Pendekatan Binomial dengan Normal

Jika X~Binomial(n,p), untuk n cukup besar dan p tidak terlalu dekat 0 atau 1, distribusi binomial dapat didekati dengan normal:

\[
\mu=np,\quad \sigma=\sqrt{np(1-p)}
\]

Syarat praktis yang sering digunakan: `np≥5` dan `n(1-p)≥5`. Jelaskan bahwa ini pedoman praktis, bukan jaminan akurasi sempurna.

Karena binomial diskrit sedangkan normal kontinu, gunakan koreksi kontinuitas:
- `P(X≤k) ≈ P(Y<k+0,5)`.
- `P(X≥k) ≈ P(Y>k-0,5)`.
- `P(a≤X≤b) ≈ P(a-0,5<Y<b+0,5)`.

**Kalkulator — Binomial ke Normal**
Input n, p, batas kejadian. Pilihan tepat/kurang dari/lebih dari/interval. Tampilkan pemeriksaan syarat pendekatan, μ, σ, batas setelah koreksi kontinuitas, Z-score, peluang, dan peringatan jika syarat pendekatan tidak terpenuhi.

Tombol: `Coba Kalkulator Pendekatan Normal`.

---

# BAGIAN C — STATISTIKA DESKRIPTIF

## 17. Pengantar Statistika dan Data

Statistika mempelajari cara mengumpulkan, mengolah, menganalisis, menafsirkan, dan menyajikan data.
- Populasi: seluruh objek yang menjadi sasaran.
- Sampel: sebagian anggota populasi.
- Data: nilai/informasi hasil pengamatan.
- Variabel: karakteristik yang diukur.

**Kalkulator — Ringkasan Data**
Input sekumpulan angka. Tampilkan jumlah data, minimum, maksimum, data terurut, dan ringkasan awal.

Tombol: `Coba Analisis Data`.

## 18. Mean (Rata-rata)

Mean diperoleh dengan menjumlahkan semua nilai lalu membaginya dengan banyak data.

\[
\bar{x}=\frac{\sum x_i}{n}
\]

Contoh data 70, 80, 90: jumlah 240, banyak data 3, mean 80. Mean dapat terpengaruh nilai ekstrem.

**Kalkulator — Mean**
Input angka dipisahkan koma/baris baru. Tampilkan data, jumlah, banyak data, substitusi rumus, dan mean.

Tombol: `Coba Kalkulator Mean`.

## 19. Median

Median adalah nilai tengah setelah data diurutkan.
- Jumlah data ganjil: ambil satu nilai di posisi tengah.
- Jumlah data genap: rata-ratakan dua nilai tengah.

Contoh ganjil: 3,5,7,9,11 → median 7. Contoh genap: 3,5,7,9 → median (5+7)/2=6. Median lebih tahan terhadap nilai ekstrem daripada mean.

**Kalkulator — Median**
Tampilkan data awal, data terurut, posisi tengah, dan proses jika terdapat dua nilai tengah.

Tombol: `Coba Kalkulator Median`.

## 20. Modus

Modus adalah nilai yang paling sering muncul. Data dapat memiliki satu modus, lebih dari satu modus, atau tidak memiliki modus tunggal jika semua nilai memiliki frekuensi sama.

**Kalkulator — Modus**
Tampilkan frekuensi setiap nilai, semua nilai dengan frekuensi tertinggi, dan keterangan jika tidak ada modus tunggal.

Tombol: `Coba Kalkulator Modus`.

## 21. Jangkauan (Range)

Range adalah selisih nilai maksimum dan minimum.

\[
R=x_{\max}-x_{\min}
\]

Contoh 5,7,8,10,15: range=15-5=10. Range mudah dihitung tetapi hanya menggunakan dua nilai ekstrem.

**Kalkulator — Range**
Tampilkan minimum, maksimum, substitusi, dan range.

Tombol: `Coba Kalkulator Range`.

## 22. Kuartil dan IQR

Kuartil membagi data terurut menjadi empat bagian:
- Q1: kuartil bawah.
- Q2: median.
- Q3: kuartil atas.

\[
IQR=Q3-Q1
\]

IQR mengukur penyebaran 50% data bagian tengah dan dapat membantu mendeteksi pencilan. Ada beberapa konvensi perhitungan kuartil untuk sampel kecil. Kalkulator harus menyebutkan metode yang dipakai dan konsisten.

**Kalkulator — Kuartil**
Tampilkan data terurut, Q1, Q2, Q3, IQR, metode kuartil, dan box plot.

Tombol: `Coba Kalkulator Kuartil`.

## 23. Varians

Varians mengukur penyebaran data dari mean dengan menghitung rata-rata kuadrat selisih.

Varians populasi:

\[
\sigma^2=\frac{\sum(x_i-\mu)^2}{N}
\]

Varians sampel:

\[
s^2=\frac{\sum(x_i-\bar{x})^2}{n-1}
\]

Gunakan rumus populasi jika seluruh populasi tersedia. Gunakan rumus sampel untuk estimasi varians populasi dari sampel. Jelaskan alasan penyebut n-1.

**Kalkulator — Varians**
Input data dan pilih populasi/sampel. Tampilkan mean, selisih tiap data dari mean, kuadrat selisih, jumlah kuadrat, penyebut, dan varians.

Tombol: `Coba Kalkulator Varians`.

## 24. Standar Deviasi

Standar deviasi adalah akar kuadrat varians. Nilainya menggunakan satuan yang sama dengan data asli. Nilai kecil menunjukkan data cenderung dekat mean; nilai besar menunjukkan data lebih menyebar.

\[
\sigma=\sqrt{\frac{\sum(x_i-\mu)^2}{N}},\quad
s=\sqrt{\frac{\sum(x_i-\bar{x})^2}{n-1}}
\]

**Kalkulator — Standar Deviasi**
Input data dan pilih populasi/sampel. Tampilkan mean, varians, proses akar kuadrat, standar deviasi, dan interpretasi sederhana.

Tombol: `Coba Kalkulator Standar Deviasi`.

## 25. Skewness (Kemencengan)

Skewness menggambarkan ketidaksimetrisan distribusi:
- Mendekati 0: relatif simetris.
- Positif: ekor distribusi lebih panjang ke kanan.
- Negatif: ekor lebih panjang ke kiri.

Jangan menyimpulkan bentuk distribusi hanya dari mean dan median; tampilkan histogram untuk membantu interpretasi. Kalkulator wajib menyebutkan definisi/rumus skewness yang digunakan karena ada beberapa estimator.

**Kalkulator — Skewness**
Input data. Tampilkan nilai skewness, metode, interpretasi, histogram, serta peringatan jika data terlalu sedikit atau varians nol.

Tombol: `Coba Kalkulator Skewness`.

---

# BAGIAN D — SIMULASI

## 26. Simulasi Percobaan Acak

Simulasi menirukan percobaan menggunakan program. Hasil percobaan acak dapat berubah setiap kali diulang. Semakin banyak percobaan, frekuensi relatif sering kali mendekati peluang teoretis, tetapi tidak harus sama persis.

Sediakan simulasi koin, dadu, dua dadu, kartu, dan pengambilan bola dari kotak. Pengguna memilih jumlah percobaan. Tampilkan animasi hasil, tabel frekuensi, grafik batang, peluang empiris, peluang teoretis, dan perbandingan keduanya.

Tombol: `Mulai Simulasi Acak`.

---

# Standar kalkulator interaktif

1. Tombol kalkulator diletakkan setelah penjelasan dan contoh materi terkait.
2. Saat diklik, buka modal, drawer, atau panel yang jelas dengan judul sesuai materi.
3. Sediakan contoh nilai awal agar pengguna memahami cara menggunakan alat.
4. Tampilkan input, rumus, substitusi, langkah hitung, hasil, dan interpretasi.
5. Sediakan tombol hitung dan reset.
6. Validasi input kosong, bukan angka, nilai negatif yang tidak diperbolehkan, peluang di luar 0–1, dan batas yang tidak masuk akal.
7. Jangan pernah menampilkan NaN, Infinity, atau hasil tidak valid.
8. Pembulatan harus konsisten; tampilkan cukup digit desimal dan jelaskan bila hasil dibulatkan.
9. Jika hasil berupa peluang, tampilkan desimal dan persentase.
10. Kalkulator harus benar-benar menghitung, bukan tombol hiasan atau hasil statis.

## Standar penulisan
- Gunakan Bahasa Indonesia yang sederhana, konsisten, dan tidak bertele-tele.
- Jelaskan istilah teknis saat pertama kali muncul.
- Pecah penjelasan panjang menjadi subjudul dan paragraf pendek.
- Jangan menampilkan rumus tanpa menjelaskan kapan digunakan.
- Setiap contoh harus memiliki diketahui, ditanya, penyelesaian, dan jawaban.
- Periksa ulang semua perhitungan secara matematis.
- Gunakan ilustrasi, tabel, diagram Venn, kurva, histogram, dan box plot bila membantu.
- Jangan menganggap pengguna sudah memahami materi sebelumnya.

## Fitur pendukung
Tambahkan pencarian materi, filter kategori, daftar isi, progres membaca, latihan soal dengan umpan balik, serta navigasi materi sebelumnya/berikutnya. Jika website tidak memakai database, progres dapat disimpan lokal di browser dan tidak perlu membuat akun.

## Kriteria selesai
- Materi terkelompok dengan jelas.
- Penjelasan cukup detail dan dapat dipahami pemula.
- Rumus, simbol, dan syarat penggunaan dijelaskan.
- Contoh memiliki penyelesaian langkah demi langkah.
- Setiap topik perhitungan memiliki kalkulator yang relevan.
- Kalkulator menampilkan proses, bukan hanya jawaban.
- Semua input tervalidasi.
- Semua tombol, navigasi, dan simulasi berfungsi.
- Tampilan responsif desktop dan mobile.
- Hasil kalkulator telah dicocokkan dengan contoh manual.

## Instruksi akhir untuk coding agent
Gunakan dokumen ini sebagai sumber konten dan spesifikasi halaman Materi Probability 3D. Jangan menjadikan semua topik satu halaman panjang tanpa navigasi. Buat kategori, daftar materi, halaman/bagian materi, contoh, latihan, dan kalkulator sesuai topik.

Periksa framework dan struktur project yang sudah ada sebelum mengimplementasikan. Pertahankan identitas visual Probability 3D. Implementasikan materi secara bertahap, uji kalkulator dengan input normal dan tidak valid, cocokkan hasil dengan hitungan manual, dan pastikan tidak ada tombol yang hanya menjadi hiasan.
