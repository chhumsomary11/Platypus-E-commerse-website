import { products } from "../data/products.js";
import { carts } from "../data/carts.js";

let productContainer = document.querySelector(".product-container");

// Function to render products by category
function renderProductsByCategory(category) {
	let filteredProducts;

	if (category === "best") {
		// Show products with category "best" or maybe your own logic for best sellers
		filteredProducts = products.filter((p) => p.category.includes("best"));
	} else if (category === "onSale") {
		// Show products on discount
		filteredProducts = products.filter((p) => p.discount);
	} else {
		// Filter by specific category
		filteredProducts = products.filter((p) => p.category.includes(category));
	}

	if (!productContainer) {
		console.error("Product container not found!");
		return;
	}

	let allContent = "";

	filteredProducts.forEach((product) => {
		const stockBadge = `
            <span class="badge position-absolute top-0 start-0 m-2 ${
							product.inStock ? "bg-secondary" : "bg-warning"
						}">
                ${product.inStock ? "In Stock" : "Out of Stock"}
            </span>`;

		const discountBadge = product.discount
			? `<span class="badge bg-danger text-white position-absolute top-0 end-0 m-2">50% OFF</span>`
			: "";

		let priceHTML = "";
		const originalPrice = (product.price / 100).toFixed(2);

		if (product.discount) {
			const discountedPrice = (originalPrice / 2).toFixed(2);
			priceHTML = `
                <p class="card-text">
                    <del class="text-muted me-2">$${originalPrice}</del>
                    <span class="text-danger fw-bold">$${discountedPrice}</span>
                </p>`;
		} else {
			priceHTML = `<p class="card-text text-muted">$${originalPrice}</p>`;
		}

		allContent += `
            <div class="col mb-4 js-cart-item cart-item-container-${product.id}"
                data-product-id= "${product.id}">
                <div class="card shadow-sm position-relative">
                    ${stockBadge}
                    ${discountBadge}
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        ${priceHTML}
                        <div class="added-btn js-added" style="display: none;">
                            <span> Added</span>
                        </div>
                        <button data-product-id="${product.id}" class="cartBtn btn btn-primary w-100">Add to cart</button>
                    </div>
                </div>
            </div>`;
	});

	productContainer.innerHTML = allContent;

	// Re-attach event listeners for product cards after rendering
	attachCardEventListeners();
}

// Function to attach click listeners to product cards for modal
function attachCardEventListeners() {
	let cards = document.querySelectorAll(".js-cart-item");

	cards.forEach((card) => {
		card.addEventListener("click", () => {
			const productId = Number(card.dataset.productId);
			const product = products.find((p) => p.id === productId);
			if (!product) return;

			document.getElementById("modalProductName").textContent = product.name;
			document.getElementById("modalProductDescription").textContent =
				product.description || "No description available.";
			document.getElementById("modalProductImage").src = product.image;
			document.getElementById("modalProductImage").alt = product.name;

			const price = (product.price / 100).toFixed(2);
			const discounted = product.discount ? (price / 2).toFixed(2) : null;
			document.getElementById("modalProductPrice").innerHTML = product.discount
				? `<del class="text-muted me-2">$${price}</del> <span class="text-danger">$${discounted}</span>`
				: `$${price}`;

			const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
			modalAddToCartBtn.dataset.productId = productId;

			document
				.querySelectorAll(".size-option")
				.forEach((opt) => opt.classList.remove("selected"));

			const quantitySelect = document.getElementById("modalQuantitySelect");
			if (quantitySelect) quantitySelect.selectedIndex = 0;

			const modal = new bootstrap.Modal(
				document.getElementById("productModal")
			);
			modal.show();
		});
	});
}

// Listen for category button clicks
document.querySelectorAll(".category-link").forEach((btn) => {
	btn.addEventListener("click", (event) => {
		event.preventDefault();
		const category = btn.dataset.category;
		renderProductsByCategory(category);

		// Optional: visually mark selected category
		document
			.querySelectorAll(".category-link")
			.forEach((b) => b.classList.remove("active"));
		btn.classList.add("active");
	});
});

// // Initial load (show best or all products)
// renderProductsByCategory("best");

// ... Your existing size selector, modal add to cart, saveToLocalStorage functions below ...

// Size selector functionality
document.addEventListener("DOMContentLoaded", function () {
	const sizeOptions = document.querySelectorAll(".size-option");

	sizeOptions.forEach((option) => {
		option.addEventListener("click", function () {
			if (this.classList.contains("unavailable")) return;
			sizeOptions.forEach((opt) => opt.classList.remove("selected"));
			this.classList.add("selected");
		});
	});
});

// Modal Add to Cart functionality (same as you have)

const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

if (modalAddToCartBtn) {
	modalAddToCartBtn.addEventListener("click", () => {
		const selectedSizeElement = document.querySelector(".size-option.selected");
		const selectedSize = selectedSizeElement
			? selectedSizeElement.dataset.size
			: null;
		const quantitySelect = document.getElementById("modalQuantitySelect");
		const selectedQuantity = quantitySelect ? quantitySelect.value : null;

		if (!selectedSize) {
			alert("Please select a size, babe 💖");
			return;
		}
		if (!selectedQuantity || selectedQuantity === "Select Quantity:") {
			alert("Please select a quantity, baby 💅");
			return;
		}

		const productId = modalAddToCartBtn.dataset.productId;
		if (!productId) {
			alert("Oops, product not found 😢");
			return;
		}

		let matchingItem = carts.find(
			(item) => item.productIdCart == productId && item.size === selectedSize
		);

		if (matchingItem) {
			matchingItem.quantity += Number(selectedQuantity);
		} else {
			carts.push({
				productIdCart: Number(productId),
				quantity: Number(selectedQuantity),
				size: selectedSize,
			});
		}

		saveToLocalStorage();
		window.dispatchEvent(new CustomEvent("cartUpdated"));

		const modalEl = document.getElementById("productModal");
		const modalInstance = bootstrap.Modal.getInstance(modalEl);
		if (modalInstance) modalInstance.hide();

		document
			.querySelectorAll(".size-option")
			.forEach((opt) => opt.classList.remove("selected"));
		if (quantitySelect) quantitySelect.selectedIndex = 0;

		alert("Added to cart, my queen 💕");
	});
}

document.addEventListener("DOMContentLoaded", () => {
	// Render 'best' products by default on page load
	renderProductsByCategory("best");

	// Set 'best' category button as active (optional, for styling)
	document
		.querySelectorAll(".category-link")
		.forEach((btn) => btn.classList.remove("active"));
	const bestBtn = document.querySelector(
		'.category-link[data-category="best"]'
	);
	if (bestBtn) bestBtn.classList.add("active");

	// Add click listeners for category buttons (if not added yet)
	const categoryButtons = document.querySelectorAll(".category-link");
	categoryButtons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();

			const selectedCategory = btn.dataset.category;

			// Remove active class from all buttons
			categoryButtons.forEach((b) => b.classList.remove("active"));

			// Add active to clicked button
			btn.classList.add("active");

			// Render products for selected category
			renderProductsByCategory(selectedCategory);
		});
	});
});

export function saveToLocalStorage() {
	localStorage.setItem("cart", JSON.stringify(carts));
}
