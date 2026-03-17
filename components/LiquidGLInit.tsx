'use client'

import { useEffect } from 'react';

declare global {
  interface Window {
    liquidGL: any;
    html2canvas: any;
    __liquidGLInstance?: any;
    gsap: any;
    ScrollTrigger: any;
    lil: any;
    Lenis: any;
    $: any;
    jQuery: any;
  }
}

export default function LiquidGLInit() {
  useEffect(() => {
    const initLiquidGL = () => {
      // Vérifier que les dépendances sont chargées
      if (typeof window.html2canvas === 'undefined') {
        return false;
      }
      
      if (typeof window.liquidGL !== 'function') {
        return false;
      }

      // Vérifier que l'élément cible existe
      const target = document.querySelector('.liquid-nav');
      if (!target) {
        return false;
      }

      try {
        const glassEffect = window.liquidGL({
          target: '.liquid-nav',
          snapshot: 'body',
          resolution: 2,
          refraction: 0,
          bevelDepth: 0.052,
          bevelWidth: 0.211,
          frost: 2,
          shadow: true,
          specular: true,
          tilt: false,
          tiltFactor: 5,
          reveal: 'fade',
          magnify: 1,
          on: {
            init: function(instance: any) {
              console.log('✓ liquidGL ready!', instance);
            }
          }
        });

        // Stocker l'instance pour référence future
        window.__liquidGLInstance = glassEffect;

        return true;
      } catch (error) {
        console.error('liquidGL initialization error:', error);
        return false;
      }
    };

    // Essayer d'initialiser plusieurs fois jusqu'à ce que ça marche
    let attempts = 0;
    const maxAttempts = 30;
    
    const interval = setInterval(() => {
      attempts++;
      
      if (initLiquidGL()) {
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn('liquidGL initialization timeout');
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return null;
}
