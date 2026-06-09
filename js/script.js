document.addEventListener("DOMContentLoaded", () => {
    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;
    let filteredProducts = [];

    // DOM элементы
    const productList = document.getElementById("productList");
    const pagination = document.getElementById("pagination");
    const animalFilter = document.getElementById("animalFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const priceValue = document.getElementById("priceValue");
    const sortFilter = document.getElementById("sortFilter");
    const productsCount = document.getElementById("productsCount");
    const cartCount = document.getElementById("cartCount");
    const productModal = document.getElementById("productModal");


    const products = [
        { id: 1, name: "Корм для собак Premium", animal: "dog", category: "food", price: 1200, image: "images/dog-food.jpg" },
        { id: 2, name: "Игрушка для кошек Мячик", animal: "cat", category: "toys", price: 500, image: "images/cat-toy.jpg" },
        { id: 3, name: "Намордник для бульдога", animal: "dog", category: "clothes", price: 800, image: "images/dog-muzzle.jpeg" },
        { id: 4, name: "Домик для кошек", animal: "cat", category: "toys", price: 3500, image: "images/cat-house.png" },
        { id: 5, name: "Лакомства для собак", animal: "dog", category: "food", price: 650, image: "images/dog-treats.jpg" },
        { id: 6, name: "Миска для животных", animal: "dog", category: "toys", price: 900, image: "images/pet-bowl.jpg" },
        { id: 7, name: "Корм для кошек", animal: "cat", category: "food", price: 1100, image: "images/cat-food.png" },
        { id: 8, name: "Лежанка для собак", animal: "dog", category: "clothes", price: 4200, image: "images/dog-bed.png" },
        { id: 9, name: "Игровой тоннель для кошек", animal: "cat", category: "toys", price: 2700, image: "images/cat-tunnel.png" },
        { id: 10, name: "Поводок для собак", animal: "dog", category: "clothes", price: 1400, image: "images/dog-leash.jpg" },
        { id: 11, name: "Когтеточка", animal: "cat", category: "toys", price: 3100, image: "images/cat-scratcher.png" },
        { id: 12, name: "Костюм повара для собак", animal: "dog", category: "clothes", price: 4800, image: "images/dog-clothes.png" },
        { id: 13, name: "Костюм повара для собак", animal: "dog", category: "clothes", price: 4800, image: "images/dog-clothes.png" },
        { id: 14, name: "Костюм повара для собак", animal: "dog", category: "clothes", price: 4800, image: "images/dog-clothes.png" },
        { id: 15, name: "Костюм повара для собак", animal: "dog", category: "clothes", price: 4800, image: "images/dog-clothes.png" },
        { id: 16, name: "Костюм повара для собак", animal: "dog", category: "clothes", price: 4800, image: "images/dog-clothes.png" }
    ];

    // Функции корзины
    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.textContent = count;
    }

    window.addToCart = function(id) {
        const cart = getCart();
        const product = products.find(p => p.id === id);
        const item = cart.find(i => i.id === id);

        if (item) {
            item.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart);
        alert("Товар добавлен в корзину!");
    };

    // Фильтрация
    function filterProducts() {
        const maxPrice = Number(priceFilter.value);
        priceValue.textContent = maxPrice.toLocaleString();

        filteredProducts = products.filter(p =>
            (animalFilter.value === "all" || p.animal === animalFilter.value) &&
            (categoryFilter.value === "all" || p.category === categoryFilter.value) &&
            p.price <= maxPrice
        );

        // Сортировка
        const sort = sortFilter ? sortFilter.value : 'name';
        if (sort === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (productsCount) productsCount.textContent = `${filteredProducts.length} товаров`;
        currentPage = 1;
        displayProducts();
    }

    // Отображение товаров
    function displayProducts() {
        productList.innerHTML = "";
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageItems = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

        pageItems.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-badge">${product.animal === 'dog' ? '🐕' : '🐱'}</div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">${product.price.toLocaleString()} ₽</div>
                    <div style="margin-top: 0.5rem;">
                        <button onclick="addToCart(${product.id})" class="btn-primary" style="width: 100%; margin-bottom: 0.5rem;">
                            В корзину
                        </button>
                    </div>
                </div>
            `;
            card.onclick = (e) => {
                if (!e.target.closest('button')) openProductModal(product);
            };
            productList.appendChild(card);
        });

        renderPagination();
    }

    function renderPagination() {
        pagination.innerHTML = "";
        const pages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

        for (let i = 1; i <= pages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === currentPage) btn.classList.add("active");
            btn.onclick = () => {
                currentPage = i;
                displayProducts();
            };
            pagination.appendChild(btn);
        }
    }

    // Модальное окно
    function openProductModal(product) {
        document.getElementById("modalTitle").textContent = product.name;
        document.getElementById("modalImage").src = product.image;
        document.getElementById("modalImage").alt = product.name;
        document.getElementById("modalDescription").textContent = "Качественный товар для вашего питомца.";
        document.getElementById("modalPrice").textContent = product.price.toLocaleString() + " ₽";

        document.getElementById("modalAddBtn").onclick = () => addToCart(product.id);
        productModal.style.display = "block";
    }

    window.closeProductModal = function() {
        productModal.style.display = "none";
    };

    window.resetFilters = function() {
        animalFilter.value = 'all';
        categoryFilter.value = 'all';
        priceFilter.value = 15000;
        if (sortFilter) sortFilter.value = 'name';
        filterProducts();
    };

    window.scrollToProducts = function() {
        document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
    };

    // События
    animalFilter.onchange = filterProducts;
    categoryFilter.onchange = filterProducts;
    priceFilter.oninput = filterProducts;
    if (sortFilter) sortFilter.onchange = filterProducts;

    // Старт
    updateCartCount();
    filterProducts();
});
