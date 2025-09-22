/**
 * Rongai Agroforestry Community Project
 * Main JavaScript File
 * Handles navigation, animations, and general functionality
 */

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        header: document.querySelector('.header'),
        animateOnScroll: document.querySelectorAll('.animate-on-scroll'),
        scrollReveal: document.querySelectorAll('.scroll-reveal'),
        counters: document.querySelectorAll('.counter'),
        progressBars: document.querySelectorAll('.progress-bar'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        galleryItems: document.querySelectorAll('.gallery-item')
    };

    // State Management
    const state = {
        isMenuOpen: false,
        currentFilter: 'all',
        scrollPosition: 0,
        isScrolling: false
    };

    // Utility Functions
    const utils = {
        // Debounce function for performance
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll events
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if element is in viewport
        isInViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Animate number counting
        animateCounter: (counter) => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                counter.textContent = Math.floor(current);

                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                }
            }, 16);
        },

        // Smooth scroll to element
        scrollToElement: (element, offset = 0) => {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Navigation Functions
    const navigation = {
        init: () => {
            navigation.setupMobileMenu();
            navigation.setupScrollEffect();
            navigation.setupSmoothScrolling();
            navigation.setupActiveLink();
        },

        setupMobileMenu: () => {
            if (!elements.navToggle || !elements.navMenu) return;

            elements.navToggle.addEventListener('click', () => {
                state.isMenuOpen = !state.isMenuOpen;
                elements.navToggle.classList.toggle('active');
                elements.navMenu.classList.toggle('active');

                // Prevent body scroll when menu is open
                document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
            });

            // Close menu when clicking on nav links
            elements.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (state.isMenuOpen) {
                        state.isMenuOpen = false;
                        elements.navToggle.classList.remove('active');
                        elements.navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (state.isMenuOpen &&
                    !elements.navToggle.contains(e.target) &&
                    !elements.navMenu.contains(e.target)) {
                    state.isMenuOpen = false;
                    elements.navToggle.classList.remove('active');
                    elements.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        },

        setupScrollEffect: () => {
            const handleScroll = utils.throttle(() => {
                const currentScroll = window.pageYOffset;

                // Add/remove scrolled class to header
                if (currentScroll > 100) {
                    elements.header.classList.add('scrolled');
                } else {
                    elements.header.classList.remove('scrolled');
                }

                // Hide/show header on scroll
                if (currentScroll > state.scrollPosition && currentScroll > 200) {
                    elements.header.style.transform = 'translateY(-100%)';
                } else {
                    elements.header.style.transform = 'translateY(0)';
                }

                state.scrollPosition = currentScroll;
            }, 16);

            window.addEventListener('scroll', handleScroll);
        },

        setupSmoothScrolling: () => {
            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        utils.scrollToElement(target, 80);
                    }
                });
            });
        },

        setupActiveLink: () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');

            const updateActiveLink = utils.throttle(() => {
                let current = '';

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;

                    if (state.scrollPosition >= (sectionTop - 200)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            }, 16);

            window.addEventListener('scroll', updateActiveLink);
        }
    };

    // Animation Functions
    const animations = {
        init: () => {
            animations.setupScrollAnimations();
            animations.setupCounterAnimations();
            animations.setupProgressBarAnimations();
            animations.setupIntersectionObserver();
        },

        setupScrollAnimations: () => {
            const handleScroll = utils.throttle(() => {
                elements.animateOnScroll.forEach(element => {
                    if (utils.isInViewport(element)) {
                        element.classList.add('animated');
                    }
                });
            }, 16);

            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Run on load
        },

        setupCounterAnimations: () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        utils.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            elements.counters.forEach(counter => {
                observer.observe(counter);
            });
        },

        setupProgressBarAnimations: () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressFill = entry.target.querySelector('.progress-fill');
                        if (progressFill) {
                            progressFill.classList.add('animate');
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            elements.progressBars.forEach(bar => {
                observer.observe(bar);
            });
        },

        setupIntersectionObserver: () => {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }
    };

    // Gallery Functions
    const gallery = {
        init: () => {
            if (elements.filterButtons.length === 0) return;

            gallery.setupFiltering();
            gallery.setupLightbox();
        },

        setupFiltering: () => {
            elements.filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.dataset.filter;

                    // Update active button
                    elements.filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Filter gallery items
                    elements.galleryItems.forEach(item => {
                        const category = item.dataset.category;

                        if (filter === 'all' || category === filter) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 100);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });

                    state.currentFilter = filter;
                });
            });
        },

        setupLightbox: () => {
            // This will be enhanced in gallery.js
            elements.galleryItems.forEach(item => {
                const button = item.querySelector('.gallery-btn');
                if (button) {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        console.log('Lightbox functionality - to be implemented in gallery.js');
                    });
                }
            });
        }
    };

    // Form Functions
    const forms = {
        init: () => {
            forms.setupContactForm();
        },

        setupContactForm: () => {
            const contactForm = document.getElementById('contact-form');
            if (!contactForm) return;

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                forms.handleFormSubmission(contactForm);
            });

            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => forms.validateField(input));
                input.addEventListener('input', () => forms.clearFieldError(input));
            });
        },

        validateField: (field) => {
            const value = field.value.trim();
            const type = field.type;
            const name = field.name;
            let isValid = true;
            let errorMessage = '';

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }

            // Email validation
            if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            // Phone validation
            if (type === 'tel' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            }

            // Display error or success
            const errorElement = document.getElementById(`${name}-error`);
            if (errorElement) {
                if (!isValid) {
                    errorElement.textContent = errorMessage;
                    field.classList.add('error');
                } else {
                    errorElement.textContent = '';
                    field.classList.remove('error');
                    field.classList.add('valid');
                }
            }

            return isValid;
        },

        clearFieldError: (field) => {
            field.classList.remove('error');
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        },

        handleFormSubmission: (form) => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate all fields
            const fields = form.querySelectorAll('input, select, textarea');
            let allValid = true;

            fields.forEach(field => {
                if (!forms.validateField(field)) {
                    allValid = false;
                }
            });

            if (!allValid) {
                return;
            }

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                const successElement = document.getElementById('form-success');
                if (successElement) {
                    successElement.style.display = 'block';
                    form.reset();

                    // Clear validation states
                    fields.forEach(field => {
                        field.classList.remove('valid', 'error');
                    });
                }

                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successElement) {
                        successElement.style.display = 'none';
                    }
                }, 5000);
            }, 1000);
        }
    };

    // Performance Functions
    const performance = {
        init: () => {
            performance.lazyLoadImages();
            performance.preloadCriticalResources();
        },

        lazyLoadImages: () => {
            const images = document.querySelectorAll('img[data-src]');

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        },

        preloadCriticalResources: () => {
            // Preload critical images
            const criticalImages = [
                'images/hero-bg.jpg',
                'images/logo.svg'
            ];

            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        }
    };

    // Accessibility Functions
    const accessibility = {
        init: () => {
            accessibility.setupKeyboardNavigation();
            accessibility.setupFocusManagement();
            accessibility.setupAriaLabels();
        },

        setupKeyboardNavigation: () => {
            // Escape key to close mobile menu
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.isMenuOpen) {
                    state.isMenuOpen = false;
                    elements.navToggle.classList.remove('active');
                    elements.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Tab navigation for gallery
            elements.galleryItems.forEach((item, index) => {
                item.setAttribute('tabindex', '0');
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.click();
                    }
                });
            });
        },

        setupFocusManagement: () => {
            // Skip to main content link
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: #2d5a27;
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 1000;
                transition: top 0.3s;
            `;

            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });

            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });

            document.body.insertBefore(skipLink, document.body.firstChild);
        },

        setupAriaLabels: () => {
            // Add ARIA labels to interactive elements
            elements.navToggle?.setAttribute('aria-label', 'Toggle navigation menu');
            elements.navToggle?.setAttribute('aria-expanded', 'false');

            // Update ARIA when menu state changes
            const originalClick = elements.navToggle?.onclick;
            if (elements.navToggle) {
                elements.navToggle.addEventListener('click', () => {
                    setTimeout(() => {
                        const isExpanded = elements.navMenu.classList.contains('active');
                        elements.navToggle.setAttribute('aria-expanded', isExpanded.toString());
                    }, 100);
                });
            }
        }
    };

    // Initialize everything when DOM is loaded
    const init = () => {
        // Check if DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                startApp();
            });
        } else {
            startApp();
        }
    };

    const startApp = () => {
        try {
            navigation.init();
            animations.init();
            gallery.init();
            forms.init();
            performance.init();
            accessibility.init();

            console.log('🌱 Rongai Agroforestry website initialized successfully!');
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    };

    // Start the application
    init();

    // Expose utilities to global scope for debugging
    window.RongaiAgroforestry = {
        utils,
        state,
        navigation,
        animations,
        gallery,
        forms
    };

})();
