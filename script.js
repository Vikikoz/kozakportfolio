// script.js
let sectionsLoaded = 0;
const totalSections = document.querySelectorAll('[include-html]').length;

document.querySelectorAll('[include-html]').forEach(async el => {
  const file = el.getAttribute('include-html');
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const html = await res.text();
    el.innerHTML = html;
    
    // Compter les sections chargées
    sectionsLoaded++;
    
    // Si c'est la section hero qui vient d'être chargée, déclencher l'événement Vanta
    if (file.includes('hero.html')) {
      // Attendre un peu que le DOM soit mis à jour
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('heroSectionLoaded'));
      }, 100);
    }
    
    // Si toutes les sections sont chargées, déclencher l'événement d'initialisation des animations
    if (sectionsLoaded === totalSections) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('allSectionsLoaded'));
        console.log('Toutes les sections sont chargées');
      }, 200);
    }
    
  } catch (err) {
    el.innerHTML = `<p>Erreur lors du chargement de ${file}</p>`;
    sectionsLoaded++; // Compter même en cas d'erreur
  }
});

// 🔽 SYSTÈME AFFICHER PLUS/MOINS POUR LES PROJETS (par groupes de 2)
let currentVisibleGroup = 0; // Groupe actuellement visible (0 = projets de base)

function showMoreProjects() {
  currentVisibleGroup++;
  
  // Trouve tous les projets du groupe actuel
  const projectsToShow = document.querySelectorAll(`.project-card-link[data-group="${currentVisibleGroup}"]`);
  
  // Affiche les projets du groupe actuel
  projectsToShow.forEach(project => {
    project.classList.remove('project-hidden');
  });
  
  // Gestion des boutons
  const showMoreBtn = document.querySelector('.show-more-btn');
  const showLessBtn = document.querySelector('.show-less-btn');
  
  // Trouve le groupe maximum disponible
  const allGroups = document.querySelectorAll('.project-card-link[data-group]');
  const maxGroup = Math.max(...Array.from(allGroups).map(el => parseInt(el.dataset.group)));
  
  // Si on a atteint le dernier groupe, cache le bouton "Afficher plus"
  if (currentVisibleGroup >= maxGroup) {
    showMoreBtn.classList.add('hidden');
  }
  
  // Affiche le bouton "Afficher moins" si on a affiché au moins un groupe
  if (currentVisibleGroup > 0) {
    showLessBtn.classList.remove('hidden');
  }
}

function showLessProjects() {
  // Cache tous les projets des groupes 1 et plus
  const allHiddenProjects = document.querySelectorAll('.project-card-link[data-group]');
  
  allHiddenProjects.forEach(project => {
    project.classList.add('project-hidden');
  });
  
  // Remet le compteur à 0 (état de base)
  currentVisibleGroup = 0;
  
  // Gestion des boutons
  const showMoreBtn = document.querySelector('.show-more-btn');
  const showLessBtn = document.querySelector('.show-less-btn');
  
  // Affiche le bouton "Afficher plus" et cache "Afficher moins"
  showMoreBtn.classList.remove('hidden');
  showLessBtn.classList.add('hidden');
  
  // Scroll automatique vers le début de la section projets
  const projectsSection = document.querySelector('#projects');
  if (projectsSection) {
    projectsSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// 🔽 FLÈCHE DE SCROLL HERO - Scroll fluide vers la section suivante
document.addEventListener('DOMContentLoaded', function() {
  // Attendre que toutes les sections soient chargées avant d'ajouter l'événement
  window.addEventListener('allSectionsLoaded', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      // Clic sur la flèche pour scroller
      scrollIndicator.addEventListener('click', function() {
        // Trouver la première section après hero
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      });
      
      // Masquer la flèche quand l'utilisateur scroll
      let isScrolling = false;
      window.addEventListener('scroll', function() {
        if (isScrolling) return;
        isScrolling = true;
        
        requestAnimationFrame(function() {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          if (scrollTop > 100) {
            // Masquer la flèche après avoir scrollé un peu
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
          } else {
            // Afficher la flèche quand on est en haut
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
          }
          
          isScrolling = false;
        });
      }, { passive: true });
    }
  });
});
