// Filtros de favoritos
const filtros = document.querySelectorAll('#filtrosFavoritos .btn-filtro');
const items = document.querySelectorAll('.fav-item');

if (filtros.length > 0 && items.length > 0) {
    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            filtros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            items.forEach(item => {
                item.style.display = (filter === 'all' || item.getAttribute('data-type') === filter) ? 'block' : 'none';
            });
        });
    });
}

// Animación de corazón
const heartBtns = document.querySelectorAll('.heart-btn');
if (heartBtns.length > 0) {
    heartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.replace('fa-regular', 'fa-solid');
                icon.style.animation = 'none';
                icon.offsetHeight; // trigger reflow
                icon.style.animation = null;
            } else {
                icon.classList.replace('fa-solid', 'fa-regular');
            }
        });
    });
}
