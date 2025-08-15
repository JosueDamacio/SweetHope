// Web Component reutilizable para el header del sitio
class SiteHeader extends HTMLElement {
    connectedCallback() {
        // Detecta si estamos dentro de /docs/ para ajustar rutas relativas
        const base = this.getAttribute('data-base') || (window.location.pathname.includes('/docs/') ? '../' : '');
        // Marca si se usan URLs absolutas (puedes cambiar esto si migras)
        const absoluteDocs = 'https://josuedamacio.github.io/SweetHope/docs/tortas.html';
        const presupuestoUrl = 'https://josuedamacio.github.io/SweetHope/docs/presupuesto.html';

        this.innerHTML = `
        <header class="header">
            <div class="container header-bar">
            <div class="brand">
                <a class="brand-link" href="${base}index.html" aria-label="Inicio" style="text-decoration: none;">
                <img class="brand-logo" src="${base}img/sh_logo.jpg" alt="Sweet Hope Logo">
                <div class="brand-text">
                    <h1 class="brand-title">Sweet Hope</h1>
                    <h2 class="brand-subtitle">Dulces momentos para compartir</h2>
                </div>
                </a>
            </div>
            <nav class="navbar" aria-label="Navegación principal">
                <button class="hamburger-menu" aria-label="Abrir menú"><i class="fas fa-bars"></i></button>
                <ul class="nav-items">
                <li class="nav-item"><a class="presupuesto" href="${presupuestoUrl}">Calcular Presupuesto</a></li>
                <li class="nav-item"><a href="${absoluteDocs}">Tortas</a></li>
                <li class="nav-item"><a href="${absoluteDocs}">Decoración</a></li>
            <!--<li class="nav-item"><a href="${absoluteDocs}">Galletas y Muffins</a></li> esto va dentro de más postres-->
                <li class="nav-item"><a href="${absoluteDocs}">Budines</a></li>
                <li class="nav-item"><a href="${absoluteDocs}">Más Postres</a></li>
                </ul>
            </nav>
            </div>
        </header>
    `;

        // Lógica del menú hamburguesa (aislada aquí para no depender de scripts externos)
        const hamburgerMenu = this.querySelector('.hamburger-menu');
        const navItems = this.querySelector('.nav-items');
        if (hamburgerMenu && navItems) {
            hamburgerMenu.addEventListener('click', () => {
                navItems.classList.toggle('active');
            });
        }
    }
}

customElements.define('site-header', SiteHeader);
