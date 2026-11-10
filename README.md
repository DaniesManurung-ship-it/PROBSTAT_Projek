# Probability 3D — Aplikasi Pembelajaran Probabilitas

Website pembelajaran probabilitas dengan JavaScript, Vite, dan Three.js. Aplikasi mencakup laboratorium eksperimen dadu, koin, kartu, dan bola serta kalkulator enam distribusi diskrit dengan hasil, pembahasan, dan visualisasi interaktif.

## 1. Persiapan

Pasang terlebih dahulu:
- **Visual Studio Code**
- **Node.js 20.19+** (disarankan versi LTS yang memenuhi syarat)
- Browser modern seperti Chrome atau Edge

Periksa Node.js dan npm di terminal VS Code:

```bash
node -v
npm -v
```

## 2. Buka dan jalankan project

1. Ekstrak folder `probability-3d`.
2. Buka Visual Studio Code.
3. Pilih **File → Open Folder**, lalu pilih folder `probability-3d`.
4. Buka terminal VS Code (**Terminal → New Terminal**).
5. Jalankan perintah berikut satu per satu:

```bash
npm install
npm run dev
```

6. Buka alamat lokal yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk menghentikan server, tekan `Ctrl + C` di terminal.

## 3. Perintah yang tersedia

```bash
npm run dev      # menjalankan website untuk development
npm run build    # membuat hasil produksi ke folder dist
npm run preview  # melihat hasil build secara lokal
npm test         # menjalankan tes perhitungan peluang
```

## 4. Struktur folder

```text
probability-3d/
├── index.html
├── package.json
├── README.md
├── .gitignore
├── public/                       # file publik (favicon, gambar, model 3D)
├── tests/
│   ├── dice-probability.test.js  # tes mesin probabilitas dadu
│   └── distributions.test.js    # tes enam distribusi diskrit
└── src/
    ├── main.js                   # entry point aplikasi
    ├── app/
    │   └── app.js                # menghubungkan komponen dan fitur
    ├── components/               # komponen UI yang dapat dipakai ulang
    ├── features/
    │   ├── distributions/        # kalkulator dan fungsi matematika distribusi diskrit
    │   ├── experiment/           # simulasi pelemparan dadu berulang
    │   ├── dice/                 # interaksi dan penjelasan peluang dadu
    │   ├── probability/
    │   ├── coin/                 # laboratorium koin
    │   ├── cards/                # laboratorium kartu remi
    │   ├── balls/                # laboratorium pengambilan bola
    │   └── solver/               # solver pola soal dan panduan bertahap
    ├── visualization/
    │   └── three/
    │       ├── create-die.js      # membentuk dadu 3D dan titik pada sisinya
    │       └── dice-scene.js      # scene, kamera, lighting, kontrol, animasi
    ├── styles/
    │   └── main.css               # seluruh styling
    └── utils/                     # helper umum
```

## 5. Cara kerja kode

- `features/probability/dice-probability.js` menghitung seluruh pasangan dadu dan peluang. File ini tidak bergantung pada Three.js.
- `visualization/three/create-die.js` membuat bentuk kubus membulat dan titik-titik pada enam sisinya.
- `visualization/three/dice-scene.js` menyiapkan scene 3D, kamera, cahaya, lantai, OrbitControls, dan animasi lempar.
- `features/dice/dice-controller.js` menghubungkan tombol, pilihan 36 kombinasi, angka hasil dadu, dan langkah pembahasan.
- `app/app.js` menginisialisasi semuanya.
- `app/navigation.js` mengelompokkan konten menjadi halaman Beranda, Dadu & Simulasi, Koin, Kartu, Bola, Solver, Distribusi Diskrit, dan Materi & Panduan. Navbar, tombol internal, serta tombol kembali/maju browser berpindah halaman tanpa memuat ulang aplikasi.

## 6. Fitur Distribusi Diskrit

Bagian **Distribusi Diskrit** berisi kalkulator untuk:

1. Binomial — tepat, paling banyak, paling sedikit, dan antara.
2. Multinomial — kategori dapat ditambahkan secara dinamis.
3. Hipergeometrik — pengambilan tanpa pengembalian.
4. Geometrik — percobaan sampai sukses pertama.
5. Binomial Negatif — percobaan sampai sukses ke-k.
6. Poisson — jumlah kejadian pada interval dengan rata-rata λ.

Setiap materi menyajikan pengertian, kondisi penggunaan, contoh, rumus dan arti simbol, input yang dapat diubah, validasi, hasil desimal dan persentase, pembahasan bertahap, serta grafik peluang. Logika matematika murni dipisahkan dari manipulasi UI pada `src/features/distributions/distribution-math.js`. Uji perhitungan tersedia melalui `npm test`.

## 7. Catatan pengembangan

Probability 3D tetap merupakan prototipe pembelajaran. Solver soal bebas mengenali pola tertentu secara lokal dan bukan model AI umum. Kalkulator distribusi diskrit menerima parameter terstruktur dan menghitung hasil memakai fungsi matematika lokal; batas input dijaga agar perhitungan dan visualisasi tetap praktis.

**Prinsip arsitektur:** mesin matematika adalah sumber kebenaran. Three.js hanya memvisualisasikan data hasil perhitungan; jangan menjadikan animasi sebagai penentu jawaban.
