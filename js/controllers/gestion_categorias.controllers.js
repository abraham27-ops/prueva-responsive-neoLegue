// ============================================================================
// CONTROLADOR DE GESTIÓN DE CATEGORÍAS – NeoLeague
// Misión 13: Administración con Modal, Rango de Edad, Filtros y SweetAlert2
// ============================================================================

import { getCategoria, getCategorias, createCategorias, updateCategoria, deleteCategoria } from "../services/gestion_categorias.services.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tablaCategorias = document.getElementById("tablaCategorias");
    const frmCategoria = document.getElementById("frmCategorias");
    const txtNombre = document.getElementById("txtCategoria");
    const txtEdadMinima = document.getElementById("txtEdadMinima");
    const txtEdadMaxima = document.getElementById("txtEdadMaxima");
    const btnGuardar = document.getElementById("btnGuardar");
    const idCategoria = document.getElementById("idCategoria");
    const modalLabel = document.getElementById("modalCrearCategoriaLabel");
    const contadorCategorias = document.getElementById("contadorCategorias");
    const txtBuscar = document.getElementById("txtBuscarCategoria");
    const btnAbrirModalCrear = document.getElementById("btnAbrirModalCrear");

    // Instancia del Modal Bootstrap
    const modalElement = document.getElementById("modalCrearCategoria");
    let modalInstance = null;
    if (modalElement && typeof bootstrap !== 'undefined') {
        modalInstance = new bootstrap.Modal(modalElement);
    }

    let categoriasCache = [];
    let filtroTexto = "";

    // ---- MOSTRAR CATEGORÍAS EN LA TABLA ----
    async function mostrarCategorias() {
        try {
            categoriasCache = await getCategorias();
            renderizarTabla();
        } catch (error) {
            console.error("Error al cargar categorías:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de carga',
                text: 'No se pudieron cargar las categorías oficiales.',
                confirmButtonColor: '#226137'
            });
        }
    }

    function renderizarTabla() {
        if (!tablaCategorias) return;
        tablaCategorias.innerHTML = "";

        const filtradas = categoriasCache.filter(cat => {
            if (!filtroTexto) return true;
            const busqueda = `${cat.nombre} ${cat.edadMinima} ${cat.edadMaxima || cat.EdadMaxima}`.toLowerCase();
            return busqueda.includes(filtroTexto.toLowerCase());
        });

        if (contadorCategorias) {
            contadorCategorias.textContent = `${filtradas.length} categoría${filtradas.length !== 1 ? 's' : ''} registrada${filtradas.length !== 1 ? 's' : ''}`;
        }
        
        const statTotal = document.getElementById("statTotalCat");
        if (statTotal) {
            statTotal.textContent = filtradas.length;
        }

        if (filtradas.length === 0) {
            tablaCategorias.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5 text-muted">
                        <div class="p-4">
                            <i class="fas fa-layer-group mb-3 d-block" style="font-size: 2.5rem; opacity: 0.3;"></i>
                            <h6 class="fw-bold text-secondary">No se encontraron divisiones o categorías</h6>
                            <p class="small mb-0 text-muted">Intenta buscar con otros términos o crea una nueva categoría oficial.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        filtradas.forEach((cat) => {
            const min = cat.edadMinima;
            const max = cat.edadMaxima || cat.EdadMaxima;
            const rango = max - min;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="badge-id">#${cat.id}</span></td>
                <td class="text-start fw-bold text-dark">${cat.nombre}</td>
                <td>
                    <span class="badge-edad">
                        <i class="fas fa-arrow-down small text-success"></i> ${min} años
                    </span>
                </td>
                <td>
                    <span class="badge-edad">
                        <i class="fas fa-arrow-up small text-success"></i> ${max} años
                    </span>
                </td>
                <td>
                    <span class="badge-rango-total">
                        ${rango} año${rango !== 1 ? 's' : ''} de diferencia
                    </span>
                </td>
                <td>
                    <!-- Botones de Acción (Consistentes con Estudiantes y Torneos) -->
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-action-cat me-1 btn-editar-cat" title="Editar Categoría" data-id="${cat.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-action-cat btn-eliminar-cat" title="Eliminar Categoría" data-id="${cat.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;

            // Eventos en botones
            const btnEditar = tr.querySelector(".btn-editar-cat");
            btnEditar.addEventListener("click", () => colocarDatosFormulario(cat.id));

            const btnEliminar = tr.querySelector(".btn-eliminar-cat");
            btnEliminar.addEventListener("click", () => borrarCategoria(cat.id));

            tablaCategorias.appendChild(tr);
        });
    }

    // ---- FILTRO DE BÚSQUEDA EN TIEMPO REAL ----
    if (txtBuscar) {
        txtBuscar.addEventListener("input", (e) => {
            filtroTexto = e.target.value.trim();
            renderizarTabla();
        });
    }

    // ---- ABRIR MODAL PARA CREAR NUEVO ----
    if (btnAbrirModalCrear) {
        btnAbrirModalCrear.addEventListener("click", () => {
            if (frmCategoria) frmCategoria.reset();
            idCategoria.value = "";
            if (modalLabel) {
                modalLabel.innerHTML = `<i class="fas fa-layer-group text-warning me-2"></i> Nueva Categoría`;
            }
            if (btnGuardar) {
                btnGuardar.innerHTML = `<i class="fas fa-save me-1"></i> Guardar Categoría`;
            }
        });
    }

    // ---- CREAR O ACTUALIZAR CATEGORÍA ----
    if (frmCategoria) {
        frmCategoria.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = idCategoria.value.trim();
            const nombre = txtNombre.value.trim();
            const min = parseInt(txtEdadMinima.value, 10);
            const max = parseInt(txtEdadMaxima.value, 10);

            if (!nombre || isNaN(min) || isNaN(max)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Por favor ingresa el nombre, la edad mínima y la edad máxima.',
                    confirmButtonColor: '#226137'
                });
                return;
            }

            if (min >= max) {
                Swal.fire({
                    icon: 'error',
                    title: 'Rango de edades inválido',
                    text: 'La edad mínima debe ser estrictamente menor que la edad máxima.',
                    confirmButtonColor: '#226137'
                });
                return;
            }

            const categoriaObj = {
                nombre: nombre,
                edadMinima: min,
                edadMaxima: max
            };

            try {
                if (id !== "") {
                    await updateCategoria(id, categoriaObj);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Categoría Actualizada!',
                        text: `La división "${nombre}" ha sido modificada con éxito.`,
                        confirmButtonColor: '#226137',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    await createCategorias(categoriaObj);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Categoría Creada!',
                        text: `Se ha registrado la nueva división "${nombre}" (${min} a ${max} años).`,
                        confirmButtonColor: '#226137',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }

                if (modalInstance) modalInstance.hide();
                await mostrarCategorias();
            } catch (error) {
                console.error("Error al guardar categoría:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar',
                    text: 'Ocurrió un problema al intentar guardar en el sistema.',
                    confirmButtonColor: '#226137'
                });
            }
        });
    }

    // ---- CARGAR DATOS EN MODAL PARA EDITAR ----
    async function colocarDatosFormulario(id) {
        try {
            const cat = await getCategoria(id);

            idCategoria.value = cat.id;
            txtNombre.value = cat.nombre;
            txtEdadMinima.value = cat.edadMinima;
            txtEdadMaxima.value = cat.edadMaxima || cat.EdadMaxima;

            if (modalLabel) {
                modalLabel.innerHTML = `<i class="fas fa-edit text-warning me-2"></i> Editar Categoría #${cat.id}`;
            }
            if (btnGuardar) {
                btnGuardar.innerHTML = `<i class="fas fa-sync-alt me-1"></i> Actualizar Categoría`;
            }

            if (modalInstance) {
                modalInstance.show();
            } else if (typeof bootstrap !== 'undefined') {
                const m = new bootstrap.Modal(document.getElementById("modalCrearCategoria"));
                m.show();
            }
        } catch (error) {
            console.error("Error al cargar para edición:", error);
            Swal.fire({
                icon: 'error',
                title: 'No se pudieron cargar los datos',
                text: 'Hubo un error al recuperar la información de la categoría.',
                confirmButtonColor: '#226137'
            });
        }
    }

    // ---- ELIMINAR CATEGORÍA ----
    async function borrarCategoria(id) {
        try {
            const cat = await getCategoria(id);
            Swal.fire({
                title: '¿Eliminar Categoría?',
                html: `Estás a punto de borrar la categoría oficial <strong>"${cat.nombre}" (${cat.edadMinima}-${cat.edadMaxima || cat.EdadMaxima} años)</strong>.<br>Esta acción no se puede deshacer.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '<i class="fas fa-trash me-1"></i> Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deleteCategoria(id);
                    await mostrarCategorias();
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminada',
                        text: 'La categoría ha sido removida del sistema.',
                        confirmButtonColor: '#226137',
                        timer: 1800,
                        showConfirmButton: false
                    });
                }
            });
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de eliminación',
                text: 'No se pudo eliminar la categoría del sistema.',
                confirmButtonColor: '#226137'
            });
        }
    }

    // Inicializar tabla al cargar
    await mostrarCategorias();
});
