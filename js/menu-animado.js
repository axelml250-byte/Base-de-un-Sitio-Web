// =========================================================================
// LOGICA PARA ESCONDER EL MENÚ AL BAJAR Y MOSTRARLO AL SUBIR
// =========================================================================

let ultimaPosicionScroll = window.pageYOffset || document.documentElement.scrollTop;

window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (!header) return;

    // Capturamos la posición actual en la que va el usuario scrollenado
    let posicionActualScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Evitamos problemas si el usuario llega al tope arriba o abajo (efecto rebote en iPhone)
    if (posicionActualScroll < 0) return; 

    if (posicionActualScroll > ultimaPosicionScroll) {
        // SI BAJA: Agregamos la clase que empuja el menú hacia arriba para esconderlo
        header.classList.add('hidden-header');
    } else {
        // SI SUBE: Quitamos la clase para que el menú regrese a su posición original
        header.classList.remove('hidden-header');
    }

    // Actualizamos la posición para la siguiente lectura
    ultimaPosicionScroll = posicionActualScroll;
});

// Función para abrir y cerrar el menú de las 3 rayitas
function toggleMenuUniversal() {
    const dropdown = document.getElementById('dropdown-universal');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}

// Opcional: Cierra el menú si el usuario da clic en cualquier otra parte de la pantalla
window.onclick = function(event) {
    if (!event.target.matches('#btn-hamburguesa')) {
        const dropdown = document.getElementById('dropdown-universal');
        if (dropdown && dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    }
}