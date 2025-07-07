const products = [
  {
    name: "Oversized Pants",
    price: "$39.99",
    image: "product_image/big_Pants.webp",
    inStock: true,
    discount: false,
  },
  {
    name: "Denim Jacket",
    price: "$59.99",
    image: "product_image/Lucy_shirt.avif",
    inStock: true,
    discount: true, // This has 50% discount
  },
  {
    name: "Unisex Sneakers",
    price: "$49.99",
    image: "product_image/miniBlue-dress.avif",
    inStock: false,
    discount: true,
  },
  {
    name: "Necklace Set",
    price: "$49.99",
    image: "product_image/Necklace_set.avif",
    inStock: true,
    discount: false,
  },
  {
    name: "Sweater",
    price: "$49.99",
    image: "product_image/Sweater.avif",
    inStock: true,
    discount: true,
  },
  {
    name: "Necklace",
    price: "$49.99",
    image: "product_image/necklace.avif",
    inStock: false,
    discount: false,
  },
  {
    name: "Wavy Ice Skirt",
    price: "$49.99",
    image: "product_image/wavyIce_skirt.avif",
    inStock: true,
    discount: false,
  },
  {
    name: "Sagi Silky Blouse",
    price: "$49.99",
    image: "product_image/Sagi-silky-blouse.jpg",
    inStock: true,
    discount: true,
  }
];

const container = document.getElementById("product-container");

let content = "";

for (let i = 0; i < products.length; i++) {
  const product = products[i];

  // Badge: In stock / Out of stock
  const stockBadge = `
    <span class="badge position-absolute top-0 start-0 m-2 ${product.inStock ? 'bg-secondary' : 'bg-warning'}">
      ${product.inStock ? 'In Stock' : 'Out of Stock'}
    </span>`;

  // Badge: 50% OFF
  const discountBadge = product.discount
    ? `<span class="badge bg-danger text-white position-absolute top-0 end-0 m-2">50% OFF</span>`
    : "";

  // Price: Calculate discount if applicable
  let priceHTML = "";

  if (product.discount) {
    const originalPrice = parseFloat(product.price.slice(1)); // remove '$' and convert to number
    const discountedPrice = (originalPrice / 2).toFixed(2); // 50% off

    priceHTML = `
      <p class="card-text">
        <del class="text-muted me-2">${product.price}</del>
        <span class="text-danger fw-bold">$${discountedPrice}</span>
      </p>
    `;
  } else {
    priceHTML = `<p class="card-text text-muted">${product.price}</p>`;
  }

  // Final card content
  content += `
    <div class="col mb-4">
      <div class="card shadow-sm position-relative">
        ${stockBadge}
        ${discountBadge}
        <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          ${priceHTML}
          <a href="#" class="btn btn-dark w-100" ${!product.inStock ? 'disabled' : ''}>Add to Cart</a>
        </div>
      </div>
    </div>
  `;
}

// Output all cards
container.innerHTML = content;



