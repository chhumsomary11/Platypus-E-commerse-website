let conBtn = document.querySelector(".contactBtn");

conBtn.onclick = () => {
	let msg = document.querySelector(".successMsg");
	if (msg) {
		msg.classList.remove("d-none");
	}
	setTimeout(() => {
		msg.classList.add("d-none");
	}, 5000);
};
