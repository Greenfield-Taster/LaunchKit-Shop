import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ProductGallery.scss";

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23f3f4f6' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

const ProductGallery = ({ images, alt, priority = false }) => {
  const safeImages = images?.length > 0 ? images : [PLACEHOLDER_IMG];
  const hasRealImages = images?.length > 0;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const thumbnailsRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    const nextIndex = (selectedIndex + 1) % safeImages.length;
    const prevIndex =
      (selectedIndex - 1 + safeImages.length) % safeImages.length;

    if (safeImages[nextIndex]) preloadImage(safeImages[nextIndex]);
    if (safeImages[prevIndex]) preloadImage(safeImages[prevIndex]);
  }, [selectedIndex, safeImages]);

  const goToImage = useCallback(
    (index) => {
      if (index === selectedIndex || isTransitioning) return;

      setIsTransitioning(true);
      setMainImageLoaded(false);
      setSelectedIndex(index);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);

      if (thumbnailsRef.current) {
        const thumbnail = thumbnailsRef.current.children[index];
        if (thumbnail) {
          thumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    },
    [selectedIndex, isTransitioning],
  );

  const goToNext = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % safeImages.length;
    goToImage(nextIndex);
  }, [selectedIndex, safeImages.length, goToImage]);

  const goToPrevious = useCallback(() => {
    const prevIndex =
      (selectedIndex - 1 + safeImages.length) % safeImages.length;
    goToImage(prevIndex);
  }, [selectedIndex, safeImages.length, goToImage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  const generateSrcSet = useMemo(
    () => (src) => {
      return `${src} 1x, ${src} 2x`;
    },
    [],
  );

  const handleImageError = useCallback((e) => {
    e.target.src = PLACEHOLDER_IMG;
  }, []);

  const showNavigation = hasRealImages && safeImages.length > 1;

  return (
    <div className="product-gallery">
      <div
        className={`product-gallery__main ${!mainImageLoaded ? "product-gallery__main--loading" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={safeImages[selectedIndex]}
          srcSet={
            hasRealImages
              ? generateSrcSet(safeImages[selectedIndex])
              : undefined
          }
          sizes={
            hasRealImages
              ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              : undefined
          }
          alt={`${alt} - зображення ${selectedIndex + 1} з ${safeImages.length}`}
          onLoad={() => setMainImageLoaded(true)}
          onError={(e) => {
            handleImageError(e);
            setMainImageLoaded(true);
          }}
          className={`product-gallery__main-image ${
            isTransitioning ? "product-gallery__main-image--transitioning" : ""
          } ${mainImageLoaded ? "product-gallery__main-image--loaded" : ""}`}
          loading={priority ? "eager" : "lazy"}
          width={800}
          height={600}
        />

        {showNavigation && (
          <>
            <button
              className="product-gallery__nav product-gallery__nav--prev"
              onClick={goToPrevious}
              disabled={isTransitioning}
              aria-label="Попереднє зображення"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="product-gallery__nav product-gallery__nav--next"
              onClick={goToNext}
              disabled={isTransitioning}
              aria-label="Наступне зображення"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {showNavigation && (
          <div className="product-gallery__counter">
            {selectedIndex + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {showNavigation && (
        <div className="product-gallery__thumbnails" ref={thumbnailsRef}>
          {safeImages.map((image, index) => (
            <button
              key={index}
              className={`product-gallery__thumbnail ${
                index === selectedIndex
                  ? "product-gallery__thumbnail--active"
                  : ""
              }`}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              aria-label={`Переглянути зображення ${index + 1}`}
              aria-pressed={index === selectedIndex}
            >
              <img
                src={image}
                alt={`${alt} мініатюра ${index + 1}`}
                loading="lazy"
                width={100}
                height={100}
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
