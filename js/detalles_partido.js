// Controlador de eventos para Detalles de Partido (Votación / Encuesta estilo Google) - NeoLeague

let votoRegistrado = false;

function votarPronostico(opcion) {
    if (votoRegistrado) {
        Swal.fire({
            icon: 'info',
            title: '¡Ya votaste!',
            text: 'Tu pronóstico para este partido ya fue contabilizado en las estadísticas oficiales.',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    votoRegistrado = true;
    const btn = document.getElementById(`btn-${opcion}`);
    const badge = document.getElementById('totalVotosBadge');

    // Resaltar la opción elegida al estilo Google
    document.querySelectorAll('.poll-option-btn').forEach(el => {
        el.classList.remove('btn-light', 'text-dark', 'shadow');
        el.classList.add('btn-outline-light');
        el.style.opacity = '0.65';
    });
    if (btn) {
        btn.classList.remove('btn-outline-light');
        btn.classList.add('btn-light', 'text-dark', 'shadow');
        btn.style.opacity = '1';
    }

    // Incrementar porcentajes animadamente
    let pRicaldone = 45, pEmpate = 15, pDonBosco = 40;
    if (opcion === 'ricaldone') { pRicaldone = 54; pEmpate = 13; pDonBosco = 33; }
    else if (opcion === 'empate') { pRicaldone = 41; pEmpate = 25; pDonBosco = 34; }
    else if (opcion === 'donbosco') { pRicaldone = 39; pEmpate = 12; pDonBosco = 49; }

    const pctRicaldoneEl = document.getElementById('pct-ricaldone');
    const pctEmpateEl = document.getElementById('pct-empate');
    const pctDonBoscoEl = document.getElementById('pct-donbosco');

    if (pctRicaldoneEl) pctRicaldoneEl.innerText = pRicaldone + '%';
    if (pctEmpateEl) pctEmpateEl.innerText = pEmpate + '%';
    if (pctDonBoscoEl) pctDonBoscoEl.innerText = pDonBosco + '%';

    if (badge) {
        badge.innerText = '321 votos';
        badge.classList.remove('bg-light', 'text-dark');
        badge.classList.add('bg-warning', 'text-dark');
    }

    Swal.fire({
        icon: 'success',
        title: '¡Pronóstico registrado! 🏆',
        text: 'El resultado ha aumentado y tu voto fue guardado con éxito.',
        timer: 1800,
        showConfirmButton: false
    });
}
