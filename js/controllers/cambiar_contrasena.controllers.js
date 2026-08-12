// Controlador para el cambio y validación de nueva contraseña - NeoLeague

function validarYCambiar(event) {
    event.preventDefault();
    const p1 = document.getElementById('pass1').value;
    const p2 = document.getElementById('pass2').value;

    if (p1 !== p2) {
        Swal.fire({
            icon: 'error',
            title: 'Las contraseñas no coinciden',
            text: 'Por favor verifica que ambas contraseñas escritas sean idénticas.',
            confirmButtonColor: '#226137'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada! 🔒',
        text: 'Tu contraseña ha sido restablecida con éxito. Redirigiéndote al inicio...',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = 'pantalla_carga.html?destino=inicio_rel';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    function configurarOjo(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                const esPassword = input.getAttribute('type') === 'password';
                input.setAttribute('type', esPassword ? 'text' : 'password');
                if (esPassword) {
                    toggle.classList.remove('fa-eye-slash');
                    toggle.classList.add('fa-eye');
                } else {
                    toggle.classList.remove('fa-eye');
                    toggle.classList.add('fa-eye-slash');
                }
            });
        }
    }
    configurarOjo('togglePass1', 'pass1');
    configurarOjo('togglePass2', 'pass2');
});
