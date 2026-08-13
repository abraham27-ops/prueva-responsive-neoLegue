// ============================================================================
// CONTROLADOR DE CRONOGRAMA – NeoLeague
// Lee automáticamente Partidos y Torneos y los agrupa en una línea de tiempo.
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- MOCK: INICIALIZACIÓN DE PARTIDOS SI ESTÁ VACÍO ----
    // (Para preparar la API y tener datos reales de demostración)
    let partidosMock = JSON.parse(localStorage.getItem('nl_partidos'));
    if (!partidosMock || partidosMock.length === 0) {
        partidosMock = [
            { id: 1, equipoLocal: 'Ricaldone', equipoVisitante: 'Don Bosco', fecha: '2026-06-05', hora: '07:10', deporte: 'Fútbol', cancha: 'Cancha Principal', torneo: 'Intramuros', estado: 'Programado' },
            { id: 2, equipoLocal: 'Liceo Salvadoreño', equipoVisitante: 'Champagnat', fecha: '2026-06-05', hora: '09:00', deporte: 'Baloncesto', cancha: 'Duela Techada', torneo: 'Copa Neo', estado: 'Programado' },
            { id: 3, equipoLocal: 'San Francisco', equipoVisitante: 'Santa Cecilia', fecha: '2026-08-08', hora: '14:30', deporte: 'Voleibol', cancha: 'Cancha 2', torneo: 'Amistoso', estado: 'Programado' },
            { id: 4, equipoLocal: 'Ricaldone', equipoVisitante: 'San José', fecha: '2026-03-09', hora: '10:00', deporte: 'Fútbol', cancha: 'Cancha Principal', torneo: 'Intramuros', estado: 'Finalizado' }
        ];
        localStorage.setItem('nl_partidos', JSON.stringify(partidosMock));
    }

    const container = document.getElementById('cronogramaContainer');
    const btnFiltros = document.querySelectorAll('.btn-filter-crono');
    
    let filtroActual = 'todos'; // 'todos', 'torneo', 'partido'
    
    // Estado del Calendario Mensual
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Función para obtener y unificar todos los eventos (Torneos y Partidos)
    function obtenerEventosCronograma() {
        // 1. Obtener Torneos
        const torneos = JSON.parse(localStorage.getItem('nl_torneos')) || [];
        // 2. Obtener Partidos
        const partidos = JSON.parse(localStorage.getItem('nl_partidos')) || [];

        let eventos = [];

        // Normalizar Torneos
        torneos.forEach(t => {
            eventos.push({
                id: t.id,
                tipoElemento: 'torneo',
                fechaReal: new Date(t.fechaInicio + 'T00:00:00'),
                fechaStr: t.fechaInicio,
                hora: 'Todo el día',
                titulo: t.nombre,
                subtitulo: `Categoría: ${t.categoria}`,
                deporte: t.deporte,
                lugar: 'Varias sedes',
                estado: t.estado || 'Programado'
            });
        });

        // Normalizar Partidos
        partidos.forEach(p => {
            eventos.push({
                id: p.id,
                tipoElemento: 'partido',
                fechaReal: new Date(p.fecha + 'T' + p.hora + ':00'),
                fechaStr: p.fecha,
                hora: p.hora,
                titulo: `${p.equipoLocal} vs ${p.equipoVisitante}`,
                subtitulo: p.torneo,
                deporte: p.deporte,
                lugar: p.cancha,
                estado: p.estado || 'Programado'
            });
        });

        // Ordenar cronológicamente ascendente
        eventos.sort((a, b) => a.fechaReal - b.fechaReal);

        return eventos;
    }

    // Formatear fecha para el encabezado (Ej: "Miércoles, 5 de junio")
    function formatearFechaEncabezado(fechaStr) {
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        // Asegurar zona horaria agregando T00:00:00 si es necesario
        let d = new Date(fechaStr + (fechaStr.includes('T') ? '' : 'T12:00:00'));
        let fechaFormateada = d.toLocaleDateString('es-ES', opciones);
        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1); // Capitalizar
    }

    function renderizarCronograma() {
        if (!container) return;
        container.innerHTML = "";

        const todosEventos = obtenerEventosCronograma();

        // Aplicar Filtro
        const eventosFiltrados = todosEventos.filter(ev => {
            if (filtroActual === 'todos') return true;
            return ev.tipoElemento === filtroActual;
        });

        if (eventosFiltrados.length === 0) {
            container.innerHTML = `
                <div class="empty-cronograma">
                    <i class="fas fa-calendar-times mb-3 text-muted" style="font-size: 3rem; opacity: 0.5;"></i>
                    <h4 class="text-secondary fw-bold">Sin programación</h4>
                    <p class="text-muted">No se encontraron eventos programados para esta vista.</p>
                </div>
            `;
            return;
        }

        // Agrupar por fecha
        const agrupados = {};
        eventosFiltrados.forEach(ev => {
            if (!agrupados[ev.fechaStr]) {
                agrupados[ev.fechaStr] = [];
            }
            agrupados[ev.fechaStr].push(ev);
        });

        // Obtener estado de la vista (Agenda o Tarjetas o Mensual)
        const vistaAgenda = document.getElementById('btnVistaAgenda');
        const vistaTarjetas = document.getElementById('btnVistaTarjetas');
        const vistaMensual = document.getElementById('btnVistaMensual');
        
        let vistaSeleccionada = 'agenda';
        if (vistaTarjetas && vistaTarjetas.checked) vistaSeleccionada = 'tarjetas';
        if (vistaMensual && vistaMensual.checked) vistaSeleccionada = 'mensual';

        // Renderizar el HTML
        let htmlContent = '';

        if (vistaSeleccionada === 'mensual') {
            // ---- VISTA MENSUAL (Google Calendar Style) ----
            htmlContent = renderizarVistaMensual(eventosFiltrados);
            container.innerHTML = htmlContent;
            
            // Asignar eventos a los botones de navegación del mes
            const btnPrevMonth = document.getElementById('btnPrevMonth');
            const btnNextMonth = document.getElementById('btnNextMonth');
            const selectMonth = document.getElementById('selectMonthNav');
            const selectYear = document.getElementById('selectYearNav');
            
            if (btnPrevMonth) {
                btnPrevMonth.addEventListener('click', () => {
                    currentMonth--;
                    if (currentMonth < 0) {
                        currentMonth = 11;
                        currentYear--;
                    }
                    renderizarCronograma();
                });
            }
            if (btnNextMonth) {
                btnNextMonth.addEventListener('click', () => {
                    currentMonth++;
                    if (currentMonth > 11) {
                        currentMonth = 0;
                        currentYear++;
                    }
                    renderizarCronograma();
                });
            }
            
            if (selectMonth) {
                selectMonth.addEventListener('change', (e) => {
                    currentMonth = parseInt(e.target.value);
                    renderizarCronograma();
                });
            }
            if (selectYear) {
                selectYear.addEventListener('change', (e) => {
                    currentYear = parseInt(e.target.value);
                    renderizarCronograma();
                });
            }
            
            return; // Termina aquí para la vista mensual
        }

        for (const fecha in agrupados) {
            const fechaTitulo = formatearFechaEncabezado(fecha);
            
            if (vistaSeleccionada === 'agenda') {
                // ---- VISTA AGENDA (Línea de tiempo original) ----
                htmlContent += `
                    <div class="date-header">
                        <h3 class="date-title">${fechaTitulo}</h3>
                    </div>
                    <div class="timeline-container">
                `;

                agrupados[fecha].forEach(ev => {
                    const esTorneo = ev.tipoElemento === 'torneo';
                    const badgeTipo = esTorneo 
                        ? `<span class="crono-type type-torneo"><i class="fas fa-trophy"></i> Inicio Torneo</span>` 
                        : `<span class="crono-type type-partido"><i class="far fa-futbol"></i> Partido</span>`;

                    let estadoClase = 'status-programado';
                    let estadoIcon = 'bi-calendar-check';
                    
                    if (ev.estado.toLowerCase().includes('curso')) {
                        estadoClase = 'status-encurso';
                        estadoIcon = 'bi-play-circle-fill';
                    } else if (ev.estado.toLowerCase().includes('finalizado')) {
                        estadoClase = 'status-finalizado';
                        estadoIcon = 'bi-check-circle-fill';
                    }

                    let deporteIcon = "fas fa-running";
                    if (ev.deporte === "Fútbol") deporteIcon = "fas fa-futbol";
                    if (ev.deporte === "Baloncesto") deporteIcon = "fas fa-basketball-ball";
                    if (ev.deporte === "Voleibol") deporteIcon = "fas fa-volleyball-ball";
                    if (ev.deporte === "Natación") deporteIcon = "fas fa-swimmer";

                    let linkHref = ev.tipoElemento === 'torneo' 
                        ? `gestion_torneos.html`
                        : (ev.deporte === 'Natación' ? 'detalles_partido_natacion.html' : 'detalles_partido.html');

                    htmlContent += `
                        <div class="crono-item" style="cursor: pointer;" onclick="window.location.href='${linkHref}'">
                            <div class="crono-time-block">
                                <span class="crono-time text-primary">${ev.hora === 'Todo el día' ? '--:--' : ev.hora}</span>
                                ${badgeTipo}
                            </div>
                            <div class="crono-details">
                                <h4 class="crono-title">${ev.titulo}</h4>
                                <div class="crono-meta mb-2">
                                    <span><i class="${deporteIcon}"></i> ${ev.deporte}</span>
                                    <span><i class="bi bi-tag-fill"></i> ${ev.subtitulo}</span>
                                    <span><i class="bi bi-geo-alt-fill"></i> ${ev.lugar}</span>
                                </div>
                                <span class="crono-status ${estadoClase} d-inline-flex">
                                    <i class="bi ${estadoIcon}"></i> ${ev.estado}
                                </span>
                            </div>
                        </div>
                    `;
                });

                htmlContent += `</div>`; // Cerrar timeline-container

            } else {
                // ---- VISTA TARJETAS (Cuadrícula coherente con Partidos) ----
                htmlContent += `
                    <div class="mb-3 mt-4" style="border-bottom: 2px solid #e9ecef; padding-bottom: 0.5rem;">
                        <h3 class="m-0" style="font-size: 1.25rem; font-weight: 800; color: #212529;">
                            <i class="bi bi-calendar-event text-success"></i> ${fechaTitulo}
                        </h3>
                    </div>
                    <div class="row g-4 mb-4">
                `;

                agrupados[fecha].forEach(ev => {
                    const esTorneo = ev.tipoElemento === 'torneo';
                    const gradient = esTorneo ? 'linear-gradient(135deg, #e65c00, #F9D423)' : 'linear-gradient(135deg, #226137, #1a4a2a)';

                    let linkHref = esTorneo 
                        ? `gestion_torneos.html`
                        : (ev.deporte === 'Natación' ? 'detalles_partido_natacion.html' : 'detalles_partido.html');

                    if (esTorneo) {
                        htmlContent += `
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="crono-card shadow-sm border" style="cursor: pointer;" onclick="window.location.href='${linkHref}'">
                                <div class="crono-card-header" style="background: ${gradient};">
                                    <span class="badge bg-white bg-opacity-25 rounded-pill mb-1 fw-bold">${ev.deporte}</span>
                                    <h6 class="m-0 fw-bold">${ev.titulo}</h6>
                                </div>
                                <div class="crono-card-body">
                                    <div class="d-flex flex-column align-items-center justify-content-center mb-3">
                                        <i class="fas fa-trophy text-warning mb-2" style="font-size: 3rem;"></i>
                                        <span class="badge bg-light text-dark border rounded-pill px-3 py-1 fw-bold shadow-sm mb-2">${ev.subtitulo}</span>
                                        <span class="text-danger fw-bold small">Inicio: ${fechaTitulo}</span>
                                    </div>
                                    <hr class="text-muted opacity-25 m-0 mb-2">
                                    <p class="m-0 small text-muted fw-medium"><i class="bi bi-geo-alt-fill me-1 text-danger"></i> ${ev.lugar}</p>
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        // Partido
                        const equipos = ev.titulo.split(' vs ');
                        const eq1 = equipos[0] || 'Equipo A';
                        const eq2 = equipos[1] || 'Equipo B';
                        const img1 = `https://ui-avatars.com/api/?name=${eq1}&background=random&color=fff&rounded=true`;
                        const img2 = `https://ui-avatars.com/api/?name=${eq2}&background=random&color=fff&rounded=true`;

                        htmlContent += `
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="crono-card shadow-sm border" style="cursor: pointer;" onclick="window.location.href='${linkHref}'">
                                <div class="crono-card-header" style="background: ${gradient};">
                                    <span class="badge bg-white bg-opacity-25 rounded-pill mb-1 fw-bold">${ev.subtitulo}</span>
                                    <h6 class="m-0 fw-bold">${ev.deporte}</h6>
                                </div>
                                <div class="crono-card-body">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div class="equipo-col">
                                            <img src="${img1}" class="rounded-circle shadow-sm mb-2" width="55" height="55" style="object-fit: cover; border: 2px solid #eee;">
                                            <p class="mb-0 fw-bold small text-dark" style="line-height: 1.1;">${eq1}</p>
                                        </div>
                                        <div class="vs-col d-flex flex-column justify-content-center align-items-center px-1">
                                            <span class="badge bg-light text-dark border rounded-pill px-2 py-1 mb-1 fw-bold shadow-sm" style="font-size: 0.7rem;">VS</span>
                                            <span class="text-danger fw-bold" style="font-size: 0.75rem;">${ev.hora}</span>
                                        </div>
                                        <div class="equipo-col">
                                            <img src="${img2}" class="rounded-circle shadow-sm mb-2" width="55" height="55" style="object-fit: cover; border: 2px solid #eee;">
                                            <p class="mb-0 fw-bold small text-dark" style="line-height: 1.1;">${eq2}</p>
                                        </div>
                                    </div>
                                    <hr class="text-muted opacity-25 m-0 mb-2">
                                    <p class="m-0 small text-muted fw-medium"><i class="bi bi-geo-alt-fill me-1 text-danger"></i> ${ev.lugar}</p>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                });

                htmlContent += `</div>`; // Cerrar row
            }
        }

        container.innerHTML = htmlContent;
    }

    // Generador del Grid Mensual
    function renderizarVistaMensual(eventosFiltrados) {
        // Generar opciones de meses
        let monthOptions = '';
        nombresMeses.forEach((mes, index) => {
            monthOptions += `<option value="${index}" ${index === currentMonth ? 'selected' : ''}>${mes}</option>`;
        });

        // Generar opciones de años (desde 2024 hasta 5 años en el futuro)
        let yearOptions = '';
        const baseYear = new Date().getFullYear();
        for (let y = baseYear - 2; y <= baseYear + 5; y++) {
            yearOptions += `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`;
        }

        let html = `
            <div class="month-nav-container">
                <button class="btn btn-month-nav shadow-sm" id="btnPrevMonth"><i class="bi bi-chevron-left"></i></button>
                
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-calendar3 text-success fs-4 d-none d-sm-inline"></i>
                    <select id="selectMonthNav" class="form-select border-0 shadow-sm fw-bold text-dark text-center" style="background-color: #f8f9fa; cursor: pointer;">
                        ${monthOptions}
                    </select>
                    <select id="selectYearNav" class="form-select border-0 shadow-sm fw-bold text-dark text-center" style="background-color: #f8f9fa; cursor: pointer;">
                        ${yearOptions}
                    </select>
                </div>

                <button class="btn btn-month-nav shadow-sm" id="btnNextMonth"><i class="bi bi-chevron-right"></i></button>
            </div>
            
            <div class="table-responsive pb-3">
                <div class="calendar-grid shadow-sm" style="min-width: 650px;">
                    <div class="calendar-day-header">Lun</div>
                    <div class="calendar-day-header">Mar</div>
                    <div class="calendar-day-header">Mié</div>
                    <div class="calendar-day-header">Jue</div>
                    <div class="calendar-day-header">Vie</div>
                    <div class="calendar-day-header">Sáb</div>
                    <div class="calendar-day-header">Dom</div>
        `;

        // Calcular días
        const primerDiaSemana = new Date(currentYear, currentMonth, 1).getDay(); // 0=Dom, 1=Lun
        let offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; // Hacer que Lunes sea 0
        
        const diasEnMes = new Date(currentYear, currentMonth + 1, 0).getDate();
        const totalCeldas = 42; // 6 filas de 7 días
        
        const hoy = new Date();
        const esMesActual = hoy.getMonth() === currentMonth && hoy.getFullYear() === currentYear;
        const diaHoy = hoy.getDate();

        for (let i = 0; i < totalCeldas; i++) {
            if (i < offset || i >= offset + diasEnMes) {
                // Celdas vacías
                html += `<div class="calendar-cell empty-cell"></div>`;
            } else {
                // Celdas con número de día
                const numDia = i - offset + 1;
                const esHoy = (esMesActual && numDia === diaHoy) ? 'today' : '';
                
                // Formato ISO para comparar con los eventos (YYYY-MM-DD)
                const mesStr = String(currentMonth + 1).padStart(2, '0');
                const diaStr = String(numDia).padStart(2, '0');
                const fechaCelda = `${currentYear}-${mesStr}-${diaStr}`;
                
                // Buscar eventos para este día
                const eventosDelDia = eventosFiltrados.filter(ev => ev.fechaStr === fechaCelda);
                
                let pillsHtml = '';
                eventosDelDia.forEach(ev => {
                    const esTorneo = ev.tipoElemento === 'torneo';
                    const pillClass = esTorneo ? 'torneo-pill' : 'partido-pill';
                    const horaDisplay = ev.hora === 'Todo el día' ? '' : `${ev.hora} `;
                    const linkHref = esTorneo 
                        ? `gestion_torneos.html`
                        : (ev.deporte === 'Natación' ? 'detalles_partido_natacion.html' : 'detalles_partido.html');

                    pillsHtml += `<div class="event-pill ${pillClass} shadow-sm mb-1" style="cursor: pointer;" onclick="window.location.href='${linkHref}'" title="${ev.titulo}">${horaDisplay}${ev.titulo}</div>`;
                });

                html += `
                    <div class="calendar-cell ${esHoy}">
                        <div class="day-number shadow-sm">${numDia}</div>
                        ${pillsHtml}
                    </div>
                `;
            }
        }

        html += `</div></div>`;
        return html;
    }

    // ---- MANEJO DE FILTROS ----
    btnFiltros.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Quitar clase active de todos
            btnFiltros.forEach(b => b.classList.remove('active'));
            // Agregar a este
            const target = e.currentTarget;
            target.classList.add('active');
            
            filtroActual = target.getAttribute('data-filter');
            renderizarCronograma();
        });
    });

    // ---- MANEJO DE VISTAS (Agenda / Tarjetas / Mensual) ----
    const vistaAgenda = document.getElementById('btnVistaAgenda');
    const vistaTarjetas = document.getElementById('btnVistaTarjetas');
    const vistaMensual = document.getElementById('btnVistaMensual');
    
    if (vistaAgenda) vistaAgenda.addEventListener('change', renderizarCronograma);
    if (vistaTarjetas) vistaTarjetas.addEventListener('change', renderizarCronograma);
    if (vistaMensual) vistaMensual.addEventListener('change', renderizarCronograma);

    // Iniciar
    renderizarCronograma();
});
