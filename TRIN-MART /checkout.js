/***** CHECKOUT FUNCTIONALITY *****/
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCheckout);
    } else {
        initCheckout();
    }

    function initCheckout() {
        const checkoutBackdrop = document.getElementById('checkoutBackdrop');
        const closeCheckout = document.getElementById('closeCheckout');
        const checkoutTopBtn = document.getElementById('checkoutTop');

        if (!checkoutBackdrop || !closeCheckout || !checkoutTopBtn) return;

        let currentCheckoutStep = 1;

        // Expose functions globally for HTML onclick attributes
        window.openCheckout = function () {
            if (CART.length === 0) {
                alert('Your cart is empty! Add some products first.');
                return;
            }
            checkoutBackdrop.style.display = 'grid';
            checkoutBackdrop.setAttribute('aria-hidden', 'false');
            currentCheckoutStep = 1;
            goToCheckoutStep(1);
            updateCheckoutSummary();
        };

        window.closeCheckoutModal = function () {
            checkoutBackdrop.style.display = 'none';
            checkoutBackdrop.setAttribute('aria-hidden', 'true');
        };

        window.goToCheckoutStep = function (step) {
            // Hide all steps
            const s1 = document.getElementById('checkoutStep1');
            const s2 = document.getElementById('checkoutStep2');
            const s3 = document.getElementById('checkoutStep3');

            if (s1) s1.style.display = 'none';
            if (s2) s2.style.display = 'none';
            if (s3) s3.style.display = 'none';

            // Show selected step
            const current = document.getElementById(`checkoutStep${step}`);
            if (current) current.style.display = 'block';

            // Update step indicators
            document.querySelectorAll('.checkout-step').forEach(el => {
                el.classList.remove('active');
            });
            const stepInd = document.querySelector(`.checkout-step[data-step="${step}"]`);
            if (stepInd) stepInd.classList.add('active');

            currentCheckoutStep = step;

            if (step === 3) {
                updateCheckoutSummary();
            }
        };

        window.updateCheckoutSummary = function () {
            const orderSummary = document.getElementById('orderSummary');
            if (!orderSummary) return;

            const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);

            // Get selected state from shipping form
            const stateSelect = document.querySelector('#checkoutStep1 select[data-shipping-state]');
            const selectedState = stateSelect ? stateSelect.value : '';

            // Regional Shipping Rates and Estimates
            const regions = {
                lagos: { rate: 2500, est: '1-2 Days' },
                southWest: { rate: 3500, est: '2-3 Days', states: ['ekiti', 'ogun', 'ondo', 'osun', 'oyo'] },
                southSouth: { rate: 4000, est: '3-5 Days', states: ['akwa-ibom', 'bayelsa', 'cross-river', 'delta', 'edo', 'rivers'] },
                southEast: { rate: 4000, est: '3-5 Days', states: ['abia', 'anambra', 'ebonyi', 'enugu', 'imo'] },
                northCentral: { rate: 4500, est: '4-6 Days', states: ['abuja', 'benue', 'kogi', 'kwara', 'nasarawa', 'niger', 'plateau'] },
                northWest: { rate: 5000, est: '5-7 Days', states: ['jigawa', 'kaduna', 'kano', 'katsina', 'kebbi', 'sokoto', 'zamfara'] },
                northEast: { rate: 5500, est: '5-7 Days', states: ['adamawa', 'bauchi', 'borno', 'gombe', 'taraba', 'yobe'] }
            };

            let shipping = 2500; // Default
            let estimate = '--';

            if (selectedState === 'lagos') {
                shipping = regions.lagos.rate;
                estimate = regions.lagos.est;
            } else {
                for (const regKey in regions) {
                    if (regions[regKey].states && regions[regKey].states.includes(selectedState)) {
                        shipping = regions[regKey].rate;
                        estimate = regions[regKey].est;
                        break;
                    }
                }
            }

            const total = subtotal + shipping;

            // Populate order items
            let summaryHTML = '<div style="margin-bottom:16px;">';
            CART.forEach(item => {
                summaryHTML += `
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.05);">
                        <div>
                            <strong>${item.name}</strong>
                            <p class="muted" style="margin:2px 0 0 0;font-size:12px;">Qty: ${item.qty}</p>
                        </div>
                        <span>${formatNGN(item.price * item.qty)}</span>
                    </div>
                `;
            });
            summaryHTML += '</div>';

            // Add Delivery Info to summary
            summaryHTML += `
                <div style="background:rgba(59,130,246,0.1); border-radius:8px; padding:12px; margin-bottom:16px; border:1px solid rgba(59,130,246,0.2);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:13px; color:#3b82f6; font-weight:600;">🚚 Estimated Delivery:</span>
                        <span style="font-size:13px; color:white; font-weight:700;">${estimate}</span>
                    </div>
                </div>
            `;

            orderSummary.innerHTML = summaryHTML;

            // Update totals
            const elSub = document.getElementById('checkoutSubtotal');
            const elShip = document.getElementById('checkoutShipping');
            const elTot = document.getElementById('checkoutTotal');

            if (elSub) elSub.textContent = formatNGN(subtotal);
            if (elShip) elShip.textContent = formatNGN(shipping);
            if (elTot) elTot.textContent = formatNGN(total);
        };

        window.completeOrder = function () {
            const selectedPaymentInput = document.querySelector('input[name="payment"]:checked');
            if (!selectedPaymentInput) {
                alert('Please select a payment method');
                return;
            }

            // Get shipping details
            const shippingForm = document.getElementById('shippingForm');
            const inputs = shippingForm.querySelectorAll('input, select');
            const shippingDetails = {};
            inputs.forEach(input => {
                const placeholder = input.placeholder || input.name;
                if (placeholder) {
                    shippingDetails[placeholder.replace('*', '').trim()] = input.value;
                }
            });

            const selectedPayment = selectedPaymentInput.value;
            const paymentNames = {
                'verve': 'Verve Card',
                'card': 'Debit/Credit Card',
                'transfer': 'Bank Transfer',
                'opay': 'Opay',
                'moniepoint': 'Moniepoint'
            };

            const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const shippingCost = parseInt(document.getElementById('checkoutShipping').textContent.replace(/[₦,]/g, '')) || 0;
            const total = subtotal + shippingCost;

            // Create Order Object
            const order = {
                id: 'ORD-' + Date.now().toString().slice(-6),
                date: new Date().toISOString(),
                items: CART.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty })),
                subtotal: subtotal,
                shipping: shippingCost,
                total: total,
                payment: paymentNames[selectedPayment],
                customer: shippingDetails,
                status: 'pending'
            };

            // PERSIST ORDER (Handle Storage object if accessible, else direct localStorage)
            const saveOrder = (newOrder) => {
                const stored = localStorage.getItem('dropShop_orders');
                const orders = stored ? JSON.parse(stored) : [];
                orders.unshift(newOrder);
                localStorage.setItem('dropShop_orders', JSON.stringify(orders));
            };

            const updateProductStock = (orderItems) => {
                const storedProducts = localStorage.getItem('dropShop_products');
                if (storedProducts) {
                    let products = JSON.parse(storedProducts);
                    orderItems.forEach(item => {
                        const pIdx = products.findIndex(p => p.id == item.id);
                        if (pIdx !== -1) {
                            products[pIdx].stock = Math.max(0, (products[pIdx].stock || 0) - item.qty);
                        }
                    });
                    localStorage.setItem('dropShop_products', JSON.stringify(products));
                    if (window.PRODUCTS) window.PRODUCTS = products;
                }
            };

            saveOrder(order);
            updateProductStock(order.items);

            // Simulate order processing
            window.closeCheckoutModal();

            // Show success message
            setTimeout(() => {
                alert(`🎉 Order Placed Successfully!\n\nOrder ID: ${order.id}\nPayment Method: ${order.payment}\n\nYou will receive a confirmation email shortly.\n\nThank you for shopping with TRIN-MART!`);

                // Clear cart
                CART = [];
                updateCartUI();
                if (typeof renderProducts === 'function') renderProducts();
            }, 300);
        };

        // Event listeners
        checkoutTopBtn.addEventListener('click', window.openCheckout);
        closeCheckout.addEventListener('click', window.closeCheckoutModal);
        checkoutBackdrop.addEventListener('click', (e) => {
            if (e.target === checkoutBackdrop) window.closeCheckoutModal();
        });

        // Update shipping when state is selected
        document.addEventListener('change', (e) => {
            if (e.target.matches('#checkoutStep1 select')) {
                if (currentCheckoutStep === 3) {
                    window.updateCheckoutSummary();
                }
            }
        });

        // Add to keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.closeCheckoutModal();
            }
        });
    }
})();
