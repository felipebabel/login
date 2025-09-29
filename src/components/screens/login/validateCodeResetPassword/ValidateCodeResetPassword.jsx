import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./validateCodeResetVerification.css";
import { VALIDATE_CODE } from "@api/endpoints";

function ValidateCodeResetPassword() {
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const flow =
    location.state?.flow ||
    new URLSearchParams(location.search).get("flow") ||
    "reset-password";

  const email = location.state?.email || sessionStorage.getItem("resetEmail");

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    if (e.key === "Enter") {
      handleValidateCode();
    }
  };

  const handleValidateCode = async () => {
    setError("");
    setSuccess("");

    const codeValue = code.join("");
    if (codeValue.length !== 6) {
      setError(t("validateCodeErrorIncomplete"));
      return;
    }

    try {
      setLoading(true);
      const url = `${VALIDATE_CODE}?code=${codeValue}&email=${email}`;
      const response = await fetch(url, { method: "POST" });

      if (!response.ok) {
        setError(t("validateCodeErrorInvalid"));
        return;
      }

      if (flow === "reset-password") {
        navigate("/reset-password", { state: { email, code: codeValue } });
      } else {
        setSuccess(t("emailVerificationSuccess"));
      }
    } catch (err) {
      console.error("API error:", err);
      setError(t("errorServer"));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  const maskEmail = (mail) => {
    if (!mail) return "";
    const [user, domain] = mail.split("@");
    const maskedUser =
      user.length <= 3 ? user[0] + "***" : user.slice(0, 3) + "***";
    return `${maskedUser}@${domain}`;
  };

  return (
    <div className="main-wrapper">
      <div className="form-container">
      <img src={`${import.meta.env.BASE_URL}assets/image/email.png`} alt="email icon" className="email-icon" />
      <h2>{t("validateCodeTitle")}</h2>

      {flow === "reset-password" && (
        <p className="form-link">
          {t("enter6codesenttotemail")} <b>{maskEmail(email)}</b>
        </p>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="code-box"
            />
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleValidateCode}
          disabled={loading}
        >
          {t("verifyCode")}
        </button>
      </form>

      {flow === "reset-password" && (
        <>
          <p className="form-link">
            {t("didntGetTheCode")}{" "}
            <span onClick={handleBackToLogin}>{t("clickToResend")}</span>
          </p>
          <p className="form-link">
            {t("rememberPassword")}{" "}
            <span onClick={handleBackToLogin}>{t("backToLoginButton")}</span>
          </p>
        </>
      )}
    </div>
        </div>
  );
}

export default ValidateCodeResetPassword;
