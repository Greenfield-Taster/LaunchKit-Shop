import { Heart, Loader2 } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";
import "./WishlistButton.scss";

const WishlistButton = ({ product, variant = "default", className = "" }) => {
  const { isInWishlist, toggleWishlist, toggleStates } = useWishlist();

  const isActive = isInWishlist(product.id);
  const toggleState = toggleStates[product.id] || 'idle';
  const isToggling = toggleState === 'toggling';

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;

    await toggleWishlist(product);
  };

  const ariaLabel = isActive
    ? `Прибрати ${product.name} з обраних`
    : `Додати ${product.name} до обраних`;

  return (
    <button
      className={`wishlist-button wishlist-button--${variant} ${
        isActive ? "wishlist-button--active" : ""
      } ${isToggling ? "wishlist-button--toggling" : ""} ${className}`}
      onClick={handleClick}
      disabled={isToggling}
      aria-pressed={isActive}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {isToggling ? (
        <Loader2 className="wishlist-button__icon wishlist-button__icon--spinner" size={20} />
      ) : (
        <Heart
          className="wishlist-button__icon"
          size={20}
          fill={isActive ? "currentColor" : "none"}
        />
      )}
      {variant === "with-text" && (
        <span className="wishlist-button__text">
          {isActive ? "В обраних" : "До обраних"}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
