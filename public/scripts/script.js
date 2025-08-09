const PRECIOS_PRODUCTOS = {
    tamanios: {
        // individual: 15000,
        mediana: 19000,
        grande: 21000
        //dos_pisos: 28000
    },
    rellenos: {
        dulce_de_leche: 2300,
        mousse: 2200,
        chips_de_chocolate: 2500,
        crema: 3000,
        frutilla_o_durazno: 3500,
        galletas_a_eleccion: 4000,
        trozos_de_chocolate: 4500,
        pasta_de_mani: 5800,
        mantecol: 6000,
        nutella: 6700,
        personalizado: 7000
    },
    toppings: {
        crema_decorativa: 1200,
        oreo: 3200,
        frutas_a_eleccion: 3600,
        chocolate: 4500,
        nutella: 6000,
        personalizado: 5500
    }
    // decoraciones: {
    //     trozos_de_caramelo: 2300,
    //     frutas: 2600,
    //     galletitas: 3500,
    //     cobertura_de_crema: 3800,
    //     disenos_con_crema: 4000,
    //     mazapan: 4600,
    //     impresiones_de_papel_arroz: 5600,
    //     trozos_de_chocolates: 5800,
    //     cobertura_de_chocolate: 6500
    // }
};

function capitalizar(texto) {
    return texto.replace(/([A-Z])/g, ' $1')
        .replace(/^./, s => s.toUpperCase())
        .replace(/_/g, ' ')
        .replace(/eleccion/g, 'elección')
        .replace(/disenos/g, 'diseños')
        .replace(/mani/g, 'maní');
}

function redondearCienArriba(num) {
    return Math.ceil(num / 100) * 100;
}

function renderizarOpciones() {
    renderizarGrupo('rellenos', 'relleno1-list', 'relleno1');
    renderizarGrupo('rellenos', 'relleno2-list', 'relleno2');
    renderizarGrupo('toppings', 'toppings-list', 'topping');
}

//Esto es en caso de incluir las decoraciones exteriores
// function renderizarOpciones() {
//     renderizarGrupo('rellenos', 'fillings-list', 'relleno');
//     renderizarGrupo('toppings', 'toppings-list', 'topping');
//     renderizarGrupo('decoraciones', 'decorations-list', 'decoracion');
// }

function renderizarGrupo(tipo, idContenedor, clase) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.innerHTML = '';
    Object.entries(PRECIOS_PRODUCTOS[tipo]).forEach(([clave, precio]) => {
        contenedor.innerHTML += `
            <div class="checkbox-container">
                <input type="checkbox" id="${clase}-${clave}" data-clave="${clave}" class="opcion-pastel pastel-${clase}">
                <label for="${clase}-${clave}">${capitalizar(clave)}</label>
                <span class="price-tag" id="precio-${clase}-${clave}">$${precio.toLocaleString()}</span>
            </div>
        `;
    });
}

//Limita la selección a un máximo de 3 ingredientes por relleno
function limitarSeleccion(idContenedor, clase) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.addEventListener('change', function (e) {
        if (e.target.classList.contains(clase)) {
            const seleccionados = contenedor.querySelectorAll('input[type="checkbox"]:checked');
            if (seleccionados.length > 3) {
                e.target.checked = false;
                Swal.fire({
                    icon: 'warning',
                    title: 'Máximo 3 ingredientes',
                    text: 'Solo puedes elegir hasta 3 ingredientes para este relleno.',
                    confirmButtonColor: '#e78f8fff'
                });
            }
        }
    });
}

//Obtiene el multiplicador basado en el tamaño seleccionado
function obtenerMultiplicador() {
    const tamanioSeleccionado = document.querySelector('.pastel-tamanio:checked');
    if (!tamanioSeleccionado) return 1;
    return parseFloat(tamanioSeleccionado.getAttribute('data-multiplier')) || 1;
}

function actualizarPreciosOpciones() {
    const multiplicador = obtenerMultiplicador();
    actualizarPreciosGrupo('rellenos', 'relleno1', multiplicador);
    actualizarPreciosGrupo('rellenos', 'relleno2', multiplicador);
    actualizarPreciosGrupo('toppings', 'topping', multiplicador);
    // actualizarPreciosGrupo('decoraciones', 'decoracion', multiplicador);
}

//Actualiza los precios de los grupos de opciones
function actualizarPreciosGrupo(tipo, clase, multiplicador) {
    Object.entries(PRECIOS_PRODUCTOS[tipo]).forEach(([clave, base]) => {
        let precio = base;
        if (multiplicador !== 1) precio = redondearCienArriba(base * multiplicador);
        else precio = redondearCienArriba(base);
        const etiquetaPrecio = document.getElementById(`precio-${clase}-${clave}`);
        if (etiquetaPrecio) etiquetaPrecio.textContent = `$${precio.toLocaleString()}`;
    });
}

function obtenerPrecioDeSpan(input, clase) {
    const clave = input.getAttribute('data-clave');
    const etiquetaPrecio = document.getElementById(`precio-${clase}-${clave}`);
    if (!etiquetaPrecio) return 0;
    return parseInt(etiquetaPrecio.textContent.replace(/\D/g, '')) || 0;
}

function calcularTotal() {
    const tamanioSeleccionado = document.querySelector('.pastel-tamanio:checked');
    let total = 0;

    // Precio base
    if (tamanioSeleccionado) {
        total += parseInt(tamanioSeleccionado.getAttribute('data-price')) || 0;
    }

    // Relleno 1
    document.querySelectorAll('.pastel-relleno1:checked').forEach(input => {
        total += obtenerPrecioDeSpan(input, 'relleno1');
    });
    // Relleno 2
    document.querySelectorAll('.pastel-relleno2:checked').forEach(input => {
        total += obtenerPrecioDeSpan(input, 'relleno2');
    });

    // Toppings
    document.querySelectorAll('.pastel-topping:checked').forEach(input => {
        total += obtenerPrecioDeSpan(input, 'topping');
    });

    // // Decoraciones
    // document.querySelectorAll('.pastel-decoracion:checked').forEach(input => {
    //     total += obtenerPrecioDeSpan(input, 'decoracion');
    // });

    document.getElementById('total-price').textContent = `$${total.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', function () {
    renderizarOpciones();

    limitarSeleccion('relleno1-list', 'pastel-relleno1');
    limitarSeleccion('relleno2-list', 'pastel-relleno2');

    // Listeners para actualizar precios y total
    document.querySelectorAll('.cake-size').forEach(option => {
        option.classList.add('pastel-tamanio');
        option.addEventListener('change', () => {
            actualizarPreciosOpciones();
            calcularTotal();
        });
    });

    document.getElementById('relleno1-list').addEventListener('change', calcularTotal);
    document.getElementById('relleno2-list').addEventListener('change', calcularTotal);
    document.getElementById('toppings-list').addEventListener('change', calcularTotal);
    // document.getElementById('decorations-list').addEventListener('change', calcularTotal);

    // Botón WhatsApp
    document.getElementById('contact-button').addEventListener('click', function () {
        const tamanioSeleccionado = document.querySelector('.pastel-tamanio:checked');
        const rellenos1 = Array.from(document.querySelectorAll('.pastel-relleno1:checked'));
        const rellenos2 = Array.from(document.querySelectorAll('.pastel-relleno2:checked'));
        if (!tamanioSeleccionado) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona un tamaño',
                text: 'Por favor, selecciona un tamaño de torta.',
                confirmButtonColor: '#FFA500'
            });
            return;
        }
        if (rellenos1.length === 0 && rellenos2.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona al menos un relleno',
                text: 'Por favor, selecciona al menos un ingrediente en alguno de los rellenos.',
                confirmButtonColor: '#FFA500'
            });
            return;
        }

        const nombreTamanio = tamanioSeleccionado ? tamanioSeleccionado.nextElementSibling.textContent : '';
        const nombresRellenos1 = rellenos1.map(f => f.nextElementSibling.textContent);
        const nombresRellenos2 = rellenos2.map(f => f.nextElementSibling.textContent);
        const toppings = Array.from(document.querySelectorAll('.pastel-topping:checked')).map(t => t.nextElementSibling.textContent);
        const precioTotal = document.getElementById('total-price').textContent;

        let mensaje = "Hola, buenas tardes, me gustaría una torta con lo siguiente:\n\n";
        if (nombreTamanio) mensaje += `Tamaño: ${nombreTamanio}\n`;
        if (nombresRellenos1.length) mensaje += `Primer relleno: ${nombresRellenos1.join(', ')}\n`;
        if (nombresRellenos2.length) mensaje += `Segundo relleno: ${nombresRellenos2.join(', ')}\n`;
        if (toppings.length) mensaje += `Toppings: ${toppings.join(', ')}\n`;
        mensaje += `Total aproximado: ${precioTotal}`;

        const telefono = "5491123234612"; // Cambia aquí tu número
        const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Preselecciona individual y actualiza precios al cargar
    const individualSize = document.getElementById('size-individual');
    if (individualSize) {
        individualSize.checked = true;
        actualizarPreciosOpciones();
        calcularTotal();
    }
    // También actualiza precios al cargar
    actualizarPreciosOpciones();
});