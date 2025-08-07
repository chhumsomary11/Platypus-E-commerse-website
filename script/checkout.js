import { getCart, clearCart } from "../data/carts.js";
import { products } from "../data/products.js";
let carts = getCart();

console.log("=== CHECKOUT SCRIPT STARTING ===");

// GLOBAL SCOPE - Move showEmptyCart here so it's accessible everywhere
function showEmptyCart() {
	const summaryContainer = document.querySelector(".summary-container");
	const cartStatus = document.querySelector(".cart-status");
	const exploreBtn = document.querySelector(".explore-btn");
	const checkoutBtn = document.querySelector(".checkout-btn");

	if (cartStatus) cartStatus.textContent = "Your Cart is Empty";
	if (exploreBtn) exploreBtn.style.display = "inline-block";

	if (summaryContainer) {
		summaryContainer.innerHTML = `
			<div class="text-center py-5">
				<i class="bi bi-cart-x display-1 text-muted"></i>
				<h4 class="mt-3">Your cart is empty</h4>
				<p class="text-muted">Add some amazing products to get started!</p>
			</div>
		`;
	}

	if (checkoutBtn) checkoutBtn.disabled = false;
}

try {
	const { products } = await import("../data/products.js");
	const { removeFromCart } = await import("../data/carts.js");

	console.log("Modules imported successfully");

	// Wait for DOM
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeCheckout);
	} else {
		initializeCheckout();
	}

	function initializeCheckout() {
		console.log("=== INITIALIZING CHECKOUT ===");

		const rawCart = localStorage.getItem("cart");
		console.log("Raw localStorage cart:", rawCart);

		// Load carts array from localStorage if available
		if (rawCart) {
			try {
				const parsedCart = JSON.parse(rawCart);
				carts.length = 0; // Clear old cart data
				carts.push(...parsedCart);
				console.log("Loaded carts from localStorage:", carts);
			} catch (e) {
				console.error("Error parsing localStorage cart:", e);
			}
		}

		const summaryContainer = document.querySelector(".summary-container");
		const cartStatus = document.querySelector(".cart-status");
		const exploreBtn = document.querySelector(".explore-btn");
		const amountElement = document.querySelector(".amount");
		const checkoutBtn = document.querySelector(".checkout-btn");
		const loadingState = document.querySelector(".loading-state");

		if (!summaryContainer) {
			console.error("CRITICAL: Summary container not found!");
			return;
		}

		if (loadingState) {
			loadingState.style.display = "none";
		}

		if (!carts || carts.length === 0) {
			showEmptyCart(); // Now this function is accessible from global scope
			return;
		}

		displayCartItems();
		updateCartSummary();

		function displayCartItems() {
			let allContent = "";
			let totalItems = 0;

			carts.forEach((item) => {
				const product = products.find((p) => p.id == item.productIdCart);
				if (product) {
					totalItems += item.quantity;
					const itemTotal = ((product.price * item.quantity) / 100).toFixed(2);

					allContent += `
						<div class="cart-item border-bottom py-3" data-product-id="${product.id}">
							<div class="row align-items-center">
								<div class="col-auto">
									<img src="${product.image}" alt="${
						product.name
					}" class="img-thumbnail" style="width: 80px; height: 80px; object-fit: cover;" />
								</div>
								<div class="col">
									<h6 class="mb-1">${product.name}</h6>
									<p class="text-muted mb-1">$${(product.price / 100).toFixed(2)} each</p>
									<p class="mb-0">Qty: ${item.quantity}</p>
									${item.size ? `<p class="mb-0">Size: ${item.size}</p>` : ""}
									${item.color ? `<p class="mb-0">Color: ${item.color}</p>` : ""}
								</div>
								<div class="col-auto text-end">
									<p class="fw-bold mb-2">$${itemTotal}</p>
									<button class="btn btn-sm btn-outline-danger js-delete-btn mb-3" data-product-id="${
										product.id
									}" type="button">
										<i class="bi bi-trash"></i> Remove
									</button>
								</div>
							</div>
						</div>
					`;
				}
			});

			summaryContainer.innerHTML = allContent;

			if (cartStatus) {
				cartStatus.textContent = `Your Cart (${totalItems} item${
					totalItems !== 1 ? "s" : ""
				})`;
			}
			if (exploreBtn) exploreBtn.style.display = "none";
			if (checkoutBtn) checkoutBtn.disabled = false;

			addDeleteListeners();
		}

		function addDeleteListeners() {
			const deleteButtons = document.querySelectorAll(".js-delete-btn");
			deleteButtons.forEach((btn) => {
				btn.addEventListener("click", () => {
					const productId = btn.dataset.productId;

					removeFromCart(productId);

					// Sync carts with localStorage
					const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
					carts.length = 0;
					carts.push(...updatedCart);

					// Remove from DOM
					const cartItem = btn.closest(".cart-item");
					if (cartItem) cartItem.remove();

					updateCartSummary();

					if (carts.length === 0) {
						showEmptyCart(); // Global function can be called from here too
					} else {
						const totalItems = carts.reduce(
							(sum, item) => sum + item.quantity,
							0
						);
						const cartStatus = document.querySelector(".cart-status");
						if (cartStatus) {
							cartStatus.textContent = `Your Cart (${totalItems} item${
								totalItems !== 1 ? "s" : ""
							})`;
						}
					}

					window.dispatchEvent(new CustomEvent("cartUpdated"));
				});
			});

			updateCartSummary(products);
		}
	}
} catch (error) {
	console.error("CRITICAL ERROR in checkout script:", error);
}

function updateCartSummary(products) {
	let subtotal = 0;
	carts.forEach((item) => {
		const product = products.find((p) => p.id == item.productIdCart);
		if (product) {
			subtotal += (product.price * item.quantity) / 100;
		}
	});
	const amountElement = document.querySelector(".amount");
	if (amountElement) {
		amountElement.textContent = `$${subtotal.toFixed(2)}`;
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		initializeCheckoutForm();
	});
} else {
	initializeCheckoutForm();
}

function initializeCheckoutForm() {
	console.log("🚀 Initializing checkout form");

	const form = document.querySelector("#checkoutForm");
	if (!form) return console.error("❌ Form not found!");

	form.addEventListener("submit", (e) => {
		console.log("🔥 Form submitted!");
		e.preventDefault();

		clearCart();
		updateCartSummary(carts);
		showEmptyCart();

		const modal = bootstrap.Modal.getInstance(
			document.getElementById("checkoutModal")
		);
		if (modal) modal.hide();

		// 🎉 Show success message
		const successMessage = document.querySelector(".successMsg");
		if (successMessage) {
			successMessage.classList.remove("d-none");

			// Auto-hide after 5 seconds
			setTimeout(() => {
				successMessage.classList.add("d-none");
			}, 8000);
		}
	});
}
