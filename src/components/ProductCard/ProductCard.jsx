import { Link } from "react-router-dom";
import { useState, useCallback } from "react";
import { useCart } from "../../hooks/useCart";
import WishlistButton from "../WishlistButton/WishlistButton";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const { id, name, price, oldPrice, image, inStock = true } = product;
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);

  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;
  const hasDiscount = discountPercent > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    addItem({
      id,
      title: name,
      price,
      image,
      qty: 1,
    });

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="product-card">
      <div
        className={`product-card__image-wrapper ${
          !imageLoaded ? "product-card__image-wrapper--loading" : ""
        }`}
      >
        <Link to={`/product/${id}`} className="product-card__image-link">
          <img
            src={image}
            alt={name}
            className={`product-card__image ${
              imageLoaded ? "product-card__image--loaded" : ""
            }`}
            loading="lazy"
            width={290}
            height={290}
            onLoad={handleImageLoad}
            onError={() => setImageLoaded(true)}
          />
        </Link>

        {hasDiscount && (
          <div className="product-card__discount">-{discountPercent}%</div>
        )}

        <div className="product-card__wishlist">
          <WishlistButton product={product} variant="small" />
        </div>
      </div>

      <div className="product-card__content">
        <Link to={`/product/${id}`} className="product-card__title-link">
          <h3 className="product-card__title">{name}</h3>
        </Link>

        <div className="product-card__price-wrapper">
          <span className="product-card__price">
            {price?.toLocaleString("uk-UA")}&nbsp;&#8372;
          </span>
          {hasDiscount && (
            <span className="product-card__old-price">
              {oldPrice?.toLocaleString("uk-UA")}&nbsp;&#8372;
            </span>
          )}
        </div>

        <div className="product-card__actions">
          <Link
            to={`/product/${id}`}
            className="product-card__button product-card__button--primary"
          >
            Детальніше
          </Link>
          <button
            className={`product-card__button product-card__button--secondary ${
              isAdded ? "product-card__button--added" : ""
            }`}
            onClick={handleAddToCart}
            aria-label={`Додати ${name} в кошик`}
            disabled={isAdded || !inStock}
          >
            {!inStock ? "Немає" : isAdded ? "Додано!" : "Купити"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
