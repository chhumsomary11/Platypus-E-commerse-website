const conBtn = document.querySelector(".contactBtn");
const form = document.querySelector("#contactForm");
const msg = document.querySelector(".successMsg");

conBtn.onclick = () => {
	// Show the success message
	if (msg) {
		msg.classList.remove("d-none");
		setTimeout(() => {
			msg.classList.add("d-none");
		}, 3000); // auto-hide after 10s
	}

	// Disable the button temporarily
	conBtn.disabled = true;
	setTimeout(() => {
		conBtn.disabled = false;
	}, 3000);

	// Clear the form fields
	form.reset();
};
