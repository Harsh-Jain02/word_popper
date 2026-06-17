(function registerUi(app) {
  function applyTheme(theme) {
    app.themes.forEach((themeName) => document.body.classList.remove(`theme-${themeName}`));

    if (app.themes.includes(theme)) {
      document.body.classList.add(`theme-${theme}`);
      app.state.theme = theme;
    }

    app.dom.themeButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.theme === theme);
    });
  }

  function bindControls() {
    app.dom.form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (app.state.running) {
        app.game.handleInput(app.dom.input.value);
      }
    });

    app.dom.input.addEventListener('focus', () => {
      if (app.state.running) {
        app.dom.input.select();
      }
    });

    app.dom.introClose.addEventListener('click', hideIntro);
    app.dom.restartBtn.addEventListener('click', app.game.startGame);
    app.dom.startBtn.addEventListener('click', app.game.startGame);
    app.dom.stopBtn.addEventListener('click', app.game.stopGame);
    window.addEventListener('resize', app.game.resizeLayout);

    bindMobileOverlay();
    bindPinToggles();
    bindRotationToggle();
    bindThemeButtons();
  }

  function checkMobileOverlay() {
    if (!app.dom.mobileOverlay || app.state.mobileDismissed) {
      return;
    }

    const smallSide = Math.min(window.innerWidth, window.innerHeight);
    app.dom.mobileOverlay.classList.toggle('hidden', smallSide >= app.settings.mobileSmallSide);
  }

  function hideIntro() {
    app.dom.introOverlay.classList.add('hidden');
  }

  function bindMobileOverlay() {
    app.dom.mobileContinue.addEventListener('click', () => {
      app.state.mobileDismissed = true;
      app.dom.mobileOverlay.classList.add('hidden');
    });
  }

  function bindPinToggles() {
    app.dom.pinToggles.forEach((toggle) => {
      toggle.addEventListener('change', () => {
        app.floatingPanels.setPinned(toggle.dataset.floater, toggle.checked);
      });
    });
  }

  function bindRotationToggle() {
    app.dom.rotateBtn.addEventListener('click', () => {
      app.state.rotationEnabled = !app.state.rotationEnabled;
      app.dom.rotateBtn.classList.toggle('active', app.state.rotationEnabled);
      app.dom.rotateBtn.textContent = app.state.rotationEnabled ? 'Rotation: on' : 'Allow rotation';
      app.dom.rotateBtn.setAttribute('aria-pressed', app.state.rotationEnabled ? 'true' : 'false');
    });
  }

  function bindThemeButtons() {
    app.dom.themeButtons.forEach((button) => {
      button.addEventListener('click', () => applyTheme(button.dataset.theme));
    });
  }

  app.ui = {
    applyTheme,
    bindControls,
    checkMobileOverlay,
    hideIntro,
  };
})(window.WordPopper = window.WordPopper || {});
