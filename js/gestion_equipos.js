// GestionEquipos.js

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los modales
    const modalPreSeleccion = new bootstrap.Modal(document.getElementById('modalPreSeleccion'));
    const modalCrearEquipo = new bootstrap.Modal(document.getElementById('modalCrearEquipo'));
    const modalInscribirAlumnos = new bootstrap.Modal(document.getElementById('modalInscribirAlumnos'));

    const btnCrearEquipoPrincipal = document.getElementById('btnCrearEquipoPrincipal');
    const cardsDeporte = document.querySelectorAll('.sport-selector-card');
    const formCrearEquipo = document.getElementById('formCrearEquipo');

    const selectDeporteGeneral = document.getElementById('selectDeporteGeneral');
    const selectTipoEquipo = document.getElementById('selectTipoEquipo');
    const containerCategoria = document.getElementById('containerCategoria');

    // Mantenemos el estado de la creación actual
    let deporteSeleccionadoTemporal = '';

    const btnLeft = document.getElementById('btnScrollLeft');
    const btnRight = document.getElementById('btnScrollRight');
    const carouselContainer = document.querySelector('.carousel-equipos-container');
    
    if (btnLeft && btnRight && carouselContainer) {
        
        // --- LÓGICA DE CARRUSEL INFINITO ---
        const originalCards = Array.from(carouselContainer.querySelectorAll('.carousel-item-card'));
        const setSize = originalCards.length;
        
        // Clonar para hacer 5 sets: [Set 1] [Set 2] [Set 3 (Original)] [Set 4] [Set 5]
        for (let i = 0; i < 2; i++) {
            originalCards.forEach(card => {
                let clone = card.cloneNode(true);
                carouselContainer.appendChild(clone);
            });
            originalCards.slice().reverse().forEach(card => {
                let clone = card.cloneNode(true);
                carouselContainer.insertBefore(clone, carouselContainer.firstChild);
            });
        }

        let allCards = carouselContainer.querySelectorAll('.carousel-item-card');

        // Variables para el loop infinito
        let isJumping = false;
        
        // Centrar en el Set 3 (Centro) al cargar
        setTimeout(() => {
            carouselContainer.style.scrollBehavior = 'auto';
            allCards[setSize * 2].scrollIntoView({ block: 'nearest', inline: 'center' });
            setTimeout(() => {
                carouselContainer.style.scrollBehavior = 'smooth';
            }, 50);
        }, 100);

        // Función para centrar horizontalmente sin saltos verticales
        function smoothScrollToCenter(element) {
            let containerRect = carouselContainer.getBoundingClientRect();
            let elementRect = element.getBoundingClientRect();
            let currentScroll = carouselContainer.scrollLeft;
            let scrollDiff = (elementRect.left + (elementRect.width / 2)) - (containerRect.left + (containerRect.width / 2));
            carouselContainer.scrollTo({ left: currentScroll + scrollDiff, behavior: 'smooth' });
        }

        // --- CONTROLES DE BOTONES ---
        btnLeft.addEventListener('click', () => {
            let current = carouselContainer.querySelector('.center-focus');
            if (current && current.previousElementSibling) {
                smoothScrollToCenter(current.previousElementSibling);
            }
        });
        btnRight.addEventListener('click', () => {
            let current = carouselContainer.querySelector('.center-focus');
            if (current && current.nextElementSibling) {
                smoothScrollToCenter(current.nextElementSibling);
            }
        });

        // --- ACTUALIZAR TARJETA CENTRAL Y BUCLE INFINITO ---
        function handleScroll() {
            if (isJumping) return;

            // 1. Lógica de bucle infinito (Jump)
            let singleCardWidth = originalCards[0].offsetWidth;
            let cardStyle = window.getComputedStyle(originalCards[0]);
            let totalCardWidth = singleCardWidth + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
            let setWidthInPixels = totalCardWidth * setSize;

            if (carouselContainer.scrollLeft < setWidthInPixels * 1.0) {
                // Muy a la izquierda (Set 1) -> Salto suave al Set 3
                isJumping = true;
                carouselContainer.style.scrollBehavior = 'auto';
                carouselContainer.scrollLeft += (setWidthInPixels * 2);
                setTimeout(() => {
                    carouselContainer.style.scrollBehavior = 'smooth';
                    isJumping = false;
                }, 50);
            } else if (carouselContainer.scrollLeft > setWidthInPixels * 4.0) {
                // Muy a la derecha (Set 5) -> Salto suave al Set 3
                isJumping = true;
                carouselContainer.style.scrollBehavior = 'auto';
                carouselContainer.scrollLeft -= (setWidthInPixels * 2);
                setTimeout(() => {
                    carouselContainer.style.scrollBehavior = 'smooth';
                    isJumping = false;
                }, 50);
            }

            // 2. Lógica para resaltar la tarjeta central (Character Select)
            allCards = carouselContainer.querySelectorAll('.carousel-item-card');
            let containerRect = carouselContainer.getBoundingClientRect();
            let containerCenterScreen = containerRect.left + (containerRect.width / 2);
            
            let closestCard = null;
            let closestDistance = Infinity;

            allCards.forEach(card => {
                card.classList.remove('center-focus');
                let rect = card.getBoundingClientRect();
                let cardCenterScreen = rect.left + (rect.width / 2);
                let distance = Math.abs(containerCenterScreen - cardCenterScreen);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestCard = card;
                }
            });

            if (closestCard) {
                closestCard.classList.add('center-focus');
            }
        }

        // Detectar scroll
        carouselContainer.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 150);

        // --- AUTO-SCROLL LOGIC ---
        let autoScrollInterval = setInterval(() => {
            let current = carouselContainer.querySelector('.center-focus');
            if (current && current.nextElementSibling) {
                smoothScrollToCenter(current.nextElementSibling);
            }
        }, 5000); // 5 segundos

        // Pausar si el usuario pone el mouse encima
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        
        // Reanudar cuando quite el mouse
        carouselContainer.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => {
                let current = carouselContainer.querySelector('.center-focus');
                if (current && current.nextElementSibling) {
                    smoothScrollToCenter(current.nextElementSibling);
                }
            }, 5000);
        });
    }

    // 1. Abrir Modal de Pre-Selección
    if (btnCrearEquipoPrincipal) {
        btnCrearEquipoPrincipal.addEventListener('click', () => {
            // Limpiar selección previa
            cardsDeporte.forEach(c => c.classList.remove('active'));
            deporteSeleccionadoTemporal = '';
            modalPreSeleccion.show();
        });
    }

    // 2. Seleccionar entre Natación y Otro Deporte
    cardsDeporte.forEach(card => {
        card.addEventListener('click', function() {
            cardsDeporte.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            deporteSeleccionadoTemporal = this.dataset.deporte;
        });
    });

    const btnContinuarDeporte = document.getElementById('btnContinuarDeporte');
    if (btnContinuarDeporte) {
        btnContinuarDeporte.addEventListener('click', () => {
            if (!deporteSeleccionadoTemporal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Por favor, selecciona si es Natación u Otro Deporte.'
                });
                return;
            }

            modalPreSeleccion.hide();
            
            // Configurar el Modal de Crear Equipo basado en la selección
            if (deporteSeleccionadoTemporal === 'Natacion') {
                selectDeporteGeneral.innerHTML = '<option value="Natacion" selected>Natación</option>';
                selectDeporteGeneral.disabled = true; // Bloqueado en Natación
            } else {
                selectDeporteGeneral.innerHTML = `
                    <option value="" selected disabled>Seleccione un Deporte</option>
                    <option value="Futbol">Fútbol</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Volleyball">Volleyball</option>
                `;
                selectDeporteGeneral.disabled = false;
            }

            formCrearEquipo.reset();
            containerCategoria.classList.add('d-none'); // Esconder categoría por defecto
            
            setTimeout(() => {
                modalCrearEquipo.show();
            }, 400); // Dar tiempo a que se cierre el anterior
        });
    }

    // 3. Mostrar Categoría solo si es "Selección"
    if (selectTipoEquipo) {
        selectTipoEquipo.addEventListener('change', (e) => {
            if (e.target.value === 'Seleccion') {
                containerCategoria.classList.remove('d-none');
                document.getElementById('selectCategoria').required = true;
            } else {
                containerCategoria.classList.add('d-none');
                document.getElementById('selectCategoria').required = false;
            }
        });
    }

    // 4. Lógica simulada de "Guardar Equipo"
    if (formCrearEquipo) {
        formCrearEquipo.addEventListener('submit', (e) => {
            e.preventDefault();
            modalCrearEquipo.hide();
            Swal.fire({
                icon: 'success',
                title: '¡Equipo Creado!',
                text: 'El equipo se ha registrado correctamente.',
                confirmButtonColor: '#226137'
            });
        });
    }

    // ==============================================
    // LÓGICA DE INSCRIPCIÓN DE ALUMNOS (MODAL 3)
    // ==============================================

    const botonesInscribir = document.querySelectorAll('.btn-inscribir-alumnos');
    const listadoAlumnosContainer = document.getElementById('listadoAlumnosContainer');
    
    // Alumnos mock para probar
    const mockEstudiantes = [
        { id: 1, nombre: "Juan Pérez", especialidad: "Desarrollo de Software", yaEnEquipo: false },
        { id: 2, nombre: "Ana Gómez", especialidad: "Diseño Gráfico", yaEnEquipo: true }, // Simulamos que ya está
        { id: 3, nombre: "Carlos Ruiz", especialidad: "Desarrollo de Software", yaEnEquipo: false },
        { id: 4, nombre: "María López", especialidad: "Electrónica", yaEnEquipo: false },
        { id: 5, nombre: "Luis Martínez", especialidad: "Desarrollo de Software", yaEnEquipo: false },
    ];

    let alumnosSeleccionadosParaEquipo = [];
    let deporteActualParaInscripcion = ''; // Se setea al abrir el modal (ej: 'Futbol')

    botonesInscribir.forEach(btn => {
        btn.addEventListener('click', function() {
            deporteActualParaInscripcion = this.dataset.deporte;
            alumnosSeleccionadosParaEquipo = [];
            renderizarAlumnos();
            modalInscribirAlumnos.show();
        });
    });

    function renderizarAlumnos() {
        if (!listadoAlumnosContainer) return;
        listadoAlumnosContainer.innerHTML = '';

        mockEstudiantes.forEach(est => {
            const isSelected = alumnosSeleccionadosParaEquipo.includes(est.id);
            
            const div = document.createElement('div');
            div.className = 'student-list-item d-flex justify-content-between align-items-center';
            div.innerHTML = `
                <div>
                    <h6 class="mb-0 fw-bold text-dark">${est.nombre}</h6>
                    <small class="text-muted"><i class="fa-solid fa-graduation-cap me-1"></i>${est.especialidad}</small>
                </div>
                <button type="button" class="btn-add-student ${isSelected ? 'added' : ''}" data-id="${est.id}" data-yaenequipo="${est.yaEnEquipo}" title="${isSelected ? 'Quitar' : 'Añadir'}">
                    <i class="fa-solid ${isSelected ? 'fa-minus' : 'fa-plus'}"></i>
                </button>
            `;
            listadoAlumnosContainer.appendChild(div);
        });

        // Asignar eventos a los nuevos botones
        document.querySelectorAll('.btn-add-student').forEach(btn => {
            btn.addEventListener('click', toggleAlumno);
        });
    }

    function toggleAlumno(e) {
        const btn = e.currentTarget;
        const id = parseInt(btn.dataset.id);
        const yaEnEquipo = btn.dataset.yaenequipo === 'true';

        // Validar Unicidad (Regla de negocio: Si ya está en un equipo de este deporte, no puede añadir)
        // Nota: Asumimos por ahora que no es selección para la demo. 
        if (!alumnosSeleccionadosParaEquipo.includes(id) && yaEnEquipo) {
            Swal.fire({
                icon: 'error',
                title: 'Alumno no disponible',
                text: 'Este estudiante ya pertenece a otro equipo de este deporte en este torneo.',
                confirmButtonColor: '#226137'
            });
            return;
        }

        if (alumnosSeleccionadosParaEquipo.includes(id)) {
            alumnosSeleccionadosParaEquipo = alumnosSeleccionadosParaEquipo.filter(aid => aid !== id);
        } else {
            alumnosSeleccionadosParaEquipo.push(id);
        }
        renderizarAlumnos();
    }

    // Botón Guardar Inscripción (Ejecutar validaciones de mínimos)
    const btnGuardarInscripcion = document.getElementById('btnGuardarInscripcion');
    if (btnGuardarInscripcion) {
        btnGuardarInscripcion.addEventListener('click', () => {
            const cantidad = alumnosSeleccionadosParaEquipo.length;

            let minimoRequerido = 0;
            if (deporteActualParaInscripcion === 'Futbol') minimoRequerido = 7;
            else if (deporteActualParaInscripcion === 'Basketball' || deporteActualParaInscripcion === 'Volleyball') minimoRequerido = 3;
            else if (deporteActualParaInscripcion === 'Natacion') minimoRequerido = 4;

            if (cantidad < minimoRequerido) {
                // Alerta Compleja: Fusión de Especialidades
                Swal.fire({
                    icon: 'warning',
                    title: 'Estudiantes Insuficientes',
                    html: `Necesitas mínimo <b>${minimoRequerido}</b> estudiantes para <b>${deporteActualParaInscripcion}</b>.<br><br>¿Deseas fusionar tu equipo con estudiantes de otra especialidad que también tengan pocos inscritos?`,
                    showCancelButton: true,
                    confirmButtonText: '<i class="fa-solid fa-people-group me-2"></i> Fusionar Especialidad',
                    cancelButtonText: 'Seguir buscando',
                    confirmButtonColor: '#226137',
                    cancelButtonColor: '#6c757d'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Aquí se abriría el select de especialidades para fusionar
                        Swal.fire({
                            title: 'Seleccionar Especialidad para Fusión',
                            html: `
                                <div class="text-start mt-3">
                                    <p class="text-muted">Elige de dónde tomar estudiantes prestados:</p>
                                    <div class="list-group">
                                        <label class="list-group-item d-flex gap-3 align-items-center" style="cursor: pointer;">
                                            <input class="form-check-input flex-shrink-0 fs-5 mt-0" type="radio" name="especialidadFusion" value="Diseño Gráfico" checked>
                                            <span class="flex-grow-1">
                                                <i class="fa-solid fa-pen-nib text-primary me-2"></i>Diseño Gráfico
                                            </span>
                                            <span class="badge bg-secondary rounded-pill">3 disp.</span>
                                        </label>
                                        <label class="list-group-item d-flex gap-3 align-items-center" style="cursor: pointer;">
                                            <input class="form-check-input flex-shrink-0 fs-5 mt-0" type="radio" name="especialidadFusion" value="Electrónica">
                                            <span class="flex-grow-1">
                                                <i class="fa-solid fa-microchip text-primary me-2"></i>Electrónica
                                            </span>
                                            <span class="badge bg-secondary rounded-pill">4 disp.</span>
                                        </label>
                                        <label class="list-group-item d-flex gap-3 align-items-center" style="cursor: pointer;">
                                            <input class="form-check-input flex-shrink-0 fs-5 mt-0" type="radio" name="especialidadFusion" value="Arquitectura">
                                            <span class="flex-grow-1">
                                                <i class="fa-solid fa-building text-primary me-2"></i>Arquitectura
                                            </span>
                                            <span class="badge bg-secondary rounded-pill">2 disp.</span>
                                        </label>
                                    </div>
                                </div>
                            `,
                            showCancelButton: true,
                            confirmButtonColor: '#226137',
                            confirmButtonText: 'Fusionar',
                            cancelButtonText: 'Cancelar',
                            preConfirm: () => {
                                const selected = document.querySelector('input[name="especialidadFusion"]:checked');
                                if (!selected) {
                                    Swal.showValidationMessage('Por favor selecciona una especialidad');
                                }
                                return selected.value;
                            }
                        }).then((fusionResult) => {
                            if(fusionResult.isConfirmed) {
                                const especialidadOriginal = "Desarrollo de Software";
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡Fusión Exitosa!', 
                                    html: `El nombre del equipo ha sido actualizado automáticamente a:<br><br><b class="fs-5 text-success">Fusión ${especialidadOriginal} y ${fusionResult.value}</b><br><br>Los alumnos de ambas especialidades ahora están habilitados para este equipo.`, 
                                    confirmButtonColor: '#226137'
                                });
                            }
                        });
                    }
                });
            } else {
                modalInscribirAlumnos.hide();
                Swal.fire({
                    icon: 'success',
                    title: 'Inscripción Completa',
                    text: `Has inscrito a ${cantidad} estudiantes en el equipo.`,
                    confirmButtonColor: '#226137'
                });
            }
        });
    }
});
