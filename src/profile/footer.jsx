import React from 'react';
import './footer.scss';

function Footer() {
  return (
    <div className="wrapper-footer">
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-sm">
              <ul className="list-unstyled">
                <li>
                  <b>COMPANÍA</b>
                </li>
                <li>
                  <a href="./about">Acerca de Atenea</a>
                </li>
                <li>
                  <a href="https://atenea.com.ec">Equipo</a>
                </li>
                <li>
                  <a href="./contact">Contacto</a>
                </li>
              </ul>
            </div>

            <div className="col-sm uamx_footer-middle">
              <ul className="list-unstyled">
                <li>
                  <b>PRODUCTOS</b>
                </li>
                <li>
                  <a href="./">Ecosistema Digital</a>
                </li>
                <li>
                  <a href="./">Sector Público</a>
                </li>
              </ul>
            </div>

            <div className="col-sm uamx_footer-middle">
              <ul className="list-unstyled">
                <li>
                  <b>LEGAL</b>
                </li>
                <li>
                  <a href="./privacy">Política de privacidad</a>
                </li>
                <li>
                  <a href="./tos">Términos del servicio</a>
                </li>
              </ul>
            </div>

            <div className="col-sm last-col">
              <div className="footer-about-openedx" />
              <p>Aprende en nuestras redes:</p>
              <div className="social-wrapper">
                <div className="social">
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="fa fa-facebook" aria-hidden="true" />
                  </a>
                  <a
                    href="https://twitter.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="fa fa-twitter" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="fa fa-youtube" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="fa fa-instagram" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="copyright small">
          © 2023 <a href="https://app.atenea.digital/">Atenea Lifelong Learning</a>
        </p>
      </footer>
    </div>
  );
}

export default Footer;
