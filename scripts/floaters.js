(function registerFloatingPanels(app) {
  function init() {
    app.state.floaters = floaterEntries()
      .filter((entry) => entry.el)
      .map(createFloater);

    app.state.floaters.forEach(app.motion.updateTransform);
  }

  function resize() {
    const bounds = frameBounds();

    for (const floater of app.state.floaters) {
      floater.w = floater.el.offsetWidth;
      floater.h = floater.el.offsetHeight;
      app.motion.clampItem(floater, bounds);
      app.motion.updateTransform(floater);
    }
  }

  function setPinned(key, pinned) {
    const floater = app.state.floaters.find((item) => item.key === key);

    if (floater) {
      floater.pinned = pinned;
    }
  }

  function isPinned(key) {
    const floater = app.state.floaters.find((item) => item.key === key);
    return Boolean(floater && floater.pinned);
  }

  function update(delta, now) {
    const bounds = frameBounds();

    for (const floater of app.state.floaters) {
      if (floater.pinned) {
        continue;
      }

      floater.w = floater.el.offsetWidth;
      floater.h = floater.el.offsetHeight;
      app.motion.moveWithinBounds(floater, bounds, delta, now, app.state.rotationEnabled);
    }
  }

  function createFloater(entry) {
    const { x, y } = entry.anchor();
    const { vx, vy } = app.motion.randomVelocity();

    return {
      angle: 0,
      el: entry.el,
      h: entry.el.offsetHeight,
      key: entry.key,
      lastBounce: 0,
      pinned: app.defaultPinnedFloaters.includes(entry.key),
      vx,
      vy,
      w: entry.el.offsetWidth,
      x,
      y,
    };
  }

  function floaterEntries() {
    return [
      { key: 'hero', el: app.dom.heroBox, anchor: () => ({ x: 20, y: 20 }) },
      { key: 'stats', el: app.dom.statsBox, anchor: statsAnchor },
      { key: 'controls', el: app.dom.controlsBox, anchor: controlsAnchor },
      { key: 'rotate', el: app.dom.rotateBox, anchor: rotateAnchor },
    ];
  }

  function controlsAnchor() {
    return {
      x: (app.dom.frame.clientWidth - app.dom.controlsBox.offsetWidth) / 2,
      y: app.dom.frame.clientHeight - app.dom.controlsBox.offsetHeight - 20,
    };
  }

  function frameBounds() {
    return {
      height: app.dom.frame.clientHeight,
      width: app.dom.frame.clientWidth,
    };
  }

  function rotateAnchor() {
    return {
      x: app.dom.frame.clientWidth - app.dom.rotateBox.offsetWidth - 20,
      y: app.dom.frame.clientHeight / 2 - app.dom.rotateBox.offsetHeight / 2,
    };
  }

  function statsAnchor() {
    return {
      x: app.dom.frame.clientWidth - app.dom.statsBox.offsetWidth - 20,
      y: 20,
    };
  }

  app.floatingPanels = {
    init,
    isPinned,
    resize,
    setPinned,
    update,
  };
})(window.WordPopper = window.WordPopper || {});
