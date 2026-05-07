const apiKey = "";

// --- DATA ---
let products = JSON.parse(localStorage.getItem('bf_data_v4')) || [
    {
        id: 1,
        name: 'K2 Plus Industrial',
        category: 'IMPRESSORAS',
        price: 12900,
        image: '',
        icon: '🖨️',
        badge: 'badge-hot',
        badgeText: 'ELITE',
        isBestSeller: true,
        description: 'Precisão extrema para indústria.'
    },
    {
        id: 2,
        name: 'Filamento Carbon Pro',
        category: 'FILAMENTOS',
        price: 349.90,
        image: '',
        icon: '🧵',
        badge: 'badge-sale',
        badgeText: '10% OFF',
        isBestSeller: true,
        description: 'Resistência mecânica insuperável.'
    }
];

let categories = JSON.parse(localStorage.getItem('bf_cats_v4')) || [
    'IMPRESSORAS',
    'FILAMENTOS',
    'ACESSORIOS'
];

let cart = [];

let appearance = JSON.parse(localStorage.getItem('bf_style_v4')) || {
    name: 'BESTFORGE 3D',
    heroTitle: 'FORJANDO SUAS IDEIAS',
    banner: ''
};

let currentEditorId = null;

// --- IA FUNCTIONS ---
async function callGemini(
    prompt,
    system = "Você é um especialista em impressão 3D profissional."
) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: {
                        parts: [{ text: system }]
                    }
                })
            }
        );

        const res = await response.json();

        return (
            res.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sem resposta."
        );

    } catch (e) {
        return "Erro IA.";
    }
}

// --- RENDER ---
function renderSite() {
    const top5 = products.filter(p => p.isBestSeller).slice(0, 5);
    const top7 = products.filter(p => !p.isBestSeller).slice(0, 7);

    renderGrid('bestSellersGrid', top5);
    renderGrid('topProductsGrid', top7);
    renderGrid('allProductsGrid', products);

    renderCategoryTabs();
}

function renderGrid(id, list) {
    const grid = document.getElementById(id);

    if (!grid) return;

    grid.innerHTML = list.map(p => `
        <div onclick="viewProductDetail(${p.id})"
            class="product-card bg-white rounded-[32px] p-3 border border-slate-100 flex flex-col h-full shadow-sm hover:shadow-2xl">

            <div class="img-container relative h-52 bg-slate-50 rounded-[28px] mb-4 flex items-center justify-center overflow-hidden">

                ${p.badge
                    ? `<span class="absolute top-4 left-4 px-3 py-1 text-[8px] font-black rounded-full uppercase italic ${p.badge}">
                        ${p.badgeText || 'DESTAQUE'}
                    </span>`
                    : ''
                }

                ${p.image
                    ? `<img src="${p.image}">`
                    : `<span class="text-5xl opacity-40 grayscale">${p.icon}</span>`
                }

            </div>

            <div class="px-4 pb-6 flex flex-col flex-1 text-left">

                <span class="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-2">
                    ${p.category}
                </span>

                <h4 class="font-black text-slate-900 text-sm mb-3 uppercase italic line-clamp-1">
                    ${p.name}
                </h4>

                <div class="mt-auto flex justify-between items-end">
                    <span class="text-xl font-black text-slate-900 tracking-tighter">
                        R$ ${p.price.toLocaleString()}
                    </span>

                    <button onclick="event.stopPropagation(); addToCart(${p.id})"
                        class="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition shadow-lg">
                        🛒
                    </button>
                </div>

            </div>
        </div>
    `).join('');
}

function renderCategoryTabs() {
    const tabs = document.getElementById('mainCategoryTabs');

    let html = `
        <button onclick="filterAll('all', this)"
            class="cat-btn px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl transition uppercase text-[10px] tracking-widest italic">
            Tudo
        </button>
    `;

    categories.forEach(cat => {
        html += `
            <button onclick="filterAll('${cat}', this)"
                class="cat-btn px-10 py-4 rounded-2xl bg-white text-slate-500 border border-slate-100 font-black hover:border-indigo-600 transition uppercase text-[10px] tracking-widest italic">
                ${cat}
            </button>
        `;
    });

    tabs.innerHTML = html;
}

// --- INTERFACE ---
function toggleCart() {
    document.getElementById('cartDrawer')
        .classList.toggle('translate-x-full');

    document.getElementById('cartOverlay')
        .classList.toggle('hidden');

    renderCart();
}

function addToCart(id) {
    cart.push(products.find(i => i.id === id));

    document.getElementById('cartBadge').textContent = cart.length;

    showToast("ITEM FORJADO!");
}

function renderCart() {
    let sum = 0;

    document.getElementById('cartItemsList').innerHTML = cart.map((p, i) => {
        sum += p.price;

        return `
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">

                <span class="text-[10px] font-black uppercase italic truncate w-40">
                    ${p.name}
                </span>

                <button onclick="cart.splice(${i},1);renderCart();"
                    class="text-red-400">
                    ✕
                </button>

            </div>
        `;
    }).join('');

    document.getElementById('cartTotalDisplay')
        .textContent = `R$ ${sum.toLocaleString()}`;
}

function viewProductDetail(id) {
    const p = products.find(i => i.id === id);

    document.getElementById('detailName').textContent = p.name;
    document.getElementById('detailCategory').textContent = p.category;
    document.getElementById('detailPrice').textContent = `R$ ${p.price.toLocaleString()}`;
    document.getElementById('detailDescription').textContent = p.description;

    document.getElementById('detailImageContainer').innerHTML =
        p.image
            ? `<img src="${p.image}">`
            : `<span class="text-9xl grayscale opacity-20">${p.icon}</span>`;

    document.getElementById('productDetailPage')
        .classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');

    document.body.style.overflow = 'hidden';
}

function closeProductDetail() {
    document.getElementById('productDetailPage')
        .classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');

    document.body.style.overflow = 'auto';
}

function showToast(message) {
    const toast = document.getElementById('toast');

    toast.textContent = message;

    toast.classList.add('opacity-100', 'top-28');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'top-28');
    }, 3000);
}

function filterAll(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-white', 'text-slate-500');
    });

    btn.classList.add('bg-indigo-600', 'text-white');
    btn.classList.remove('bg-white', 'text-slate-500');

    const filtered =
        cat === 'all'
            ? products
            : products.filter(i => i.category === cat);

    renderGrid('allProductsGrid', filtered);
}

function applyAppearance() {
    document.getElementById('displayStoreName').textContent =
        appearance.name || 'BESTFORGE 3D';

    document.getElementById('displayHeroTitle').textContent =
        appearance.heroTitle || 'FORJANDO SUAS IDEIAS';

    if (appearance.banner) {
        document.getElementById('heroSection').style.backgroundImage =
            `url('${appearance.banner}')`;
    }
}

window.onload = () => {
    applyAppearance();
    renderSite();
};
