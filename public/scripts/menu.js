// Initialize Swiper for each carousel
        const swiperOptions = {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
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

        const tortasSwiper = new Swiper('.tortas-swiper', swiperOptions);
        const budinesSwiper = new Swiper('.budines-swiper', swiperOptions);
        const cheesecakeSwiper = new Swiper('.cheesecake-swiper', swiperOptions);

        // Handle product card clicks to expand/collapse descriptions
        document.querySelectorAll('.product-card').forEach(card => {
            const productImage = card.querySelector('.product-image');
            const productTitle = card.querySelector('.product-title');
            const productDescription = card.querySelector('.product-description');

            [productImage, productTitle].forEach(element => {
                element.addEventListener('click', () => {
                    // Close all other open descriptions
                    document.querySelectorAll('.product-description').forEach(desc => {
                        if (desc !== productDescription && desc.classList.contains('active')) {
                            desc.classList.remove('active');
                        }
                    });
                    
                    // Toggle current description
                    productDescription.classList.toggle('active');
                });
            });
        });

        // Handle WhatsApp request button clicks
        document.querySelectorAll('.request-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling to card click handler
                const productName = button.getAttribute('data-product');
                const message = `Hola me gustaría solicitarte la torta ${productName}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            });
        });

        // Mobile menu toggle
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navItems = document.querySelector('.nav-items');

        hamburgerMenu.addEventListener('click', () => {
            navItems.classList.toggle('active');
        });