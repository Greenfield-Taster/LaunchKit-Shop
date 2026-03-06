import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import useScrollLock from "../../hooks/useScrollLock";
import useFocusTrap from "../../hooks/useFocusTrap";
import CartItemCompact from "./CartItemCompact";
import "./CartSidePanel.scss";

const CartSidePanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    totals,
    currency,
    promoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useScrollLock(isOpen);
  useFocusTrap(panelRef, { isActive: isOpen, onClose, autoFocusRef: closeButtonRef });

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [promoLoading, setPromoLoading] = useState(false);

  const handlePromoSubmit = async (e) => {
    e.preventDefault();

    if (!promoInput.trim()) {
      setPromoMessage({ text: "Введіть промокод", type: "error" });
      return;
    }

    setPromoLoading(true);
    const result = await applyPromoCode(promoInput);
    setPromoLoading(false);

    setPromoMessage({
      text: result.message,
      type: result.success ? "success" : "error",
    });

    if (result.success) {
      setPromoInput("");
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoMessage({ text: "", type: "" });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="cart-side-panel-overlay" onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        className={`cart-side-panel ${isOpen ? "cart-side-panel--open" : ""}`}
        role="dialog"
        aria-labelledby="cart-panel-title"
        aria-modal="true"
      >
        <div className="cart-side-panel__header">
          <h2 id="cart-panel-title" className="cart-side-panel__title">
            Кошик
            {totals.itemsCount > 0 && (
              <span className="cart-side-panel__count">
                ({totals.itemsCount})
              </span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            className="cart-side-panel__close"
            onClick={onClose}
            aria-label="Закрити кошик"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="cart-side-panel__content">
          {items.length === 0 ? (
            <div className="cart-side-panel__empty">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 16L12 52H52L56 16H8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 24V12C24 9.79086 25.7909 8 28 8H36C38.2091 8 40 9.79086 40 12V24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="cart-side-panel__empty-text">Ваш кошик порожній</p>
              <p className="cart-side-panel__empty-subtext">
                Додайте товари з каталогу
              </p>
            </div>
          ) : (
            <>
              <div className="cart-side-panel__items">
                {items.map((item) => (
                  <CartItemCompact
                    key={item.id}
                    item={item}
                    onUpdateQty={updateQty}
                    onRemove={removeItem}
                    currency={currency}
                  />
                ))}
              </div>

              <div className="cart-side-panel__promo">
                {!promoCode ? (
                  <form
                    onSubmit={handlePromoSubmit}
                    className="cart-side-panel__promo-form"
                  >
                    <div className="cart-side-panel__promo-input-wrapper">
                      <input
                        type="text"
                        className={`cart-side-panel__promo-input ${
                          promoMessage.type === "error"
                            ? "cart-side-panel__promo-input--error"
                            : ""
                        } ${
                          promoMessage.type === "success"
                            ? "cart-side-panel__promo-input--success"
                            : ""
                        }`}
                        placeholder="ПРОМОКОД"
                        value={promoInput}
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "");
                          if (value.length <= 6) {
                            setPromoInput(value);

                            if (promoMessage.text) {
                              setPromoMessage({ text: "", type: "" });
                            }
                          }
                        }}
                        maxLength={6}
                      />
                      {promoInput && (
                        <button
                          type="button"
                          className="cart-side-panel__promo-clear"
                          onClick={() => {
                            setPromoInput("");
                            setPromoMessage({ text: "", type: "" });
                          }}
                          aria-label="Очистити промокод"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 4L4 12M4 4L12 12"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="cart-side-panel__promo-button"
                      disabled={promoInput.length !== 6 || promoLoading}
                    >
                      {promoLoading ? "Перевірка..." : "Застосувати"}
                    </button>
                  </form>
                ) : (
                  <div className="cart-side-panel__promo-applied">
                    <div className="cart-side-panel__promo-info">
                      <span className="cart-side-panel__promo-code">
                        {promoCode.code}
                      </span>
                      <span className="cart-side-panel__promo-discount">
                        -
                        {promoCode.type === "percentage"
                          ? `${promoCode.discount}%`
                          : `${currency}${promoCode.discount}`}
                      </span>
                    </div>
                    <button
                      className="cart-side-panel__promo-remove"
                      onClick={handleRemovePromo}
                      type="button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4L4 12M4 4L12 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {promoMessage.text && (
                  <p
                    className={`cart-side-panel__promo-message cart-side-panel__promo-message--${promoMessage.type}`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-side-panel__footer">
            <div className="cart-side-panel__totals">
              <div className="cart-side-panel__total-row">
                <span>Проміжний підсумок:</span>
                <span>
                  {currency}
                  {totals.subtotal.toLocaleString("uk-UA")}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="cart-side-panel__total-row cart-side-panel__total-row--discount">
                  <span>Знижка:</span>
                  <span>
                    -{currency}
                    {totals.discount.toLocaleString("uk-UA")}
                  </span>
                </div>
              )}
              <div className="cart-side-panel__total-row cart-side-panel__total-row--final">
                <span>Разом:</span>
                <span>
                  {currency}
                  {totals.total.toLocaleString("uk-UA")}
                </span>
              </div>
            </div>

            <button
              className="cart-side-panel__checkout-button"
              onClick={() => {
                navigate("/checkout");
                onClose();
              }}
              type="button"
            >
              Оформити замовлення
            </button>

            <button
              className="cart-side-panel__clear-button"
              onClick={clearCart}
              type="button"
            >
              Очистити кошик
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CartSidePanel;
