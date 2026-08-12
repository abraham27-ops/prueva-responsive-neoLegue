document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleContrasena');
    const input = document.getElementById('contrasena');
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
});
