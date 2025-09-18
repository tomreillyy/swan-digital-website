// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const nav = document.querySelector('.nav');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(31, 41, 53, 0.98)';
        nav.style.boxShadow = '0 4px 6px -1px rgba(31, 41, 53, 0.3)';
    } else {
        nav.style.background = 'rgba(31, 41, 53, 1)';
        nav.style.boxShadow = '0 2px 10px rgba(31, 41, 53, 0.3)';
    }
});

// Intersection Observer for fade-in animations
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

// Add fade-in class to elements and observe them
const fadeElements = document.querySelectorAll('.about-item, .service-card, .work-item, .section-header');
fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Stagger animations for grid items
const staggerGroups = [
    document.querySelectorAll('.about-item'),
    document.querySelectorAll('.service-card'),
    document.querySelectorAll('.work-item')
];

staggerGroups.forEach(group => {
    group.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});


// Add CSS for form message animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero cards (optional enhancement)
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.card');
    
    parallaxElements.forEach((element, index) => {
        const rate = scrolled * -0.2 * (index + 1);
        element.style.transform = `translateY(${rate}px) rotate(${-5 + index * 3}deg)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Loading animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Preload critical images
const logoImg = document.querySelector('.logo-img');
if (logoImg) {
    const img = new Image();
    img.src = logoImg.src;
}

// Performance optimization: Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        // Additional scroll-based functionality can go here
    }, 10);
});


// Add subtle page transitions
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Add a little bounce effect
            document.body.style.transform = 'scale(0.98)';
            document.body.style.transition = 'transform 0.1s ease-out';
            
            setTimeout(() => {
                document.body.style.transform = 'scale(1)';
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
        }
    });
});

// Scroll indicator click handler
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Hide scroll indicator after scrolling past hero & Update scroll progress
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Hide scroll indicator
    if (hero && scrollIndicator) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const scrollY = window.scrollY;
        
        if (scrollY > heroBottom / 2) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }
    
    // Update scroll progress bar
    if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
});

// Contact form handling with success animation
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const formData = new FormData(contactForm);

            // Show loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Submit to Netlify
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString()
                });

                if (response.ok) {
                    // Show success animation
                    showSuccessAnimation();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Show error message
                showErrorMessage();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

function showSuccessAnimation() {
    const contactForm = document.querySelector('.contact-form');
    const contactSection = document.querySelector('.contact');

    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-animation';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="checkmark-wrapper">
                <svg class="checkmark" width="52" height="52" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <h3>Message sent successfully! 🎉</h3>
            <p>Thanks for reaching out! We'll get back to you within 24 hours.</p>
            <button class="send-another-btn">Send Another Message</button>
        </div>
    `;

    // Add CSS for the animation
    const style = document.createElement('style');
    style.textContent = `
        .success-animation {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0.8);
            animation: successSlideIn 0.6s ease-out forwards;
            z-index: 10;
        }

        @keyframes successSlideIn {
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .success-content {
            text-align: center;
            color: white;
            padding: 2rem;
        }

        .checkmark-wrapper {
            margin-bottom: 1.5rem;
        }

        .checkmark {
            width: 52px;
            height: 52px;
            margin: 0 auto;
            display: block;
        }

        .checkmark-circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: white;
            animation: checkmark-stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            stroke-width: 3;
            stroke: white;
            animation: checkmark-stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes checkmark-stroke {
            100% {
                stroke-dashoffset: 0;
            }
        }

        .success-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .success-content p {
            font-size: 1rem;
            margin-bottom: 1.5rem;
            opacity: 0.9;
        }

        .send-another-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .send-another-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
    `;

    if (!document.querySelector('.success-animation-styles')) {
        style.className = 'success-animation-styles';
        document.head.appendChild(style);
    }

    // Make contact form container relative for absolute positioning
    contactForm.style.position = 'relative';

    // Add success message
    contactForm.appendChild(successDiv);

    // Handle send another message
    const sendAnotherBtn = successDiv.querySelector('.send-another-btn');
    sendAnotherBtn.addEventListener('click', () => {
        successDiv.remove();
        contactForm.reset();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    });
}

function showErrorMessage() {
    const contactForm = document.querySelector('.contact-form');

    // Remove any existing error messages
    const existingError = contactForm.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #fee2e2;
        color: #dc2626;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
    errorDiv.textContent = 'Sorry, there was an error sending your message. Please try again.';

    contactForm.appendChild(errorDiv);

    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

console.log('Trove Digital website loaded successfully!');