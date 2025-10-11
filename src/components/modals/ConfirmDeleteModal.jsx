import React from "react";
import LoadingOverlay from '@/components/loading/LoadingOverlay';

const ConfirmDeleteModal = ({ t, loading, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    {loading && <LoadingOverlay />}
    <div className="modal-content-config">
      <h2 className="form-title">{t("modal.confirmDeletionTitle")}</h2>
      <p>{t("modal.confirmDeletionMessage")}</p>
      <p className="modal-warning">{t("modal.irreversibleWarning")}</p>
      <div className="modal-buttons">
        <button className="delete-account-button" onClick={onConfirm}>{t("modal.yesButton")}</button>
        <button type="button" className="cancel-button" onClick={onCancel}>{t("modal.noButton")}</button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;