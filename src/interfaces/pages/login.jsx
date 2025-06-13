import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../../infrastructure/firebase/firebase";
import "../styles/Login.css";
import goldTicket from "../../resources/gold-ticket.png";

function Login({ onLogin }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsRegisterMode((prev) => !prev);
    setError("");
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const loginWithEmail = async () => {
    if (!isValidEmail(email) || !password) {
      setError("Correo o contraseña inválidos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(auth.currentUser);
    } catch (error) {
      setError(error.message);
    }
  };

  const registerWithEmail = async () => {
    if (!nombre || !isValidEmail(email) || password.length < 6) {
      setError("Todos los campos son obligatorios y válidos.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = { uid: user.uid, nombre, email };
      localStorage.setItem("user_" + user.uid, JSON.stringify(userData));

      onLogin(user);
    } catch (error) {
      setError(error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin(auth.currentUser);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="ticket-section">
          <img src={goldTicket} alt="Billete dorado" className="ticket-image" />
        </div>

        <div className="login-container">
          <h2>{isRegisterMode ? "Registro" : "Iniciar sesión"}</h2>

          {error && <p className="error">{error}</p>}

          {isRegisterMode && (
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegisterMode ? (
            <button onClick={registerWithEmail}>Registrarse</button>
          ) : (
            <button onClick={loginWithEmail}>Entrar</button>
          )}
          <button onClick={loginWithGoogle}>Entrar con Google</button>

          <p onClick={toggleMode} style={{ cursor: "pointer", color: "blue" }}>
            {isRegisterMode ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;