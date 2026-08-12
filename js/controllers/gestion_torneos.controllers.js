// ============================================================================
// CONTROLADOR DE GESTIÓN DE TORNEOS – NeoLeague
// Misión 13: Administración de torneos, filtro por deporte, modal y año visible
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ---- DATOS MOCK DE TORNEOS INSTITUCIONALES ----
    // Guardar en localStorage para persistencia en sesión
    let torneos = JSON.parse(localStorage.getItem('nl_torneos')) || [
        {
            id: 1,
            nombre: 'Copa Neo',
            anio: 2026,
            deporte: 'Fútbol',
            categoria: 'Sub-18',
            tipo: 'Liga (Todos contra todos)',
            fechaInicio: '2026-02-15',
            fechaFin: '2026-06-30',
            estado: 'En Curso'
        },
        {
            id: 2,
            nombre: 'Intramuros',
            anio: 2026,
            deporte: 'Baloncesto',
            categoria: 'Libre',
            tipo: 'Eliminatoria directa / Play-offs',
            fechaInicio: '2026-03-01',
            fechaFin: '2026-05-15',
            estado: 'Programado'
        },
        {
            id: 3,
            nombre: 'Amistoso',
            anio: 2025,
            deporte: 'Voleibol',
            categoria: 'Sub-15',
            tipo: 'Torneo Relámpago',
            fechaInicio: '2025-10-10',
            fechaFin: '2025-10-12',
            estado: 'Finalizado'
        },
        {
            id: 4,
            nombre: 'Copa Intercolegial de Natación',
            anio: 2026,
            deporte: 'Natación',
            categoria: 'Libre',
            tipo: 'Grupos y Eliminatoria',
            fechaInicio: '2026-04-20',
            fechaFin: '2026-04-25',
            estado: 'Programado'
        }
    ];

    function guardarTorneos() {
        localStorage.setItem('nl_torneos', JSON.stringify(torneos));
    }

    const contenedorTorneos = document.getElementById('contenedorTorneos');
    const txtBuscar = document.getElementById('txtBuscarTorneo');
    const btnsFiltroDeporte = document.querySelectorAll('.btn-filtro-deporte');
    let filtroDeporteActivo = '';
    let filtroTextoActivo = '';

    // ---- RENDERIZAR TARJETAS DE TORNEOS ----
    function renderizarTorneos() {
        if (!contenedorTorneos) return;
        contenedorTorneos.innerHTML = '';

        const torneosFiltrados = torneos.filter(t => {
            const coincideDeporte = !filtroDeporteActivo || t.deporte === filtroDeporteActivo;
            const textoBuscar = `${t.nombre} ${t.anio} ${t.deporte} ${t.categoria}`.toLowerCase();
            const coincideTexto = !filtroTextoActivo || textoBuscar.includes(filtroTextoActivo.toLowerCase());
            return coincideDeporte && coincideTexto;
        });

        if (torneosFiltrados.length === 0) {
            contenedorTorneos.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="p-5 bg-white rounded-4 shadow-sm border">
                        <i class="fas fa-trophy text-muted mb-3" style="font-size: 3rem; opacity: 0.3;"></i>
                        <h5 class="fw-bold text-muted">No se encontraron torneos</h5>
                        <p class="text-secondary small mb-0">Intenta cambiar los filtros de búsqueda o crea un nuevo torneo.</p>
                    </div>
                </div>
            `;
            return;
        }

        torneosFiltrados.forEach(t => {
            // Icono por deporte
            let iconoDeporte = 'fa-trophy';
            if (t.deporte === 'Fútbol') iconoDeporte = 'fa-futbol';
            else if (t.deporte === 'Baloncesto') iconoDeporte = 'fa-basketball-ball';
            else if (t.deporte === 'Natación') iconoDeporte = 'fa-swimmer';
            else if (t.deporte === 'Voleibol') iconoDeporte = 'fa-volleyball-ball';

            // Clase por estado
            let claseEstado = 'status-programado';
            if (t.estado === 'En Curso') claseEstado = 'status-encurso';
            else if (t.estado === 'Finalizado') claseEstado = 'status-finalizado';

            const cardCol = document.createElement('div');
            cardCol.className = 'col-md-6 col-lg-4';
            cardCol.innerHTML = `
                <div class="torneo-card" data-id="${t.id}">
                    <div class="torneo-card-header">
                        <!-- Año del Torneo (Respetando coherencia visual institucional) -->
                        <span class="year-badge">
                            <i class="fas fa-calendar-alt"></i> ${t.anio}
                        </span>
                        <span class="sport-tag">
                            <i class="fas ${iconoDeporte}"></i> ${t.deporte}
                        </span>
                    </div>
                    
                    <div class="torneo-card-body">
                        <h3 class="torneo-title">${t.nombre}</h3>
                        <span class="torneo-type-badge">${t.tipo}</span>
                        
                        <ul class="torneo-meta-list">
                            <li class="torneo-meta-item">
                                <i class="fas fa-layer-group"></i>
                                <span><strong>Categoría:</strong> ${t.categoria}</span>
                            </li>
                            <li class="torneo-meta-item">
                                <i class="fas fa-calendar-day"></i>
                                <span><strong>Inicio:</strong> ${t.fechaInicio || 'Por definir'}</span>
                            </li>
                            <li class="torneo-meta-item">
                                <i class="fas fa-flag-checkered"></i>
                                <span><strong>Fin:</strong> ${t.fechaFin || 'Por definir'}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="torneo-card-footer">
                        <span class="status-badge ${claseEstado}">
                            <i class="fas fa-circle small me-1" style="font-size: 0.5rem;"></i> ${t.estado}
                        </span>
                        
                        <!-- Botones de Acción (Consistentes con Estudiantes y Usuarios) -->
                        <div class="torneo-actions">
                            <button type="button" class="btn btn-sm btn-outline-secondary btn-action-custom btn-editar-torneo" title="Editar Torneo" data-id="${t.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger btn-action-custom btn-eliminar-torneo" title="Eliminar Torneo" data-id="${t.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Evento click en la tarjeta para ir a Gestión de Partidos mostrando los partidos de ese torneo
            const cardElement = cardCol.querySelector('.torneo-card');
            cardElement.addEventListener('click', (e) => {
                // Si el clic fue en un botón de editar o eliminar, no redirigir
                if (e.target.closest('.btn-editar-torneo') || e.target.closest('.btn-eliminar-torneo')) {
                    return;
                }
                window.location.href = `gestion_partidos.html?torneo=${encodeURIComponent(t.nombre)}`;
            });

            // Eventos en botones de acción
            const btnEditar = cardCol.querySelector('.btn-editar-torneo');
            btnEditar.addEventListener('click', (e) => {
                e.stopPropagation();
                editarTorneo(t.id);
            });

            const btnEliminar = cardCol.querySelector('.btn-eliminar-torneo');
            btnEliminar.addEventListener('click', (e) => {
                e.stopPropagation();
                eliminarTorneo(t.id);
            });

            contenedorTorneos.appendChild(cardCol);
        });
    }

    // ---- FILTROS POR DEPORTE ----
    const filtroDeporteSelect = document.getElementById('filtroDeporte');
    if (filtroDeporteSelect) {
        filtroDeporteSelect.addEventListener('change', (e) => {
            filtroDeporteActivo = e.target.value;
            renderizarTorneos();
        });
    }

    // ---- BUSCADOR ----
    if (txtBuscar) {
        txtBuscar.addEventListener('input', (e) => {
            filtroTextoActivo = e.target.value.trim();
            renderizarTorneos();
        });
    }

    // ---- MODAL Y FORMULARIO DE TORNEO ----
    const frmTorneo = document.getElementById('frmTorneo');
    const modalElement = document.getElementById('modalCrearTorneo');
    let modalInstance = null;
    if (modalElement && typeof bootstrap !== 'undefined') {
        modalInstance = new bootstrap.Modal(modalElement);
    }

    const btnAbrirModalCrear = document.getElementById('btnAbrirModalCrear');
    if (btnAbrirModalCrear) {
        btnAbrirModalCrear.addEventListener('click', () => {
            if (frmTorneo) frmTorneo.reset();
            document.getElementById('idTorneo').value = '';
            document.getElementById('modalCrearTorneoLabel').innerHTML = `<i class="fas fa-trophy text-warning me-2"></i> Crear Nuevo Torneo`;
            document.getElementById('txtAnioTorneo').value = new Date().getFullYear();
            document.getElementById('txtFechaInicio').value = new Date().toISOString().split('T')[0];
        });
    }

    // ---- GUARDAR O ACTUALIZAR TORNEO ----
    if (frmTorneo) {
        frmTorneo.addEventListener('submit', (e) => {
            e.preventDefault();

            const idVal = document.getElementById('idTorneo').value;
            const nombreVal = document.getElementById('txtNombreTorneo').value.trim();
            const anioVal = parseInt(document.getElementById('txtAnioTorneo').value, 10);
            const deporteVal = document.getElementById('selDeporteTorneo').value;
            const categoriaVal = document.getElementById('selCategoriaTorneo').value;
            const tipoVal = document.getElementById('selTipoTorneo').value;
            const fechaInicioVal = document.getElementById('txtFechaInicio').value;
            const fechaFinVal = document.getElementById('txtFechaFin').value;
            const estadoVal = document.getElementById('selEstadoTorneo').value;

            if (!nombreVal || !anioVal || !deporteVal || !categoriaVal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos requeridos',
                    text: 'Por favor completa todos los campos obligatorios.',
                    confirmButtonColor: '#226137'
                });
                return;
            }

            if (idVal) {
                // Actualizar existente
                const index = torneos.findIndex(t => t.id === parseInt(idVal, 10));
                if (index !== -1) {
                    torneos[index] = {
                        ...torneos[index],
                        nombre: nombreVal,
                        anio: anioVal,
                        deporte: deporteVal,
                        categoria: categoriaVal,
                        tipo: tipoVal,
                        fechaInicio: fechaInicioVal,
                        fechaFin: fechaFinVal,
                        estado: estadoVal
                    };
                }
                Swal.fire({
                    icon: 'success',
                    title: '¡Torneo Actualizado!',
                    text: `El torneo "${nombreVal}" ha sido modificado exitosamente.`,
                    confirmButtonColor: '#226137',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // Crear nuevo
                const nuevoId = torneos.length > 0 ? Math.max(...torneos.map(t => t.id)) + 1 : 1;
                const nuevoTorneo = {
                    id: nuevoId,
                    nombre: nombreVal,
                    anio: anioVal,
                    deporte: deporteVal,
                    categoria: categoriaVal,
                    tipo: tipoVal,
                    fechaInicio: fechaInicioVal,
                    fechaFin: fechaFinVal,
                    estado: estadoVal
                };
                torneos.unshift(nuevoTorneo);
                Swal.fire({
                    icon: 'success',
                    title: '¡Torneo Creado!',
                    text: `El torneo "${nombreVal} ${anioVal}" ha sido creado y agendado.`,
                    confirmButtonColor: '#226137',
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            guardarTorneos();
            renderizarTorneos();
            if (modalInstance) modalInstance.hide();
        });
    }

    // ---- EDITAR TORNEO ----
    function editarTorneo(id) {
        const torneo = torneos.find(t => t.id === id);
        if (!torneo) return;

        document.getElementById('idTorneo').value = torneo.id;
        document.getElementById('txtNombreTorneo').value = torneo.nombre;
        document.getElementById('txtAnioTorneo').value = torneo.anio;
        document.getElementById('selDeporteTorneo').value = torneo.deporte;
        document.getElementById('selCategoriaTorneo').value = torneo.categoria;
        document.getElementById('selTipoTorneo').value = torneo.tipo;
        document.getElementById('txtFechaInicio').value = torneo.fechaInicio;
        document.getElementById('txtFechaFin').value = torneo.fechaFin || '';
        document.getElementById('selEstadoTorneo').value = torneo.estado;

        document.getElementById('modalCrearTorneoLabel').innerHTML = `<i class="fas fa-edit text-warning me-2"></i> Editar Torneo`;

        if (modalInstance) {
            modalInstance.show();
        } else if (typeof bootstrap !== 'undefined') {
            const m = new bootstrap.Modal(document.getElementById('modalCrearTorneo'));
            m.show();
        }
    }

    // ---- ELIMINAR TORNEO ----
    function eliminarTorneo(id) {
        const torneo = torneos.find(t => t.id === id);
        if (!torneo) return;

        Swal.fire({
            title: '¿Eliminar Torneo?',
            html: `Estás a punto de eliminar el torneo <strong>"${torneo.nombre} ${torneo.anio}"</strong>.<br>Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash me-1"></i> Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                torneos = torneos.filter(t => t.id !== id);
                guardarTorneos();
                renderizarTorneos();
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El torneo ha sido borrado del sistema.',
                    confirmButtonColor: '#226137',
                    timer: 1800,
                    showConfirmButton: false
                });
            }
        });
    }

    // Inicializar la vista
    renderizarTorneos();
});
