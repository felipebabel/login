import React, { useState, useEffect } from "react";
import "./ConfigTab.css";
import { GET_CONFIG, SET_CONFIG } from "@api/endpoints";
import { authService } from "@/components/auth/AuthService";

const ConfigTab = ({ t, userRole, userIdentifier: propUserIdentifier, setCustomAlert }) => {
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  const [tokenSessionExpiration, setTokenSessionExpiration] = useState(10);
  const [userIdentifier] = useState(propUserIdentifier || location.state?.userIdentifier || null);

  useEffect(() => {
    const fetchPasswordExpiry = async () => {
      try {
        const response = await authService.apiClient(`${GET_CONFIG}?configDescription=passwordExpiryDays`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        setPasswordExpiryDays(Number(data?.value || 90));
      } catch (err) {
        console.error(err);
        setCustomAlert({ show: true, message: t("adminDashboard.configuration.errorMessageLoadPasswordExpiry") });
      }

      try {
        const response = await authService.apiClient(`${GET_CONFIG}?configDescription=tokenSessionExpiration`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        setTokenSessionExpiration(Number(data?.value || 10));
      } catch (err) {
        console.error(err);
        setCustomAlert({ show: true, message: t("adminDashboard.configuration.errorMessageLoadTokenExpiration") });
      }
    };

    fetchPasswordExpiry();
  }, []);

  const handleSavePassword = async () => {
    try {
      await authService.apiClient(
        `${SET_CONFIG}?configDescription=passwordExpiryDays&configValue=${passwordExpiryDays}&userRequired=${userIdentifier}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCustomAlert({ show: true, message: t("adminDashboard.configuration.successMessageSave") });
    } catch (err) {
      setCustomAlert({ show: true, message: `${t("adminDashboard.configuration.errorMessageSave")}: ${err.message}` });
    }
  };

  const handleSaveToken = async () => {
    try {
      await authService.apiClient(
        `${SET_CONFIG}?configDescription=tokenSessionExpiration&configValue=${tokenSessionExpiration}&userRequired=${userIdentifier}`,
        {
          method: "PUT", headers: {
            "Content-Type": "application/json",
          }
        }
      );
      setCustomAlert({ show: true, message: t("adminDashboard.configuration.successMessageSave") });
    } catch (err) {
      setCustomAlert({ show: true, message: `${t("adminDashboard.configuration.errorMessageSave")}: ${err.message}` });
    }
  };

  const handleKeyPress = async (e, saveHandler) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await saveHandler();
      e.target.blur();
    }
  };

  return (
    <div className="config-tab-section">
      <h2>{t("adminDashboard.passwordConfig")}</h2>

      <div className="config-grid">
        <div className="config-item">
          <label>{t("adminDashboard.passwordExpiryDays")}:</label>
          <input
            type="text"
            value={passwordExpiryDays}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setPasswordExpiryDays(Number(e.target.value));
            }}
            onKeyDown={(e) => handleKeyPress(e, handleSavePassword)}
          />
          {userRole === "ADMIN" && (
            <button className="save-config-btn" onClick={handleSavePassword}>
              {t("adminDashboard.save")}
            </button>
          )}
        </div>

        <div className="config-item">
          <label>{t("adminDashboard.tokenSessionExpiration")}:</label>
          <input
            type="text"
            value={tokenSessionExpiration}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setTokenSessionExpiration(Number(e.target.value));
            }}
            onKeyDown={(e) => handleKeyPress(e, handleSaveToken)}
          />
          {userRole === "ADMIN" && (
            <button className="save-config-btn" onClick={handleSaveToken}>
              {t("adminDashboard.save")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigTab;
