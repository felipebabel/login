import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./user_dashboard.css";
import { useTranslation } from "react-i18next";
import { LOGOUT } from "@api/endpoints";
import LogsSectionUser from "./logsUser/LogsSectionUser";
import TabsComponent from "@/components/tabs-component/TabsComponent";
import AlertComponent from '@/components/alert/AlertComponent';
import SecuritySettings from "./securitySettings/SecuritySettings";
import ProfileManagement from "./profileManagement/ProfileManagement";
import { authService } from "@/components/auth/AuthService";

function UserDashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("accountManagement");
  const [customAlert, setCustomAlert] = useState({ show: false, message: "" });
  const [userIdentifier, setUserIdentifier] = useState(null);
  const [userRole, setUserRole] = useState(location.state?.userRole || "user");
  const [userName, setUserName] = useState(location.state?.userName || "undefined");
  const [nameDash, setNameDash] = useState("");
  const tabs = [
    { key: "accountManagement", label: t("userDashboard.accountManagement") },
    { key: "securitySettings", label: t("userDashboard.securitySettings") },
    { key: "activityLog", label: t("userDashboard.activityLog") },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleBackToLogin = async () => {
    try {
      if (!userIdentifier) {
        navigate("/");
        return;
      }
      const urlWithParams = new URL(LOGOUT);
      urlWithParams.searchParams.append("user", userIdentifier);
      setLoading(true);
      await authService.apiClient(urlWithParams, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      authService.logout();
      navigate("/");
    } catch (error) {
      navigate("/");
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };
  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "A");
  const createProfilePictureStandart = (name) =>
    `https://placehold.co/80x80/1e40af/ffffff?text=${getInitials(name)}`;

  return (
    <div className="dashboard-container">

      <div className="user-panel">
        <div className="user-panel-header">
          <div class="user-info">

            <div className="profile-photo-upload">
              <img
                src={createProfilePictureStandart(userName)}
                className="profile-photo"
                alt={t("dashboard.profilePhotoAlt")}
              />
            </div>
            <h1 className="user-panel-title">
              {t("dashboard.greeting", { name: nameDash || userName })}
            </h1>
          </div>
          {userRole === "ANALYST" && (
            <>
              <div className="admin-panel-buttons">
                <button
                  className="analyst-panel-profile-btn"
                  onClick={() => {
                    navigate("/admin-dashboard", {
                      state: {
                        userName: userName,
                        userRole: userRole,
                        userIdentifier: userIdentifier,
                      },
                    });
                  }}
                >
                  {t("analystDashboard.seeAnalystDashboard")}
                </button>
                <button className="admin-panel-logout-btn" onClick={handleBackToLogin}>
                  {t("dashboard.logoutButton")}
                </button>
              </div>

            </>
          )}
          {userRole === "USER" && (
            <>
              <button
                className="user-panel-logout-btn"
                onClick={handleBackToLogin}
              >
                {t("dashboard.logoutButton")}
              </button>

            </>
          )}
        </div>
        <TabsComponent tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
        {activeTab === "accountManagement" && <ProfileManagement t={t} setUserIdentifier={setUserIdentifier}
          setNameDash={setNameDash} />}
        {activeTab === "securitySettings" && <SecuritySettings t={t} userIdentifier={userIdentifier}
          userName={userName} />}
        {activeTab === "activityLog" && <LogsSectionUser t={t} userIdentifier={userIdentifier} />}
      </div>

      <AlertComponent customAlert={customAlert} setCustomAlert={setCustomAlert} />
    </div>
  );
}

export default UserDashboard;