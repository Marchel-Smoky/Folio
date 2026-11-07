```javascript
// =====================================================
// PORTFOLIO WEBSITE - ADVANCED JAVASCRIPT
// =====================================================

// ==================== KONFIGURASI ====================
const CONFIG = {
    typing: {
        texts: [
            "Professional Engineer & Supervisor",
            "Ahli Struktur Konstruksi",
            "Spesialis Jalan, Jembatan & Gedung"
        ],
        typeSpeed: 90,
        deleteSpeed: 45,
        pauseTime: 1800,
        startDelay: 800
    },

    splash: {
        timeout: 3500,
        fadeOut: 800
    },

    animations: {
        delay: 250,
        scrollThreshold: 80,
        particleCount: 50,
        counterDuration: 1800
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
        currentSection: "tentang"
    },

    app: {
        initialized: false
    }
};


// ==================== DOM CACHE ====================
const DOM = {
    typingText: document.getElementById("typing-text"),
    splash: document.getElementById("splash"),
    layout: document.querySelector(".layout"),
    header: document.querySelector("header"),
    nav: document.querySelector("nav"),
    menuToggle: document.querySelector(".menu-toggle"),
    themeButton: document.querySelector(".theme-toggle"),
    themeIcon: document.querySelector(".theme-toggle i"),
    sections: document.querySelectorAll(".konten"),
    navLinks: document.querySelectorAll(".nav-link"),
    particles: document.getElementById("particles")
};


// =====================================================
// 1. TYPING EFFECT
// =====================================================
function initTypingEffect() {

    if (!DOM.typingText) return;

    function type() {

        const typingState = AppState.typing;

        const currentText =
            CONFIG.typing.texts[typingState.textIndex];

        // Mengetik
        if (!typingState.isDeleting) {

            typingState.charIndex++;

            DOM.typingText.textContent =
                currentText.substring(
                    0,
                    typingState.charIndex
                );

        }

        // Menghapus
        else {

            typingState.charIndex--;

            DOM.typingText.textContent =
                currentText.substring(
                    0,
                    typingState.charIndex
                );
        }


        // Jika selesai mengetik
        if (
            !typingState.isDeleting &&
            typingState.charIndex === currentText.length
        ) {

            setTimeout(() => {

                typingState.isDeleting = true;

            }, CONFIG.typing.pauseTime);

        }


        // Jika selesai menghapus
        if (
            typingState.isDeleting &&
            typingState.charIndex === 0
        ) {

            typingState.isDeleting = false;

            typingState.textIndex =
                (typingState.textIndex + 1) %
                CONFIG.typing.texts.length;
        }


        const speed =
            typingState.isDeleting
                ? CONFIG.typing.deleteSpeed
                : CONFIG.typing.typeSpeed;


        setTimeout(type, speed);
    }


    setTimeout(
        type,
        CONFIG.typing.startDelay
    );
}


// =====================================================
// 2. SPLASH SCREEN
// =====================================================
function initSplashScreen() {

    if (!DOM.splash) return;

    setTimeout(() => {

        DOM.splash.style.opacity = "0";
        DOM.splash.style.pointerEvents = "none";

        setTimeout(() => {

            DOM.splash.style.display = "none";

            if (DOM.layout) {

                DOM.layout.style.display = "block";
                DOM.layout.style.opacity = "1";

            }

        }, CONFIG.splash.fadeOut);

    }, CONFIG.splash.timeout);
}


// =====================================================
// 3. NAVIGATION SECTION
// =====================================================
function tampilkanSection(sectionId) {

    DOM.sections.forEach(section => {

        section.classList.remove("aktif");

    });


    const targetSection =
        document.getElementById(sectionId);


    if (!targetSection) return;


    targetSection.classList.add("aktif");


    AppState.navigation.currentSection =
        sectionId;


    // Update menu aktif
    updateActiveNav(sectionId);


    // Tutup menu mobile
    if (DOM.nav) {

        DOM.nav.classList.remove("active");

    }


    // Jalankan animasi
    triggerSectionAnimations(sectionId);


    // Scroll ke atas
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// 4. ACTIVE NAVIGATION
// =====================================================
function updateActiveNav(sectionId) {

    DOM.navLinks.forEach(link => {

        link.classList.remove("active");

        const onclick =
            link.getAttribute("onclick");


        if (
            onclick &&
            onclick.includes(sectionId)
        ) {

            link.classList.add("active");

        }

    });
}


// =====================================================
// 5. SECTION ANIMATIONS
// =====================================================
function triggerSectionAnimations(sectionId) {

    const animations = {

        keahlian: animateSkillBars,

        "cerita-karir":
            animateCareerItems,

        tentang:
            animateCounters

    };


    const animation =
        animations[sectionId];


    if (animation) {

        setTimeout(
            animation,
            CONFIG.animations.delay
        );

    }
}


// =====================================================
// 6. SKILL BAR ANIMATION
// =====================================================
function animateSkillBars() {

    const skillLevels =
        document.querySelectorAll(
            ".skill-level"
        );


    skillLevels.forEach(level => {

        const value =
            level.getAttribute("data-level");

        if (!value) return;


        level.style.width = "0%";


        setTimeout(() => {

            level.style.width =
                value + "%";

        }, 150);

    });
}


// =====================================================
// 7. CAREER ANIMATION
// =====================================================
function animateCareerItems() {

    const careerItems =
        document.querySelectorAll(
            ".career-item"
        );


    careerItems.forEach(
        (item, index) => {

            setTimeout(() => {

                item.classList.add(
                    "visible"
                );

            },
            index *
            CONFIG.animations.delay);

        }
    );
}


// =====================================================
// 8. NUMBER COUNTER
// =====================================================
function animateCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    counters.forEach(counter => {

        if (
            counter.dataset.animated === "true"
        ) return;


        const target =
            Number(
                counter.dataset.counter
            );


        const duration =
            CONFIG.animations.counterDuration;


        const startTime =
            performance.now();


        function updateCounter(currentTime) {

            const progress =
                Math.min(
                    (currentTime - startTime) /
                    duration,
                    1
                );


            const value =
                Math.floor(
                    progress * target
                );


            counter.textContent =
                value;


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            }

            else {

                counter.textContent =
                    target;

            }
        }


        counter.dataset.animated = "true";


        requestAnimationFrame(
            updateCounter
        );

    });
}


// =====================================================
// 9. SCROLL EFFECT HEADER
// =====================================================
function initScrollEffects() {

    if (!DOM.header) return;

    let ticking = false;


    function updateHeader() {

        if (
            window.scrollY >
            CONFIG.animations.scrollThreshold
        ) {

            DOM.header.classList.add(
                "scrolled"
            );

        }

        else {

            DOM.header.classList.remove(
                "scrolled"
            );

        }


        ticking = false;
    }


    window.addEventListener(
        "scroll",

        () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateHeader
                );

                ticking = true;

            }

        },

        {
            passive: true
        }
    );
}


// =====================================================
// 10. REVEAL ANIMATION
// =====================================================
function initIntersectionObserver() {

    if (
        !("IntersectionObserver" in window)
    ) return;


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "reveal"
                        );


                        if (
                            entry.target.id ===
                            "keahlian"
                        ) {

                            animateSkillBars();

                        }


                        if (
                            entry.target.id ===
                            "cerita-karir"
                        ) {

                            animateCareerItems();

                        }


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.15
            }

        );


    document
        .querySelectorAll(
            "section"
        )
        .forEach(section => {

            observer.observe(section);

        });
}


// =====================================================
// 11. PARTICLE SYSTEM
// =====================================================
function initParticleSystem() {

    const canvas =
        DOM.particles;


    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    let particles = [];

    let animationId;


    function resizeCanvas() {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

    }


    function createParticles() {

        particles = [];


        for (
            let i = 0;
            i <
            CONFIG.animations.particleCount;
            i++
        ) {

            particles.push({

                x:
                    Math.random() *
                    canvas.width,

                y:
                    Math.random() *
                    canvas.height,

                size:
                    Math.random() * 2 + 1,

                speedX:
                    (Math.random() - 0.5) *
                    0.6,

                speedY:
                    (Math.random() - 0.5) *
                    0.6,

                opacity:
                    Math.random() *
                    0.5 +
                    0.1

            });

        }

    }


    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        particles.forEach(particle => {

            particle.x +=
                particle.speedX;

            particle.y +=
                particle.speedY;


            // Pantulan
            if (
                particle.x < 0 ||
                particle.x > canvas.width
            ) {

                particle.speedX *= -1;

            }


            if (
                particle.y < 0 ||
                particle.y > canvas.height
            ) {

                particle.speedY *= -1;

            }


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    255,
                    255,
                    255,
                    ${particle.opacity}
                )`;


            ctx.fill();

        });


        animationId =
            requestAnimationFrame(
                animate
            );
    }


    resizeCanvas();

    createParticles();

    animate();


    window.addEventListener(
        "resize",

        () => {

            cancelAnimationFrame(
                animationId
            );

            resizeCanvas();

            createParticles();

            animate();

        },

        {
            passive: true
        }
    );
}


// =====================================================
// 12. THEME SYSTEM
// =====================================================
function initThemeSystem() {

    if (!DOM.themeButton) return;


    function applyTheme(isLight) {

        AppState.theme.isLight =
            isLight;


        document.body.classList.toggle(
            "light-theme",
            isLight
        );


        if (DOM.themeIcon) {

            if (isLight) {

                DOM.themeIcon.classList.remove(
                    "fa-moon"
                );

                DOM.themeIcon.classList.add(
                    "fa-sun"
                );

            }

            else {

                DOM.themeIcon.classList.remove(
                    "fa-sun"
                );

                DOM.themeIcon.classList.add(
                    "fa-moon"
                );

            }

        }


        localStorage.setItem(
            "theme",

            isLight
                ? "light"
                : "dark"
        );

    }


    const savedTheme =
        localStorage.getItem(
            "theme"
        );


    if (savedTheme) {

        applyTheme(
            savedTheme === "light"
        );

    }


    DOM.themeButton.addEventListener(
        "click",

        () => {

            applyTheme(
                !AppState.theme.isLight
            );

        }
    );
}


// =====================================================
// 13. MOBILE NAVIGATION
// =====================================================
function initMobileNavigation() {

    if (
        !DOM.menuToggle ||
        !DOM.nav
    ) return;


    DOM.menuToggle.addEventListener(
        "click",

        event => {

            event.stopPropagation();


            DOM.nav.classList.toggle(
                "active"
            );

        }
    );


    document.addEventListener(
        "click",

        event => {

            if (
                !event.target.closest("nav") &&
                !event.target.closest(
                    ".menu-toggle"
                )
            ) {

                DOM.nav.classList.remove(
                    "active"
                );

            }

        }
    );


    DOM.navLinks.forEach(link => {

        link.addEventListener(
            "click",

            () => {

                DOM.nav.classList.remove(
                    "active"
                );

            }
        );

    });
}


// =====================================================
// 14. SCROLL TO TOP BUTTON
// =====================================================
function initScrollToTop() {

    const button =
        document.createElement("button");


    button.className =
        "scroll-top";


    button.innerHTML =
        '<i class="fas fa-arrow-up"></i>';


    button.setAttribute(
        "aria-label",
        "Kembali ke atas"
    );


    document.body.appendChild(
        button
    );


    window.addEventListener(
        "scroll",

        () => {

            if (
                window.scrollY > 400
            ) {

                button.classList.add(
                    "show"
                );

            }

            else {

                button.classList.remove(
                    "show"
                );

            }

        },

        {
            passive: true
        }
    );


    button.addEventListener(
        "click",

        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );
}


// =====================================================
// 15. INITIALIZE APPLICATION
// =====================================================
function initializeApp() {

    if (AppState.app.initialized) return;


    AppState.app.initialized =
        true;


    initTypingEffect();

    initSplashScreen();

    initScrollEffects();

    initIntersectionObserver();

    initParticleSystem();

    initThemeSystem();

    initMobileNavigation();

    initScrollToTop();


    // Animasi section aktif
    const activeSection =
        document.querySelector(
            ".konten.aktif"
        );


    if (activeSection) {

        triggerSectionAnimations(
            activeSection.id
        );

    }


    console.log(
        "🚀 Portfolio berhasil dijalankan!"
    );
}


// =====================================================
// 16. LIGHT THEME CSS
// =====================================================
function injectLightThemeCSS() {

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        .light-theme {
            --dark: #f5f7fa;
            --dark-light: #ffffff;
            --light: #202124;
            --gray: #5f6368;
            --gray-light: #9aa0a6;
        }

        .light-theme header {
            background:
                rgba(
                    255,
                    255,
                    255,
                    0.95
                );

            border-bottom:
                1px solid
                rgba(
                    0,
                    0,
                    0,
                    0.08
                );
        }

        .light-theme
        .nav-link {

            color:
                var(--light);

        }

        .light-theme
        .theme-toggle {

            background:
                rgba(
                    0,
                    0,
                    0,
                    0.08
                );

            color:
                var(--light);

        }

        .light-theme
        .hero-section {

            background:
                linear-gradient(
                    135deg,
                    #f5f7fa,
                    #e3f2fd
                );

        }

        .light-theme
        .hero-description {

            color:
                #444;

        }

        .light-theme
        .stat-card,

        .light-theme
        .highlight-card,

        .light-theme
        .skill-category,

        .light-theme
        .service-card,

        .light-theme
        .career-content,

        .light-theme
        .education-card {

            background:
                rgba(
                    255,
                    255,
                    255,
                    0.9
                );

            border-color:
                rgba(
                    0,
                    0,
                    0,
                    0.08
                );

        }


        /* REVEAL ANIMATION */

        section {

            opacity: 0;

            transform:
                translateY(30px);

            transition:
                opacity 0.7s ease,
                transform 0.7s ease;

        }


        section.reveal {

            opacity: 1;

            transform:
                translateY(0);

        }


        /* SCROLL TO TOP */

        .scroll-top {

            position: fixed;

            right: 25px;

            bottom: 25px;

            width: 50px;

            height: 50px;

            border: none;

            border-radius: 50%;

            background:
                var(--gradient);

            color: white;

            font-size: 1.1rem;

            cursor: pointer;

            opacity: 0;

            visibility: hidden;

            transform:
                translateY(20px);

            transition:
                all 0.3s ease;

            z-index: 1000;

            box-shadow:
                0 10px 25px
                rgba(
                    0,
                    0,
                    0,
                    0.25
                );

        }


        .scroll-top.show {

            opacity: 1;

            visibility: visible;

            transform:
                translateY(0);

        }


        .scroll-top:hover {

            transform:
                translateY(-5px);

        }


        /* ACTIVE NAV */

        .nav-link.active {

            background:
                var(--gradient);

            color: white;

        }

    `;


    document.head.appendChild(
        style
    );
}


// =====================================================
// START APPLICATION
// =====================================================
document.addEventListener(
    "DOMContentLoaded",

    () => {

        injectLightThemeCSS();

        initializeApp();

    }
);


// =====================================================
// GLOBAL FUNCTIONS
// =====================================================
window.tampilkanSection =
    tampilkanSection;


window.toggleTheme =
    () => {

        if (DOM.themeButton) {

            DOM.themeButton.click();

        }

    };
```
