/***** ENHANCEMENTS SCRIPT - All 12 Features *****/
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancements);
    } else {
        initEnhancements();
    }

    function initEnhancements() {
        // Add default product data for products missing it
        if (typeof PRODUCTS !== 'undefined') {
            PRODUCTS.forEach(p => {
                if (!p.rating) {
                    p.rating = (Math.random() * 1.5 + 3.5).toFixed(1);
                    p.reviewCount = Math.floor(Math.random() * 200 + 20);
                    p.stock = Math.floor(Math.random() * 100 + 5);
                    p.reviews = [];
                }
            });
        }

        /***** WISHLIST SYSTEM *****/
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        // Expose to window for inline onclicks
        window.wishlist = wishlist;

        window.toggleWishlist = function (productId) {
            const idx = wishlist.indexOf(productId);
            if (idx >= 0) {
                wishlist.splice(idx, 1);
            } else {
                wishlist.push(productId);
            }
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistUI();
            if (window.renderProducts) window.renderProducts();
        };

        window.updateWishlistUI = function () {
            const el = document.getElementById('wishlistCount');
            if (el) el.textContent = wishlist.length;
        };

        /***** SEARCH FUNCTIONALITY *****/
        let searchQuery = '';
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        if (searchInput) {
            let searchTimeout;
            const suggestionsList = document.getElementById('searchSuggestions');

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();

                // Show skeleton immediately if user is typing
                if (query.length > 0 && typeof window.showLoadingSkeleton === 'function') {
                    window.showLoadingSkeleton();
                }

                if (clearSearch) clearSearch.style.display = query ? 'block' : 'none';

                // Handle Suggestions
                if (query.length >= 1) {
                    const matches = PRODUCTS.filter(p =>
                        p.name.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query)
                    ).slice(0, 5);

                    if (matches.length > 0 && suggestionsList) {
                        suggestionsList.innerHTML = matches.map(p => `
                            <div class="suggestion-item" onclick="showProductModal(${p.id}); document.getElementById('searchSuggestions').style.display='none';">
                                <img src="${p.img}" alt="${p.name}">
                                <div class="suggestion-info">
                                    <span class="suggestion-name">${p.name}</span>
                                    <span class="suggestion-price">₦${p.price.toLocaleString()}</span>
                                </div>
                            </div>
                        `).join('');
                        suggestionsList.style.display = 'block';
                    } else if (suggestionsList) {
                        suggestionsList.style.display = 'none';
                    }
                } else if (suggestionsList) {
                    suggestionsList.style.display = 'none';
                }

                // Debounce search
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    searchQuery = query;
                    window.searchQuery = searchQuery; // Expose for renderProducts
                    if (window.renderProducts) window.renderProducts();
                }, 600);
            });

            // Close suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && suggestionsList && !suggestionsList.contains(e.target)) {
                    suggestionsList.style.display = 'none';
                }
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                window.searchQuery = '';
                clearSearch.style.display = 'none';
                if (window.renderProducts) window.renderProducts();
            });
        }

        /***** SORT & FILTER *****/
        let currentSort = 'default';
        let priceMin = 0;
        let priceMax = 100000;

        // Expose for renderProducts
        window.currentSort = currentSort;
        window.priceMin = priceMin;
        window.priceMax = priceMax;

        const sortSelect = document.getElementById('sortSelect');
        const priceMinInput = document.getElementById('priceMin');
        const priceMaxInput = document.getElementById('priceMax');
        const priceMinLabel = document.getElementById('priceMinLabel');
        const priceMaxLabel = document.getElementById('priceMaxLabel');

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                window.currentSort = e.target.value;
                if (window.renderProducts) window.renderProducts();
            });
        }

        if (priceMinInput) {
            priceMinInput.addEventListener('input', (e) => {
                window.priceMin = parseInt(e.target.value);
                if (priceMinLabel) priceMinLabel.textContent = '₦' + (window.priceMin / 1000).toFixed(0) + 'k';
                if (window.renderProducts) window.renderProducts();
            });
        }

        if (priceMaxInput) {
            priceMaxInput.addEventListener('input', (e) => {
                window.priceMax = parseInt(e.target.value);
                if (priceMaxLabel) priceMaxLabel.textContent = '₦' + (window.priceMax / 1000).toFixed(0) + 'k';
                if (window.renderProducts) window.renderProducts();
            });
        }

        /***** RECENTLY VIEWED *****/
        let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

        function addToRecentlyViewed(productId) {
            recentlyViewed = recentlyViewed.filter(id => id !== productId);
            recentlyViewed.unshift(productId);
            recentlyViewed = recentlyViewed.slice(0, 5);
            localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
            renderRecentlyViewed();
        }

        window.renderRecentlyViewed = function () {
            const container = document.getElementById('recentlyViewed');
            const grid = document.getElementById('recentlyViewedGrid');
            if (!container || !grid) return;

            if (recentlyViewed.length === 0) {
                container.style.display = 'none';
                return;
            }

            container.style.display = 'block';
            grid.innerHTML = '';

            recentlyViewed.forEach(id => {
                const p = PRODUCTS.find(x => x.id === id);
                if (!p) return;

                const el = document.createElement('article');
                el.className = 'card fade-in';
                el.style.position = 'relative';
                el.innerHTML = `
                    <img src="${p.img}" alt="${p.name}">
                    <div>
                        <div class="vendor-tag">Sold by ${p.vendor}</div>
                        <h3>${p.name}</h3>
                        <div class="price">₦${p.price.toLocaleString()}</div>
                    </div>
                    <div class="actions">
                        <button class="btn" onclick="showProductModal(${p.id})" style="width:100%">View</button>
                    </div>
                `;
                grid.appendChild(el);
            });
        };

        // Hook into showProductModal to track recently viewed
        const originalShowProductModal = window.showProductModal;
        window.showProductModal = function (productId) {
            addToRecentlyViewed(productId);
            if (typeof originalShowProductModal === 'function') {
                originalShowProductModal(productId);
            }
        };

        // Initial render
        renderRecentlyViewed();

        /***** PROMO CODES *****/
        const promoCodes = {
            'SAVE10': 0.10,
            'WELCOME20': 0.20,
            'FLASH15': 0.15
        };
        let activePromo = null;

        function applyPromoCode(code) {
            if (promoCodes[code.toUpperCase()]) {
                activePromo = code.toUpperCase();
                if (window.updateCartUI) window.updateCartUI();
                return true;
            }
            return false;
        }

        /***** NEWSLETTER *****/
        function subscribeNewsletter(email) {
            // Store in localStorage for demo
            const subscribers = JSON.parse(localStorage.getItem('newsletter') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletter', JSON.stringify(subscribers));
                return true;
            }
            return false;
        }

        /***** SOCIAL SHARING *****/
        function shareProduct(product, platform) {
            const url = window.location.href;
            const text = `Check out ${product.name} at TRIN-MART!`;

            switch (platform) {
                case 'whatsapp':
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
                    break;
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
                    break;
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                    break;
                case 'copy':
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                    break;
            }
        }

        /***** HELPER FUNCTIONS *****/
        window.getStockBadge = function (stock) {
            if (stock === 0) return '<span class="stock-badge out">Out of Stock</span>';
            if (stock < 10) return '<span class="stock-badge low">Low Stock</span>';
            return '<span class="stock-badge in">In Stock</span>';
        };

        window.renderStars = function (rating) {
            const fullStars = Math.floor(rating);
            const hasHalf = rating % 1 >= 0.5;
            let stars = '';
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) stars += '★';
                else if (i === fullStars && hasHalf) stars += '⯨';
                else stars += '☆';
            }
            return `<span class="stars">${stars}</span>`;
        };

        function getRelatedProducts(product) {
            return PRODUCTS
                .filter(p => p.id !== product.id && p.category === product.category)
                .slice(0, 4);
        }

        // Initialize UI
        updateWishlistUI();
    }
})();
