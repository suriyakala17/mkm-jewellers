/* ================= MKM JEWELLERS ================= */

const WA_NUMBER = "918667314426";
const GST_RATE = 3;

/* ---------- helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function money(n) {
    return "₹" + Number(n || 0).toLocaleString("en-IN");
}
function fmtVal(n, dec) {
    dec = dec === undefined ? 0 : dec;
    return Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
function esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}
function store(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { }
}
function load(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
}
function toast(msg) {
    const t = $("#toast");
    t.innerText = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.remove("show"), 2600);
}
function waLink(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
}
function ownerOrderMsg(o) {
    const c = o.customer || {};
    const lines = [];
    lines.push("NEW ORDER - MKM Jewellers");
    lines.push("Order ID: " + o.id);
    lines.push("Date: " + o.date);
    lines.push("");
    lines.push("Customer: " + (c.name || "-"));
    lines.push("Phone: " + (c.phone || "-"));
    if (c.email) lines.push("Email: " + c.email);
    const addr = [c.address, c.city].filter(Boolean).join(", ");
    if (addr) lines.push("Address: " + addr);
    lines.push("Payment: " + (o.payment || "-"));
    lines.push("");
    lines.push("Items:");
    o.items.forEach((it, i) => {
        lines.push((i + 1) + ". " + it.name + " x" + it.qty + " = " + money(it.price * it.qty));
    });
    lines.push("");
    lines.push("Subtotal: " + money(o.sub));
    lines.push("GST: " + money(o.gst));
    lines.push("TOTAL: " + money(o.total));
    return lines.join("\n");
}
function starsHTML(n) {
    n = Number(n) || 0;
    let out = "";
    for (let i = 1; i <= 5; i++) out += i <= n ? "★" : "☆";
    return out;
}
function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function dateStr(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function dayOffset(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}
function currentPeriod() { return new Date().getHours() < 12 ? "AM" : "PM"; }
function fmtTime(d) {
    let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, "0");
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + m + " " + ap;
}

/* ---------- seed products ---------- */
const SEED_PRODUCTS = [
    {
        id: "p1", name: "Gold Ring", category: "ring", metal: "gold", purity: "22K",
        occasion: "daily", weight: 8.2, price: 79000, img: "ring.jpg",
        images: ["ring.jpg"], isNew: true, isBest: false, seq: 1,
        desc: "A finely crafted 22K gold ring with a sleek traditional finish. Perfect for daily wear and gifting, BIS hallmarked for purity."
    },
    {
        id: "p2", name: "Gold Necklace", category: "necklace", metal: "gold", purity: "22K",
        occasion: "party", weight: 35.4, price: 558000, img: "necklace.jpg",
        images: ["necklace.jpg"], isNew: false, isBest: true, seq: 2,
        desc: "22K Gold Necklace — 916 Hallmark. Elegant antique-finish necklace crafted by master goldsmiths, ideal for weddings and festivals."
    },
    {
        id: "p3", name: "Gold Bangle", category: "bangle", metal: "gold", purity: "22K",
        occasion: "party", weight: 42, price: 568000, img: "bangles.jpg",
        images: ["bangles.jpg"], isNew: false, isBest: false, seq: 3,
        desc: "Premium design gold bangle with a rich traditional pattern. Sturdy, comfortable and perfect for festive occasions."
    },
    {
        id: "p4", name: "Gold Earring", category: "earring", metal: "gold", purity: "18K",
        occasion: "daily", weight: 12, price: 71000, img: "earring1.jpg",
        images: ["earring1.jpg"], isNew: true, isBest: false, seq: 4,
        desc: "Lightweight 18K gold earrings with an elegant modern style — easy to carry all day."
    },
    {
        id: "p5", name: "Gold Chain", category: "chain", metal: "gold", purity: "22K",
        occasion: "daily", weight: 28, price: 280000, img: "chain.jpg",
        images: ["chain.jpg"], isNew: false, isBest: true, seq: 5,
        desc: "Strong and shiny 22K gold chain, machine-finished for extra lustre. A timeless everyday classic."
    },
    {
        id: "p6", name: "Gold Bracelet", category: "bracelet", metal: "gold", purity: "18K",
        occasion: "party", weight: 10, price: 80000, img: "bracelets.jpg",
        images: ["bracelets.jpg"], isNew: false, isBest: false, seq: 6,
        desc: "Stylish 18K gold bracelet with a modern link design — a perfect party-wear accessory."
    },
    {
        id: "p7", name: "Bridal Set", category: "bridal", metal: "gold", purity: "22K",
        occasion: "bridal", weight: 250, price: 2500000, img: "bs3.jpg",
        images: ["bs3.jpg"], isNew: false, isBest: true, seq: 7,
        desc: "Complete 22K bridal set — necklace, haram, earrings and bangle in one grand traditional design. The showstopper for your wedding."
    },
    {
        id: "p8", name: "Gold Haram", category: "haram", metal: "gold", purity: "22K",
        occasion: "bridal", weight: 55, price: 550000, img: "haram1.jpg",
        images: ["haram1.jpg"], isNew: true, isBest: false, seq: 8,
        desc: "Long 22K temple-style gold haram with intricate detailing — a heritage piece for bridal and festival wear."
    },
    {
        id: "p9", name: "Silver Bracelets", category: "bracelet", metal: "silver", purity: "925",
        occasion: "daily", weight: 40, price: 15000, img: "silbrace1.jpg",
        images: ["silbrace1.jpg"], isNew: false, isBest: false, seq: 9,
        desc: "925 sterling silver bracelet with a polished finish. Trendy, durable and perfect for daily wear."
    },
    {
        id: "p10", name: "Silver Anklets", category: "anklet", metal: "silver", purity: "925",
        occasion: "daily", weight: 60, price: 75000, img: "silanklet2.jpg",
        images: ["silanklet2.jpg"], isNew: true, isBest: false, seq: 10,
        desc: "Designer 925 silver anklets with delicate workmanship that jingles beautifully with every step."
    },
    {
        id: "p11", name: "Silver Ring", category: "ring", metal: "silver", purity: "925",
        occasion: "daily", weight: 6, price: 2500, img: "silring.jpg",
        images: ["silring.jpg"], isNew: false, isBest: false, seq: 11,
        desc: "Minimalist 925 sterling silver ring — a great everyday or gifting choice."
    },
    {
        id: "p12", name: "Silver Chain", category: "chain", metal: "silver", purity: "925",
        occasion: "daily", weight: 45, price: 15000, img: "silchain.jpg",
        images: ["silchain.jpg"], isNew: false, isBest: true, seq: 12,
        desc: "Classic 925 silver chain with a brilliant mirror finish. Strong, stylish and unisex."
    },
    {
        id: "p13", name: "Bridal Necklace Set", category: "bridal", metal: "gold", purity: "22K",
        occasion: "bridal", weight: 120, price: 1250000, img: "bs1.jpg",
        images: ["bs1.jpg"], isNew: true, isBest: false, seq: 13,
        desc: "Grand 22K bridal necklace set with matching earrings — designed for the wedding spotlight."
    },
    {
        id: "p14", name: "Bridal Haram Set", category: "bridal", metal: "gold", purity: "22K",
        occasion: "bridal", weight: 95, price: 980000, img: "bs2.jpg",
        images: ["bs2.jpg"], isNew: false, isBest: false, seq: 14,
        desc: "Traditional bridal haram set in 22K gold with rich temple-inspired motifs."
    },
    {
        id: "p15", name: "Bridal Earrings", category: "earring", metal: "gold", purity: "22K",
        occasion: "bridal", weight: 30, price: 320000, img: "bs4.jpg",
        images: ["bs4.jpg"], isNew: false, isBest: true, seq: 15,
        desc: "Statement 22K bridal earrings that complete your wedding look with sparkle and tradition."
    },
    {
        id: "p16", name: "Silver Anklets Classic", category: "anklet", metal: "silver", purity: "925",
        occasion: "party", weight: 55, price: 68000, img: "silanklet1.jpg",
        images: ["silanklet1.jpg"], isNew: false, isBest: false, seq: 16,
        desc: "Elegant 925 silver anklets — a party-wear favourite with a bright rhodium finish."
    },
    {
        id: "p17", name: "Silver Bracelet Premium", category: "bracelet", metal: "silver", purity: "925",
        occasion: "party", weight: 48, price: 22000, img: "silbrace2.jpg",
        images: ["silbrace2.jpg"], isNew: true, isBest: false, seq: 17,
        desc: "Premium 925 sterling silver bracelet with a bold designer pattern."
    }
];

const SEED_REVIEWS = [
    { name: "Priya", stars: 5, text: "Excellent craftsmanship and service. Loved my necklace!", product: "Gold Necklace", date: "2026-06-12" },
    { name: "Arun", stars: 5, text: "Beautiful designs and trusted quality. Very fair pricing.", product: "Gold Ring", date: "2026-07-03" },
    { name: "Kavitha", stars: 4, text: "Bridal collection is stunning. Staff explained everything patiently.", product: "Bridal Set", date: "2026-07-21" },
    { name: "Ramesh", stars: 5, text: "Genuine hallmarked gold and on-time order delivery.", product: "Gold Chain", date: "2026-08-15" }
];

const GALLERY = [
    { img: "bs1.jpg", cat: "bridal", cap: "Bridal Necklace Set" },
    { img: "bs2.jpg", cat: "bridal", cap: "Bridal Haram Set" },
    { img: "bs3.jpg", cat: "bridal", cap: "Complete Bridal Set" },
    { img: "bs4.jpg", cat: "bridal", cap: "Bridal Earrings" },
    { img: "necklace.jpg", cat: "gold", cap: "Gold Necklace" },
    { img: "ring.jpg", cat: "gold", cap: "Gold Ring" },
    { img: "bangles.jpg", cat: "gold", cap: "Gold Bangles" },
    { img: "earring1.jpg", cat: "gold", cap: "Gold Earrings" },
    { img: "bracelets.jpg", cat: "gold", cap: "Gold Bracelet" },
    { img: "haram1.jpg", cat: "temple", cap: "Temple Haram" },
    { img: "chain.jpg", cat: "daily", cap: "Daily Wear Chain" },
    { img: "silbrace1.jpg", cat: "silver", cap: "Silver Bracelets" },
    { img: "silbrace2.jpg", cat: "silver", cap: "Silver Bracelet Premium" },
    { img: "silanklet1.jpg", cat: "silver", cap: "Silver Anklets" },
    { img: "silanklet2.jpg", cat: "silver", cap: "Silver Anklets Classic" },
    { img: "silchain.jpg", cat: "silver", cap: "Silver Chain" },
    { img: "silring.jpg", cat: "engagement", cap: "Engagement Ring" }
];

const ORDER_STATUSES = ["Placed", "Confirmed", "Processing", "Ready", "Delivered"];
const ANNOUNCEMENTS = [
    "✨ Diwali Special Collection | New Designs Available",
    "💎 Wedding Season Collection – Explore Now",
    "🏷️ Flat 20% off on Making Charges – Bridal Sets"
];

/* ---------- state ---------- */
let products = load("mkm_products", null) || SEED_PRODUCTS.slice();
let cart = load("mkm_cart", []);
let wishlist = load("mkm_wishlist", []);
let users = load("mkm_users", []);
let session = load("mkm_session", null);
let orders = load("mkm_orders", []);
let reviews = load("mkm_reviews", null) || SEED_REVIEWS.slice();
let appointments = load("mkm_appointments", []);
let adminLogged = false;
let rvStars = 5;
let galIndex = 0;
let galList = [];
let ratePeriodView = "latest";
let historyWindow = "today";

const RATE_DEFAULTS = { gold: 0, silver: 0 };
let rates = load("mkm_rates", null) || { gold: RATE_DEFAULTS.gold, silver: RATE_DEFAULTS.silver, period: currentPeriod(), updatedAt: null, history: [] };
if (rates && !rates.updatedAt) { rates.gold = RATE_DEFAULTS.gold; rates.silver = RATE_DEFAULTS.silver; }

function saveProducts() { store("mkm_products", products); }
function saveCart() { store("mkm_cart", cart); }
function saveWish() { store("mkm_wishlist", wishlist); }
function saveUsers() { store("mkm_users", users); }
function saveOrders() { store("mkm_orders", orders); }
function saveReviews() { store("mkm_reviews", reviews); }
function saveRates() { store("mkm_rates", rates); }

function nextUserNo() {
    return users.reduce((m, u) => Math.max(m, Number(u.no) || 0), 0) + 1;
}
function ensureUserNumbers() {
    let max = users.reduce((m, u) => Math.max(m, Number(u.no) || 0), 0);
    let changed = false;
    users.forEach(u => { if (!u.no) { u.no = ++max; changed = true; } });
    if (changed) saveUsers();
}

function getProduct(id) { return products.find(p => p.id === id); }
function currentUser() { return users.find(u => u.email === session) || null; }

/* ==================================================
   ROUTER
================================================== */
function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const parts = h.split("/").map(x => decodeURIComponent(x)).filter(Boolean);
    return { route: (parts[0] || "home").toLowerCase(), params: parts.slice(1) };
}

const PAGE_DEFS = {
    home: { id: "page-home", render: () => { renderHome(); } },
    products: { id: "page-products", render: () => { filterProducts(); } },
    bridal: { id: "page-bridal", render: renderBridal },
    gold: { id: "page-gold", render: () => renderInto("#goldGrid", products.filter(p => p.metal === "gold")) },
    silver: { id: "page-silver", render: () => renderInto("#silverGrid", products.filter(p => p.metal === "silver")) },
    product: { id: "page-product", render: (p) => openProduct(p[0]) },
    rates: { id: "page-rates", render: renderRates },
    calculator: { id: "page-calculator", render: renderCalculator },
    gallery: { id: "page-gallery", render: () => renderGallery(currentGalCat) },
    reviews: { id: "page-reviews", render: renderReviews },
    appointment: { id: "page-appointment", render: () => { } },
    about: { id: "page-about", render: () => { } },
    contact: { id: "page-contact", render: () => { } },
    wishlist: { id: "page-wishlist", render: renderWishlist },
    cart: { id: "page-cart", render: renderCart },
    checkout: { id: "page-checkout", render: renderCheckout },
    orders: { id: "page-orders", render: (p) => renderOrders(p) },
    auth: { id: "page-auth", render: () => { } },
    profile: { id: "page-profile", render: renderProfile },
    admin: { id: "page-admin", render: renderAdmin }
};

function router() {
    const { route, params } = parseHash();
    const def = PAGE_DEFS[route] || PAGE_DEFS.home;
    $$(".page").forEach(p => p.classList.remove("active"));
    const el = document.getElementById(def.id);
    if (el) el.classList.add("active");
    window.scrollTo(0, 0);

    const hash = location.hash.replace(/^#/, "");
    $$("#mainNav a").forEach(a => a.classList.toggle("active",
        a.getAttribute("href") === ("#" + hash) ||
        (hash === "" && a.getAttribute("href") === "#/")));

    try { def.render(params); } catch (e) { console.error(e); }
}

window.addEventListener("hashchange", router);

window.addEventListener("load", () => {
    init();
    router();
});

/* ---------- product card ---------- */
function cardHTML(p) {
    const wished = wishlist.includes(p.id);
    const badge = p.isNew ? '<span class="p-badge">New</span>'
        : p.isBest ? '<span class="p-badge">Best Seller</span>' : "";
    const wtext = "Hi, I'm interested in " + p.name + " – " + money(p.price) + ". Please share more details.";
    return `
    <article class="product">
        <a class="p-img" href="#/product/${p.id}">
            <img src="${p.img}" alt="${esc(p.name)}" loading="lazy">
            ${badge}
        </a>
        <button class="wish-btn ${wished ? "active" : ""}" data-wish="${p.id}" title="Add to Wishlist">${wished ? "♥" : "♡"}</button>
        <a href="#/product/${p.id}" style="text-decoration:none"><h3>${esc(p.name)}</h3></a>
        <p class="p-meta">${p.purity} • ${cap(p.metal)} • ${p.weight}g</p>
        <h4>${money(p.price)}</h4>
        <div class="p-actions">
            <button data-add="${p.id}">Add to Cart</button>
            <a href="#/product/${p.id}" style="text-decoration:none;background:#000;color:#fff;border:none;padding:9px 14px;border-radius:5px;font-size:13px;display:flex;align-items:center;justify-content:center">Details</a>
        </div>
        <a class="wa-mini" target="_blank" rel="noopener" href="${waLink(wtext)}">💬 Enquire on WhatsApp</a>
    </article>`;
}

function renderInto(sel, list) {
    const el = $(sel);
    if (!el) return;
    el.innerHTML = list.length ? list.map(cardHTML).join("") : '<p class="empty-msg">No products found.</p>';
}

/* ---------- home ---------- */
function renderHome() {
    renderInto("#newGrid", products.filter(p => p.isNew).slice(0, 4));
    renderInto("#bestGrid", products.filter(p => p.isBest).slice(0, 4));
    updateLiveStrip();
}

/* ---------- product page ---------- */
let pdState = { id: null, qty: 1 };

function openProduct(id) {
    const p = getProduct(id);
    if (!p) {
        location.hash = "#/";
        return;
    }
    pdState = { id: id, qty: 1 };

    $("#pdMainImg").src = p.img;
    $("#pdMainImg").alt = p.name;
    $("#pdName").innerText = p.name;
    $("#pdMetal").innerText = cap(p.metal);
    $("#pdWeight").innerText = p.weight + " g";
    $("#pdPurity").innerText = p.purity === "925" ? "925 Sterling Silver" : p.purity + (p.purity === "22K" ? " – 916 Hallmark" : "");
    $("#pdOccasion").innerText = p.occasion === "daily" ? "Daily Wear" : p.occasion === "party" ? "Party Wear" : "Bridal";
    $("#pdPrice").innerText = money(p.price);
    $("#pdDesc").innerText = p.desc;
    $("#pdQty").innerText = "1";

    const rv = reviews.filter(r => r.product === p.name);
    const avg = rv.length ? Math.round(rv.reduce((s, r) => s + r.stars, 0) / rv.length) : 0;
    $("#pdRating").innerHTML = rv.length
        ? starsHTML(avg) + " <span>(" + rv.length + " review" + (rv.length > 1 ? "s" : "") + ")</span>"
        : '<span style="color:#999">No reviews yet</span>';

    const imgs = (p.images && p.images.length ? p.images : [p.img]);
    $("#pdThumbs").innerHTML = imgs.map((im, i) =>
        `<img src="${im}" class="${i === 0 ? "active" : ""}" data-thumb="${im}">`).join("");

    const wtext = "Hi, I'm interested in " + p.name + " – " + money(p.price) + ". Please share more details.";
    $("#pdWhatsApp").href = waLink(wtext);
    updatePdWish();

    let note = "Indicative price. Taxes extra as applicable.";
    if (p.metal === "gold") {
        const todayRate = goldForPurity(p.purity);
        if (todayRate) note += " Today's " + p.purity + " rate: ₹" + fmtVal(todayRate) + "/g.";
    } else {
        note += " Silver rate today: ₹" + fmtVal(rates.silver, 2) + "/g.";
    }
    $("#pdRateNote").innerText = note;

    const related = products.filter(x => x.id !== p.id && (x.category === p.category || x.metal === p.metal)).slice(0, 3);
    renderInto("#pdRelated", related);
}

$$(".pd-qty button").forEach(b => b.addEventListener("click", () => {
    pdState.qty = Math.max(1, pdState.qty + Number(b.dataset.pq));
    $("#pdQty").innerText = pdState.qty;
}));

$("#pdThumbs").addEventListener("click", e => {
    const t = e.target.closest("[data-thumb]");
    if (!t) return;
    $("#pdMainImg").src = t.dataset.thumb;
    $$("#pdThumbs img").forEach(i => i.classList.remove("active"));
    t.classList.add("active");
});

$("#pdAddCart").addEventListener("click", () => {
    addToCart(pdState.id, pdState.qty);
    location.hash = "#/cart";
});

$("#pdWishBtn").addEventListener("click", () => toggleWish(pdState.id));

function updatePdWish() {
    if (!pdState.id) return;
    const on = wishlist.includes(pdState.id);
    const b = $("#pdWishBtn");
    b.classList.toggle("active", on);
    b.innerHTML = on ? "♥ In Wishlist" : "♡ Wishlist";
}

document.addEventListener("click", e => {
    const back = e.target.closest("[data-back]");
    if (back) {
        if (history.length > 1) history.back();
        else location.hash = "#/";
        return;
    }

    const closeBtn = e.target.closest("[data-close]");
    if (closeBtn) { $("#lightbox").classList.remove("active"); return; }
    if (e.target.classList && e.target.classList.contains("lightbox")) {
        $("#lightbox").classList.remove("active");
        return;
    }

    const wishBtn = e.target.closest("[data-wish]");
    if (wishBtn) { e.preventDefault(); e.stopPropagation(); toggleWish(wishBtn.dataset.wish); return; }

    const addBtn = e.target.closest("[data-add]");
    if (addBtn) { addToCart(addBtn.dataset.add, 1); return; }
});

/* ---------- collections ---------- */
function renderBridal() {
    const cat = ($("#bridalChips .chip.active") ? $("#bridalChips .chip.active").dataset.bridal : "all");
    let list = products.filter(p => p.occasion === "bridal" || p.category === "bridal");
    if (cat !== "all") list = list.filter(p => p.category === cat);
    renderInto("#bridalGrid", list);
}

$("#bridalChips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$("#bridalChips .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    renderBridal();
});

/* ---------- filters ---------- */
function filterProducts() {
    const q = ($("#searchInput").value || "").toLowerCase().trim();
    const cat = $("#categoryFilter").value;
    const metal = $("#metalFilter").value;
    const purity = $("#purityFilter").value;
    const occ = $("#occasionFilter").value;
    const wt = $("#weightFilter").value;
    const maxP = Number($("#priceRange").value);
    const sort = $("#sortFilter").value;

    let list = products.filter(p => {
        const text = (p.name + " " + p.category + " " + p.metal + " " + p.purity).toLowerCase();
        let weightMatch = true;
        if (wt !== "all") {
            const parts = wt.split("-");
            weightMatch = p.weight >= Number(parts[0]) && p.weight <= Number(parts[1]);
        }
        return (text.includes(q))
            && (cat === "all" || p.category === cat)
            && (metal === "all" || p.metal === metal)
            && (purity === "all" || p.purity === purity)
            && (occ === "all" || p.occasion === occ)
            && weightMatch
            && p.price <= maxP;
    });

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "weight") list.sort((a, b) => a.weight - b.weight);
    else if (sort === "new") list.sort((a, b) => b.seq - a.seq);

    renderInto("#productGrid", list);
    $("#resultCount").innerText = list.length + " product(s) found";
    $("#emptyMsg").style.display = list.length ? "none" : "block";
    $("#priceOut").innerText = money(maxP);
}

function initFilters() {
    ["searchInput", "categoryFilter", "metalFilter", "purityFilter", "occasionFilter", "weightFilter", "sortFilter", "priceRange"]
        .forEach(id => {
            const el = $("#" + id);
            el.addEventListener(id === "searchInput" ? "keyup" : "input", filterProducts);
        });

    $("#clearFilters").addEventListener("click", () => {
        $("#searchInput").value = "";
        ["categoryFilter", "metalFilter", "purityFilter", "occasionFilter", "weightFilter"].forEach(id => $("#" + id).value = "all");
        $("#sortFilter").value = "default";
        $("#priceRange").value = 2500000;
        filterProducts();
    });
}

/* ---------- wishlist ---------- */
function toggleWish(id) {
    const p = getProduct(id);
    if (!p) return;
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
        toast(p.name + " removed from wishlist");
    } else {
        wishlist.push(id);
        toast("♥ " + p.name + " added to Wishlist");
    }
    saveWish();
    updateCounts();
    const curHash = location.hash;
    if (curHash === "#/wishlist") renderWishlist();
    if (pdState.id === id) updatePdWish();
    renderCurrentGrids();
}

function renderCurrentGrids() {
    const { route } = parseHash();
    if (route === "home") renderHome();
    if (route === "bridal") renderBridal();
    if (route === "gold") PAGE_DEFS.gold.render();
    if (route === "silver") PAGE_DEFS.silver.render();
    if (route === "products") filterProducts();
}

function renderWishlist() {
    const list = wishlist.map(getProduct).filter(Boolean);
    renderInto("#wishGrid", list);
    $("#wishEmpty").style.display = list.length ? "none" : "block";
}

/* ---------- cart ---------- */
function addToCart(id, qty) {
    const p = getProduct(id);
    if (!p) return;
    qty = qty || 1;
    const found = cart.find(c => c.id === id);
    if (found) found.qty += qty;
    else cart.push({ id: id, qty: qty });
    saveCart();
    updateCounts();
    if (parseHash().route === "cart") renderCart();
    toast(p.name + " added to cart");
}

function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
    saveCart();
    updateCounts();
    renderCart();
}

function removeCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    updateCounts();
    renderCart();
    toast("Item removed from cart");
}

function cartTotals() {
    const sub = cart.reduce((s, c) => {
        const p = getProduct(c.id);
        return s + (p ? p.price * c.qty : 0);
    }, 0);
    const gst = Math.round(sub * GST_RATE / 100);
    return { sub: sub, gst: gst, total: sub + gst };
}

function renderCart() {
    const box = $("#cart-items");
    if (!cart.length) {
        box.innerHTML = '<div class="empty-cart">Your cart is empty.<br>Start adding beautiful jewellery 🛍️</div>';
    } else {
        box.innerHTML = cart.map(c => {
            const p = getProduct(c.id);
            if (!p) return "";
            return `
            <div class="cart-item">
                <a href="#/product/${p.id}"><img src="${p.img}" alt="${esc(p.name)}"></a>
                <div class="ci-info">
                    <b>${esc(p.name)}</b>
                    ${p.purity} • ${money(p.price)}
                </div>
                <div class="qty-box">
                    <button data-qty="-1" data-id="${p.id}">−</button>
                    <span>${c.qty}</span>
                    <button data-qty="1" data-id="${p.id}">+</button>
                </div>
                <button class="ci-remove" data-remove="${p.id}" title="Remove"><i class="fas fa-trash"></i></button>
            </div>`;
        }).join("");
    }
    const t = cartTotals();
    $("#cartSub").innerText = money(t.sub);
    $("#cartGst").innerText = money(t.gst);
    $("#total-price").innerText = money(t.total);
    $("#coSub").innerText = money(t.sub);
    $("#coGst").innerText = money(t.gst);
    $("#coTotal").innerText = money(t.total);
    const btn = $("#checkoutBtn");
    if (btn) btn.style.opacity = cart.length ? "1" : ".5";
}

$("#cart-items").addEventListener("click", e => {
    const q = e.target.closest("[data-qty]");
    if (q) { changeQty(q.dataset.id, Number(q.dataset.qty)); return; }
    const r = e.target.closest("[data-remove]");
    if (r) removeCart(r.dataset.remove);
});

$("#checkoutBtn").addEventListener("click", () => {
    if (!cart.length) return;
    location.hash = "#/checkout";
});

/* ---------- checkout ---------- */
function renderCheckout() {
    if (!cart.length) {
        toast("Your cart is empty. Add items first.");
        location.hash = "#/cart";
        return;
    }
    renderCart();
    const u = currentUser();
    if (u) {
        $("#coName").value = u.name;
        $("#coEmail").value = u.email;
        $("#coPhone").value = u.phone || "";
    }
}

$("#checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!cart.length) return;

    const t = cartTotals();
    const order = {
        id: "MKM" + Date.now().toString().slice(-7),
        items: cart.map(c => {
            const p = getProduct(c.id);
            return { id: c.id, name: p.name, price: p.price, qty: c.qty, img: p.img };
        }),
        sub: t.sub, gst: t.gst, total: t.total,
        customer: {
            name: $("#coName").value.trim(),
            phone: $("#coPhone").value.trim(),
            email: $("#coEmail").value.trim(),
            address: $("#coAddress").value.trim(),
            city: $("#coCity").value.trim()
        },
        payment: $("#coPayment").value,
        status: "Placed",
        date: new Date().toLocaleString("en-IN")
    };

    orders.unshift(order);
    saveOrders();
    cart = [];
    saveCart();
    updateCounts();
    e.target.reset();
    toast("Order placed! Sending it to the shop on WhatsApp...");
    window.open(waLink(ownerOrderMsg(order)), "_blank");
    location.hash = "#/orders/" + order.id;
});

/* ---------- orders / tracking ---------- */
function trackHTML(status) {
    const idx = ORDER_STATUSES.indexOf(status);
    const icons = ["fa-box", "fa-check", "fa-cog", "fa-store", "fa-home"];
    return ORDER_STATUSES.map((s, i) => {
        let cls = i <= idx ? "done" : "";
        if (i === idx && idx < ORDER_STATUSES.length - 1) cls = "done current";
        return `
        <div class="track-step ${cls}">
            <div class="track-dot"><i class="fas ${icons[i]}"></i></div>
            <div class="track-label"><b>${s}</b><span>${i <= idx ? "Completed" : "Pending"}</span></div>
        </div>`;
    }).join("");
}

function renderOrders(params) {
    const id = params[0];
    $("#ordersList").style.display = "none";
    $("#ordersSingle").style.display = "none";

    if (id) {
        const o = orders.find(x => x.id === id);
        if (o) {
            $("#ordId").innerText = o.id;
            $("#ordTotal").innerText = money(o.total);
            $("#ordWhatsApp").href = waLink(ownerOrderMsg(o));
            $("#trackBox").innerHTML = trackHTML(o.status);
            $("#ordersSingle").style.display = "block";
            return;
        }
    }

    const list = orders;
    $("#ordersList").style.display = "block";
    $("#orderList").innerHTML = list.length ? list.map(o => `
        <div class="order-card">
            <div class="oc-top">
                <b>${o.id}</b>
                <span class="status-tag ${o.status}">${o.status}</span>
            </div>
            <div class="oc-items">${o.items.map(i => esc(i.name) + " ×" + i.qty).join(", ")}</div>
            <div class="oc-top">
                <span>${o.date}</span>
                <b>${money(o.total)}</b>
            </div>
            <button class="tbtn" data-track="${o.id}">Track Order</button>
        </div>`).join("")
        : '<p class="empty-msg">No orders yet. <a href="#/products">Start shopping →</a></p>';
}

$("#orderList").addEventListener("click", e => {
    const t = e.target.closest("[data-track]");
    if (!t) return;
    location.hash = "#/orders/" + t.dataset.track;
});

/* ---------- reviews ---------- */
function renderReviews() {
    $("#reviewGrid").innerHTML = reviews.map(r => `
        <div class="review">
            <div class="stars">${starsHTML(r.stars)}</div>
            <p>“${esc(r.text)}”</p>
            <h4>- ${esc(r.name)}</h4>
            <div class="rv-prod">Purchased: ${esc(r.product)}</div>
        </div>`).join("");

    $("#rvProduct").innerHTML = '<option value="">Select product purchased</option>' +
        products.map(p => `<option>${esc(p.name)}</option>`).join("");
}

$("#starInput").addEventListener("click", e => {
    const s = e.target.closest("[data-star]");
    if (!s) return;
    rvStars = Number(s.dataset.star);
    $$("#starInput i").forEach(i => i.classList.toggle("on", Number(i.dataset.star) <= rvStars));
});

$("#reviewForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#rvName").value.trim();
    const prod = $("#rvProduct").value;
    const text = $("#rvText").value.trim();
    if (!name || !prod || !text) return;
    reviews.unshift({
        name: name, stars: rvStars, text: text, product: prod,
        date: new Date().toISOString().slice(0, 10)
    });
    saveReviews();
    renderReviews();
    if (adminLogged && parseHash().route === "admin") renderAdminReviews();
    e.target.reset();
    rvStars = 5;
    $$("#starInput i").forEach(i => i.classList.toggle("on", Number(i.dataset.star) <= rvStars));
    toast("Thank you! Your review has been added.");
});

/* ---------- gallery + lightbox ---------- */
let currentGalCat = "all";

function renderGallery(cat) {
    galList = cat === "all" ? GALLERY : GALLERY.filter(g => g.cat === cat);
    $("#galleryGrid").innerHTML = galList.length ? galList.map((g, i) => `
        <div class="gallery-item" data-gal-index="${i}">
            <img src="${g.img}" alt="${esc(g.cap)}" loading="lazy">
            <span>${esc(g.cap)}</span>
        </div>`).join("") : '<p class="empty-msg">No images in this category yet.</p>';
}

$("#galleryChips").addEventListener("click", e => {
    const c = e.target.closest(".chip");
    if (!c) return;
    $$("#galleryChips .chip").forEach(x => x.classList.remove("active"));
    c.classList.add("active");
    currentGalCat = c.dataset.gal;
    renderGallery(currentGalCat);
});

$("#galleryGrid").addEventListener("click", e => {
    const item = e.target.closest("[data-gal-index]");
    if (!item) return;
    galIndex = Number(item.dataset.galIndex);
    openLightbox();
});

function openLightbox() {
    const g = galList[galIndex];
    if (!g) return;
    $("#lbImg").src = g.img;
    $("#lbCap").innerText = g.cap;
    $("#lightbox").classList.add("active");
}
function lbMove(d) {
    galIndex = (galIndex + d + galList.length) % galList.length;
    openLightbox();
}
$("#lbPrev").addEventListener("click", e => { e.stopPropagation(); lbMove(-1); });
$("#lbNext").addEventListener("click", e => { e.stopPropagation(); lbMove(1); });

document.addEventListener("keydown", e => {
    if (e.key === "Escape") $("#lightbox").classList.remove("active");
    if ($("#lightbox").classList.contains("active")) {
        if (e.key === "ArrowRight") lbMove(1);
        if (e.key === "ArrowLeft") lbMove(-1);
    }
});

/* ==================================================
   LIVE GOLD & SILVER RATES
================================================== */
function goldForPurity(purity) {
    if (purity === "24K") return Math.round(rates.gold);
    if (purity === "22K") return Math.round(rates.gold * 22 / 24);
    if (purity === "18K") return Math.round(rates.gold * 18 / 24);
    return null;
}

function rateChangePctForDisplay() {
    /* change of current rate vs previous day's last record */
    if (!rates.gold) return null;
    const curGold = rates.gold, curSilver = rates.silver;
    const prev = rates.history
        .filter(r => r.date < todayStr())
        .sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!prev) return null;
    return {
        gold: prev.gold ? ((curGold - prev.gold) / prev.gold) * 100 : null,
        silver: prev.silver ? ((curSilver - prev.silver) / prev.silver) * 100 : null
    };
}

function showRateCard(periodKey) {
    let gold, silver, label, time = "", stamp;

    if (periodKey === "latest") {
        gold = rates.gold; silver = rates.silver;
        label = "Latest Rate";
        stamp = rates.updatedAt;
        time = rates.updatedAt ? fmtTime(new Date(rates.updatedAt)) : "";
    } else {
        const rec = rates.history.filter(r => r.period === periodKey).sort((a, b) => b.date.localeCompare(a.date))[0];
        if (rec) {
            gold = rec.gold; silver = rec.silver;
            label = periodKey === "AM" ? "🌅 Morning Rate" : "🌙 Evening Rate";
            time = rec.time || "";
        } else {
            gold = rates.gold; silver = rates.silver;
            label = periodKey === "AM" ? "🌅 Morning Rate (no record → latest)" : "🌙 Evening Rate (no record → latest)";
            time = rates.updatedAt ? fmtTime(new Date(rates.updatedAt)) : "";
        }
    }

if (!gold) { gold = null; silver = null; }

    const chg = rateChangePctForDisplay();

    $("#ratesUpdated").innerHTML = stamp
        ? "<i class='fas fa-clock'></i> Last Updated: <b>" + time + "</b> &nbsp;•&nbsp; " +
          new Date(stamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
          " &nbsp;<span style='color:#999'>(auto-syncs every hour)</span>"
        : (!rates.gold
            ? "No live rate yet — press Refresh with an internet connection."
            : "Rates saved. Press Refresh to sync live rates.");

    const cards = [
        { tag: "24K Gold", unit: "₹ / gram", val: gold !== null ? Math.round(gold) : null, dec: 0, chg: chg ? chg.gold : null },
        { tag: "22K Gold", unit: "₹ / gram", val: gold !== null ? Math.round(gold * 22 / 24) : null, dec: 0, chg: chg ? chg.gold : null },
        { tag: "18K Gold", unit: "₹ / gram", val: gold !== null ? Math.round(gold * 18 / 24) : null, dec: 0, chg: chg ? chg.gold : null },
        { tag: "Silver 999", unit: "₹ / gram", val: silver !== null ? silver : null, dec: 2, chg: chg ? chg.silver : null }
    ];

    $("#rateGrid").innerHTML = cards.map(c => {
        let chgHTML = "";
        if (c.chg !== null && c.chg !== undefined) {
            const up = c.chg >= 0;
            chgHTML = '<div class="rate-chg ' + (up ? "up" : "down") + '">' + (up ? "▲" : "▼") + " " +
                (Math.abs(c.chg) * 100).toFixed(1) + "%</div>";
        }
        return `
        <div class="rate-card">
            <div class="tag">${c.tag}</div>
            <div class="value">${c.val === null ? "—" : "₹" + fmtVal(c.val, c.dec)}</div>
            <div class="unit">${c.unit}</div>
            ${chgHTML}
        </div>`;
    }).join("");
}

function renderRates() {
    $("#periodLatest").classList.toggle("active", ratePeriodView === "latest");
    $("#periodAM").classList.toggle("active", ratePeriodView === "AM");
    $("#periodPM").classList.toggle("active", ratePeriodView === "PM");
    showRateCard(ratePeriodView);
    renderHistory();
}

$("#periodLatest").addEventListener("click", () => { ratePeriodView = "latest"; renderRates(); });
$("#periodAM").addEventListener("click", () => { ratePeriodView = "AM"; renderRates(); });
$("#periodPM").addEventListener("click", () => { ratePeriodView = "PM"; renderRates(); });

$("#historyTabs").addEventListener("click", e => {
    const c = e.target.closest("[data-h]");
    if (!c) return;
    $$("#historyTabs .chip").forEach(x => x.classList.remove("active"));
    c.classList.add("active");
    historyWindow = c.dataset.h;
    renderHistory();
});

function historyDataSet() {
    const today = todayStr();
    const yest = dateStr(dayOffset(1));

    if (historyWindow === "today") {
        return rates.history.filter(r => r.date === today).sort((a, b) => (a.period + a.time).localeCompare(b.period + b.time));
    }
    if (historyWindow === "yesterday") {
        return rates.history.filter(r => r.date === yest).sort((a, b) => (a.period + a.time).localeCompare(b.period + b.time));
    }
    const days = historyWindow === "7" ? 7 : 30;
    const cutoff = dateStr(dayOffset(days));
    const byDay = {};
    rates.history.filter(r => r.date >= cutoff).forEach(r => {
        if (!byDay[r.date]) byDay[r.date] = { dates: [], golds: [], silvers: [] };
        byDay[r.date].golds.push(r.gold);
        byDay[r.date].silvers.push(r.silver);
    });
    return Object.keys(byDay).sort().map(d => {
        const g = byDay[d];
        return {
            date: d,
            gold: g.golds.reduce((a, b) => a + b, 0) / g.golds.length,
            silver: g.silvers.reduce((a, b) => a + b, 0) / g.silvers.length,
            note: g.golds.length + " update(s)"
        };
    });
}

function renderHistory() {
    const data = historyDataSet();
    const list = $("#historyList");
    const chart = $("#barChart");

    if (!data.length) {
        list.innerHTML = '<p class="empty-msg">No rate history for this period yet.</p>';
        chart.innerHTML = "";
        return;
    }

    list.innerHTML = data.slice().reverse().map(r => `
        <div class="history-row">
            <span><b>${r.date}</b>${r.note ? " <em>(" + r.note + ")</em>" : ""}</span>
            <span>Gold 24K: <b>₹${fmtVal(r.gold)}</b></span>
            <span>Silver: <b>₹${fmtVal(r.silver, 2)}</b></span>
        </div>`).join("");

    const max = Math.max(...data.map(d => d.gold), 1);
    chart.innerHTML = data.map(d => {
        const h = Math.max(3, Math.round((d.gold / max) * 125));
        return `<div class="bar" style="height:${h}px" title="${d.date}: ₹${fmtVal(d.gold)}"><small>₹${fmtVal(d.gold)}</small><span class="bar-wa">${d.date.slice(5)}</span></div>`;
    }).join("");
}

async function fetchLiveRates(silent) {
    try {
        const [g, s, cur] = await Promise.all([
            fetch("https://api.gold-api.com/price/XAU").then(r => r.json()),
            fetch("https://api.gold-api.com/price/XAG").then(r => r.json()),
            fetch("https://open.er-api.com/v6/latest/USD").then(r => r.json())
        ]);
        const inr = cur && cur.rates && cur.rates.INR;
        if (!g.price || !s.price || !inr) throw new Error("bad api");
        const T_OZ = 31.1034768;
        const gold24 = g.price * inr / T_OZ;
        const silver = s.price * inr / T_OZ;
        setRates(gold24, silver);
        if (!silent) toast("Live rates updated");
        updateLiveStrip();
        if (parseHash().route === "rates") renderRates();
        if (adminLogged && parseHash().route === "admin") renderAdminRates();
        return true;
    } catch (err) {
        if (!silent) toast("Offline – showing last saved rate (indicative)");
        return false;
    }
}

function setRates(gold24, silver) {
    const now = new Date();
    rates.gold = gold24;
    rates.silver = silver;
    rates.period = currentPeriod();
    rates.updatedAt = now.toISOString();
    rates.history.push({
        date: todayStr(),
        period: currentPeriod(),
        gold: Math.round(gold24),
        silver: Math.round(silver * 100) / 100,
        time: fmtTime(now)
    });
    saveRates();
}

$("#rateRefresh").addEventListener("click", () => { fetchLiveRates(false); });

function updateLiveStrip() {
    const ok = rates.gold > 0;
    $("#stripGold24").innerText = ok ? "₹" + fmtVal(rates.gold) : "—";
    $("#stripGold22").innerText = ok ? "₹" + fmtVal(goldForPurity("22K")) : "—";
    $("#stripGold18").innerText = ok ? "₹" + fmtVal(goldForPurity("18K")) : "—";
    $("#stripSilver").innerText = ok ? "₹" + fmtVal(rates.silver, 2) : "—";
}

/* ==================================================
   CALCULATOR
================================================== */
function calcGold() {
    const purity = Number($("#calcPurity").value);
    const weight = Number($("#calcWeight").value) || 0;
    const rate = Number($("#calcRate").value) || 0;
    const makingPct = Number($("#calcMaking").value) || 0;
    const gstPct = Number($("#calcGst").value) || 0;

    const goldValue = weight * rate * (purity / 24);
    const making = goldValue * makingPct / 100;
    const gst = (goldValue + making) * gstPct / 100;
    const total = goldValue + making + gst;

    $("#outGold").innerText = money(Math.round(goldValue));
    $("#outMaking").innerText = money(Math.round(making));
    $("#outGst").innerText = money(Math.round(gst));
    $("#outTotal").innerText = money(Math.round(total));

    const txt = "Hi, I'd like to confirm the estimated gold price: " + money(Math.round(total)) +
        " (" + purity + "K, " + weight + "g). Please share today's final rate.";
    $("#calcWhatsApp").href = waLink(txt);
}

function renderCalculator() {
    const rate = Number($("#calcRate").value);
    if (!rate || rate <= 0) $("#calcRate").value = rates.gold ? Math.round(rates.gold) : "";
    $("#calcLiveRate").innerText = rates.gold
        ? "24K ₹" + fmtVal(rates.gold) + " /g • 22K ₹" + fmtVal(goldForPurity("22K")) + " /g"
        : "Live rate not synced yet — refresh when online.";
    calcGold();
}

["calcPurity", "calcWeight", "calcRate", "calcMaking", "calcGst"].forEach(id => {
    $("#" + id).addEventListener("input", calcGold);
});

$("#updateRateBtn").addEventListener("click", () => {
    if (!rates.gold) { toast("No live rate yet — check your internet connection."); return; }
    $("#calcRate").value = Math.round(rates.gold);
    toast("Synced with live 24K rate: ₹" + fmtVal(rates.gold) + "/g");
    calcGold();
});

/* ==================================================
   AUTH
================================================== */
function switchAuth(tab) {
    $$(".auth-tabs button").forEach(b => b.classList.toggle("active", b.dataset.auth === tab));
    $("#loginForm").style.display = tab === "login" ? "block" : "none";
    $("#signupForm").style.display = tab === "signup" ? "block" : "none";
    $("#authTitle").innerText = tab === "login" ? "Login" : "Sign Up";
}
$$(".auth-tabs button").forEach(b => b.addEventListener("click", () => switchAuth(b.dataset.auth)));

$("#signupForm").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#suEmail").value.trim().toLowerCase();
    if (users.some(u => u.email === email)) { toast("Account already exists. Please login."); return; }
    if ($("#suPass").value.length < 4) { toast("Password must be at least 4 characters"); return; }

    const user = {
        no: nextUserNo(),
        name: $("#suName").value.trim(),
        phone: $("#suPhone").value.trim(),
        email: email,
        pass: $("#suPass").value,
        joined: new Date().toLocaleDateString("en-IN")
    };
    users.push(user);
    saveUsers();
    session = email;
    store("mkm_session", session);
    e.target.reset();
    toast("Welcome to MKM Jewellers, " + user.name + "!");
    location.hash = "#/profile";
});

$("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#lgEmail").value.trim().toLowerCase();
    const user = users.find(u => u.email === email && u.pass === $("#lgPass").value);
    if (!user) { toast("Invalid email or password"); return; }
    session = email;
    store("mkm_session", session);
    e.target.reset();
    toast("Logged in as " + user.name);
    location.hash = "#/profile";
});

function logout() {
    session = null;
    store("mkm_session", null);
    toast("Logged out");
    renderProfile();
    location.hash = "#/";
}

$("#logoutBtn").addEventListener("click", logout);

/* ---------- profile ---------- */
function renderProfile() {
    const u = currentUser();
    const notLogged = $("#profileNotLogged");
    const logged = $("#profileLogged");
    if (!u) {
        if (notLogged) notLogged.style.display = "block";
        if (logged) logged.style.display = "none";
        return;
    }
    if (notLogged) notLogged.style.display = "none";
    if (logged) logged.style.display = "block";

    $("#profName").innerText = u.name;
    $("#profEmail").innerText = u.email;
    $("#profPhone").innerText = u.phone || "";

    const myOrders = orders.filter(o => o.customer.email === u.email);
    $("#profileOrders").innerHTML = myOrders.length ? myOrders.map(o => `
        <div class="order-card">
            <div class="oc-top">
                <b>${o.id}</b>
                <span class="status-tag">${o.status}</span>
            </div>
            <div class="oc-items">${o.items.map(i => esc(i.name) + " ×" + i.qty).join(", ")}</div>
            <div class="oc-top">
                <span>${o.date}</span>
                <b>${money(o.total)}</b>
            </div>
            <button class="tbtn" data-track="${o.id}">Track Order</button>
        </div>`).join("")
        : '<p class="empty-msg">No orders yet. <a href="#/products">Start shopping →</a></p>';
}

$("#profileOrders").addEventListener("click", e => {
    const t = e.target.closest("[data-track]");
    if (!t) return;
    location.hash = "#/orders/" + t.dataset.track;
});

/* ==================================================
   ADMIN
================================================== */
function renderAdmin() {
    $("#adminLogin").style.display = adminLogged ? "none" : "block";
    $("#adminPanel").style.display = adminLogged ? "block" : "none";
    if (adminLogged) renderAdminAll();
}
$("#adminLoginForm").addEventListener("submit", e => {
    e.preventDefault();
    if ($("#adUser").value.trim() === "admin" && $("#adPass").value === "admin123") {
        adminLogged = true;
        toast("Admin login successful");
        renderAdmin();
        renderAdminAll();
    } else {
        toast("Wrong credentials. Use admin / admin123");
    }
});
$("#adminLogout").addEventListener("click", () => {
    adminLogged = false;
    renderAdmin();
});

$("#adminTabs").addEventListener("click", e => {
    const t = e.target.closest("[data-tab]");
    if (!t) return;
    $$("#adminTabs .chip").forEach(c => c.classList.remove("active"));
    t.classList.add("active");
    ["rates", "products", "orders", "customers", "reviews"].forEach(x => {
        $("#tab-" + x).style.display = x === t.dataset.tab ? "block" : "none";
    });
});

function renderAdminAll() {
    renderAdminRates();
    renderAdminProducts();
    renderAdminOrders();
    renderAdminCustomers();
    renderAdminReviews();
}

function renderAdminRates() {
    $("#adGold24").value = rates.gold ? Math.round(rates.gold) : "";
    $("#adSilver").value = rates.gold ? Math.round(rates.silver * 100) / 100 : "";
    $("#adPeriod").value = (rates.period === "AM" ? "AM 🌅 Morning" : "PM 🌙 Evening");
    $("#adRatesInfo").innerHTML = rates.updatedAt
        ? "Current: 24K ₹" + fmtVal(rates.gold) + " /g • Silver ₹" + fmtVal(rates.silver, 2) + " /g • Last updated " +
          fmtTime(new Date(rates.updatedAt)) + " (" + new Date(rates.updatedAt).toLocaleDateString("en-IN") + ")" +
          "<br>Rates auto-sync every hour via IBJA-style API when online."
        : "No live rate yet — Fetch or Save a rate to begin.";
}

function renderAdminProducts() {
    $("#adminProducts").innerHTML = products.length ? `
        <table class="admin-table">
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Metal</th><th>Purity</th><th>Price</th><th>Actions</th></tr>
            ${products.map(p => `
            <tr>
                <td><img src="${p.img}" alt=""></td>
                <td>${esc(p.name)}</td>
                <td>${p.category}</td>
                <td>${p.metal}</td>
                <td>${p.purity}</td>
                <td>${money(p.price)}</td>
                <td>
                    <button class="tbtn" data-edit="${p.id}">Edit</button>
                    <button class="tbtn del" data-del="${p.id}">Delete</button>
                </td>
            </tr>`).join("")}
        </table>
        <p style="margin-top:12px"><button class="tbtn" id="resetProducts">↺ Reset to original products</button></p>`
        : '<p class="admin-empty">No products.</p>';
}

function renderAdminOrders() {
    $("#adminOrders").innerHTML = orders.length ? `
        <table class="admin-table">
            <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr>
            ${orders.map(o => `
            <tr>
                <td>${o.id}</td>
                <td>${esc(o.customer.name)}<br><small>${esc(o.customer.phone)}</small></td>
                <td>${o.items.map(i => esc(i.name) + " ×" + i.qty).join("<br>")}</td>
                <td>${money(o.total)}</td>
                <td>${o.date}</td>
                <td>
                    <select data-order-status="${o.id}">
                        ${ORDER_STATUSES.map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
                    </select>
                </td>
            </tr>`).join("")}
        </table>` : '<p class="admin-empty">No orders yet.</p>';
}

function renderAdminCustomers() {
    ensureUserNumbers();
    const sortedUsers = users.slice().sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));
    const userTable = sortedUsers.length ? `
        <table class="admin-table">
            <tr><th>S.No</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Orders</th></tr>
            ${sortedUsers.map(u => `
            <tr>
                <td>${u.no || "-"}</td>
                <td>${esc(u.name)}</td>
                <td>${esc(u.email)}</td>
                <td>${esc(u.phone || "-")}</td>
                <td>${u.joined || "-"}</td>
                <td>${orders.filter(o => o.customer.email === u.email).length}</td>
            </tr>`).join("")}
        </table>` : '<p class="admin-empty">No registered customers yet.</p>';

    const apptTable = `
        <h4 style="margin-top:18px">📅 Appointments (${appointments.length})</h4>
        ${appointments.length ? `
        <table class="admin-table">
            <tr><th>Name</th><th>Phone</th><th>Date</th><th>Time</th><th>Type</th></tr>
            ${appointments.map(a => `<tr>
                <td>${esc(a.name)}</td><td>${esc(a.phone)}</td>
                <td>${a.date}</td><td>${a.time}</td><td>${a.type}</td>
            </tr>`).join("")}
        </table>` : '<p class="admin-empty">No appointments yet.</p>'}`;

    $("#adminCustomers").innerHTML = userTable + apptTable;
}

function renderAdminReviews() {
    $("#adminReviews").innerHTML = reviews.length ? `
        <table class="admin-table">
            <tr><th>Customer</th><th>Rating</th><th>Review</th><th>Product</th><th>Action</th></tr>
            ${reviews.map((r, i) => `
            <tr>
                <td>${esc(r.name)}</td>
                <td>${starsHTML(r.stars)}</td>
                <td>${esc(r.text)}</td>
                <td>${esc(r.product)}</td>
                <td><button class="tbtn del" data-delreview="${i}">Delete</button></td>
            </tr>`).join("")}
        </table>` : '<p class="admin-empty">No reviews.</p>';
}

/* admin events */
$("#adminProducts").addEventListener("click", e => {
    const ed = e.target.closest("[data-edit]");
    if (ed) {
        const p = getProduct(ed.dataset.edit);
        $("#pfId").value = p.id;
        $("#pfName").value = p.name;
        $("#pfCategory").value = p.category;
        $("#pfMetal").value = p.metal;
        $("#pfPurity").value = p.purity;
        $("#pfOccasion").value = p.occasion;
        $("#pfWeight").value = p.weight;
        $("#pfPrice").value = p.price;
        $("#pfImg").value = p.img;
        $("#pfNew").checked = !!p.isNew;
        $("#pfBest").checked = !!p.isBest;
        $("#pfSubmit").innerText = "Update Product";
        $("#pfCancel").style.display = "inline-block";
        $("#tab-products").scrollIntoView({ behavior: "smooth" });
        return;
    }
    const dl = e.target.closest("[data-del]");
    if (dl) {
        if (!confirm("Delete this product?")) return;
        products = products.filter(p => p.id !== dl.dataset.del);
        saveProducts();
        renderAdminProducts();
        renderReviews();
        renderCurrentGrids();
        toast("Product deleted");
        return;
    }
    if (e.target.id === "resetProducts") {
        products = SEED_PRODUCTS.slice();
        saveProducts();
        renderAdminProducts();
        renderReviews();
        renderCurrentGrids();
        toast("Products reset to original");
    }
});

$("#productForm").addEventListener("submit", e => {
    e.preventDefault();
    const id = $("#pfId").value;
    const data = {
        name: $("#pfName").value.trim(),
        category: $("#pfCategory").value,
        metal: $("#pfMetal").value,
        purity: $("#pfPurity").value,
        occasion: $("#pfOccasion").value,
        weight: Number($("#pfWeight").value),
        price: Number($("#pfPrice").value),
        img: $("#pfImg").value.trim() || "ring.jpg",
        isNew: $("#pfNew").checked,
        isBest: $("#pfBest").checked
    };

    if (id) {
        const p = getProduct(id);
        Object.assign(p, data);
        if (!p.images || !p.images.includes(p.img)) p.images = [p.img];
        toast("Product updated");
    } else {
        products.unshift(Object.assign({
            id: "p" + Date.now(),
            images: [data.img],
            seq: Date.now(),
            desc: data.name + " – crafted with trust at MKM Jewellers. BIS hallmarked quality."
        }, data));
        toast("Product added");
    }
    saveProducts();
    renderAdminProducts();
    renderReviews();
    renderCurrentGrids();
    e.target.reset();
    $("#pfId").value = "";
    $("#pfSubmit").innerText = "Add Product";
    $("#pfCancel").style.display = "none";
});

$("#pfCancel").addEventListener("click", () => {
    $("#productForm").reset();
    $("#pfId").value = "";
    $("#pfSubmit").innerText = "Add Product";
    $("#pfCancel").style.display = "none";
});

$("#adminOrders").addEventListener("change", e => {
    const sel = e.target.closest("[data-order-status]");
    if (!sel) return;
    const o = orders.find(x => x.id === sel.dataset.orderStatus);
    if (o) { o.status = sel.value; saveOrders(); toast(o.id + " → " + o.status); }
});

$("#adminReviews").addEventListener("click", e => {
    const d = e.target.closest("[data-delreview]");
    if (!d) return;
    reviews.splice(Number(d.dataset.delreview), 1);
    saveReviews();
    renderAdminReviews();
    renderReviews();
    toast("Review deleted");
});

/* admin rates */
$("#adSaveRates").addEventListener("click", () => {
    const gold = Number($("#adGold24").value);
    const silver = Number($("#adSilver").value);
    if (!gold || gold <= 0 || !silver || silver <= 0) { toast("Enter valid rates"); return; }
    setRates(gold, silver);
    $("#adPeriod").value = (rates.period === "AM" ? "AM 🌅 Morning" : "PM 🌙 Evening");
    toast("Rates updated (" + rates.period + ")");
    renderAdminRates();
    updateLiveStrip();
});

$("#adFetchRates").addEventListener("click", async () => {
    toast("Fetching live rates...");
    const ok = await fetchLiveRates(false);
    if (ok) renderAdminRates();
});

$("#adSeedHistory").addEventListener("click", () => {
    if (!rates.gold) { toast("Fetch live rate first, then seed history."); return; }
    let g = rates.gold || RATE_DEFAULTS.gold;
    let s = rates.silver || RATE_DEFAULTS.silver;
    for (let i = 30; i >= 1; i--) {
        const d = dayOffset(i);
        g = Math.round(g * (1 + (Math.random() - 0.5) * 0.02));
        s = Math.round(s * (1 + (Math.random() - 0.5) * 0.02) * 100) / 100;
        ["AM", "PM"].forEach(p => {
            rates.history.push({
                date: dateStr(d), period: p,
                gold: g, silver: s,
                time: p === "AM" ? "9:30 AM" : "6:30 PM"
            });
        });
    }
    saveRates();
    toast("Demo history seeded for 30 days");
    renderAdminRates();
    if (parseHash().route === "rates") renderRates();
});

/* ==================================================
   APPOINTMENT & CONTACT
================================================== */
$("#appointmentForm").addEventListener("submit", e => {
    e.preventDefault();
    const ap = {
        name: $("#apName").value.trim(),
        phone: $("#apPhone").value.trim(),
        date: $("#apDate").value,
        time: $("#apTime").value,
        type: $("#apType").value,
        msg: $("#apMsg").value.trim()
    };
    appointments.push(ap);
    store("mkm_appointments", appointments);
    e.target.reset();
    toast("Appointment booked! We'll call you on " + ap.phone + " to confirm.");
});

$("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    toast("Message sent! We'll get back to you soon.");
});

/* ==================================================
   ANNOUNCEMENT + NAV
================================================== */
let annIndex = 0;
setInterval(() => {
    annIndex = (annIndex + 1) % ANNOUNCEMENTS.length;
    $("#announceText").innerText = ANNOUNCEMENTS[annIndex];
}, 4000);

$("#menuBtn").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$("#mainNav").addEventListener("click", e => {
    if (e.target.tagName === "A") $("#mainNav").classList.remove("open");
});

/* ==================================================
   COUNTS + INIT
================================================== */
function updateCounts() {
    $("#cart-count").innerText = cart.reduce((s, c) => s + c.qty, 0);
    $("#wish-count").innerText = wishlist.length;
}

function init() {
    initFilters();
    renderReviews();
    renderGallery("all");
    renderCart();
    updateCounts();
    updateLiveStrip();

    const d = new Date();
    const apDate = $("#apDate");
    if (apDate) apDate.min = d.toISOString().slice(0, 10);

    if (session && !currentUser()) { session = null; store("mkm_session", null); }

    /* try live fetch once on load (quiet), then every hour */
    setTimeout(() => fetchLiveRates(true), 2500);
    setInterval(() => fetchLiveRates(true), 3600000);
}