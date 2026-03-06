import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Wallet,
  Smartphone,
  CreditCard,
  FileText,
} from "lucide-react";

import { STORE_INFO } from "../utils/storeInfo";
import "../styles/layout/_footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__brand">
            <div className="footer__brand-logo">MY SHOP</div>

            <div className="footer__brand-social">
              <a
                href={STORE_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link"
              >
                <Facebook size={20} />
              </a>
              <a
                href={STORE_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
              >
                <Instagram size={20} />
              </a>
              <a
                href={STORE_INFO.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="social-link"
              >
                <Send size={20} />
              </a>
            </div>
          </div>

          <div className="footer__section">
            <h3 className="footer__section-title">Навігація</h3>
            <ul className="footer__section-links">
              <li>
                <Link to="/catalog">Каталог товарів</Link>
              </li>
              <li>
                <Link to="/catalog?sort=discount">Акції</Link>
              </li>
              <li>
                <Link to="/contacts#faq">Доставка та оплата</Link>
              </li>
              <li>
                <Link to="/contacts#faq">Обмін і повернення</Link>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h3 className="footer__section-title">Контакти</h3>
            <div className="footer__contact-list">
              {STORE_INFO.phones.map((phone, i) => (
                <a key={phone} href={`tel:${phone}`} className="contact-item">
                  <Phone size={18} />
                  <span>{STORE_INFO.phonesFormatted[i]}</span>
                </a>
              ))}
              <a href={`mailto:${STORE_INFO.email}`} className="contact-item">
                <Mail size={18} />
                <span>{STORE_INFO.email}</span>
              </a>
              <div className="contact-item">
                <MapPin size={18} />
                <span>{STORE_INFO.address}</span>
              </div>
              <div className="contact-item">
                <Clock size={18} />
                <span>{STORE_INFO.schedule}</span>
              </div>
            </div>
          </div>

          <div className="footer__section">
            <h3 className="footer__section-title">Способи оплати</h3>
            <div className="footer__payment-methods">
              <div className="payment-method">
                <Wallet size={20} />
                <span>Оплата при отриманні</span>
              </div>
              <div className="payment-method">
                <Smartphone size={20} />
                <span>Google Pay / Apple Pay</span>
              </div>
              <div className="payment-method">
                <CreditCard size={20} />
                <span>Картка онлайн</span>
              </div>
              <div className="payment-method">
                <FileText size={20} />
                <span>Оплата по рахунку</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear} MY SHOP. Всі права захищені.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
