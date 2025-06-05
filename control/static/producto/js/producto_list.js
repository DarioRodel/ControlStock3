document.addEventListener("DOMContentLoaded", function () {
  // -------- Variables --------
  const selectAllCheckbox = document.getElementById("selectAll");
  const rowCheckboxes     = document.querySelectorAll(".row-checkbox");
  const bulkDeleteBtn     = document.getElementById("bulkDeleteBtn");
  const bulkDeleteForm    = document.getElementById("bulkDeleteForm");
  const selectedProductsContainer = document.getElementById("selectedProducts");

  // Habilita o deshabilita el botón de eliminar según haya alguna fila seleccionada
  function toggleDeleteBtn() {
    const anySelected = Array.from(rowCheckboxes).some(cb => cb.checked);
    if (bulkDeleteBtn) bulkDeleteBtn.disabled = !anySelected;
  }

  // Rellena inputs hidden con “selected_products” antes del submit
  function updateSelectedProducts() {
    selectedProductsContainer.innerHTML = "";
    rowCheckboxes.forEach(cb => {
      if (cb.checked) {
        const input = document.createElement("input");
        input.type  = "hidden";
        input.name  = "selected_products";
        input.value = cb.value;
        selectedProductsContainer.appendChild(input);
      }
    });
  }

  // “Select All” global
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      rowCheckboxes.forEach(cb => cb.checked = this.checked);
      toggleDeleteBtn();
      updateSelectedProducts();
    });
  }

  // Chequeo individual por fila
  rowCheckboxes.forEach(cb => {
    cb.addEventListener("change", function () {
      // Si desmarcamos una fila, desmarcar “selectAll”
      if (!this.checked && selectAllCheckbox.checked) {
        selectAllCheckbox.checked = false;
      }
      toggleDeleteBtn();
      updateSelectedProducts();
    });
  });

  // Confirmación al hacer “submit” para borrar
  if (bulkDeleteForm) {
    bulkDeleteForm.addEventListener("submit", function (e) {
      const seleccionados = Array.from(rowCheckboxes).filter(cb => cb.checked);
      if (seleccionados.length === 0 || !confirm(`¿Eliminar ${seleccionados.length} productos seleccionados?`)) {
        e.preventDefault();
      }
    });
  }

  // Cerrar el sidebar con la tecla ESC (opcional)
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      const filterSidebar = document.getElementById("filterSidebar");
      if (filterSidebar.classList.contains("show")) {
        new bootstrap.Collapse(filterSidebar).hide();
      }
    }
  });
});
