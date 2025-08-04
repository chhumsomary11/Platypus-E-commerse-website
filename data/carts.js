import { saveToLocalStorage } from "../script/menu.js";

export let carts = JSON.parse(localStorage.getItem("cart")) || [];

export function removeFromCart(productId) {
	let newCart = [];
	carts.forEach((item) => {
		if (item.productIdCart != productId) {
			newCart.push(item);
		}
	});

	// 👑 Keep the same array reference
	carts.length = 0;
	carts.push(...newCart);

	saveToLocalStorage();
}
