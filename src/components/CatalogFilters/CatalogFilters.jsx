import { useState, useEffect } from "react";
import { X } from "lucide-react";
import CustomSelect from "../CustomSelect/CustomSelect";
import "./CatalogFilters.scss";

const CatalogFilters = ({
  params,
  onApply,
  onClearAll,
  onClose,
  categories = [],
  maxPrice: dynamicMaxPrice,
  sortOptions = [
    { value: "default", label: "За замовчуванням" },
    { value: "price-asc", label: "Спочатку дешевші" },
    { value: "price-desc", label: "Спочатку дорожчі" },
    { value: "name-asc", label: "За назвою (А-Я)" },
    { value: "name-desc", label: "За назвою (Я-А)" },
  ],
}) => {
  const MAX_PRICE = dynamicMaxPrice || 50000;
  const [draft, setDraft] = useState(params);

  const [priceInputs, setPriceInputs] = useState(() => {
    const range = params.price ? params.price.split("-").map(Number) : [0, MAX_PRICE];
    return { min: String(range[0]), max: String(range[1]) };
  });

  useEffect(() => {
    setDraft(params);
    const range = params.price ? params.price.split("-").map(Number) : [0, MAX_PRICE];
    setPriceInputs({ min: String(range[0]), max: String(range[1]) });
  }, [params]);

  useEffect(() => {
    if (!dynamicMaxPrice) return;
    setDraft((prev) => {
      const [min, max] = prev.price ? prev.price.split("-").map(Number) : [0, MAX_PRICE];
      const clampedMax = Math.min(max, MAX_PRICE);
      return { ...prev, price: `${min}-${clampedMax}` };
    });
    setPriceInputs((prev) => {
      const max = parseInt(prev.max) || MAX_PRICE;
      const clampedMax = Math.min(max, MAX_PRICE);
      return { ...prev, max: String(clampedMax) };
    });
  }, [dynamicMaxPrice]);

  const handleCategoryToggle = (value) => {
    setDraft((prev) => {
      const current = prev.categories || [];
      const isActive = current.includes(value);
      return {
        ...prev,
        categories: isActive
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleSortChange = (value) => {
    setDraft((prev) => ({ ...prev, sort: value }));
  };

  const handleInStockToggle = () => {
    setDraft((prev) => ({ ...prev, inStock: !prev.inStock }));
  };

  const handlePriceInputChange = (field, value) => {
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    setPriceInputs((prev) => ({
      ...prev,
      [field]: value,
    }));

    const numValue = value === "" ? (field === "min" ? 0 : MAX_PRICE) : parseInt(value);
    const currentMin = field === "min" ? numValue : (priceInputs.min === "" ? 0 : parseInt(priceInputs.min));
    const currentMax = field === "max" ? numValue : (priceInputs.max === "" ? MAX_PRICE : parseInt(priceInputs.max));

    setDraft((prev) => ({
      ...prev,
      price: `${currentMin}-${currentMax}`,
    }));
  };

  const handlePriceInputBlur = (field) => {
    if (priceInputs[field] === "") {
      const defaultValue = field === "min" ? "0" : String(MAX_PRICE);
      setPriceInputs((prev) => ({
        ...prev,
        [field]: defaultValue,
      }));
    }
  };

  const getActiveCount = () => {
    let count = 0;
    if (draft.categories?.length > 0) count += draft.categories.length;
    if (draft.price && draft.price !== `0-${MAX_PRICE}`) count++;
    if (draft.inStock) count++;
    if (draft.sort && draft.sort !== "default") count++;
    return count;
  };

  const handleApply = () => {
    onApply(draft);
  };

  const handleClear = () => {
    const cleared = {
      categories: [],
      price: `0-${MAX_PRICE}`,
      sort: "default",
      inStock: false,
      page: 1,
      limit: 12,
    };
    setDraft(cleared);
    setPriceInputs({ min: "0", max: String(MAX_PRICE) });
    onClearAll();
  };

  const activeCount = getActiveCount();

  return (
    <div className="catalog-filters">
      <div className="catalog-filters__header">
        <div className="catalog-filters__title-wrapper">
          <h2 className="catalog-filters__title">Фільтри</h2>
          {activeCount > 0 && (
            <button className="catalog-filters__reset" onClick={handleClear}>
              Очистити все
            </button>
          )}
        </div>
        {onClose && (
          <button
            className="catalog-filters__close"
            onClick={onClose}
            aria-label="Закрити фільтри"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="catalog-filters__content">
        {categories.length > 0 && (
          <div className="filter-section">
            <h3 className="filter-section__title">Категорія</h3>
            <div className="filter-section__checkboxes">
              {categories.map((cat) => {
                const value = cat.value || cat.id || cat;
                const label = cat.label || cat.name || cat;
                return (
                  <label key={value} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={draft.categories?.includes(value) || false}
                      onChange={() => handleCategoryToggle(value)}
                    />
                    <span className="filter-checkbox__checkmark"></span>
                    <span className="filter-checkbox__label">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="filter-section">
          <h3 className="filter-section__title">Ціна</h3>
          <div className="filter-section__price-inputs">
            <div className="filter-section__price-input-group">
              <label>Від</label>
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={priceInputs.min}
                  onChange={(e) => handlePriceInputChange("min", e.target.value)}
                  onBlur={() => handlePriceInputBlur("min")}
                />
                <span>грн</span>
              </div>
            </div>

            <span className="filter-section__price-separator">&mdash;</span>

            <div className="filter-section__price-input-group">
              <label>До</label>
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={String(MAX_PRICE)}
                  value={priceInputs.max}
                  onChange={(e) => handlePriceInputChange("max", e.target.value)}
                  onBlur={() => handlePriceInputBlur("max")}
                />
                <span>грн</span>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-section__title">Сортування</h3>
          <CustomSelect
            value={draft.sort || "default"}
            onChange={handleSortChange}
            options={sortOptions}
          />
        </div>

        <div className="filter-section">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={draft.inStock || false}
              onChange={handleInStockToggle}
            />
            <span className="filter-checkbox__checkmark"></span>
            <span className="filter-checkbox__label">Тільки в наявності</span>
          </label>
        </div>
      </div>

      <button className="catalog-filters__apply" onClick={handleApply}>
        Застосувати фільтри
      </button>
    </div>
  );
};

export default CatalogFilters;
