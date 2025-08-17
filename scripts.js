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
