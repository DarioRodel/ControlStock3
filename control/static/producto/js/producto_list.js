
document.addEventListener("DOMContentLoaded", function () {
  // -------- Capturamos elementos del DOM una sola vez --------
  const selectAllCheckbox = document.getElementById("selectAll");
  const rowCheckboxes = document.querySelectorAll(".row-checkbox");
  const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
  const bulkDeleteForm = document.getElementById("bulkDeleteForm");
  const selectedProductsContainer = document.getElementById("selectedProducts");
  const filterSidebar = document.getElementById("filterSidebar");
  const toggleFilterBtn = document.getElementById("toggleFilterSidebarBtn");
  const closeFilterBtn = document.getElementById("closeFilterSidebar");
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
      toggleDeleteBtn();
      updateSelectedProducts();

      // Lógica para estado indeterminado del "select all"
      const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
      const anyChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
      selectAllCheckbox.checked = allChecked;
      selectAllCheckbox.indeterminate = !allChecked && anyChecked;
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

  // 6) Toggle del sidebar de filtros
  if (toggleFilterBtn && filterSidebar) {
    toggleFilterBtn.addEventListener("click", function() {
      filterSidebar.classList.toggle("show");
    });
  }

  // 7) Cerrar el sidebar de filtros con el botón
  if (closeFilterBtn) {
    closeFilterBtn.addEventListener("click", function() {
      filterSidebar.classList.remove("show");
    });
  }

  // 8) Cerrar el sidebar de filtros con ESC
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && filterSidebar && filterSidebar.classList.contains("show")) {
      filterSidebar.classList.remove("show");
    }
  });

  // 9) Botón para limpiar filtros
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function(e) {
      e.preventDefault();
      filterSidebar.classList.remove("show");
      setTimeout(() => {
        window.location.href = clearFiltersBtn.href;
      }, 300);
    });
  }
});