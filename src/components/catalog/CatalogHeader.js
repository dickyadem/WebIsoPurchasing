import { FaHeart, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const CatalogHeader = ({ searchTerm, onSearchChange, cartCount, onCartClick }) => {
  return (
    <>
      <aside className="catalog-promo">
        <span>15% off first purchase</span>
      </aside>
      <header className="catalog-header">
        <div className="catalog-header-inner">
          <button className="catalog-menu-button" type="button" aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
          <Link to="/pos" className="catalog-brand">Iso<span>Buy</span></Link>
          <label className="catalog-search">
            <FaSearch aria-hidden="true" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
          </label>
          <nav className="catalog-actions" aria-label="Catalog actions">
            <Link to="/pos/product/new" aria-label="Add product">+</Link>
            <Link to="/account" aria-label="Account"><FaUser /></Link>
            <button type="button" aria-label="Wishlist"><FaHeart /></button>
            <button type="button" aria-label="Open cart" onClick={onCartClick}>
              <FaShoppingBag />
              <span>{cartCount}</span>
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default CatalogHeader;
