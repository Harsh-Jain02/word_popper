(function configure(app) {
  app.settings = Object.freeze({
    bounceCooldownMs: 40,
    gameSeconds: 60,
    mobileWarningMaxWidth: 720,
    rotationStep: 90,
    spawnIntervalMs: 1000,
    speedMax: 200,
    speedMin: 60,
  });

  app.defaultPinnedFloaters = ['hero', 'stats', 'controls'];
  app.themes = ['dark', 'light', 'neon', 'crt'];
})(window.WordPopper = window.WordPopper || {});
