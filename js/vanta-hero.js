/**
 * VANTA.JS - EFFET BACKGROUND HERO
 * Configuration et initialisation de l'effet Vanta FOG pour le portfolio
 */

// ===== CONFIGURATION VANTA POUR LE PORTFOLIO =====
const VANTA_PORTFOLIO_CONFIG = {
  // Élément cible
  el: "#vanta-bg",
  
  // Contrôles d'interaction
  mouseControls: true,    // Interaction avec la souris
  touchControls: true,    // Interaction tactile (mobile)
  gyroControls: false,    // Gyroscope (désactivé pour les performances)
  
  // Dimensions pour couvrir toute la section sans contraintes
  scale: 1.0,            // Échelle à 100%
  scaleMobile: 1.0,      // Échelle mobile à 100%
  
  // Palette de couleurs identique sur tous les appareils (format hexadécimal 0x)
  highlightColor: 0x120027,  // Violet foncé (correspondant à votre thème)
  midtoneColor: 0x2026f6,    // Bleu (couleur primaire de votre portfolio)
  lowlightColor: 0x4869ff,   // Bleu clair
  baseColor: 0x000000,       // Noir absolu le plus profond (RGB: 0,0,0)
  
  // Paramètres d'effet identiques sauf le zoom
  blurFactor: 0.85,                               // Identique sur PC et mobile
  zoom: isMobileDevice() ? 0.5 : 0.65,           // PC: 0.65, Mobile: 0.5
  speed: 2.2                                      // Identique sur PC et mobile
};

// ===== DÉTECTION MOBILE =====
function isMobileDevice() {
  return window.innerWidth < 768 || 
         /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===== FALLBACK POUR MOBILE =====
function applyMobileFallback() {
  const vantaElement = document.getElementById('vanta-bg');
  if (vantaElement) {
    vantaElement.classList.add('vanta-fallback');
    console.log('Portfolio: Fallback mobile appliqué - gradient statique');
  }
}

// ===== INITIALISATION VANTA =====
function initPortfolioVanta() {
  try {
    // Vérifier que VANTA est disponible
    if (typeof VANTA === 'undefined') {
      console.error('Portfolio: VANTA.js n\'est pas chargé');
      applyMobileFallback();
      return null;
    }
    
    // Vérifier que l'élément cible existe
    const targetElement = document.querySelector(VANTA_PORTFOLIO_CONFIG.el);
    if (!targetElement) {
      console.error('Portfolio: Élément cible VANTA non trouvé:', VANTA_PORTFOLIO_CONFIG.el);
      return null;
    }
    
    // Initialiser l'effet VANTA FOG
    const vantaEffect = VANTA.FOG(VANTA_PORTFOLIO_CONFIG);
    console.log('Portfolio: Effet Vanta initialisé avec succès');
    
    return vantaEffect;
    
  } catch (error) {
    console.error('Portfolio: Erreur lors de l\'initialisation de Vanta:', error);
    applyMobileFallback();
    return null;
  }
}

// ===== GESTION DU REDIMENSIONNEMENT =====
function handleVantaResize() {
  window.addEventListener('resize', function() {
    // Vanta se redimensionne automatiquement
    // Détecter si on passe en mobile et appliquer le fallback si nécessaire
    if (isMobileDevice()) {
      const vantaElement = document.getElementById('vanta-bg');
      if (vantaElement && !vantaElement.classList.contains('vanta-fallback')) {
        applyMobileFallback();
      }
    }
  });
}

// ===== INITIALISATION PRINCIPALE =====
function initPortfolioBackground() {
  console.log('Portfolio: Initialisation de l\'effet background...');
  
  // Toujours essayer d'initialiser Vanta (mobile et desktop)
  console.log('Portfolio: Initialisation de Vanta pour tous les appareils');
  const effect = initPortfolioVanta();
  
  if (effect) {
    // Gestion du redimensionnement
    handleVantaResize();
  } else {
    // En cas d'échec, appliquer le fallback
    console.log('Portfolio: Échec de Vanta, application du fallback');
    applyMobileFallback();
  }
  
  console.log('Portfolio: Initialisation background terminée');
}

// ===== LANCEMENT AUTOMATIQUE =====
// Écouter l'événement de chargement de la section hero
window.addEventListener('heroSectionLoaded', function() {
  console.log('Portfolio: Section hero chargée, initialisation de Vanta...');
  initPortfolioBackground();
});

// Fallback : attendre que toutes les sections HTML soient chargées via include-html
function waitForHeroSection() {
  const heroSection = document.getElementById('hero');
  
  if (heroSection) {
    // Section trouvée, initialiser Vanta
    console.log('Portfolio: Section hero trouvée par fallback, initialisation de Vanta...');
    initPortfolioBackground();
  } else {
    // Section pas encore chargée, réessayer dans 200ms
    setTimeout(waitForHeroSection, 200);
  }
}

// S'assurer que le DOM est chargé avant de chercher la section hero
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Attendre un peu plus longtemps pour les includes
    setTimeout(waitForHeroSection, 500);
  });
} else {
  // DOM déjà chargé, mais attendre le chargement des includes
  setTimeout(waitForHeroSection, 500);
}

// ===== EXPORT POUR UTILISATION EXTERNE =====
window.PortfolioVanta = {
  init: initPortfolioBackground,
  config: VANTA_PORTFOLIO_CONFIG,
  isMobile: isMobileDevice
};
