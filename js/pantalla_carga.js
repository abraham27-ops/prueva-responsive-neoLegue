// ============================================================================
//  PANTALLA DE CARGA DEPORTIVA INSTITUCIONAL – NeoLeague
//  Controla lluvia de iconos deportivos, órbitas de disciplinas y progreso en vivo
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    crearParticulasDeportivas();
    configurarSubtitulo();
    animarProgreso();
});

// ---- Subtítulo/etiqueta contextual según destino ----
function configurarSubtitulo() {
    const params = new URLSearchParams(window.location.search);
    const destino = params.get('destino') || '';
    const labelEl = document.getElementById('progressLabel');
    if (!labelEl) return;

    const mensajes = {
        'inicio':     'Iniciando sesión en NeoLeague...',
        'inicio_rel': 'Actualizando plataforma deportiva...',
        'login':      'Cerrando sesión deportiva...',
        'login_rel':  'Cerrando sesión deportiva...',
        'index':      'Cerrando sesión deportiva...',
        'index_rel':  'Cerrando sesión deportiva...'
    };

    labelEl.textContent = mensajes[destino] || 'Sincronizando disciplinas deportivas...';
}

// ---- Partículas ambientales con ICONOS DEPORTIVOS EXPLÍCITOS ----
function crearParticulasDeportivas() {
    const container = document.getElementById('sportsParticles');
    if (!container) return;

    const iconosDeportivos = [
        'fa-futbol',
        'fa-basketball-ball',
        'fa-swimmer',
        'fa-volleyball-ball',
        'fa-trophy',
        'fa-running',
        'fa-medal',
        'fa-table-tennis-paddle-ball',
        'fa-flag'
    ];

    const acentos = ['', 'accent-gold', 'accent-green'];
    const cantidadParticulas = 22;

    for (let i = 0; i < cantidadParticulas; i++) {
        const p = document.createElement('div');
        p.classList.add('sport-icon-particle');
        
        // Acento de color aleatorio
        const acento = acentos[Math.floor(Math.random() * acentos.length)];
        if (acento) p.classList.add(acento);

        // Icono deportivo aleatorio
        const icono = iconosDeportivos[Math.floor(Math.random() * iconosDeportivos.length)];
        p.innerHTML = `<i class="fas ${icono}"></i>`;

        // Tamaño aleatorio de icono entre 18px y 38px
        const size = Math.random() * 20 + 18;
        p.style.fontSize = size + 'px';
        
        // Posición horizontal
        p.style.left = Math.random() * 96 + '%';

        // Animación individual
        const duration = Math.random() * 8 + 8;
        const delay = Math.random() * 6;
        p.style.animationDuration = duration + 's';
        p.style.animationDelay = delay + 's';

        container.appendChild(p);
    }
}

// ---- Barra de progreso animada + Iluminación de Píldoras Deportivas ----
function animarProgreso() {
    const bar = document.getElementById('loadingBar');
    const percentEl = document.getElementById('loadingPercent');
    const statusEl = document.getElementById('statusText');
    const statusIcon = document.getElementById('statusIcon');
    if (!bar) return;

    // Referencias a píldoras de deportes
    const pillFutbol = document.getElementById('pillFutbol');
    const pillBasquet = document.getElementById('pillBasquet');
    const pillNatacion = document.getElementById('pillNatacion');
    const pillVoleibol = document.getElementById('pillVoleibol');

    const params = new URLSearchParams(window.location.search);
    const destino = params.get('destino') || '';
    const esCierreSesion = destino.includes('login') || destino.includes('index');

    const intervalo = 30;
    let progreso = 0;

    const timer = setInterval(() => {
        // Velocidad realista
        if (progreso < 30) {
            progreso += 1.8;
        } else if (progreso < 60) {
            progreso += 0.8;
        } else if (progreso < 85) {
            progreso += 1.4;
        } else {
            progreso += 2.5;
        }

        if (progreso >= 100) {
            progreso = 100;
            bar.style.width = '100%';
            if (percentEl) percentEl.textContent = '100%';
            
            // Iluminar todas las píldoras en completado
            [pillFutbol, pillBasquet, pillNatacion, pillVoleibol].forEach(p => {
                if (p) {
                    p.classList.remove('active');
                    p.classList.add('completed');
                }
            });

            if (statusIcon) statusIcon.className = 'fas fa-trophy status-icon';
            if (statusEl) {
                statusEl.textContent = esCierreSesion 
                    ? '¡Sesión deportiva cerrada con éxito!' 
                    : '¡Campo listo! Bienvenido a NeoLeague';
            }
            clearInterval(timer);
            iniciarTransicion();
            return;
        }

        bar.style.width = progreso + '%';
        if (percentEl) percentEl.textContent = `${Math.floor(progreso)}%`;

        // Animación progresiva de disciplinas y textos
        if (progreso > 10 && progreso <= 35) {
            if (pillFutbol) pillFutbol.classList.add('active');
            if (statusIcon) statusIcon.className = 'fas fa-futbol status-icon';
            if (statusEl) statusEl.textContent = esCierreSesion ? 'Guardando partidos de Fútbol...' : 'Sincronizando torneos de Fútbol...';
        } 
        else if (progreso > 35 && progreso <= 60) {
            if (pillFutbol) { pillFutbol.classList.remove('active'); pillFutbol.classList.add('completed'); }
            if (pillBasquet) pillBasquet.classList.add('active');
            if (statusIcon) statusIcon.className = 'fas fa-basketball-ball status-icon';
            if (statusEl) statusEl.textContent = esCierreSesion ? 'Respaldando marcadores de Baloncesto...' : 'Cargando ligas de Baloncesto...';
        } 
        else if (progreso > 60 && progreso <= 85) {
            if (pillBasquet) { pillBasquet.classList.remove('active'); pillBasquet.classList.add('completed'); }
            if (pillNatacion) pillNatacion.classList.add('active');
            if (statusIcon) statusIcon.className = 'fas fa-swimmer status-icon';
            if (statusEl) statusEl.textContent = esCierreSesion ? 'Archivando tiempos de Natación...' : 'Actualizando récords de Natación...';
        } 
        else if (progreso > 85) {
            if (pillNatacion) { pillNatacion.classList.remove('active'); pillNatacion.classList.add('completed'); }
            if (pillVoleibol) pillVoleibol.classList.add('active');
            if (statusIcon) statusIcon.className = 'fas fa-volleyball-ball status-icon';
            if (statusEl) statusEl.textContent = esCierreSesion ? 'Finalizando sesión de torneos...' : 'Preparando el campo de juego para ti...';
        }

    }, intervalo);
}

// ---- Transición de salida ----
function iniciarTransicion() {
    const body = document.body;

    setTimeout(() => {
        body.classList.add('fade-out');

        setTimeout(() => {
            const destino = obtenerDestino();
            window.location.href = destino;
        }, 600);
    }, 450);
}

// ---- Leer destino desde el query param ----
function obtenerDestino() {
    const params = new URLSearchParams(window.location.search);
    const destino = params.get('destino');

    const destinosValidos = {
        'inicio':      'inicio.html',
        'login':       '../index.html',
        'index':       '../index.html',
        'inicio_rel':  'inicio.html',
        'login_rel':   '../index.html',
        'index_rel':   '../index.html'
    };

    if (destino && destinosValidos[destino]) {
        return destinosValidos[destino];
    }

    if (destino) {
        return destino;
    }

    return 'inicio.html';
}
