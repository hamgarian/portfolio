const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function animateText(element, finalText, duration = 500) {
  if (!element) return;

  element.classList.remove('idle-wobble');

  const steps = Math.max(Math.floor(duration / 25), 1);
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep += 1;
    const progress = currentStep / steps;
    const revealCount = Math.floor(progress * finalText.length);

    const scrambled = finalText
      .split('')
      .map((char, index) => {
        if (index < revealCount) {
          return char;
        }
        return randomChars[Math.floor(Math.random() * randomChars.length)];
      })
      .join('');

    element.textContent = scrambled;

    if (currentStep >= steps) {
      clearInterval(interval);
      element.textContent = finalText;
      requestAnimationFrame(() => {
        element.classList.add('idle-wobble');
        startIdleGlitch(element, finalText);
      });
    }
  }, duration / steps);
}

function startIdleGlitch(element, finalText) {
  if (!element) return;

  if (element._glitchInterval) {
    clearInterval(element._glitchInterval);
  }

  element._glitchInterval = setInterval(() => {
    const index = Math.floor(Math.random() * finalText.length);
    const originalChars = finalText.split('');
    const glitchedChars = [...originalChars];

    glitchedChars[index] = randomChars[Math.floor(Math.random() * randomChars.length)];
    element.textContent = glitchedChars.join('');

    setTimeout(() => {
      element.textContent = finalText;
    }, 100);
  }, 400);
}

document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    animateText(heroTitle, heroTitle.textContent.trim(), 500);
  }

    // Initialize organization image sliders
    const orgCarousels = document.querySelectorAll('.org-carousel');
    orgCarousels.forEach((carousel) => {
      const track = carousel.querySelector('.org-track');
      if (!track) return;
      let slides = Array.from(track.children);
      if (slides.length <= 1) return;
      
      // Create seamless loop by cloning the first slide
      const totalSlides = slides.length;
      const firstClone = slides[0].cloneNode(true);
      track.appendChild(firstClone);
      slides = Array.from(track.children); // update to include clone
      
      let index = 0;
      let width = carousel.clientWidth;
      const intervalMs = parseInt(carousel.getAttribute('data-interval') || '1000', 10);
      let timerId = null;
      
      const applyTransform = (withTransition = true) => {
        track.style.transition = withTransition ? 'transform 400ms ease' : 'none';
        track.style.transform = `translateX(${-index * width}px)`;
      };
      
      const onResize = () => {
        width = carousel.clientWidth;
        // Snap to current index on resize without animation
        applyTransform(false);
      };
      
      const next = () => {
        index += 1;
        applyTransform(true);
        // If we've reached the clone (index === totalSlides), snap back to first slide after transition
        if (index === totalSlides) {
          const handleTransitionEnd = () => {
            track.removeEventListener('transitionend', handleTransitionEnd);
            index = 0;
            applyTransform(false);
            // Force reflow to ensure the transform is applied without transition
            // eslint-disable-next-line no-unused-expressions
            track.offsetHeight;
          };
          track.addEventListener('transitionend', handleTransitionEnd);
        }
      };
      
      const startTimer = () => {
        stopTimer();
        timerId = setInterval(next, intervalMs);
      };
      
      const stopTimer = () => {
        if (timerId !== null) {
          clearInterval(timerId);
          timerId = null;
        }
      };
      
      // Initialize
      onResize();
      window.addEventListener('resize', onResize);
      startTimer();
      
      // Do not pause on hover or visibility changes; keep scrolling continuously
    });

  const aboutSection = document.querySelector('.about');
  const updateAboutScale = () => {
    if (!aboutSection) return;
    const width = window.innerWidth;
    let scale = 0.85;
    if (width >= 1920){
      scale = 0.7;
    }
    else if (width >= 1600) {
      scale = 0.72;
    } else if (width >= 1300) {
      scale = 0.76;
    } else if (width >= 1100) {
      scale = 0.9;
    } else if (width >= 900) {
      scale = 1;
    } else {
      scale = 1;
    }
    aboutSection.style.setProperty('--compact-scale', scale);
  };

  updateAboutScale();
  window.addEventListener('resize', updateAboutScale);

  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    let dragState = null;
    let cardPositions = new Map();

    // Drag indicator setup
    const dragIndicator = document.getElementById('dragIndicator');
    const hasDraggedBefore = localStorage.getItem('hasDraggedSkillCard') === 'true';
    
    if (dragIndicator && !hasDraggedBefore) {
      const firstCard = skillsGrid.querySelector('.skill-card');
      if (firstCard) {
        const updateIndicatorPosition = () => {
          const cardRect = firstCard.getBoundingClientRect();
          const gridRect = skillsGrid.getBoundingClientRect();
          const offsetBottom = 75; // spacing below the card in pixels
          const cardCenterX = cardRect.left + cardRect.width / 2;
          
          // Use offsetTop for Y position to avoid scroll issues
          const cardOffsetTop = firstCard.offsetTop;
          const cardOffsetHeight = firstCard.offsetHeight;
          
          dragIndicator.style.left = (cardCenterX - gridRect.left) + 'px';
          dragIndicator.style.top = (cardOffsetTop + cardOffsetHeight + offsetBottom) + 'px';
          dragIndicator.style.transform = 'translateX(-50%)';
        };
        
        updateIndicatorPosition();
        window.addEventListener('resize', updateIndicatorPosition);
        window.addEventListener('scroll', updateIndicatorPosition, { passive: true });
        
        // Show indicator after a short delay
        setTimeout(() => {
          dragIndicator.classList.add('show');
        }, 500);
      }
    } else if (dragIndicator) {
      dragIndicator.style.display = 'none';
    }

    const updateCardPositions = () => {
      if (!dragState) return;
      const cards = Array.from(skillsGrid.querySelectorAll('.skill-card:not(.dragging):not(.placeholder)'));
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const gridRect = skillsGrid.getBoundingClientRect();
        cardPositions.set(card, {
          left: rect.left - gridRect.left,
          top: rect.top - gridRect.top
        });
      });
    };

    const animateCardRepositioning = () => {
      if (!dragState) return;
      
      // Store old positions before DOM reflow
      const oldPositions = new Map();
      const cards = Array.from(skillsGrid.querySelectorAll('.skill-card:not(.dragging):not(.placeholder)'));
      cards.forEach(card => {
        const stored = cardPositions.get(card);
        if (stored) {
          oldPositions.set(card, stored);
        }
      });
      
      // Force reflow to get new positions after placeholder move
      skillsGrid.offsetHeight;
      
      // Animate cards from old positions to new positions
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const gridRect = skillsGrid.getBoundingClientRect();
        const newLeft = rect.left - gridRect.left;
        const newTop = rect.top - gridRect.top;
        const oldPos = oldPositions.get(card);
        
        if (oldPos) {
          const deltaX = newLeft - oldPos.left;
          const deltaY = newTop - oldPos.top;
          
          if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
            // Set card back to old position using transform
            card.style.transform = `translate3d(${-deltaX}px, ${-deltaY}px, 0)`;
            card.style.transition = 'none';
            
            // Force reflow
            card.offsetHeight;
            
            // Animate to new position
            requestAnimationFrame(() => {
              card.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
              card.style.transform = 'translate3d(0, 0, 0)';
              
              const cleanup = () => {
                card.style.transition = '';
                card.style.transform = '';
                card.removeEventListener('transitionend', cleanup);
              };
              card.addEventListener('transitionend', cleanup);
            });
          }
        }
        
        // Update stored position
        cardPositions.set(card, { left: newLeft, top: newTop });
      });
    };

    const animateDrag = () => {
      if (!dragState) return;

      dragState.currentX += (dragState.targetX - dragState.currentX) * 0.2;
      dragState.currentY += (dragState.targetY - dragState.currentY) * 0.2;

      dragState.card.style.transform = `translate3d(${dragState.currentX}px, ${dragState.currentY}px, 0) scale(1.03)`;
      dragState.rafId = requestAnimationFrame(animateDrag);
    };

    const movePlaceholder = (clientX, clientY) => {
      if (!dragState) return;

      // Update positions before moving placeholder
      updateCardPositions();

      const gridRect = skillsGrid.getBoundingClientRect();
      const firstChild = skillsGrid.firstElementChild;
      let placeholderMoved = false;
      
      if (clientY < gridRect.top || clientX < gridRect.left) {
        if (firstChild && firstChild !== dragState.placeholder) {
          skillsGrid.insertBefore(dragState.placeholder, firstChild);
          placeholderMoved = true;
        }
      } else if (clientY > gridRect.bottom || clientX > gridRect.right) {
        if (skillsGrid.lastElementChild !== dragState.placeholder) {
          skillsGrid.appendChild(dragState.placeholder);
          placeholderMoved = true;
        }
      } else {
        const elementBelow = document.elementFromPoint(clientX, clientY);
        if (elementBelow) {
          const dropTarget = elementBelow.closest('.skill-card');
          if (dropTarget && dropTarget !== dragState.card && !dropTarget.classList.contains('placeholder')) {
            const rect = dropTarget.getBoundingClientRect();
            const shouldInsertBefore = clientY < rect.top + rect.height / 2;
            const currentNext = dragState.placeholder.nextSibling;
            const targetNext = shouldInsertBefore ? dropTarget : dropTarget.nextSibling;
            
            if (currentNext !== targetNext) {
              if (shouldInsertBefore) {
                skillsGrid.insertBefore(dragState.placeholder, dropTarget);
              } else {
                skillsGrid.insertBefore(dragState.placeholder, dropTarget.nextSibling);
              }
              placeholderMoved = true;
            }
          }
        }
      }

      if (placeholderMoved) {
        requestAnimationFrame(() => {
          animateCardRepositioning();
        });
      }
    };

    const handlePointerMove = (event) => {
      if (!dragState) return;
      event.preventDefault();

      dragState.targetX = event.clientX - dragState.offsetX - dragState.originLeft;
      dragState.targetY = event.clientY - dragState.offsetY - dragState.originTop;

      movePlaceholder(event.clientX, event.clientY);
    };

    const endDrag = () => {
      if (!dragState) return;

      const state = dragState;
      dragState = null;

      const {
        card,
        placeholder,
        originalTransition,
        rafId,
        bodyUserSelect
      } = state;

      cancelAnimationFrame(rafId);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', cancelDrag);
      window.removeEventListener('blur', cancelDrag);

      const placeholderRect = placeholder.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      document.body.style.userSelect = bodyUserSelect;

      // Clean up other cards' transforms
      const otherCards = Array.from(skillsGrid.querySelectorAll('.skill-card:not(.dragging):not(.placeholder)'));
      otherCards.forEach(otherCard => {
        otherCard.style.transition = '';
        otherCard.style.transform = '';
      });

      cardPositions.clear();
      skillsGrid.classList.remove('is-dragging');

      card.style.transition = 'none';
      card.style.transform = 'translate3d(0, 0, 0)';
      card.style.top = `${cardRect.top}px`;
      card.style.left = `${cardRect.left}px`;

      // Force layout to ensure top/left take effect before animating
      card.getBoundingClientRect();

      card.style.transition = 'top 0.28s cubic-bezier(0.22, 1, 0.36, 1), left 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease';
      card.style.top = `${placeholderRect.top}px`;
      card.style.left = `${placeholderRect.left}px`;

      const finalizeDrop = (event) => {
        if (event.propertyName !== 'top' && event.propertyName !== 'left') {
          return;
        }
        card.removeEventListener('transitionend', finalizeDrop);

        const parent = placeholder.parentNode;
        if (parent) {
          parent.insertBefore(card, placeholder);
          placeholder.remove();
        }

        card.classList.remove('dragging');
        card.style.transition = originalTransition || '';
        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.width = '';
        card.style.height = '';
        card.style.transform = '';
        card.style.pointerEvents = '';
      };

      card.addEventListener('transitionend', finalizeDrop);
    };

    const cancelDrag = () => {
      if (!dragState) return;
      endDrag();
    };

    const onPointerUp = (event) => {
      if (!dragState) return;
      event.preventDefault();
      endDrag();
    };

    skillsGrid.addEventListener('pointerdown', (event) => {
      const card = event.target.closest('.skill-card');
      if (!card || dragState) {
        return;
      }

      if (window.matchMedia('(pointer: coarse)').matches) {
        return;
      }

      if (typeof event.button === 'number' && event.button !== 0) {
        return;
      }

      event.preventDefault();

      const rect = card.getBoundingClientRect();
      const placeholder = document.createElement('div');
      placeholder.className = 'skill-card placeholder';
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.margin = window.getComputedStyle(card).margin;

      skillsGrid.insertBefore(placeholder, card);

      dragState = {
        card,
        placeholder,
        originLeft: rect.left,
        originTop: rect.top,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        rafId: null,
        originalTransition: card.style.transition,
        bodyUserSelect: document.body.style.userSelect
      };

      cardPositions.clear();
      updateCardPositions();
      skillsGrid.classList.add('is-dragging');

      // Hide drag indicator permanently
      if (dragIndicator) {
        dragIndicator.classList.remove('show');
        dragIndicator.classList.add('hide');
        localStorage.setItem('hasDraggedSkillCard', 'true');
        setTimeout(() => {
          dragIndicator.style.display = 'none';
        }, 300);
      }

      card.classList.add('dragging');
      card.style.transition = 'none';
      card.style.position = 'fixed';
      card.style.top = `${rect.top}px`;
      card.style.left = `${rect.left}px`;
      card.style.width = `${rect.width}px`;
      card.style.height = `${rect.height}px`;
      card.style.pointerEvents = 'none';
      card.style.transform = 'translate3d(0, 0, 0) scale(1.03)';

      document.body.appendChild(card);

      document.body.style.userSelect = 'none';

      dragState.rafId = requestAnimationFrame(animateDrag);

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', cancelDrag);
      window.addEventListener('blur', cancelDrag);
    });
  }

  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarsePointer) {
    const parallaxContainers = Array.from(document.querySelectorAll('.container'))
      .filter(container => !container.closest('header') && !container.closest('footer'));

    if (parallaxContainers.length) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      const ease = 0.08;
      const maxOffset = 10;

      const updateParallax = () => {
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        parallaxContainers.forEach(container => {
          container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        });

        requestAnimationFrame(updateParallax);
      };

      const handlePointerMove = (event) => {
        const { innerWidth, innerHeight } = window;
        if (!innerWidth || !innerHeight) return;

        const normX = (event.clientX / innerWidth) - 0.5;
        const normY = (event.clientY / innerHeight) - 0.5;

        targetX = normX * maxOffset;
        targetY = normY * maxOffset;
      };

      const resetParallax = () => {
        targetX = 0;
        targetY = 0;
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerleave', resetParallax);
      window.addEventListener('blur', resetParallax);

      updateParallax();
    }
  }

  if (aboutSection) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            aboutSection.classList.add('compact');
          } else {
            aboutSection.classList.remove('compact');
          }
        });
      },
      {
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0
      }
    );

    aboutObserver.observe(aboutSection);
  }
});

// Organization "Read more" toggles
(function() {
  const orgCards = document.querySelectorAll('.org-card');
  if (!orgCards.length) return;

  orgCards.forEach(card => {
    const collapsible = card.querySelector('.org-collapsible');
    const toggleBtn = card.querySelector('.org-toggle');
    if (!collapsible || !toggleBtn) return;

    // Initialize collapsed state
    const cssCollapsed = getComputedStyle(collapsible).getPropertyValue('--collapsed-height').trim() || '9.5rem';
    collapsible.style.maxHeight = cssCollapsed;
    toggleBtn.setAttribute('aria-expanded', 'false');

    const updateExpandedHeight = () => {
      // Temporarily set to auto to measure full height
      collapsible.style.maxHeight = 'none';
      const full = collapsible.scrollHeight;
      collapsible.style.maxHeight = `${full}px`;
    };

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        // Collapse
        toggleBtn.setAttribute('aria-expanded', 'false');
        card.classList.remove('expanded');
        // Force current height for smooth transition, then to 0
        const current = collapsible.scrollHeight;
        collapsible.style.maxHeight = `${current}px`;
        requestAnimationFrame(() => {
          collapsible.style.maxHeight = cssCollapsed;
        });
        toggleBtn.textContent = 'Read more';
      } else {
        // Expand
        toggleBtn.setAttribute('aria-expanded', 'true');
        card.classList.add('expanded');
        updateExpandedHeight();
        toggleBtn.textContent = 'Show less';
      }
    });

    // Recompute height on resize if expanded
    window.addEventListener('resize', () => {
      if (toggleBtn.getAttribute('aria-expanded') === 'true') {
        updateExpandedHeight();
      }
    });
  });
})();

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


const fallingText = document.querySelector('.hero p');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
  
  if (scrollDirection === 'down') {
  
    const fallDistance = Math.min(currentScrollY * 0.5, 200);
    fallingText.style.transform = `translateY(${fallDistance}px) rotate(${fallDistance * 0.1}deg)`;
    fallingText.style.opacity = Math.max(1 - currentScrollY * 0.002, 0);
  } else {
   
    const fallDistance = Math.min(currentScrollY * 0.5, 200);
    fallingText.style.transform = `translateY(${fallDistance}px) rotate(${fallDistance * 0.1}deg)`;
    fallingText.style.opacity = Math.max(1 - currentScrollY * 0.002, 0);
  }
  
  lastScrollY = currentScrollY;
});


const musicPlayer = document.getElementById('musicPlayer');
const bgMusic = document.getElementById('bgMusic');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const musicInfo = document.getElementById('musicInfo');

let isPlaying = false;


musicPlayer.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicPlayer.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    
    
    musicInfo.classList.remove('show');
  } else {
    bgMusic.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
    isPlaying = true;
    musicPlayer.classList.add('playing');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    
   
    musicInfo.classList.add('show');
    
    
    setTimeout(() => {
      musicInfo.classList.remove('show');
    }, 3000);
  }
});


bgMusic.addEventListener('ended', () => {
  if (isPlaying) {
    bgMusic.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
  }
});


document.addEventListener('visibilitychange', () => {
  if (document.hidden && isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicPlayer.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    
   
    musicInfo.classList.remove('show');
  }
});

// Tag System
(function() {
  const projectGrid = document.getElementById('projectGrid');
  const tagList = document.getElementById('tagList');
  
  if (!projectGrid || !tagList) return;
  
  // Load tag colors from localStorage or use defaults
  const defaultColors = {
    '#sveltekit': '#ff3e00',
    '#firebase': '#ffa000',
    '#twitter': '#1da1f2',
    '#api': '#00d4ff',
    '#fastapi': '#009688',
    '#websockets': '#4caf50',
    '#selenium': '#43b02a',
    '#gemini': '#4285f4',
    '#fullstack': '#9c27b0',
    '#web': '#2196f3'
  };
  
  let tagColors = JSON.parse(localStorage.getItem('tagColors') || '{}');
  Object.assign(tagColors, defaultColors);
  
  let activeFilters = [];
  
  // Get all unique tags from projects
  function getAllTags() {
    const tags = new Set();
    const projectCards = projectGrid.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      const tagsData = card.getAttribute('data-tags');
      if (tagsData) {
        try {
          const parsed = JSON.parse(tagsData);
          parsed.forEach(tag => tags.add(tag));
        } catch (e) {
          console.error('Error parsing tags:', e);
        }
      }
    });
    return Array.from(tags).sort();
  }
  
  // Save tag colors to localStorage
  function saveTagColors() {
    localStorage.setItem('tagColors', JSON.stringify(tagColors));
  }
  
  // Get color for a tag
  function getTagColor(tag) {
    if (!tagColors[tag]) {
      // Generate a random color if not set
      const hue = Math.floor(Math.random() * 360);
      tagColors[tag] = `hsl(${hue}, 70%, 50%)`;
      saveTagColors();
    }
    return tagColors[tag];
  }
  
  // Shared function to handle tag filtering
  function setActiveFilter(tag) {
    const tagIndex = activeFilters.indexOf(tag);
    if (tagIndex > -1) {
      // Remove tag if already active
      activeFilters.splice(tagIndex, 1);
    } else {
      // Add tag if not active
      activeFilters.push(tag);
    }
    updateActiveStates();
    filterProjects();
  }
  
  // Update active states for all tag buttons and project tags
  function updateActiveStates() {
    // Update filter menu buttons
    document.querySelectorAll('.tag-btn').forEach(btn => {
      const tag = btn.getAttribute('data-tag');
      if (activeFilters.includes(tag)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update project tags
    document.querySelectorAll('.project-tag').forEach(tagEl => {
      const tagText = tagEl.textContent.trim();
      if (activeFilters.includes(tagText)) {
        tagEl.classList.add('active');
      } else {
        tagEl.classList.remove('active');
      }
    });
  }
  
  // Render tags on project cards
  function renderProjectTags() {
    const projectCards = projectGrid.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      const tagsContainer = card.querySelector('.project-tags');
      if (!tagsContainer) return;
      
      tagsContainer.innerHTML = '';
      const tagsData = card.getAttribute('data-tags');
      if (tagsData) {
        try {
          const tags = JSON.parse(tagsData);
          // Sort tags alphabetically
          tags.sort();
          tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'project-tag';
            tagEl.textContent = tag;
            tagEl.style.cursor = 'pointer';
            const color = getTagColor(tag);
            tagEl.style.borderColor = color;
            tagEl.style.color = color;
            
            // Make project tags clickable
            tagEl.addEventListener('click', () => {
              setActiveFilter(tag);
            });
            
            tagsContainer.appendChild(tagEl);
          });
        } catch (e) {
          console.error('Error parsing tags:', e);
        }
      }
    });
    updateActiveStates();
  }
  
  // Create tag filter button
  function createTagButton(tag) {
    const btn = document.createElement('button');
    btn.className = 'tag-btn';
    btn.setAttribute('data-tag', tag);
    btn.textContent = tag;
    const color = getTagColor(tag);
    btn.style.borderColor = color;
    btn.style.color = color;
    
    btn.addEventListener('click', () => {
      setActiveFilter(tag);
    });
    
    return btn;
  }
  
  // Render tag filter list
  function renderTagList() {
    tagList.innerHTML = '';
    const tags = getAllTags();
    tags.forEach(tag => {
      const btn = createTagButton(tag);
      tagList.appendChild(btn);
    });
  }
  
  // Filter projects by tag (AND logic - must have ALL selected tags)
  function filterProjects() {
    const projectCards = projectGrid.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      // If no filters active, show all projects
      if (activeFilters.length === 0) {
        card.classList.remove('hidden');
        return;
      }
      
      const tagsData = card.getAttribute('data-tags');
      if (tagsData) {
        try {
          const tags = JSON.parse(tagsData);
          // Check if project has ALL active filters
          const hasAllTags = activeFilters.every(filterTag => tags.includes(filterTag));
          if (hasAllTags) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        } catch (e) {
          card.classList.add('hidden');
        }
      } else {
        card.classList.add('hidden');
      }
    });
  }
  
  // Initialize
  renderTagList();
  renderProjectTags();
})();

// Organization Tags (display-only)
(function() {
  const orgGrid = document.getElementById('orgGrid');
  if (!orgGrid) return;

  const defaultColors = {
    '#sveltekit': '#ff3e00',
    '#firebase': '#ffa000',
    '#twitter': '#1da1f2',
    '#api': '#00d4ff',
    '#fastapi': '#009688',
    '#websockets': '#4caf50',
    '#selenium': '#43b02a',
    '#gemini': '#4285f4',
    '#fullstack': '#9c27b0',
    '#web': '#2196f3',
    '#backend': '#9c27b0',
    '#event': '#03a9f4',
    '#nodejs': '#83cd29',
    '#react': '#61dafb',
    '#community': '#8bc34a',
    '#ops': '#795548',
    '#design': '#e91e63'
  };

  let tagColors = JSON.parse(localStorage.getItem('tagColors') || '{}');
  Object.assign(tagColors, defaultColors);

  function saveTagColors() {
    localStorage.setItem('tagColors', JSON.stringify(tagColors));
  }

  function getTagColor(tag) {
    if (!tagColors[tag]) {
      const hue = Math.floor(Math.random() * 360);
      tagColors[tag] = `hsl(${hue}, 70%, 50%)`;
      saveTagColors();
    }
    return tagColors[tag];
  }

  function renderOrgTags() {
    const cards = orgGrid.querySelectorAll('.org-card');
    cards.forEach(card => {
      const container = card.querySelector('.org-tags');
      if (!container) return;
      container.innerHTML = '';
      const tagsData = card.getAttribute('data-tags');
      if (!tagsData) return;
      try {
        const tags = JSON.parse(tagsData).sort();
        tags.forEach(tag => {
          const el = document.createElement('span');
          el.className = 'org-tag';
          el.textContent = tag;
          const color = getTagColor(tag);
          el.style.borderColor = color;
          el.style.color = color;
          container.appendChild(el);
        });
      } catch (e) {
        console.error('Error parsing org tags:', e);
      }
    });
  }

  renderOrgTags();
})();