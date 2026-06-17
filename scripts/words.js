(function registerWords(app) {
  function clearWords() {
    app.state.words.forEach((word) => word.el.remove());
    app.state.words = [];
  }

  function findWord(text) {
    const target = text.trim().toLowerCase();
    return app.state.words.find((word) => word.text.toLowerCase() === target);
  }

  function pickAvailableWord() {
    const available = app.wordList.filter((word) => !app.state.usedWords.has(word.toLowerCase()));

    if (!available.length) {
      return null;
    }

    return available[Math.floor(Math.random() * available.length)];
  }

  function popWord(word) {
    if (!word || word.popped) {
      return;
    }

    word.popped = true;
    word.el.classList.add('popping');
    app.state.score += word.text.length;
    app.state.popped += 1;
    app.state.streak += 1;
    app.state.bestStreak = Math.max(app.state.bestStreak, app.state.streak);
    app.state.words = app.state.words.filter((activeWord) => activeWord.id !== word.id);

    app.game.renderCounts();
    word.el.addEventListener('animationend', () => word.el.remove());
  }

  function resizeWords() {
    const bounds = fieldBounds();

    for (const word of app.state.words) {
      app.motion.clampItem(word, bounds);
      app.motion.updateTransform(word);
    }
  }

  function spawnWord() {
    if (!app.state.running) {
      return;
    }

    const text = pickAvailableWord();
    if (!text) {
      return;
    }

    app.state.usedWords.add(text.toLowerCase());
    const word = createWord(text);
    app.state.words.push(word);
    app.motion.updateTransform(word);
    requestAnimationFrame(() => word.el.classList.remove('spawn'));
    app.game.renderCounts();
  }

  function updateWords(delta, now) {
    const bounds = fieldBounds();

    for (const word of app.state.words) {
      if (word.popped) {
        continue;
      }

      app.motion.moveWithinBounds(word, bounds, delta, now, app.state.rotationEnabled);
    }
  }

  function createWord(text) {
    const el = document.createElement('span');
    el.className = 'word spawn';
    el.textContent = text;

    const id = app.state.nextId++;
    el.dataset.id = String(id);
    app.dom.playfield.appendChild(el);

    const { width, height } = el.getBoundingClientRect();
    const bounds = fieldBounds();
    const { vx, vy } = app.motion.randomVelocity();

    return {
      angle: 0,
      el,
      h: height,
      id,
      lastBounce: 0,
      popped: false,
      text,
      vx,
      vy,
      w: width,
      x: Math.random() * Math.max(0, bounds.width - width),
      y: Math.random() * Math.max(0, bounds.height - height),
    };
  }

  function fieldBounds() {
    const rect = app.dom.playfield.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  app.wordsEngine = {
    clearWords,
    findWord,
    popWord,
    resizeWords,
    spawnWord,
    updateWords,
  };
})(window.WordPopper = window.WordPopper || {});
