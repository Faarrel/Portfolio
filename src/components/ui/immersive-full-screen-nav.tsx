"use client";

import gsap from "gsap";
import type { MouseEvent, RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * Inlined focus trap — keeps keyboard focus inside container
 * while open, restores to trigger on close.
 * ------------------------------------------------------------------ */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const isVisible = (element?: HTMLElement | null): boolean => {
  if (!element || element.hidden) return false;
  const style = window.getComputedStyle(element);
  if (style.visibility === "hidden" || style.visibility === "collapse") return false;
  return element.getClientRects().length > 0;
};

const getFocusableElements = (container?: HTMLElement | null): HTMLElement[] => {
  if (!container) return [];
  return (Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[]).filter(isVisible);
};

interface UseFocusTrapParams {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

function useFocusTrap({ active, containerRef, initialFocusRef, onEscape }: UseFocusTrapParams) {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusInitial = () => {
      const target = initialFocusRef?.current ?? getFocusableElements(container)[0] ?? container;
      if (!(target instanceof HTMLElement)) return;
      if (target === container && !container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
      }
      target.focus();
    };

    const focusFrame = requestAnimationFrame(focusInitial);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscapeRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(container);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === first || !container.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last || !container.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, initialFocusRef]);
}

/* ------------------------------------------------------------------ *
 * FullscreenNav — the clip-path reveal shell
 * ------------------------------------------------------------------ */

const REDUCED_MOTION_FADE_DURATION = 0.2;

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface FullscreenNavProps {
  links?: NavLinkItem[];
  brand?: string;
  brandHref?: string;
  overlayBg?: string;
  headerClassName?: string;
  headerOpenColor?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

function FullscreenNav({
  links = [
    { label: "Home", href: "#hero" },
    { label: "Identity & Craft", href: "#work" },
    { label: "Let's Talk", href: "#contact" },
  ],
  brand = "FAARREL",
  brandHref = "/",
  overlayBg = "#121212",
  headerClassName = "",
  headerOpenColor = "#E0E0E0",
  onOpen,
  onClose,
}: FullscreenNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLElement | null>(null);
  const linksWrapperRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const isReducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  const onOpenMenu = () => {
    setIsOpen(true);
    timelineRef.current?.kill();

    gsap.set(overlayRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", autoAlpha: 1 });
    gsap.set(linksWrapperRef.current, { opacity: 0, y: -40 });

    if (isReducedMotion) {
      gsap.set(overlayRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", autoAlpha: 0 });

      timelineRef.current = gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power2.out",
        onComplete: () => {
          onOpen?.();
        },
      });
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        onOpen?.();
      },
    });

    timelineRef.current = timeline;

    timeline
      .to(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.85,
        ease: "power4.out",
      })
      .to(
        linksWrapperRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.45"
      );
  };

  const onCloseMenu = useCallback(() => {
    timelineRef.current?.kill();
    document.body.style.overflow = "";
    window.__lenis?.start();

    if (isReducedMotion) {
      timelineRef.current = gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power2.out",
        onComplete: () => {
          setIsOpen(false);
          gsap.set(overlayRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
          onClose?.();
        },
      });
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        gsap.set(overlayRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
        onClose?.();
      },
    });

    timelineRef.current = timeline;

    timeline
      .to(linksWrapperRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
      })
      .to(
        overlayRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 0.55,
          ease: "power4.inOut",
        },
        "-=0.15"
      );
  }, [isReducedMotion, onClose]);

  const onToggleMenu = () => {
    if (isOpen) {
      onCloseMenu();
      return;
    }
    onOpenMenu();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.__lenis?.stop();
    } else {
      document.body.style.overflow = "";
      window.__lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
    };
  }, [isOpen]);

  useFocusTrap({ active: isOpen, containerRef: rootRef, initialFocusRef: toggleButtonRef, onEscape: onCloseMenu });

  return (
    <div ref={rootRef}>
      <header className={`fixed top-0 left-0 right-0 z-70 flex h-20 items-center justify-between px-6 sm:px-8 bg-[#121212]/80 backdrop-blur-md ${headerClassName}`}>
        <a
          href={brandHref}
          aria-label={brand}
          onClick={(e) => {
            if (isOpen) {
              e.preventDefault();
              onCloseMenu();
            }
            const lenis = window.__lenis;
            if (lenis) {
              lenis.start();
              lenis.scrollTo(0);
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="cursor-pointer transition-colors duration-300 flex items-center group"
        >
          <img src="/logo.webp" alt={brand} className="w-9 h-9 sm:w-11 sm:h-11 object-contain transition-transform duration-300 group-hover:scale-105" />
        </a>

        <div className="flex items-center gap-4">
          <button
            ref={toggleButtonRef}
            onClick={onToggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="flex size-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full border border-[#27272a] bg-[#18181b] hover:bg-[#202024] transition-colors"
          >
            <span
              style={{ backgroundColor: isOpen ? headerOpenColor : "#E0E0E0" }}
              className={`block h-0.5 w-5 transition-all duration-500 ease-in-out ${
                isOpen ? "translate-y-2 rotate-45" : isReducedMotion ? "translate-y-0 rotate-0" : ""
              }`}
            />
            <span
              style={{ backgroundColor: isOpen ? headerOpenColor : "#E0E0E0" }}
              className={`block h-0.5 w-5 transition-all duration-300 ${
                isOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
              }`}
            />
            <span
              style={{ backgroundColor: isOpen ? headerOpenColor : "#E0E0E0" }}
              className={`block h-0.5 w-5 transition-all duration-500 ease-in-out ${
                isOpen ? "-translate-y-2 -rotate-45" : isReducedMotion ? "translate-y-0 rotate-0" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <nav
        ref={overlayRef}
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", backgroundColor: overlayBg }}
        className={`fixed inset-0 z-60 flex flex-col items-center justify-center gap-2 overflow-y-auto ${
          isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
        }`}
        aria-hidden={!isOpen}
        role="navigation"
      >
        <div ref={linksWrapperRef} className="flex min-h-screen w-screen flex-col items-center justify-center motion-reduce:opacity-100">
          <CustomNavbar links={links} isOpen={isOpen} onClose={onCloseMenu} overlayBg={overlayBg} />
        </div>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * CustomNavbar & NavLinkHover
 * ------------------------------------------------------------------ */

const DEFAULT_LINK_Y_OFFSET = 25;
const DEFAULT_LINK_DURATION = 0.7;
const DEFAULT_LINK_STAGGER = 0.06;
const DEFAULT_LINK_CHAR_STAGGER = 0.015;
const DELAY_OFFSET = 0.15;

function NavLinkHover({
  label,
  href,
  charStagger,
  reduced,
  onClick,
}: {
  label: string;
  href: string;
  charStagger: number;
  reduced: boolean;
  onClick?: () => void;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 1. Immediately unlock body scroll & resume Lenis
    document.body.style.overflow = "";
    const lenis = window.__lenis;
    if (lenis) {
      lenis.start();
    }

    // 2. Trigger menu close animation
    onClick?.();

    // 3. Scroll to destination
    const executeScroll = () => {
      document.body.style.overflow = "";
      const target =
        href === "#" || href === "#hero"
          ? document.getElementById("hero") || document.body
          : document.querySelector(href);

      if (target) {
        if (lenis) {
          lenis.start();
          lenis.scrollTo(target, { offset: -70, immediate: false });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    };

    executeScroll();
    setTimeout(executeScroll, 250);
  };

  if (reduced) {
    return (
      <a href={href} onClick={handleClick} className="text-white hover:text-zinc-300">
        {label}
      </a>
    );
  }

  return (
    <a href={href} onClick={handleClick} className="group/link-hover inline-block no-underline">
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="relative inline-block overflow-hidden align-middle leading-[1.08]">
        {[...label].map((char, index) => (
          <span
            key={index}
            className="relative inline-block whitespace-pre transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover/link-hover:-translate-y-[1.2em] group-focus-visible/link-hover:-translate-y-[1.2em]"
            style={{ textShadow: "0 1.2em currentColor", transitionDelay: `${index * charStagger}s` }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </a>
  );
}

interface CustomNavbarProps {
  links: NavLinkItem[];
  isOpen?: boolean;
  onClose?: () => void;
  overlayBg?: string;
  delay?: number;
}

function CustomNavbar({
  links,
  isOpen = false,
  onClose,
  overlayBg = "#09090b",
  delay = 0.8,
}: CustomNavbarProps) {
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const isReducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  const killAllTweens = () => {
    const targets = linksRef.current.filter(Boolean);
    if (targets.length) gsap.killTweensOf(targets);
  };

  const resetAnimatedElements = useCallback(() => {
    const validLinks = linksRef.current.filter(Boolean);
    if (validLinks.length) gsap.set(validLinks, { y: DEFAULT_LINK_Y_OFFSET, opacity: 0 });
  }, []);

  const setLinkRef = (index: number) => (element: HTMLDivElement | null) => {
    linksRef.current[index] = element;
  };

  useEffect(() => {
    killAllTweens();

    if (!isOpen) return;

    resetAnimatedElements();

    if (isReducedMotion) {
      gsap.set(linksRef.current, { y: 0, opacity: 1 });
      return;
    }

    const animationDelay = Math.max(delay - DELAY_OFFSET, 0);

    gsap.fromTo(
      linksRef.current,
      { y: DEFAULT_LINK_Y_OFFSET, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: DEFAULT_LINK_DURATION,
        ease: "power2.out",
        stagger: DEFAULT_LINK_STAGGER,
        delay: animationDelay,
      }
    );
  }, [delay, isOpen, isReducedMotion, resetAnimatedElements]);

  return (
    <div
      style={{ backgroundColor: overlayBg }}
      className="flex min-h-screen w-full flex-col items-center justify-center px-8 sm:px-20 py-10 text-white"
    >
      <div className="flex flex-col items-center gap-5 sm:gap-8 text-center my-auto">
        {links.map((link, index) => (
          <div
            key={link.label}
            ref={setLinkRef(index)}
            className="z-60 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            style={{ opacity: 0, transform: `translateY(${DEFAULT_LINK_Y_OFFSET}px)` }}
          >
            <NavLinkHover
              label={link.label}
              href={link.href}
              charStagger={DEFAULT_LINK_CHAR_STAGGER}
              reduced={isReducedMotion}
              onClick={onClose}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Default Export
 * ------------------------------------------------------------------ */

export interface ImmersiveFullscreenNavProps {
  brand?: string;
  brandHref?: string;
  links?: NavLinkItem[];
  overlayBg?: string;
  headerClassName?: string;
}

export default function ImmersiveFullscreenNav(props: ImmersiveFullscreenNavProps) {
  return <FullscreenNav {...props} />;
}
