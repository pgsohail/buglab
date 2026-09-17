const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scrolling for navigation links
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
        // Close mobile menu if open
        closeMobileMenu();
    });
});

// ── Scroll progress bar ───────────────────────────────────────────────────────
const scrollProgress = document.getElementById('scrollProgress');

// ── Hero parallax dissolve: hero content drifts up and fades as you scroll ──
const heroParallax = document.querySelector('.hero .centered-hero');
const heroSection = document.querySelector('.hero');

let scrollTicking = false;

function updateOnScroll() {
    if (scrollProgress) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
    }

    if (heroParallax && heroSection && !prefersReducedMotion) {
        const heroHeight = heroSection.offsetHeight || window.innerHeight;
        const raw = window.scrollY / heroHeight;
        const eased = Math.min(Math.max(raw, 0), 1);
        heroParallax.style.transform = `translateY(${eased * -70}px) scale(${1 - eased * 0.08})`;
        heroParallax.style.opacity = `${1 - eased * 1.15}`;
    }

    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(updateOnScroll);
        scrollTicking = true;
    }
});

updateOnScroll();

// ── Scrollspy: highlight active nav link based on section in view ───────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.mobile-menu ul li a');

if (sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
}

// ── Mobile menu toggle ───────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    navToggle?.classList.remove('active');
    document.body.style.overflow = '';
}

if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            mobileMenu.classList.add('open');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// ── Form submission ───────────────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);

        contactForm.reset();
    });
}

// ── Scroll animations ─────────────────────────────────────────────────────────
const scrollObserverOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -80px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            scrollObserver.unobserve(entry.target);
        }
    });
}, scrollObserverOptions);

window.addEventListener('load', () => {
    document.querySelectorAll('.scroll-animate').forEach(element => {
        scrollObserver.observe(element);
    });
});

// ── Count-up animation for stat numbers ───────────────────────────────────────
function animateCountUp(element) {
    const raw = element.textContent.trim();
    const match = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const decimals = (match[1].split('.')[1] || '').length;
    const duration = 1400;
    const start = performance.now();

    function step(now) {
        const elapsed = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        const value = target * eased;
        element.textContent = `${value.toFixed(decimals)}${suffix}`;

        if (elapsed < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = raw;
        }
    }

    requestAnimationFrame(step);
}

if (!prefersReducedMotion) {
    const countUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCountUp(entry.target);
                countUpObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    window.addEventListener('load', () => {
        document.querySelectorAll('.count-up').forEach(element => {
            countUpObserver.observe(element);
        });
    });
}

// ── Random crawling bugs: appear occasionally, not continuously ─────────────
function randomizeBug(el) {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    const buffer = 160;
    const edge = ['top', 'bottom', 'left', 'right'][Math.floor(Math.random() * 4)];

    let x, y;
    if (edge === 'top' || edge === 'bottom') {
        x = (Math.random() * 1.6 - 0.8) * halfW;
        y = (halfH + buffer) * (edge === 'top' ? -1 : 1);
    } else {
        x = (halfW + buffer) * (edge === 'left' ? -1 : 1);
        y = (Math.random() * 1.6 - 0.8) * halfH;
    }

    const rotStart = Math.random() * 20 - 10;
    const rotEnd = (Math.random() < 0.5 ? -1 : 1) * (170 + Math.random() * 90);
    const duration = 18 + Math.random() * 8; // slow, unhurried crawl

    el.style.setProperty('--bug-x', `${x}px`);
    el.style.setProperty('--bug-y', `${y}px`);
    el.style.setProperty('--bug-rot-start', `${rotStart}deg`);
    el.style.setProperty('--bug-rot-end', `${rotEnd}deg`);
    return duration;
}

// Only ever one bug on screen at a time, appearing every so often with
// real quiet gaps in between, instead of a constant swarm.
if (!prefersReducedMotion) {
    window.addEventListener('load', () => {
        const bugs = Array.from(document.querySelectorAll('.crawling-bugs .bug'));
        bugs.forEach(el => { el.style.animation = 'none'; });
        if (!bugs.length) return;

        let busy = false;

        function trySpawn() {
            if (busy || Math.random() > 0.55) return;
            busy = true;

            const el = bugs[Math.floor(Math.random() * bugs.length)];
            const duration = randomizeBug(el);
            el.style.animation = `bugCycle ${duration}s ease-in-out 1`;

            el.addEventListener('animationend', function handler() {
                el.removeEventListener('animationend', handler);
                el.style.animation = 'none';
                busy = false;
            }, { once: true });
        }

        function loop() {
            trySpawn();
            setTimeout(loop, 6000 + Math.random() * 6000);
        }

        setTimeout(loop, 1500);
    });
}

// ── Typing animation ──────────────────────────────────────────────────────────
function continuousTyping() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const phrases = [
        '_quality_control_start();',
        '_build_something_great();',
        '_debug_and_deploy();',
        '_automate_your_finances();',
        '_ship_production_code();',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 70;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 1200);
}

// ── Logo bug eating effect ─────────────────────────────────────────────────────
window.addEventListener('load', () => {
    continuousTyping();

    const logoSvgContainer = document.querySelector('.logo-svg-container');
    const mainLogo = document.getElementById('mainLogo');

    if (mainLogo) {
        mainLogo.classList.add('bugs-fixed');
    }

    function triggerBugEating() {
        logoSvgContainer?.classList.add('eating');

        if (mainLogo) {
            mainLogo.classList.remove('bugs-fixed');
            mainLogo.classList.add('bugs-eating');
        }

        setTimeout(() => {
            logoSvgContainer?.classList.remove('eating');
            if (mainLogo) {
                mainLogo.classList.remove('bugs-eating');
                mainLogo.classList.add('bugs-fixed');
            }
        }, 1500);
    }

    setInterval(triggerBugEating, 12000);
    setTimeout(triggerBugEating, 3500);
});

// ── Theme Toggle ─────────────────────────────────────────────────────────────
function setupThemeToggle(toggleId) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;
    const icon = toggle.querySelector('.theme-icon');
    const html = document.documentElement;

    const saved = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', saved);
    if (icon) icon.textContent = saved === 'dark' ? '☀️' : '🌙';

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        // Sync all theme toggles
        document.querySelectorAll('.theme-icon').forEach(i => {
            i.textContent = next === 'dark' ? '☀️' : '🌙';
        });
    });
}

setupThemeToggle('themeToggleFooter');

// Apply saved theme immediately to prevent flash
(function () {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.querySelectorAll('.theme-icon').forEach(i => {
        i.textContent = saved === 'dark' ? '☀️' : '🌙';
    });
})();
