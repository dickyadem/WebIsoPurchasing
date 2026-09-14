import { FaHeart, FaSearch, FaShoppingBag } from "react-icons/fa";

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
          <div className="catalog-brand">Iso<span>Buy</span></div>
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
