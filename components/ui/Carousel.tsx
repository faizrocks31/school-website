"use client";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

/**
 * A horizontal slide carousel built on native CSS scroll-snap.
 *
 * Why scroll-snap rather than a transform-based slider: touch/trackpad swiping,
 * momentum and rubber-banding come from the browser for free, and with
 * JavaScript disabled the slides are still reachable by ordinary horizontal
 * scrolling rather than being stuck on the first image.
 *
 * Pass one element per slide as `children`. Arrows and dots are hidden when
 * there is only one slide, so a single-slide carousel is not a dead control.
 */
export function Carousel({
  children,
  label,
  autoPlayMs = 0,
  showDots = true,
  showArrows = true,
  dotsClassName = "",
  arrowClassName = "bg-white/85 hover:bg-white text-slate-800",
}: {
  children: React.ReactNode;
  /** Accessible name for the carousel region. */
  label: string;
  /** 0 disables autoplay. Ignored when the user prefers reduced motion. */
  autoPlayMs?: number;
  showDots?: boolean;
  showArrows?: boolean;
  dotsClassName?: string;
  arrowClassName?: string;
}) {
  const slides = Children.toArray(children);
  const count = slides.length;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const multiple = count > 1;
  const autoPlaying = autoPlayMs > 0 && multiple && !paused && !reducedMotion;

  // Detect the motion preference after mount so the server and first client
  // render agree (a matchMedia read during render would hydration-mismatch).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const target = ((i % count) + count) % count;
      el.scrollTo({
        left: target * el.clientWidth,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      setIndex(target);
    },
    [count, reducedMotion]
  );

  // Keep the active index in sync with however the user moved — arrows opened by
  // JS, or a raw touch swipe that the browser handled natively.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth || 1;
        setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / w))));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  // Advance from the live scroll position rather than the `index` state, so a
  // swipe during the autoplay interval never causes a jump backwards.
  useEffect(() => {
    if (!autoPlaying) return;
    const t = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const w = el.clientWidth || 1;
      goTo(Math.round(el.scrollLeft / w) + 1);
    }, autoPlayMs);
    return () => clearInterval(t);
  }, [autoPlaying, autoPlayMs, goTo]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative group/carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Pausing on focus keeps a keyboard user from losing their place mid-slide.
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
      }}
    >
      <div
        ref={scrollerRef}
        // No `scroll-smooth` class here: it would make the explicit
        // `behavior: "auto"` in goTo() animate anyway, breaking the
        // prefers-reduced-motion path. Scroll animation is chosen in JS instead.
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        // The scroller itself is a tab stop so keyboard users can scroll it natively too.
        tabIndex={0}
        aria-live={autoPlaying ? "off" : undefined}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="w-full flex-shrink-0 snap-center snap-always"
          >
            {slide}
          </div>
        ))}
      </div>

      {showArrows && multiple ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-10 w-10 rounded-full shadow-md backdrop-blur transition opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100 ${arrowClassName}`}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-10 w-10 rounded-full shadow-md backdrop-blur transition opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100 ${arrowClassName}`}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      ) : null}

      {multiple && (showDots || autoPlayMs > 0) ? (
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full bg-black/35 backdrop-blur px-3 py-1.5 ${dotsClassName}`}>
          {showDots
            ? slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-2 bg-white/55 hover:bg-white/80"}`}
                />
              ))
            : null}
          {autoPlayMs > 0 ? (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={autoPlaying ? "Pause slideshow" : "Play slideshow"}
              className="ml-1 grid place-items-center h-5 w-5 text-white/85 hover:text-white"
            >
              {autoPlaying ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
