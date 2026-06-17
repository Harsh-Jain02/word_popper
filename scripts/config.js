(function configure(app) {
  app.settings = Object.freeze({
    bounceCooldownMs: 40,
    gameSeconds: 60,
    mobileSmallSide: 720,
    rotationStep: 90,
    spawnIntervalMs: 1000,
    speedMax: 200,
    speedMin: 60,
  });

  app.themes = ['dark', 'light', 'neon', 'crt'];

  app.wordList = [
    'orbit', 'pulse', 'flash', 'matrix', 'echo', 'slide', 'glow', 'spark', 'trace', 'drift',
    'storm', 'wave', 'pixel', 'shift', 'flare', 'bounce', 'swift', 'nova', 'comet', 'aura',
    'nexus', 'quark', 'vivid', 'sonic', 'lumen', 'prism', 'glyph', 'rally', 'sprint', 'prime',
    'chase', 'fleet', 'clear', 'bold', 'rapid', 'punch', 'blaze', 'ripple', 'bright', 'shine',
    'racer', 'quick', 'laser', 'hatch', 'tempo', 'rush', 'dodge', 'sparkle', 'tumble', 'sketch',
    'vector', 'cinder', 'ember', 'flick', 'rider', 'streak', 'swirl', 'hustle', 'snap', 'scale',
    'craft', 'thrive', 'climb', 'float', 'pilot', 'atlas', 'rover', 'drone', 'pioneer', 'zenith',
    'flashy', 'ready', 'punchy', 'burst', 'dart', 'fling', 'hover', 'jolt', 'leap', 'loom',
    'loop', 'nudge', 'quiver', 'scout', 'swoop', 'twist', 'vault', 'vortex', 'whirl', 'zip',
  ];
})(window.WordPopper = window.WordPopper || {});
