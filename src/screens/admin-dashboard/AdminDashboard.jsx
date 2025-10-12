import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TabsComponent from "@/components/tabs-component/TabsComponent";
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import AlertComponent from '@/components/alert/AlertComponent';
import ProfileModal from "@/components/modals/ProfileModal";

import LogsSection from "./logs/LogsSection";
import ConfigTab from "./config-tab/ConfigTab";
import ChartTab from "./charts/ChartTab";
import AccountsManagement from "./account-management/AccountsManagement";
import { LOGOUT } from "@api/endpoints";
import "./admin_dashboard.css";
import { authService } from "@/components/auth/AuthService";

function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeExtraTab, setActiveExtraTab] = useState("accounts");
  const [userIdentifier, setUserIdentifier] = useState(location.state?.userIdentifier || null);
  const [userRole, setUserRole] = useState(location.state?.userRole || "user");
  const [userName, setUserName] = useState(location.state?.userName || "user");

  const [loading, setLoading] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "" });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const extraTabs = [
    { key: "accounts", label: t("adminDashboard.accountsManagement") },
    { key: "logs", label: t("adminDashboard.logs") },
    { key: "config", label: t("adminDashboard.config") },
    { key: "charts", label: t("adminDashboard.charts") },
  ];

  const handleBackToLogin = async () => {
    try {
      if (!userIdentifier) {
        navigate("/");
        return;
      }

      const urlWithParams = new URL(LOGOUT);
      urlWithParams.searchParams.append("user", userIdentifier);

      await authService.apiClient(urlWithParams, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      navigate("/");
    }
  };

  return (
    <div className="dashboard-container">
      {loading && <LoadingOverlay />}
      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} data={profileData} t={t} />
      <AlertComponent customAlert={customAlert} setCustomAlert={setCustomAlert} />

      <div className="admin-panel">
        <div className="admin-panel-header">
          {userRole === "ADMIN" && (
            <>
              <h1>{t("adminDashboard.title")}</h1>
              <button className="admin-panel-logout-btn" onClick={handleBackToLogin}>
                {t("dashboard.logoutButton")}
              </button>
            </>
          )}
          {userRole === "ANALYST" && (
            <>
              <h1>{t("analystDashboard.title")}</h1>
              <div className="admin-panel-buttons">
                <button
                  className="analyst-panel-profile-btn"
                  onClick={() => {
                    navigate("/user-dashboard", {
                      state: {
                        userName: userName,
                        userRole: userRole,
                        userIdentifier: userIdentifier,
                      },
                    });
                  }}
                >
                  {t("analystDashboard.seeMyProfile")}
                </button>
                <button className="admin-panel-logout-btn" onClick={handleBackToLogin}>
                  {t("dashboard.logoutButton")}
                </button>
              </div>

            </>
          )}

        </div>
        <TabsComponent tabs={extraTabs} activeTab={activeExtraTab} onTabClick={setActiveExtraTab} />

        {activeExtraTab === "accounts" && (<AccountsManagement t={t} setCustomAlert={setCustomAlert} />)}
        {activeExtraTab === "logs" && <LogsSection t={t} />}
        {activeExtraTab === "config" && <ConfigTab t={t} userRole={userRole} userIdentifier={userIdentifier} setCustomAlert={setCustomAlert} />}
        {activeExtraTab === "charts" && (<div className="charts-section"> <ChartTab t={t} /></div>)}
      </div>
    </div>
  );
}

export default AdminDashboard;
