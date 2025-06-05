// static/stock/producto_list.js

document.addEventListener("DOMContentLoaded", function () {
  // -------- Variables --------
  const selectAllCheckbox = document.getElementById("selectAll");
  const rowCheckboxes     = document.querySelectorAll(".row-checkbox");
  const bulkDeleteBtn     = document.getElementById("bulkDeleteBtn");
  const bulkDeleteForm    = document.getElementById("bulkDeleteForm");
  const selectedProductsContainer = document.getElementById("selectedProducts");

  // 1) Habilita o deshabilita el botón de eliminar según haya alguna fila seleccionada
  function toggleDeleteBtn() {
    const anySelected = Array.from(rowCheckboxes).some(cb => cb.checked);
    if (bulkDeleteBtn) {
      bulkDeleteBtn.disabled = !anySelected;
    }
  }

  // 2) Rellena inputs hidden con “selected_products” antes del submit
  function updateSelectedProducts() {
    // Limpiamos contenedor
    selectedProductsContainer.innerHTML = "";

    // Por cada checkbox marcado, creamos un <input type="hidden" name="selected_products" value="ID" />
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

  // 3) “Select All” global
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      rowCheckboxes.forEach(cb => cb.checked = this.checked);
      toggleDeleteBtn();
      updateSelectedProducts();
    });
  }

  // 4) Chequeo individual por fila
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

  // 5) Confirmación al hacer “submit” para borrar
  if (bulkDeleteForm) {
    bulkDeleteForm.addEventListener("submit", function (e) {
      // Inyectamos los inputs ocultos justo antes de enviar
      updateSelectedProducts();

      // Comprobamos cuántos han sido seleccionados
      const seleccionados = Array.from(rowCheckboxes).filter(cb => cb.checked);

      // Si no hay ninguno, o si el usuario cancela el confirm, prevenimos el envío
      if (seleccionados.length === 0 || !confirm(`¿Eliminar ${seleccionados.length} producto(s) seleccionado(s)?`)) {
        e.preventDefault();
      }
    });
  }

  // 6) (Opcional) cerrar el sidebar con la tecla ESC
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      const filterSidebar = document.getElementById("filterSidebar");
      if (filterSidebar && filterSidebar.classList.contains("show")) {
        new bootstrap.Collapse(filterSidebar).hide();
      }
    }
  });
});
