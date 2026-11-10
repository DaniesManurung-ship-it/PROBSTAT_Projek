# Probability 3D — Starter Project

Starter website pembelajaran probabilitas dengan JavaScript, Vite, dan Three.js. Prototipe pertama berisi laboratorium dua dadu: dadu 3D yang dapat diputar, animasi lempar, 36 kemungkinan hasil, dan pembahasan bertahap.

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
│   └── dice-probability.test.js  # tes dasar mesin probabilitas
└── src/
    ├── main.js                   # entry point aplikasi
    ├── app/
    │   └── app.js                # menghubungkan komponen dan fitur
    ├── components/               # komponen UI yang dapat dipakai ulang
    ├── features/
    │   ├── probability/
    │   │   └── dice-probability.js # logika matematika murni
    │   └── dice/
    │       └── dice-controller.js # interaksi tombol dan ruang sampel
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

## 6. Catatan pengembangan

Ini adalah **prototipe awal**, belum merupakan sistem AI yang memahami semua jenis soal. Untuk tahap berikutnya, kembangkan dengan urutan:

1. Rapikan dan uji simulasi dadu, termasuk kondisi layar ponsel.
2. Tambahkan visualisasi koin, kartu, dan bola dengan aturan matematika masing-masing.
3. Buat format data soal terstruktur agar mesin matematika dan visualisasi menerima sumber data yang sama.
4. Tambahkan input soal bebas dan analisis bahasa/AI setelah mesin matematika dasar teruji.
5. Tambahkan akun, penyimpanan riwayat, latihan, dan dashboard jika diperlukan.

**Prinsip arsitektur:** mesin matematika adalah sumber kebenaran. Three.js hanya memvisualisasikan data hasil perhitungan; jangan menjadikan animasi sebagai penentu jawaban.
