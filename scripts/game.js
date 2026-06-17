(function registerGame(app) {
  function clearTimers() {
    clearInterval(app.state.spawnTimer);
    clearInterval(app.state.countdownTimer);
    app.state.spawnTimer = null;
    app.state.countdownTimer = null;
  }

  function endGame() {
    app.state.running = false;
    clearTimers();
    app.dom.startBtn.disabled = false;
    app.dom.overlayTitle.textContent = 'Time!';
    app.dom.overlayDetail.textContent = `Words: ${app.state.popped} | Score: ${app.state.score} | Best streak: ${app.state.bestStreak}`;
    app.dom.overlay.classList.remove('hidden');
  }

  function handleInput(value) {
    const target = value.trim().toLowerCase();

    if (!target) {
      return;
    }

    const match = app.wordsEngine.findWord(target);
    if (match) {
      app.wordsEngine.popWord(match);
    } else {
      registerMiss(target);
    }

    app.dom.input.value = '';
  }

  function renderCounts() {
    app.dom.activeCountEl.textContent = app.state.words.length;
    app.dom.poppedEl.textContent = app.state.popped;
    app.dom.scoreEl.textContent = app.state.score;
    app.dom.streakEl.textContent = app.state.streak;
    app.dom.timerEl.textContent = `${app.state.timeLeft}s`;
  }

  function resetGame() {
    app.state.running = false;
    clearTimers();
    app.state.score = 0;
    app.state.popped = 0;
    app.state.streak = 0;
    app.state.bestStreak = 0;
    app.state.timeLeft = app.settings.gameSeconds;
    app.state.usedWords.clear();
    app.wordsEngine.clearWords();
    renderCounts();
  }

  function resizeLayout() {
    app.wordsEngine.resizeWords();
    app.floatingPanels.resize();
    app.ui.checkMobileOverlay();
  }

  function startAnimationLoop() {
    if (app.state.animationStarted) {
      return;
    }

    app.state.animationStarted = true;
    app.state.lastTick = performance.now();
    requestAnimationFrame(tick);
  }

  function startGame() {
    if (app.state.running) {
      return;
    }

    app.ui.hideIntro();
    resetGame();
    app.state.running = true;
    app.state.timeLeft = app.settings.gameSeconds;
    app.state.lastTick = performance.now();
    app.dom.startBtn.disabled = true;
    app.dom.overlay.classList.add('hidden');

    app.wordsEngine.spawnWord();
    app.state.spawnTimer = setInterval(app.wordsEngine.spawnWord, app.settings.spawnIntervalMs);
    app.state.countdownTimer = setInterval(tickCountdown, 1000);

    renderCounts();
    app.dom.input.focus();
  }

  function stopGame() {
    resetGame();
    app.dom.startBtn.disabled = false;
    app.dom.overlay.classList.add('hidden');
  }

  function registerMiss(target) {
    app.state.score -= target.length;
    app.state.streak = 0;
    renderCounts();
    app.dom.input.classList.add('shake');
    setTimeout(() => app.dom.input.classList.remove('shake'), 180);
  }

  function tick(now) {
    const delta = (now - app.state.lastTick) / 1000 || 0;
    app.state.lastTick = now;

    if (app.state.running) {
      app.floatingPanels.update(delta, now);
      app.wordsEngine.updateWords(delta, now);
    }

    requestAnimationFrame(tick);
  }

  function tickCountdown() {
    app.state.timeLeft -= 1;

    if (app.state.timeLeft <= 0) {
      app.state.timeLeft = 0;
      endGame();
    }

    renderCounts();
  }

  app.game = {
    endGame,
    handleInput,
    renderCounts,
    resetGame,
    resizeLayout,
    startAnimationLoop,
    startGame,
    stopGame,
  };
})(window.WordPopper = window.WordPopper || {});
