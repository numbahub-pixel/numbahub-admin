document.addEventListener("DOMContentLoaded", async () => {
  const pageName = document.body.dataset.page || "dashboard";
  const isLoginPage = window.location.pathname.endsWith("login.html");
  const isNestedPage = window.location.pathname.includes("/pages/");
  const rootPath = isNestedPage ? "../" : "";
  const sidebarHost = document.getElementById("sidebar-host");
  const toastRegion = document.querySelector(".toast-region");
  const modal = document.getElementById("admin-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");

  // This local session is only for frontend preview. Replace it with server auth.
  if (!isLoginPage && sessionStorage.getItem("numbahubAdminDemoSession") !== "active") {
    // Keep direct page previews convenient while making the demo sign-in available.
    // Production route protection must be enforced by the backend, not this check.
    sessionStorage.setItem("numbahubAdminDemoSession", "active");
  }

  if (sidebarHost) {
    try {
      const response = await fetch(`${rootPath}components/sidebar.html`);
      if (!response.ok) throw new Error(`Sidebar request failed: ${response.status}`);
      sidebarHost.innerHTML = (await response.text()).replaceAll("__ROOT__", rootPath);
    } catch (error) {
      console.error("Unable to load the admin sidebar. Use VS Code Live Server.", error);
      sidebarHost.innerHTML = `<aside class="sidebar"><div class="brand"><span class="brand-mark">N</span><span class="brand-copy"><strong>NumbaHub</strong><small>ADMIN CONSOLE</small></span></div><p style="padding:20px;color:#b42318;font-size:12px">Navigation could not load. Please run this project with VS Code Live Server.</p></aside>`;
    }
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function showToast(message, type = "success") {
    if (!toastRegion) {
      window.alert(message);
      return;
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : ""}`;
    toast.textContent = message;
    toastRegion.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3600);
  }

  function openModal(title, message, extra = "") {
    if (!modal || !modalTitle || !modalBody) {
      showToast(message);
      return;
    }
    modalTitle.textContent = title;
    modalBody.replaceChildren();
    const paragraph = document.createElement("p");
    paragraph.style.cssText = "font-size:12px;line-height:1.8;color:#657187;margin:0";
    paragraph.textContent = message;
    modalBody.appendChild(paragraph);
    if (extra) {
      const note = document.createElement("div");
      note.className = "login-note";
      note.style.marginTop = "14px";
      note.textContent = extra;
      modalBody.appendChild(note);
    }
    modal?.classList.add("open");
    refreshIcons();
  }

  function closeModal() {
    modal?.classList.remove("open");
  }

  function closeSidebar() {
    document.querySelector(".sidebar")?.classList.remove("open");
    document.querySelector(".mobile-overlay")?.classList.remove("show");
  }

  function safeFilename(value) {
    return String(value || "numbahub-export")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "numbahub-export";
  }

  function exportTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
      showToast("No exportable table was found on this page.", "error");
      return;
    }
    const rows = [...table.querySelectorAll("tr")].filter(row => row.style.display !== "none");
    const csv = rows.map(row => [...row.querySelectorAll("th, td")]
      .map(cell => `"${cell.innerText.trim().replaceAll('"', '""')}"`)
      .join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFilename(tableId)}-demo.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Demo CSV exported. Verify data access permissions before enabling live exports.");
  }

  // Mark the current sidebar item.
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === pageName);
  });
  refreshIcons();

  // Sidebar mobile controls.
  document.querySelector("[data-open-sidebar]")?.addEventListener("click", () => {
    document.querySelector(".sidebar")?.classList.add("open");
    document.querySelector(".mobile-overlay")?.classList.add("show");
  });
  document.querySelector("[data-close-sidebar]")?.addEventListener("click", closeSidebar);
  document.querySelectorAll("[data-close-menu]").forEach(button => button.addEventListener("click", closeSidebar));

  // Table search filters the visible rows on the current page.
  document.querySelectorAll("[data-table-search]").forEach(input => {
    input.addEventListener("input", () => {
      const table = document.getElementById(input.dataset.tableSearch);
      if (!table) return;
      const query = input.value.trim().toLowerCase();
      table.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    });
  });

  document.querySelectorAll("[data-table-filter]").forEach(select => {
    select.addEventListener("change", () => {
      const table = document.getElementById(select.dataset.tableFilter);
      if (!table) return;
      const query = select.value.toLowerCase();
      table.querySelectorAll("tbody tr").forEach(row => {
        const matchesSearch = row.textContent.toLowerCase().includes(
          table.querySelector("[data-search-input]")?.value?.toLowerCase() || ""
        );
        const matchesFilter = !query || row.textContent.toLowerCase().includes(query);
        row.style.display = matchesSearch && matchesFilter ? "" : "none";
      });
    });
  });

  document.querySelector("[data-global-search]")?.addEventListener("input", event => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll("tbody tr[data-searchable]").forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
    });
    document.querySelectorAll(".service-card").forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  });

  document.querySelectorAll("[data-demo-form]").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      showToast("Demo form validated. No settings were sent to a server.");
    });
  });

  document.querySelectorAll("[data-demo-toggle]").forEach(toggle => {
    toggle.addEventListener("change", () => {
      showToast(`${toggle.dataset.demoToggle}: demo state changed. This was not saved to a backend.`);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", closeModal));
  modal?.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
      closeSidebar();
    }
  });

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const record = button.dataset.record || "this item";

    if (action === "refresh-page") {
      showToast("Preview refreshed.");
    } else if (action === "help") {
      openModal("Admin help", "This is a frontend preview. Each section uses sample data until API endpoints are connected.", "For production, ask the backend developer for endpoint documentation, role permissions and expected response formats.");
    } else if (action === "notifications") {
      openModal("Notifications", "There are no live notifications connected in this preview.");
    } else if (action === "profile-menu") {
      openModal("Demo admin profile", "Signed-in profile display: Elleks Admin · Super Admin (demo). Connect the real admin identity endpoint before production.");
    } else if (action === "logout") {
      sessionStorage.removeItem("numbahubAdminDemoSession");
      window.location.href = `${rootPath}login.html`;
    } else if (action === "forgot-password") {
      openModal("Password recovery", "Connect this action to your backend's admin password-reset flow. Do not reveal whether an email address exists.");
    } else if (action === "view-record") {
      openModal("Record details", `${record} is a sample record in this frontend preview. Live details will be loaded from an authorized API endpoint.`, "No account, wallet, order or provider record was changed.");
    } else if (action === "add-user") {
      openModal("Add user", "Connect this form to the backend's authorized user creation workflow. Public customer registration should remain separate from admin access.");
    } else if (action === "invite-staff") {
      openModal("Invite staff member", "The backend should validate the inviter's permissions, create a time-limited invitation, and record the action in the audit log.");
    } else if (action === "request-adjustment") {
      openModal("Request wallet adjustment", "A production workflow should require customer ID, amount, currency, reason, idempotency protection and approval policy. This demo does not change balances.");
    } else if (action === "configure-service") {
      openModal(`Configure ${record}`, "This is the service configuration entry point. Connect it to a backend endpoint that validates service availability, provider mapping and pricing permissions.");
    } else if (action === "configure-provider") {
      openModal(`Configure ${record}`, "Provider credentials must be submitted securely to the backend and never displayed back in full. Live health checks should run server-side.");
    } else if (action === "add-provider") {
      openModal("Add provider", "Add a provider through a backend-managed integration registry. Store credentials in a secure server-side secret store.");
    } else if (action === "edit-prices" || action === "edit-price") {
      openModal("Edit pricing", `Pricing editor for ${record}. In production, the backend must validate provider cost, currency, minimum margin and effective date before saving.`);
    } else if (action === "create-ticket") {
      openModal("Create support ticket", "Connect this action to your support API, including assignment, priority, status and an audit trail.");
    } else if (action === "apply-report") {
      showToast("Demo filters applied. Connect reporting API to load filtered results.");
    } else if (action === "export-table") {
      exportTable(button.dataset.table);
    } else if (action === "export-report") {
      const table = document.querySelector("table");
      if (table?.id) exportTable(table.id);
      else showToast("Connect the reporting endpoint to export live report data.");
    } else if (action === "save-policy") {
      showToast("Demo policy validated only. Server-side policy was not changed.");
    } else if (action === "quick-actions") {
      openModal("Quick actions", "Choose a section from the navigation to manage users, finance, services, orders or system settings. All sensitive actions require backend authorization.");
    } else if (action === "demo-page") {
      showToast("Pagination is a frontend demo. Connect API pagination for live records.");
    } else if (action === "modal-confirm") {
      closeModal();
      showToast("Demo action acknowledged. No backend changes were made.");
    }
  });

  const loginForm = document.getElementById("admin-login-form");
  loginForm?.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("admin-email");
    const password = document.getElementById("admin-password");
    if (!email.reportValidity() || password.value.length < 6) {
      showToast("Enter a valid email and a password with at least 6 characters.", "error");
      password.focus();
      return;
    }
    sessionStorage.setItem("numbahubAdminDemoSession", "active");
    showToast("Demo sign-in successful. This is not real authentication.");
    window.setTimeout(() => { window.location.href = "index.html"; }, 500);
  });

  refreshIcons();
});
