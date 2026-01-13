// ADMIN LOGIC

// Reuse Storage Logic (Duplicate here to be safe and standalone)
const Storage = {
    getProducts: function () {
        const stored = localStorage.getItem('dropShop_products');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ensure any legacy product IDs (like strings) are handled or converted if necessary
            return parsed;
        }
        return window.PRODUCTS || [];
    },
    saveProducts: function (products) {
        localStorage.setItem('dropShop_products', JSON.stringify(products));
        // Force update the global if script.js is loaded
        if (window.PRODUCTS) window.PRODUCTS = products;
    },
    getConfig: function () {
        const stored = localStorage.getItem('dropShop_config');
        if (stored) return JSON.parse(stored);
        return {
            hero: {
                title: "One-stop shop for Home, Style & More",
                subtitle: "Explore our curated marketplace for the best in fashion and interiors.",
                primaryCta: "Start Shopping",
                primaryLink: "#products",
                showSecondary: true
            },
            announcement: {
                text: "FLASH SALE: 20% OFF Everything - Use Code: FLASH15",
                visible: true
            }
        };
    },
    saveConfig: function (config) {
        localStorage.setItem('dropShop_config', JSON.stringify(config));
        if (window.CONFIG) window.CONFIG = config;
    },
    // ORDER METHODS
    getOrders: function () {
        const stored = localStorage.getItem('dropShop_orders');
        if (stored) return JSON.parse(stored);
        return [];
    },
    saveOrders: function (orders) {
        localStorage.setItem('dropShop_orders', JSON.stringify(orders));
    },
    addOrder: function (order) {
        const orders = this.getOrders();
        orders.unshift(order);
        this.saveOrders(orders);
    },
    updateOrderStatus: function (orderId, status) {
        const orders = this.getOrders();
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            orders[idx].status = status;
            this.saveOrders(orders);
            return true;
        }
        return false;
    },
    clearOrders: function () {
        localStorage.removeItem('dropShop_orders');
    },
    // TRASH BIN METHODS
    getTrash: function () {
        const stored = localStorage.getItem('dropShop_trash');
        if (stored) return JSON.parse(stored);
        return [];
    },
    saveTrash: function (trash) {
        localStorage.setItem('dropShop_trash', JSON.stringify(trash));
    },
    moveToTrash: function (product) {
        const trash = this.getTrash();
        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

        trash.push({
            productId: product.id,
            product: product,
            deletedAt: now,
            expiresAt: now + thirtyDays
        });

        this.saveTrash(trash);
    },
    restoreFromTrash: function (productId) {
        const trash = this.getTrash();
        const index = trash.findIndex(item => item.productId == productId);

        if (index >= 0) {
            const item = trash[index];
            trash.splice(index, 1);
            this.saveTrash(trash);
            return item.product;
        }
        return null;
    },
    permanentlyDeleteFromTrash: function (productId) {
        const trash = this.getTrash();
        const filtered = trash.filter(item => item.productId != productId);
        this.saveTrash(filtered);
    },
    cleanupExpiredTrash: function () {
        const trash = this.getTrash();
        const now = Date.now();
        const active = trash.filter(item => item.expiresAt > now);

        if (active.length !== trash.length) {
            this.saveTrash(active);
            return trash.length - active.length; // Return count of deleted items
        }
        return 0;
    }
};

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

let PRODUCTS = [];
let CONFIG = {};
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check
    const loginOverlay = document.getElementById('adminLoginOverlay');
    const adminApp = document.getElementById('adminApp');
    const loginForm = document.getElementById('adminLoginForm');

    const isLoggedIn = localStorage.getItem('dropShop_admin_logged_in') === 'true';

    if (isLoggedIn) {
        loginOverlay.style.display = 'none';
        adminApp.style.display = 'flex';
        initDashboard();
    } else {
        loginOverlay.style.display = 'flex';
        adminApp.style.display = 'none';
    }

    // Login Handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('adminUser').value;
        const pass = document.getElementById('adminPass').value;

        if (user === 'admin' && pass === 'admin') {
            localStorage.setItem('dropShop_admin_logged_in', 'true');
            window.location.reload();
        } else {
            alert('Invalid credentials! (Try admin/admin)');
        }
    });

    // Logout Handler
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('dropShop_admin_logged_in');
        window.location.reload();
    });

    // Navigation Tabs
    const tabs = document.querySelectorAll('.nav-item[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            // Activate clicked
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

});

function initDashboard() {
    // Load Data
    PRODUCTS = Storage.getProducts();
    CONFIG = Storage.getConfig();

    // 1. Stats
    document.getElementById('statProductCount').textContent = PRODUCTS.length;

    // 2. Render Products
    renderProductTable();

    // 3. Init Forms
    initContentForms();
    initProductModal();
    initViewModal();
    initSearch();

    // 4. Render Chart
    renderSalesChart();

    // 5. Update Stats
    updateStats();
}

function updateStats() {
    const products = Storage.getProducts();
    const orders = Storage.getOrders();
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    const prodEl = document.getElementById('statProductCount');
    const orderEl = document.getElementById('statOrderCount');
    const revEl = document.getElementById('statRevenue');

    if (prodEl) prodEl.textContent = products.length;
    if (orderEl) orderEl.textContent = orders.length;
    if (revEl) revEl.textContent = '₦' + revenue.toLocaleString();
}

function renderSalesChart() {
    const chart = document.getElementById('salesChart');
    if (!chart) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Mock sales data (units sold)
    const sales = [12, 18, 15, 25, 30, 42, 28];
    const max = Math.max(...sales);

    chart.innerHTML = days.map((day, i) => {
        const height = (sales[i] / max) * 100;
        return `
            <div class="bar-group">
                <div class="bar" data-value="${sales[i]} orders" style="height:${height}%"></div>
                <span class="bar-label">${day}</span>
            </div>
        `;
    }).join('');
}

// *** PRODUCT MANAGEMENT ***

function initSearch() {
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderProductTable();
        });
    }
}

function renderProductTable() {
    const tbody = document.getElementById('productTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery) ||
        (p.vendor && p.vendor.toLowerCase().includes(searchQuery))
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--muted);">No products found matching "${searchQuery}"</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const isLowStock = (p.stock || 0) < 5;
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><img src="${p.img}" class="product-thumb" alt=""></td>
            <td>
                <div style="font-weight:600">${p.name}</div>
                ${isLowStock ? '<div style="color:#ef4444; font-size:10px; font-weight:700; margin-top:2px;">⚠️ LOW STOCK</div>' : ''}
            </td>
            <td><span class="muted" style="font-size:12px;">${p.category}</span></td>
            <td>₦${p.price.toLocaleString()}</td>
            <td>
                <span class="stock-tag ${isLowStock ? 'low-stock-alert' : ''}" style="background:rgba(255,255,255,0.05);">${p.stock || 0} units</span>
            </td>
            <td>
                <button class="action-btn btn-view" onclick="viewProduct(${p.id})">View</button>
                <button class="action-btn btn-edit" onclick="editProduct(${p.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.deleteProduct = function (id) {
    const product = PRODUCTS.find(p => p.id == id);
    if (!product) return;

    if (confirm(`Move "${product.name}" to trash? It will be permanently deleted after 30 days.`)) {
        // Move to trash instead of permanent delete
        Storage.moveToTrash(product);

        // Remove from active products
        PRODUCTS = PRODUCTS.filter(p => p.id != id);
        Storage.saveProducts(PRODUCTS);
        renderProductTable();

        // Update Stats
        const statEl = document.getElementById('statProductCount');
        if (statEl) statEl.textContent = PRODUCTS.length;

        showToast(`"${product.name}" moved to trash. Can be restored within 30 days.`, 'success');
    }
};

window.viewProduct = function (id) {
    const p = PRODUCTS.find(x => x.id == id);
    if (!p) return;

    const viewImg = document.getElementById('viewImg');
    const viewName = document.getElementById('viewName');
    const viewCategory = document.getElementById('viewCategory');
    const viewPrice = document.getElementById('viewPrice');
    const viewDesc = document.getElementById('viewDesc');
    const viewStock = document.getElementById('viewStock');

    if (viewImg) viewImg.src = p.img;
    if (viewName) viewName.textContent = p.name;
    if (viewCategory) viewCategory.textContent = p.category;
    if (viewPrice) viewPrice.textContent = '₦' + p.price.toLocaleString();
    if (viewDesc) viewDesc.textContent = p.desc || 'No description provided.';

    if (viewStock) {
        const isLowStock = (p.stock || 0) < 5;
        viewStock.textContent = `${p.stock || 0} units available`;
        viewStock.className = `stock-tag ${isLowStock ? 'low-stock-alert' : ''}`;
    }

    const viewModal = document.getElementById('adminViewModal');
    if (viewModal) viewModal.style.display = 'flex';
};

// *** ORDER MANAGEMENT ***

window.renderOrdersTable = function () {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const orders = Storage.getOrders();
    tbody.innerHTML = '';

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--muted);">No orders found.</td></tr>`;
        return;
    }

    orders.forEach(o => {
        const date = new Date(o.date).toLocaleDateString();
        const customerName = o.customer ? (o.customer['First Name'] + ' ' + o.customer['Last Name']) : 'Unknown';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color:#3b82f6">${o.id}</strong></td>
            <td>
                <div>${customerName}</div>
                <div class="small muted">${o.customer ? o.customer['Email Address'] : ''}</div>
            </td>
            <td>${date}</td>
            <td>${o.items.length} items</td>
            <td>₦${o.total.toLocaleString()}</td>
            <td>
                <span class="status-badge status-${o.status}">${o.status}</span>
            </td>
            <td>
                ${o.status === 'pending' ? `<button class="action-btn btn-ship" onclick="updateStatus('${o.id}', 'shipped')">Ship</button>` : ''}
                ${o.status === 'shipped' ? `<button class="action-btn btn-complete" onclick="updateStatus('${o.id}', 'completed')">Complete</button>` : ''}
                <button class="action-btn btn-view" onclick="viewOrderDetails('${o.id}')">Details</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

window.updateStatus = function (orderId, status) {
    if (Storage.updateOrderStatus(orderId, status)) {
        showToast(`Order ${orderId} marked as ${status}`, 'success');
        renderOrdersTable();
        updateStats();
    }
};

window.clearAllOrders = function () {
    if (confirm('Are you sure you want to clear all order history? This cannot be undone.')) {
        Storage.clearOrders();
        renderOrdersTable();
        updateStats();
        showToast('All orders cleared', 'info');
    }
};

window.viewOrderDetails = function (orderId) {
    const orders = Storage.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let itemsList = order.items.map(item => `• ${item.name} (${item.qty}x) - ₦${item.price.toLocaleString()}`).join('\n');
    let details = `
        Order ID: ${order.id}
        Date: ${new Date(order.date).toLocaleString()}
        Status: ${order.status.toUpperCase()}
        
        Customer: ${order.customer['First Name']} ${order.customer['Last Name']}
        Email: ${order.customer['Email Address']}
        Phone: ${order.customer['Phone Number']}
        Address: ${order.customer['Street Address']}, ${order.customer['City']}, ${order.customer['Select State']}
        
        Items:
        ${itemsList}
        
        Subtotal: ₦${order.subtotal.toLocaleString()}
        Shipping: ₦${order.shipping.toLocaleString()}
        TOTAL: ₦${order.total.toLocaleString()}
        Payment: ${order.payment}
    `;
    alert(details); // Simple for now, can be a modal later
};

// *** TRASH BIN FUNCTIONS ***
window.restoreProduct = function (productId) {
    const product = Storage.restoreFromTrash(productId);
    if (!product) {
        showToast('Product not found in trash', 'error');
        return;
    }

    // Add back to products
    PRODUCTS.push(product);
    Storage.saveProducts(PRODUCTS);

    // Refresh trash view
    renderTrashTable();

    // Update stats if on products tab
    const statEl = document.getElementById('statProductCount');
    if (statEl) statEl.textContent = PRODUCTS.length;

    showToast(`"${product.name}" restored successfully!`, 'success');
};

window.permanentlyDelete = function (productId) {
    const trash = Storage.getTrash();
    const item = trash.find(t => t.productId == productId);
    if (!item) return;

    if (confirm(`Permanently delete "${item.product.name}"? This action CANNOT be undone!`)) {
        Storage.permanentlyDeleteFromTrash(productId);
        renderTrashTable();
        showToast('Product permanently deleted', 'info');
    }
};

function renderTrashTable() {
    const tbody = document.getElementById('trashTableBody');
    if (!tbody) return;

    const trash = Storage.getTrash();
    tbody.innerHTML = '';

    if (trash.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--muted);">Trash is empty</td></tr>`;
        return;
    }

    trash.forEach(item => {
        const p = item.product;
        const deletedDate = new Date(item.deletedAt);
        const expiresDate = new Date(item.expiresAt);
        const daysLeft = Math.ceil((item.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.img}" class="product-thumb" alt=""></td>
            <td>
                <div style="font-weight:600">${p.name}</div>
                <div class="small muted">${p.category}</div>
            </td>
            <td>
                <div class="small">${deletedDate.toLocaleDateString()}</div>
                <div class="small muted">${deletedDate.toLocaleTimeString()}</div>
            </td>
            <td>
                <span class="expiry-badge ${daysLeft <= 7 ? 'expiring-soon' : ''}">${daysLeft} days left</span>
            </td>
            <td>
                <button class="action-btn btn-restore" onclick="restoreProduct(${p.id})">Restore</button>
                <button class="action-btn btn-delete" onclick="permanentlyDelete(${p.id})">Delete Forever</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update trash count
    const trashCount = document.getElementById('trashCount');
    if (trashCount) trashCount.textContent = trash.length;
}

function initViewModal() {
    const viewModal = document.getElementById('adminViewModal');
    if (!viewModal) return;

    const closeBtn = document.querySelector('.close-view');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            viewModal.style.display = 'none';
        });
    }

    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) viewModal.style.display = 'none';
    });
}

// *** ADD / EDIT PRODUCT ***
const modal = document.getElementById('adminProductModal');
let isEditing = false;

window.editProduct = function (id) {
    isEditing = true;
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    document.getElementById('prodId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodStock').value = p.stock || 0;
    document.getElementById('prodVendor').value = p.vendor || 'Desires Collection';
    document.getElementById('prodImg').value = p.img;
    document.getElementById('prodDesc').value = p.desc || '';
    document.getElementById('modalTitle').textContent = 'Edit Product';

    // Trigger Preview Update
    updateImagePreview(p.img);

    modal.style.display = 'flex';
};

function updateImagePreview(src) {
    const preview = document.getElementById('prodImgPreview');
    const placeholder = document.getElementById('prodImgPlaceholder');

    if (src && src.trim() !== '') {
        preview.src = src;
        preview.style.display = 'block';
        preview.onerror = () => {
            preview.style.display = 'none';
            placeholder.textContent = "Invalid Image URL";
            placeholder.style.display = 'block';
        };
        preview.onload = () => {
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        }
        placeholder.style.display = 'none';
    } else {
        preview.style.display = 'none';
        placeholder.textContent = "Image preview will appear here";
        placeholder.style.display = 'block';
    }
}

function initProductModal() {
    const addBtn = document.getElementById('addNewProductBtn');
    const imgInput = document.getElementById('prodImg');

    // Live Preview Listener
    imgInput.addEventListener('input', (e) => {
        updateImagePreview(e.target.value);
    });

    addBtn.addEventListener('click', () => {
        isEditing = false;
        document.getElementById('productForm').reset();
        updateImagePreview(''); // Reset preview
        document.getElementById('modalTitle').textContent = 'Add New Product';
        modal.style.display = 'flex';
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const idVal = document.getElementById('prodId').value;
        const name = document.getElementById('prodName').value;
        const category = document.getElementById('prodCategory').value;
        const price = Number(document.getElementById('prodPrice').value);
        const stock = Number(document.getElementById('prodStock').value);
        const vendor = document.getElementById('prodVendor').value || 'Desires Collection';
        const img = document.getElementById('prodImg').value;
        const desc = document.getElementById('prodDesc').value;

        if (isEditing) {
            // Update
            const idx = PRODUCTS.findIndex(p => p.id == idVal);
            if (idx !== -1) {
                PRODUCTS[idx] = { ...PRODUCTS[idx], name, category, price, stock, vendor, img, desc };
            }
            showToast('Product updated!', 'success');
        } else {
            // Add New
            const newId = Date.now(); // Simple ID gen
            PRODUCTS.unshift({
                id: newId,
                key: 'prod_' + newId,
                name, category, price, stock, vendor, img, desc,
                rating: 5.0,
                reviewCount: 0,
                reviews: []
            });
            showToast('New product added!', 'success');
        }

        Storage.saveProducts(PRODUCTS);
        renderProductTable();
        document.getElementById('statProductCount').textContent = PRODUCTS.length;
        modal.style.display = 'none';
    });
}


// *** SITE CONTENT MANAGEMENT ***
function initContentForms() {
    // 1. Announcement
    const annoForm = document.getElementById('announcementForm');
    const annoText = document.getElementById('annoText');
    const annoVisible = document.getElementById('annoVisible');

    annoText.value = CONFIG.announcement.text;
    annoVisible.checked = CONFIG.announcement.visible;

    annoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        CONFIG.announcement = {
            text: annoText.value,
            visible: annoVisible.checked
        };
        Storage.saveConfig(CONFIG);
        alert('Announcement updated! Check the main site.');
    });

    // 2. Hero
    const heroForm = document.getElementById('heroForm');
    const hTitle = document.getElementById('heroTitle');
    const hSub = document.getElementById('heroSubtitle');
    const hBtn = document.getElementById('heroBtnText');
    const hLink = document.getElementById('heroBtnLink');

    hTitle.value = CONFIG.hero.title;
    hSub.value = CONFIG.hero.subtitle;
    hBtn.value = CONFIG.hero.primaryCta;
    hLink.value = CONFIG.hero.primaryLink;

    heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        CONFIG.hero = {
            title: hTitle.value,
            subtitle: hSub.value,
            primaryCta: hBtn.value,
            primaryLink: hLink.value,
            showSecondary: true
        };
        Storage.saveConfig(CONFIG);
        alert('Hero section updated! Check the main site.');
    });
}

// *** INITIALIZATION ***
document.addEventListener('DOMContentLoaded', () => {
    // Clean up expired trash items on load
    const cleaned = Storage.cleanupExpiredTrash();
    if (cleaned > 0) {
        console.log(`Cleaned up ${cleaned} expired items from trash`);
    }

    // Initialize view modal
    initViewModal();

    // Add trash tab click handler
    const trashTab = document.getElementById('trashTab');
    if (trashTab) {
        trashTab.addEventListener('click', () => {
            renderTrashTable();
        });
    }

    // Add orders tab handler
    const ordersTab = document.querySelector('.nav-item[data-tab="orders"]');
    if (ordersTab) {
        ordersTab.addEventListener('click', () => {
            renderOrdersTable();
        });
    }
});
