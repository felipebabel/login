import React from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingOverlay from '@/components/loading/LoadingOverlay';

const ChangePasswordModal = ({
  t,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  error,
  loading,
  onSubmit,
  onCancel
}) => (
  <div className="modal-overlay">
    {loading && <LoadingOverlay />}
    <div className="modal-content-config">
      <h2 className="form-title">{t("resetPasswordTitle")}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
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

        {error && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>}

        <div className="modal-buttons">
          <button type="submit" className="blue-btn">{t("savePassword")}</button>
          <button type="button" className="no-btn" onClick={onCancel}>{t("modal.noButton")}</button>
        </div>
      </form>
    </div>
  </div>
);

export default ChangePasswordModal;
