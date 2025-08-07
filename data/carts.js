export function getCart() {
	return JSON.parse(localStorage.getItem("cart")) || [];
}

export function removeFromCart(productId) {
	const cart = getCart();
	const newCart = cart.filter((item) => item.productIdCart != productId);
	localStorage.setItem("cart", JSON.stringify(newCart));
	console.log("🗑️ Item removed, new cart:", newCart);
	window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export function clearCart() {
	console.log("🧨 clearCart() called");

	localStorage.removeItem("cart");
	console.log("🧼 localStorage after clear:", localStorage.getItem("cart"));

	window.dispatchEvent(new CustomEvent("cartUpdated"));
	document.dispatchEvent(new CustomEvent("cartUpdated"));
}
