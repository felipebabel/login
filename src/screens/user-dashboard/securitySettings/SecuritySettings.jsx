import React, { useState, useEffect } from "react";
import { RESET_PASSWORD_ACCOUNT, DELETE_USER } from "@api/endpoints";
import { useNavigate } from "react-router-dom";
import AlertComponent from '@/components/alert/AlertComponent';
import "./SecuritySettings.css";
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import { authService } from "@/components/auth/AuthService";

const SecuritySettings = ({ t, userIdentifier, userName }) => {
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
  const [loading, setLoading] = useState(false);

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

      const payload = { user: userName, newPassword };

      const response = await authService.apiClient(RESET_PASSWORD_ACCOUNT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 204) {
        setShowChangePasswordModal(false);
        setCustomAlert({
          show: true,
          message: t("resetPassword.success")
        });
      } else if (response.status === 400) {
        setError(t("resetPassword.errorSamePassword"));
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
      setPasswordLoading(true);
      const response = await authService.apiClient(urlWithParams.toString(), {
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
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="config-tab-section">
      {loading && <LoadingOverlay />}
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


      <AlertComponent customAlert={customAlert} setCustomAlert={setCustomAlert} />

      {showChangePasswordModal && (
        <ChangePasswordModal
          t={t}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showNewPassword={showNewPassword}
          setShowNewPassword={setShowNewPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          error={error}
          loading={passwordLoading}
          onSubmit={handleResetPassword}
          onCancel={() => setShowChangePasswordModal(false)}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          t={t}
          loading={passwordLoading}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
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
