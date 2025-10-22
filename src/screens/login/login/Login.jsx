import { useState, useRef, useEffect } from "react";
import { FaInfoCircle, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import LanguageSelector from "@/components/language-selector/LanguageSelector";
import packageJson from "@root/package.json";
import "./login.css";
import { LOGIN, GET_MY_USER_DATA } from "@api/endpoints";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
import { authService } from "@/components/auth/AuthService";
import AlertComponent from "@/components/alert/AlertComponent";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "" });

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleAccountInactive = () => {
    navigate("/send-activation-link");
  };


  const navigate = useNavigate();
  const loginContainerRef = useRef(null);
  const { t } = useTranslation();

  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const handleLanguageChange = () => setLang(i18n.language);
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, []);

  const handleLogin = async () => {
    setError("");

    if (!user || !password) {
      setError(t("login.errorEmpty"));
      return;
    }

    setLoading(true);
    try {
      const payload = { user, password };
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        if (errData.message === "Password expired") {
          sessionStorage.setItem("user", JSON.stringify(errData));
          setShowModal(true);
        } else if (errData.message === "Your account is blocked.") {
          setCustomAlert({
            show: true,
            message: t("login.accountBlocked"),
          });
        } else if (errData.message === "Your account is inactive.") {
          setCustomAlert({
            show: true,
            message: t("modal.messageAccountInactive"),
            confirmText: t("modal.sendReactivationCodeButton"),
            cancelText: t("modal.cancelButton"),
            onConfirm: () => handleAccountInactive(),
            onCancel: () => handleBackToLogin(),
          });
        } else {
          setError(t("login.errorInvalid"));
        }
        return;
      }

      const data = await response.json();
      authService.setTokens({
        token: data.token,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        userRole: data.role,
      });
      localStorage.setItem("jwtToken", data.token);
      const userResponse = await authService.apiClient(`${GET_MY_USER_DATA}`);

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        if (userData.message === "Password expired") {
          setShowModal(true);
        } else {
          setError(t("login.errorInvalid"));
        }
        return;
      }

      if (userData?.username) {
        const dashboardPath =
          userData.role === "ADMIN" || userData.role === "ANALYST"
            ? "/admin-dashboard"
            : "/user-dashboard";

        navigate(dashboardPath, {
          state: {
            userName: userData.username,
            userRole: userData.role,
            userIdentifier: userData.identifier,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setError(t("login.errorServer"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => navigate("/register");
  const handleRecoverPassword = () => navigate("/recover-password");

  return (
    <div className="container">
      <AlertComponent customAlert={customAlert} setCustomAlert={setCustomAlert} />
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
                navigate("/reset-password", { state: { username: user } });
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
          href={`${import.meta.env.BASE_URL}assets/docs/Login_Project.pdf`}
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
