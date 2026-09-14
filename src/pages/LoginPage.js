import { useEffect, useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";
import "../App.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [show, setShow] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    UserService.list({ limit: 5, sort: "asc" }).then((response) => {
      setDemoUsers(response.data || []);
    });
  }, []);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleAuthServiceLogin = () => {
    AuthService.login({ username: user.username, password: user.password })
      .then((response) => {
        setShow(true);
        let token = response.data.token;
        AuthService.saveToken(token);
        setTimeout(() => {
          navigate("/pos");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        setMessage("Login gagal. Coba username demo Fake Store.");
      });
  };

  const handleRegister = () => {
    UserService.create({
      email: user.email,
      username: user.username,
      password: user.password,
      name: { firstname: user.username, lastname: "iso" },
      address: {
        city: "jakarta",
        street: "iso street",
        number: 1,
        zipcode: "12926-3874",
        geolocation: { lat: "-6.2", long: "106.8" },
      },
      phone: "1-570-236-7033",
    })
      .then((response) => {
        setMessage(`User dibuat (id ${response.data.id}). Fake Store tidak persist; login tetap pakai akun demo.`);
        setMode("login");
      })
      .catch((error) => {
        console.log(error);
        setMessage("Register gagal.");
      });
  };

  return (
    <main className="login-shell">
      <section className="login-brand">
        <div className="brand-mark">ISO<span>BUY</span></div>
        <div className="brand-copy">
          <h1>Purchasing, made precise.</h1>
          <p>Kelola kebutuhan belanja dan transaksi harian dari satu ruang kerja yang lebih rapi.</p>
        </div>
        <small>INTERNAL PURCHASING SYSTEM</small>
      </section>
      <section className="login-form-panel">
        <Card className="login-card">
          <Card.Body>
            <div className="pos-kicker">Welcome back</div>
            <h2>{mode === "login" ? "Masuk ke workspace" : "Buat akun"}</h2>
            <p className="text-muted mb-4">
              {mode === "login"
                ? "Gunakan akun Fake Store untuk melanjutkan ke kasir."
                : "POST /users — Fake Store tidak menyimpan user baru."}
            </p>
          {mode === "register" && (
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={user.email || ""}
                onChange={handleInput}
                type="email"
              />
            </Form.Group>
          )}
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              isInvalid={!user.username}
              isValid={user.username}
              value={user.username || ""}
              onChange={handleInput}
              type="text"
            />
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              isInvalid={!user.password}
              isValid={user.password}
              value={user.password || ""}
              onChange={handleInput}
              type="password"
            />
          </Form.Group>
          {message && <p className="text-muted">{message}</p>}
          {mode === "login" ? (
            <Button onClick={handleAuthServiceLogin} className="w-100">
              {show && <Spinner size="sm" />} Login
            </Button>
          ) : (
            <Button onClick={handleRegister} className="w-100">Daftar</Button>
          )}
          <Button
            variant="link"
            className="w-100 mt-2"
            onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Login"}
          </Button>
          {demoUsers.length > 0 && (
            <p className="text-muted mt-3" style={{ fontSize: "0.8rem" }}>
              Demo user: {demoUsers.map((item) => item.username).join(", ")}
            </p>
          )}
          </Card.Body>
        </Card>
      </section>
    </main>
  );
};

export default LoginPage;
