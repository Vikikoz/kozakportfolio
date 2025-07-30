// script.js
document.querySelectorAll('[include-html]').forEach(async el => {
  const file = el.getAttribute('include-html');
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    el.innerHTML = `<p>Erreur lors du chargement de ${file}</p>`;
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
