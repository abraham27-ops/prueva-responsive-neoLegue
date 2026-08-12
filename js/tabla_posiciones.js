// Controlador dinámico para la Tabla de Posiciones y Medallero de Natación - NeoLeague

document.addEventListener('DOMContentLoaded', () => {
    const sportFilter = document.getElementById('sport-filter');
    const tournamentFilter = document.getElementById('tournament-filter');
    const groupFilter = document.getElementById('group-filter');
    const thead = document.querySelector('.table-custom-header tr');
    const tbody = document.getElementById('standings-table-body');

    if (!sportFilter || !thead || !tbody) return;

    // Datos para deportes estándar (Fútbol, Baloncesto, Voleibol)
    const datosEstandar = {
        futbol_masculino: [
            { pos: 1, posClass: 'pos-1', equipo: 'Ricaldone', img: '../img/itr.jpg', pj: 4, pg: 3, pe: 0, pp: 1, gf: 10, gc: 3, dg: '+7', pts: 9 },
            { pos: 2, posClass: 'pos-2', equipo: 'Don Bosco', img: '../img/donBosco.jpg', pj: 4, pg: 2, pe: 1, pp: 1, gf: 8, gc: 5, dg: '+3', pts: 7 },
            { pos: 3, posClass: 'pos-3', equipo: 'San José', img: '../img/jose.png', pj: 4, pg: 2, pe: 0, pp: 2, gf: 6, gc: 6, dg: '0', pts: 6 },
            { pos: 4, posClass: 'pos-other', equipo: 'Santa Cecilia', img: '../img/cecilia.png', pj: 4, pg: 1, pe: 1, pp: 2, gf: 5, gc: 7, dg: '-2', pts: 4 },
            { pos: 5, posClass: 'pos-other', equipo: 'María Auxiliar', img: '../img/maria.png', pj: 4, pg: 0, pe: 0, pp: 4, gf: 2, gc: 10, dg: '-8', pts: 0 }
        ],
        futbol_femenino: [
            { pos: 1, posClass: 'pos-1', equipo: 'María Auxiliar', img: '../img/maria.png', pj: 3, pg: 3, pe: 0, pp: 0, gf: 12, gc: 1, dg: '+11', pts: 9 },
            { pos: 2, posClass: 'pos-2', equipo: 'Ricaldone', img: '../img/itr.jpg', pj: 3, pg: 2, pe: 0, pp: 1, gf: 7, gc: 4, dg: '+3', pts: 6 },
            { pos: 3, posClass: 'pos-3', equipo: 'Don Bosco', img: '../img/donBosco.jpg', pj: 3, pg: 1, pe: 0, pp: 2, gf: 4, gc: 8, dg: '-4', pts: 3 },
            { pos: 4, posClass: 'pos-other', equipo: 'Santa Cecilia', img: '../img/cecilia.png', pj: 3, pg: 0, pe: 0, pp: 3, gf: 1, gc: 11, dg: '-10', pts: 0 }
        ],
        baloncesto: [
            { pos: 1, posClass: 'pos-1', equipo: 'Don Bosco', img: '../img/donBosco.jpg', pj: 5, pg: 5, pe: 0, pp: 0, gf: 320, gc: 250, dg: '+70', pts: 10 },
            { pos: 2, posClass: 'pos-2', equipo: 'Ricaldone', img: '../img/itr.jpg', pj: 5, pg: 4, pe: 0, pp: 1, gf: 310, gc: 265, dg: '+45', pts: 9 },
            { pos: 3, posClass: 'pos-3', equipo: 'Santa Cecilia', img: '../img/cecilia.png', pj: 5, pg: 2, pe: 0, pp: 3, gf: 280, gc: 290, dg: '-10', pts: 7 },
            { pos: 4, posClass: 'pos-other', equipo: 'San José', img: '../img/jose.png', pj: 5, pg: 1, pe: 0, pp: 4, gf: 240, gc: 300, dg: '-60', pts: 6 }
        ],
        voleibol: [
            { pos: 1, posClass: 'pos-1', equipo: 'Santa Cecilia', img: '../img/cecilia.png', pj: 4, pg: 4, pe: 0, pp: 0, gf: 12, gc: 2, dg: '+10', pts: 8 },
            { pos: 2, posClass: 'pos-2', equipo: 'Ricaldone', img: '../img/itr.jpg', pj: 4, pg: 3, pe: 0, pp: 1, gf: 10, gc: 5, dg: '+5', pts: 7 },
            { pos: 3, posClass: 'pos-3', equipo: 'María Auxiliar', img: '../img/maria.png', pj: 4, pg: 1, pe: 0, pp: 3, gf: 5, gc: 10, dg: '-5', pts: 5 },
            { pos: 4, posClass: 'pos-other', equipo: 'Don Bosco', img: '../img/donBosco.jpg', pj: 4, pg: 0, pe: 0, pp: 4, gf: 2, gc: 12, dg: '-10', pts: 4 }
        ]
    };

    // Datos exclusivos para Natación (Medallero y Puntos por Equipo)
    const datosNatacion = [
        { pos: 1, posClass: 'pos-1', equipo: 'Ricaldone (ITR)', img: '../img/itr.jpg', oro: 5, plata: 3, bronce: 2, total: 10, pts: 145 },
        { pos: 2, posClass: 'pos-2', equipo: 'Don Bosco', img: '../img/donBosco.jpg', oro: 4, plata: 4, bronce: 1, total: 9, pts: 130 },
        { pos: 3, posClass: 'pos-3', equipo: 'San José', img: '../img/jose.png', oro: 2, plata: 2, bronce: 4, total: 8, pts: 95 },
        { pos: 4, posClass: 'pos-other', equipo: 'Santa Cecilia', img: '../img/cecilia.png', oro: 1, plata: 2, bronce: 3, total: 6, pts: 70 },
        { pos: 5, posClass: 'pos-other', equipo: 'María Auxiliar', img: '../img/maria.png', oro: 0, plata: 1, bronce: 2, total: 3, pts: 35 }
    ];

    function actualizarTabla() {
        const deporte = sportFilter.value;

        // Limpiar tabla actual con una transición suave
        tbody.style.opacity = '0';
        
        setTimeout(() => {
            tbody.innerHTML = '';

            if (deporte === 'natacion') {
                // 1. Cambiar Encabezado para Natación
                thead.innerHTML = `
                    <th class="text-start">POS</th>
                    <th class="text-start">INSTITUCIÓN / EQUIPO</th>
                    <th><i class="fa-solid fa-medal text-warning me-1"></i> ORO</th>
                    <th><i class="fa-solid fa-medal text-secondary me-1"></i> PLATA</th>
                    <th><i class="fa-solid fa-medal me-1" style="color: #cd7f32;"></i> BRONCE</th>
                    <th>TOTAL MEDALLAS</th>
                    <th>PUNTOS OFICIALES (PTS)</th>
                `;

                // 2. Renderizar filas de Natación (Medallero)
                datosNatacion.forEach(item => {
                    const fila = `
                        <tr class="table-custom-row cursor-pointer" onclick="window.location.href='detalles_partido_natacion.html'">
                            <td class="text-start">
                                <span class="pos-badge ${item.posClass}">${item.pos}</span>
                            </td>
                            <td class="text-start">
                                <div class="d-flex align-items-center gap-3">
                                    <img src="${item.img}" class="team-logo-small" alt="${item.equipo}">
                                    <div>
                                        <span class="fw-bold text-dark d-block">${item.equipo}</span>
                                        <small class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-water text-info me-1"></i> Selección de Natación</small>
                                    </div>
                                </div>
                            </td>
                            <td><span class="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill shadow-sm fs-6">${item.oro}</span></td>
                            <td><span class="badge bg-secondary text-white fw-bold px-3 py-2 rounded-pill shadow-sm fs-6">${item.plata}</span></td>
                            <td><span class="badge text-white fw-bold px-3 py-2 rounded-pill shadow-sm fs-6" style="background-color: #cd7f32;">${item.bronce}</span></td>
                            <td><span class="fw-bold fs-5 text-dark">${item.total}</span></td>
                            <td><span class="pts-cell text-success fs-5">${item.pts} PTS</span></td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', fila);
                });

            } else {
                // 1. Cambiar Encabezado Estándar
                thead.innerHTML = `
                    <th class="text-start">POS</th>
                    <th class="text-start">EQUIPO</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>PE</th>
                    <th>PP</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DG</th>
                    <th>PTS</th>
                `;

                // 2. Renderizar filas Estándar
                const lista = datosEstandar[deporte] || datosEstandar['futbol_masculino'];
                lista.forEach(item => {
                    const peClass = item.pe === 0 ? 'td-zero' : '';
                    const ppClass = item.pp === 0 ? 'td-zero' : '';
                    const dgClass = item.dg.startsWith('+') ? 'dg-pos' : (item.dg.startsWith('-') ? 'dg-neg' : '');

                    const fila = `
                        <tr class="table-custom-row cursor-pointer" onclick="window.location.href='detalles_partido.html'">
                            <td class="text-start">
                                <span class="pos-badge ${item.posClass}">${item.pos}</span>
                            </td>
                            <td class="text-start">
                                <div class="d-flex align-items-center gap-3">
                                    <img src="${item.img}" class="team-logo-small" alt="${item.equipo}">
                                    <span class="fw-bold">${item.equipo}</span>
                                </div>
                            </td>
                            <td>${item.pj}</td>
                            <td>${item.pg}</td>
                            <td class="${peClass}">${item.pe}</td>
                            <td class="${ppClass}">${item.pp}</td>
                            <td>${item.gf}</td>
                            <td>${item.gc}</td>
                            <td class="${dgClass}">${item.dg}</td>
                            <td><span class="pts-cell">${item.pts}</span></td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', fila);
                });
            }

            tbody.style.opacity = '1';
        }, 150);
    }

    // --- SINCRONIZACIÓN TORNEO -> DEPORTE ASIGNADO ---
    if (tournamentFilter) {
        tournamentFilter.addEventListener('change', () => {
            const selectedOption = tournamentFilter.options[tournamentFilter.selectedIndex];
            const deporteAsignado = selectedOption.getAttribute('data-deporte');
            if (deporteAsignado) {
                sportFilter.value = deporteAsignado;
                // Efecto visual de sincronización
                sportFilter.style.transition = 'background-color 0.3s ease';
                sportFilter.style.backgroundColor = '#d1e7dd';
                setTimeout(() => {
                    sportFilter.style.backgroundColor = 'transparent';
                }, 600);
            }
            actualizarTabla();
        });
    }

    // --- SINCRONIZACIÓN DEPORTE -> TORNEO ASIGNADO ---
    sportFilter.addEventListener('change', () => {
        const deporteSeleccionado = sportFilter.value;
        if (tournamentFilter) {
            const opcionesTorneo = Array.from(tournamentFilter.options);
            const opcionCoincidente = opcionesTorneo.find(opt => opt.getAttribute('data-deporte') === deporteSeleccionado);
            if (opcionCoincidente) {
                tournamentFilter.value = opcionCoincidente.value;
            }
        }
        actualizarTabla();
    });

    if (groupFilter) groupFilter.addEventListener('change', actualizarTabla);
});
