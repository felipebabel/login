import React, { useState, useEffect } from "react";
import "./ConfigTab.css";
import { GET_CONFIG } from "@api/endpoints";
import { SET_CONFIG } from "@api/endpoints";

const ConfigTab = ({ t, userRole, userIdentifier: propUserIdentifier, fetchWithLoading, setCustomAlert }) => {
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  const [tokenSessionExpiration, setTokenSessionExpiration] = useState(10);
  const [userIdentifier, setUserIdentifier] = useState(propUserIdentifier || location.state?.userIdentifier || null);

  useEffect(() => {
    const fetchPasswordExpiry = async () => {
      try {
        const data = await fetchWithLoading(
          `${GET_CONFIG}?configDescription=passwordExpiryDays`
        );
        setPasswordExpiryDays(Number(data?.value || 90));
      } catch (err) {
        console.error(err);
      }
      try {
        const data = await fetchWithLoading(
          `${GET_CONFIG}?configDescription=tokenSessionExpiration`
        );
        setTokenSessionExpiration(Number(data?.value || 10));
      } catch (err) {
        console.error(err);
      }
    };

    fetchPasswordExpiry();
  }, []);

  const handleSavePassword = async () => {
    try {
      await fetchWithLoading(
        `${SET_CONFIG}?configDescription=passwordExpiryDays&configValue=${passwordExpiryDays}&userRequired=${userIdentifier}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
      );
      setCustomAlert({ show: true, message: "Configuração salva com sucesso!" });
    } catch (err) {
      setCustomAlert({ show: true, message: "Falha ao salvar configuração: " + err.message });
    }
  };

  const handleSaveToken = async () => {
    try {
      await fetchWithLoading(
        `${SET_CONFIG}?configDescription=tokenSessionExpiration&configValue=${tokenSessionExpiration}&userRequired=${userIdentifier}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
      );
      setCustomAlert({ show: true, message: "Configuração salva com sucesso!" });
    } catch (err) {
      setCustomAlert({ show: true, message: "Falha ao salvar configuração: " + err.message });
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
              const value = e.target.value;
              if (/^\d*$/.test(value)) setPasswordExpiryDays(Number(value));
            }}
          />
          {(userRole === "ADMIN") && (
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
              const value = e.target.value;
              if (/^\d*$/.test(value)) setTokenSessionExpiration(Number(value));
            }}
          />
          {(userRole === "ADMIN") && (
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
