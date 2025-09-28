import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEnvelope } from "react-icons/fa";
import "./recoverPassword.css";


function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const API_URL = "http://localhost:8080/api/v1/login/send-email";

  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setSuccess(t("recoverPasswordTokenExpired"));
    }
    return () => clearInterval(timer);
  }, [success, countdown, t]);

  const fetchWithLoading = async (url, options = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ email: email });

      const urlWithParams = `${url}?${params.toString()}`;
      const response = await fetch(urlWithParams, options);
      if (response.status===404) {
        setError(t("recoverPasswordErrorNotFoundUser")); 
        return null;
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (response.status === 204) return { success: true };
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const handleSendLink = async () => {
    setError("");
    setSuccess("");
    setCountdown(120);

    if (!email) {
      setError(t("errorEmptyEmail"));
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError(t("recoverPasswordErrorInvalidEmail"));
      return;
    }

    try {
      const result = await fetchWithLoading(API_URL, {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (result?.success) {
     navigate("/validate-code-password", { state: { email } });
    }
    } catch (err) {
      console.error("API error:", err);
      setError(t("errorServer"));
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };
  
  return (
    <div className="main-wrapper">
      <div className="form-container" >
      <h2 className="form-title">{t("recoverPasswordTitle")}</h2>
      <form 
        onSubmit={(e) => e.preventDefault()}
          onKeyDown={(e) => { if (e.key === "Enter") handleSendLink(); }}>
      <label className="form-label">{t("emailPlaceholder")}</label>
      <div className="input-container">
        <FaEnvelope className="input-icon" />
        <input
          type="text"
          className="input-field"
          placeholder={t("emailExample")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem", marginTop: "1rem" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center", marginBottom: "1rem" , marginTop: "1rem"}}>
          {success}
        </p>}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSendLink}
          disabled={!!success || loading}
        >
          {t("recoverPasswordSendButton")}
        </button>
      </form>
      <p className="form-link">
        {t("rememberPassword")}{" "}
        <span onClick={handleBackToLogin}>
          {t("backToLoginButton")}
        </span>
      </p>
      </div>
    </div>
  );
}

export default RecoverPassword;