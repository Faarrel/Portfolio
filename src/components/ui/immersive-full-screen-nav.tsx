// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import gsap from "gsap";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState, type RefObject } from "react";

/* ------------------------------------------------------------------ *
 * Inlined from ./useFocusTrap — keeps keyboard focus inside a container
 * while it's open, restores it to the trigger on close.
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

/**
 * Keeps keyboard focus inside `containerRef` while `active` is true.
 */
function useFocusTrap({ active, containerRef, initialFocusRef, onEscape }: UseFocusTrapParams) {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

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

const CLIPS = {
  bottom: {
    closedInitial: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  },
  top: {
    closedInitial: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  },
  left: {
    closedInitial: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
  },
  right: {
    closedInitial: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
  },
};

const REDUCED_MOTION_FADE_DURATION = 0.2;

export interface FullscreenNavLink {
  label: string;
  href: string;
}

export interface FullscreenNavProps {
  links?: FullscreenNavLink[];
  brand?: string;
  brandHref?: string;
  clipOrigin?: keyof typeof CLIPS;
  overlayBg?: string;
  linkColor?: string;
  linkHoverColor?: string;
  linkSizeClass?: string;
  headerClassName?: string;
  openDuration?: number;
  closeDuration?: number;
  ease?: string;
  headerOpenColor?: string;
  onOpen?: () => void;
  onClose?: () => void;
  children?: (isOpen: boolean, closeMenu: () => void) => ReactNode;
}

function FullscreenNav({
  links,
  brand = "FAARREL",
  brandHref = "/",
  clipOrigin = "bottom",
  overlayBg = "#121212",
  linkColor = "#E0E0E0",
  linkHoverColor = "#888888",
  linkSizeClass = "text-5xl",
  headerClassName = "",
  openDuration = 1.1,
  closeDuration = 1.0,
  ease = "power4.inOut",
  headerOpenColor = "#E0E0E0",
  onOpen,
  onClose,
  children,
}: FullscreenNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLElement | null>(null);
  const linksWrapperRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = () =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  const { closedInitial, open: openClipPath, closedFinal } = CLIPS[clipOrigin] ?? CLIPS.bottom;
  const isReducedMotion = reduceMotion();

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
        onStart: () => {
          isAnimatingRef.current = true;
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          onOpen?.();
        },
      });
      return;
    }

    const timeline = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
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

  const onCloseMenu = () => {
    timelineRef.current?.kill();
    document.body.style.overflow = "";
    (window as any).__lenis?.start();

    if (isReducedMotion) {
      timelineRef.current = gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: "power2.out",
        onStart: () => {
          isAnimatingRef.current = true;
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          setIsOpen(false);
          gsap.set(overlayRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
          onClose?.();
        },
      });
      return;
    }

    const timeline = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsOpen(false);
        gsap.set(overlayRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
        onClose?.();
      },
    });

    timelineRef.current = timeline;

    // Smoothly pulls content UP (-y) and pulls the overlay UP back to the top
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
  };

  const onToggleMenu = () => {
    if (isOpen) {
      onCloseMenu();
      return;
    }
    onOpenMenu();
  };

  const onLinkMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.color = linkHoverColor;
  };

  const onLinkMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.color = linkColor;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      (window as any).__lenis?.stop();
    } else {
      document.body.style.overflow = "";
      (window as any).__lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      (window as any).__lenis?.start();
    };
  }, [isOpen]);

  useFocusTrap({ active: isOpen, containerRef: rootRef, initialFocusRef: toggleButtonRef, onEscape: onCloseMenu });

  return (
    <div ref={rootRef}>
      <header className={`fixed top-0 left-0 right-0 z-70 flex h-20 items-center justify-between px-6 sm:px-8 bg-[#121212]/80 backdrop-blur-md ${headerClassName}`}>
        <a
          href={brandHref}
          onClick={(e) => {
            if (isOpen) {
              e.preventDefault();
              onCloseMenu();
            }
            const lenis = (window as any).__lenis;
            if (lenis) {
              lenis.start();
              lenis.scrollTo(0);
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="cursor-pointer transition-colors duration-300 flex items-center gap-2.5 group"
          style={{ color: isOpen ? headerOpenColor : "#E0E0E0" }}
        >
          <img src="/logo.png" alt="Faarrel" className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-105" />
          <span
            className="font-planet-kosmos text-base sm:text-lg font-normal tracking-wide text-white transition-colors duration-300"
            style={{ fontFamily: "'Planet Kosmos', sans-serif" }}
          >
            {brand}
          </span>
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
        style={{ clipPath: closedInitial, backgroundColor: overlayBg }}
        className={`fixed inset-0 z-60 flex flex-col items-center justify-center gap-2 overflow-y-auto ${
          isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
        }`}
        aria-hidden={!isOpen}
        role="navigation"
      >
        <div ref={linksWrapperRef} className="flex min-h-screen w-screen flex-col items-center justify-center motion-reduce:opacity-100">
          {children
            ? children(isOpen, onCloseMenu)
            : (links as FullscreenNavLink[]).map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={isOpen ? onCloseMenu : undefined}
                  tabIndex={isOpen ? 0 : -1}
                  style={{ color: linkColor }}
                  onMouseEnter={onLinkMouseEnter}
                  onMouseLeave={onLinkMouseLeave}
                  className={`${linkSizeClass} font-normal tracking-tight transition-colors motion-reduce:transition-none`}
                >
                  {label}
                </a>
              ))}
        </div>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * CustomNavbar — Panel layout
 * ------------------------------------------------------------------ */

const SOCIAL_ICONS: Record<string, ReactNode> = {
  discord: (
    <span className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:text-white transition-colors">
      Discord
    </span>
  ),
  github: (
    <span className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:text-white transition-colors">
      GitHub
    </span>
  ),
  instagram: (
    <span className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:text-white transition-colors">
      Instagram
    </span>
  ),
  fiverr: (
    <span className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:text-white transition-colors">
      Fiverr
    </span>
  ),
  email: (
    <span className="text-xs tracking-wider uppercase px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:text-white transition-colors">
      Email
    </span>
  ),
};

const DEFAULT_LINK_Y_OFFSET = 25;
const DEFAULT_LINK_DURATION = 0.7;
const DEFAULT_LINK_STAGGER = 0.06;
const DEFAULT_LINK_CHAR_STAGGER = 0.015;
const IMAGE_INITIAL_SCALE = 0.85;
const DEFAULT_IMAGE_START_SCALE = 0.9;
const DEFAULT_IMAGE_DURATION = 0.8;
const DEFAULT_IMAGE_STAGGER = 0.03;
const DEFAULT_SOCIAL_Y_OFFSET = 12;
const DEFAULT_SOCIAL_DURATION = 0.5;
const DEFAULT_SOCIAL_STAGGER = 0.05;
const HEADER_Y_OFFSET = -10;
const LOCATION_Y_OFFSET = 8;
const DELAY_OFFSET = 0.15;
const TAGLINE_DELAY_OFFSET = 0.06;
const IMAGE_DELAY_OFFSET = 0.1;
const SOCIAL_DELAY_OFFSET = 0.18;
const LOCATION_DELAY_OFFSET = 0.22;

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
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 1. Immediately unlock body scroll & resume Lenis
    document.body.style.overflow = "";
    const lenis = (window as any).__lenis;
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

    // Run immediately and reinforce after 250ms as overlay transitions away
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

export interface CustomNavbarLink {
  label: string;
  href: string;
}

export interface CustomNavbarSocial {
  type: string;
  href: string;
}

export interface CustomNavbarProps {
  links?: CustomNavbarLink[];
  images?: string[];
  agencyName?: string;
  socials?: CustomNavbarSocial[];
  location?: string;
  tagline?: string;
  isOpen?: boolean;
  onClose?: () => void;
  overlayBg?: string;
  delay?: number;
  linkOffsetY?: number;
  linkDuration?: number;
  linkStagger?: number;
  linkCharStagger?: number;
  imageStartScale?: number;
  imageDuration?: number;
  imageStagger?: number;
  socialOffsetY?: number;
  socialDuration?: number;
  socialStagger?: number;
}

function CustomNavbar({
  links = [
    { label: "Home", href: "#hero" },
    { label: "Creations & Craft", href: "#work" },
    { label: "Let's Talk", href: "#contact" },
  ],
  images = [],
  agencyName = "FAARREL",
  socials = [],
  location = "Indonesia",
  tagline = "Graphic Designer · Character Animator · Fullstack Developer",
  isOpen = false,
  onClose,
  overlayBg = "#09090b",
  delay = 0.8,
  linkOffsetY = DEFAULT_LINK_Y_OFFSET,
  linkDuration = DEFAULT_LINK_DURATION,
  linkStagger = DEFAULT_LINK_STAGGER,
  linkCharStagger = DEFAULT_LINK_CHAR_STAGGER,
  imageStartScale = DEFAULT_IMAGE_START_SCALE,
  imageDuration = DEFAULT_IMAGE_DURATION,
  imageStagger = DEFAULT_IMAGE_STAGGER,
  socialOffsetY = DEFAULT_SOCIAL_Y_OFFSET,
  socialDuration = DEFAULT_SOCIAL_DURATION,
  socialStagger = DEFAULT_SOCIAL_STAGGER,
}: CustomNavbarProps) {
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const socialsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const agencyRef = useRef<HTMLHeadingElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const locationRef = useRef<HTMLSpanElement | null>(null);
  const reduceMotion = () =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const isReducedMotion = reduceMotion();

  const killAllTweens = () => {
    const targets = [
      ...linksRef.current,
      ...imagesRef.current,
      ...socialsRef.current,
      agencyRef.current,
      taglineRef.current,
      locationRef.current,
    ].filter(Boolean);
    if (targets.length) gsap.killTweensOf(targets);
  };

  const resetAnimatedElements = () => {
    const validLinks = linksRef.current.filter(Boolean);
    const validImages = imagesRef.current.filter(Boolean);
    const validSocials = socialsRef.current.filter(Boolean);
    if (validLinks.length) gsap.set(validLinks, { y: linkOffsetY, opacity: 0 });
    if (validImages.length) gsap.set(validImages, { scale: IMAGE_INITIAL_SCALE, opacity: 0 });
    if (validSocials.length) gsap.set(validSocials, { y: socialOffsetY, opacity: 0 });
    if (agencyRef.current) gsap.set(agencyRef.current, { y: HEADER_Y_OFFSET, opacity: 0 });
    if (taglineRef.current) gsap.set(taglineRef.current, { y: HEADER_Y_OFFSET, opacity: 0 });
    if (locationRef.current) gsap.set(locationRef.current, { y: LOCATION_Y_OFFSET, opacity: 0 });
  };

  const setLinkRef = (index: number) => (element: HTMLDivElement | null) => {
    linksRef.current[index] = element;
  };

  const setImageRef = (index: number) => (element: HTMLDivElement | null) => {
    imagesRef.current[index] = element;
  };

  const setSocialRef = (index: number) => (element: HTMLAnchorElement | null) => {
    socialsRef.current[index] = element;
  };

  useEffect(() => {
    killAllTweens();

    if (!isOpen) return;

    resetAnimatedElements();

    if (reduceMotion()) {
      gsap.set(linksRef.current, { y: 0, opacity: 1 });
      return;
    }

    const animationDelay = Math.max(delay - DELAY_OFFSET, 0);

    gsap.fromTo(
      linksRef.current,
      { y: linkOffsetY, opacity: 0 },
      { y: 0, opacity: 1, duration: linkDuration, ease: "power2.out", stagger: linkStagger, delay: animationDelay },
    );
  }, [delay, isOpen, linkDuration, linkOffsetY, linkStagger]);

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
            style={{ opacity: 0, transform: `translateY(${linkOffsetY}px)` }}
          >
            <NavLinkHover
              label={link.label}
              href={link.href}
              charStagger={linkCharStagger}
              reduced={isReducedMotion}
              onClick={onClose}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const NAV_CONFIG: Partial<FullscreenNavProps> = {
  brand: "FAARREL",
  brandHref: "/",
  clipOrigin: "top",
  overlayBg: "#121212",
  headerOpenColor: "#E0E0E0",
  linkColor: "#E0E0E0",
  linkHoverColor: "#888888",
  openDuration: 0.9,
  closeDuration: 0.8,
};

const NAV_CONTENT: Partial<CustomNavbarProps> = {
  agencyName: "FAARREL",
  tagline: "Graphic Designer · Character Animator · Discord Architect · Fullstack Developer",
  location: "Indonesia",
  links: [
    { label: "Home", href: "#hero" },
    { label: "Creations & Craft", href: "#work" },
    { label: "Let's Talk", href: "#contact" },
  ],
  images: [],
  socials: [],
};

export interface ImmersiveFullscreenNavProps {
  navConfig?: Partial<FullscreenNavProps>;
  navContent?: Partial<CustomNavbarProps>;
  overlayBg?: string;
  headerOpenColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
  ease?: string;
  clipOrigin?: "top" | "bottom" | "left" | "right";
  openDuration?: number;
  closeDuration?: number;
  linkDuration?: number;
  linkStagger?: number;
  linkCharStagger?: number;
  linkOffsetY?: number;
  imageDuration?: number;
  imageStagger?: number;
  imageStartScale?: number;
  socialDuration?: number;
  socialStagger?: number;
  socialOffsetY?: number;
}

export default function ImmersiveFullscreenNav({ navConfig = NAV_CONFIG, navContent = NAV_CONTENT, ...props }: ImmersiveFullscreenNavProps) {
  const config = {
    ...NAV_CONFIG,
    ...navConfig,
    ...(props.overlayBg !== undefined ? { overlayBg: props.overlayBg } : {}),
    ...(props.headerOpenColor !== undefined ? { headerOpenColor: props.headerOpenColor } : {}),
    ...(props.linkColor !== undefined ? { linkColor: props.linkColor } : {}),
    ...(props.linkHoverColor !== undefined ? { linkHoverColor: props.linkHoverColor } : {}),
    ...(props.ease !== undefined ? { ease: props.ease } : {}),
    ...(props.clipOrigin !== undefined ? { clipOrigin: props.clipOrigin } : {}),
    ...(props.openDuration !== undefined ? { openDuration: props.openDuration } : {}),
    ...(props.closeDuration !== undefined ? { closeDuration: props.closeDuration } : {}),
  };

  const content = {
    ...NAV_CONTENT,
    ...navContent,
    ...(props.linkDuration !== undefined ? { linkDuration: props.linkDuration } : {}),
    ...(props.linkStagger !== undefined ? { linkStagger: props.linkStagger } : {}),
    ...(props.linkCharStagger !== undefined ? { linkCharStagger: props.linkCharStagger } : {}),
    ...(props.linkOffsetY !== undefined ? { linkOffsetY: props.linkOffsetY } : {}),
    ...(props.imageDuration !== undefined ? { imageDuration: props.imageDuration } : {}),
    ...(props.imageStagger !== undefined ? { imageStagger: props.imageStagger } : {}),
    ...(props.imageStartScale !== undefined ? { imageStartScale: props.imageStartScale } : {}),
    ...(props.socialDuration !== undefined ? { socialDuration: props.socialDuration } : {}),
    ...(props.socialStagger !== undefined ? { socialStagger: props.socialStagger } : {}),
    ...(props.socialOffsetY !== undefined ? { socialOffsetY: props.socialOffsetY } : {}),
  };

  return (
    <FullscreenNav {...config}>
      {(isOpen, onCloseMenu) => <CustomNavbar {...content} isOpen={isOpen} onClose={onCloseMenu} overlayBg={config.overlayBg} delay={config.openDuration} />}
    </FullscreenNav>
  );
}
