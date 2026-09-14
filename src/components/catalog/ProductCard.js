import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { helperReadableCurrency } from "../../utils/helpers";

const ProductCard = ({ product, onAddProduct }) => {
  const image = product.image || `https://picsum.photos/600/600?random=${product.id}`;

  return (
    <article className="catalog-product-card">
      <button
        type="button"
        className="product-image-button"
        onClick={() => onAddProduct(product)}
        aria-label={`Add ${product.title} to cart`}>
        <img src={image} alt={product.title} />
        <span className="product-heart" aria-hidden="true"><FaHeart /></span>
      </button>
      <div className="catalog-product-info">
        <h3>{product.title}</h3>
        <div className="catalog-product-footer">
          <div className="product-quick-actions">
            <button type="button" aria-label={`Add ${product.title} to cart`} onClick={() => onAddProduct(product)}>
              <FaShoppingBag />
            </button>
          </div>
          <strong>{helperReadableCurrency(product.price)}</strong>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
