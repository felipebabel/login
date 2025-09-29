import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import './createAccount.css'
import { CREATE_ACCOUNT } from "@api/endpoints";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
    const [showModal, setShowModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Bloquear clique direito
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword || !name) {
      setError(t("registerErrorEmpty"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("registerErrorPasswordMismatch"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("registerErrorInvalidEmail"));
      return;
    }

    const payload = {
      user: username,
      password: password,
      email: email,
      name: name
    };

    try {
      const response = await fetch(CREATE_ACCOUNT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data.message);
        setError(""); 
        setShowModal(true); 
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
      } else {
        setError(t("registerError") + ": " + data.message);
        console.error("Registration failed:", data.message);
        setSuccess(""); 
      }
    } catch (error) {
      console.error("Network or fetch error:", error);
      setError(t("registerErrorServer"));
      setSuccess("");
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="main-wrapper">
      <div className="form-container" >
      <h2 className="form-title">{t("registerTitle")}</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label className="form-label">{t("username")}</label>
        <div className="input-container">
          <FaUser className="input-icon" />
          <input
            id="username"
            type="text"
            className="input-field"
            placeholder={t("userPlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <label className="form-label">{t("emailPlaceholder")}</label>
        <div className="input-container">
          <FaEnvelope className="input-icon" />
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder={t("emailExample")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <label className="form-label">{t("yourName")}</label>
        <div className="input-container">
          <FaUser className="input-icon" />
          <input
            id="first-name"
            type="text"
            className="input-field"
            placeholder={t("yourName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <label className="form-label">{t("passwordPlaceholder")}</label>
        <div className="input-container">
          <FaLock className="input-icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="input-field"
            placeholder={"********"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <label className="form-label">{t("confirmPasswordPlaceholder")}</label>
        <div className="input-container">
          <FaLock className="input-icon" />
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            className="input-field"
            placeholder={"********"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center", marginBottom: "1rem" }}>{success}</p>}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Conta criada!</h3>
              <p>{t("registerPendingEmail")}</p>
              <button onClick={() => {
                setShowModal(false); 
                navigate("/");       
              }}>
                OK
              </button>
            </div>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRegister}
        >
          {t("signUpButton")}
        </button>
        <p className="form-link">
            {t("alreadyHaveAccount")}{" "}
            <span onClick={handleBackToLogin}>
              {t("backToLoginButton")}
            </span>
          </p>
      </form>
    </div>
    </div>
  );
}

export default CreateAccount;