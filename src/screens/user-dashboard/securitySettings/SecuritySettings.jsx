import React, { useState, useEffect } from "react";
import { RESET_PASSWORD, DELETE_USER } from "@api/endpoints";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AlertComponent from '@/components/alert/AlertComponent';
import "./SecuritySettings.css";
import LoadingOverlay from '@/components/loading/LoadingOverlay';

const SecuritySettings = ({fetchWithLoading, t, userIdentifier , userName }) => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const cancelDelete = () => setShowDeleteModal(false);
const [customAlert, setCustomAlert] = useState({ show: false, message: "" });
  const [error, setError] = useState("");

  const handleChangePassword = () => {
  setPasswordError("");
  setNewPassword("");
  setError("");
  setConfirmPassword("");
  setShowChangePasswordModal(true);
};

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

    const handleBackToLogin = () => {
        navigate("/");
      };
    
      const handleResetPassword = async () => {
        setError("");
    
        if (!newPassword || !confirmPassword) {
          setError(t("passwordErrorFieldsEmpty"));
          return;
        }
    
        if (newPassword.length < 8) {
          setError(t("passwordErrorMinLength"));
          return;
        }
    
        if (newPassword !== confirmPassword) {
          setError(t("passwordErrorMismatch"));
          return;
        }
    
        try {
          setPasswordLoading(true);
    
          const params = new URLSearchParams({ user: userName, newPassword });
    
          const urlWithParams = `${RESET_PASSWORD}?${params.toString()}`;
    
          const response = await fetch(urlWithParams, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          });
    
          if (response.status === 204) {
            setShowChangePasswordModal(false);
            setCustomAlert({ 
              show: true, 
              message: t("passwordChangedSuccess")
            });
          } else if (response.status ===400){
              setError(t("passwordCannotBeTheSame"));
            } else {
              setError(t("errorServer"));
            
          }
        } catch (err) {
          console.error("API error:", err);
          setError(t("errorServer"));
        } finally {
          setPasswordLoading(false);
        }
      };

const confirmDelete = async () => {
    setDeleteError("");
    setDeleteSuccess("");

    if (!userIdentifier) {
      console.error("Not active session to delete:");
      navigate("/");
    }

    const urlWithParams = new URL(DELETE_USER);
    urlWithParams.searchParams.append("user", userIdentifier);

    try {
      const response = await fetch(urlWithParams.toString(), {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
         },
      });


      if (response.ok) {
        console.log("Account deleted successfully:");
        setDeleteSuccess(t("alert.accountDeleted"));
        setShowDeleteModal(false);
        navigate("/");
      } else {
        console.error("Deletion failed");
        setDeleteError(t("alert.deletionFailed"));
      }
    } catch (error) {
      console.error("Network or fetch error:", error);
      setDeleteError(t("alert.deletionErrorServer"));
    }
  };

  return (
<div className="config-tab-section">

    <div className="config-grid">
        <div className="config-item-user">
        <label>{t("dashboard.changePasswordTitle")}</label>
        <label>{t("dashboard.changePasswordDescription")}</label>
        <button
        className="reset-password-btn"
        onClick={handleChangePassword}
        >
        {t("dashboard.changePasswordButton")}
        </button>
    </div>
    <div className="config-item-user">
        <label>{t("dashboard.deleteAccountTitle")}</label>
        <label>{t("dashboard.deleteAccountDescription")}</label>
        <button
        className="delete-config-btn"
        onClick={handleDeleteAccount}
        >
        {t("dashboard.deleteAccountButton")}
        </button>
    </div>
  </div>

  {showChangePasswordModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      {passwordLoading && <LoadingOverlay />}

      <h2 className="form-title">{t("resetPasswordTitle")}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResetPassword();
        }}
      >
        <label className="form-label">{t("newPassword")}</label>
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

        <label className="form-label">{t("confirmNewPassword")}</label>
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
{error && (
            <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
              {error}
            </p>
          )}
        <div className="modal-buttons">
  <button
    type="submit"
    className="blue-btn"
    disabled={passwordLoading}
  >
    {t("savePassword")}
  </button>
  <button
    type="button"
    className="no-btn"
    onClick={() => setShowChangePasswordModal(false)}
  >
    {t("modal.noButton")}
  </button>
</div>
      </form>
    </div>


  </div>
)}
        <AlertComponent customAlert={customAlert} setCustomAlert={setCustomAlert} />

    {showDeleteModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="form-title">{t("modal.confirmDeletionTitle")}</h2>

      <p >{t("modal.confirmDeletionMessage")}</p>
      <p className="modal-warning">{t("modal.irreversibleWarning")}</p>

      <div className="modal-buttons">
        <button
          className="delete-account-button"
          onClick={confirmDelete}
        >
          {t("modal.yesButton")}
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={cancelDelete}
        >
          {t("modal.noButton")}
        </button>
      </div>
    </div>
  </div>
)}


      {deleteSuccess && (
        <p style={{ color: "green", textAlign: "center", marginTop: "1rem" }}>
          {deleteSuccess}
        </p>
      )}
      {deleteError && (
        <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          {deleteError}
        </p>
      )}
</div>
  );
};

export default SecuritySettings;
