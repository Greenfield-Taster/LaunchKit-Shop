import React, { useState, useEffect } from "react";
import FAQ from "../components/FAQ/FAQ";
import { faqData } from "../data/faqData";
import { STORE_INFO } from "../utils/storeInfo";
import usePageMeta from "../hooks/usePageMeta";
import { SEO } from "../utils/seoData";
import "../styles/pages/_contacts.scss";

const Contacts = () => {
  usePageMeta(SEO.contacts);

  useEffect(() => {
    if (window.location.hash === "#faq") {
      setTimeout(() => {
        const faqSection = document.getElementById("faq");
        if (faqSection) {
          const elementPosition = faqSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 140;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Будь ласка, введіть ваше ім'я";
        } else if (value.trim().length < 2) {
          error = "Ім'я має містити мінімум 2 символи";
        } else if (value.trim().length > 50) {
          error = "Ім'я має містити максимум 50 символів";
        } else if (!/^[а-яА-ЯіІїЇєЄґҐa-zA-Z\s'-]+$/.test(value)) {
          error = "Ім'я може містити тільки літери";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Будь ласка, введіть email";
        } else if (
          !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
        ) {
          error = "Некоректний формат email";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "Будь ласка, введіть повідомлення";
        } else if (value.trim().length < 10) {
          error = "Повідомлення має містити мінімум 10 символів";
        } else if (value.trim().length > 500) {
          error = "Повідомлення має містити максимум 500 символів";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      message: true,
    });

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        setFormData({
          name: "",
          email: "",
          message: "",
        });

        setTouched({
          name: false,
          email: false,
          message: false,
        });

        alert("Дякуємо! Ваше повідомлення надіслано.");

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 600);
    }
  };

  return (
    <div className="contacts">
      <div className="container">
        <h1 className="contacts__title">Контакти</h1>
        <p className="contacts__subtitle">
          Ми завжди раді відповісти на ваші запитання та допомогти вам
        </p>

        <div className="contacts__content">
          <div className="contacts__form-section">
            <div className="contacts__card">
              <h2 className="contacts__card-title">Зв'язатися з нами</h2>
              <p className="contacts__card-description">
                Заповніть форму нижче, і ми зв'яжемось з вами найближчим часом.
                Всі поля обов'язкові для заповнення.
              </p>

              {submitSuccess && (
                <div className="contacts__success-message">
                  Дякуємо! Ваше повідомлення успішно надіслано. Ми зв'яжемось з
                  вами найближчим часом.
                </div>
              )}

              <form
                className="contacts__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="contacts__form-group">
                  <label className="contacts__label">
                    Ваше ім'я <span className="contacts__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Введіть ваше ім'я"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`contacts__input ${
                      touched.name && errors.name
                        ? "contacts__input--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.name && errors.name && (
                    <span className="contacts__error">{errors.name}</span>
                  )}
                </div>

                <div className="contacts__form-group">
                  <label className="contacts__label">
                    Електронна пошта
                    <span className="contacts__required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`contacts__input ${
                      touched.email && errors.email
                        ? "contacts__input--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.email && errors.email && (
                    <span className="contacts__error">{errors.email}</span>
                  )}
                </div>

                <div className="contacts__form-group">
                  <label className="contacts__label">
                    Повідомлення <span className="contacts__required">*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Напишіть ваше повідомлення..."
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`contacts__textarea ${
                      touched.message && errors.message
                        ? "contacts__textarea--error"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.message && errors.message && (
                    <span className="contacts__error">{errors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className={`contacts__submit-btn${submitSuccess ? " contacts__submit-btn--sent" : ""}`}
                  disabled={isSubmitting || submitSuccess}
                >
                  {isSubmitting
                    ? "Надсилання..."
                    : submitSuccess
                      ? "Надіслано"
                      : "Надіслати"}
                </button>

                <p className="contacts__form-note">
                  Або напишіть нам у Telegram/Viber
                </p>
              </form>
            </div>
          </div>

          <div className="contacts__info-section">
            <div className="contacts__card contacts__info-card">
              <h2 className="contacts__card-title">Контактні дані</h2>
              <div className="contacts__info-list">
                <div className="contacts__info-item">
                  <span className="contacts__info-label">Телефон:</span>
                  <div className="contacts__info-values">
                    {STORE_INFO.phones.map((phone, i) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="contacts__info-link"
                      >
                        {STORE_INFO.phonesFormatted[i]}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Email:</span>
                  <a
                    href={`mailto:${STORE_INFO.email}`}
                    className="contacts__info-link"
                  >
                    {STORE_INFO.email}
                  </a>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Адреса:</span>
                  <span className="contacts__info-text">
                    {STORE_INFO.address}
                  </span>
                </div>

                <div className="contacts__info-item">
                  <span className="contacts__info-label">Графік:</span>
                  <span className="contacts__info-text">
                    {STORE_INFO.schedule}
                  </span>
                </div>

                <div className="contacts__info-item contacts__info-item--socials">
                  <span className="contacts__info-label">Соцмережі:</span>
                  <div className="contacts__social">
                    <a
                      href={STORE_INFO.social.telegram}
                      className="contacts__social-link"
                      aria-label="Telegram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="contacts__social-icon"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                      >
                        <path d="M9.04 15.07 8.9 18a.9.9 0 0 0 .71-.34l1.71-1.64 3.55 2.6c.65.36 1.12.17 1.28-.6l2.32-10.9c.21-.96-.35-1.33-1.02-1.1L3.9 9.2c-.94.34-.93.83-.17 1.05l4.2 1.31 9.76-6.15-8.65 7.66z" />
                      </svg>
                      <span className="contacts__social-text">Telegram</span>
                    </a>
                    <a
                      href={STORE_INFO.social.instagram}
                      className="contacts__social-link"
                      aria-label="Instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="contacts__social-icon"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                      >
                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm6-1.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
                      </svg>
                      <span className="contacts__social-text">Instagram</span>
                    </a>
                    <a
                      href={STORE_INFO.social.facebook}
                      className="contacts__social-link"
                      aria-label="Facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="contacts__social-icon"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        aria-hidden="true"
                      >
                        <path d="M13 22v-8h3l1-4h-4V7a2 2 0 0 1 2-2h2V1h-3a5 5 0 0 0-5 5v4H6v4h3v8h4z" />
                      </svg>
                      <span className="contacts__social-text">Facebook</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="faq" className="contacts__faq-section">
          <h2 className="contacts__section-title">Часті питання</h2>
          <FAQ items={faqData} />
        </section>
      </div>
    </div>
  );
};

export default Contacts;
