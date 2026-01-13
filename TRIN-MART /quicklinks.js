/***** QUICK LINKS FUNCTIONALITY *****/
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initQuickLinks);
    } else {
        initQuickLinks();
    }

    function initQuickLinks() {
        const infoBackdrop = document.getElementById('infoBackdrop');
        const infoTitle = document.getElementById('infoTitle');
        const infoContent = document.getElementById('infoContent');
        const closeInfo = document.getElementById('closeInfo');

        if (!infoBackdrop || !infoTitle || !infoContent || !closeInfo) return;

        const infoPages = {
            privacy: {
                title: '📜 Privacy Policy',
                content: `
                    <h4>Your Privacy Matters</h4>
                    <p>At TRIN-MART, we are committed to protecting your personal information and your right to privacy.</p>
                    
                    <h4>Information We Collect</h4>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email, phone number, shipping address</li>
                        <li><strong>Payment Information:</strong> Securely processed through trusted payment gateways</li>
                        <li><strong>Usage Data:</strong> Browsing behavior, preferences, and interactions</li>
                    </ul>
                    
                    <h4>How We Use Your Information</h4>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Send order confirmations and updates</li>
                        <li>Improve our services and user experience</li>
                        <li>Send promotional emails (with your consent)</li>
                    </ul>
                    
                    <h4>Data Security</h4>
                    <p>We implement industry-standard security measures to protect your data. Your payment information is encrypted and never stored on our servers.</p>
                    
                    <h4>Your Rights</h4>
                    <p>You have the right to access, update, or delete your personal information at any time. Contact us at <a href="mailto:privacy@desires-collection.com" style="color:#3b82f6;">privacy@desires-collection.com</a></p>
                    
                    <p style="margin-top:20px;"><small class="muted">Last updated: December 2025</small></p>
                `
            },
            terms: {
                title: '📋 Terms of Service',
                content: `
                    <h4>Agreement to Terms</h4>
                    <p>By accessing TRIN-MART, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                    
                    <h4>Use License</h4>
                    <ul>
                        <li>You may browse and purchase products for personal use</li>
                        <li>You may not resell products without authorization</li>
                        <li>You must provide accurate information during checkout</li>
                    </ul>
                    
                    <h4>Product Information</h4>
                    <p>We strive to display products accurately. However, we do not guarantee that product descriptions, colors, or other content is error-free.</p>
                    
                    <h4>Pricing</h4>
                    <ul>
                        <li>All prices are in Nigerian Naira (₦)</li>
                        <li>Prices are subject to change without notice</li>
                        <li>We reserve the right to cancel orders with pricing errors</li>
                    </ul>
                    
                    <h4>Account Responsibilities</h4>
                    <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities under your account.</p>
                    
                    <h4>Prohibited Activities</h4>
                    <ul>
                        <li>Fraudulent transactions</li>
                        <li>Harassment of other users or staff</li>
                        <li>Attempting to breach security measures</li>
                    </ul>
                    
                    <p style="margin-top:20px;"><small class="muted">Last updated: December 2025</small></p>
                `
            },
            shipping: {
                title: '📦 Shipping & Returns',
                content: `
                    <h4>Shipping Information</h4>
                    
                    <h5>Delivery Estimates</h5>
                    <ul>
                        <li><strong>Lagos:</strong> 1-2 Days</li>
                        <li><strong>South West:</strong> 2-3 Days</li>
                        <li><strong>South South / East:</strong> 3-5 Days</li>
                        <li><strong>Northern Regions:</strong> 4-7 Days</li>
                    </ul>
                    
                    <h5>Shipping Costs by Region</h5>
                    <ul>
                        <li><strong>Lagos:</strong> ₦2,500</li>
                        <li><strong>South West:</strong> ₦3,500</li>
                        <li><strong>South South / South East:</strong> ₦4,000</li>
                        <li><strong>North Central:</strong> ₦4,500</li>
                        <li><strong>North West:</strong> ₦5,000</li>
                        <li><strong>North East:</strong> ₦5,500</li>
                    </ul>
                    
                    <h4>Returns & Exchanges</h4>
                    
                    <h5>Return Policy</h5>
                    <p>We accept returns within <strong>14 days</strong> of delivery for most items.</p>
                    
                    <h5>Eligible for Return:</h5>
                    <ul>
                        <li>Unused items in original packaging</li>
                        <li>Items with tags still attached</li>
                        <li>Defective or damaged products</li>
                    </ul>
                    
                    <h5>Non-Returnable Items:</h5>
                    <ul>
                        <li>Intimate apparel and swimwear</li>
                        <li>Personalized or custom items</li>
                        <li>Sale or clearance items</li>
                    </ul>
                    
                    <h5>How to Return:</h5>
                    <ol>
                        <li>Contact us at <a href="mailto:returns@desires-collection.com" style="color:#3b82f6;">returns@desires-collection.com</a></li>
                        <li>Receive return authorization and instructions</li>
                        <li>Ship item back (return shipping costs may apply)</li>
                        <li>Refund processed within 5-7 business days</li>
                    </ol>
                    
                    <p style="margin-top:20px;"><small class="muted">Questions? Contact our support team!</small></p>
                `
            },
            about: {
                title: 'ℹ️ About TRIN-MART',
                content: `
                    <h4>Our Story</h4>
                    <p>TRIN-MART was founded in 2025 with a simple mission: to create a premium marketplace that connects quality sellers with discerning buyers across Nigeria.</p>
                    
                    <h4>What We Offer</h4>
                    <ul>
                        <li><strong>Curated Selection:</strong> Every product is carefully vetted for quality</li>
                        <li><strong>Trusted Sellers:</strong> All vendors go through a rigorous approval process</li>
                        <li><strong>Secure Shopping:</strong> Your transactions are protected and encrypted</li>
                        <li><strong>Customer First:</strong> Dedicated support team ready to help</li>
                    </ul>
                    
                    <h4>Our Categories</h4>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:16px 0;">
                        <div style="padding:12px;background:rgba(59,130,246,0.1);border-radius:8px;">
                            <strong>👟 Fashion</strong>
                            <p style="margin:4px 0 0 0;font-size:13px;" class="muted">Shoes, Clothes, Accessories</p>
                        </div>
                        <div style="padding:12px;background:rgba(139,92,246,0.1);border-radius:8px;">
                            <strong>🏠 Home & Interiors</strong>
                            <p style="margin:4px 0 0 0;font-size:13px;" class="muted">Furniture, Decor, Lighting</p>
                        </div>
                        <div style="padding:12px;background:rgba(236,72,153,0.1);border-radius:8px;">
                            <strong>⌚ Lifestyle</strong>
                            <p style="margin:4px 0 0 0;font-size:13px;" class="muted">Watches, Sunglasses, Tech</p>
                        </div>
                        <div style="padding:12px;background:rgba(34,197,94,0.1);border-radius:8px;">
                            <strong>🎁 More Coming Soon</strong>
                            <p style="margin:4px 0 0 0;font-size:13px;" class="muted">Beauty, Electronics, Sports</p>
                        </div>
                    </div>
                    
                    <h4>Our Values</h4>
                    <ul>
                        <li><strong>Quality:</strong> We never compromise on product standards</li>
                        <li><strong>Trust:</strong> Transparency in every transaction</li>
                        <li><strong>Innovation:</strong> Constantly improving the shopping experience</li>
                        <li><strong>Community:</strong> Supporting local businesses and artisans</li>
                    </ul>
                    
                    <h4>Join Our Community</h4>
                    <p>Whether you're a buyer looking for quality products or a seller wanting to reach more customers, TRIN-MART is your platform.</p>
                    
                    <div style="text-align:center;margin-top:24px;padding:20px;background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1));border-radius:12px;">
                        <h4 style="margin:0 0 8px 0;">Ready to Start Selling?</h4>
                        <button onclick="document.getElementById('sellersBtn').click()" class="btn" style="margin-top:12px;">Become a Seller</button>
                    </div>
                `
            }
        };

        function showInfoModal(page) {
            const pageData = infoPages[page];
            if (pageData) {
                infoTitle.textContent = pageData.title;
                infoContent.innerHTML = pageData.content;
                infoBackdrop.style.display = 'grid';
                infoBackdrop.setAttribute('aria-hidden', 'false');
            }
        }

        function closeInfoModal() {
            infoBackdrop.style.display = 'none';
            infoBackdrop.setAttribute('aria-hidden', 'true');
        }

        // Event listeners for quick links
        const privacyLink = document.getElementById('privacyLink');
        if (privacyLink) privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            showInfoModal('privacy');
        });

        const termsLink = document.getElementById('termsLink');
        if (termsLink) termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showInfoModal('terms');
        });

        const shippingLink = document.getElementById('shippingLink');
        if (shippingLink) shippingLink.addEventListener('click', (e) => {
            e.preventDefault();
            showInfoModal('shipping');
        });

        const aboutLink = document.getElementById('aboutLink');
        if (aboutLink) aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            showInfoModal('about');
        });

        const footerSellerLink = document.getElementById('footerSellerLink');
        if (footerSellerLink) footerSellerLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.openSellerModal) window.openSellerModal();
        });

        closeInfo.addEventListener('click', closeInfoModal);
        infoBackdrop.addEventListener('click', (e) => {
            if (e.target === infoBackdrop) closeInfoModal();
        });

        // Add to keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeInfoModal();
            }
        });
    }
})();
