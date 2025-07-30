/**
 * ANIMATIONS AU SCROLL - TRAITS DE SECTION
 * Anime les traits bleus horizontaux quand ils deviennent visibles
 */

// ===== CONFIGURATION =====
const ANIMATION_CONFIG = {
  // Zone étendue pour une détection plus précoce et plus tardive
  rootMargin: '100px 0px 100px 0px', // 100px avant et après le viewport
  // Seuil de visibilité pour déclencher l'animation
  threshold: [0, 0.1, 1],
  // Classes CSS pour les animations
  animateInClass: 'animate-in',
  animateOutClass: 'animate-out',
  quickAnimateClass: 'quick-animate',
  // Délais optimisés
  animationDuration: 700, // ms
  resetDelay: 50, // ms - réduit pour plus de réactivité
};

// ===== VARIABLES GLOBALES =====
let sectionDividersObserver;
let lastScrollY = window.scrollY;
let scrollDirection = 'down';
let animationTimeouts = new Map(); // Pour gérer les timeouts

// ===== GESTION DU SCROLL =====
// Détecter la direction du scroll de manière plus réactive
function updateScrollDirection() {
  const currentScrollY = window.scrollY;
  scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
  lastScrollY = currentScrollY;
}

// ===== ANIMATION DES ÉLÉMENTS =====
// Fonction pour animer un élément avec gestion des conflits
function animateElement(element, isEntering) {
  // Annuler tout timeout existant pour cet élément
  if (animationTimeouts.has(element)) {
    clearTimeout(animationTimeouts.get(element));
    animationTimeouts.delete(element);
  }

  if (isEntering) {
    // Entrée : retirer immédiatement les classes de sortie
    element.classList.remove(ANIMATION_CONFIG.animateOutClass);
    
    // Ajouter les classes d'animation selon la direction
    if (scrollDirection === 'up') {
      element.classList.add(ANIMATION_CONFIG.quickAnimateClass);
    } else {
      element.classList.remove(ANIMATION_CONFIG.quickAnimateClass);
    }
    
    // Forcer un reflow pour s'assurer que les changements prennent effet
    element.offsetHeight;
    
    // Ajouter la classe d'animation
    element.classList.add(ANIMATION_CONFIG.animateInClass);
    
  } else {
    // Sortie : animation de disparition plus fluide
    element.classList.remove(ANIMATION_CONFIG.animateInClass);
    element.classList.add(ANIMATION_CONFIG.animateOutClass);
    
    // Réinitialiser après la durée de l'animation
    const timeout = setTimeout(() => {
      element.classList.remove(ANIMATION_CONFIG.animateOutClass);
      element.classList.remove(ANIMATION_CONFIG.quickAnimateClass);
      animationTimeouts.delete(element);
    }, ANIMATION_CONFIG.resetDelay);
    
    animationTimeouts.set(element, timeout);
  }
}

// ===== OBSERVER INTERSECTION API =====
function createSectionDividersObserver() {
  // Écouter les changements de scroll avec throttling optimisé
  let scrollTimeout;
  let isScrolling = false;
  
  window.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    isScrolling = true;
    requestAnimationFrame(() => {
      updateScrollDirection();
      isScrolling = false;
    });
  }, { passive: true });
  
  sectionDividersObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Logique optimisée : apparition dès que visible, disparition seulement quand complètement sorti
      const isVisible = entry.isIntersecting;
      const ratio = entry.intersectionRatio;
      
      if (isVisible && ratio > 0) {
        // Élément devient visible dès qu'il entre dans la zone (même partiellement)
        animateElement(entry.target, true);
        console.log(`Animation trait: ENTRÉE (${scrollDirection}) - Ratio: ${ratio.toFixed(2)}`);
      } else if (!isVisible) {
        // Élément sort de vue uniquement quand complètement invisible
        animateElement(entry.target, false);
        console.log(`Animation trait: SORTIE (${scrollDirection}) - Ratio: ${ratio.toFixed(2)}`);
      }
    });
  }, {
    rootMargin: ANIMATION_CONFIG.rootMargin,
    threshold: [0, 0.1, 1] // Seuils multiples pour une détection plus précise
  });
}

// ===== INITIALISATION DES ANIMATIONS =====
function initSectionDividersAnimation() {
  // Trouver tous les traits de section
  const sectionDividers = document.querySelectorAll('.section-divider');
  
  if (sectionDividers.length === 0) {
    console.log('Aucun trait de section trouvé pour l\'animation');
    return;
  }
  
  console.log(`${sectionDividers.length} traits de section trouvés pour animation`);
  
  // Créer l'observer
  createSectionDividersObserver();
  
  // Observer chaque trait
  sectionDividers.forEach((divider, index) => {
    // Ajouter un délai progressif pour un effet en cascade (optionnel)
    if (index > 0) {
      const delayClass = `animate-delay-${Math.min(index, 3)}`;
      divider.classList.add(delayClass);
    }
    
    // Commencer à observer
    sectionDividersObserver.observe(divider);
  });
  
  console.log('Animation des traits de section initialisée');
}

// ===== ANIMATION AU CLIC POUR DÉMONSTRATION =====
function addClickAnimationDemo() {
  // Permettre de retrigger l'animation en cliquant sur un trait
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('section-divider')) {
      e.target.classList.remove(ANIMATION_CONFIG.animateClass);
      
      // Forcer un reflow pour que la suppression de classe prenne effet
      e.target.offsetHeight;
      
      // Réajouter la classe pour relancer l'animation
      setTimeout(() => {
        e.target.classList.add(ANIMATION_CONFIG.animateClass);
      }, 50);
    }
  });
}

// ===== GESTION DU REDIMENSIONNEMENT =====
function handleResize() {
  // Réinitialiser les observers lors du redimensionnement
  window.addEventListener('resize', () => {
    if (sectionDividersObserver) {
      sectionDividersObserver.disconnect();
      // Nettoyer l'événement de scroll précédent
      window.removeEventListener('scroll', updateScrollDirection);
      setTimeout(initSectionDividersAnimation, 200);
    }
  });
}

// ===== NETTOYAGE =====
function cleanupScrollAnimations() {
  if (sectionDividersObserver) {
    sectionDividersObserver.disconnect();
  }
  window.removeEventListener('scroll', updateScrollDirection);
}

// ===== ATTENDRE LE CHARGEMENT DES SECTIONS =====
function waitForSectionsLoaded() {
  // Écouter l'événement de chargement de toutes les sections
  window.addEventListener('allSectionsLoaded', function() {
    console.log('Toutes les sections chargées, initialisation des animations...');
    initSectionDividersAnimation();
    addClickAnimationDemo();
    handleResize();
  });
  
  // Fallback : vérifier périodiquement
  const checkSections = () => {
    const sectionDividers = document.querySelectorAll('.section-divider');
    
    if (sectionDividers.length > 0) {
      // Sections trouvées, initialiser les animations
      setTimeout(() => {
        initSectionDividersAnimation();
        addClickAnimationDemo();
        handleResize();
      }, 300);
    } else {
      // Réessayer dans 300ms
      setTimeout(checkSections, 300);
    }
  };
  
  // Lancer le fallback avec un délai
  setTimeout(checkSections, 1000);
}

// ===== INITIALISATION PRINCIPALE =====
function initScrollAnimations() {
  console.log('Initialisation des animations au scroll...');
  
  // Vérifier le support de l'Intersection Observer
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver non supporté, animations désactivées');
    return;
  }
  
  // Attendre que les sections soient chargées
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSectionsLoaded);
  } else {
    waitForSectionsLoaded();
  }
}

// ===== LANCEMENT AUTOMATIQUE =====
initScrollAnimations();

// ===== EXPORT POUR UTILISATION EXTERNE =====
window.ScrollAnimations = {
  init: initScrollAnimations,
  reinit: initSectionDividersAnimation,
  cleanup: cleanupScrollAnimations,
  config: ANIMATION_CONFIG
};
