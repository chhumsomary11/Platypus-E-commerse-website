// script.js
window.addEventListener("DOMContentLoaded", () => {
  includeHTML("navbar-placeholder", "nav.html");
  includeHTML("footer-placeholder", "footer.html");
});

function includeHTML(id, file) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    })
    .catch((err) => console.error("Include failed:", err));
}
