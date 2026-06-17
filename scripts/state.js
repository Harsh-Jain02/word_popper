(function createState(app) {
  app.state = {
    animationStarted: false,
    bestStreak: 0,
    countdownTimer: null,
    floaters: [],
    lastTick: 0,
    mobileDismissed: false,
    nextId: 0,
    popped: 0,
    rotationEnabled: false,
    running: false,
    score: 0,
    spawnTimer: null,
    streak: 0,
    theme: 'dark',
    timeLeft: app.settings.gameSeconds,
    words: [],
  };
})(window.WordPopper = window.WordPopper || {});
