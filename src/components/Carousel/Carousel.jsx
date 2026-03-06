import { useState, useRef, useEffect, useCallback } from "react";
import ProductCard from "../ProductCard/ProductCard";
import "./Carousel.scss";

const Carousel = ({
  products,
  title,
  showTitle = true,
  showControls = true,
}) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const momentumRef = useRef(null);
  const lastScrollTimeRef = useRef(0);

  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scroll = useCallback((direction) => {
    if (carouselRef.current) {
      const scrollAmount = 305;
      const newScrollLeft =
        direction === "left"
          ? carouselRef.current.scrollLeft - scrollAmount
          : carouselRef.current.scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!carouselRef.current) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    lastScrollTimeRef.current = Date.now();

    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }

    carouselRef.current.style.scrollBehavior = "auto";
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;

    e.preventDefault();

    const x = e.pageX;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 3) {
      hasDraggedRef.current = true;
    }

    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
    lastScrollTimeRef.current = Date.now();
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;

    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = "";
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;

      if (carouselRef.current) {
        carouselRef.current.style.scrollBehavior = "";
      }

      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);
    }
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (!carouselRef.current) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.touches[0].pageX;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    lastScrollTimeRef.current = Date.now();

    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }

    carouselRef.current.style.scrollBehavior = "auto";
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;

    const x = e.touches[0].pageX;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 3) {
      hasDraggedRef.current = true;
    }

    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
    lastScrollTimeRef.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;

    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = "";
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  }, []);

  const handleCardClick = useCallback((e) => {
    if (hasDraggedRef.current) {
      const target = e.target.closest("a");
      if (target) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollability);
      checkScrollability();

      return () => {
        carousel.removeEventListener("scroll", checkScrollability);
      };
    }
  }, [checkScrollability]);

  if (!products || products.length === 0) {
    return null;
  }

  const displayControls = showControls && products.length > 3;

  return (
    <section className="carousel">
      <div className="container">
        {(showTitle || displayControls) && (
          <div className="carousel__header">
            {showTitle && title && <h2 className="carousel__title">{title}</h2>}
            {displayControls && (
              <div className="carousel__controls">
                <button
                  className={`carousel-control carousel-control--left ${
                    !canScrollLeft ? "carousel-control--disabled" : ""
                  }`}
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Попередній слайд"
                >
                  &#8592;
                </button>
                <button
                  className={`carousel-control carousel-control--right ${
                    !canScrollRight ? "carousel-control--disabled" : ""
                  }`}
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Наступний слайд"
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className="carousel__track"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="carousel__item"
              onClick={handleCardClick}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
