


document.addEventListener('DOMContentLoaded', () => {
    fetch('/cart-items')
        .then(response => response.json())
        .then(cartItems => {
            console.log(cartItems); // Use the cartItems here
            // You can now update your UI based on cartItems or store it for later use
        })
        .catch(err => console.error('Failed to fetch cart items:', err));
});





document.getElementById('checkout').addEventListener('click', function () {
    fetch("/checkout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }) // Pass cartItems here
    })
    .then(response => response.json())
    .then(({url}) => { 


        window.location.assign(url);

    })
    .catch(err => {
        console.error("Checkout failed:", err);
        alert("Something went wrong. Please try again.");
    });
});





