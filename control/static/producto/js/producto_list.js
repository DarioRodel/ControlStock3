// static/stock/producto_list.js

document.addEventListener("DOMContentLoaded", function () {
  // -------- Capturamos elementos del DOM --------
  const selectAllCheckbox          = document.getElementById("selectAll");
  const rowCheckboxes              = document.querySelectorAll(".row-checkbox");
  const bulkDeleteBtn              = document.getElementById("bulkDeleteBtn");
  const bulkDeleteForm             = document.getElementById("bulkDeleteForm");
  const selectedProductsContainer  = document.getElementById("selectedProducts");

  // 1) Habilita o deshabilita el botón de eliminar
  function toggleDeleteBtn() {
    // Si existe el botón, comprobamos si al menos un checkbox está marcado
    if (!bulkDeleteBtn) return;

    const anySelected = Array.from(rowCheckboxes).some(cb => cb.checked);
    bulkDeleteBtn.disabled = !anySelected;
  }

  // 2) Inyecta inputs hidden con los IDs de productos seleccionados
  function updateSelectedProducts() {
    if (!selectedProductsContainer) return;

    // Vaciamos siempre el contenedor
    selectedProductsContainer.innerHTML = "";

    // Por cada checkbox marcado, añadimos <input hidden name="selected_products" value="ID">
    rowCheckboxes.forEach(cb => {
      if (cb.checked) {
        const input  = document.createElement("input");
        input.type   = "hidden";
        input.name   = "selected_products";
        input.value  = cb.value;  // el valor (=ID) que viene del atributo value="{{ producto.pk }}"
        selectedProductsContainer.appendChild(input);
      }
    });
  }

  // 3) Lógica para “Select All” (encabezado)
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      // Al marcar/desmarcar este “Select All”, marcamos o desmarcamos TODOS los row-checkbox
      rowCheckboxes.forEach(cb => cb.checked = this.checked);
      toggleDeleteBtn();
      updateSelectedProducts();
    });
  }

  // 4) Lógica para cada checkbox individual de la fila
  rowCheckboxes.forEach(cb => {
    cb.addEventListener("change", function () {
      // Si desmarcamos un checkbox individual y “Select All” estaba marcado, desmarcamos “Select All”
      if (!this.checked && selectAllCheckbox && selectAllCheckbox.checked) {
        selectAllCheckbox.checked = false;
      }
      toggleDeleteBtn();
      updateSelectedProducts();
    });
  });

  // 5) Antes de enviar el formulario, inyectamos los inputs hidden y pedimos confirmación
  if (bulkDeleteForm) {
    bulkDeleteForm.addEventListener("submit", function (e) {
      // Primero inyectamos los inputs al div#selectedProducts
      updateSelectedProducts();

      // Recolectamos cuántos checkboxes están marcados
      const seleccionados = Array.from(rowCheckboxes).filter(cb => cb.checked);

      // Si no hay ninguno marcado, ó el usuario cancela el confirm, prevenimos envío
      if (seleccionados.length === 0 || !confirm(`¿Eliminar ${seleccionados.length} producto(s) seleccionado(s)?`)) {
        e.preventDefault();
      }
    });
  }

  // 6) (Opcional) Cerrar el sidebar de filtros con ESC
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      const filterSidebar = document.getElementById("filterSidebar");
      if (filterSidebar && filterSidebar.classList.contains("show")) {
        new bootstrap.Collapse(filterSidebar).hide();
      }
    }
  });
});
