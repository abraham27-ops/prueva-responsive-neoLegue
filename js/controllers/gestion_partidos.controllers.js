// ==========================================
// Lógica de Gestión de Partidos (Misión 10)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Función genérica para inicializar un carrusel infinito tipo "Character Select"
    function initInfiniteCarousel(containerId, btnLeftId, btnRightId) {
        const carouselContainer = document.getElementById(containerId);
        const btnLeft = document.getElementById(btnLeftId);
        const btnRight = document.getElementById(btnRightId);
        
        if (!carouselContainer) return;

        // --- LÓGICA DE CARRUSEL INFINITO ---
        const originalCards = Array.from(carouselContainer.querySelectorAll('.carousel-partido-card'));
        const setSize = originalCards.length;
        if (setSize === 0) return;
        
        // Clonar para hacer 5 sets: [Set 1] [Set 2] [Set 3 (Original)] [Set 4] [Set 5]
        for (let i = 0; i < 2; i++) {
            originalCards.forEach(card => {
                let clone = card.cloneNode(true);
                clone.classList.add('clone-card');
                carouselContainer.appendChild(clone);
            });
            originalCards.slice().reverse().forEach(card => {
                let clone = card.cloneNode(true);
                clone.classList.add('clone-card');
                carouselContainer.insertBefore(clone, carouselContainer.firstChild);
            });
        }

        let allCards = carouselContainer.querySelectorAll('.carousel-partido-card');

        // Variables para el loop infinito
        let isJumping = false;
        
        // Función para centrar horizontalmente sin saltos verticales
        function smoothScrollToCenter(element, behavior = 'smooth') {
            let containerRect = carouselContainer.getBoundingClientRect();
            let elementRect = element.getBoundingClientRect();
            let currentScroll = carouselContainer.scrollLeft;
            let scrollDiff = (elementRect.left + (elementRect.width / 2)) - (containerRect.left + (containerRect.width / 2));
            carouselContainer.scrollTo({ left: currentScroll + scrollDiff, behavior: behavior });
        }

        // Centrar en el Set 3 (Centro) al cargar
        setTimeout(() => {
            if(allCards[setSize * 2]) {
                smoothScrollToCenter(allCards[setSize * 2], 'auto');
            }
        }, 100);

        // --- CONTROLES DE BOTONES ---
        if (btnLeft && btnRight) {
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
        }

        // --- ACTUALIZAR TARJETA CENTRAL Y BUCLE INFINITO ---
        function handleScroll() {
            if (isJumping || window.isFilteringPartidos) return;

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
            allCards = carouselContainer.querySelectorAll('.carousel-partido-card');
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
            if (window.isFilteringPartidos) return;
            let current = carouselContainer.querySelector('.center-focus');
            if (current && current.nextElementSibling && current.nextElementSibling.style.display !== 'none') {
                smoothScrollToCenter(current.nextElementSibling);
            }
        }, 5000); // 5 segundos

        // Pausar si el usuario pone el mouse encima
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        
        // Reanudar cuando quite el mouse
        carouselContainer.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => {
                if (window.isFilteringPartidos) return;
                let current = carouselContainer.querySelector('.center-focus');
                if (current && current.nextElementSibling && current.nextElementSibling.style.display !== 'none') {
                    smoothScrollToCenter(current.nextElementSibling);
                }
            }, 5000);
        });
    }

    // Inicializar los dos carruseles
    initInfiniteCarousel('carouselProximos', 'btnPrevProximos', 'btnNextProximos');
    initInfiniteCarousel('carouselResultados', 'btnPrevResultados', 'btnNextResultados');

    // ==========================================
    // LÓGICA DE FILTRADO MULTICRITERIO (OPCIÓN 1)
    // ==========================================
    window.isFilteringPartidos = false;

    const filtroTorneo = document.getElementById('filtroTorneo');
    const filtroDeporte = document.getElementById('filtroDeporte');
    const filtroEquipo = document.getElementById('filtroEquipo');
    const btnLimpiar = document.getElementById('btnLimpiarFiltros');

    function aplicarFiltros() {
        const valTorneo = filtroTorneo?.value.toLowerCase() || '';
        const valDeporte = filtroDeporte?.value.toLowerCase() || '';
        const valEquipo = filtroEquipo?.value.toLowerCase().trim() || '';

        // Determinar si hay algún filtro activo
        const hayFiltro = valTorneo !== '' || valDeporte !== '' || valEquipo !== '';
        window.isFilteringPartidos = hayFiltro;

        function cumpleCriterios(elemento) {
            const texto = elemento.textContent.toLowerCase();
            const coincideTorneo = !valTorneo || texto.includes(valTorneo);
            const coincideDeporte = !valDeporte || texto.includes(valDeporte);
            const coincideEquipo = !valEquipo || texto.includes(valEquipo);
            return coincideTorneo && coincideDeporte && coincideEquipo;
        }

        // 1. Filtrar Grid: Todos los Partidos
        const itemsGrid = document.querySelectorAll('#gridTodosPartidos > .col');
        itemsGrid.forEach(item => {
            if (cumpleCriterios(item)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });

        // 2. Filtrar Carruseles (Próximos y Resultados)
        ['carouselProximos', 'carouselResultados'].forEach(id => {
            const container = document.getElementById(id);
            if (!container) return;

            const cards = container.querySelectorAll('.carousel-partido-card');
            cards.forEach(card => {
                const esClon = card.classList.contains('clone-card');
                if (hayFiltro) {
                    // Si estamos filtrando, ocultar clones para evitar duplicados en los resultados
                    if (esClon) {
                        card.style.display = 'none';
                    } else {
                        card.style.display = cumpleCriterios(card) ? 'inline-flex' : 'none';
                    }
                } else {
                    // Si se limpió el filtro, mostrar todas (originales y clones)
                    card.style.display = 'inline-flex';
                }
            });

            // Si se eliminaron los filtros, recentrar suavemente en el set original
            if (!hayFiltro) {
                setTimeout(() => {
                    const original = container.querySelector('.carousel-partido-card:not(.clone-card)');
                    if (original) {
                        let containerRect = container.getBoundingClientRect();
                        let originalRect = original.getBoundingClientRect();
                        let currentScroll = container.scrollLeft;
                        let scrollDiff = (originalRect.left + (originalRect.width / 2)) - (containerRect.left + (containerRect.width / 2));
                        container.scrollTo({ left: currentScroll + scrollDiff, behavior: 'smooth' });
                    }
                }, 50);
            }
        });
    }

    if (filtroTorneo && filtroDeporte && filtroEquipo) {
        filtroTorneo.addEventListener('change', aplicarFiltros);
        filtroDeporte.addEventListener('change', aplicarFiltros);
        filtroEquipo.addEventListener('input', aplicarFiltros);
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (filtroTorneo) filtroTorneo.value = '';
            if (filtroDeporte) filtroDeporte.value = '';
            if (filtroEquipo) filtroEquipo.value = '';
            aplicarFiltros();
        });
    }

    // Misión 13: Cargar torneo seleccionado desde parámetro URL si viene de gestión de torneos
    const urlParams = new URLSearchParams(window.location.search);
    const paramTorneo = urlParams.get('torneo');
    if (paramTorneo && filtroTorneo) {
        let optionExists = Array.from(filtroTorneo.options).some(opt => opt.value.toLowerCase() === paramTorneo.toLowerCase());
        if (!optionExists) {
            const newOpt = document.createElement('option');
            newOpt.value = paramTorneo;
            newOpt.textContent = paramTorneo;
            filtroTorneo.appendChild(newOpt);
        }
        filtroTorneo.value = paramTorneo;
        setTimeout(() => {
            aplicarFiltros();
        }, 150);
    }

    // --- FORMULARIO CREAR NUEVO PARTIDO ---
    const formCrearPartido = document.getElementById('formCrearPartido');
    if (formCrearPartido) {
        formCrearPartido.addEventListener('submit', (e) => {
            e.preventDefault();

            const selects = formCrearPartido.querySelectorAll('select');
            const deporte = selects[1] ? selects[1].value : 'Deporte';
            const urlDestino = deporte.toLowerCase().includes('natación') ? 'detalles_partido_natacion.html' : 'detalles_partido.html';

            const modalEl = document.getElementById('modalCrearPartido');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            formCrearPartido.reset();

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Partido Programado!',
                    text: `El evento de ${deporte} ha sido agregado al calendario exitosamente. Redirigirá a ${urlDestino} al abrir sus detalles.`,
                    confirmButtonColor: '#226137',
                    timer: 3500,
                    timerProgressBar: true
                });
            }
        });
    }

});
