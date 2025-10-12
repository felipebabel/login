import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { RESET_PASSWORD } from "@/api/endpoints";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
import AlertComponent from "@/components/alert/AlertComponent";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "" });

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
    const username = location.state?.username || "";


  const email = location.state?.email || sessionStorage.getItem("resetEmail");
  const user = sessionStorage.getItem("user");

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleResetPassword = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError(t("resetPassword.errorFieldsEmpty"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("resetPassword.errorMinLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.errorMismatch"));
      return;
    }

    try {
      setLoading(true);

      const params = email
        ? new URLSearchParams({ email, newPassword })
        : new URLSearchParams({ user: username, newPassword });

      const urlWithParams = `${RESET_PASSWORD}?${params.toString()}`;

      const response = await fetch(urlWithParams, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 204) {
        setCustomAlert({
          show: true,
          message: t("resetPassword.success"),
          onConfirm: () => handleBackToLogin(),
        });
      } else {
        const data = await response.json();
        if (
          data.message ===
          "The new password cannot be the same as the current password."
        ) {
          setError(t("resetPassword.errorSamePassword"));
        } else {
          setError(t("resetPassword.errorServer"));
        }
      }
    } catch (err) {
      console.error("API error:", err);
      setError(t("resetPassword.errorServer"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      {loading && <LoadingOverlay />}
      <AlertComponent customAlert={customAlert} setCustomAlert={setCustomAlert} />
      <div className="form-container">
        <h2 className="form-title">{t("resetPassword.title")}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
        >
          <label className="form-label">{t("resetPassword.newPassword")}</label>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type={showNewPassword ? "text" : "password"}
              className="input-field"
              placeholder="********"
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

          <label className="form-label">
            {t("resetPassword.confirmNewPassword")}
          </label>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="input-field"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {t("resetPassword.saveButton")}
          </button>

          <p className="form-link">
            <span onClick={handleBackToLogin}>
              {t("resetPassword.backToLoginButton")}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
