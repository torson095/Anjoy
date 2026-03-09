document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  fetch("/navbar.html")
    .then(res => {
      if (!res.ok) throw new Error("Navbar not found");
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;
    })
    .catch(err => {
      // ⛔ Abaikan AbortError (INI KUNCINYA)
      if (err.name === "AbortError") return;

      console.warn("Navbar gagal dimuat:", err.message);
    });
});