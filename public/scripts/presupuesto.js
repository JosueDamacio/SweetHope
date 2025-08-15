// Cargará los precios dinámicamente desde public/data/precios.json
let PRECIOS_PRODUCTOS = { tamanios: {}, rellenos: {}, toppings: {} /*, decoraciones: {} */ };

async function cargarPrecios() {
    try {
        const res = await fetch('../public/data/precios.json');
        if (!res.ok) throw new Error('No se pudo cargar precios.json');
        const data = await res.json();
        PRECIOS_PRODUCTOS = data;
    } catch (e) {
        console.error('Error cargando precios:', e);
        Swal.fire({
            icon: 'error',
            title: 'Error cargando precios',
            text: 'No se pudieron cargar los precios. Intenta recargar la página.',
            confirmButtonColor: '#FFA500'
        });
    }
}

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

document.addEventListener('DOMContentLoaded', async function () {
    await cargarPrecios();
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

    // Botón WhatsApp (ahora muestra un resumen antes de enviar)
    const contactButton = document.getElementById('contact-button');
    contactButton.addEventListener('click', async function () {
        const tamanioSeleccionado = document.querySelector('.pastel-tamanio:checked');
        const rellenos1 = Array.from(document.querySelectorAll('.pastel-relleno1:checked'));
        const rellenos2 = Array.from(document.querySelectorAll('.pastel-relleno2:checked'));

        // Validaciones previas
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

        // Valida que haya al menos una decoración
        const toppingsSeleccionados = Array.from(document.querySelectorAll('.pastel-topping:checked'));
        if (toppingsSeleccionados.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona una decoración',
                text: 'Debes elegir al menos una decoración.',
                confirmButtonColor: '#FFA500'
            });
            return;
        }

        const nombreTamanio = tamanioSeleccionado ? tamanioSeleccionado.nextElementSibling.textContent : '';
        const nombresRellenos1 = rellenos1.map(f => f.nextElementSibling.textContent);
        const nombresRellenos2 = rellenos2.map(f => f.nextElementSibling.textContent);
        const toppings = toppingsSeleccionados.map(t => t.nextElementSibling.textContent);
        const precioTotal = document.getElementById('total-price').textContent;

        // Construcción del mensaje (WhatsApp) y HTML para el resumen
        let mensaje = "Hola, buenas tardes, me gustaría una torta con lo siguiente:\n\n";
        if (nombreTamanio) mensaje += `*Tamaño*: ${nombreTamanio}\n\n`;
        if (nombresRellenos1.length) mensaje += `*Primer relleno*: ${nombresRellenos1.join(', ')}\n\n`;
        if (nombresRellenos2.length) mensaje += `*Segundo relleno*: ${nombresRellenos2.join(', ')}\n\n`;
        if (toppings.length) mensaje += `*Decoraciones*: ${toppings.join(', ')}\n\n`;
        mensaje += `*Total aproximado*: ${precioTotal}`;

        const resumenHTML = `
            <div style="text-align:left; font-size:14px; line-height:1.4;"> 
                <p><strong>Tamaño:</strong> ${nombreTamanio}</p>
                ${toppings.length ? `<p><strong>Decoraciones:</strong> ${toppings.join(', ')}</p>` : ''}
                ${nombresRellenos1.length ? `<p><strong>Primer relleno:</strong> ${nombresRellenos1.join(', ')}</p>` : ''}
                ${nombresRellenos2.length ? `<p><strong>Segundo relleno:</strong> ${nombresRellenos2.join(', ')}</p>` : ''}
                <p><strong>Total aprox:</strong> ${precioTotal}</p>
                <p style="margin-top:8px; font-size:12px; color:#666;">Verifica que todo esté correcto antes de enviar tu pedido.</p>
            </div>`;

        // Cambia texto del botón a 'Aceptar' mientras se muestra el resumen
        const textoOriginalBtn = contactButton.textContent;
        contactButton.textContent = 'Aceptar';

        const { isConfirmed, isDenied } = await Swal.fire({
            title: 'Resumen del pedido',
            html: resumenHTML,
            icon: 'info',
            showDenyButton: true,
            denyButtonText: 'Editar',
            confirmButtonText: 'Enviar',
            confirmButtonColor: '#25D366',
            denyButtonColor: '#e78f8f',
            focusConfirm: false,
            allowOutsideClick: false
        });

        if (isConfirmed) {
            // Abre WhatsApp sin número específico para que el usuario elija el contacto
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
            window.open(whatsappUrl, '_blank');
            contactButton.textContent = textoOriginalBtn; // vuelve al estado original
        } else if (isDenied) {
            // Usuario quiere editar: simplemente restaurar el texto del botón
            contactButton.textContent = textoOriginalBtn;
        } else {
            // Caso cierre sin acción
            contactButton.textContent = textoOriginalBtn;
        }
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