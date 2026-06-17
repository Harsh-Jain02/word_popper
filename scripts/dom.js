(function cacheDom(app) {
  const byId = (id) => document.getElementById(id);

  app.dom = {
    activeCountEl: byId('active-count'),
    controlsBox: document.querySelector('.game-controls'),
    form: byId('entry-form'),
    frame: byId('frame'),
    heroBox: document.querySelector('.hero'),
    input: byId('word-input'),
    introClose: byId('intro-close'),
    introOverlay: byId('intro-overlay'),
    mobileContinue: byId('mobile-continue'),
    mobileOverlay: byId('mobile-overlay'),
    overlay: byId('overlay'),
    overlayDetail: byId('overlay-detail'),
    overlayTitle: byId('overlay-title'),
    pinToggles: document.querySelectorAll('.pin-toggle input'),
    playfield: byId('playfield'),
    poppedEl: byId('popped-count'),
    restartBtn: byId('restart-btn'),
    rotateBox: document.querySelector('.rotate-panel'),
    rotateBtn: byId('rotate-btn'),
    scoreEl: byId('score'),
    startBtn: byId('start-btn'),
    statsBox: document.querySelector('.stats'),
    stopBtn: byId('stop-btn'),
    streakEl: byId('streak'),
    themeButtons: document.querySelectorAll('[data-theme]'),
    timerEl: byId('timer'),
  };
})(window.WordPopper = window.WordPopper || {});
