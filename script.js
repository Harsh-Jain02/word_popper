const playfield = document.getElementById('playfield');
const frame = document.getElementById('frame');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreEl = document.getElementById('score');
const poppedEl = document.getElementById('popped-count');
const streakEl = document.getElementById('streak');
const timerEl = document.getElementById('timer');
const activeCountEl = document.getElementById('active-count');
const form = document.getElementById('entry-form');
const input = document.getElementById('word-input');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayDetail = document.getElementById('overlay-detail');
const introOverlay = document.getElementById('intro-overlay');
const introClose = document.getElementById('intro-close');
const pinToggles = document.querySelectorAll('.pin-toggle input');
const themeButtons = document.querySelectorAll('[data-theme]');
const heroBox = document.querySelector('.hero');
const statsBox = document.querySelector('.stats');
const controlsBox = document.querySelector('.game-controls');

const WORDS = [
  'orbit', 'pulse', 'flash', 'matrix', 'echo', 'slide', 'glow', 'spark', 'trace', 'drift',
  'storm', 'wave', 'pixel', 'shift', 'flare', 'bounce', 'swift', 'nova', 'comet', 'aura',
  'nexus', 'quark', 'vivid', 'sonic', 'lumen', 'prism', 'glyph', 'rally', 'sprint', 'prime',
  'chase', 'fleet', 'clear', 'bold', 'rapid', 'punch', 'blaze', 'ripple', 'bright', 'shine',
  'racer', 'quick', 'laser', 'hatch', 'tempo', 'rush', 'dodge', 'sparkle', 'tumble', 'sketch',
  'vector', 'cinder', 'ember', 'flick', 'rider', 'streak', 'swirl', 'hustle', 'snap', 'scale',
  'craft', 'thrive', 'climb', 'float', 'pilot', 'atlas', 'rover', 'drone', 'pioneer', 'zenith',
  'flashy', 'ready', 'punchy', 'burst', 'dart', 'fling', 'hover', 'jolt', 'leap', 'loom',
  'loop', 'nudge', 'quiver', 'scout', 'swoop', 'twist', 'vault', 'vortex', 'whirl', 'zip'
];

const state = {
  running: false,
  words: [],
  spawnTimer: null,
  countdownTimer: null,
  timeLeft: 60,
  score: 0,
  popped: 0,
  streak: 0,
  bestStreak: 0,
  nextId: 0,
  lastTick: 0,
  floaters: [],
  theme: 'dark',
};

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function randomVelocity() {
  const angle = Math.random() * Math.PI * 2;
  const speed = 60 + Math.random() * 140; // pixels per second
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

function spawnWord() {
  if (!state.running) return;
  const activeTexts = new Set(state.words.map(w => w.text.toLowerCase()));
  const available = WORDS.filter(w => !activeTexts.has(w.toLowerCase()));
  if (!available.length) return;
  const word = available[Math.floor(Math.random() * available.length)];
  const el = document.createElement('span');
  el.className = 'word spawn';
  el.textContent = word;
  const id = state.nextId++;
  el.dataset.id = String(id);
  playfield.appendChild(el);

  const rect = playfield.getBoundingClientRect();
  const { width, height } = el.getBoundingClientRect();
  const maxX = Math.max(0, rect.width - width);
  const maxY = Math.max(0, rect.height - height);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  const { vx, vy } = randomVelocity();

  state.words.push({ id, text: word, x, y, vx, vy, w: width, h: height, el, popped: false });
  updateWordPosition(state.words[state.words.length - 1]);
  requestAnimationFrame(() => el.classList.remove('spawn'));
  renderCounts();
}

function updateWordPosition(word) {
  word.el.style.transform = `translate(${word.x}px, ${word.y}px)`;
}

function tick(now) {
  const delta = (now - state.lastTick) / 1000 || 0;
  state.lastTick = now;

  updateFloaters(delta);

  if (state.running) {
    const bounds = playfield.getBoundingClientRect();
  for (const word of state.words) {
    if (word.popped) continue;
    word.x += word.vx * delta;
    word.y += word.vy * delta;

    if (word.x <= 0) {
      word.x = 0;
      word.vx = Math.abs(word.vx);
    } else if (word.x + word.w >= bounds.width) {
      word.x = bounds.width - word.w;
      word.vx = -Math.abs(word.vx);
    }

    if (word.y <= 0) {
      word.y = 0;
      word.vy = Math.abs(word.vy);
    } else if (word.y + word.h >= bounds.height) {
      word.y = bounds.height - word.h;
      word.vy = -Math.abs(word.vy);
    }

    updateWordPosition(word);
  }
  }

  requestAnimationFrame(tick);
}

function popWord(word) {
  if (!word || word.popped) return;
  word.popped = true;
  word.el.classList.add('popping');
  const gain = word.text.length;
  state.score += gain;
  state.popped += 1;
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  renderCounts();
  word.el.addEventListener('animationend', () => {
    word.el.remove();
  });
  state.words = state.words.filter(w => w.id !== word.id);
}

function handleInput(value) {
  const target = value.trim().toLowerCase();
  if (!target) return;
  const match = state.words.find(w => w.text.toLowerCase() === target);
  if (match) {
    popWord(match);
  } else {
    state.score -= target.length;
    state.streak = 0;
    renderCounts();
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 180);
  }
  input.value = '';
}

function startGame() {
  if (state.running) return;
  hideIntro();
  resetGame();
  state.running = true;
  state.timeLeft = 60;
  state.lastTick = performance.now();
  startBtn.disabled = true;
  overlay.classList.add('hidden');
  spawnWord();
  state.spawnTimer = setInterval(spawnWord, 1000);
  state.countdownTimer = setInterval(() => {
    state.timeLeft -= 1;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      endGame();
    }
    renderCounts();
  }, 1000);
  renderCounts();
  input.focus();
  requestAnimationFrame(tick);
}

function stopGame() {
  resetGame();
  startBtn.disabled = false;
  overlay.classList.add('hidden');
}

function endGame() {
  state.running = false;
  clearInterval(state.spawnTimer);
  clearInterval(state.countdownTimer);
  startBtn.disabled = false;
  overlayTitle.textContent = 'Time!';
  overlayDetail.textContent = `Words: ${state.popped} | Score: ${state.score} | Best streak: ${state.bestStreak}`;
  overlay.classList.remove('hidden');
}

function resetGame() {
  state.running = false;
  clearInterval(state.spawnTimer);
  clearInterval(state.countdownTimer);
  state.score = 0;
  state.popped = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.timeLeft = 60;
  state.words.forEach(w => w.el.remove());
  state.words = [];
  renderCounts();
}

function renderCounts() {
  scoreEl.textContent = state.score;
  poppedEl.textContent = state.popped;
  streakEl.textContent = state.streak;
  timerEl.textContent = `${state.timeLeft}s`;
  activeCountEl.textContent = state.words.length;
}

startBtn.addEventListener('click', startGame);
stopBtn.addEventListener('click', stopGame);
restartBtn.addEventListener('click', startGame);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!state.running) return;
  handleInput(input.value);
});

input.addEventListener('focus', () => {
  if (!state.running) return;
  input.select();
});

window.addEventListener('resize', () => {
  // Keep words within bounds if window shrinks.
  const bounds = playfield.getBoundingClientRect();
  for (const word of state.words) {
    word.x = Math.min(word.x, Math.max(0, bounds.width - word.w));
    word.y = Math.min(word.y, Math.max(0, bounds.height - word.h));
    updateWordPosition(word);
  }

  const vw = frame.clientWidth;
  const vh = frame.clientHeight;
  for (const floater of state.floaters) {
    const rect = floater.el.getBoundingClientRect();
    floater.w = rect.width;
    floater.h = rect.height;
    floater.x = Math.min(floater.x, Math.max(0, vw - floater.w));
    floater.y = Math.min(floater.y, Math.max(0, vh - floater.h));
    floater.el.style.transform = `translate(${floater.x}px, ${floater.y}px)`;
  }
});

function applyTheme(theme) {
  const themes = ['dark', 'light', 'neon', 'crt'];
  themes.forEach(t => document.body.classList.remove(`theme-${t}`));
  if (themes.includes(theme)) {
    document.body.classList.add(`theme-${theme}`);
    state.theme = theme;
  }
  themeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

function initFloaters() {
  const frameRect = frame.getBoundingClientRect();
  const innerW = frame.clientWidth;
  const innerH = frame.clientHeight;
  const entries = [
    { key: 'hero', el: heroBox, anchor: () => ({ x: 20, y: 20 }) },
    {
      key: 'stats',
      el: statsBox,
      anchor: () => {
        const rect = statsBox.getBoundingClientRect();
        return { x: innerW - rect.width - 20, y: 20 };
      },
    },
    {
      key: 'controls',
      el: controlsBox,
      anchor: () => {
        const rect = controlsBox.getBoundingClientRect();
        return { x: (innerW - rect.width) / 2, y: innerH - rect.height - 20 };
      },
    },
  ];

  state.floaters = entries.map(entry => {
    const rect = entry.el.getBoundingClientRect();
    const { x, y } = entry.anchor();
    const { vx, vy } = randomVelocity();
    return {
      key: entry.key,
      el: entry.el,
      x,
      y,
      w: rect.width,
      h: rect.height,
      vx,
      vy,
      pinned: false,
    };
  });

  for (const floater of state.floaters) {
    floater.el.style.transform = `translate(${floater.x}px, ${floater.y}px)`;
  }
}

function updateFloaters(delta) {
  const bounds = { w: frame.clientWidth, h: frame.clientHeight };
  for (const floater of state.floaters) {
    if (floater.pinned) continue;
    const rect = floater.el.getBoundingClientRect();
    floater.w = rect.width;
    floater.h = rect.height;

    floater.x += floater.vx * delta;
    floater.y += floater.vy * delta;

    if (floater.x <= 0) {
      floater.x = 0;
      floater.vx = Math.abs(floater.vx);
    } else if (floater.x + floater.w >= bounds.w) {
      floater.x = bounds.w - floater.w;
      floater.vx = -Math.abs(floater.vx);
    }

    if (floater.y <= 0) {
      floater.y = 0;
      floater.vy = Math.abs(floater.vy);
    } else if (floater.y + floater.h >= bounds.h) {
      floater.y = bounds.h - floater.h;
      floater.vy = -Math.abs(floater.vy);
    }

    floater.x = Math.min(floater.x, Math.max(0, bounds.w - floater.w));
    floater.y = Math.min(floater.y, Math.max(0, bounds.h - floater.h));

    floater.el.style.transform = `translate(${floater.x}px, ${floater.y}px)`;
  }
}

pinToggles.forEach(toggle => {
  toggle.addEventListener('change', () => {
    const key = toggle.dataset.floater;
    const floater = state.floaters.find(f => f.key === key);
    if (floater) {
      floater.pinned = toggle.checked;
    }
  });
});

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    applyTheme(btn.dataset.theme);
  });
});

initFloaters();
applyTheme(state.theme);
state.lastTick = performance.now();
requestAnimationFrame(tick);

function hideIntro() {
  if (introOverlay) {
    introOverlay.classList.add('hidden');
  }
}

if (introClose) {
  introClose.addEventListener('click', hideIntro);
}
