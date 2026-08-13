// ============================================================================
// CONTROLADOR DE GESTIÓN DE DEPORTES – NeoLeague
// Preparado para consumo de API. Datos mockeados temporalmente en LocalStorage.
// ============================================================================

const STORAGE_KEY_DEPORTES = 'nl_deportes_mock';

// Datos de prueba (verdaderos) para cuando no hay API conectada
const DEPORTES_DEFAULT = [
    { id: 1, nombre: 'Fútbol', iconoClase: 'fas fa-futbol text-success' },
    { id: 2, nombre: 'Baloncesto', iconoClase: 'fas fa-basketball-ball text-warning' },
    { id: 3, nombre: 'Voleibol', iconoClase: 'fas fa-volleyball-ball text-primary' },
    { id: 4, nombre: 'Natación', iconoClase: 'fas fa-swimmer text-info' }
];

function obtenerDeportes() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY_DEPORTES));
    if (!data || data.length === 0) {
        data = [...DEPORTES_DEFAULT];
        localStorage.setItem(STORAGE_KEY_DEPORTES, JSON.stringify(data));
    }
    return data;
}

function guardarDeportes(deportes) {
    localStorage.setItem(STORAGE_KEY_DEPORTES, JSON.stringify(deportes));
}

document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const tablaDeportes = document.getElementById("tablaDeportes");
    const frmDeporte = document.getElementById("frmDeporte");
    const idDeporte = document.getElementById("idDeporte");
    const txtNombreDeporte = document.getElementById("txtNombreDeporte");
    const fileImagenDeporte = document.getElementById("fileImagenDeporte");
    const modalLabel = document.getElementById("modalCrearDeporteLabel");
    const btnGuardar = document.getElementById("btnGuardarDeporte");
    const contadorDeportes = document.getElementById("contadorDeportes");
    const txtBuscar = document.getElementById("txtBuscarDeporte");
    const btnAbrirModalCrear = document.getElementById("btnAbrirModalCrear");

    // Instancia del modal de Bootstrap
    const modalElement = document.getElementById("modalCrearDeporte");
    let modalInstance = null;
    if (modalElement && typeof bootstrap !== 'undefined') {
        modalInstance = new bootstrap.Modal(modalElement);
    }

    let deportesCache = obtenerDeportes();
    let filtroTexto = "";

    // ---- RENDERIZAR TABLA ----
    function renderizarTabla() {
        if (!tablaDeportes) return;
        tablaDeportes.innerHTML = "";

        const filtrados = deportesCache.filter(dep => {
            if (filtroTexto) {
                return dep.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
            }
            return true;
        });

        if (contadorDeportes) {
            contadorDeportes.textContent = `${filtrados.length} deporte${filtrados.length !== 1 ? 's' : ''}`;
        }

        if (filtrados.length === 0) {
            tablaDeportes.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-5 text-muted">
                        <div class="p-4">
                            <i class="fas fa-search mb-3 d-block" style="font-size: 2rem; opacity: 0.3;"></i>
                            <h6 class="fw-bold text-secondary">No se encontraron deportes</h6>
                            <p class="small mb-0 text-muted">No hay registros que coincidan con la búsqueda.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        filtrados.forEach(dep => {
            const tr = document.createElement("tr");
            
            // Si el deporte no tiene una clase de icono específica (nuevo), ponemos un icono genérico
            const icono = dep.iconoClase ? dep.iconoClase : 'fas fa-running text-secondary';

            tr.innerHTML = `
                <td class="fw-semibold text-muted">#${dep.id}</td>
                <td>
                    <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-light border shadow-sm" style="width: 45px; height: 45px;">
                        <i class="${icono} fs-5"></i>
                    </div>
                </td>
                <td class="text-start fw-bold text-dark fs-6">${dep.nombre}</td>
                <td class="text-nowrap">
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-action-deporte me-1 btn-editar" title="Editar" data-id="${dep.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-action-deporte btn-eliminar" title="Eliminar" data-id="${dep.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;

            // Eventos de los botones de acción
            const btnEditar = tr.querySelector(".btn-editar");
            btnEditar.addEventListener("click", () => prepararEdicion(dep.id));

            const btnEliminar = tr.querySelector(".btn-eliminar");
            btnEliminar.addEventListener("click", () => eliminarDeporte(dep.id));

            tablaDeportes.appendChild(tr);
        });
    }

    // ---- BUSCADOR EN TIEMPO REAL ----
    if (txtBuscar) {
        txtBuscar.addEventListener("input", (e) => {
            filtroTexto = e.target.value.trim();
            renderizarTabla();
        });
    }

    // ---- ABRIR MODAL PARA CREAR (LIMPIAR FORMULARIO) ----
    if (btnAbrirModalCrear) {
        btnAbrirModalCrear.addEventListener("click", () => {
            if (frmDeporte) frmDeporte.reset();
            idDeporte.value = "";
            if (modalLabel) modalLabel.innerHTML = `<i class="fas fa-plus-circle text-warning me-2"></i> Registrar Deporte`;
            if (btnGuardar) btnGuardar.innerHTML = `<i class="fas fa-save me-1"></i> Guardar Deporte`;
        });
    }

    // ---- GUARDAR O ACTUALIZAR (SUBMIT DEL FORMULARIO) ----
    if (frmDeporte) {
        frmDeporte.addEventListener("submit", (e) => {
            e.preventDefault();

            const id = idDeporte.value.trim();
            const nombre = txtNombreDeporte.value.trim();
            
            // Validación básica (El front y back validarán más adelante)
            if (!nombre) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo obligatorio',
                    text: 'El nombre del deporte no puede estar vacío.',
                    confirmButtonColor: '#226137'
                });
                return;
            }

            if (id !== "") {
                // Modo Edición
                const idx = deportesCache.findIndex(d => d.id === parseInt(id, 10));
                if (idx !== -1) {
                    deportesCache[idx].nombre = nombre;
                    // En una API real, aquí enviaríamos el archivo (fileImagenDeporte.files[0]) vía FormData a un endpoint PUT/PATCH
                    guardarDeportes(deportesCache);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualizado',
                        text: `El deporte "${nombre}" se actualizó correctamente.`,
                        confirmButtonColor: '#226137',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } else {
                // Modo Creación
                const maxId = deportesCache.length > 0 ? Math.max(...deportesCache.map(d => d.id)) : 0;
                deportesCache.push({
                    id: maxId + 1,
                    nombre: nombre,
                    iconoClase: 'fas fa-running text-secondary' // Por defecto para nuevos en el mock
                });
                
                // En una API real, aquí haríamos un POST con FormData
                guardarDeportes(deportesCache);

                Swal.fire({
                    icon: 'success',
                    title: 'Deporte Creado',
                    text: `El deporte "${nombre}" ha sido registrado en el sistema.`,
                    confirmButtonColor: '#226137',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            if (modalInstance) modalInstance.hide();
            renderizarTabla();
        });
    }

    // ---- PREPARAR EDICIÓN ----
    function prepararEdicion(id) {
        const dep = deportesCache.find(item => item.id === parseInt(id, 10));
        if (!dep) return;

        idDeporte.value = dep.id;
        txtNombreDeporte.value = dep.nombre;
        
        // No se puede asignar el value a un <input type="file"> por seguridad del navegador, 
        // pero en la interfaz mostramos que estamos editando.
        if (fileImagenDeporte) fileImagenDeporte.value = "";

        if (modalLabel) modalLabel.innerHTML = `<i class="fas fa-edit text-warning me-2"></i> Editar Deporte #${dep.id}`;
        if (btnGuardar) btnGuardar.innerHTML = `<i class="fas fa-sync-alt me-1"></i> Actualizar Deporte`;

        if (modalInstance) {
            modalInstance.show();
        } else if (typeof bootstrap !== 'undefined') {
            const m = new bootstrap.Modal(document.getElementById("modalCrearDeporte"));
            m.show();
        }
    }

    // ---- ELIMINAR DEPORTE ----
    function eliminarDeporte(id) {
        const dep = deportesCache.find(item => item.id === parseInt(id, 10));
        if (!dep) return;

        Swal.fire({
            title: '¿Estás seguro?',
            html: `Se eliminará el deporte <strong>"${dep.nombre}"</strong>. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash me-1"></i> Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // En una API real, aquí haríamos un DELETE al endpoint
                deportesCache = deportesCache.filter(item => item.id !== parseInt(id, 10));
                guardarDeportes(deportesCache);
                renderizarTabla();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El deporte ha sido borrado exitosamente.',
                    confirmButtonColor: '#226137',
                    timer: 1800,
                    showConfirmButton: false
                });
            }
        });
    }

    // Inicializar la tabla al cargar la página
    renderizarTabla();
});
