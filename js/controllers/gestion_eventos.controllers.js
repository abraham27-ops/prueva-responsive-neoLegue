// ============================================================================
// CONTROLADOR DE GESTIÓN DE EVENTOS – NeoLeague
// Catálogo Oficial de Acciones de Juego y Sanciones (SweetAlert2 & LocalStorage)
// ============================================================================

const STORAGE_KEY_EVENTOS = 'nl_catalogo_eventos';

const EVENTOS_DEFAULT = [
    { id: 1, nombre: 'Gol', tipo: 'Acciones de juego', deporte: 'Fútbol', valor: '+1 Gol', descripcion: 'Anotación en portería rival durante el tiempo reglamentario.' },
    { id: 2, nombre: 'Tarjeta Amarilla', tipo: 'Sanción', deporte: 'Fútbol', valor: 'Advertencia', descripcion: 'Amonestación arbitral por falta táctica o conducta antirreglamentaria.' },
    { id: 3, nombre: 'Tarjeta Roja', tipo: 'Sanción', deporte: 'Fútbol', valor: 'Expulsión', descripcion: 'Expulsión inmediata del jugador por falta grave o doble amarilla.' },
    { id: 4, nombre: 'Canasta 2 Pts', tipo: 'Acciones de juego', deporte: 'Baloncesto', valor: '+2 Puntos', descripcion: 'Tiro de campo dentro del perímetro de tres puntos.' },
    { id: 5, nombre: 'Canasta 3 Pts (Triple)', tipo: 'Acciones de juego', deporte: 'Baloncesto', valor: '+3 Puntos', descripcion: 'Tiro convertido desde más allá de la línea de 6.75 metros.' },
    { id: 6, nombre: 'Falta Técnica', tipo: 'Sanción', deporte: 'Baloncesto', valor: '1 Tiro + Posesión', descripcion: 'Infracción de conducta o protesta excesiva al árbitro.' },
    { id: 7, nombre: 'Punto de Set', tipo: 'Acciones de juego', deporte: 'Voleibol', valor: '+1 Punto', descripcion: 'Punto obtenido en jugada o por error del adversario.' },
    { id: 8, nombre: 'Récord de Disciplina', tipo: 'Acciones de juego', deporte: 'Natación', valor: 'Distinción Especial', descripcion: 'Marca de tiempo destacada en serie preliminar o final.' }
];

function getEventos() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTOS));
    if (!data || data.length === 0) {
        data = [...EVENTOS_DEFAULT];
        localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(data));
    }
    return data;
}

function saveEventos(eventos) {
    localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(eventos));
}

document.addEventListener("DOMContentLoaded", () => {
    const tablaEventos = document.getElementById("tablaEventos");
    const frmEvento = document.getElementById("frmEvento");
    const idEvento = document.getElementById("idEvento");
    const txtNombre = document.getElementById("txtNombreEvento");
    const selTipo = document.getElementById("selTipoEvento");
    const selDeporte = document.getElementById("selDeporteEvento");
    const txtValor = document.getElementById("txtValorEvento");
    const txtDesc = document.getElementById("txtDescEvento");
    const modalLabel = document.getElementById("modalCrearEventoLabel");
    const btnGuardar = document.getElementById("btnGuardarEvento");
    const contadorEventos = document.getElementById("contadorEventos");
    const txtBuscar = document.getElementById("txtBuscarEvento");
    const selFiltroDeporte = document.getElementById("selFiltroDeporte");
    const selFiltroTipo = document.getElementById("selFiltroTipo");
    const btnAbrirModalCrear = document.getElementById("btnAbrirModalCrear");

    const modalElement = document.getElementById("modalCrearEvento");
    let modalInstance = null;
    if (modalElement && typeof bootstrap !== 'undefined') {
        modalInstance = new bootstrap.Modal(modalElement);
    }

    let eventosCache = getEventos();
    let filtroTexto = "";
    let filtroTipo = "";
    let filtroDeporte = "";

    // ---- RENDERIZAR TABLA DE EVENTOS ----
    function renderizarTabla() {
        if (!tablaEventos) return;
        tablaEventos.innerHTML = "";

        const filtrados = eventosCache.filter(ev => {
            if (filtroTipo && ev.tipo !== filtroTipo) return false;
            if (filtroDeporte && ev.deporte !== filtroDeporte && ev.deporte !== "Todos") return false;
            if (filtroTexto) {
                const query = `${ev.nombre} ${ev.tipo} ${ev.deporte} ${ev.valor}`.toLowerCase();
                if (!query.includes(filtroTexto.toLowerCase())) return false;
            }
            return true;
        });

        if (contadorEventos) {
            contadorEventos.textContent = `${filtrados.length} evento${filtrados.length !== 1 ? 's' : ''} en el catálogo`;
        }

        if (filtrados.length === 0) {
            tablaEventos.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5 text-muted">
                        <div class="p-4">
                            <i class="fas fa-flag mb-3 d-block" style="font-size: 2.5rem; opacity: 0.3;"></i>
                            <h6 class="fw-bold text-secondary">No se encontraron eventos en este criterio</h6>
                            <p class="small mb-0 text-muted">Intenta cambiar los filtros o registra una nueva acción en el sistema.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        filtrados.forEach(ev => {
            const esAccion = ev.tipo === "Acciones de juego";
            const badgeTipoHtml = esAccion
                ? `<span class="badge-tipo-accion"><i class="fas fa-bolt"></i> ${ev.tipo}</span>`
                : `<span class="badge-tipo-sancion"><i class="fas fa-exclamation-triangle"></i> ${ev.tipo}</span>`;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="badge-id">#${ev.id}</span></td>
                <td class="text-start">
                    <div class="fw-bold text-dark">${ev.nombre}</div>
                    ${ev.descripcion ? `<small class="text-muted d-block mt-1" style="font-size: 0.78rem;">${ev.descripcion}</small>` : ''}
                </td>
                <td>${badgeTipoHtml}</td>
                <td>
                    <span class="badge-deporte-tag">${ev.deporte}</span>
                </td>
                <td>
                    <span class="badge-impacto">${ev.valor}</span>
                </td>
                <td class="text-nowrap">
                    <!-- Botones de Acción (Consistentes con todo el sistema) -->
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-action-ev me-1 btn-editar-ev" title="Editar Evento" data-id="${ev.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-action-ev btn-eliminar-ev" title="Eliminar Evento" data-id="${ev.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;

            const btnEditar = tr.querySelector(".btn-editar-ev");
            btnEditar.addEventListener("click", () => colocarDatosFormulario(ev.id));

            const btnEliminar = tr.querySelector(".btn-eliminar-ev");
            btnEliminar.addEventListener("click", () => borrarEvento(ev.id));

            tablaEventos.appendChild(tr);
        });
    }

    // ---- EVENTOS DE FILTRADO ----
    if (txtBuscar) {
        txtBuscar.addEventListener("input", (e) => {
            filtroTexto = e.target.value.trim();
            renderizarTabla();
        });
    }

    if (selFiltroDeporte) {
        selFiltroDeporte.addEventListener("change", (e) => {
            filtroDeporte = e.target.value;
            renderizarTabla();
        });
    }

    if (selFiltroTipo) {
        selFiltroTipo.addEventListener("change", (e) => {
            filtroTipo = e.target.value;
            renderizarTabla();
        });
    }

    // ---- ABRIR MODAL CREAR ----
    if (btnAbrirModalCrear) {
        btnAbrirModalCrear.addEventListener("click", () => {
            if (frmEvento) frmEvento.reset();
            idEvento.value = "";
            if (modalLabel) {
                modalLabel.innerHTML = `<i class="fas fa-flag text-warning me-2"></i> Nuevo Evento Oficial`;
            }
            if (btnGuardar) {
                btnGuardar.innerHTML = `<i class="fas fa-save me-1"></i> Guardar Evento`;
            }
        });
    }

    // ---- CREAR O ACTUALIZAR EVENTO ----
    if (frmEvento) {
        frmEvento.addEventListener("submit", (e) => {
            e.preventDefault();

            const id = idEvento.value.trim();
            const nombre = txtNombre.value.trim();
            const tipo = selTipo.value;
            const deporte = selDeporte.value;
            const valor = txtValor.value.trim();
            const desc = txtDesc.value.trim();

            if (!nombre || !tipo || !deporte || !valor) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Información incompleta',
                    text: 'Por favor completa el nombre, tipo de evento, deporte y valor.',
                    confirmButtonColor: '#226137'
                });
                return;
            }

            if (id !== "") {
                const idx = eventosCache.findIndex(ev => ev.id === parseInt(id, 10));
                if (idx !== -1) {
                    eventosCache[idx] = { id: parseInt(id, 10), nombre, tipo, deporte, valor, descripcion: desc };
                    saveEventos(eventosCache);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Evento Actualizado!',
                        text: `El evento "${nombre}" ha sido modificado exitosamente.`,
                        confirmButtonColor: '#226137',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } else {
                const maxId = eventosCache.length > 0 ? Math.max(...eventosCache.map(ev => ev.id)) : 0;
                eventosCache.push({
                    id: maxId + 1,
                    nombre,
                    tipo,
                    deporte,
                    valor,
                    descripcion: desc
                });
                saveEventos(eventosCache);
                Swal.fire({
                    icon: 'success',
                    title: '¡Evento Creado!',
                    text: `El evento "${nombre}" (${tipo}) se incorporó al catálogo oficial.`,
                    confirmButtonColor: '#226137',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            if (modalInstance) modalInstance.hide();
            renderizarTabla();
        });
    }

    // ---- COLOCAR DATOS PARA EDITAR ----
    function colocarDatosFormulario(id) {
        const ev = eventosCache.find(item => item.id === parseInt(id, 10));
        if (!ev) return;

        idEvento.value = ev.id;
        txtNombre.value = ev.nombre;
        selTipo.value = ev.tipo;
        selDeporte.value = ev.deporte;
        txtValor.value = ev.valor;
        txtDesc.value = ev.descripcion || "";

        if (modalLabel) {
            modalLabel.innerHTML = `<i class="fas fa-edit text-warning me-2"></i> Editar Evento #${ev.id}`;
        }
        if (btnGuardar) {
            btnGuardar.innerHTML = `<i class="fas fa-sync-alt me-1"></i> Actualizar Evento`;
        }

        if (modalInstance) {
            modalInstance.show();
        } else if (typeof bootstrap !== 'undefined') {
            const m = new bootstrap.Modal(document.getElementById("modalCrearEvento"));
            m.show();
        }
    }

    // ---- ELIMINAR EVENTO ----
    function borrarEvento(id) {
        const ev = eventosCache.find(item => item.id === parseInt(id, 10));
        if (!ev) return;

        Swal.fire({
            title: '¿Eliminar Evento Oficial?',
            html: `Estás a punto de eliminar <strong>"${ev.nombre}" (${ev.tipo})</strong> del catálogo.<br>Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash me-1"></i> Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                eventosCache = eventosCache.filter(item => item.id !== parseInt(id, 10));
                saveEventos(eventosCache);
                renderizarTabla();
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El evento ha sido retirado del catálogo institucional.',
                    confirmButtonColor: '#226137',
                    timer: 1800,
                    showConfirmButton: false
                });
            }
        });
    }

    // Inicializar la tabla
    renderizarTabla();
});
