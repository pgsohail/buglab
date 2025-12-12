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
    });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the data to a server
        // For now, we'll just show an alert
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Scroll animations - triggers when scrolling down or up
const scrollObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        } else {
            // Remove animation when element leaves viewport (for re-animation on scroll up)
            entry.target.classList.remove('animate-in');
        }
    });
}, scrollObserverOptions);

// Observe all scroll-animate elements when page loads
window.addEventListener('load', () => {
    document.querySelectorAll('.scroll-animate').forEach(element => {
        scrollObserver.observe(element);
    });
});

// Continuous typing and untyping animation for code snippet
function continuousTyping() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    const text = '_quality_control_start();';
    let isTyping = true;
    let index = 0;
    let typingSpeed = 80;
    let deletingSpeed = 50;
    let pauseTime = 2000; // Pause at full text
    
    function type() {
        if (isTyping) {
            if (index < text.length) {
                typingElement.textContent += text[index];
                index++;
                setTimeout(type, typingSpeed);
            } else {
                // Pause before deleting
    setTimeout(() => {
    isTyping = false;
                    type();
                }, pauseTime);
            }
        } else {
            // Deleting
            if (index > 0) {
                typingElement.textContent = text.substring(0, index - 1);
                index--;
                setTimeout(type, deletingSpeed);
            } else {
                // Pause before typing again
                isTyping = true;
        setTimeout(() => {
                    type();
                }, 500);
            }
        }
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
}

// Run continuous typing animation when page loads
window.addEventListener('load', () => {
    continuousTyping();
    
    // Logo shake and color change effect when bugs are eating
    const logoSvgContainer = document.querySelector('.logo-svg-container');
    const mainLogo = document.getElementById('mainLogo');
    
    // Set default state to green (bugs fixed/success state)
    if (mainLogo) {
        mainLogo.classList.add('bugs-fixed');
    }
    
    // Function to trigger bug eating effect
    function triggerBugEating() {
        // Add shake animation
        logoSvgContainer.classList.add('eating');
        
        // Change SVG color to red #E71809 when bugs are eating
        if (mainLogo) {
            mainLogo.classList.remove('bugs-fixed'); // Remove green
            mainLogo.classList.add('bugs-eating'); // Add red
        }
        
        // After bugs eat, change back to green when they run away (bugs fixed)
        setTimeout(() => {
            logoSvgContainer.classList.remove('eating');
            if (mainLogo) {
                mainLogo.classList.remove('bugs-eating'); // Remove red
                mainLogo.classList.add('bugs-fixed'); // Add green (default state)
            }
        }, 1500); // Keep red for 1.5 seconds, then back to green
    }
    
    // Trigger shake at eating phase (around 3.5-4 seconds, repeating every 12 seconds)
    setInterval(() => {
        triggerBugEating();
    }, 12000);
    
    // Initial trigger after first cycle
    setTimeout(() => {
        triggerBugEating();
    }, 3500);
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
if (themeIcon) {
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
    });
}


