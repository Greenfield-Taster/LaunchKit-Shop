import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import LegalModal from "../components/LegalModal/LegalModal";
import usePageMeta from "../hooks/usePageMeta";
import { SEO } from "../utils/seoData";
import "../styles/pages/_checkout.scss";

import {
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  Package,
  CheckCircle,
  HelpCircle,
  Clock,
} from "lucide-react";

const Checkout = () => {
  usePageMeta(SEO.checkout);
  const { items, totals, currency, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate("/catalog", { replace: true });
    }
  }, [items.length, orderPlaced, navigate]);

  const [contactData, setContactData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    comment: "",
  });

  const [deliveryData, setDeliveryData] = useState({
    city: "",
    address: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: "terms" });

  const [errors, setErrors] = useState({});

  const paymentOptions = [
    {
      id: "cash-on-delivery",
      name: "Оплата при отриманні",
      subtitle: "Готівка або картка при отриманні",
      icon: <Truck size={28} />,
    },
    {
      id: "card-online",
      name: "Картка онлайн",
      subtitle: "Visa / Mastercard",
      icon: <Package size={28} />,
    },
  ];

  const clearError = (fieldName) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const validate = () => {
    const newErrors = {};

    if (!contactData.fullName.trim()) newErrors.fullName = "Введіть ПІБ";
    if (!contactData.phone.trim()) newErrors.phone = "Введіть телефон";
    if (!contactData.email.trim()) {
      newErrors.email = "Введіть email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
      newErrors.email = "Невірний формат email";
    }
    if (!deliveryData.city.trim()) newErrors.city = "Введіть місто";
    if (!deliveryData.address.trim()) newErrors.address = "Введіть адресу";
    if (!paymentMethod) newErrors.paymentMethod = "Оберіть спосіб оплати";
    if (!agreeToTerms) newErrors.agreeToTerms = "Потрібно погодитись з умовами";

    return newErrors;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setSubmitError("");

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element =
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.querySelector(".checkout__section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setOrderPlaced(true);

    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      alert("Замовлення оформлено!");
      navigate("/");
    }, 800);
  };

  return (
    <div className="checkout">
      <div className="checkout__container">
        <h1 className="checkout__title">Оформлення замовлення</h1>

        <div className="checkout__layout">
          <div className="checkout__forms">
            {/* Contact info */}
            <section className="checkout__section">
              <h2 className="checkout__section-title">Контактні дані</h2>
              <p className="checkout__section-subtitle">
                Заповніть ваші контактні дані
              </p>

              <div className="checkout__form-group">
                <label htmlFor="fullName" className="checkout__label">
                  <User size={18} />
                  ПІБ
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={contactData.fullName}
                  onChange={handleContactChange}
                  placeholder="Введіть ваше ПІБ"
                  className={`checkout__input ${errors.fullName ? "error" : ""}`}
                  required
                />
                {errors.fullName && (
                  <span className="checkout__error">{errors.fullName}</span>
                )}
              </div>

              <div className="checkout__form-row">
                <div className="checkout__form-group">
                  <label htmlFor="phone" className="checkout__label">
                    <Phone size={18} />
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleContactChange}
                    placeholder="0XX XXX XX XX"
                    className={`checkout__input ${errors.phone ? "error" : ""}`}
                    required
                  />
                  {errors.phone && (
                    <span className="checkout__error">{errors.phone}</span>
                  )}
                </div>

                <div className="checkout__form-group">
                  <label htmlFor="email" className="checkout__label">
                    <Mail size={18} />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleContactChange}
                    placeholder="example@mail.com"
                    className={`checkout__input ${errors.email ? "error" : ""}`}
                    required
                  />
                  {errors.email && (
                    <span className="checkout__error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="checkout__form-group">
                <label htmlFor="comment" className="checkout__label--comment">
                  Коментар до замовлення
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={contactData.comment}
                  onChange={handleContactChange}
                  placeholder="Додайте коментар"
                  className="checkout__textarea"
                  rows="3"
                />
              </div>
            </section>

            {/* Delivery */}
            <section className="checkout__section">
              <h2 className="checkout__section-title">Доставка</h2>
              <p className="checkout__section-subtitle">
                Вкажіть адресу доставки
              </p>

              <div className="checkout__form-group">
                <label htmlFor="city" className="checkout__label">
                  <MapPin size={18} />
                  Місто
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={deliveryData.city}
                  onChange={handleDeliveryChange}
                  placeholder="Введіть місто"
                  className={`checkout__input ${errors.city ? "error" : ""}`}
                  required
                />
                {errors.city && (
                  <span className="checkout__error">{errors.city}</span>
                )}
              </div>

              <div className="checkout__form-group">
                <label htmlFor="address" className="checkout__label">
                  <Truck size={18} />
                  Адреса
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={deliveryData.address}
                  onChange={handleDeliveryChange}
                  placeholder="Вулиця, будинок, квартира"
                  className={`checkout__input ${errors.address ? "error" : ""}`}
                  required
                />
                {errors.address && (
                  <span className="checkout__error">{errors.address}</span>
                )}
              </div>

              <div className="checkout__form-group">
                <label htmlFor="notes" className="checkout__label--comment">
                  Примітки до доставки
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={deliveryData.notes}
                  onChange={handleDeliveryChange}
                  placeholder="Додаткова інформація для кур'єра"
                  className="checkout__textarea"
                  rows="2"
                />
              </div>
            </section>

            {/* Payment */}
            <section className="checkout__section">
              <h2 className="checkout__section-title">Оплата</h2>
              <p className="checkout__section-subtitle">
                Оберіть спосіб оплати
              </p>
              {errors.paymentMethod && (
                <div className="checkout__section-error">
                  {errors.paymentMethod}
                </div>
              )}

              <div className="checkout__payment-grid">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`checkout__payment-card ${
                      paymentMethod === option.id ? "active" : ""
                    }`}
                    onClick={() => {
                      setPaymentMethod(option.id);
                      clearError("paymentMethod");
                    }}
                  >
                    <div className="checkout__payment-icon">{option.icon}</div>
                    <div className="checkout__payment-info">
                      <h3 className="checkout__payment-name">{option.name}</h3>
                      <p className="checkout__payment-subtitle">
                        {option.subtitle}
                      </p>
                    </div>
                    {paymentMethod === option.id && (
                      <CheckCircle
                        size={20}
                        className="checkout__payment-check"
                      />
                    )}
                  </div>
                ))}
              </div>

              {paymentMethod === "cash-on-delivery" && (
                <div className="checkout__payment-details">
                  <div className="checkout__payment-info-box">
                    <p className="checkout__payment-info-text">
                      Ви зможете оплатити замовлення готівкою або карткою при
                      отриманні товару.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "card-online" && (
                <div className="checkout__payment-details">
                  <div className="checkout__payment-info-box">
                    <p className="checkout__payment-info-text">
                      Після оформлення замовлення ви будете перенаправлені на
                      сторінку оплати.
                    </p>
                    <p className="checkout__payment-info-note">
                      Підтримуються: Visa, Mastercard
                    </p>
                  </div>
                </div>
              )}

              <div className="checkout__checkbox">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    clearError("agreeToTerms");
                  }}
                  required
                />
                <label htmlFor="agreeTerms">
                  Погоджуюсь з{" "}
                  <button
                    type="button"
                    className="checkout__link"
                    onClick={(e) => {
                      e.preventDefault();
                      setLegalModal({ isOpen: true, type: "terms" });
                    }}
                  >
                    умовами оферти
                  </button>{" "}
                  та{" "}
                  <button
                    type="button"
                    className="checkout__link"
                    onClick={(e) => {
                      e.preventDefault();
                      setLegalModal({ isOpen: true, type: "privacy" });
                    }}
                  >
                    політикою конфіденційності
                  </button>
                </label>
              </div>
              {errors.agreeToTerms && (
                <div
                  className="checkout__section-error"
                  style={{ marginTop: "12px" }}
                >
                  {errors.agreeToTerms}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="checkout__sidebar">
            <div className="checkout__summary">
              <h2 className="checkout__summary-title">Підсумок замовлення</h2>

              <div className="checkout__items">
                {items.map((item, index) => (
                  <div key={index} className="checkout__item">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="checkout__item-image"
                      />
                    )}
                    <div className="checkout__item-info">
                      <h3 className="checkout__item-title">{item.title}</h3>
                      <p className="checkout__item-price">
                        {item.price} {currency} x {item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout__totals">
                <div className="checkout__total-row">
                  <span>Товари:</span>
                  <span>
                    {totals.subtotal} {currency}
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="checkout__total-row">
                    <span>Знижка:</span>
                    <span className="checkout__discount">
                      -{totals.discount} {currency}
                    </span>
                  </div>
                )}
                <div className="checkout__total-row checkout__total-final">
                  <span>Разом:</span>
                  <span>
                    {totals.total} {currency}
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="checkout__submit-error">{submitError}</div>
              )}

              <button
                type="submit"
                onClick={handleSubmitOrder}
                className="checkout__submit-btn"
                disabled={isSubmitting || items.length === 0}
              >
                {isSubmitting ? "Оформлення..." : "Оформити замовлення"}
              </button>

              <div className="checkout__help">
                <h3 className="checkout__help-title">
                  <HelpCircle size={20} />
                  Потрібна допомога?
                </h3>
                <p className="checkout__help-phone">+380 (50) 123-45-67</p>
                <p className="checkout__help-time">
                  <Clock size={16} />
                  Пн-Пт: 9:00-18:00, Сб: 10:00-16:00
                </p>
                <div className="checkout__help-faq">
                  <Link to="/contacts" className="checkout__help-faq-link">
                    Часті запитання
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal({ isOpen: false, type: legalModal.type })}
        type={legalModal.type}
      />
    </div>
  );
};

export default Checkout;
