import React from "react";
import "./ProfileModal.css";

const ProfileModal = ({ open, onClose, data, t }) => {
  if (!open || !data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{t("profileModal.userProfile")}: {data.username}</h2>
        <div className="profile-fields-modal">
          <p><strong>{t("profileModal.identifier")}:</strong> {data.identifier}</p>
          <p><strong>{t("profileModal.name")}:</strong> {data.name}</p>
          <p><strong>{t("profileModal.email")}:</strong> {data.email}</p>
          <p><strong>{t("profileModal.role")}:</strong> {data.role}</p>
          <p><strong>{t("profileModal.status")}:</strong> {data.status}</p>
          <p><strong>{t("profileModal.language")}:</strong> {data.language}</p>
          <p><strong>{t("profileModal.phone")}:</strong> {data.phone || "-"}</p>
          <p><strong>{t("profileModal.address")}:</strong> {data.address || "-"}</p>
          <p><strong>{t("profileModal.addressComplement")}:</strong> {data.addressComplement || "-"}</p>
          <p><strong>{t("profileModal.city")}:</strong> {data.city || "-"}</p>
          <p><strong>{t("profileModal.state")}:</strong> {data.state || "-"}</p>
          <p><strong>{t("profileModal.country")}:</strong> {data.country || "-"}</p>
          <p><strong>{t("profileModal.zipCode")}:</strong> {data.zipCode || "-"}</p>
          <p><strong>{t("profileModal.creationDate")}:</strong> {formatDate(data.creationUserDate)}</p>
          <p><strong>{t("profileModal.lastAccessDate")}:</strong> {formatDate(data.lastAccessDate)}</p>
          <p><strong>{t("profileModal.loginDate")}:</strong> {formatDate(data.loginDate)}</p>
          <p><strong>{t("profileModal.passwordChangeDate")}:</strong> {formatDate(data.passwordChangeDate)}</p>
          <p><strong>{t("profileModal.forcePasswordChange")}:</strong> {data.forcePasswordChange ? t("profileModal.yes") : t("profileModal.no")}</p>
          <p><strong>{t("profileModal.loginAttempt")}:</strong> {data.loginAttempt}</p>
          <p><strong>{t("profileModal.updateDate")}:</strong> {formatDate(data.updateDate)}</p>
          <p><strong>{t("profileModal.gender")}:</strong> {data.gender || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;