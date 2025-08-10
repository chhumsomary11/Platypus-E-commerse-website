const conBtn = document.querySelector(".contactBtn");
const form = document.querySelector("#contactForm");
const msg = document.querySelector(".successMsg");

// Remove the onclick handler and use proper form submission
form.addEventListener("submit", function (event) {
	event.preventDefault();

	// Disable the button to prevent multiple submissions
	conBtn.disabled = true;
	conBtn.value = "Sending...";

	// Send email using EmailJS
	emailjs
		.sendForm("service_a09n0xe", "template_073ytxe", this)
		.then(() => {
			console.log("SUCCESS!");
			// Show success message
			if (msg) {
				msg.classList.remove("d-none");
				setTimeout(() => {
					msg.classList.add("d-none");
				}, 5000);
			}
			// Clear the form
			form.reset();
		})
		.catch((error) => {
			console.log("FAILED...", error);
			// Show error message
			alert("Failed to send message. Please try again or contact us directly.");
		})
		.finally(() => {
			// Re-enable the button
			conBtn.disabled = false;
			conBtn.value = "Contact us";
		});
});
