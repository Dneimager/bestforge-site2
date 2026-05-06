
let editingId = null;

function toggleAdmin(){
    document.getElementById("adminPanel").classList.toggle("open");
    renderAdminProducts();
}

function saveProducts(){
    localStorage.setItem("products", JSON.stringify(products));
}

function loadProducts(){
    const saved = localStorage.getItem("products");
    if(saved){
        products = JSON.parse(saved);
    }
}

function saveProduct(){
    const name = document.getElementById("prodName").value;
    const price = parseFloat(document.getElementById("prodPrice").value);
    const category = document.getElementById("prodCategory").value;

    if(!name || !price) return alert("Preencha tudo");

    const product = {
        id: Date.now(),
        name,
        price,
        category,
        icon:"📦"
    };

    products.push(product);

    saveProducts();
    renderProducts(products);
    renderAdminProducts();

    showToast("Produto salvo!");
}

function renderAdminProducts(){
    const list = document.getElementById("adminProductsList");

    list.innerHTML = products.map(p=>`
        <div>
            ${p.name} - R$${p.price}
            <button onclick="deleteProduct(${p.id})">X</button>
        </div>
    `).join("");
}

function deleteProduct(id){
    products = products.filter(p=>p.id!==id);
    saveProducts();
    renderProducts(products);
    renderAdminProducts();
}

function showToast(msg){
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");

    setTimeout(()=>t.classList.remove("show"),2000);
}

window.addEventListener("load", ()=>{
    loadProducts();
    renderProducts(products);
});
