import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
 import "./resetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const API_URL = "http://localhost:8080/api/v1/login/reset-password";
  const email = location.state?.email || sessionStorage.getItem("resetEmail");
  const code = location.state?.code;

  const handleResetPassword = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError(t("passwordErrorFieldsEmpty"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordErrorMismatch"));
      return;
    }

    try {
      setLoading(true);
    const params = new URLSearchParams({ email, newPassword });
    const urlWithParams = `${API_URL}?${params.toString()}`;

    const response = await fetch(urlWithParams, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }, 
    });

      if (!response.ok) throw new Error(t("passwordErrorServer"));

      alert(t("passwordSuccess"));
      navigate("/");
    } catch (err) {
      console.error("API error:", err);
      setError(t("errorServer"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="form-container" >
      <h2 className="form-title">{t("resetPasswordTitle")}</h2>      
      <label className="form-label">{t("newPassword")}</label>
      <div className="input-container">
        <FaLock className="input-icon" />
        <input
          type={showNewPassword ? "text" : "password"}
          className="input-field"
          placeholder={"********"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <span
          className="toggle-password"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <label className="form-label">{t("confirmNewPassword")}</label>
      <div className="input-container">
        <FaLock className="input-icon" />
        <input
          type={showConfirmPassword ? "text" : "password"}
          className="input-field"
          placeholder={"********"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span
          className="toggle-password"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {error && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>}

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleResetPassword}
        disabled={loading}
      >
        {t("savePassword")}
      </button>

      <p className="form-link">
        <span onClick={() => navigate("/")}>{t("backToLoginButton")}</span>
      </p>

      </div>
    </div>
  );
}

export default ResetPassword;
