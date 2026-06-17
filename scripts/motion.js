(function registerMotion(app) {
  function clampItem(item, bounds) {
    const maxX = Math.max(0, bounds.width - item.w);
    const maxY = Math.max(0, bounds.height - item.h);

    item.x = Math.min(Math.max(item.x, 0), maxX);
    item.y = Math.min(Math.max(item.y, 0), maxY);
  }

  function randomVelocity() {
    const angle = Math.random() * Math.PI * 2;
    const speed = app.settings.speedMin + Math.random() * (app.settings.speedMax - app.settings.speedMin);

    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
  }

  function updateTransform(item) {
    item.el.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${item.angle || 0}deg)`;
  }

  function moveWithinBounds(item, bounds, delta, now, shouldRotate) {
    item.x += item.vx * delta;
    item.y += item.vy * delta;

    const bounced = reflectFromEdges(item, bounds);
    clampItem(item, bounds);

    if (shouldRotate && bounced) {
      rotateOnBounce(item, now);
    }

    updateTransform(item);
  }

  function reflectFromEdges(item, bounds) {
    let bounced = false;

    if (item.x <= 0) {
      item.x = 0;
      item.vx = Math.abs(item.vx);
      bounced = true;
    } else if (item.x + item.w >= bounds.width) {
      item.x = bounds.width - item.w;
      item.vx = -Math.abs(item.vx);
      bounced = true;
    }

    if (item.y <= 0) {
      item.y = 0;
      item.vy = Math.abs(item.vy);
      bounced = true;
    } else if (item.y + item.h >= bounds.height) {
      item.y = bounds.height - item.h;
      item.vy = -Math.abs(item.vy);
      bounced = true;
    }

    return bounced;
  }

  function rotateOnBounce(item, now) {
    const sinceLastBounce = now - (item.lastBounce || 0);

    if (sinceLastBounce <= app.settings.bounceCooldownMs) {
      return;
    }

    item.angle = ((item.angle || 0) + app.settings.rotationStep) % 360;
    item.lastBounce = now;
  }

  app.motion = {
    clampItem,
    moveWithinBounds,
    randomVelocity,
    updateTransform,
  };
})(window.WordPopper = window.WordPopper || {});
