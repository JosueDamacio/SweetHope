// Web Component reutilizable para el footer del sitio
class SiteFooter extends HTMLElement {
    connectedCallback() {
        const base = this.getAttribute('data-base') || (window.location.pathname.includes('/docs/') ? '../' : '');
        this.innerHTML = `
        <footer class="footer">
            <div class="container">
                <div class="footer-text">
                    <p>Propiedad de Josue Damacio, todos los derechos reservados a Sweet Hope 2025. ®</p>
                </div>
                <div class="social-icons">
                    <div class="social-icon"><a href="https://www.facebook.com/sweethopeDG" aria-label="Facebook"><i class="fab fa-facebook"></i></a></div>
                    <div class="social-icon"><a href="https://wa.me/5491123234612" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a></div>
                    <div class="social-icon"><a href="https://www.instagram.com/sweethopeok/" aria-label="Instagram"><i class="fab fa-instagram"></i></a></div>
                </div>
            </div>
        </footer>`;
    }
}
customElements.define('site-footer', SiteFooter);