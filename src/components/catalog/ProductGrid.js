import { FaChevronDown } from "react-icons/fa";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, totalProducts, sortBy, onSortChange, onAddProduct }) => {
  return (
    <section className="catalog-products" aria-label="Product catalog">
      <div className="catalog-controls">
        <span>{totalProducts} Results</span>
        <label className="catalog-sort">
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
          <FaChevronDown aria-hidden="true" />
        </label>
      </div>
      {products.length > 0 ? (
        <div className="catalog-product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddProduct={onAddProduct} />
          ))}
        </div>
      ) : (
        <div className="catalog-empty-state">
          <h2>No products found</h2>
          <p>Try changing your search or filters.</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
