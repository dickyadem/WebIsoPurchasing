import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CatalogHeader from "../components/catalog/CatalogHeader";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";
import CheckoutService from "../services/CheckoutService";
import "../App.css";

const today = () => new Date().toISOString().split("T")[0];

const AccountPage = () => {
  const navigate = useNavigate();
  const tokenUser = AuthService.getToken() ? AuthService.getUserFromToken() : null;
  const userId = tokenUser?.sub;
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [carts, setCarts] = useState([]);
  const [allCarts, setAllCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState(null);
  const [status, setStatus] = useState("");

  const loadCarts = () => {
    CheckoutService.list({ limit: 5, sort: "desc" }).then((response) => setAllCarts(response.data || []));
    if (userId) {
      CheckoutService.getByUser(userId).then((response) => setCarts(response.data || []));
    }
  };

  useEffect(() => {
    UserService.list({ limit: 10, sort: "asc" }).then((response) => setUsers(response.data || []));
    if (userId) {
      UserService.getById(userId).then((response) => {
        setProfile(response.data);
        setEmail(response.data.email || "");
      });
    }
    loadCarts();
  }, [userId]);

  const handlePatchUser = () => {
    if (!userId) return;
    UserService.patch(userId, { email })
      .then(() => setStatus("Email di-patch. Fake Store tidak persist."))
      .catch((error) => setStatus(String(error)));
  };

  const handleUpdateUser = () => {
    if (!userId || !profile) return;
    UserService.update(userId, { ...profile, email })
      .then(() => setStatus("User di-update (PUT). Fake Store tidak persist."))
      .catch((error) => setStatus(String(error)));
  };

  const handleDeleteUser = () => {
    if (!userId) return;
    UserService.remove(userId)
      .then(() => {
        AuthService.logout();
        setStatus("User dihapus di API (tidak persist).");
        navigate("/");
      })
      .catch((error) => setStatus(String(error)));
  };

  const openCart = (id) => {
    CheckoutService.getById(id)
      .then((response) => setSelectedCart(response.data))
      .catch((error) => setStatus(String(error)));
  };

  const handleUpdateCart = () => {
    if (!selectedCart) return;
    CheckoutService.update(selectedCart.id, {
      userId: selectedCart.userId,
      date: today(),
      products: selectedCart.products,
    })
      .then(() => setStatus(`Cart ${selectedCart.id} di-update (PUT).`))
      .catch((error) => setStatus(String(error)));
  };

  const handlePatchCart = () => {
    if (!selectedCart) return;
    CheckoutService.patch(selectedCart.id, { date: today() })
      .then(() => setStatus(`Tanggal cart ${selectedCart.id} di-patch.`))
      .catch((error) => setStatus(String(error)));
  };

  const handleDeleteCart = (id) => {
    CheckoutService.remove(id)
      .then(() => {
        setStatus(`Cart ${id} dihapus di API.`);
        setSelectedCart(null);
        loadCarts();
      })
      .catch((error) => setStatus(String(error)));
  };

  return (
    <main className="catalog-page">
      <CatalogHeader searchTerm="" onSearchChange={() => {}} cartCount={0} />
      <div className="catalog-container api-panel">
        <Link to="/pos" className="api-back">← Kembali ke katalog</Link>
        <h1>Akun & cart</h1>
        {status && <p className="api-status">{status}</p>}

        <section>
          <h2>Profil {userId ? `(GET /users/${userId})` : ""}</h2>
          {profile ? (
            <>
              <p>{profile.username} — {profile.email}</p>
              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <div className="api-actions">
                <button type="button" onClick={handlePatchUser}>PATCH email</button>
                <button type="button" onClick={handleUpdateUser}>PUT user</button>
                <button type="button" className="api-danger" onClick={handleDeleteUser}>DELETE user</button>
              </div>
            </>
          ) : (
            <p>Login dulu untuk memuat profil. <Link to="/">Masuk</Link></p>
          )}
        </section>

        <section>
          <h2>Semua user (GET /users)</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username} ({user.email})</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Cart user {userId ? `(GET /carts/user/${userId})` : ""}</h2>
          <ul>
            {(carts.length ? carts : allCarts).map((cart) => (
              <li key={cart.id}>
                <button type="button" onClick={() => openCart(cart.id)}>Cart #{cart.id}</button>
                <span> {cart.date} · {cart.products?.length || 0} item</span>
                <button type="button" className="api-danger" onClick={() => handleDeleteCart(cart.id)}>DELETE</button>
              </li>
            ))}
          </ul>
          <p className="text-muted">Semua cart (GET /carts?limit=5&sort=desc): {allCarts.length} data</p>
        </section>

        {selectedCart && (
          <section>
            <h2>Cart #{selectedCart.id}</h2>
            <pre>{JSON.stringify(selectedCart, null, 2)}</pre>
            <div className="api-actions">
              <button type="button" onClick={handleUpdateCart}>PUT cart</button>
              <button type="button" onClick={handlePatchCart}>PATCH tanggal</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default AccountPage;
