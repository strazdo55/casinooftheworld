(function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav-main");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  const modal = document.getElementById("lead-modal");
  const openModal = () => {
    if (modal) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  };
  const closeModal = () => {
    if (modal) {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  document.querySelectorAll("[data-close-modal], .modal-close").forEach((el) => {
    el.addEventListener("click", closeModal);
  });
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  setTimeout(openModal, 8000);
  document.querySelector("[data-open-modal]")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  const toast = document.getElementById("toast");
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4000);
  }

  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      showToast("Thanks! Your submission was recorded (demo mode).");
      form.reset();
      closeModal();
    });
  });

  document.querySelectorAll(".compare-table th").forEach((th, idx) => {
    th.style.cursor = "pointer";
    th.title = "Click to sort";
    th.addEventListener("click", () => sortTable(th.closest("table"), idx));
  });

  function sortTable(table, col) {
    const tbody = table.querySelector("tbody");
    const rows = [...tbody.querySelectorAll("tr")];
    const asc = table.dataset.sortCol === String(col) && table.dataset.sortDir !== "asc";
    rows.sort((a, b) => {
      const ta = a.children[col]?.textContent.trim() || "";
      const tb = b.children[col]?.textContent.trim() || "";
      return asc ? ta.localeCompare(tb) : tb.localeCompare(ta);
    });
    table.dataset.sortCol = col;
    table.dataset.sortDir = asc ? "asc" : "desc";
    rows.forEach((r) => tbody.appendChild(r));
  }

  const postGrid = document.querySelector(".post-grid");
  if (postGrid) {
    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.category || "all";
        postGrid.querySelectorAll(".post-card").forEach((card) => {
          const show = cat === "all" || card.dataset.category === cat;
          card.classList.toggle("is-hidden", !show);
        });
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });
  }
})();
