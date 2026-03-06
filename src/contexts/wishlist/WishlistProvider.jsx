import { useState, useEffect, useCallback, useMemo } from "react";
import { WishlistContext } from "./WishlistContext";

const STORAGE_KEY = "wishlist";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [toggleStates, setToggleStates] = useState({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(async (product) => {
    const productId = product.id;

    setToggleStates((prev) => ({ ...prev, [productId]: "toggling" }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setWishlist((prevWishlist) => {
        const isAlreadyInWishlist = prevWishlist.some(
          (item) => item.id === productId
        );

        if (isAlreadyInWishlist) {
          return prevWishlist.filter((item) => item.id !== productId);
        } else {
          return [...prevWishlist, { ...product }];
        }
      });

      setToggleStates((prev) => ({ ...prev, [productId]: "idle" }));
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setToggleStates((prev) => ({ ...prev, [productId]: "idle" }));
    }
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const value = useMemo(
    () => ({
      wishlist,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      toggleStates,
    }),
    [
      wishlist,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      toggleStates,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
