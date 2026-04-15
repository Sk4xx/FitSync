document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartCounter = document.getElementById('cart-counter');
    const floatingCart = document.getElementById('floating-cart');
    let count = 0;

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Incrementar contador
            count++;
            cartCounter.textContent = count;
            
            // Animación del botón (Feedback visual)
            const originalText = btn.textContent;
            btn.textContent = '¡Agregado!';
            btn.style.backgroundColor = '#a8c800'; // Neon más oscuro para el click
            btn.style.color = '#0a0a0a';
            
            // Animación del carrito flotante
            floatingCart.classList.add('bounce');
            
            // Quitar clase de animación después de 300ms
            setTimeout(() => {
                floatingCart.classList.remove('bounce');
            }, 300);

            // Restaurar el botón después de 1 segundo
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1000);
        });
    });
});
