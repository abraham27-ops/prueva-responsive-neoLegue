// Controlador Interactivo para la Página de Inicio (Misión 11 - FotMob Layout) - NeoLeague

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTIÓN DE CORAZONES / LIKES (EQUIPOS Y TORNEOS FAVORITOS) ---
    const likeHearts = document.querySelectorAll('.like-heart');
    
    likeHearts.forEach(heart => {
        heart.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el clic en el corazón active el contenedor
            
            // Alternar estado favorito
            const isLiked = !heart.classList.contains('unliked');
            
            if (isLiked) {
                heart.classList.add('unliked');
                heart.classList.remove('bi-heart-fill', 'text-danger');
                heart.classList.add('bi-heart');
                
                if (typeof Swal !== 'undefined') {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                    Toast.fire({
                        icon: 'info',
                        title: 'Eliminado de tus favoritos'
                    });
                }
            } else {
                heart.classList.remove('unliked', 'bi-heart');
                heart.classList.add('bi-heart-fill', 'text-danger', 'active-pulse');
                
                setTimeout(() => {
                    heart.classList.remove('active-pulse');
                }, 800);

                if (typeof Swal !== 'undefined') {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                    Toast.fire({
                        icon: 'success',
                        title: '¡Agregado a favoritos! ❤️'
                    });
                }
            }
        });
    });

    // --- 2. GESTIÓN DE FILTROS SUPERIORES (DEPORTE, TORNEO, FECHA) ---
    const filtroDeporte = document.getElementById('filtroDeporteInicio');
    const filtroTorneo = document.getElementById('filtroTorneoInicio');
    const filtroFecha = document.getElementById('filtroFechaInicio');
    const matchCards = document.querySelectorAll('.inner-card');

    function aplicarFiltrosInicio() {
        // Efecto visual al filtrar
        matchCards.forEach(card => {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 250);
        });

        if (typeof Swal !== 'undefined' && (filtroDeporte.value !== 'todos' || filtroTorneo.value !== 'todos')) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
            Toast.fire({
                icon: 'success',
                title: 'Filtro aplicado en agenda deportiva'
            });
        }
    }

    if (filtroDeporte) filtroDeporte.addEventListener('change', aplicarFiltrosInicio);
    if (filtroTorneo) filtroTorneo.addEventListener('change', aplicarFiltrosInicio);
    if (filtroFecha) {
        filtroFecha.addEventListener('change', () => {
            if (typeof Swal !== 'undefined') {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
                Toast.fire({
                    icon: 'info',
                    title: `Agenda actualizada al: ${filtroFecha.value}`
                });
            }
            aplicarFiltrosInicio();
        });
    }

});
