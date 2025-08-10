// // cartCount.js

// export function updateCartCount() {
// 	const cartCountEl = document.getElementById("cart-count");
// 	if (!cartCountEl) return;

// 	const cart = JSON.parse(localStorage.getItem("cart")) || [];
// 	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
// 	cartCountEl.textContent = totalItems;

// 	cartCountEl.style.display = totalItems > 0 ? "inline-block" : "none";
// }

// // 🟡 Listen globally for cart updates from anywhere
// window.addEventListener("cartUpdated", () => {
// 	updateCartCount();
// });

export function updateCartCount() {
	const cartCountMobile = document.getElementById("cart-count-mobile");
	const cartCountDesktop = document.getElementById("cart-count-desktop");

	// If neither exists, do nothing
	if (!cartCountMobile && !cartCountDesktop) return;

	// Get cart from localStorage
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

	// Update both (if they exist)
	[cartCountMobile, cartCountDesktop].forEach((el) => {
		if (!el) return;
		el.textContent = totalItems;
		el.style.display = totalItems > 0 ? "inline-block" : "none";
	});
}

// Listen globally for updates
window.addEventListener("cartUpdated", updateCartCount);

// Also update on page load
document.addEventListener("DOMContentLoaded", updateCartCount);
