import { useState, useEffect, useCallback, useMemo } from "react";
import { CartContext } from "./CartContext";

const CART_STORAGE_KEY = "cart";
const PROMO_STORAGE_KEY = "cart_promo";

const MOCK_PROMO_CODES = {
  SALE10: { discount: 10, type: "percentage" },
  SAVE50: { discount: 50, type: "fixed" },
  WELCOME: { discount: 15, type: "percentage" },
};

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children, currency = "₴" }) => {
  const [items, setItems] = useState(() => loadFromStorage(CART_STORAGE_KEY, []));
  const [promoCode, setPromoCode] = useState(() => loadFromStorage(PROMO_STORAGE_KEY, null));

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (promoCode) {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promoCode));
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [promoCode]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += item.qty || 1;
        return updated;
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
  }, []);

  const applyPromoCode = useCallback(async (code) => {
    const normalized = code.trim().toUpperCase();
    const promo = MOCK_PROMO_CODES[normalized];

    if (promo) {
      setPromoCode({ code: normalized, discount: promo.discount, type: promo.type });
      return { success: true, message: `Промокод ${normalized} застосовано!` };
    }

    return { success: false, message: "Невірний промокод. Спробуйте інший." };
  }, []);

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    let discount = 0;
    if (promoCode) {
      if (promoCode.type === "percentage") {
        discount = Math.round((subtotal * promoCode.discount) / 100);
      } else {
        discount = promoCode.discount;
      }
    }
    const total = Math.max(0, subtotal - discount);
    return {
      subtotal,
      discount,
      total,
      itemsCount: items.reduce((sum, item) => sum + item.qty, 0),
    };
  }, [items, promoCode]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      totals,
      currency,
      promoCode,
      applyPromoCode,
      removePromoCode,
    }),
    [items, addItem, updateQty, removeItem, clearCart, totals, currency, promoCode, applyPromoCode, removePromoCode]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
