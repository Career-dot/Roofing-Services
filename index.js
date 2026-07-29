document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('main-header');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page loads scrolled down

    // 2. Mobile Nav Toggle
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu on click of navigation links
        const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Debug: log link href to help diagnose navigation issues
                try { console.log('nav link clicked ->', link.getAttribute('href') || link.href); } catch (err) {}
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });

        // Click outside navigation menu closes it
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickInsideToggle = navToggle.contains(event.target);
            if (!isClickInsideMenu && !isClickInsideToggle && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }

    // 3. Form Validation and Success Modal
    const quoteForm = document.getElementById('quote-form');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Display fields in Modal
    const displayName = document.getElementById('user-display-name');
    const displayService = document.getElementById('user-display-service');
    const displayEmail = document.getElementById('user-display-email');

    // Helper: Valid email check
    const isValidEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    // Helper: Show error on form input
    const showError = (inputElement, errorElementId) => {
        const group = inputElement.closest('.form-group');
        group.classList.add('has-error');
    };

    // Helper: Remove error
    const clearError = (inputElement) => {
        const group = inputElement.closest('.form-group');
        group.classList.remove('has-error');
    };

    // Form inputs
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email-address');
    const serviceInput = document.getElementById('service-type');

    // Clear error states on input/change
    [fullNameInput, emailInput, serviceInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => clearError(input));
            input.addEventListener('change', () => clearError(input));
        }
    });

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let hasErrors = false;

            // Full Name Check
            if (!fullNameInput.value.trim()) {
                showError(fullNameInput, 'name-error');
                hasErrors = true;
            } else {
                clearError(fullNameInput);
            }

            // Email Check
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'email-error');
                hasErrors = true;
            } else {
                clearError(emailInput);
            }

            // Service Type Check
            if (!serviceInput.value) {
                showError(serviceInput, 'service-error');
                hasErrors = true;
            } else {
                clearError(serviceInput);
            }

            // Submit logic if clean
            if (!hasErrors) {
                // Read selected service option text
                const selectedOptionText = serviceInput.options[serviceInput.selectedIndex].text;
                
                // Set modal values
                displayName.textContent = fullNameInput.value.trim();
                displayService.textContent = selectedOptionText;
                displayEmail.textContent = emailInput.value.trim();

                // Open modal
                successModal.classList.add('active');

                // Clear fields
                quoteForm.reset();
            }
        });
    }

    // Modal Close behavior
    if (successModal && modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });

        // Close on clicking the backdrop overlay
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // 4. Before-After Image Slider Drag Logic
    const sliderContainer = document.getElementById('before-after-slider');
    if (sliderContainer) {
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            // Calculate cursor offset relative to container left
            const x = clientX - rect.left;
            // Convert to percentage bounds 0% - 100%
            let percentage = (x / rect.width) * 100;
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            // Apply style variable on container
            sliderContainer.style.setProperty('--clip-pos', `${percentage}%`);
        };

        // Event: mouse down / touch start on container
        sliderContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });

        sliderContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            if (e.touches.length > 0) {
                updateSlider(e.touches[0].clientX);
            }
        }, { passive: true });

        // Event: mouse move / touch move on document
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                updateSlider(e.touches[0].clientX);
            }
        }, { passive: true });

        // Event: drag release
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // 5. FAQ Accordion Toggles
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const isOpen = item.classList.contains('active');

            // Collapse other accordion items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked item
            if (!isOpen) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 6. Newsletter Subscription Form Validation
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailValue = newsletterEmail.value.trim();
            const group = newsletterEmail.closest('.newsletter-input-group');
            const errorMsg = document.getElementById('newsletter-error');

            if (!emailValue || !isValidEmail(emailValue)) {
                group.classList.add('has-error');
                if (errorMsg) errorMsg.style.display = 'block';
            } else {
                group.classList.remove('has-error');
                if (errorMsg) errorMsg.style.display = 'none';
                
                // Show inline validation success alert
                alert(`Thank you for subscribing! A confirmation email has been sent to ${emailValue}.`);
                newsletterForm.reset();
            }
        });

        newsletterEmail.addEventListener('input', () => {
            const group = newsletterEmail.closest('.newsletter-input-group');
            const errorMsg = document.getElementById('newsletter-error');
            group.classList.remove('has-error');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    }

    // 7. Smooth Animations via Intersection Observer
    const animatedElements = document.querySelectorAll(
        '.service-card, .trust-item, .hero-content, .hero-form-card, .gallery-card, .process-step, .review-card, .hq-card, .mock-map-container'
    );
    
    // Add dynamic animation fade class
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
});
