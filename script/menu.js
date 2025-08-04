import { products } from "../data/products.js";
import { carts } from "../data/carts.js";

let productContainer = document.querySelector(".product-container");

// Build ALL HTML content first
let allContent = "";

products.forEach((product) => {
	// Define stock badge
	const stockBadge = `
		<span class="badge position-absolute top-0 start-0 m-2 ${
			product.inStock ? "bg-secondary" : "bg-warning"
		}">
			${product.inStock ? "In Stock" : "Out of Stock"}
		</span>`;

	// Define discount badge
	const discountBadge = product.discount
		? `<span class="badge bg-danger text-white position-absolute top-0 end-0 m-2">50% OFF</span>`
		: "";

	// Define price display
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

	// Add to the accumulated content
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

if (productContainer) {
	productContainer.innerHTML = allContent;

	// Now select cards and add event listeners AFTER the elements exist
	let cards = document.querySelectorAll(".js-cart-item");

	cards.forEach((card) => {
		card.addEventListener("click", () => {
			const productId = Number(card.dataset.productId);
			const product = products.find((p) => p.id === productId);
			if (!product) return;

			// Set modal content
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

			// Set productId on modal button for reference
			const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
			modalAddToCartBtn.dataset.productId = productId;

			// Reset size selection when opening modal
			document
				.querySelectorAll(".size-option")
				.forEach((opt) => opt.classList.remove("selected"));

			// Reset quantity selection
			const quantitySelect = document.getElementById("modalQuantitySelect");
			if (quantitySelect) {
				quantitySelect.selectedIndex = 0;
			}

			// Show the modal
			const modal = new bootstrap.Modal(
				document.getElementById("productModal")
			);
			modal.show();
		});
	});
} else {
	console.error("Product container not found!");
}

// Size selector functionality
document.addEventListener("DOMContentLoaded", function () {
	const sizeOptions = document.querySelectorAll(".size-option");

	sizeOptions.forEach((option) => {
		option.addEventListener("click", function () {
			// Don't allow selection of unavailable sizes
			if (this.classList.contains("unavailable")) {
				return;
			}

			// Remove selected class from all options
			sizeOptions.forEach((opt) => opt.classList.remove("selected"));

			// Add selected class to clicked option
			this.classList.add("selected");

			console.log("Selected size:", this.getAttribute("data-size"));
		});
	});
});

// Modal Add to Cart functionality
const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

if (modalAddToCartBtn) {
	modalAddToCartBtn.addEventListener("click", () => {
		// Changed from 'hover' to 'click'
		// Get selected size from the visual selector
		const selectedSizeElement = document.querySelector(".size-option.selected");
		const selectedSize = selectedSizeElement
			? selectedSizeElement.dataset.size
			: null;

		// Get selected quantity
		const quantitySelect = document.getElementById("modalQuantitySelect");
		const selectedQuantity = quantitySelect ? quantitySelect.value : null;

		// Validate selections
		if (!selectedSize) {
			alert("Please select a size, babe 💖");
			return;
		}

		if (!selectedQuantity || selectedQuantity === "Select Quantity:") {
			alert("Please select a quantity, baby 💅");
			return;
		}

		// Get product ID
		const productId = modalAddToCartBtn.dataset.productId;
		if (!productId) {
			alert("Oops, product not found 😢");
			return;
		}

		// Find matching item in cart (including size)
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

		// Save and update UI
		saveToLocalStorage();
		window.dispatchEvent(new CustomEvent("cartUpdated"));

		// Close modal
		const modalEl = document.getElementById("productModal");
		const modalInstance = bootstrap.Modal.getInstance(modalEl);
		if (modalInstance) {
			modalInstance.hide();
		}

		// Reset selections for next time
		document
			.querySelectorAll(".size-option")
			.forEach((opt) => opt.classList.remove("selected"));
		if (quantitySelect) {
			quantitySelect.selectedIndex = 0;
		}

		alert("Added to cart, my queen 💕");
	});
}

export function saveToLocalStorage() {
	localStorage.setItem("cart", JSON.stringify(carts));
}
