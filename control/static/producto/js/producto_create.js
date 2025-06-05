// static/producto/js/producto_create.js
document.addEventListener("DOMContentLoaded", function () {
    // Inicializa
    const totalForms = document.getElementById("id_productoatributo_set-TOTAL_FORMS");
    const container = document.getElementById("atributos-container");
    const atributoOpciones = window.__atributoOpciones__ || {};

    // =====================
    // Validación de formulario principal
    // =====================
    document.querySelector("form").addEventListener("submit", function (event) {
        const camposRequeridos = [
            { id: "id_codigo_barras", nombre: "Código de Barras o Referencia" },
            { id: "id_nombre", nombre: "Nombre" },
            { id: "id_categoria", nombre: "Categoría" }
        ];
        let camposFaltantes = [];

        camposRequeridos.forEach(({ id, nombre }) => {
            const campo = document.getElementById(id);
            if (!campo || !campo.value.trim()) camposFaltantes.push(nombre);
        });

        if (camposFaltantes.length > 0) {
            event.preventDefault();
            alert("Por favor, completa los siguientes campos:\n- " + camposFaltantes.join("\n-"));
            document.getElementById(camposRequeridos[0].id).focus();
        }
    });

    // =====================
    // Manejadores de atributos existentes
    // =====================
    document.querySelectorAll(".atributo-select").forEach(select => {
        const opcionSelect = select.closest(".atributo-form").querySelector(".opcion-select");
        actualizarOpciones(select, opcionSelect);

        select.addEventListener("change", function () {
            actualizarOpciones(select, opcionSelect);
        });
    });

    // =====================
    // Agregar nuevo atributo
    // =====================
    document.getElementById("add-atributo").addEventListener("click", function () {
        const index = parseInt(totalForms.value);
        const div = document.createElement("div");
        div.className = "atributo-form mb-3 border p-3 position-relative";

        div.innerHTML = `
            <div class="row g-3 align-items-center">
                <div class="col-auto">
                    <input type="checkbox" class="attr-checkbox form-check-input">
                </div>
                <div class="col-md-5">
                    <label class="form-label mb-1">Atributo</label>
                    <select name="productoatributo_set-${index}-atributo"
                            id="id_productoatributo_set-${index}-atributo"
                            class="form-select atributo-select">
                        <option value="">Seleccionar atributo...</option>
                        ${Object.keys(atributoOpciones).map(id =>
                            `<option value="${id}">${atributoOpciones[id][0]?.atributo_nombre || "Atributo"}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-5">
                    <label class="form-label mb-1">Opción</label>
                    <select name="productoatributo_set-${index}-opcion"
                            id="id_productoatributo_set-${index}-opcion"
                            class="form-select opcion-select" disabled>
                        <option value="">Seleccionar opción...</option>
                    </select>
                </div>
            </div>
            <input type="hidden" name="productoatributo_set-${index}-id" id="id_productoatributo_set-${index}-id">
            <input type="hidden" name="productoatributo_set-${index}-DELETE" id="id_productoatributo_set-${index}-DELETE">
        `;

        container.appendChild(div);
        totalForms.value = index + 1;

        const atributoSelect = div.querySelector(".atributo-select");
        const opcionSelect = div.querySelector(".opcion-select");

        atributoSelect.addEventListener("change", () => actualizarOpciones(atributoSelect, opcionSelect));
    });

    // (Se ha eliminado toda referencia a `.remove-atributo`)

    // =====================
    // Cargar opciones según atributo
    // =====================
    function actualizarOpciones(atributoSelect, opcionSelect) {
        const atributoId = atributoSelect.value;
        const valorAnterior = opcionSelect.value;

        opcionSelect.innerHTML = '<option value="">Seleccionar opción...</option>';
        opcionSelect.disabled = !atributoId;

        if (atributoId && atributoOpciones[atributoId]) {
            atributoOpciones[atributoId].forEach(op => {
                const option = document.createElement("option");
                option.value = op.id;
                option.textContent = op.valor;
                if (op.id.toString() === valorAnterior) {
                    option.selected = true;
                }
                opcionSelect.appendChild(option);
            });
        }
    }

    // =====================
    // Previsualizar imagen
    // =====================
    const imagenInput = document.querySelector("input[type='file'][name='imagen']");
    if (imagenInput) {
        imagenInput.addEventListener("change", function () {
            const file = this.files[0];
            const preview = document.getElementById("preview-img");

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                preview.src = "";
                preview.style.display = "none";
            }
        });
    }
});
