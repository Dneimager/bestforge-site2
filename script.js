
let products = [
    {id:1,name:"RTX 4090",category:"GPU",price:12000,icon:"🎮"},
    {id:2,name:"Ryzen 9",category:"CPU",price:4000,icon:"💻"}
];

let cart = [];

function init(){
    renderProducts(products);
}

function renderProducts(list){
    const grid = document.getElementById("productsGrid");

    grid.innerHTML = list.map(p=>`
        <div class="product-card">
            <h3>${p.icon} ${p.name}</h3>
            <p>${p.category}</p>
            <strong>R$ ${p.price}</strong>
            <button onclick="addToCart(${p.id})">Comprar</button>
        </div>
    `).join("");
}

function addToCart(id){
    cart.push(id);
    document.getElementById("cartCount").textContent = cart.length;
}

function filterProducts(){
    const term = document.getElementById("searchInput").value.toLowerCase();
    const filtered = products.filter(p=>p.name.toLowerCase().includes(term));
    renderProducts(filtered);
}

window.onload = init;
