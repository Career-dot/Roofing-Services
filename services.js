/* services.js – Dynamic filter, counter, and animation logic */
document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════════════════════════
       1. ANIMATED COUNTER — Hero Stats
    ══════════════════════════════════════════════════ */
    const counters = document.querySelectorAll('.svc-stat-num[data-target]');

    const animateCounter = (el) => {
        const target  = parseInt(el.dataset.target, 10);
        const duration = 1800; // ms
        const startTime = performance.now();

        const step = (now) => {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString();
        };
        requestAnimationFrame(step);
    };

    // Trigger once hero is visible
    const heroSection = document.getElementById('svc-hero');
    if (heroSection && counters.length) {
        const heroObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(c => animateCounter(c));
                    obs.disconnect();
                }
            });
        }, { threshold: 0.3 });
        heroObserver.observe(heroSection);
    }

    /* ══════════════════════════════════════════════════
       2. FILTER TABS — category filter
    ══════════════════════════════════════════════════ */
    const filterTabs   = document.querySelectorAll('.filter-tab');
    const cards        = document.querySelectorAll('.svc-card');
    const resultCount  = document.getElementById('filter-result-count');
    const emptyState   = document.getElementById('svc-empty-state');
    const resetBtn     = document.getElementById('reset-filter-btn');

    const updateResultCount = (visible) => {
        if (resultCount) {
            resultCount.innerHTML = `Showing <strong>${visible}</strong> service${visible !== 1 ? 's' : ''}`;
        }
    };

    const applyFilter = (filter) => {
        let visibleCount = 0;

        cards.forEach((card, i) => {
            const category = card.dataset.category;
            const match    = filter === 'all' || category === filter;

            if (match) {
                visibleCount++;
                card.style.display = '';
                // Staggered re-appear
                card.classList.remove('hiding');
                card.classList.add('showing');
                card.style.animationDelay = `${i * 0.06}s`;
                // Reset animation class after it plays
                card.addEventListener('animationend', () => {
                    card.classList.remove('showing');
                    card.style.animationDelay = '';
                }, { once: true });
            } else {
                card.classList.add('hiding');
                card.classList.remove('showing');
                card.addEventListener('animationend', () => {
                    card.style.display = 'none';
                    card.classList.remove('hiding');
                }, { once: true });
            }
        });

        updateResultCount(visibleCount);

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
        }
    };

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            applyFilter(tab.dataset.filter);
        });
    });

    // Reset button inside empty state
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            const allTab = document.querySelector('.filter-tab[data-filter="all"]');
            if (allTab) {
                allTab.classList.add('active');
                allTab.setAttribute('aria-selected', 'true');
            }
            applyFilter('all');
        });
    }

    // Init count
    updateResultCount(cards.length);

    /* ══════════════════════════════════════════════════
       3. SCROLL-TRIGGERED ANIMATIONS (AOS-style)
    ══════════════════════════════════════════════════ */
    const aosCandidates = document.querySelectorAll('[data-aos]');

    const aosObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // add transition with staggered delay based on sibling index
                const siblings = [...entry.target.parentElement.children];
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 0.08}s`;
                entry.target.style.transition =
                    `opacity 0.55s cubic-bezier(0.25,0.8,0.25,1) ${idx * 0.08}s,
                     transform 0.55s cubic-bezier(0.25,0.8,0.25,1) ${idx * 0.08}s`;
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    aosCandidates.forEach(el => aosObserver.observe(el));

    /* ══════════════════════════════════════════════════
       4. NEWSLETTER FORM (reuse from main site)
    ══════════════════════════════════════════════════ */
    const newsletterForm  = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');

    const isValidEmail = (email) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    };

    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = newsletterEmail.value.trim();
            const errorMsg = document.getElementById('newsletter-error');
            const group = newsletterEmail.closest('.newsletter-input-group');

            if (!val || !isValidEmail(val)) {
                group.classList.add('has-error');
                if (errorMsg) errorMsg.style.display = 'block';
            } else {
                group.classList.remove('has-error');
                if (errorMsg) errorMsg.style.display = 'none';
                alert(`Thank you! A confirmation has been sent to ${val}.`);
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

    /* ══════════════════════════════════════════════════
       5. MOBILE NAV TOGGLE (from index.js, duplicate for safety)
    ══════════════════════════════════════════════════ */
    const header    = document.getElementById('main-header');
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navMenu   = document.getElementById('nav-menu');

    if (header) {
        const handleScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('.nav-link, .btn').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }

});
