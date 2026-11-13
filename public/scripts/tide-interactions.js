(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine) return;

  // Mesh Flow: a light canvas dot field that bends around the pointer.
  const canvas = document.createElement('canvas');
  canvas.className = 'tide-mesh';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) { canvas.remove(); return; }
  let width = 1, height = 1, dpr = 1, raf = 0, active = true;
  let pointer = { x: -1000, y: -1000 }, smooth = { x: -1000, y: -1000 };
  const spacing = 34;
  const resize = () => {
    const box = hero.getBoundingClientRect();
    width = Math.max(1, box.width); height = Math.max(1, box.height);
    dpr = Math.min(devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    request();
  };
  const draw = () => {
    raf = 0;
    if (!active || document.hidden) return;
    smooth.x += (pointer.x - smooth.x) * .12;
    smooth.y += (pointer.y - smooth.y) * .12;
    ctx.clearRect(0, 0, width, height);
    for (let y = 22; y < height; y += spacing) {
      for (let x = 18; x < width; x += spacing) {
        const dx = x - smooth.x, dy = y - smooth.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 1 - dist / 230);
        const bend = force * force * 25;
        const angle = Math.atan2(dy, dx);
        const px = x + Math.cos(angle) * bend;
        const py = y + Math.sin(angle) * bend;
        const alpha = .09 + force * .34;
        ctx.beginPath();
        ctx.arc(px, py, 1 + force * 1.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(190,151,119,' + alpha + ')';
        ctx.fill();
      }
    }
    if (Math.abs(pointer.x - smooth.x) + Math.abs(pointer.y - smooth.y) > 1) request();
  };
  const request = () => { if (!raf && active && !document.hidden) raf = requestAnimationFrame(draw); };
  hero.addEventListener('pointermove', e => {
    const box = hero.getBoundingClientRect();
    pointer.x = e.clientX - box.left; pointer.y = e.clientY - box.top; request();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.x = -1000; pointer.y = -1000; request(); }, { passive: true });
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; } else request(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { active = entries[0].isIntersecting; if (active) request(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } }).observe(hero);
  }
  resize(); request();

  // Scrolltide-style 3D response, kept on the existing functional cards.
  document.querySelectorAll('.signal-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const box = card.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width - .5;
      const y = (e.clientY - box.top) / box.height - .5;
      card.style.setProperty('--tide-rx', (-y * 5).toFixed(2) + 'deg');
      card.style.setProperty('--tide-ry', (x * 6).toFixed(2) + 'deg');
      card.classList.add('tide-tilting');
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tide-rx', '0deg');
      card.style.setProperty('--tide-ry', '0deg');
      card.classList.remove('tide-tilting');
    }, { passive: true });
  });
})();