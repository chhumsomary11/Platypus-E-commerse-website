import { updateCartCount } from "../script/cartCount.js";

window.addEventListener("DOMContentLoaded", () => {
	includeHTML("navbar-placeholder", "nav.html", () => {
		updateCartCount(); // run this AFTER navbar loads
	});

	includeHTML("footer-placeholder", "footer.html");
	includeHTML("subscribe-placeholder", "subscribe.html");
});

function includeHTML(id, file, callback) {
	fetch(file)
		.then((res) => res.text())
		.then((data) => {
			document.getElementById(id).innerHTML = data;
			if (callback) callback(); // ✅ Run this after HTML is loaded
		})
		.catch((err) => console.error("Include failed:", err));
}
