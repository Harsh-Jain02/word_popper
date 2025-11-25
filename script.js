const playfield = document.getElementById('playfield');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const activeCountEl = document.getElementById('active-count');
const form = document.getElementById('entry-form');
const input = document.getElementById('word-input');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayDetail = document.getElementById('overlay-detail');

const WORDS = [
  'orbit', 'pulse', 'flash', 'matrix', 'echo', 'slide', 'glow', 'spark', 'trace', 'drift',
  'storm', 'wave', 'pixel', 'shift', 'flare', 'bounce', 'swift', 'nova', 'comet', 'aura',
  'nexus', 'quark', 'vivid', 'sonic', 'lumen', 'prism', 'glyph', 'rally', 'sprint', 'ready',
  'prime', 'chase', 'fleet', 'clear', 'bold', 'rapid', 'punch', 'blaze', 'ripple', 'flashy',
  'bright', 'shine', 'racer', 'quick', 'laser', 'trace', 'hatch', 'orbit', 'tempo', 'rush',
  'dodge', 'sparkle', 'tumble', 'sketch', 'vector', 'cinder', 'ember', 'flick', 'rider', 'streak',
  'swirl', 'hustle', 'flare', 'snap', 'scale', 'craft', 'thrive', 'pulse', 'climb', 'float',
  'pilot', 'scale', 'atlas', 'nova', 'rover', 'tempo', 'drone', 'pioneer', 'spark', 'zenith'
];

const state = {
  running: false,
  words: [],
  spawnTimer: null,
  countdownTimer: null,
  timeLeft: 60,
  score: 0,
  nextId: 0,
  lastTick: 0,
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
  const word = pickWord();
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
  if (!state.running) return;
  const delta = (now - state.lastTick) / 1000 || 0;
  state.lastTick = now;

  const bounds = playfield.getBoundingClientRect();
  for (const word of state.words) {
    if (word.popped) continue;
    word.x += word.vx * delta;
    word.y += word.vy * delta;

    if (word.x <= 0) {
      word.x = 0;
      word.vx *= -1;
    } else if (word.x + word.w >= bounds.width) {
      word.x = bounds.width - word.w;
      word.vx *= -1;
    }

    if (word.y <= 0) {
      word.y = 0;
      word.vy *= -1;
    } else if (word.y + word.h >= bounds.height) {
      word.y = bounds.height - word.h;
      word.vy *= -1;
    }

    updateWordPosition(word);
  }
  requestAnimationFrame(tick);
}

function popWord(word) {
  if (!word || word.popped) return;
  word.popped = true;
  word.el.classList.add('popping');
  state.score += 1;
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
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 180);
  }
  input.value = '';
}

function startGame() {
  if (state.running) return;
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

function endGame() {
  state.running = false;
  clearInterval(state.spawnTimer);
  clearInterval(state.countdownTimer);
  startBtn.disabled = false;
  overlayTitle.textContent = 'Time!';
  overlayDetail.textContent = `You popped ${state.score} word${state.score === 1 ? '' : 's'}.`;
  overlay.classList.remove('hidden');
}

function resetGame() {
  state.running = false;
  clearInterval(state.spawnTimer);
  clearInterval(state.countdownTimer);
  state.score = 0;
  state.timeLeft = 60;
  state.words.forEach(w => w.el.remove());
  state.words = [];
  renderCounts();
}

function renderCounts() {
  scoreEl.textContent = state.score;
  timerEl.textContent = `${state.timeLeft}s`;
  activeCountEl.textContent = state.words.length;
}

startBtn.addEventListener('click', startGame);
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
});
