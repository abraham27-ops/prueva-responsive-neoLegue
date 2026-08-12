// js/global.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Cargar NavBar Dinámicamente si existe el placeholder
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('nav.html')
            .then(response => response.text())
            .then(data => {
                navPlaceholder.innerHTML = data;
                initGlobalEvents(); // Inicializar eventos del nav una vez cargado
            })
            .catch(error => console.error('Error cargando el navbar:', error));
    } else {
        initGlobalEvents(); // Si no hay nav dinámico, inicializar eventos igual
    }

    function initGlobalEvents() {
        // Lógica para marcar el link activo del sidebar
        const currentPath = window.location.pathname.split('/').pop();
        if (currentPath) {
            const navLinks = document.querySelectorAll('#menu_lateral .nl-link');
            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                if (linkPath === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        // Logic for "Cerrar Sesión" across all pages
        const btnCerrarSesion = document.getElementById('btnCerrarSesion');
        
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Si existe Swal
                if(typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '¿Cerrar Sesión?',
                        text: "¿Estás seguro que deseas salir del sistema?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#28a745', // Verde éxito
                        cancelButtonColor: '#6c757d', // Gris secundario
                        confirmButtonText: 'Sí, salir',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = 'pantalla_carga.html?destino=login_rel';
                        }
                    });
                } else {
                    if(confirm("¿Estás seguro que deseas salir del sistema?")) {
                        window.location.href = 'pantalla_carga.html?destino=login_rel';
                    }
                }
            });
        }
    }
});
