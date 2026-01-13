/***** DATA: PRODUCTS (Cleaned - Only Valid Images) *****/
(function () {
    // expose PRODUCTS globally immediately as it is data
    window.PRODUCTS = [
        // FASHION: SHOES
        {
            id: 1,
            key: 'sneakers',
            category: 'fashion-shoes',
            name: "Classic Men's Sneakers",
            price: 25000,
            img: "images/nike_sneakers.png",
            desc: "Comfortable, stylish sneakers built for everyday wear.",
            vendor: "Desires Collection",
            rating: 4.5,
            reviewCount: 127,
            stock: 45,
            reviews: [{ author: "John D.", rating: 5, text: "Perfect fit and very comfortable!" }, { author: "Sarah M.", rating: 4, text: "Great quality, runs a bit large." }]
        },
        {
            id: 4,
            key: 'heels',
            category: 'fashion-shoes',
            name: "Women's Luxury Heels",
            price: 50000,
            img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=60",
            desc: "Elegant heels for evening occasions. Premium leather finish.",
            vendor: "Desires Collection",
            rating: 4.8,
            reviewCount: 89,
            stock: 12,
            reviews: [{ author: "Emma L.", rating: 5, text: "Absolutely stunning! Worth every penny." }, { author: "Lisa K.", rating: 4, text: "Beautiful but takes time to break in." }]
        },
        {
            id: 909,
            key: 'slides',
            category: 'fashion-shoes',
            name: "Slides",
            price: 8500,
            img: "images/slides.jpeg",
            desc: "Comfortable slides for casual everyday wear.",
            vendor: "Desires Collection",
            rating: 4.2,
            reviewCount: 203,
            stock: 156,
            reviews: [{ author: "Mike R.", rating: 4, text: "Very comfortable for the price." }, { author: "Tom B.", rating: 4, text: "Good quality, fast shipping." }]
        },
        {
            id: 301,
            key: 'jordan1',
            category: 'fashion-shoes',
            name: "Air Jordan 1 High",
            price: 85000,
            img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
            desc: "Iconic high-top sneakers. Premium leather construction.",
            vendor: "Desires Collection",
            stock: 15
        },

        {
            id: 303,
            key: 'timbs',
            category: 'fashion-shoes',
            name: "Premium Timberland Boots",
            price: 65000,
            img: "https://www.pngmart.com/files/7/Timberland-Boot-PNG-Isolated-Transparent-Image.png",
            desc: "Rugged waterproof wheat timberland boots for any terrain.",
            vendor: "Desires Collection",
            stock: 25
        },
        {
            id: 304,
            key: 'converse',
            category: 'fashion-shoes',
            name: "Converse All Star High",
            price: 18000,
            img: "https://images.unsplash.com/photo-1607522370275-f14bc3a5d288?auto=format&fit=crop&w=900&q=80",
            desc: "Classic black canvas high-top sneakers.",
            vendor: "Desires Collection",
            stock: 50
        },
        {
            id: 305,
            key: 'vans',
            category: 'fashion-shoes',
            name: "Vans Old Skool",
            price: 22000,
            img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
            desc: "Skate-inspired low tops with the iconic side stripe.",
            vendor: "Desires Collection",
            stock: 40
        },

        // FASHION: CLOTHES
        {
            id: 2,
            key: 'shorts',
            category: 'fashion-clothes',
            name: "Black Nike Shorts",
            price: 12000,
            img: "images/nike_shorts.png",
            desc: "Breathable fabric, perfect for sports or casual weekends.",
            vendor: "Desires Collection",
            rating: 4.6,
            reviewCount: 312,
            stock: 89,
            reviews: [{ author: "Alex P.", rating: 5, text: "Perfect for workouts!" }, { author: "Chris W.", rating: 4, text: "Great shorts, very breathable." }]
        },
        {
            id: 3,
            key: 'jacket',
            category: 'fashion-clothes',
            name: "Men's Winter Jacket",
            price: 60000,
            img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
            desc: "High-quality insulation. Water-resistant outer layer.",
            vendor: "Desires Collection",
            rating: 4.9,
            reviewCount: 67,
            stock: 8,
            reviews: [{ author: "David S.", rating: 5, text: "Best winter jacket I've owned!" }, { author: "Mark T.", rating: 5, text: "Keeps me warm in extreme cold." }]
        },
        {
            id: 101,
            key: 'img1',
            category: 'fashion-clothes',
            name: "Statement Graphic Tee",
            price: 15000,
            img: "images/1.JPG",
            desc: "Bold design on premium cotton. Streetwear essential.",
            vendor: "Desires Collection"
        },
        {
            id: 104,
            key: 'img4',
            category: 'fashion-clothes',
            name: "Nike Athletic Shorts",
            price: 18000,
            img: "images/Short Nike jpeg.jpeg",
            desc: "Performance shorts for training and casual wear.",
            vendor: "Desires Collection"
        },

        // HOME & INTERIORS
        {
            id: 5,
            key: 'lamp',
            category: 'home',
            name: "Minimalist Lamp",
            price: 18500,
            img: "images/minimalist_lamp.png",
            desc: "Warm light for a cozy atmosphere. Matte black finish.",
            vendor: "Desires Collection"
        },
        {
            id: 6,
            key: 'plant',
            category: 'home',
            name: "Ceramic Plant Pot",
            price: 8000,
            img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=60",
            desc: "Hand-crafted ceramic pot. Plant not included.",
            vendor: "Desires Collection"
        },
        {
            id: 7,
            key: 'chair',
            category: 'home',
            name: "Velvet Accent Chair",
            price: 45000,
            img: "images/velvet_chair.png",
            desc: "A statement piece for your living room. Ultra-soft velvet.",
            vendor: "Desires Collection"
        },
        {
            id: 901,
            key: 'rug',
            category: 'home',
            name: "Modern Geometric Rug",
            price: 35000,
            img: "images/modern_rug.png",
            desc: "Soft textured wool rug with modern geometric patterns.",
            vendor: "Desires Collection"
        },
        {
            id: 902,
            key: 'cushion',
            category: 'home',
            name: "Boho Throw Cushion",
            price: 8500,
            img: "images/boho_cushion.png",
            desc: "Hand-woven decorative cushion for sofas or beds.",
            vendor: "Desires Collection"
        },

        // LIFESTYLE
        {
            id: 8,
            key: 'watch',
            category: 'lifestyle',
            name: "Analog Classic Watch",
            price: 35000,
            img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=60",
            desc: "Timeless design with a genuine leather strap.",
            vendor: "Desires Collection"
        },
        {
            id: 106,
            key: 'img6',
            category: 'lifestyle',
            name: "Premium Sunglasses",
            price: 12000,
            img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
            desc: "Classic aviator style with UV protection and polarized lenses.",
            vendor: "Desires Collection"
        },
        {
            id: 107,
            key: 'img7',
            category: 'lifestyle',
            name: "Wireless Earbuds",
            price: 25000,
            img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
            desc: "Premium sound quality with active noise cancellation.",
            vendor: "Desires Collection"
        },

        // ADDITIONAL SHOES
        {
            id: 102,
            key: 'img2',
            category: 'fashion-shoes',
            name: "Nike Air Force 1",
            price: 22000,
            img: "images/2.JPG",
            desc: "Classic basketball-inspired sneakers with premium leather.",
            vendor: "Desires Collection"
        },
        {
            id: 103,
            key: 'img3',
            category: 'fashion-shoes',
            name: "Monochrome Sneakers",
            price: 45000,
            img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
            desc: "Sleek low-tops for any outfit. Classic black and white design.",
            vendor: "Desires Collection"
        },
        {
            id: 105,
            key: 'img5',
            category: 'fashion-shoes',
            name: "Premium Sneakers",
            price: 55000,
            img: "images/5.JPG",
            desc: "High-end athletic footwear with superior comfort.",
            vendor: "Desires Collection"
        },
        {
            id: 201,
            key: 'runningshoes',
            category: 'fashion-shoes',
            name: "Phantom Run Flyknit",
            price: 32000,
            img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
            desc: "High-performance running shoes with breathable mesh and responsive cushioning.",
            vendor: "Desires Collection"
        },
        {
            id: 202,
            key: 'loafers',
            category: 'fashion-shoes',
            name: "Classic Leather Loafers",
            price: 40000,
            img: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80",
            desc: "Hand-stitched genuine leather loafers. Perfect for office and formal events.",
            vendor: "Desires Collection"
        },
        {
            id: 203,
            key: 'hightops',
            category: 'fashion-shoes',
            name: "Urban High-Tops",
            price: 28000,
            img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80",
            desc: "Street-style high-top sneakers with retro color blocking.",
            vendor: "Desires Collection"
        },
        {
            id: 204,
            key: 'chelseaboots',
            category: 'fashion-shoes',
            name: "Suede Chelsea Boots",
            price: 35000,
            img: "https://images.unsplash.com/photo-1621086851211-1a84f3319d96?auto=format&fit=crop&w=900&q=80",
            desc: "Versatile suede boots that pair well with jeans or trousers.",
            vendor: "Desires Collection"
        },
        {
            id: 108,
            key: 'img8',
            category: 'fashion-shoes',
            name: "Formal Leather Shoes",
            price: 38000,
            img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80",
            desc: "Handcrafted leather Oxford shoes for formal occasions.",
            vendor: "Desires Collection"
        }
    ];

    // *** DATA: SITE CONFIG (Default) ***
    const DEFAULT_CONFIG = {
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

    // *** STORAGE MANAGER ***
    const Storage = {
        getProducts: function () {
            const stored = localStorage.getItem('dropShop_products');
            if (stored) return JSON.parse(stored);
            // If no stored data, save defaults and return them
            localStorage.setItem('dropShop_products', JSON.stringify(window.PRODUCTS));
            return window.PRODUCTS;
        },
        saveProducts: function (products) {
            localStorage.setItem('dropShop_products', JSON.stringify(products));
            window.PRODUCTS = products; // Update in-memory
        },
        getConfig: function () {
            const stored = localStorage.getItem('dropShop_config');
            if (stored) return JSON.parse(stored);
            localStorage.setItem('dropShop_config', JSON.stringify(DEFAULT_CONFIG));
            return DEFAULT_CONFIG;
        },
        saveConfig: function (config) {
            localStorage.setItem('dropShop_config', JSON.stringify(config));
        }
    };

    // Initialize Global State from Storage
    window.PRODUCTS = Storage.getProducts();
    window.CONFIG = Storage.getConfig();
})();
