(function () {
  const COOKIE_CONSENT_KEY = "cotw_cookie_consent";

  function initCookieConsent() {
    const banner = document.getElementById("cookie-consent");
    if (!banner) return;

    try {
      if (localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") {
        banner.remove();
        return;
      }
    } catch {
      /* private mode */
    }

    banner.hidden = false;

    function acceptCookies() {
      try {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
      } catch {
        /* private mode */
      }
      banner.classList.add("is-hidden");
      window.setTimeout(() => banner.remove(), 400);
    }

    document.getElementById("cookie-accept-btn")?.addEventListener("click", acceptCookies);
    banner.addEventListener("click", (e) => {
      if (e.target.id === "cookie-accept-btn" || e.target.closest("#cookie-accept-btn")) {
        e.preventDefault();
        acceptCookies();
      }
    });
  }

  initCookieConsent();

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav-main");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
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

  initCompareFilters();
  initWageringCalculator();

  function initCompareFilters() {
    const table = document.getElementById("casino-compare-table");
    if (!table) return;

    const rows = [...table.querySelectorAll("tbody tr.compare-row")];
    const countEl = document.getElementById("compare-filter-count");
    const licence = document.getElementById("filter-licence");
    const payout = document.getElementById("filter-payout");
    const market = document.getElementById("filter-market");
    const crypto = document.getElementById("filter-crypto");
    const live = document.getElementById("filter-live");
    const reset = document.getElementById("filter-reset");

    if (!licence || !rows.length) return;

    function marketMatch(rowMarkets, filter) {
      if (filter === "all") return true;
      const m = rowMarkets || "";
      if (filter === "uk") return m.includes("uk");
      if (filter === "eu") return m.includes("eu") || m.includes("spain");
      if (filter === "nordics") return m.includes("nordics") || m.includes("nordic");
      if (filter === "international") return m.includes("international") || m.includes("asia");
      return true;
    }

    function applyFilters() {
      const lic = licence.value;
      const pay = payout?.value || "all";
      const mk = market?.value || "all";
      const wantCrypto = crypto?.checked;
      const wantLive = live?.checked;
      let visible = 0;

      rows.forEach((row) => {
        const licences = row.dataset.licences || "";
        const payTier = row.dataset.payout || "";
        const markets = row.dataset.markets || "";
        const hasCrypto = row.dataset.crypto === "yes";
        const hasLive = row.dataset.live === "yes";

        let show = true;
        if (lic !== "all" && !licences.includes(lic)) show = false;
        if (pay !== "all" && payTier !== pay) show = false;
        if (!marketMatch(markets, mk)) show = false;
        if (wantCrypto && !hasCrypto) show = false;
        if (wantLive && !hasLive) show = false;

        row.classList.toggle("is-filtered-out", !show);
        if (show) visible++;
      });

      if (countEl) {
        countEl.textContent =
          visible === rows.length
            ? `Showing all ${rows.length} casinos`
            : `Showing ${visible} of ${rows.length} casinos`;
      }
    }

    document.querySelectorAll("[data-compare-filter]").forEach((el) => {
      el.addEventListener("change", applyFilters);
    });
    reset?.addEventListener("click", () => {
      licence.value = "all";
      if (payout) payout.value = "all";
      if (market) market.value = "all";
      if (crypto) crypto.checked = false;
      if (live) live.checked = false;
      applyFilters();
    });
    applyFilters();
  }

  function initWageringCalculator() {
    const form = document.getElementById("wagering-calc-form");
    if (!form) return;

    const results = document.getElementById("wagering-calc-results");
    const fmt = (n) =>
      new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
        n
      );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const bonus = Math.max(0, Number(document.getElementById("wc-bonus")?.value) || 0);
      const deposit = Math.max(0, Number(document.getElementById("wc-deposit")?.value) || 0);
      const mult = Math.max(1, Number(document.getElementById("wc-multiplier")?.value) || 35);
      const base = document.getElementById("wc-base")?.value || "bonus";
      const bet = Math.max(0.1, Number(document.getElementById("wc-bet")?.value) || 1);
      const contribution = Math.min(100, Math.max(1, Number(document.getElementById("wc-contribution")?.value) || 100));

      const baseAmount = base === "both" ? bonus + deposit : bonus;
      const totalWager = baseAmount * mult;
      const effectiveWager = totalWager / (contribution / 100);
      const rounds = Math.ceil(effectiveWager / bet);

      document.getElementById("wc-result-total").textContent = fmt(totalWager);
      document.getElementById("wc-result-effective").textContent = fmt(effectiveWager);
      document.getElementById("wc-result-rounds").textContent = rounds.toLocaleString("en-GB");
      document.getElementById("wc-result-note").textContent =
        contribution < 100
          ? `At ${contribution}% game contribution, you must place the equivalent of ${fmt(effectiveWager)} in qualifying bets on eligible games.`
          : `At 100% slot contribution, you need roughly ${rounds.toLocaleString("en-GB")} spins at ${fmt(bet)} per round.`;
      results.hidden = false;
    });
  }

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
