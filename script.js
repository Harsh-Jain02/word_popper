(function bootstrap(app) {
  app.floatingPanels.init();
  app.ui.bindControls();
  app.ui.applyTheme(app.state.theme);
  app.ui.checkMobileOverlay();
  app.game.renderCounts();
  app.game.startAnimationLoop();
})(window.WordPopper);
