import { useEffect, useState } from "react";
import {
  helperDuplicatedInArrayObject,
} from "../utils/helpers";
import ProductService from "../services/ProductService";
import AuthService from "../services/AuthService";
import CheckoutService from "../services/CheckoutService";
import { useNavigate } from "react-router-dom";
import "../App.css";
import CatalogFilters from "../components/catalog/CatalogFilters";
import CatalogFooter from "../components/catalog/CatalogFooter";
import CatalogHeader from "../components/catalog/CatalogHeader";
import ProductGrid from "../components/catalog/ProductGrid";
import TransactionPanel from "../components/catalog/TransactionPanel";

const PPN = 0.11;

const POSPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productChoices, setProductChoices] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkout, setCheckout] = useState({
    userId: 5,
    date: "2023-02-03",
    products: [],
  });

  useEffect(() => {
    ProductService.list().then((response) => {
      setProducts(response.data);
    });

    if (productChoices.length > 0) {
      let sum = 0;
      productChoices.map((product) => {
        sum = sum + product.subtotal;
      });
      sum = sum * PPN + sum;
      setGrandTotal(sum);
    }
  }, [productChoices]);

  const handleCheckoutServiceCreate = () => {
    setCheckout((values) => {
      let temp = { ...values };
      temp.userId = AuthService.getUserFromToken().sub;
      temp.products = [];
      for (const p of productChoices) {
        temp.products.push({
          productId: p.id,
          quantity: p.quantity,
        });
      }

      let nowDate = new Date();
      temp.date = nowDate.toISOString().split("T")[0];
      return temp;
    });

    CheckoutService.create(checkout)
      .then((response) => {
        setProductChoices([]);
        setGrandTotal(0);
        let isPrint = window.confirm("Checkout berhasil, mau di print?");
        if (isPrint) {
          navigate("/pos/print", {
            state: {
              productChoices,
              grandTotal,
              checkout,
            },
          });
        }
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  const handleAddProduct = (product) => {
    let isDuplicate = helperDuplicatedInArrayObject(
      product,
      "id",
      productChoices
    );
    if (isDuplicate) {
      alert("Produk sudah ada.");
    } else {
      setProductChoices((values) => [
        ...values,
        { ...product, quantity: 1, subtotal: product.price },
      ]);
    }
  };

  const handleDeleteProduct = (product) => {
    setProductChoices((values) => {
      let temp = [...values];
      let index = temp.indexOf(product);
      temp.splice(index, 1);
      return temp;
    });
  };

  const handleInputProductChoices = (e, i) => {
    setProductChoices((values) => {
      let temp = [...values];
      temp[i][e.target.name] = e.target.value;
      temp[i].subtotal = parseInt(e.target.value) * temp[i].price;
      return temp;
    });
  };

  const categories = [...new Set(products.map((product) => product.category))];
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = [product.title, product.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesMinPrice = !minPrice || product.price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || product.price <= Number(maxPrice);
      const matchesRating = !minRating || (product.rating?.rate || 0) >= minRating;
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
    })
    .sort((first, second) => {
      if (sortBy === "price-low") return first.price - second.price;
      if (sortBy === "price-high") return second.price - first.price;
      if (sortBy === "rating") return (second.rating?.rate || 0) - (first.rating?.rate || 0);
      return 0;
    });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSortBy("default");
  };

  return (
    <main className="catalog-page">
      <CatalogHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartCount={productChoices.length}
        onCartClick={() => setIsCartOpen(true)}
      />
      <div className="catalog-container">
        <div className="catalog-breadcrumb">Home <span>/</span> Catalog <span>/</span> All products</div>
        <div className="catalog-title-row">
          <div>
            <span className="pos-kicker">IsoBuy collection</span>
            <h1>Product catalog</h1>
          </div>
          <p>Find the right essentials for your next purchase.</p>
        </div>
        <div className="catalog-layout">
          <CatalogFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            minRating={minRating}
            onRatingChange={setMinRating}
            onReset={resetFilters}
          />
          <ProductGrid
            products={filteredProducts}
            totalProducts={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onAddProduct={handleAddProduct}
          />
        </div>
      </div>
      <CatalogFooter />
      {isCartOpen && (
        <TransactionPanel
          productChoices={productChoices}
          grandTotal={grandTotal}
          onCheckout={handleCheckoutServiceCreate}
          onDeleteProduct={handleDeleteProduct}
          onQuantityChange={handleInputProductChoices}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </main>
  );
};

export default POSPage;
