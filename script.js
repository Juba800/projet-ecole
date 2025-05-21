document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Met à jour le compteur de panier
    function updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        counter.textContent = `🛒 ${cart.length}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Affiche la modale du panier
    function showCartModal() {
        const modal = document.getElementById('cart-modal');
        modal.style.display = 'block';
        const cartItemsDiv = document.getElementById('cart-items');
        cartItemsDiv.innerHTML = '';
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Le panier est vide.</p>';
        } else {
            cart.forEach(item => {
                const p = document.createElement('p');
                p.textContent = `${item.name} - ${item.price.toFixed(2).replace('.', ',')} €`;
                cartItemsDiv.appendChild(p);
            });
        }
    }

    // Calcule et affiche le prix total
    function calculateTotal() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('total-price').textContent = `Total: ${total.toFixed(2).replace('.', ',')} €`;
        document.getElementById('confirm-button').style.display = 'inline';
    }

    // Vide le panier
    function emptyCart() {
        cart = [];
        updateCartCounter();
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('total-price').textContent = 'Total: 0 €';
        document.getElementById('confirm-button').style.display = 'none';
    }

    // Ajoute un article au panier
    function addToCart(productDiv) {
        const name = productDiv.querySelector('h3').textContent;
        const priceText = productDiv.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace(' €', '').replace(',', '.'));
        cart.push({name, price});
        updateCartCounter();
    }

    // Vérifie et ajoute l'article en attente après connexion/inscription
    function checkPendingItem() {
        const pendingItem = localStorage.getItem('pendingItem');
        if (pendingItem && sessionStorage.getItem('isLoggedIn') === 'true') {
            const item = JSON.parse(pendingItem);
            cart.push(item);
            updateCartCounter();
            localStorage.removeItem('pendingItem');
        }
    }

    // Écouteurs pour les boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productDiv = this.closest('.product');
            const name = productDiv.querySelector('h3').textContent;
            const priceText = productDiv.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace(' €', '').replace(',', '.'));
            const item = {name, price};

            if (sessionStorage.getItem('isLoggedIn') === 'true') {
                addToCart(productDiv);
            } else if (localStorage.getItem('hasVisited') === 'true') {
                localStorage.setItem('pendingItem', JSON.stringify(item));
                window.location.href = 'connexion.html';
            } else {
                localStorage.setItem('pendingItem', JSON.stringify(item));
                window.location.href = 'inscription.html';
            }
        });
    });

    // Écouteur pour le compteur de panier
    document.getElementById('cart-counter').addEventListener('click', showCartModal);

    // Écouteur pour le bouton "Achetez"
    document.getElementById('buy-button').addEventListener('click', calculateTotal);

    // Écouteur pour le bouton "Confirmer"
    document.getElementById('confirm-button').addEventListener('click', function() {
        alert('Paiement accepté');
        emptyCart();
    });

    // Écouteur pour le bouton "Vider le panier"
    document.getElementById('empty-cart').addEventListener('click', emptyCart);

    // Écouteur pour fermer la modale
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('cart-modal').style.display = 'none';
    });

    // Filtrage des produits
    const filterButtons = document.querySelectorAll('.filter-button');
    const products = document.querySelectorAll('.product');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            products.forEach(product => {
                if (category === 'tous' || product.getAttribute('data-category') === category) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Vérifier les articles en attente au chargement
    checkPendingItem();
});