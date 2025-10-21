import React from "react";
import "./AlertComponent.css";

const AlertComponent = ({ customAlert, setCustomAlert }) => {
  if (!customAlert.show) return null;

  const handleConfirm = () => {
    if (customAlert.onConfirm) {
      customAlert.onConfirm();
    }
    setCustomAlert({ show: false, message: "", onConfirm: undefined, onCancel: undefined });
  };

  const handleCancel = () => {
    setCustomAlert({ show: false, message: "", onConfirm: undefined, onCancel: undefined });
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box">
        <p>{customAlert.message}</p>
        <div className="custom-alert-buttons">
          
          <button
            className="btn-confirm"
            onClick={handleConfirm}
          >
            {customAlert.confirmText || "OK"}
          </button>
          {customAlert.onCancel && (
            <button
              className="btn-cancel"
              onClick={handleCancel}
            >
              {customAlert.cancelText || "Cancel"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;
