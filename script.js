// Contact form submission handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(this);
  const name = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const message = this.querySelector('textarea').value;
  
  // Simple validation
  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }
  
  // Show success message with animation
  const button = this.querySelector('button');
  const originalText = button.textContent;
  button.textContent = 'Sending...';
  button.disabled = true;
  
  setTimeout(() => {
    button.textContent = 'Message Sent!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '#0066cc';
      button.disabled = false;
      this.reset();
    }, 2000);
  }, 1000);
});

// Profile image handling
function handleProfileImage() {
  const profileImage = document.querySelector('.profile-image');
  const placeholder = document.querySelector('.profile-placeholder');
  
  if (profileImage) {
    profileImage.addEventListener('load', function() {
      this.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    });
    
    profileImage.addEventListener('error', function() {
      this.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    });
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
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

// Add active class to navigation links on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
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

// Add scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Dynamic text animation
const roles = [
  "Data Science Enthusiast",
  "Web Developer", 
  "AI Explorer",
  "Python Developer",
  "Machine Learning Engineer",
  "Prompt Engineer"
];

let currentRoleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeDynamicText() {
  const dynamicText = document.getElementById('dynamic-text');
  const currentRole = roles[currentRoleIndex];
  
  if (isDeleting) {
    // Deleting text
    dynamicText.textContent = currentRole.substring(0, currentCharIndex - 1);
    currentCharIndex--;
    typingSpeed = 50;
  } else {
    // Typing text
    dynamicText.textContent = currentRole.substring(0, currentCharIndex + 1);
    currentCharIndex++;
    typingSpeed = 100;
  }
  
  // Handle transitions
  if (!isDeleting && currentCharIndex === currentRole.length) {
    // Finished typing, wait then start deleting
    typingSpeed = 2000; // Wait 2 seconds
    isDeleting = true;
  } else if (isDeleting && currentCharIndex === 0) {
    // Finished deleting, move to next role
    isDeleting = false;
    currentRoleIndex = (currentRoleIndex + 1) % roles.length;
    typingSpeed = 500; // Wait before starting next word
  }
  
  setTimeout(typeDynamicText, typingSpeed);
}

// Add typing effect to hero section
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
  const heroTitle = document.querySelector('#hero h1');
  const originalText = heroTitle.textContent;
  typeWriter(heroTitle, originalText, 150);
  
  // Start dynamic text animation
  setTimeout(typeDynamicText, 2000); // Start after hero title finishes
  
  // Handle profile image
  handleProfileImage();
});

// Add skill animation on hover
document.querySelectorAll('.skill-list span').forEach(skill => {
  skill.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1) rotate(2deg)';
  });
  
  skill.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) rotate(0deg)';
  });
}); 

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    darkModeToggle.textContent = '🌙';
    localStorage.setItem('darkMode', 'disabled');
  }
}

darkModeToggle.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
});

// On load, set dark mode if user previously enabled it or prefers dark
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'enabled' || (saved === null && prefersDark)) {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
}); 

// --- Advanced 3D Background System ---
const canvas = document.getElementById('cubes-bg');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Multiple particle systems for layered depth
const particleSystems = {
  background: [],
  midground: [],
  foreground: []
};

// Configuration for different layers
const layerConfig = {
  background: { count: 150, size: [1, 3], speed: [0.1, 0.3], opacity: [0.1, 0.3] },
  midground: { count: 80, size: [2, 6], speed: [0.2, 0.5], opacity: [0.2, 0.5] },
  foreground: { count: 40, size: [4, 12], speed: [0.3, 0.8], opacity: [0.3, 0.7] }
};

// Geometric shapes for the foreground
const geometricShapes = [];
const NUM_SHAPES = 15;

// Mouse and scroll tracking
let mouseX = width / 2, mouseY = height / 2, scrollY = 0;
let time = 0;

// Initialize particle systems
function initializeParticleSystems() {
  Object.keys(particleSystems).forEach(layer => {
    const config = layerConfig[layer];
    for (let i = 0; i < config.count; i++) {
      particleSystems[layer].push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: randomBetween(config.size[0], config.size[1]),
        speed: randomBetween(config.speed[0], config.speed[1]),
        opacity: randomBetween(config.opacity[0], config.opacity[1]),
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: randomBetween(-0.02, 0.02),
        waveOffset: Math.random() * Math.PI * 2,
        color: generateColor(layer)
      });
    }
  });
}

// Initialize geometric shapes
function initializeGeometricShapes() {
  for (let i = 0; i < NUM_SHAPES; i++) {
    geometricShapes.push({
      type: Math.random() > 0.5 ? 'cube' : 'pyramid',
      x: Math.random() * width,
      y: Math.random() * height,
      size: randomBetween(20, 60),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: randomBetween(-0.01, 0.01),
      opacity: randomBetween(0.1, 0.4),
      color: generateColor('geometric'),
      waveOffset: Math.random() * Math.PI * 2
    });
  }
}

// Generate colors based on layer
function generateColor(layer) {
  const colors = {
    background: ['#1a1a2e', '#16213e', '#0f3460'],
    midground: ['#533483', '#4a90e2', '#7b68ee'],
    foreground: ['#00d4ff', '#0099cc', '#0066cc'],
    geometric: ['#4ecdc4', '#44a08d', '#096dd9']
  };
  
  const colorSet = colors[layer] || colors.background;
  return colorSet[Math.floor(Math.random() * colorSet.length)];
}

// Utility function
function randomBetween(a, b) { 
  return a + Math.random() * (b - a); 
}

// Draw particles with advanced effects
function drawParticles() {
  Object.keys(particleSystems).forEach(layer => {
    const particles = particleSystems[layer];
    const config = layerConfig[layer];
    
    particles.forEach(particle => {
      // Add wave motion
      const waveX = Math.sin(time * 0.001 + particle.waveOffset) * 20;
      const waveY = Math.cos(time * 0.001 + particle.waveOffset) * 15;
      
      // Parallax effect based on layer
      const parallaxFactor = layer === 'background' ? 0.1 : layer === 'midground' ? 0.3 : 0.6;
      const parallaxX = (mouseX - width/2) * parallaxFactor * 0.01;
      const parallaxY = (mouseY - height/2) * parallaxFactor * 0.01;
      
      ctx.save();
      ctx.translate(particle.x + waveX + parallaxX, particle.y + waveY + parallaxY);
      ctx.rotate(particle.rotationSpeed * time);
      
      // Create gradient for particles
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
      gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // Update particle position
      particle.x += particle.speed;
      particle.y += particle.speed * 0.5;
      
      // Wrap around screen
      if (particle.x > width + particle.size) particle.x = -particle.size;
      if (particle.y > height + particle.size) particle.y = -particle.size;
    });
  });
}

// Draw geometric shapes with 3D effect
function drawGeometricShapes() {
  geometricShapes.forEach(shape => {
    const waveX = Math.sin(time * 0.0005 + shape.waveOffset) * 30;
    const waveY = Math.cos(time * 0.0005 + shape.waveOffset) * 25;
    
    // Parallax effect
    const parallaxX = (mouseX - width/2) * 0.02;
    const parallaxY = (mouseY - height/2) * 0.02;
    
    ctx.save();
    ctx.translate(shape.x + waveX + parallaxX, shape.y + waveY + parallaxY);
    ctx.rotate(shape.rotation);
    
    // Create shadow effect
    ctx.shadowColor = shape.color;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    if (shape.type === 'cube') {
      drawCube(shape);
    } else {
      drawPyramid(shape);
    }
    
    ctx.restore();
    
    // Update rotation
    shape.rotation += shape.rotationSpeed;
  });
}

// Draw 3D cube
function drawCube(shape) {
  const size = shape.size;
  const alpha = Math.floor(shape.opacity * 255).toString(16).padStart(2, '0');
  
  // Front face
  ctx.fillStyle = `${shape.color}${alpha}`;
  ctx.fillRect(-size/2, -size/2, size, size);
  
  // Top face (lighter)
  ctx.fillStyle = `${shape.color}${Math.floor(shape.opacity * 0.7 * 255).toString(16).padStart(2, '0')}`;
  ctx.fillRect(-size/2, -size/2, size, size/3);
  
  // Right face (darker)
  ctx.fillStyle = `${shape.color}${Math.floor(shape.opacity * 0.5 * 255).toString(16).padStart(2, '0')}`;
  ctx.fillRect(size/3, -size/2, size/3, size);
  
  // Wireframe outline
  ctx.strokeStyle = `${shape.color}${Math.floor(shape.opacity * 0.8 * 255).toString(16).padStart(2, '0')}`;
  ctx.lineWidth = 2;
  ctx.strokeRect(-size/2, -size/2, size, size);
}

// Draw 3D pyramid
function drawPyramid(shape) {
  const size = shape.size;
  const alpha = Math.floor(shape.opacity * 255).toString(16).padStart(2, '0');
  
  ctx.fillStyle = `${shape.color}${alpha}`;
  ctx.beginPath();
  ctx.moveTo(0, -size/2);
  ctx.lineTo(-size/2, size/2);
  ctx.lineTo(size/2, size/2);
  ctx.closePath();
  ctx.fill();
  
  // Wireframe outline
  ctx.strokeStyle = `${shape.color}${Math.floor(shape.opacity * 0.8 * 255).toString(16).padStart(2, '0')}`;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Draw connection lines between nearby particles
function drawConnections() {
  ctx.strokeStyle = 'rgba(78, 205, 196, 0.1)';
  ctx.lineWidth = 1;
  
  Object.keys(particleSystems).forEach(layer => {
    const particles = particleSystems[layer];
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        
        if (distance < 100) {
          const opacity = (100 - distance) / 100 * 0.1;
          ctx.strokeStyle = `rgba(78, 205, 196, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  });
}

// Main animation loop
function animateBackground() {
  ctx.clearRect(0, 0, width, height);
  
  // Create subtle gradient background
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
  gradient.addColorStop(0, 'rgba(26, 26, 46, 0.1)');
  gradient.addColorStop(1, 'rgba(22, 33, 62, 0.05)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw all layers
  drawParticles();
  drawGeometricShapes();
  drawConnections();
  
  time += 16; // Approximate 60fps
  requestAnimationFrame(animateBackground);
}

// Initialize everything
function initializeBackground() {
  initializeParticleSystems();
  initializeGeometricShapes();
  animateBackground();
}

// Event listeners
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

// Start the background system
initializeBackground();
// --- End Advanced 3D Background System --- 