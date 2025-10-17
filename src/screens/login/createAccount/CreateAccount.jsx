import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { CREATE_ACCOUNT } from "@api/endpoints";
import LoadingOverlay from "@/components/loading/LoadingOverlay";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword || !name) {
      setError(t("register.errorEmpty"));
      return;
    }

    if (password.length < 8) {
      setError(t("register.errorPasswordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register.errorPasswordMismatch"));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("register.errorInvalidEmail"));
      return;
    }

    const languageMap = {
      pt: "PORTUGUESE",
      en: "ENGLISH",
      es: "SPANISH",
      de: "GERMAN",
    };

    const payload = {
      user: username,
      password: password,
      email: email,
      name: name,
      language: languageMap[i18n.language] || "ENGLISH",
    };

    setLoading(true);
    try {
      const response = await fetch(CREATE_ACCOUNT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.message.startsWith("User already exists")) {
          setError(t("register.userAlreadyExists"));
        } else if (data.message === "Email already exists") {
          setError(t("register.emailAlreadyExists"));
        }
        return;
      }

      const result = await response.json();

      if (result.status === "Success") {
        console.log("Registration successful:", result.message);
        setShowModal(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
      } else {
        setError(t("register.errorServer"));
        console.error("Registration failed:", result.message);
      }
    } catch (err) {
      console.error("Network or fetch error:", err);
      setError(t("register.errorServer"));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="main-wrapper">
      {loading && <LoadingOverlay />}
      <div className="form-container">
        <h2 className="form-title">{t("register.title")}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <label className="form-label">{t("register.username")}</label>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder={t("register.userPlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <label className="form-label">{t("register.emailPlaceholder")}</label>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder={t("register.emailExample")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="form-label">{t("register.yourName")}</label>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              id="first-name"
              type="text"
              className="input-field"
              placeholder={t("register.yourName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label className="form-label">{t("register.passwordPlaceholder")}</label>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="input-field"
              placeholder="********"
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

          <label className="form-label">{t("register.confirmPasswordPlaceholder")}</label>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              className="input-field"
              placeholder="********"
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

          {error && (
            <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
              {error}
            </p>
          )}
          {success && (
            <p
              style={{ color: "green", textAlign: "center", marginBottom: "1rem" }}
            >
              {success}
            </p>
          )}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>{t("register.accountCreated")}</h3>
                <p>{t("register.pendingEmail")}</p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate("/");
                  }}
                >
                  {t("register.ok")}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            {t("register.signUpButton")}
          </button>

          <p className="form-link">
            {t("register.alreadyHaveAccount")}{" "}
            <span onClick={handleBackToLogin}>{t("register.backToLoginButton")}</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
