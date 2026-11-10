
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ==========================================
   PROBABILITY 3D
   STEP-BY-STEP LEARNING ENGINE
========================================== */

const $ = (id) => document.getElementById(id);

const ui = {
  host: $('guided-scene'),
  count: $('guided-step-count'),
  percent: $('guided-progress-percent'),
  bar: $('guided-progress-bar'),

  title: $('guided-step-title'),
  description: $('guided-step-description'),
  math: $('guided-step-math'),
  note: $('guided-step-note'),
  caption: $('guided-scene-caption'),

  previous: $('guided-prev'),
  next: $('guided-next'),
  play: $('guided-play'),
  final: $('guided-final-message')
};

if (Object.values(ui).every(Boolean)) {

  let currentProblem = null;
  let currentStep = 0;
  let autoPlayTimer = null;
  let renderer = null;
  let scene = null;
  let camera = null;
  let controls = null;
  let stageGroup = null;
  let resizeObserver = null;
  let renderFrame = null;

  const TOTAL_STEPS = 4;

  const BALL_COLORS = {
    merah: '#e75059',
    biru: '#368ce8',
    kuning: '#f2c94c'
  };

  /* ======================================
     TEXTURE GENERATOR
  ====================================== */

  function makeTexture(
    label,
    background = '#1b3551',
    foreground = '#eaf4ff'
  ) {
    const canvas = document.createElement('canvas');

    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, 488, 488);

    ctx.fillStyle = foreground;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize =
      String(label).length > 5 ? 90 :
      String(label).length > 3 ? 115 : 155;

    ctx.font = `bold ${fontSize}px Arial`;

    ctx.fillText(String(label), 256, 256);

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
  }

  /* ======================================
     BASIC THREE JS OBJECTS
  ====================================== */

  function makeDie() {
    const materials = [];

    for (let i = 1; i <= 6; i++) {
      materials.push(
        new THREE.MeshStandardMaterial({
          map: makeTexture(i, '#f4f2e9', '#172c43'),
          roughness: 0.4
        })
      );
    }

    return new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.85, 0.85),
      materials
    );
  }

  function makeBall(color, radius = 0.18) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, 28, 20),
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.23,
        metalness: 0.04,
        clearcoat: 0.9
      })
    );
  }

  function addFloor(group) {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.7, 64),
      new THREE.MeshStandardMaterial({
        color: 0x142b49,
        roughness: 0.65
      })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;

    group.add(floor);
  }

  /* ======================================
     STAGE 1: OBJECT INTRODUCTION
  ====================================== */

  function createObjectIntroduction(problem) {
    const group = new THREE.Group();

    if (problem.model === 'dice') {
      const first = makeDie();
      const second = makeDie();

      first.position.x = -0.7;
      second.position.x = 0.7;

      first.rotation.set(0.4, 0.5, 0.2);
      second.rotation.set(0.7, 0.2, 0.4);

      group.add(first, second);
    }

    if (problem.model === 'dice-single') {
      const die = makeDie();

      die.scale.setScalar(1.3);
      die.rotation.set(0.5, 0.3, 0.2);

      group.add(die);
    }

    if (problem.model === 'coin') {
      const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.9, 0.9, 0.14, 64
        ),
        [
          new THREE.MeshStandardMaterial({
            color: 0xc48a2e,
            metalness: 0.85
          }),
          new THREE.MeshStandardMaterial({
            map: makeTexture('1', '#f0d99d', '#70420e')
          }),
          new THREE.MeshStandardMaterial({
            map: makeTexture('★', '#f0d99d', '#70420e')
          })
        ]
      );

      coin.rotation.x = Math.PI / 2;

      group.add(coin);
    }

    if (problem.model === 'cards') {
      for (let i = 0; i < 7; i++) {
        const card = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 1.55, 0.035),
          [
            new THREE.MeshStandardMaterial({ color: '#e6d9bb' }),
            new THREE.MeshStandardMaterial({ color: '#e6d9bb' }),
            new THREE.MeshStandardMaterial({ color: '#e6d9bb' }),
            new THREE.MeshStandardMaterial({ color: '#e6d9bb' }),
            new THREE.MeshStandardMaterial({
              map: makeTexture('A', '#fffaf0', '#bd3449')
            }),
            new THREE.MeshStandardMaterial({
              map: makeTexture('P3D', '#18395f', '#f2d18b')
            })
          ]
        );

        card.position.set(
          i * 0.045,
          i * 0.025,
          -i * 0.012
        );

        group.add(card);
      }
    }

    if (problem.model === 'balls') {
      const jar = new THREE.Mesh(
        new THREE.CylinderGeometry(
          1.05, 1.05, 2.1, 48, 1, true
        ),
        new THREE.MeshPhysicalMaterial({
          color: 0x8bbbf0,
          transparent: true,
          opacity: 0.17,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );

      group.add(jar);

      const counts = problem.counts || {
        merah: 5,
        biru: 3,
        kuning: 2
      };

      let index = 0;

      for (const [color, amount] of Object.entries(counts)) {
        for (let i = 0; i < amount; i++) {
          const angle = index * 2.399;
          const layer = Math.floor(index / 5);

          const ball = makeBall(BALL_COLORS[color]);

          const radius = 0.55;

          ball.position.set(
            Math.cos(angle) * radius,
            -0.65 + layer * 0.32,
            Math.sin(angle) * radius
          );

          group.add(ball);

          index++;
        }
      }
    }

    if (problem.model === 'counting') {

  for (let i = 0; i < problem.n; i++) {

    const material = new THREE.MeshStandardMaterial({
      color: i < problem.r ? '#42c995' : '#398bd5'
    });

    const person = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.13, 0.16, 0.5, 18
      ),
      material
    );

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.15, 20, 16
      ),
      material
    );

    head.position.y = 0.33;

    person.add(body, head);

    person.position.x =
      (i - (problem.n - 1) / 2) * 0.4;

    group.add(person);
  }
}


// CONDITIONAL PROBABILITY: DIAGRAM VENN 3D
if (problem.model === 'conditional') {

  const circleA = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 64),
    new THREE.MeshBasicMaterial({
      color: 0x348be0,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    })
  );

  const circleB = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 64),
    new THREE.MeshBasicMaterial({
      color: 0x20b889,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    })
  );

  circleA.position.x = -0.52;
  circleB.position.x = 0.52;

  circleA.position.z = 0.05;
  circleB.position.z = 0.06;

  group.add(circleA, circleB);

  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.025, 12, 64),
    new THREE.MeshBasicMaterial({
      color: 0x57aaff
    })
  );

  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.025, 12, 64),
    new THREE.MeshBasicMaterial({
      color: 0x55e0b0
    })
  );

  ringA.position.set(-0.52, 0, 0.08);
  ringB.position.set(0.52, 0, 0.09);

  group.add(ringA, ringB);
}

    return group;
  }

  /* ======================================
     CREATE SAMPLE DATA
  ====================================== */

  function getSampleItems(problem) {
    if (problem.model === 'counting') {
  return Array.from(
    { length: problem.n },
    (_, index) => ({
      label: String(index + 1),
      favorable: index < problem.r,
      baseColor: '#357fbd'
    })
  );
}
    if (problem.model === 'balls') {
      const items = [];

      for (const [color, amount] of Object.entries(problem.counts || {})) {
        for (let i = 0; i < amount; i++) {
          items.push({
            label: color.substring(0, 3).toUpperCase(),
            favorable: color === problem.target,
            baseColor: BALL_COLORS[color],
            fullLabel: color
          });
        }
      }

      return items;
    }

    return problem.sample.map((item) => {
      let label = item.value;

      if (problem.model === 'dice') {
        label = `${item.first}+${item.second}`;
      }

      return {
        label,
        favorable: Boolean(item.favorable),
        fullLabel: label
      };
    });
  }

  /* ======================================
     CREATE SAMPLE TILE
  ====================================== */

  function makeSampleTile(item, highlight) {
    let background = '#1a2f49';
    let foreground = '#d5e5f8';

    if (item.baseColor && !highlight) {
      background = item.baseColor;
      foreground = '#ffffff';
    }

    if (highlight && item.favorable) {
      background = '#16784f';
      foreground = '#ffffff';
    }

    if (highlight && !item.favorable) {
      background = '#273345';
      foreground = '#8292a5';
    }

    const material = new THREE.MeshStandardMaterial({
      map: makeTexture(
        item.label,
        background,
        foreground
      ),
      roughness: 0.55
    });

    const tile = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.39, 0.09),
      material
    );

    return tile;
  }

  /* ======================================
     STAGE 2 & 3: SAMPLE SPACE
  ====================================== */

  function createSampleVisualization(problem, highlight) {
    const group = new THREE.Group();

    const items = getSampleItems(problem);

    const columns =
      items.length > 40 ? 10 :
      items.length > 20 ? 6 :
      items.length > 10 ? 4 : 3;

    const spacingX =
      items.length > 40 ? 0.43 : 0.61;

    const spacingY =
      items.length > 40 ? 0.51 : 0.48;

    items.forEach((item, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;

      const tile = makeSampleTile(
        item,
        highlight
      );

      tile.position.set(
        (col - (columns - 1) / 2) * spacingX,
        -(
          row - (Math.ceil(items.length / columns) - 1) / 2
        ) * spacingY,
        0
      );

      group.add(tile);
    });

    // Sesuaikan kamera dengan jumlah kemungkinan
    camera.position.set(
      0,
      0.2,
      items.length > 40 ? 7.8 :
      items.length > 20 ? 6.4 : 5.4
    );

    camera.lookAt(0, 0, 0);

    controls.target.set(0, 0, 0);
    controls.update();

    return group;
  }

  /* ======================================
     FINAL FORMULA BOARD
  ====================================== */

  function createFormulaBoard(problem) {
    const group = new THREE.Group();

    const canvas = document.createElement('canvas');

    canvas.width = 1200;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#142a45';
    ctx.fillRect(0, 0, 1200, 400);

    ctx.strokeStyle = '#418fd2';
    ctx.lineWidth = 9;
    ctx.strokeRect(10, 10, 1180, 380);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 45px Arial';
    ctx.fillStyle = '#9bcaff';

    ctx.fillText(
      'HASIL PERHITUNGAN PELUANG',
      600,
      85
    );

    ctx.font = 'bold 76px Arial';
    ctx.fillStyle = '#6fe0ad';

ctx.fillText(
  problem.kind === 'counting'
    ? problem.formula
    : `${problem.favorable}/${problem.total}`,
  600,
  205
);

    ctx.font = 'bold 55px Arial';
    ctx.fillStyle = '#ffffff';

ctx.fillText(
  problem.kind === 'counting'
    ? `= ${problem.answerValue} ${problem.answerLabel}`
    : `= ${problem.fraction} | ${problem.percentage.toFixed(2)}%`,
  600,
  315
);

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(3.9, 1.3, 0.1),
      [
        new THREE.MeshStandardMaterial({ color: 0x203c5b }),
        new THREE.MeshStandardMaterial({ color: 0x203c5b }),
        new THREE.MeshStandardMaterial({ color: 0x203c5b }),
        new THREE.MeshStandardMaterial({ color: 0x203c5b }),
        new THREE.MeshStandardMaterial({
          map: texture
        }),
        new THREE.MeshStandardMaterial({ color: 0x203c5b })
      ]
    );

    group.add(board);

    return group;
  }

  /* ======================================
     DISPOSE OLD STAGE
  ====================================== */

  function clearStage() {
    if (!stageGroup) return;

    scene.remove(stageGroup);

    stageGroup.traverse((object) => {
      object.geometry?.dispose();

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.filter(Boolean).forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
    });

    stageGroup = null;
  }

  /* ======================================
     INTRODUCE LEARNING STEPS
  ====================================== */



function getSteps(problem) {

  const sampleSize =
    problem.model === 'counting'
      ? problem.n
      : problem.model === 'conditional'
        ? problem.population
        : problem.model === 'balls'
          ? Object.values(problem.counts || {}).reduce(
              (sum, number) => sum + number,
              0
            )
          : problem.sample.length;

  return [

    // LANGKAH 1
    {
      title: 'Kenali objek dan informasi',

      description:
        problem.model === 'conditional'
          ? `Kita mempelajari hubungan antara ${problem.eventA} dan ${problem.eventB} pada ${problem.population} siswa.`
          : `Kita sedang mempelajari ${problem.title.toLowerCase()}. Perhatikan objek 3D yang muncul dan kenali informasi dalam soal.`,

      math:
        problem.model === 'conditional'
          ? `A = ${problem.eventA}, B = ${problem.eventB}`
          : `Objek pembelajaran: ${problem.title}`,

      note:
        'Kenali dahulu objek, informasi yang diketahui, dan kejadian yang ingin dicari.',

      caption:
        'Langkah 1: Mengenal objek dan konsep pembelajaran.'
    },

    // LANGKAH 2
    {
      title: 'Bangun ruang kemungkinan',

      description:
        problem.model === 'dice'
          ? 'Dua dadu menghasilkan 36 pasangan kemungkinan.'
          : problem.model === 'counting'
            ? `Terdapat ${problem.n} objek. Sistem akan memperlihatkan pemilihan ${problem.r} objek.`
            : problem.model === 'conditional'
              ? `Seluruh populasi berjumlah ${problem.population} siswa. Diagram Venn membagi populasi menjadi empat wilayah: hanya A, hanya B, keduanya, dan di luar kedua kejadian.`
              : problem.model === 'cards'
                ? 'Satu dek kartu remi standar memiliki 52 kemungkinan kartu.'
                : problem.model === 'balls'
                  ? `Terdapat ${sampleSize} bola dengan warna dan jumlah sesuai soal.`
                  : problem.model === 'coin'
                    ? 'Satu koin mempunyai dua sisi, yaitu angka dan gambar.'
                    : 'Satu dadu memiliki enam kemungkinan hasil.',

      math:
        problem.model === 'counting'
          ? `${problem.n} objek tersedia, ${problem.r} akan dipilih.`
          : problem.model === 'conditional'
            ? `Total populasi = ${problem.population} siswa`
            : problem.model === 'balls'
              ? `${sampleSize} bola = seluruh objek`
              : `${sampleSize} kemungkinan hasil`,

      note:
        problem.model === 'conditional'
          ? 'Diagram Venn membantu kita melihat hubungan antara dua kejadian dan bagian yang saling beririsan.'
          : 'Ruang sampel merupakan kumpulan seluruh hasil yang mungkin terjadi.',

      caption:
        'Langkah 2: Memahami seluruh kemungkinan dan hubungan kejadian.'
    },

    // LANGKAH 3
    {
      title: 'Temukan kejadian yang dicari',

      description:
        problem.steps.length > 1
          ? problem.steps.slice(1, -1).join(' ')
          : problem.summary,

      math:
        problem.model === 'counting'
          ? `${problem.r} objek dipilih dari ${problem.n} objek`
          : problem.model === 'conditional'
            ? `A ∩ B = ${problem.intersection}, B = ${problem.total}`
            : `Kejadian yang diinginkan: ${problem.favorable} bagian dari ${problem.total} kemungkinan`,

      note:
        problem.model === 'conditional'
          ? `Perhatikan irisan kedua lingkaran. Ada ${problem.intersection} siswa yang menyukai kedua mata pelajaran. Inilah pembilang dalam peluang bersyarat.`
          : problem.model === 'counting'
            ? problem.countType === 'permutation'
              ? 'Pada permutasi, urutan objek diperhatikan.'
              : 'Pada kombinasi, urutan objek tidak diperhatikan.'
            : 'Perhatikan bagian yang ditandai. Itulah hasil yang memenuhi kondisi pertanyaan.',

      caption:
        'Langkah 3: Menentukan kejadian yang memenuhi pertanyaan.'
    },

    // LANGKAH 4
    {
      title: 'Hitung dan simpulkan',

      description:
        problem.summary,

      math:
        problem.model === 'counting'
          ? `${problem.formula} = ${problem.answerValue}`
          : problem.model === 'conditional'
            ? `P(${problem.eventA}|${problem.eventB}) = ${problem.intersection}/${problem.total} = ${problem.fraction} = ${problem.percentage.toFixed(2)}%`
            : `${problem.favorable}/${problem.total} = ${problem.fraction} = ${problem.percentage.toFixed(2)}%`,

      note:
        problem.model === 'counting'
          ? 'Hasil menunjukkan banyaknya susunan atau kombinasi yang mungkin.'
          : problem.model === 'conditional'
            ? 'Dalam peluang bersyarat, ruang sampel dibatasi pada kejadian yang sudah diketahui, yaitu B. Karena itu penyebutnya adalah jumlah anggota B.'
            : 'Peluang diperoleh dengan membagi jumlah kejadian yang diinginkan dengan seluruh kemungkinan hasil.',

      caption:
        'Langkah 4: Memahami perhitungan dan hasil akhir.'
    }

  ];
}

  /* ======================================
     BUILD EACH STAGE
  ====================================== */

  function renderStage() {
    if (!currentProblem || !scene) return;

    clearStage();

    stageGroup = new THREE.Group();

    addFloor(stageGroup);

    if (currentStep === 0) {
      stageGroup.add(
        createObjectIntroduction(currentProblem)
      );

      camera.position.set(3, 2.5, 5.4);
    }

    if (currentStep === 1) {
      stageGroup.add(
        createSampleVisualization(
          currentProblem,
          false
        )
      );
    }

    if (currentStep === 2) {
      stageGroup.add(
        createSampleVisualization(
          currentProblem,
          true
        )
      );
    }

    if (currentStep === 3) {
      stageGroup.add(
        createFormulaBoard(currentProblem)
      );

      camera.position.set(0, 0.4, 5.5);
    }

    scene.add(stageGroup);

    stageGroup.scale.setScalar(0.92);

    const startTime = performance.now();

    function appear(now) {
      if (!stageGroup || currentProblem == null) return;

      const progress = Math.min(
        (now - startTime) / 400,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      stageGroup.scale.setScalar(
        0.92 + 0.08 * eased
      );

      if (progress < 1) {
        requestAnimationFrame(appear);
      }
    }

    requestAnimationFrame(appear);
  }

  /* ======================================
     UPDATE STEP CONTENT
  ====================================== */

  function updateStep() {
    if (!currentProblem) return;

    const steps = getSteps(currentProblem);

    const step = steps[currentStep];

    const stepNumber = currentStep + 1;

    const progress =
      stepNumber / TOTAL_STEPS * 100;

    ui.count.textContent =
      `LANGKAH ${stepNumber} DARI ${TOTAL_STEPS}`;

    ui.percent.textContent =
      `${progress}%`;

    ui.bar.style.width =
      `${progress}%`;

    ui.title.textContent = step.title;

    ui.description.textContent =
      step.description;

    ui.math.textContent =
      step.math;

    ui.note.textContent =
      step.note;

    ui.caption.textContent =
      step.caption;

    ui.previous.disabled =
      currentStep === 0;

    ui.next.disabled =
      currentStep === TOTAL_STEPS - 1;

    ui.final.classList.toggle(
      'visible',
      currentStep === TOTAL_STEPS - 1
    );

    renderStage();
  }

  /* ======================================
     NAVIGATION
  ====================================== */

  function stopAutoPlay() {
    if (autoPlayTimer !== null) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }

    ui.play.textContent = '▶ Putar otomatis';
  }

  function goNext() {
    if (currentStep < TOTAL_STEPS - 1) {
      currentStep++;
      updateStep();
    } else {
      stopAutoPlay();
    }
  }

  function goPrevious() {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }

    stopAutoPlay();
  }

  function toggleAutoPlay() {
    if (autoPlayTimer !== null) {
      stopAutoPlay();
      return;
    }

    if (currentStep >= TOTAL_STEPS - 1) {
      currentStep = 0;
      updateStep();
    }

    ui.play.textContent = 'Ⅱ Jeda';

    autoPlayTimer = setInterval(() => {
      if (currentStep >= TOTAL_STEPS - 1) {
        stopAutoPlay();
        return;
      }

      goNext();
    }, 3500);
  }

  /* ======================================
     LOAD NEW SOLUTION
  ====================================== */

  function loadProblem(problem) {
    stopAutoPlay();

    currentProblem = problem;
    currentStep = 0;

    ui.final.classList.remove('visible');

    updateStep();

    document.querySelector('#guided-learning')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }

  /* ======================================
     INITIALIZE SCENE
  ====================================== */

  function initializeScene() {
    scene = new THREE.Scene();

    scene.background =
      new THREE.Color('#091425');

    camera = new THREE.PerspectiveCamera(
      38,
      1,
      0.1,
      100
    );

    camera.position.set(3, 2.5, 5.4);

    renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    ui.host.replaceChildren(renderer.domElement);

    controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.enablePan = false;

    scene.add(
      new THREE.HemisphereLight(
        0xe5f1ff,
        0x34435b,
        2.4
      )
    );

    const light = new THREE.DirectionalLight(
      0xffffff,
      3
    );

    light.position.set(4, 5, 5);

    scene.add(light);

    const pointLight = new THREE.PointLight(
      0x368eff,
      18,
      12
    );

    pointLight.position.set(-3, 1, 2);

    scene.add(pointLight);

    function resize() {
      const width = Math.max(
        ui.host.clientWidth,
        280
      );

      const height = Math.max(
        ui.host.clientHeight,
        220
      );

      camera.aspect = width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    }

    resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(ui.host);

    window.addEventListener('resize', resize);

    function animate() {
      renderFrame = requestAnimationFrame(animate);

      if (stageGroup) {
        stageGroup.rotation.y += 0.001;
      }

      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  }

  /* ======================================
     EVENTS
  ====================================== */

  ui.previous.addEventListener(
    'click',
    goPrevious
  );

  ui.next.addEventListener(
    'click',
    () => {
      stopAutoPlay();
      goNext();
    }
  );

  ui.play.addEventListener(
    'click',
    toggleAutoPlay
  );

  window.addEventListener(
    'probability:solution-ready',
    (event) => {
      loadProblem(event.detail);
    }
  );

  window.addEventListener(
    'pagehide',
    () => {
      stopAutoPlay();

      cancelAnimationFrame(renderFrame);

      resizeObserver?.disconnect();

      window.removeEventListener('resize', () => {});

      controls?.dispose();

      clearStage();

      renderer?.dispose();
    },
    { once: true }
  );

  initializeScene();
}
