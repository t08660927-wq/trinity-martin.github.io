/***** HEADER LINE FUNCTIONALITY *****/
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderLine);
    } else {
        initHeaderLine();
    }

    function initHeaderLine() {
        const headerLine = document.getElementById('headerLine');
        const closeHeaderLine = document.getElementById('closeHeaderLine');
        const promoMessage = document.getElementById('promoMessage');

        if (!headerLine || !closeHeaderLine || !promoMessage) return;

        // Promotional messages to rotate
        // Promotional messages to rotate
        const promoMessages = [
            { icon: '🔥', text: 'FLASH SALE: 20% OFF Everything - Use Code: FLASH15' },
            { icon: '👟', text: 'Deal of the Day: Nike Sneakers @ ₦25,000' },
            { icon: '🚚', text: 'Free Shipping on orders over ₦100k' },
            { icon: '🎁', text: 'New Customer? Get 10% OFF with code: WELCOME10' },
            { icon: '⚡', text: 'New Arrivals Just Dropped - Shop Now!' }
        ];

        let currentPromoIndex = 0;

        // Rotate promo messages every 5 seconds
        function rotatePromoMessage() {
            currentPromoIndex = (currentPromoIndex + 1) % promoMessages.length;
            const promo = promoMessages[currentPromoIndex];

            // Fade out
            promoMessage.style.opacity = '0';
            const icon = document.querySelector('.promo-icon');
            if (icon) icon.style.opacity = '0';

            setTimeout(() => {
                // Update content
                promoMessage.textContent = promo.text;
                if (icon) {
                    icon.textContent = promo.icon;
                    // Fade in
                    icon.style.opacity = '1';
                }
                promoMessage.style.opacity = '1';
            }, 300);
        }

        // Add transition to message
        promoMessage.style.transition = 'opacity 0.3s ease';
        const icon = document.querySelector('.promo-icon');
        if (icon) icon.style.transition = 'opacity 0.3s ease';

        // Start rotation
        const promoInterval = setInterval(rotatePromoMessage, 5000);

        // Close header line
        closeHeaderLine.addEventListener('click', () => {
            headerLine.style.animation = 'slideUp 0.5s ease';
            setTimeout(() => {
                headerLine.style.display = 'none';
                clearInterval(promoInterval);
                // Save preference to localStorage
                localStorage.setItem('headerLineClosed', 'true');
            }, 500);
        });

        // Add slide up animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(-100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Check if user previously closed the header line
        if (localStorage.getItem('headerLineClosed') === 'true') {
            headerLine.style.display = 'none';
        }
    }
})();
