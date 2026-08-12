// Lógica Formulario Profesor Guía
const selectRol = document.getElementById('selectRol');
const contProfesorGuia = document.getElementById('contProfesorGuia');
const checkProfesorGuia = document.getElementById('checkProfesorGuia');
const opcionesProfesorGuia = document.getElementById('opcionesProfesorGuia');
const selectAreaGuia = document.getElementById('selectAreaGuia');
const contEspecialidad = document.getElementById('contEspecialidad');
const contNivelSeccion = document.getElementById('contNivelSeccion');
const contSoloSeccion = document.getElementById('contSoloSeccion');
const selectNivelAcademico = document.getElementById('selectNivelAcademico');
const selectSeccion = document.getElementById('selectSeccion');

// Misión 4.4: Maestro de Selección
const opcionesMaestroSeleccion = document.getElementById('opcionesMaestroSeleccion');
const checkMaestroSeleccion = document.getElementById('checkMaestroSeleccion');

function resetAreaOptions() {
    if(contEspecialidad) contEspecialidad.classList.add('d-none');
    if(contNivelSeccion) contNivelSeccion.classList.add('d-none');
    if(contSoloSeccion) contSoloSeccion.classList.add('d-none');
    if(selectNivelAcademico) selectNivelAcademico.innerHTML = "";
    if(selectSeccion) selectSeccion.innerHTML = "";
}

if (selectRol) {
    selectRol.addEventListener('change', (e) => {
        if (e.target.value === 'Entrenador') {
            contProfesorGuia.classList.remove('d-none');
        } else {
            contProfesorGuia.classList.add('d-none');
            checkProfesorGuia.checked = false;
            opcionesProfesorGuia.classList.add('d-none');
            resetAreaOptions();
        }
    });
}

if (checkProfesorGuia) {
    checkProfesorGuia.addEventListener('change', (e) => {
        if (e.target.checked) {
            opcionesProfesorGuia.classList.remove('d-none');
            
            // Ocultar Maestro de Selección si es Profesor Guía
            if(opcionesMaestroSeleccion) opcionesMaestroSeleccion.classList.add('d-none');
            if(checkMaestroSeleccion) checkMaestroSeleccion.checked = false;
        } else {
            opcionesProfesorGuia.classList.add('d-none');
            resetAreaOptions();
            selectAreaGuia.value = "";
            
            // Mostrar Maestro de Selección si NO es Profesor Guía
            if(opcionesMaestroSeleccion) opcionesMaestroSeleccion.classList.remove('d-none');
        }
    });
}

if (selectAreaGuia) {
    selectAreaGuia.addEventListener('change', (e) => {
        resetAreaOptions();
        const area = e.target.value;
        contNivelSeccion.classList.remove('d-none');

        let nivelesHTML = '<option value="" selected disabled>Seleccionar...</option>';
        let seccionesHTML = '<option value="" selected disabled>Seleccionar...</option>';

        if (area === 'Técnicas') {
            contEspecialidad.classList.remove('d-none');
            nivelesHTML += `<option value="1er año">1er año</option><option value="2do año">2do año</option><option value="3er año">3er año</option>`;
        } else if (area === 'Académicas') {
            contSoloSeccion.classList.remove('d-none');
            nivelesHTML += `<option value="7mo grado">7mo grado</option><option value="8vo grado">8vo grado</option><option value="9no grado">9no grado</option>`;
            ['A','B','C','D','E','F'].forEach(letra => seccionesHTML += `<option value="${letra}">${letra}</option>`);
        }

        selectNivelAcademico.innerHTML = nivelesHTML;
        selectSeccion.innerHTML = seccionesHTML;
    });
}

// Lógica de Filtros de Rol
const btnFiltrosRol = document.querySelectorAll('#filtrosRol .btn-filtro');
const userCards = document.querySelectorAll('#tablaUsuarios .col');

if (btnFiltrosRol.length > 0) {
    btnFiltrosRol.forEach(btn => {
        btn.addEventListener('click', () => {
            btnFiltrosRol.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-rol');
            
            userCards.forEach(card => {
                const cardRol = card.getAttribute('data-rol');
                if (filterValue === "" || cardRol === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Helper para generar el HTML de los botones de acción consistentes con estudiantes
function obtenerHTMLBotonesUsuario() {
    return `
        <div class="d-flex justify-content-end gap-1 mt-3 pt-3 border-top border-light">
            <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill me-1 btn-editar-usuario" title="Editar"><i class="bi bi-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-outline-danger rounded-pill btn-eliminar-usuario" title="Eliminar"><i class="bi bi-trash"></i></button>
        </div>
    `;
}

// Asegurar que cualquier tarjeta sin botones los reciba automáticamente al cargar
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#tablaUsuarios .card').forEach(card => {
        if (!card.querySelector('.btn-eliminar-usuario') && !card.querySelector('.bi-trash')) {
            card.insertAdjacentHTML('beforeend', obtenerHTMLBotonesUsuario());
        }
    });
});

// Lógica para agregar usuario dinámicamente con sus respectivos botones automáticos
const formCrearUsuario = document.querySelector('#modalCrearUsuario form');
if (formCrearUsuario) {
    formCrearUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombres = document.getElementById('txtNombres')?.value || 'Nuevo';
        const apellidos = document.getElementById('txtApellidos')?.value || 'Usuario';
        const correo = document.getElementById('txtCorreo')?.value || 'usuario@gmail.com';
        const dui = document.getElementById('txtDui')?.value || '00000000-0';
        const rol = document.getElementById('selectRol')?.value || 'Estudiante';
        
        let badgeClass = 'bg-secondary bg-opacity-10 text-secondary';
        let barColor = 'var(--text-muted, #6c757d)';
        if (rol === 'Entrenador') {
            badgeClass = 'bg-success bg-opacity-10 text-success';
            barColor = 'var(--primary-color, #2e8b57)';
        } else if (rol === 'Administrador') {
            badgeClass = 'bg-dark bg-opacity-10 text-dark';
            barColor = 'var(--text-color, #212529)';
        }

        const iniciales = ((nombres.charAt(0) || '') + (apellidos.charAt(0) || '')).toUpperCase() || 'NU';
        
        const newCol = document.createElement('div');
        newCol.className = 'col';
        newCol.setAttribute('data-rol', rol);
        newCol.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 h-100 p-4 hover-lift transition-all position-relative overflow-hidden">
                <div class="position-absolute top-0 start-0 w-100" style="height: 4px; background-color: ${barColor};"></div>
                <div class="d-flex align-items-center mb-3 mt-1">
                    <div class="d-flex align-items-center justify-content-center rounded-circle text-dark fw-bold me-3 shadow-sm" style="width: 55px; height: 55px; background-color: #f1f3f5; font-size: 1.2rem;">
                        ${iniciales}
                    </div>
                    <div>
                        <h5 class="fw-bold mb-1 text-dark">${nombres} ${apellidos}</h5>
                        <span class="badge ${badgeClass} fw-bold px-3 py-1 rounded-pill" style="${rol === 'Entrenador' ? 'color: var(--primary-color) !important;' : ''}">${rol}</span>
                    </div>
                </div>
                <hr class="text-muted opacity-25">
                <div class="d-flex flex-column gap-2">
                    <div class="d-flex align-items-center text-muted small fw-medium">
                        <i class="bi bi-envelope-fill me-3 fs-6 opacity-75" style="color: ${barColor};"></i> ${correo}
                    </div>
                    <div class="d-flex align-items-center text-muted small fw-medium">
                        <i class="bi bi-person-vcard-fill me-3 fs-6 opacity-75" style="color: ${barColor};"></i> ${dui}
                    </div>
                </div>
                ${obtenerHTMLBotonesUsuario()}
            </div>
        `;
        
        const tablaUsuarios = document.getElementById('tablaUsuarios');
        if (tablaUsuarios) {
            tablaUsuarios.prepend(newCol);
            
            // Reasociar filtro si hay alguno activo
            const activeFilterBtn = document.querySelector('#filtrosRol .btn-filtro.active');
            if (activeFilterBtn) {
                const filterValue = activeFilterBtn.getAttribute('data-rol');
                if (filterValue !== "" && filterValue !== rol) {
                    newCol.style.display = 'none';
                }
            }
        }
        
        const modalEl = document.getElementById('modalCrearUsuario');
        if (modalEl && typeof bootstrap !== 'undefined') {
            const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modalInstance.hide();
        }
        formCrearUsuario.reset();
        if (typeof resetAreaOptions === 'function') resetAreaOptions();

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: '¡Usuario agregado!',
                text: 'El usuario se ha creado exitosamente junto con sus botones de editar y eliminar.',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            alert('¡Usuario agregado exitosamente!');
        }
    });
}

// Delegación de eventos para eliminar y editar usuarios en la tabla
const tablaUsuariosEl = document.getElementById('tablaUsuarios');
if (tablaUsuariosEl) {
    tablaUsuariosEl.addEventListener('click', (e) => {
        const btnEliminar = e.target.closest('.btn-eliminar-usuario') || e.target.closest('.btn-outline-danger');
        const btnEditar = e.target.closest('.btn-editar-usuario') || e.target.closest('.btn-outline-secondary');
        
        if (btnEliminar) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '¿Eliminar este usuario?',
                    text: "Esta acción removerá al usuario del sistema.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const cardCol = btnEliminar.closest('.col');
                        if (cardCol) {
                            cardCol.style.transition = 'all 0.3s ease';
                            cardCol.style.opacity = '0';
                            cardCol.style.transform = 'scale(0.8)';
                            setTimeout(() => cardCol.remove(), 300);
                        }
                        Swal.fire({
                            icon: 'success',
                            title: '¡Usuario eliminado!',
                            text: 'El registro ha sido borrado exitosamente.',
                            timer: 1800,
                            showConfirmButton: false
                        });
                    }
                });
            } else {
                if (confirm('¿Estás seguro de eliminar este usuario?')) {
                    const cardCol = btnEliminar.closest('.col');
                    if (cardCol) cardCol.remove();
                }
            }
        }

        if (btnEditar) {
            const cardCol = btnEditar.closest('.col');
            const nombreEl = cardCol?.querySelector('h5');
            const emailEl = cardCol?.querySelector('.bi-envelope-fill')?.parentElement;
            const duiEl = cardCol?.querySelector('.bi-person-vcard-fill')?.parentElement;
            const rolEl = cardCol?.querySelector('.badge');

            const nombreCompleto = nombreEl?.innerText.trim() || '';
            const partesNombre = nombreCompleto.split(' ');
            const nombres = partesNombre[0] || '';
            const apellidos = partesNombre.slice(1).join(' ') || '';

            if (document.getElementById('txtNombres')) document.getElementById('txtNombres').value = nombres;
            if (document.getElementById('txtApellidos')) document.getElementById('txtApellidos').value = apellidos;
            if (document.getElementById('txtCorreo')) document.getElementById('txtCorreo').value = emailEl?.innerText.trim() || '';
            if (document.getElementById('txtDui')) document.getElementById('txtDui').value = duiEl?.innerText.trim() || '';
            if (document.getElementById('selectRol') && rolEl) {
                document.getElementById('selectRol').value = rolEl.innerText.trim();
                // Disparar evento change para mostrar opciones de rol correspondientes
                document.getElementById('selectRol').dispatchEvent(new Event('change'));
            }

            const modalEl = document.getElementById('modalCrearUsuario');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modalTitle = modalEl.querySelector('.modal-title') || document.getElementById('modalCrearUsuarioLabel');
                const submitBtn = modalEl.querySelector('button[type="submit"]');
                if (modalTitle) modalTitle.innerText = 'Editar Usuario';
                if (submitBtn) submitBtn.innerText = 'Actualizar Usuario';

                const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modalInstance.show();
            }
        }
    });
}
