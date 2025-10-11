import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEnvelope } from "react-icons/fa";
import "./recoverPassword.css";
import { RECOVER_PASSWORD } from "@api/endpoints";
import LoadingOverlay from "@/components/loading/LoadingOverlay";

function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && success) {
      setSuccess(t("recoverPassword.tokenExpired"));
    }
    return () => clearInterval(timer);
  }, [success, countdown, t]);

  const handleSendLink = async () => {
    setError("");
    setSuccess("");
    setCountdown(120);

    if (!email) {
      setError(t("recoverPassword.errorEmptyEmail"));
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError(t("recoverPassword.errorInvalidEmail"));
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ email });
      const response = await fetch(`${RECOVER_PASSWORD}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 404) {
        setError(t("recoverPassword.errorNotFoundUser"));
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        navigate("/validate-code-password", { state: { email } });
      } else {
        const data = await response.json();
        if (data?.success) {
          navigate("/validate-code-password", { state: { email } });
        }
      }
    } catch (err) {
      console.error("API error:", err);
      setError(t("recoverPassword.errorServer"));
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
        <h2 className="form-title">{t("recoverPassword.title")}</h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendLink();
          }}
        >
          <label className="form-label">{t("recoverPassword.emailLabel")}</label>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              type="text"
              className="input-field"
              placeholder={t("recoverPassword.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red", textAlign: "center", margin: "1rem 0" }}>{error}</p>}
          {success && <p style={{ color: "green", textAlign: "center", margin: "1rem 0" }}>{success}</p>}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSendLink}
            disabled={!!success || loading}
          >
            {t("recoverPassword.sendButton")}
          </button>
        </form>
        <p className="form-link">
          {t("recoverPassword.rememberPassword")}{" "}
          <span onClick={handleBackToLogin}>{t("recoverPassword.backToLoginButton")}</span>
        </p>
      </div>
    </div>
  );
}

export default RecoverPassword;
