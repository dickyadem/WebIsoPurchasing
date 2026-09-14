import { useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "../App.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [show, setShow] = useState(false);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleAuthServiceLogin = () => {
    AuthService.login(user)
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
            <h2>Masuk ke workspace</h2>
            <p className="text-muted mb-4">Gunakan akun Anda untuk melanjutkan ke kasir.</p>
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
          <Button onClick={handleAuthServiceLogin} className="w-100">
            {show && <Spinner size="sm" />} Login
          </Button>
          </Card.Body>
        </Card>
      </section>
    </main>
  );
};

export default LoginPage;
