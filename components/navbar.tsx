'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { Home } from '@/components/icons';
import { PiGraphBold, PiSidebarSimpleBold } from 'react-icons/pi';

// Types pour les bibliothèques globales chargées par <Script>
declare global {
  interface Window {
    liquidGL: any;
    lil: any;
    $: any;
  }
}


export default function Navbar( {note} : {note: any} ) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Track previous nav position for transform-origin direction
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (navRef.current && prevPathRef.current !== pathname) {
      // Map the previous pathname to a nav index
      const navMap: Record<string, string> = { '/a': '1', '/': '2', '/graph': '3' };
      const prevNav = navMap[prevPathRef.current] || '2';
      navRef.current.setAttribute('data-previous', prevNav);
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  // --- LiquidGL initialization (replaces the old LiquidGlass function) ---
  const glassEffectRef = useRef<any>(null);
  const guiRef = useRef<any>(null);

  const initializeLiquidGL = useCallback(() => {
    if (typeof window === 'undefined') return;
    const { liquidGL, lil, $ } = window;
    if (!liquidGL) return;

    // Ripples effect
    if ($ && $.fn && $.fn.ripples) {
      $(".ripples").each(function (this: HTMLElement) {
        $(this).ripples({
          resolution: 512,
          dropRadius: 20,
          perturbance: 0.04,
          interactive: true,
        });
      });
    }

    // Initialize the Liquid Glass effect on our menu
    const getRefractionValue = () => {
            return window.innerWidth <= 767 ? 0.011 : 0.026;
    };

    glassEffectRef.current = liquidGL({
      target: "#shape",
      snapshot: "body",
      resolution: 2,
      refraction: getRefractionValue(),
      bevelDepth: 0.119,
      bevelWidth: 0.057,
      frost: 0,
      specular: true,
      shadow: true,
      reveal: "fade",
      tilt: false,
      tiltFactor: 10,
      magnify: 1,
    });

    // Build GUI after liquidGL initialised (multi-awareness)
    const lensList = Array.isArray(glassEffectRef.current)
      ? glassEffectRef.current
      : [glassEffectRef.current];
    const firstLens = lensList[0];

    if (firstLens && lil?.GUI) {
      guiRef.current = new lil.GUI();
      const glassFolder = guiRef.current.addFolder("liquidGL Effect");

      const updateAll = (key: string, value: any) => {
        lensList.forEach((ln: any) => {
          if (!ln) return;
          ln.options[key] = value;
          if (key === "shadow") ln.setShadow(value);
          if (key === "tilt") ln.setTilt(value);
        });
      };

      glassFolder.add(firstLens.options, "refraction", 0, 0.1, 0.001)
        .onChange((v: any) => updateAll("refraction", v));
      glassFolder.add(firstLens.options, "bevelDepth", 0, 0.2, 0.001)
        .onChange((v: any) => updateAll("bevelDepth", v));
      glassFolder.add(firstLens.options, "bevelWidth", 0, 0.5, 0.001)
        .onChange((v: any) => updateAll("bevelWidth", v));
      glassFolder.add(firstLens.options, "frost", 0, 10, 0.1)
        .onChange((v: any) => updateAll("frost", v));
      glassFolder.add(firstLens.options, "magnify", 1, 5, 0.1)
        .onChange((v: any) => updateAll("magnify", v));
      glassFolder.add(firstLens.options, "shadow")
        .onChange((v: any) => updateAll("shadow", v));
      glassFolder.add(firstLens.options, "specular")
        .onChange((v: any) => updateAll("specular", v));
      glassFolder.add(firstLens.options, "tilt")
        .onChange((v: any) => updateAll("tilt", v));
      glassFolder.add(firstLens.options, "tiltFactor", 0, 25, 0.1)
        .onChange((v: any) => updateAll("tiltFactor", v));
      glassFolder.add(firstLens.options, "reveal", ["none", "fade"])
        .onChange((v: any) => updateAll("reveal", v));
      glassFolder.close();
    }

    // Lenis + GSAP ticker sync
    window.liquidGL.syncWith();
  }, []);

  // Global navigation setup
  useEffect(() => {
    const navToggle = document.querySelector(".nav-toggle");
    const navContainer = document.querySelector(".nav-container");
    if (!navToggle || !navContainer) return;

    const handleToggle = () => {
      const isExpanded = navContainer.classList.contains("expanded");
      navContainer.classList.toggle("expanded");
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
    };
    const handleOutside = (e: MouseEvent) => {
      if (!navContainer.contains(e.target as Node)) {
        navContainer.classList.remove("expanded");
        navToggle.setAttribute("aria-expanded", "false");
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && navContainer.classList.contains("expanded")) {
        navContainer.classList.remove("expanded");
        navToggle.setAttribute("aria-expanded", "false");
      }
    };

    navToggle.addEventListener("click", handleToggle);
    document.addEventListener("click", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      navToggle.removeEventListener("click", handleToggle);
      document.removeEventListener("click", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Cleanup GUI on unmount
  useEffect(() => () => { guiRef.current?.destroy?.(); }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    const sidebar = document.querySelector(".sidebar") as HTMLElement | null;
    if (sidebar) {
      sidebar.style.display = showSidebar ? 'none' : 'block';
    }
  };

  return (
    <>
      {/* --- External CDN scripts --- */}
      <Script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/lil-gui@0.20/dist/lil-gui.umd.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js" strategy="beforeInteractive" />
      <Script src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/jquery.ripples@0.6.3/dist/jquery.ripples.min.js" strategy="afterInteractive" />

      {/* --- Local scripts from public/scripts/ --- */}
      <Script src="/scripts/html2canvas.min.js" strategy="afterInteractive" />
      <Script
        src="/scripts/liquidGL.js"
        strategy="afterInteractive"
        onLoad={initializeLiquidGL}
      />

      {/* --- Navigation (commented out) --- */}
    
    <nav id='menu-wrap' className="liquid-nav" ref={navRef} data-previous="1">
      <input className="liquid-nav__input" type="radio" name="page" value="sidebar" data-nav="1" checked={pathname === '/'} readOnly />
      <input className="liquid-nav__input" type="radio" name="page" value="home" data-nav="2" checked={pathname === `/${note?.slug}`} readOnly />
      <input className="liquid-nav__input" type="radio" name="page" value="graph" data-nav="3" checked={pathname === '/graph'} readOnly />
      <div className="liquid-nav__content">
        <button onClick={toggleSidebar} className={`liquid-nav__link ${pathname === '/' ? 'active' : ''}`}><PiSidebarSimpleBold size={24} /></button>
        <Link href={`/${note?.slug}`} className={`liquid-nav__link ${pathname === `/${note?.slug}` ? 'active' : ''}`}><Home size={24} /></Link>
        <Link href="/graph" className={`liquid-nav__link ${pathname === '/graph' ? 'active' : ''}`}><PiGraphBold size={24} /></Link>
      </div>
    </nav>
      
      {/*
      <div  style={{ zIndex: 9999, justifyContent: 'center', alignItems: 'center', display: 'flex', position: 'fixed', inset: 0, pointerEvents: 'none', mixBlendMode: 'difference' }}>
        <Link href="https://github.com/naughtyduk/liquidGL" style={{ textDecoration: 'none' }} target="_blank">
          <div id= style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem', borderRadius: '1.5vw', justifyContent: 'flex-start', position: 'relative', overflow: 'clip', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px) saturate(180%)', willChange: 'transform' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src="naughtyduk-logo.svg" alt="NaughtyDuk©" loading="lazy" height={36} width={75} />
            </div>
            <div style={{ zIndex: '3', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ zIndex: '3', color: '#b7b7b7', fontWeight: '700', letterSpacing: '-0.04rem' }}>liquidGL by NaughtyDuk©</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      */}
    </>
  );
}