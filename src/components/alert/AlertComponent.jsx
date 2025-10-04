import React from "react";
import "./AlertComponent.css";

const AlertComponent = ({ customAlert, setCustomAlert }) => {
  if (!customAlert.show) return null;

  const handleConfirm = () => {
    if (customAlert.onConfirm) {
      customAlert.onConfirm();
    }
    setCustomAlert({ show: false, message: "", onConfirm: undefined });
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box">
        <p>{customAlert.message}</p>
        <button
          onClick={handleConfirm}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertComponent;