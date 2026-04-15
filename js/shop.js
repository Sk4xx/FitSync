document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartCounter = document.getElementById('cart-counter');
    const floatingCart = document.getElementById('floating-cart');
    
    // Elementos del sidebar del carrito
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    let cart = [];

    // Abrir y cerrar el panel del carrito
    const openCart = () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    };

    const closeCart = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    floatingCart.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Actualizar la interfaz de usuario del carrito
    const updateCartUI = () => {
        // Actualizar contador total
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCounter.textContent = totalItems;
        
        // Limpiar contenedor e inyectar items
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        // Botones para eliminar items del carrito
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                cart.splice(index, 1);
                updateCartUI();
            });
        });

        // Actualizar total a pagar
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    };

    // Inicializar UI (vacia)
    updateCartUI();

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Extraer información de la tarjeta correspondiente
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPriceText = productCard.querySelector('.product-price').textContent;
            const productPrice = parseFloat(productPriceText.replace('$', ''));

            // Añadir al arreglo del carrito
            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1 });
            }

            updateCartUI();
            
            // Animación del botón y feedback
            const originalText = btn.textContent;
            btn.textContent = '¡Agregado!';
            btn.style.backgroundColor = '#a8c800'; 
            btn.style.color = '#0a0a0a';
            
            // Animación del botón flotante
            floatingCart.classList.add('bounce');
            setTimeout(() => {
                floatingCart.classList.remove('bounce');
            }, 300);

            // Regresar el botón a su estado normal
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1000);
        });
    });
});
