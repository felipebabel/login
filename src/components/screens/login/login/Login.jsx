import { useState, useEffect, useRef } from "react";
import { FaInfoCircle, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../../language-selector/LanguageSelector";
import packageJson from '../../../../../package.json';
import "./login.css";
import { LOGIN } from "@api/endpoints";

function Login({ setModalMessage }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const loginContainerRef = useRef(null);
  const handleLogin = async () => {
    setError('');

    if (!user || !password) {
      setError(t("errorEmpty"));
      return;    
    }

    const payload = { user, password };

    try {
      const response = await fetch(LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const dashboardPath = data.role === "ADMIN" || data.role === "ANALYST" 
          ? "/admin-dashboard" 
          : "/user-dashboard";
        navigate(dashboardPath, { state: { userName: user } });
      } else {
        setError(t("errorInvalid"));
      }
    } catch (error) {
      setError(t("errorServer"));
    }
  };

  const handleCreateAccount = () => navigate("/register");
  const handleRecoverPassword = () => navigate("/recover-password");

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

return (
  <div className="container">
    <div className="main-wrapper">
      <div className="form-container" ref={loginContainerRef}>
        <img src={`${import.meta.env.BASE_URL}assets/image/lock.png`} alt="lock image" className="lock-icon" />
        <h2 className="form-title">{t("loginTitle")}</h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
        >
          <label className="form-label">{t("username")}</label>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              className="input-field"
              placeholder={t("userPlaceholder")}
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <label className="form-label">{t("passwordPlaceholder")}</label>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              className="input-field"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <p className="error-msg">{error}</p>

          <button type="button" className="btn btn-primary" onClick={handleLogin}>
            {t("loginButton")}
          </button>

          <p className="form-link">
            {t("dontHaveAnAccount")}{" "}
            <span onClick={handleCreateAccount}>{t("signUp")}</span>
          </p>
          <p className="form-link">
            {t("forgotYourPassword")}{" "}
            <span onClick={handleRecoverPassword}>{t("recoverPassword")}</span>
          </p>
        </form>
      </div>
    </div>

    <div className="top-right-links">
      <div className="language-selector-wrapper"><LanguageSelector /></div>
      <a href="/assets/docs/info_project.pdf" target="_blank" className="info-link">
        <FaInfoCircle size={30} />
      </a>
    </div>

    <footer className="app-footer">
      <p>{t("copyright")}</p>
      <p>{t("version")} {packageJson.version}</p>
    </footer>
  </div>
);

}

export default Login;
