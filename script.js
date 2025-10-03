// ==================== KONFIGURASI ====================
const CONFIG = {
    typing: {
        texts: [
            "Professional Engineer & Supervisor",
            "Ahli Struktur Konstruksi", 
            "Spesialis Jalan, Jembatan & Gedung"
        ],
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseTime: 2000
    },
    splash: {
        timeout: 4000,
        fadeOut: 1000
    },
    animations: {
        delay: 300,
        scrollThreshold: 100,
        particleCount: 50
    }
};

// ==================== STATE MANAGEMENT ====================
const AppState = {
    typing: {
        textIndex: 0,
        charIndex: 0,
        isDeleting: false
    },
    theme: {
        isLight: false
    },
    navigation: {
        currentSection: 'tentang'
    }
};

// ==================== CACHE DOM ELEMENTS ====================
const DOM = {
    typingText: document.getElementById('typing-text'),
    splash: document.getElementById('splash'),
    layout: document.querySelector('.layout'),
    header: document.querySelector('header'),
    nav: document.querySelector('nav'),
    menuToggle: document.querySelector('.menu-toggle'),
    themeToggle: document.querySelector('.theme-toggle i'),
    sections: document.querySelectorAll('.konten')
};

// ==================== TYPING EFFECT ====================
function initTypingEffect() {
    function type() {
        const currentText = CONFIG.typing.texts[AppState.typing.textIndex];
        
        if (AppState.typing.isDeleting) {
            DOM.typingText.textContent = currentText.substring(0, AppState.typing.charIndex - 1);
            AppState.typing.charIndex--;
        } else {
            DOM.typingText.textContent = currentText.substring(0, AppState.typing.charIndex + 1);
            AppState.typing.charIndex++;
        }
        
        if (!AppState.typing.isDeleting && AppState.typing.charIndex === currentText.length) {
            setTimeout(() => AppState.typing.isDeleting = true, CONFIG.typing.pauseTime);
        } else if (AppState.typing.isDeleting && AppState.typing.charIndex === 0) {
            AppState.typing.isDeleting = false;
            AppState.typing.textIndex = (AppState.typing.textIndex + 1) % CONFIG.typing.texts.length;
        }
        
        const speed = AppState.typing.isDeleting ? CONFIG.typing.deleteSpeed : CONFIG.typing.typeSpeed;
        setTimeout(type, speed);
    }
    
    setTimeout(type, 1000);
}

// ==================== SPLASH SCREEN ====================
function initSplashScreen() {
    setTimeout(() => {
        DOM.splash.style.opacity = '0';
        setTimeout(() => {
            DOM.splash.style.display = 'none';
            DOM.layout.style.display = 'block';
        }, CONFIG.splash.fadeOut);
    }, CONFIG.splash.timeout);
}

// ==================== NAVIGATION ====================
function tampilkanSection(sectionId) {
    // Sembunyikan semua section
    DOM.sections.forEach(section => {
        section.classList.remove('aktif');
    });
    
    // Tampilkan section yang dipilih
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('aktif');
        AppState.navigation.currentSection = sectionId;
    }
    
    // Tutup menu mobile jika terbuka
    DOM.nav.classList.remove('active');
    
    // Trigger animasi khusus berdasarkan section
    triggerSectionAnimations(sectionId);
}

function triggerSectionAnimations(sectionId) {
    const animations = {
        'keahlian': animateSkillBars,
        'cerita-karir': animateCareerItems
    };
    
    if (animations[sectionId]) {
        setTimeout(animations[sectionId], CONFIG.animations.delay);
    }
}

// ==================== ANIMATIONS ====================
function animateSkillBars() {
    const skillLevels = document.querySelectorAll('.skill-level');
    skillLevels.forEach(level => {
        const width = level.getAttribute('data-level') + '%';
        level.style.width = width;
    });
}

function animateCareerItems() {
    const careerItems = document.querySelectorAll('.career-item');
    careerItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * CONFIG.animations.delay);
    });
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
    let ticking = false;
    
    function updateHeader() {
        if (window.scrollY > CONFIG.animations.scrollThreshold) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ==================== INTERSECTION OBSERVER ====================
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger section-specific animations
                if (entry.target.id === 'keahlian') {
                    animateSkillBars();
                } else if (entry.target.id === 'cerita-karir') {
                    animateCareerItems();
                }
            }
        });
    }, observerOptions);

    // Observe semua section
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ==================== PARTICLE SYSTEM ====================
function initParticleSystem() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        const particles = [];
        
        for (let i = 0; i < CONFIG.animations.particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 1,
                speedY: (Math.random() - 0.5) * 1,
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`
            });
        }
        return particles;
    }
    
    function animateParticles(particles) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Boundary check
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        animationId = requestAnimationFrame(() => animateParticles(particles));
    }
    
    function handleResize() {
        cancelAnimationFrame(animationId);
        setupCanvas();
        const particles = createParticles();
        animateParticles(particles);
    }
    
    // Initialize
    setupCanvas();
    const particles = createParticles();
    animateParticles(particles);
    
    // Event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Cleanup function
    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
    };
}

// ==================== THEME MANAGEMENT ====================
function initThemeSystem() {
    function toggleTheme() {
        AppState.theme.isLight = !AppState.theme.isLight;
        document.body.classList.toggle('light-theme', AppState.theme.isLight);
        
        // Update icon
        if (AppState.theme.isLight) {
            DOM.themeToggle.classList.replace('fa-moon', 'fa-sun');
        } else {
            DOM.themeToggle.classList.replace('fa-sun', 'fa-moon');
        }
        
        // Save preference
        localStorage.setItem('theme', AppState.theme.isLight ? 'light' : 'dark');
    }
    
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            AppState.theme.isLight = true;
            document.body.classList.add('light-theme');
            DOM.themeToggle.classList.replace('fa-moon', 'fa-sun');
        }
    }
    
    // Event listeners
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    
    // Load saved theme
    loadTheme();
}

// ==================== MOBILE NAVIGATION ====================
function initMobileNavigation() {
    function closeMenuOnClickOutside(e) {
        if (!e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
            DOM.nav.classList.remove('active');
        }
    }
    
    // Event listeners
    DOM.menuToggle.addEventListener('click', () => {
        DOM.nav.classList.toggle('active');
    });
    
    document.addEventListener('click', closeMenuOnClickOutside);
    
    // Close menu on link click
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            DOM.nav.classList.remove('active');
        });
    });
}

// ==================== INITIALIZATION ====================
function initializeApp() {
    // Initialize all systems
    initTypingEffect();
    initSplashScreen();
    initScrollEffects();
    initIntersectionObserver();
    initParticleSystem();
    initThemeSystem();
    initMobileNavigation();
    
    // Set initial active section animations
    const activeSection = document.querySelector('.konten.aktif');
    if (activeSection) {
        triggerSectionAnimations(activeSection.id);
    }
    
    console.log('Portfolio initialized successfully!');
}

// ==================== LIGHT THEME CSS INJECTION ====================
function injectLightThemeCSS() {
    const lightThemeCSS = `
        .light-theme {
            --dark: #f5f5f5;
            --dark-light: #ffffff;
            --light: #333333;
            --gray: #b0b0b0;
            --gray-light: #d0d0d0;
        }

        .light-theme header {
            background: rgba(245, 245, 245, 0.95);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .light-theme .nav-link {
            color: var(--light);
        }

        .light-theme .theme-toggle {
            background: rgba(0, 0, 0, 0.1);
            color: var(--light);
        }
        
        .light-theme .motivation-box {
            background: var(--gradient);
            color: white;
        }
        
        .light-theme .motivation-box h3,
        .light-theme .motivation-box p,
        .light-theme .motivation-box .signature {
            color: white;
        }
    `;

    const style = document.createElement('style');
    style.textContent = lightThemeCSS;
    document.head.appendChild(style);
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    injectLightThemeCSS();
    initializeApp();
});

// ==================== GLOBAL EXPORTS ====================
// Export fungsi yang diperlukan untuk HTML onclick
window.tampilkanSection = tampilkanSection;
window.toggleTheme = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) themeToggle.click();
};
