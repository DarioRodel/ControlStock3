document.addEventListener("DOMContentLoaded", function () {
  // -------- Capturamos elementos del DOM una sola vez --------
  const selectAllCheckbox = document.getElementById("selectAll");
  const rowCheckboxes = document.querySelectorAll(".row-checkbox");
  const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
  const bulkDeleteForm = document.getElementById("bulkDeleteForm");
  const selectedProductsContainer = document.getElementById("selectedProducts");
  const filterSidebar = document.getElementById("filterSidebar");
  const closeFilterBtn = document.querySelector("[data-bs-target='#filterSidebar']");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");

  // 1) Habilita o deshabilita el botón de eliminar
  function toggleDeleteBtn() {
    if (!bulkDeleteBtn) return;
    const anySelected = Array.from(rowCheckboxes).some(cb => cb.checked);
    bulkDeleteBtn.disabled = !anySelected;
  }

  // 2) Inyecta inputs hidden con los IDs de productos seleccionados
  function updateSelectedProducts() {
    if (!selectedProductsContainer) return;
    selectedProductsContainer.innerHTML = "";
    
    rowCheckboxes.forEach(cb => {
      if (cb.checked) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "selected_products";
        input.value = cb.value;
        selectedProductsContainer.appendChild(input);
      }
    });
  }

  // 3) Lógica para "Select All"
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      rowCheckboxes.forEach(cb => cb.checked = this.checked);
      toggleDeleteBtn();
      updateSelectedProducts();
    });
  }

  // 4) Lógica para checkboxes individuales
  rowCheckboxes.forEach(cb => {
    cb.addEventListener("change", function () {
      if (!this.checked && selectAllCheckbox && selectAllCheckbox.checked) {
        selectAllCheckbox.checked = false;
      }
      toggleDeleteBtn();
      updateSelectedProducts();
    });
  });

  // 5) Confirmación antes de eliminar
  if (bulkDeleteForm) {
    bulkDeleteForm.addEventListener("submit", function (e) {
      updateSelectedProducts();
      const seleccionados = Array.from(rowCheckboxes).filter(cb => cb.checked);
      
      if (seleccionados.length === 0 || !confirm(`¿Eliminar ${seleccionados.length} producto(s) seleccionado(s)?`)) {
        e.preventDefault();
      }
    });
  }

  // 6) Cerrar el sidebar de filtros con ESC
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    const filterSidebar = document.getElementById("filterSidebar");
    if (filterSidebar && filterSidebar.classList.contains("show")) {
      new bootstrap.Collapse(filterSidebar).hide();
    }
  }
});

// 7) Botón para cerrar manualmente el sidebar
const closeBtn = document.getElementById("closeFilterSidebar");
if (closeBtn) {
  closeBtn.addEventListener("click", function () {
    const sidebar = document.getElementById("filterSidebar");
    if (sidebar && sidebar.classList.contains("show")) {
      new bootstrap.Collapse(sidebar).hide();
    }
  });
}

// 8) Botón para limpiar filtros también colapsa el sidebar
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", function (e) {
    e.preventDefault(); // evita que el enlace navegue inmediatamente

    const sidebar = document.getElementById("filterSidebar");
    if (sidebar && sidebar.classList.contains("show")) {
      const collapse = new bootstrap.Collapse(sidebar, {
        toggle: false
      });
      collapse.hide();

      // Esperamos un poco para que el colapso se vea, luego redirigimos
      setTimeout(() => {
        window.location.href = clearFiltersBtn.href;
      }, 300); // 300ms = duración del colapso
    } else {
      // Si el sidebar ya está oculto, redirige de inmediato
      window.location.href = clearFiltersBtn.href;
    }
  });
}


});