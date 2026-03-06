import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard/ProductCard";
import CatalogFilters from "../components/CatalogFilters/CatalogFilters";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import usePageMeta from "../hooks/usePageMeta";
import useScrollLock from "../hooks/useScrollLock";
import { SEO } from "../utils/seoData";
import products from "../data/products.json";
import categories from "../data/categories.json";
import "../styles/pages/_catalog.scss";

const Catalog = () => {
  usePageMeta(SEO.catalog);

  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  useScrollLock(filtersOpen);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.price)),
    [],
  );

  const parseParams = useCallback(() => {
    return {
      categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
      price: searchParams.get("price") || `0-${maxPrice}`,
      sort: searchParams.get("sort") || "default",
      inStock: searchParams.get("inStock") === "true",
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 12,
    };
  }, [searchParams, maxPrice]);

  const params = parseParams();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by categories
    if (params.categories.length > 0) {
      result = result.filter((p) =>
        params.categories.some((cat) => p.category.includes(cat)),
      );
    }

    // Filter by price range
    const [minPrice, maxP] = params.price.split("-").map(Number);
    result = result.filter((p) => p.price >= minPrice && p.price <= maxP);

    // Filter by inStock
    if (params.inStock) {
      result = result.filter((p) => p.inStock);
    }

    // Sort
    switch (params.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "uk"));
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [params]);

  const totalPages = Math.ceil(filteredProducts.length / params.limit);
  const paginatedProducts = filteredProducts.slice(
    (params.page - 1) * params.limit,
    params.page * params.limit,
  );

  const updateURL = (newParams) => {
    const query = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;

      if (Array.isArray(value) && value.length > 0) {
        query.set(key, value.join(","));
      } else if (
        (key === "price" && (value === `0-${maxPrice}`)) ||
        (key === "sort" && value === "default") ||
        (key === "inStock" && value === false) ||
        (key === "page" && value === 1) ||
        (key === "limit" && value === 12)
      ) {
        // Skip default values
      } else if (!Array.isArray(value)) {
        query.set(key, value);
      }
    });

    setSearchParams(query);
  };

  const handleApplyFilters = (newFilters) => {
    updateURL({ ...newFilters, page: 1 });
  };

  const handleClearAll = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    updateURL({ ...params, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortOptions = [
    { value: "default", label: "За замовчуванням" },
    { value: "price-asc", label: "Спочатку дешевші" },
    { value: "price-desc", label: "Спочатку дорожчі" },
    { value: "name", label: "За назвою" },
    { value: "newest", label: "Спочатку нові" },
  ];

  const filterCategories = categories
    .filter((c) => c.id !== "all")
    .map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="catalog">
      <div className="catalog__container">
        <div className="catalog__header">
          <div className="catalog__title-wrapper">
            <h1 className="catalog__title">Каталог товарів</h1>
          </div>
          <div className="catalog__controls">
            <div className="catalog__sort">
              <span className="catalog__sort-label">Сортувати:</span>
              <CustomSelect
                value={params.sort}
                onChange={(value) =>
                  updateURL({ ...params, sort: value, page: 1 })
                }
                options={sortOptions}
              />
            </div>
            <p className="catalog__count">
              Знайдено: {filteredProducts.length} товарів
            </p>
          </div>
        </div>

        <div className="catalog__content">
          <aside
            className={`catalog__filters ${
              filtersOpen ? "catalog__filters--open" : ""
            }`}
          >
            <div
              className="catalog__filters-overlay"
              onClick={() => setFiltersOpen(false)}
            ></div>
            <div className="catalog__filters-panel">
              <CatalogFilters
                params={params}
                maxPrice={maxPrice}
                categories={filterCategories}
                sortOptions={sortOptions}
                onApply={(filters) => {
                  handleApplyFilters(filters);
                  setFiltersOpen(false);
                }}
                onClearAll={handleClearAll}
                onClose={() => setFiltersOpen(false)}
              />
            </div>
          </aside>

          <div className="catalog__products">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="products-grid">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="catalog__pagination">
                    <button
                      className="pagination__button"
                      onClick={() => handlePageChange(params.page - 1)}
                      disabled={params.page === 1}
                    >
                      &lsaquo;
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= params.page - 1 &&
                          pageNum <= params.page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            className={`pagination__button ${
                              params.page === pageNum
                                ? "pagination__button--active"
                                : ""
                            }`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === params.page - 2 ||
                        pageNum === params.page + 2
                      ) {
                        return (
                          <span key={pageNum} className="pagination__dots">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      className="pagination__button"
                      onClick={() => handlePageChange(params.page + 1)}
                      disabled={params.page === totalPages}
                    >
                      &rsaquo;
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="catalog__empty">
                <h2>Товари не знайдено</h2>
                <p>Спробуйте змінити параметри фільтрації</p>
                <button
                  onClick={handleClearAll}
                  className="catalog__empty-button"
                >
                  Скинути фільтри
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="catalog__filters-toggle"
          onClick={() => setFiltersOpen(true)}
          aria-label="Відкрити фільтри"
        >
          <SlidersHorizontal size={24} />
        </button>
      </div>
    </div>
  );
};

export default Catalog;
