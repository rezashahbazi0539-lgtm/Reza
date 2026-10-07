'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Leaf, Award } from 'lucide-react';

const DEFAULT_VIDEO_SRC =
  'https://media.base44.com/videos/public/6ac5e2213b8d803e00f70ab4/85717ee7e_Hand_displaying_manicured_nails_20261008003757.mp4';

const benefits = [
  { icon: Award, label: 'Salon Kalitesi' },
  { icon: Sparkles, label: 'Uzun Ömürlü' },
  { icon: Leaf, label: 'Vegan & Cruelty Free' },
  { icon: ShieldCheck, label: 'Uzmanlar Tarafından' },
];

export default function ScrollDrivenVideoHero({
  data,
  videoSrc = DEFAULT_VIDEO_SRC,
  posterSrc,
  scrollHeight = 350,
  debug = false,
}) {
  const h = data || {};

  // ── Refs ──────────────────────────────────────────────
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const debugRef = useRef(null);
  const targetProgressRef = useRef(0);
  const rafRef = useRef(null);
  const inViewRef = useRef(false);

  // ── State ─────────────────────────────────────────────
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [useStaticFallback, setUseStaticFallback] = useState(false);

  // ── Detect reduced-motion & low-perf devices ─────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setUseStaticFallback(true);
      return;
    }
    // Very low-end devices: fall back to static poster
    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as any).deviceMemory || 4;
    if (cores <= 2 || mem <= 2) {
      setUseStaticFallback(true);
    }
  }, []);

  // ── Video metadata ────────────────────────────────────
  useEffect(() => {
    if (useStaticFallback) return;
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      if (video.duration > 0 && isFinite(video.duration)) {
        setMetadataLoaded(true);
        // Seek to first frame
        video.currentTime = 0;
      }
    };
    const onError = () => setVideoError(true);

    if (video.readyState >= 1 && video.duration > 0) {
      onLoaded();
    } else {
      video.addEventListener('loadedmetadata', onLoaded);
    }
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('error', onError);
    };
  }, [useStaticFallback]);

  // ── Scroll-driven scrubbing ───────────────────────────
  useEffect(() => {
    if (useStaticFallback || !metadataLoaded) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      targetProgressRef.current = progress;
    };

    const tick = () => {
      if (!inViewRef.current) return;

      const p = targetProgressRef.current;
      const duration = video.duration;

      if (duration > 0 && isFinite(duration)) {
        const targetTime = Math.max(0, Math.min(p * duration, duration));
        // Only seek when difference is meaningful
        if (Math.abs(video.currentTime - targetTime) > 0.016) {
          try {
            video.currentTime = targetTime;
          } catch {}
        }
      }

      // Content layer: fade out as user scrolls through hero
      if (contentRef.current) {
        let opacity = 1;
        let translateY = 0;
        if (p > 0.12) {
          opacity = Math.max(0, 1 - (p - 0.12) / 0.28);
          translateY = -(p - 0.12) * 80;
        }
        contentRef.current.style.opacity = String(opacity);
        contentRef.current.style.transform = `translateY(${translateY}px)`;
      }

      // Debug overlay
      if (debug && debugRef.current) {
        const pct = (p * 100).toFixed(1);
        const ct = video.currentTime.toFixed(2);
        const dur = duration.toFixed(2);
        debugRef.current.textContent = `Scroll: ${pct}% | Time: ${ct}s / ${dur}s`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onIntersect = (entries) => {
      inViewRef.current = entries[0].isIntersecting;
      if (inViewRef.current) {
        handleScroll(); // sync immediately
        rafRef.current = requestAnimationFrame(tick);
      } else if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0,
      rootMargin: '0px',
    });
    observer.observe(container);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial sync

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [metadataLoaded, useStaticFallback, debug]);

  // ── Static fallback (reduced motion / low-perf / error) ──
  if (useStaticFallback || videoError) {
    const poster = posterSrc || h.image || 'https://picsum.photos/seed/citynail-hero-main/1920/1080';
    return (
      <section className="relative w-full h-screen overflow-hidden bg-brand-pink-bg">
        <img
          src={poster}
          alt="City Nail Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/40" />
        <HeroContent h={h} />
      </section>
    );
  }

  // ── Scroll-driven video hero ──────────────────────────
  return (
    <div
      ref={containerRef}
      style={{ height: `${scrollHeight}vh`, position: 'relative' }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Video background */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc || h.image}
          muted
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/45 pointer-events-none" />

        {/* Loading state */}
        {!metadataLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-pink-bg/60 z-10">
            <span className="text-sm font-medium text-brand-dark tracking-wide animate-pulse">
              Yükleniyor...
            </span>
          </div>
        )}

        {/* Content layer */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-20 flex items-center justify-center px-4"
          style={{ willChange: 'opacity, transform' }}
        >
          <HeroContent h={h} onDark />
        </div>

        {/* Bottom gradient to blend into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white/80 pointer-events-none z-10" />

        {/* Debug overlay */}
        {debug && (
          <div
            ref={debugRef}
            className="absolute top-4 right-4 z-30 bg-black/70 text-green-400 text-xs font-mono px-3 py-2 rounded"
          >
            Scroll: 0% | Time: 0s / 0s
          </div>
        )}
      </div>
    </div>
  );
}

// ── Content layer component ─────────────────────────────
function HeroContent({ h, onDark = false }) {
  return (
    <div className="max-w-3xl text-center">
      {h.eyebrow && (
        <p
          className={`text-xs font-semibold tracking-widest mb-4 uppercase ${
            onDark ? 'text-white/80' : 'text-brand-pink'
          }`}
        >
          {h.eyebrow}
        </p>
      )}
      <h1
        className={`text-3xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-4 ${
          onDark ? 'text-white' : 'text-brand-dark'
        }`}
      >
        {h.title || 'Senin Tarzını Yansıtan'}{' '}
        {h.highlight && (
          <span className="text-brand-pink italic">{h.highlight}</span>
        )}
      </h1>
      <p
        className={`text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto ${
          onDark ? 'text-white/85' : 'text-brand-muted'
        }`}
      >
        {h.description ||
          'Sınırsız yaratıcılık için premium ürünler. Salon kalitesinde manikür, artık parmak uçlarınızda.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/magaza" className="btn-primary text-center">
          {h.cta1 || 'ALIŞVERİŞE BAŞLA'}
        </Link>
        <Link
          href="/kategori/nail-art"
          className={`px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all text-center ${
            onDark
              ? 'border border-white/70 text-white hover:bg-white hover:text-brand-dark'
              : 'btn-secondary'
          }`}
        >
          {h.cta2 || 'NAIL ART KEŞFET'}
        </Link>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {benefits.map((b, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 text-center"
          >
            <b.icon size={20} className="text-brand-pink" />
            <span
              className={`text-xs font-medium ${
                onDark ? 'text-white/80' : 'text-brand-dark'
              }`}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
