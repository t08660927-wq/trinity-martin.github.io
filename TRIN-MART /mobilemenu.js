/* MOBILE MENU FUNCTIONALITY: improved class-based toggle for smooth CSS transitions */
(function () {
    // Ensure DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');

        // Only run if elements exist
        if (!hamburger || !mobileNav) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Toggle open/close using an 'open' class so CSS can animate
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileNav.classList.contains('open');

            if (isOpen) {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            } else {
                mobileNav.classList.add('open');
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Mobile login button
        const mobileLogin = document.getElementById('mobileLogin');
        if (mobileLogin) {
            mobileLogin.addEventListener('click', () => {
                const loginBtn = document.getElementById('loginBtn');
                if (loginBtn) loginBtn.click();
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
            });
        }

        // Mobile cart button
        const mobileCart = document.getElementById('mobileCart');
        if (mobileCart) {
            mobileCart.addEventListener('click', () => {
                const cartToggle = document.getElementById('cartToggle');
                if (cartToggle) cartToggle.click();
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
            });
        }
    }
})();
