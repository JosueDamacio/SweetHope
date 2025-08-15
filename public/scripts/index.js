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
        640: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    }
};

// Inicializa Swiper para cada carrusel con paginación única
const tortasSwiper = new Swiper('.tortas-swiper', {
    ...swiperOptions,
    pagination: {
        el: '.tortas-swiper .swiper-pagination',
        clickable: true,
    }
});
const budinesSwiper = new Swiper('.budines-swiper', {
    ...swiperOptions,
    pagination: {
        el: '.budines-swiper .swiper-pagination',
        clickable: true,
    }
});
const cheesecakeSwiper = new Swiper('.cheesecake-swiper', {
    ...swiperOptions,
    pagination: {
        el: '.cheesecake-swiper .swiper-pagination',
        clickable: true,
    }
});

// Despliegue suave de descripción al clickear imagen o título y detener autoplay
document.querySelectorAll('.product-card').forEach(card => {
    const productImage = card.querySelector('.product-image');
    const productTitle = card.querySelector('.product-title');
    const productDescription = card.querySelector('.product-description');

    // Encuentra el swiper más cercano a la tarjeta
    const swiperContainer = card.closest('.swiper');
    let swiperInstance = null;
    if (swiperContainer) {
        if (swiperContainer.classList.contains('tortas-swiper')) swiperInstance = tortasSwiper;
        if (swiperContainer.classList.contains('budines-swiper')) swiperInstance = budinesSwiper;
        if (swiperContainer.classList.contains('cheesecake-swiper')) swiperInstance = cheesecakeSwiper;
    }

    [productImage, productTitle].forEach(element => {
        element.addEventListener('click', () => {
            //cierra descripciones abiertas
            document.querySelectorAll('.product-description').forEach(desc => {
                if (desc !== productDescription && desc.classList.contains('active')) {
                    desc.classList.remove('active');
                }
            });
            //alterna descripcion actual
            productDescription.classList.toggle('active');
            //detiene el carrousel
            if (swiperInstance && swiperInstance.autoplay) {
                swiperInstance.autoplay.stop();
            }
        });
    });
});

// Botón WhatsApp
document.querySelectorAll('.request-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que se despliegue la descripción
        const productName = button.getAttribute('data-product');
        const message = `Hola me gustaría solicitarte la torta ${productName}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});

// Menú móvil hamburguesa
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navItems = document.querySelector('.nav-items');
if (hamburgerMenu && navItems) {
    hamburgerMenu.addEventListener('click', () => {
        navItems.classList.toggle('active');
    });
}