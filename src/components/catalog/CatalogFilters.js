import { FaChevronDown, FaUndo } from "react-icons/fa";

const CatalogFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minRating,
  onRatingChange,
  onReset,
}) => {
  return (
    <aside className="catalog-filters" aria-label="Product filters">
      <section className="filter-section">
        <div className="filter-heading">
          <h2>Categories</h2>
          <FaChevronDown aria-hidden="true" />
        </div>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === "all"}
              onChange={() => onCategoryChange("all")}
            />
            <span>All products</span>
          </label>
          {categories.map((category) => (
            <label key={category}>
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-heading">
          <h2>Price</h2>
          <FaChevronDown aria-hidden="true" />
        </div>
        <div className="price-fields">
          <label>
            <span>Min price</span>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => onMinPriceChange(event.target.value)}
              placeholder="$0"
            />
          </label>
          <label>
            <span>Max price</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              placeholder="$1,000"
            />
          </label>
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-heading">
          <h2>Rating</h2>
          <FaChevronDown aria-hidden="true" />
        </div>
        <div className="filter-options">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating}>
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => onRatingChange(rating)}
              />
              <span>{rating}.0 stars & up</span>
            </label>
          ))}
        </div>
      </section>

      <button type="button" className="reset-filter" onClick={onReset}>
        <FaUndo aria-hidden="true" />
        Reset filters
      </button>
    </aside>
  );
};

export default CatalogFilters;
