document.addEventListener("DOMContentLoaded", function() {
    // DOM элементы
    const cartItems = document.getElementById("cartItems");
    const cartEmpty = document.getElementById("cartEmpty");
    const subtotalEl = document.getElementById("subtotal");
    const discountAmountEl = document.getElementById("discountAmount");
    const totalPriceEl = document.getElementById("totalPrice");
    const deliveryComments = document.getElementById("deliveryComments");
    let discount = 0;

    // Функции корзины
    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // ОТОБРАЖЕНИЕ КОРЗИНЫ
    function renderCart() {
        const cart = getCart();
        cartItems.innerHTML = "";

   if (cart.length === 0) {
       cartEmpty.style.display = "block";
       document.querySelector(".cart-summary").style.display = "none";
       return;
   }

        cartEmpty.style.display = "none";
        document.querySelector(".cart-summary").style.display = "block";

        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;

            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <img src="${item.image || 'images/no-image.jpg'}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <div class="cart-item-quantity">${item.price.toLocaleString()} ₽ × ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button onclick="removeFromCart(${item.id})">Удалить</button>
                </div>
            `;
            cartItems.appendChild(div);
        });

        const discountAmount = subtotal * discount;
        const total = subtotal - discountAmount;

        subtotalEl.textContent = subtotal.toLocaleString() + " ₽";
        discountAmountEl.textContent = "-" + Math.round(discountAmount).toLocaleString() + " ₽";
        totalPriceEl.textContent = Math.round(total).toLocaleString() + " ₽";
    }

    // ДОСТАВКА - обработка формы
    document.getElementById("deliveryForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("deliveryName").value;
        const email = document.getElementById("deliveryEmail").value;
        const phone = document.getElementById("deliveryPhone").value;
        const address = document.getElementById("deliveryAddress").value;


        const commentDiv = document.createElement("div");
        commentDiv.className = "delivery-comment";
        commentDiv.innerHTML = `
            <div class="comment-header">
                <strong>${name}</strong>
                <span class="comment-date">${new Date().toLocaleDateString('ru-RU')}</span>
            </div>
            <div class="comment-info">
                <div><i class="fas fa-envelope"></i> ${email}</div>
                <div><i class="fas fa-phone"></i> ${phone}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${address}</div>
            </div>
        `;


        deliveryComments.insertBefore(commentDiv, deliveryComments.firstChild);


        const comments = JSON.parse(localStorage.getItem("deliveryComments") || "[]");
        comments.unshift({ name, email, phone, address, date: new Date().toISOString() });
        localStorage.setItem("deliveryComments", JSON.stringify(comments));


        closeDeliveryModal();
        alert("Данные доставки сохранены!");
    });


    function loadDeliveryComments() {
        const comments = JSON.parse(localStorage.getItem("deliveryComments") || "[]");
        deliveryComments.innerHTML = "";

        comments.forEach(comment => {
            const div = document.createElement("div");
            div.className = "delivery-comment";
            div.innerHTML = `
                <div class="comment-header">
                    <strong>${comment.name}</strong>
                    <span class="comment-date">${new Date(comment.date).toLocaleDateString('ru-RU')}</span>
                </div>
                <div class="comment-info">
                    <div><i class="fas fa-envelope"></i> ${comment.email}</div>
                    <div><i class="fas fa-phone"></i> ${comment.phone}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${comment.address}</div>
                </div>
            `;
            deliveryComments.appendChild(div);
        });
    }

    // ГЛОБАЛЬНЫЕ ФУНКЦИИ
    window.removeFromCart = function(id) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== id);
        saveCart(cart);
        renderCart();
    };

    window.applyPromo = function() {
        const code = document.getElementById("promoCode").value.trim().toLowerCase();
        if (code === "зачет") {
            discount = 0.5;
            alert("Промокод 'Зачет' применен! Скидка 50%");
        } else {
            discount = 0;
            alert("Неверный промокод");
        }
        renderCart();
    };

    window.checkout = function() {
        if (getCart().length === 0) {
            alert("Корзина пуста!");
            return;
        }
        alert("Заказ оформлен! Благодарим за покупку!");
        localStorage.removeItem("cart");
        renderCart();
    };


    window.openDeliveryModal = function() {
        document.getElementById("deliveryModal").style.display = "block";
    };

    window.closeDeliveryModal = function() {
        document.getElementById("deliveryModal").style.display = "none";
        document.getElementById("deliveryForm").reset();
    };


    window.onclick = function(event) {
        const modal = document.getElementById("deliveryModal");
        if (event.target === modal) {
            closeDeliveryModal();
        }
    };

    renderCart();
    loadDeliveryComments();
});
