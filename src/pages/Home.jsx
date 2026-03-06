import { Link } from "react-router-dom";
import { ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";
import Carousel from "../components/Carousel/Carousel";
import usePageMeta from "../hooks/usePageMeta";
import { SEO } from "../utils/seoData";
import products from "../data/products.json";
import "../styles/pages/_home.scss";

const Home = () => {
  usePageMeta(SEO.home);

  const popularProducts = products.filter((p) =>
    Array.isArray(p.category)
      ? p.category.includes("popular")
      : p.category === "popular"
  );

  const benefits = [
    {
      id: 1,
      title: "Швидка доставка",
      description: "1-3 дні по всій Україні",
      icon: Truck,
    },
    {
      id: 2,
      title: "Гарантія якості",
      description: "Тільки перевірені товари",
      icon: ShieldCheck,
    },
    {
      id: 3,
      title: "Підтримка 24/7",
      description: "Завжди на зв'язку з вами",
      icon: Headphones,
    },
    {
      id: 4,
      title: "Повернення 14 днів",
      description: "Легке повернення без зайвих питань",
      icon: RefreshCw,
    },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__left">
              <div className="hero__text">
                <h1 className="hero__title">
                  Ваш надійний інтернет-магазин
                </h1>
                <p className="hero__subtitle">
                  Якісні товари за найкращими цінами. Швидка доставка по всій
                  Україні та гарантія на кожну покупку.
                </p>
              </div>
              <div className="hero__buttons">
                <Link
                  to="/catalog"
                  className="hero__button hero__button--primary"
                >
                  До каталогу
                </Link>
                <Link
                  to="/contacts"
                  className="hero__button hero__button--secondary"
                >
                  Зв'язатися з нами
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {popularProducts.length > 0 && (
        <section className="popular">
          <Carousel
            products={popularProducts}
            title="Популярні товари"
          />
        </section>
      )}

      <section className="benefits">
        <div className="container">
          <h2 className="section-title">Переваги</h2>
          <div className="benefits__grid">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <div key={benefit.id} className="benefit-card">
                  <div className="benefit-card__icon">
                    <IconComponent size={32} strokeWidth={2} />
                  </div>
                  <div className="benefit-card__content">
                    <h3 className="benefit-card__title">{benefit.title}</h3>
                    <p className="benefit-card__description">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
