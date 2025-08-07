// cartCount.js

export function updateCartCount() {
	const cartCountEl = document.getElementById("cart-count");
	if (!cartCountEl) return;

	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
	cartCountEl.textContent = totalItems;

	cartCountEl.style.display = totalItems > 0 ? "inline-block" : "none";
}

// 🟡 Listen globally for cart updates from anywhere
window.addEventListener("cartUpdated", () => {
	updateCartCount();
});
