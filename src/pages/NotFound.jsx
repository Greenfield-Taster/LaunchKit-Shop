import React from "react";
import { Link, useNavigate } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import { SEO } from "../utils/seoData";
import "../styles/pages/_notfound.scss";

const NotFound = () => {
  usePageMeta(SEO.notFound);
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-number">
          <span className="notfound-number__digit">4</span>
          <span className="notfound-number__digit notfound-number__digit--zero">
            0
          </span>
          <span className="notfound-number__digit">4</span>
        </div>

        <div className="notfound-content">
          <h1 className="notfound-title">Сторінку не знайдено</h1>
          <p className="notfound-subtitle">
            На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
            <br />
            Можливо, ви помилилися в адресі або посилання застаріло.
          </p>
        </div>

        <div className="notfound-actions">
          <button
            className="notfound-btn notfound-btn--primary"
            onClick={() => navigate("/")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>На головну</span>
          </button>

          <button
            className="notfound-btn notfound-btn--outline"
            onClick={() => navigate(-1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Назад</span>
          </button>
        </div>

        <div className="notfound-links">
          <h3 className="notfound-links__title">Популярні сторінки:</h3>

          <div className="notfound-links__grid">
            <Link to="/catalog" className="notfound-link">
              <div className="notfound-link__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="notfound-link__content">
                <h4>Каталог</h4>
                <p>Перегляньте наші товари</p>
              </div>
            </Link>

            <Link to="/contacts" className="notfound-link">
              <div className="notfound-link__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="notfound-link__content">
                <h4>Контакти</h4>
                <p>Зв'яжіться з нами</p>
              </div>
            </Link>

            <Link to="/" className="notfound-link">
              <div className="notfound-link__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="notfound-link__content">
                <h4>Головна</h4>
                <p>Повернутися на головну</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
