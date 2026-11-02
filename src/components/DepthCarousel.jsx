'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './DepthCarousel.css';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/seed/depth1/800/1000', alt: 'Slide 1' },
  { image: 'https://picsum.photos/seed/depth2/800/1000', alt: 'Slide 2' },
  { image: 'https://picsum.photos/seed/depth3/800/1000', alt: 'Slide 3' },
  { image: 'https://picsum.photos/seed/depth4/800/1000', alt: 'Slide 4' },
  { image: 'https://picsum.photos/seed/depth5/800/1000', alt: 'Slide 5' },
  { image: 'https://picsum.photos/seed/depth6/800/1000', alt: 'Slide 6' },
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeItem = (it) => (typeof it === 'string' ? { image: it, alt: '' } : it);

const DepthCarousel = ({
  items = DEFAULT_ITEMS,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = '#05060a',
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  duration = 1000,
  ease = 'power3.out',
  autoplay = false,
  autoplayDelay = 3200,
  loop = true,
  showControls = true,
  showIndicators = true,
  onChange,
  className = '',
}) => {
  const data = useMemo(
    () => (Array.isArray(items) ? items : []).map(normalizeItem),
    [items]
  );
  const count = data.length;

  const rootRef    = useRef(null);
  const stageRef   = useRef(null);
  const cardRefs   = useRef([]);
  const overlayRefs = useRef([]);

  const posRef      = useRef(0);
  const focusRef    = useRef(0);
  const tweenRef    = useRef(null);
  const scaleRef    = useRef(1);
  const cfgRef      = useRef({});
  const onChangeRef = useRef(onChange);

  const dragRef       = useRef(null);
  const wheelTimerRef = useRef(null);
  const autoTimerRef  = useRef(null);
  const interactionPauseRef = useRef(0);
  const reducedRef    = useRef(false);

  const [active, setActive] = useState(0);

  onChangeRef.current = onChange;
  cfgRef.current = {
    count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur,
    duration, ease, loop, cardWidth, autoplayDelay,
  };

  const layout = useCallback((pos) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === 'left' ? -1 : 1;
    const sc  = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }

      const back  = Math.max(0, d);
      const az    = Math.abs(d);
      const shown = az <= cfg.visibleCards + 0.5;

      const tz = -cfg.depth  * d;
      const tx =  dir * cfg.spread * d;
      const ry =  dir * cfg.tilt   * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const zi = Math.round(2000 - d * 20);

      el.style.transform   = `translate(-50%,-50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity     = opacity.toFixed(3);
      el.style.zIndex      = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

      const ov = overlayRefs.current[i];
      if (ov) ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);
    }
  }, []);

  const notify = useCallback(
    (idx) => { setActive(idx); onChangeRef.current?.(idx, data[idx]); },
    [data]
  );

  const tweenTo = useCallback(
    (target, animate) => {
      tweenRef.current?.kill();
      const cfg = cfgRef.current;
      const proxy = { p: posRef.current };
      const dur = animate && !reducedRef.current ? cfg.duration / 1000 : 0;
      tweenRef.current = gsap.to(proxy, {
        p: target, duration: dur, ease: cfg.ease,
        onUpdate: () => { posRef.current = proxy.p; layout(proxy.p); },
        onComplete: () => {
          const n = cfg.count;
          if (n > 0) posRef.current = ((posRef.current % n) + n) % n;
          layout(posRef.current);
        },
      });
    },
    [layout]
  );

  const setFocus = useCallback(
    (rawIndex, animate = true) => {
      const cfg = cfgRef.current;
      const n   = cfg.count;
      if (!n) return;
      const idx   = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
      let   delta = idx - posRef.current;
      if (cfg.loop && n > 1) {
        delta = ((delta % n) + n) % n;
        if (delta > n / 2) delta -= n;
      }
      tweenTo(posRef.current + delta, animate);
      if (idx !== focusRef.current) { focusRef.current = idx; notify(idx); }
    },
    [tweenTo, notify]
  );

  const navigateBy = useCallback((step) => setFocus(focusRef.current + step, true), [setFocus]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const w   = entries[0].contentRect.width;
      const cfg = cfgRef.current;
      const needed = cfg.cardWidth + Math.abs(cfg.spread) * 1.25 + 24;
      scaleRef.current = clamp(w / needed, 0.4, 1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const cfg = cfgRef.current;
      if (cfg.count < 2) return;
      e.preventDefault();
      tweenRef.current?.kill();
      const raw   = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta = e.deltaMode === 1 ? raw * 24 : raw;
      const step  = clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
      posRef.current += step;
      layout(posRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [layout, setFocus]);

  const onPointerDown = useCallback((e) => {
    const cfg = cfgRef.current;
    if (cfg.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = {
      x: e.clientX, startPos: posRef.current,
      lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, id: e.pointerId,
    };
  }, []);

  const onPointerMove = useCallback((e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const cfg    = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
    const dx     = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) {
      drag.moved = true;
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (!drag.moved) return;
    const now = performance.now();
    const dt  = Math.max(now - drag.lastT, 1);
    drag.v    = (e.clientX - drag.lastX) / dt;
    drag.lastX = e.clientX;
    drag.lastT = now;
    posRef.current = drag.startPos - dx / stepPx;
    layout(posRef.current);
  }, [layout]);

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    const cfg    = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
    const projected = posRef.current - (drag.v * 180) / stepPx;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      interactionPauseRef.current = Date.now() + 4200;
      navigateBy(e.key === 'ArrowLeft' ? -1 : 1);
    }
  }, [navigateBy]);

  const onCardClick = useCallback((index) => {
    if (dragRef.current?.moved) return;
    setFocus(index, true);
  }, [setFocus]);

  useEffect(() => {
    reducedRef.current = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!autoplay || count < 2) return;
    const root = rootRef.current;
    let hovered = false;
    const stop  = () => { if (autoTimerRef.current) clearInterval(autoTimerRef.current); autoTimerRef.current = null; };
    const start = () => {
      stop();
      autoTimerRef.current = window.setInterval(
        () => { if (!hovered && Date.now() >= interactionPauseRef.current) navigateBy(1); },
        Math.max(cfgRef.current.autoplayDelay, 600)
      );
    };
    const cards = root?.querySelectorAll('.depth-carousel__card') ?? [];
    const onCardEnter = event => { if (event.pointerType === 'mouse') hovered = true; };
    const onCardLeave = event => { if (event.pointerType === 'mouse') hovered = false; };
    const onPointerDown = () => {
      interactionPauseRef.current = Date.now() + 4200;
    };
    cards.forEach(card => {
      card.addEventListener('pointerenter', onCardEnter);
      card.addEventListener('pointerleave', onCardLeave);
    });
    root?.addEventListener('pointerdown', onPointerDown, { passive: true });
    start();
    return () => {
      stop();
      cards.forEach(card => {
        card.removeEventListener('pointerenter', onCardEnter);
        card.removeEventListener('pointerleave', onCardLeave);
      });
      root?.removeEventListener('pointerdown', onPointerDown);
    };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => {
    layout(posRef.current);
  }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, cardWidth, cardHeight, radius, count]);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      if (autoTimerRef.current)  clearInterval(autoTimerRef.current);
    },
    []
  );

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{ '--dc-perspective': `${perspective}px` }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Galería de imágenes"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage" ref={stageRef}>
        {data.map((item, i) => (
          <div
            key={i}
            className={`depth-carousel__card${active === i ? ' is-active' : ''}`}
            ref={(el) => (cardRefs.current[i] = el)}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={active !== i}
            onClick={() => onCardClick(i)}
          >
            <img
              className="depth-carousel__img"
              src={item.image}
              alt={item.alt || ''}
              loading="eager"
              decoding="async"
              onError={event => {
                const image = event.currentTarget
                const card = image.parentElement
                if (item.fallbackImage && image.dataset.fallbackTried !== 'true') {
                  image.dataset.fallbackTried = 'true'
                  image.src = item.fallbackImage
                  return
                }
                card?.classList.add('has-error')
              }}
              draggable={false}
            />
            <span className="depth-carousel__fallback" aria-hidden="true">{item.alt || 'Fotografía no disponible'}</span>
            <span
              className="depth-carousel__tint"
              ref={(el) => (overlayRefs.current[i] = el)}
              style={{ background: tint }}
            />
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--prev"
            aria-label="Anterior"
            onClick={() => navigateBy(-1)}
          >‹</button>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--next"
            aria-label="Siguiente"
            onClick={() => navigateBy(1)}
          >›</button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots" role="tablist" aria-label="Diapositivas">
          {data.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Ir a imagen ${i + 1}`}
              className={`depth-carousel__dot${active === i ? ' is-active' : ''}`}
              onClick={() => setFocus(i, true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepthCarousel;

