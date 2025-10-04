import { useState, useRef } from "react";
import { FaInfoCircle, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/language-selector/LanguageSelector";
import packageJson from "@root/package.json";
import "./login.css";
import { LOGIN } from "@api/endpoints";
import LoadingOverlay from "@/components/loading/LoadingOverlay";

function Login({ setModalMessage }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const loginContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const fetchWithLoading = async (url, options = {}) => {
    try {
      setLoading(true);
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Password expired") {
          sessionStorage.setItem("user", user);
          setShowModal(true);
        } else {
          setError(t("login.errorInvalid"));
        }
        return;
      }
      const data = await response.json();

      if (data?.username != null) {
        const dashboardPath =
          data.role === "ADMIN" || data.role === "ANALYST"
            ? "/admin-dashboard"
            : "/user-dashboard";

        navigate(dashboardPath, {
          state: {
            userName: data.username,
            userRole: data.role,
            userIdentifier: data.identifier,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!user || !password) {
      setError(t("login.errorEmpty"));
      return;
    }

    const payload = { user, password };

    try {
      return await fetchWithLoading(LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      setError(t("login.errorServer"));
    }
  };

  const handleCreateAccount = () => navigate("/register");
  const handleRecoverPassword = () => navigate("/recover-password");

  return (
    <div className="container">
      {loading && <LoadingOverlay />}
      <div className="main-wrapper">
        <div className="form-container" ref={loginContainerRef}>
          <img
            src={`${import.meta.env.BASE_URL}assets/image/lock.png`}
            className="lock-icon"
          />
          <h2 className="form-title">{t("login.title")}</h2>

          <form
            onSubmit={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          >
            <label className="form-label">{t("login.username")}</label>
            <div className="input-container">
              <FaUser className="input-icon" />
              <input
                type="text"
                className="input-field"
                placeholder={t("login.userPlaceholder")}
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>

            <label className="form-label">{t("login.passwordPlaceholder")}</label>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p className="error-msg">{error}</p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              {t("login.loginButton")}
            </button>

            <p className="form-link">
              {t("login.dontHaveAnAccount")}{" "}
              <span onClick={handleCreateAccount}>{t("login.signUp")}</span>
            </p>
            <p className="form-link">
              {t("login.forgotYourPassword")}{" "}
              <span onClick={handleRecoverPassword}>
                {t("login.recoverPassword")}
              </span>
            </p>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("login.passwordChangeRequired")}</h3>
            <p>{t("login.necessaryChangePassword")}</p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/reset-password");
              }}
            >
              {t("login.ok")}
            </button>
          </div>
        </div>
      )}

      <div className="top-right-links">
        <div className="language-selector-wrapper">
          <LanguageSelector />
        </div>
        <a
          href={`${import.meta.env.BASE_URL}assets/docs/info_project.pdf`}
          target="_blank"
          className="info-link"
        >
          <FaInfoCircle size={30} />
        </a>
      </div>

      <footer className="app-footer">
        <p>{t("login.copyright")}</p>
        <p>
          {t("login.version")} {packageJson.version}
        </p>
      </footer>
    </div>
  );
}

export default Login;
