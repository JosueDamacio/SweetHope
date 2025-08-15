// Opciones Swiper unificadas con autoplay y loop
const swiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: true
    },
    breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
    }
};

// Almacena instancias de carruseles para referencia (carrousel_1, carrousel_2, ...)
const carrouselInstances = {};

// Crea HTML de una tarjeta de producto
function createProductSlide(item) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
        <div class="product-card">
            <div class="product-image">
                <img src="${item.image}" alt="${item.alt || item.title}">
            </div>
            <div class="product-title">${item.title}</div>
            <div class="product-description">
                <p>${item.description || ''}</p>
                <button class="request-button" data-product="${item.title}">Solicitar</button>
            </div>
        </div>`;
    return slide;
}

// Genera un carrusel completo
function createCarrousel(index, config) {
    const wrapperId = `carrousel_wrapper_${index}`;
    const section = document.createElement('section');
    section.className = 'carrousel-section';
    section.innerHTML = `
        <h2 class="section-title">${config.title}</h2>
        <div class="swiper ${config.cssClass}" id="${wrapperId}">
            <div class="swiper-wrapper"></div>
            <div class="swiper-pagination"></div>
        </div>`;
    const swiperRoot = section.querySelector('.swiper-wrapper');
    config.items.forEach(item => swiperRoot.appendChild(createProductSlide(item)));
    return section;
}

// Adjunta listeners para desplegar descripción y detener autoplay
function attachCardInteractions(root) {
    root.querySelectorAll('.product-card').forEach(card => {
        const productImage = card.querySelector('.product-image');
        const productTitle = card.querySelector('.product-title');
        const productDescription = card.querySelector('.product-description');
        const swiperContainer = card.closest('.swiper');
        let swiperInstance = null;
        if (swiperContainer) {
            // Busca la instancia por dataset
            const instanceKey = swiperContainer.getAttribute('data-instance-key');
            if (instanceKey && carrouselInstances[instanceKey]) {
                swiperInstance = carrouselInstances[instanceKey];
            }
        }
        [productImage, productTitle].forEach(element => {
            element.addEventListener('click', () => {
                // cierra descripciones abiertas
                document.querySelectorAll('.product-description').forEach(desc => {
                    if (desc !== productDescription && desc.classList.contains('active')) {
                        desc.classList.remove('active');
                    }
                });
                // alterna descripcion actual
                productDescription.classList.toggle('active');
                // detiene el carrousel
                if (swiperInstance && swiperInstance.autoplay) {
                    swiperInstance.autoplay.stop();
                }
            });
        });
    });
}

// Adjunta listeners a botones de WhatsApp
function attachRequestButtons(root) {
    root.querySelectorAll('.request-button').forEach(button => {
        button.addEventListener('click', e => {
            e.stopPropagation();
            const productName = button.getAttribute('data-product');
            const message = `Hola me gustaría solicitarte la torta ${productName}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
}

// Inicializa Swiper para cada carrusel
function initCarrouselSwipers(container) {
    container.querySelectorAll('.swiper').forEach((swiperEl, idx) => {
        const instanceName = `carrousel_${idx + 1}`; // carrousel_1, carrousel_2...
        swiperEl.setAttribute('data-instance-key', instanceName);
        carrouselInstances[instanceName] = new Swiper(swiperEl, {
            ...swiperOptions,
            pagination: {
                el: swiperEl.querySelector('.swiper-pagination'),
                clickable: true
            }
        });
    });
}

// Carga del archivo JSON y construcción dinámica
async function loadCarrousels() {
    try {
        const res = await fetch('public/data/carrousels.json');
        if (!res.ok) throw new Error('No se pudo cargar carrousels.json');
        const data = await res.json();
        const root = document.getElementById('carrousels-root');
        if (!root) return;
        data.carrousels.forEach((conf, i) => {
            const section = createCarrousel(i + 1, conf);
            root.appendChild(section);
        });
        initCarrouselSwipers(root);
        attachCardInteractions(root);
        attachRequestButtons(root);
    } catch (err) {
        console.error('Error cargando carruseles:', err);
    }
}

// Menú móvil hamburguesa (se mantiene)
function initMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navItems = document.querySelector('.nav-items');
    if (hamburgerMenu && navItems) {
        hamburgerMenu.addEventListener('click', () => {
            navItems.classList.toggle('active');
        });
    }
}



// Init general
document.addEventListener('DOMContentLoaded', () => {
    loadCarrousels();
    initMobileMenu();
});