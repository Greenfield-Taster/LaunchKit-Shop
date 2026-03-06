import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCart } from "../hooks/useCart";
import ProductGallery from "../components/ProductGallery/ProductGallery";
import WishlistButton from "../components/WishlistButton/WishlistButton";
import Carousel from "../components/Carousel/Carousel";
import usePageMeta from "../hooks/usePageMeta";
import { SEO } from "../utils/seoData";
import products from "../data/products.json";
import reviews from "../data/reviews.json";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import "../styles/pages/_product.scss";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const product = useMemo(
    () => products.find((p) => p.id === parseInt(id)),
    [id],
  );

  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === parseInt(id)),
    [id],
  );

  const similarProducts = useMemo(() => {
    if (!product) return [];
    const category = Array.isArray(product.category)
      ? product.category[0]
      : product.category;
    return products
      .filter((p) => p.id !== product.id)
      .filter((p) => {
        const pCat = Array.isArray(p.category) ? p.category : [p.category];
        return pCat.includes(category);
      })
      .slice(0, 8);
  }, [product]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  }, [productReviews]);

  usePageMeta({
    title: product ? `${product.name} — My Shop` : SEO.notFound.title,
    description: product
      ? `${product.name}. Ціна ${product.price} грн. Доставка по Україні.`
      : "",
  });

  const [activeTab, setActiveTab] = useState("description");
  const [isAdded, setIsAdded] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h2>Товар не знайдено</h2>
          <p>На жаль, такого товару не існує</p>
          <Link to="/catalog" className="btnProd btnProd--primary btnProd--large">
            До каталогу
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const renderStars = (rating, size = 18) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        className={`rating-star ${i < Math.round(rating) ? "rating-star--filled" : ""}`}
      />
    ));
  };

  const visibleReviews = showAllReviews
    ? productReviews
    : productReviews.slice(0, 3);

  return (
    <div className="product-page">
      <section className="product-details">
        <div className="container">
          <div className="product-details__grid">
            <ProductGallery
              images={product.images}
              alt={product.name}
              priority
            />

            <div className="product-info">
              <div className="product-info__header">
                <h1 className="product-info__title">{product.name}</h1>
                <WishlistButton product={product} />
              </div>

              {productReviews.length > 0 && (
                <div className="product-info__rating">
                  <div className="rating-stars">
                    {renderStars(averageRating)}
                  </div>
                  <span className="rating-value">{averageRating}</span>
                  <span className="rating-count">
                    ({productReviews.length} відгуків)
                  </span>
                </div>
              )}

              <div className="product-info__price">
                <span className="product-info__price-current">
                  {product.price?.toLocaleString("uk-UA")}&nbsp;&#8372;
                </span>
                {product.oldPrice && (
                  <span className="product-info__price-old">
                    {product.oldPrice?.toLocaleString("uk-UA")}&nbsp;&#8372;
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="product-info__discount">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {!product.inStock && (
                <p className="product-info__out-of-stock">Немає в наявності</p>
              )}

              <div className="product-info__actions">
                <button
                  className={`btnProd btnProd--primary btnProd--large ${isAdded ? "btnProd--added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdded}
                >
                  {!product.inStock
                    ? "Немає в наявності"
                    : isAdded
                      ? "Додано в кошик!"
                      : "Додати в кошик"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-tabs">
        <div className="container">
          <div className="tabs__header">
            <button
              className={`tabs__button ${activeTab === "description" ? "tabs__button--active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Опис
            </button>
            <button
              className={`tabs__button ${activeTab === "characteristics" ? "tabs__button--active" : ""}`}
              onClick={() => setActiveTab("characteristics")}
            >
              Характеристики
            </button>
            <button
              className={`tabs__button ${activeTab === "reviews" ? "tabs__button--active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Відгуки ({productReviews.length})
            </button>
          </div>

          <div className="tabs__content">
            {activeTab === "description" && (
              <div className="tab-content">
                <div className="product-description">
                  <div className="product-description__content">
                    <p className="product-description__text">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "characteristics" && (
              <div className="tab-content">
                {product.characteristics?.length > 0 ? (
                  <div className="characteristics-grid">
                    {product.characteristics.map((char, index) => (
                      <div key={index} className="characteristic-item">
                        <span className="characteristic-item__label">
                          {char.key}
                        </span>
                        <span className="characteristic-item__value">
                          {char.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="product-description__text">
                    Характеристики не вказані
                  </p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-content">
                <div className="reviews-section">
                  {productReviews.length > 0 ? (
                    <>
                      <div className="reviews-summary">
                        <div className="reviews-summary__rating">
                          <span className="reviews-summary__number">
                            {averageRating}
                          </span>
                          <div className="reviews-summary__stars">
                            {renderStars(averageRating, 24)}
                          </div>
                          <span className="reviews-summary__text">
                            На основі {productReviews.length} відгуків
                          </span>
                        </div>
                      </div>

                      <div className="reviews-list">
                        {visibleReviews.map((review) => (
                          <div key={review.id} className="review-card">
                            <div className="review-card__header">
                              <div className="review-card__author">
                                <span className="review-card__name">
                                  {review.author}
                                </span>
                              </div>
                              <span className="review-card__date">
                                {new Date(review.date).toLocaleDateString(
                                  "uk-UA",
                                )}
                              </span>
                            </div>
                            <div className="review-card__rating">
                              {renderStars(review.rating, 16)}
                            </div>
                            <p className="review-card__comment">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>

                      {productReviews.length > 3 && (
                        <button
                          className="show-more-reviews"
                          onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                          {showAllReviews ? (
                            <>
                              Сховати <ChevronUp size={18} />
                            </>
                          ) : (
                            <>
                              Показати ще ({productReviews.length - 3}){" "}
                              <ChevronDown size={18} />
                            </>
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state__icon">
                        <Star size={48} />
                      </div>
                      <h3 className="empty-state__title">
                        Відгуків поки немає
                      </h3>
                      <p className="empty-state__text">
                        Будьте першим, хто залишить відгук про цей товар
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {similarProducts.length > 0 && (
        <section className="similar-products">
          <Carousel
            products={similarProducts}
            title="Схожі товари"
          />
        </section>
      )}
    </div>
  );
};

export default Product;
