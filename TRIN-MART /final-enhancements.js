/***** FINAL ENHANCEMENTS *****/
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFinalEnhancements);
    } else {
        initFinalEnhancements();
    }

    function initFinalEnhancements() {
        // ===== TOAST NOTIFICATIONS =====
        window.showToast = function (message, type = 'success') {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;

            const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
            toast.innerHTML = `
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
            `;

            container.appendChild(toast);

            // Animate in
            setTimeout(() => toast.classList.add('show'), 10);

            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        };

        // ===== NEWSLETTER SIGNUP =====
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('newsletterEmail');
                const email = emailInput ? emailInput.value : '';

                // Store in localStorage
                const subscribers = JSON.parse(localStorage.getItem('newsletter') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('newsletter', JSON.stringify(subscribers));
                    showToast('🎉 Subscribed! Check your email for your 10% off code.', 'success');
                    newsletterForm.reset();
                } else {
                    showToast('You\'re already subscribed!', 'info');
                }
            });
        }

        // ===== BACK TO TOP BUTTON =====
        const backToTop = document.getElementById('backToTop');

        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTop.style.display = 'flex';
                } else {
                    backToTop.style.display = 'none';
                }
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // ===== PRODUCT IMAGE ZOOM =====
        function initImageZoom() {
            const productModal = document.getElementById('productModalBackdrop'); // Corrected ID based on script.js
            if (!productModal) return;
            const modalImg = productModal.querySelector('img');

            if (modalImg) {
                modalImg.style.cursor = 'zoom-in';
                modalImg.addEventListener('click', function () {
                    if (this.classList.contains('zoomed')) {
                        this.classList.remove('zoomed');
                        this.style.cursor = 'zoom-in';
                    } else {
                        this.classList.add('zoomed');
                        this.style.cursor = 'zoom-out';
                    }
                });
            }
        }

        // Call after modal opens (hook into global showProductModal)
        // We need to wait for script.js to define showProductModal, which happens in DOMContentLoaded
        // Since we are also in DOMContentLoaded, order depends on include order. script.js should refernce before final-enhancements.js
        const originalShowProductModal = window.showProductModal;
        if (typeof originalShowProductModal === 'function') {
            window.showProductModal = function (productId) {
                originalShowProductModal(productId);
                setTimeout(initImageZoom, 100);
            };
        }

        // ===== LOADING SKELETON =====
        window.showLoadingSkeleton = function () {
            const grid = document.getElementById('productGrid');
            if (!grid) return;
            grid.innerHTML = '';

            for (let i = 0; i < 8; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton-card';
                skeleton.innerHTML = `
                    <div class="skeleton-img"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-text"></div>
                `;
                grid.appendChild(skeleton);
            }
        };

        // ===== PROMO CODE IN CART =====
        function addPromoCodeToCart() {
            const cartPanel = document.getElementById('cartPanel');
            const cartList = document.getElementById('cartList');
            if (!cartPanel || !cartList) return;

            // Check if promo input already exists
            if (document.getElementById('promoCodeInput')) return;

            const promoSection = document.createElement('div');
            promoSection.style.cssText = 'padding:12px 0;border-top:1px solid rgba(255,255,255,0.1);margin-top:12px;';
            promoSection.innerHTML = `
                <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <input type="text" id="promoCodeInput" placeholder="Promo code" style="flex:1;padding:8px 12px;border-radius:8px;border:2px solid rgba(59,130,246,0.3);background:rgba(0,0,0,0.3);color:white;font-size:13px;">
                    <button id="applyPromoBtn" class="btn secondary" style="padding:8px 16px;font-size:13px;">Apply</button>
                </div>
                <div id="promoMessage" style="font-size:12px;"></div>
                <div id="discountDisplay" style="display:none;margin-top:8px;padding:8px;background:rgba(34,197,94,0.1);border-radius:6px;font-size:13px;">
                    <span style="color:#22c55e;">✓ Discount applied: </span>
                    <span id="discountAmount" style="font-weight:700;"></span>
                </div>
            `;

            // Insert before total
            const totalDiv = cartPanel.querySelector('.flex.space-between');
            if (totalDiv) {
                totalDiv.parentNode.insertBefore(promoSection, totalDiv);
            }

            // Add event listener
            const applyBtn = document.getElementById('applyPromoBtn');
            if (applyBtn) applyBtn.addEventListener('click', applyFinalPromoCode);
        }

        let appliedDiscount = 0;
        let appliedPromoCode = null;

        function applyFinalPromoCode() {
            const input = document.getElementById('promoCodeInput');
            const code = input.value.toUpperCase();
            const message = document.getElementById('promoMessage');
            const discountDisplay = document.getElementById('discountDisplay');

            const promoCodes = {
                'WELCOME10': 0.10,
                'SAVE10': 0.10,
                'FLASH15': 0.15,
                'WELCOME20': 0.20
            };

            if (promoCodes[code]) {
                appliedDiscount = promoCodes[code];
                appliedPromoCode = code;
                message.innerHTML = `<span style="color:#22c55e;">✓ Code "${code}" applied!</span>`;
                discountDisplay.style.display = 'block';
                // Trigger update to recalc totals
                if (window.updateCartUI) window.updateCartUI();
                showToast(`Promo code applied! ${(appliedDiscount * 100)}% off`, 'success');
            } else {
                message.innerHTML = `<span style="color:#ef4444;">Invalid promo code</span>`;
                discountDisplay.style.display = 'none';
                setTimeout(() => message.innerHTML = '', 3000);
            }
        }

        // Override updateCartUI to include discount
        // Need to be careful not to infinite loop if we call original inside
        const originalUpdateCartUI = window.updateCartUI;
        if (typeof originalUpdateCartUI === 'function') {
            window.updateCartUI = function () {
                originalUpdateCartUI(); // This renders the basic cart items and basic totals

                // Add promo section if cart has items
                if (window.CART && window.CART.length > 0) {
                    addPromoCodeToCart();

                    // Update total with discount
                    if (appliedDiscount > 0) {
                        const totalElement = document.querySelector('#cartPanel .flex.space-between strong'); // This might be fragile, depending on script.js structure
                        // In script.js: cartTotalEl.textContent = formatNGN(total);
                        // Accessing global ID directly is safer if it exists
                        const cartTotalEl = document.getElementById('cartTotal');
                        const cartSubtotalEl = document.getElementById('cartSubtotal');

                        if (cartTotalEl && cartSubtotalEl) {
                            // recalculate base subtotal
                            const subtotal = window.CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
                            const discount = subtotal * appliedDiscount;
                            // delivery is hardcoded in script.js as 2000 if cart not empty
                            const delivery = 2000;
                            const total = subtotal - discount + delivery;

                            const discountAmtEl = document.getElementById('discountAmount');
                            if (discountAmtEl) discountAmtEl.textContent = `-${formatNGN(discount)}`;
                            cartTotalEl.textContent = formatNGN(total);
                        }
                    }
                }
            };
        }

        // ===== QUICK VIEW MODAL =====
        let quickViewModal = null;

        function createQuickViewModal() {
            if (quickViewModal) return;

            quickViewModal = document.createElement('div');
            quickViewModal.id = 'quickViewBackdrop';
            quickViewModal.className = 'modal-backdrop';
            quickViewModal.style.display = 'none';
            quickViewModal.innerHTML = `
                <div class="modal" style="max-width:900px;">
                    <button class="close-x" onclick="closeQuickView()">✕</button>
                    <div id="quickViewContent" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;"></div>
                </div>
            `;
            document.body.appendChild(quickViewModal);
        }

        window.showQuickView = function (productId) {
            createQuickViewModal();
            const product = window.PRODUCTS.find(p => p.id === productId);
            if (!product) return;

            const content = document.getElementById('quickViewContent');
            content.innerHTML = `
                <div>
                    <img src="${product.img}" alt="${product.name}" style="width:100%;border-radius:12px;cursor:zoom-in;" onclick="this.classList.toggle('zoomed')">
                </div>
                <div>
                    <div class="vendor-tag">Sold by ${product.vendor}</div>
                    <h2 style="margin:8px 0;">${product.name}</h2>
                    ${typeof renderStars !== 'undefined' && product.rating ? `
                        <div style="display:flex;gap:6px;align-items:center;margin:8px 0;">
                            ${renderStars(product.rating)}
                            <span class="small muted">(${product.reviewCount || 0})</span>
                        </div>
                    ` : ''}
                    <div class="price" style="font-size:28px;margin:12px 0;">${formatNGN(product.price)}</div>
                    ${typeof getStockBadge !== 'undefined' ? getStockBadge(product.stock || 50) : ''}
                    <p style="margin:16px 0;line-height:1.6;">${product.desc}</p>
                    <div style="display:flex;gap:12px;margin-top:24px;">
                        <button class="btn" onclick="addToCart(${product.id}); showToast('Added to cart!', 'success');" style="flex:1;">Add to Cart</button>
                        <button class="btn secondary" onclick="closeQuickView(); showProductModal(${product.id});">Full Details</button>
                    </div>
                </div>
            `;

            quickViewModal.style.display = 'grid';
        };

        window.closeQuickView = function () {
            if (quickViewModal) {
                quickViewModal.style.display = 'none';
            }
        };

        // Add quick view button to product cards
        // Wait a bit for products to render
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                const viewBtn = card.querySelector('[data-action="view"]');
                if (viewBtn) {
                    const quickViewBtn = document.createElement('button');
                    quickViewBtn.className = 'btn secondary';
                    quickViewBtn.textContent = '👁️';
                    quickViewBtn.title = 'Quick View';
                    quickViewBtn.style.cssText = 'width:40px;padding:0;justify-content:center;font-size:16px;';
                    quickViewBtn.onclick = (e) => {
                        e.stopPropagation();
                        const productId = parseInt(viewBtn.dataset.id);
                        showQuickView(productId);
                    };
                    viewBtn.parentNode.insertBefore(quickViewBtn, viewBtn.nextSibling);
                }
            });
        }, 500);

        // ===== PWA INSTALL PROMPT =====
        let deferredPrompt;
        const installBtn = document.getElementById('installAppBtn');
        const mobileInstallBtn = document.getElementById('mobileInstallBtn');

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            if (installBtn) installBtn.style.display = 'none';
            if (mobileInstallBtn) mobileInstallBtn.style.display = 'none';
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            // Show the buttons
            if (installBtn) {
                installBtn.style.display = 'inline-flex';
                installBtn.classList.add('pulse-animation');
            }
            if (mobileInstallBtn) mobileInstallBtn.style.display = 'block';
        });

        function handleInstallClick() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        if (window.showToast) showToast('Installing TRIN-MART...', 'success');
                    }
                    deferredPrompt = null;
                    if (installBtn) installBtn.style.display = 'none';
                    if (mobileInstallBtn) mobileInstallBtn.style.display = 'none';
                });
            } else {
                // Fallback for iOS or other browsers where prompt isn't triggered
                if (window.showToast) {
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                    if (isIOS) {
                        showToast('To install: Tap the "Share" icon and then "Add to Home Screen" 📲', 'info');
                    } else {
                        showToast('Look for the "Install" icon in your browser address bar! 📲', 'info');
                    }
                }
            }
        }

        if (installBtn) installBtn.addEventListener('click', handleInstallClick);
        if (mobileInstallBtn) mobileInstallBtn.addEventListener('click', handleInstallClick);

        window.addEventListener('appinstalled', () => {
            if (installBtn) installBtn.style.display = 'none';
            if (mobileInstallBtn) mobileInstallBtn.style.display = 'none';
            deferredPrompt = null;
            if (window.showToast) showToast('App installed successfully! 🎉', 'success');
        });

        // ===== FORCE INITIAL RENDER =====
        // Ensure products are rendered if script.js initial render was missed
        if (typeof window.renderProducts === 'function') {
            console.log('Forcing initial product render...');
            window.renderProducts();
        }

        // ===== SCROLL REVEAL =====
        function initScrollReveal() {
            const reveals = document.querySelectorAll('.reveal');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px"
            });

            reveals.forEach(el => observer.observe(el));
        }

        // ===== HERO PARALLAX =====
        function initParallax() {
            const hero = document.querySelector('.hero');
            if (hero) {
                window.addEventListener('scroll', () => {
                    const scrolled = window.scrollY;
                    // Simple parallax: move background slower than scroll
                    hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
                });
            }
        }

        initScrollReveal();
        initParallax();

        console.log('✨ Final enhancements loaded!');
    }
})();
