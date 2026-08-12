// Controlador para la gestión de tiempos y carriles en Natación - NeoLeague

document.addEventListener('DOMContentLoaded', () => {
    const formRegistrarTiempo = document.getElementById('formRegistrarTiempo');
    const swimmingTableBody = document.getElementById('swimmingTableBody');

    if (formRegistrarTiempo && swimmingTableBody) {
        formRegistrarTiempo.addEventListener('submit', (e) => {
            e.preventDefault();

            const carril = document.getElementById('selectCarril').value;
            const posicion = document.getElementById('selectPosicion').value;
            const nadador = document.getElementById('inputNadador').value;
            const colegio = document.getElementById('selectColegio').value;
            const tiempo = document.getElementById('inputTiempo').value;

            // Determinar estilo de badge según posición
            let badgeClass = '';
            let medallaTexto = '';
            let tiempoClass = '';

            if (posicion === '1') {
                badgeClass = 'lane-badge-gold';
                medallaTexto = '<span class="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill shadow-sm"><i class="fa-solid fa-medal me-1"></i> 🥇 1er Lugar (Oro)</span>';
                tiempoClass = 'time-display-gold';
            } else if (posicion === '2') {
                badgeClass = 'lane-badge-silver';
                medallaTexto = '<span class="badge bg-secondary text-white fw-bold px-3 py-2 rounded-pill shadow-sm"><i class="fa-solid fa-medal me-1"></i> 🥈 2do Lugar (Plata)</span>';
            } else if (posicion === '3') {
                badgeClass = 'lane-badge-bronze';
                medallaTexto = '<span class="badge bg-dark bg-opacity-75 text-white fw-bold px-3 py-2 rounded-pill shadow-sm" style="background-color: #cd7f32 !important;"><i class="fa-solid fa-medal me-1"></i> 🥉 3er Lugar (Bronce)</span>';
            } else if (posicion === 'DSQ') {
                medallaTexto = '<span class="badge bg-danger text-white fw-bold px-3 py-1 rounded-pill">Descalificado</span>';
            } else {
                medallaTexto = `<span class="badge bg-light text-dark border fw-semibold px-3 py-1 rounded-pill">${posicion}to Lugar</span>`;
            }

            // Seleccionar avatar según colegio
            let imgAvatar = '../img/donBosco.jpg';
            if (colegio.includes('ITR') || colegio.includes('Ricaldone')) imgAvatar = '../img/itr.jpg';
            if (colegio.includes('San José')) imgAvatar = '../img/jose.png';
            if (colegio.includes('Santa Cecilia')) imgAvatar = '../img/cecilia.png';
            if (colegio.includes('María Auxiliar')) imgAvatar = '../img/maria.png';

            const nuevaFilaHTML = `
                <tr class="table-success transition-all">
                    <td class="text-center"><span class="lane-badge ${badgeClass}">${carril}</span></td>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${imgAvatar}" class="swimmer-avatar me-3" alt="Nadador">
                            <div>
                                <h6 class="mb-0 fw-bold text-dark">${nadador}</h6>
                                <span class="badge bg-success bg-opacity-10 text-success small">Nuevo Registro ⏱️</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${imgAvatar}" class="team-icon-small me-2" alt="${colegio}">
                            <span class="fw-semibold text-dark">${colegio}</span>
                        </div>
                    </td>
                    <td class="text-center"><span class="time-display ${tiempoClass}">${tiempo}</span></td>
                    <td class="text-center text-success fw-semibold">Oficial</td>
                    <td class="text-center">${medallaTexto}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-light rounded-circle text-primary me-1" title="Editar tiempo"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-light rounded-circle text-danger" title="Eliminar registro"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;

            // Insertar al inicio de la tabla de carriles
            swimmingTableBody.insertAdjacentHTML('afterbegin', nuevaFilaHTML);

            // Cerrar modal
            const modalEl = document.getElementById('modalRegistrarTiempo');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            formRegistrarTiempo.reset();

            // Notificación SweetAlert2
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Tiempo Oficial Registrado!',
                    text: `El registro para ${nadador} en el Carril ${carril} ha sido guardado existosamente.`,
                    confirmButtonColor: '#226137',
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        });
    }

    // Delegación de eventos para eliminar filas
    if (swimmingTableBody) {
        swimmingTableBody.addEventListener('click', (e) => {
            const btnDelete = e.target.closest('.text-danger');
            if (btnDelete) {
                const fila = btnDelete.closest('tr');
                if (fila && typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '¿Eliminar tiempo oficial?',
                        text: "Esta acción removerá el registro del carril de la base de datos.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#6c757d',
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fila.remove();
                            Swal.fire({
                                icon: 'success',
                                title: 'Eliminado',
                                text: 'El registro ha sido removido.',
                                confirmButtonColor: '#226137',
                                timer: 1500,
                                showConfirmButton: false
                            });
                        }
                    });
                } else if (fila) {
                    fila.remove();
                }
            }
        });
    }
});
