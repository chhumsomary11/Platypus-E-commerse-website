console.log("=== CHECKOUT SCRIPT STARTING ===");

try {
	const { products } = await import("../data/products.js");
	const { carts, removeFromCart } = await import("../data/carts.js");

	console.log("Modules imported successfully");
	console.log("Products:", products);
	console.log("Carts:", carts);
	console.log("removeFromCart function:", typeof removeFromCart);

	// Wait for DOM
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeCheckout);
	} else {
		initializeCheckout();
	}

	function initializeCheckout() {
		console.log("=== INITIALIZING CHECKOUT ===");

		// Check localStorage directly
		const rawCart = localStorage.getItem("cart");
		console.log("Raw localStorage cart:", rawCart);

		if (rawCart) {
			try {
				const parsedCart = JSON.parse(rawCart);
				console.log("Parsed localStorage cart:", parsedCart);
			} catch (e) {
				console.error("Error parsing localStorage:", e);
			}
		}

		// Find DOM elements
		const summaryContainer = document.querySelector(".summary-container");
		const cartStatus = document.querySelector(".cart-status");
		const exploreBtn = document.querySelector(".explore-btn");
		const amountElement = document.querySelector(".amount");
		const checkoutBtn = document.querySelector(".checkout-btn");
		const loadingState = document.querySelector(".loading-state");

		// console.log("DOM Elements Found:");
		// console.log("- summaryContainer:", !!summaryContainer, summaryContainer);
		// console.log("- cartStatus:", !!cartStatus, cartStatus);
		// console.log("- exploreBtn:", !!exploreBtn, exploreBtn);
		// console.log("- amountElement:", !!amountElement, amountElement);
		// console.log("- checkoutBtn:", !!checkoutBtn, checkoutBtn);
		// console.log("- loadingState:", !!loadingState, loadingState);

		if (!summaryContainer) {
			console.error("CRITICAL: Summary container not found!");
			console.log("Available elements with 'summary' in class:");
			document.querySelectorAll('[class*="summary"]').forEach((el) => {
				console.log("Found:", el);
			});
			return;
		}

		// Hide loading state
		if (loadingState) {
			loadingState.style.display = "none";
		}

		// Check cart data
		console.log("Cart check:");
		console.log("- carts exists:", !!carts);
		console.log("- carts is array:", Array.isArray(carts));
		console.log("- carts length:", carts?.length);

		if (!carts || carts.length === 0) {
			console.log("Cart is empty - showing empty state");
			showEmptyCart();
			return;
		}

		console.log("Cart has items - displaying cart");
		displayCartItems();
		updateCartSummary();

		function showEmptyCart() {
			console.log("=== SHOWING EMPTY CART ===");
			try {
				if (cartStatus) cartStatus.textContent = "Your Cart is Empty";
				if (exploreBtn) exploreBtn.style.display = "inline-block";

				summaryContainer.innerHTML = `
					<div class="text-center py-5">
						<i class="bi bi-cart-x display-1 text-muted"></i>
						<h4 class="mt-3">Your cart is empty</h4>
						<p class="text-muted">Add some amazing products to get started!</p>
					</div>
				`;

				if (checkoutBtn) checkoutBtn.disabled = true;
				console.log("Empty cart state set successfully");
			} catch (error) {
				console.error("Error setting empty cart state:", error);
			}
		}

		function displayCartItems() {
			console.log("=== DISPLAYING CART ITEMS ===");
			try {
				let allContent = "";
				let totalItems = 0;

				console.log(`Processing ${carts.length} cart items...`);

				carts.forEach((item, index) => {
					console.log(`\n--- Processing cart item ${index} ---`);
					console.log("Cart item:", item);
					console.log("Looking for product with ID:", item.productIdCart);

					const matchingProduct = products.find((product) => {
						const match = product.id == item.productIdCart;
						console.log(
							`  Product ${product.id} (${product.name}): ${
								match ? "MATCH" : "no match"
							}`
						);
						return match;
					});

					if (matchingProduct) {
						console.log("✓ Found matching product:", matchingProduct.name);
						totalItems += item.quantity;
						const itemTotal = (
							(matchingProduct.price * item.quantity) /
							100
						).toFixed(2);

						const itemHTML = `
  <div class="cart-item border-bottom py-3" data-product-id="${
		matchingProduct.id
	}">
    <div class="row align-items-center">
      <div class="col-auto">
        <img
          src="${matchingProduct.image}"
          alt="${matchingProduct.name}"
          class="img-thumbnail"
          style="width: 80px; height: 80px; object-fit: cover;"
        />
      </div>
      <div class="col">
        <h6 class="mb-1">${matchingProduct.name}</h6>
        <p class="text-muted mb-1">$${(matchingProduct.price / 100).toFixed(
					2
				)} each</p>
        <p class="mb-0">Qty: ${item.quantity}</p>
        ${item.size ? `<p class="mb-0">Size: ${item.size}</p>` : ""}
        ${item.color ? `<p class="mb-0">Color: ${item.color}</p>` : ""}
      </div>
      <div class="col-auto text-end">
        <p class="fw-bold mb-2">$${itemTotal}</p>
        <button
          class="btn btn-sm btn-outline-danger js-delete-btn mb-3"
          data-product-id="${matchingProduct.id}"
          type="button"
        >
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
    </div>
  </div>
`;

						allContent += itemHTML;
						console.log(`✓ Added HTML for ${matchingProduct.name}`);
					} else {
						console.warn("✗ No matching product found for cart item:", item);
					}
				});

				console.log(`\n=== SETTING HTML CONTENT ===`);
				console.log("Total items:", totalItems);
				console.log("HTML content length:", allContent.length);
				console.log("Setting innerHTML...");

				summaryContainer.innerHTML = allContent;
				console.log("✓ HTML set successfully");

				// Update UI
				if (cartStatus) {
					const statusText = `Your Cart (${totalItems} item${
						totalItems !== 1 ? "s" : ""
					})`;
					cartStatus.textContent = statusText;
					console.log("✓ Cart status updated:", statusText);
				}

				if (exploreBtn) exploreBtn.style.display = "none";
				if (checkoutBtn) checkoutBtn.disabled = false;

				// Add delete listeners
				addDeleteListeners();
			} catch (error) {
				console.error("Error displaying cart items:", error);
			}
		}

		function addDeleteListeners() {
			console.log("=== ADDING DELETE LISTENERS ===");
			const deleteButtons = document.querySelectorAll(".js-delete-btn");
			console.log(`Found ${deleteButtons.length} delete buttons`);

			deleteButtons.forEach((btn, index) => {
				console.log(`Adding listener to button ${index}`);
				btn.addEventListener("click", function () {
					try {
						const productId = this.dataset.productId;
						console.log("Delete clicked for product:", productId);

						removeFromCart(productId);
						// Refresh the carts array reference
						const updatedCart = JSON.parse(localStorage.getItem("cart"));
						carts.length = 0;
						carts.push(...updatedCart);

						const cartItem = this.closest(".cart-item");
						if (cartItem) {
							cartItem.remove();
							console.log("✓ Cart item removed from DOM");
						}

						updateCartSummary();

						if (carts.length === 0) {
							showEmptyCart();
						} else {
							const totalItems = carts.reduce(
								(sum, item) => sum + item.quantity,
								0
							);
							if (cartStatus) {
								cartStatus.textContent = `Your Cart (${totalItems} item${
									totalItems !== 1 ? "s" : ""
								})`;
							}
						}

						window.dispatchEvent(new CustomEvent("cartUpdated"));
						console.log("✓ Cart updated successfully");
					} catch (error) {
						console.error("Error in delete handler:", error);
					}
				});
			});
		}

		function updateCartSummary() {
			console.log("=== UPDATING CART SUMMARY ===");
			try {
				let subtotal = 0;

				carts.forEach((item) => {
					const matchingProduct = products.find(
						(product) => product.id == item.productIdCart
					);
					if (matchingProduct) {
						subtotal += (matchingProduct.price * item.quantity) / 100;
					}
				});

				if (amountElement) {
					amountElement.textContent = `$${subtotal.toFixed(2)}`;
					console.log("✓ Subtotal updated:", subtotal);
				}
			} catch (error) {
				console.error("Error updating cart summary:", error);
			}
		}
	}
} catch (error) {
	console.error("CRITICAL ERROR in checkout script:", error);
}
