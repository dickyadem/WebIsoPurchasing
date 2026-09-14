import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CatalogHeader from "../components/catalog/CatalogHeader";
import CatalogFooter from "../components/catalog/CatalogFooter";
import ProductService from "../services/ProductService";
import { helperReadableCurrency } from "../utils/helpers";
import "../App.css";

const emptyProduct = {
  title: "",
  price: "",
  description: "",
  image: "",
  category: "",
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [product, setProduct] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    ProductService.getCategories().then((response) => setCategories(response.data || []));
    if (isNew) {
      setProduct(emptyProduct);
      return;
    }
    ProductService.getById(id)
      .then((response) => setProduct(response.data))
      .catch(() => setStatus("Produk tidak ditemukan."));
  }, [id, isNew]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setProduct((values) => ({ ...values, [name]: value }));
  };

  const payload = {
    title: product.title,
    price: Number(product.price),
    description: product.description,
    image: product.image,
    category: product.category,
  };

  const handleCreate = () => {
    ProductService.create(payload)
      .then((response) => setStatus(`Produk dibuat (id ${response.data.id}). Fake Store tidak menyimpan data.`))
      .catch((error) => setStatus(String(error)));
  };

  const handleUpdate = () => {
    ProductService.update(id, payload)
      .then(() => setStatus("Produk di-update (PUT). Fake Store tidak persist."))
      .catch((error) => setStatus(String(error)));
  };

  const handlePatch = () => {
    ProductService.patch(id, { price: Number(product.price) })
      .then(() => setStatus("Harga di-patch. Fake Store tidak persist."))
      .catch((error) => setStatus(String(error)));
  };

  const handleDelete = () => {
    ProductService.remove(id)
      .then(() => {
        setStatus("Produk dihapus di API (tidak persist).");
        setTimeout(() => navigate("/pos"), 800);
      })
      .catch((error) => setStatus(String(error)));
  };

  return (
    <main className="catalog-page">
      <CatalogHeader searchTerm="" onSearchChange={() => {}} cartCount={0} />
      <div className="catalog-container api-panel">
        <Link to="/pos" className="api-back">← Kembali ke katalog</Link>
        <h1>{isNew ? "Tambah produk" : product.title || "Detail produk"}</h1>
        {!isNew && product.image && (
          <img className="api-product-image" src={product.image} alt={product.title} />
        )}
        {!isNew && product.price && (
          <p className="api-price">{helperReadableCurrency(product.price)}</p>
        )}
        <form className="api-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Title
            <input name="title" value={product.title || ""} onChange={handleInput} />
          </label>
          <label>
            Price
            <input name="price" type="number" value={product.price || ""} onChange={handleInput} />
          </label>
          <label>
            Category
            <input name="category" value={product.category || ""} onChange={handleInput} list="product-categories" />
            <datalist id="product-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
          <label>
            Image URL
            <input name="image" value={product.image || ""} onChange={handleInput} />
          </label>
          <label>
            Description
            <textarea name="description" value={product.description || ""} onChange={handleInput} rows={4} />
          </label>
          <div className="api-actions">
            {isNew ? (
              <button type="button" onClick={handleCreate}>POST /products</button>
            ) : (
              <>
                <button type="button" onClick={handleUpdate}>PUT /products/{id}</button>
                <button type="button" onClick={handlePatch}>PATCH harga</button>
                <button type="button" className="api-danger" onClick={handleDelete}>DELETE</button>
              </>
            )}
          </div>
        </form>
        {status && <p className="api-status">{status}</p>}
      </div>
    </main>
  );
};

export default ProductDetailPage;
