import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./user_dashboard.css";
import { useTranslation } from "react-i18next";

const API_USER = "http://localhost:8080/api/v1/user"; 
const API_USERNAME = "http://localhost:8080/api/v1/admin/get-user-by-identifier"; 
const API_DELETE = "http://localhost:8080/api/v1/admin/delete-user";

function UserDashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [userIdentifier, setUserIdentifier] = useState(location.state?.userIdentifier || null);
  const [userName, setUserName] = useState(location.state?.userName || "undefined");
  const [email, setEmail] = useState(location.state?.email || "");

  const [showAdmin, setShowAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  const [history, setHistory] = useState([
    { status: "success", message: t("history.loginSuccess"), time: t("history.loginTime1") },
    { status: "success", message: t("history.loginSuccessNewDevice"), time: t("history.loginTime2") },
    { status: "fail", message: t("history.loginFailed"), time: t("history.loginTime3") },
  ]);

useEffect(() => {
  const fetchUserData = async () => {
    if (!userName) return;

    try {
      const response = await fetch(`${API_USERNAME}?username=${userName}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserName(data.username);
      setEmail(data.email);
      setUserIdentifier(data.identifier);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchUserData();
}, [userName]);

  const handleSaveProfile = () => alert(t("alert.profileSaved"));
  const handleMFA = () => alert(t("alert.mfaActivated"));
  const handleChangePassword = () => alert(t("alert.passwordChanged"));

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteError("");
    setDeleteSuccess("");

    if (!userIdentifier) {
      setDeleteError(t("alert.missingIdentifier"));
      return;
    }

    const urlWithParams = new URL(API_DELETE);
    urlWithParams.searchParams.append("user", userIdentifier);

    try {
      const response = await fetch(urlWithParams.toString(), {
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
    }
  };

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const cancelDelete = () => setShowDeleteModal(false);
const handleBackToLogin = async () => {
  try {
    if (!userIdentifier) return;

    await fetch(`http://localhost:8080/api/v1/login/logout?user=${userIdentifier}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    navigate("/"); // usa o navigate do hook no topo do componente
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};
  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "A");
  const createProfilePictureStandart = (name) =>
    `https://placehold.co/80x80/2855b7/ffffff?text=${getInitials(name)}`;

  const languageOptions = {
    pt: t("language.portuguese"),
    en: t("language.english"),
    es: t("language.spanish"),
    de: t("language.german"),
  };

  return (
    <div className="dashboard-container">
      {!showAdmin && (
        <div className="user-panel">
          <div className="user-panel-header">
            <h1 className="user-panel-title">
              {t("dashboard.greeting", { name: userName })}
            </h1>
            <button
              className="user-panel-logout-btn"
              onClick={handleBackToLogin}
            >
              {t("dashboard.logoutButton")}
            </button>
          </div>

          <div className="user-panel-sections">
            <div className="profile-section">
              <h2 className="section-title">
                {t("dashboard.profileManagement")}
              </h2>
              <div className="profile-fields">
                <div className="profile-photo-upload">
                  <img
                    src={createProfilePictureStandart(userName)}
                    className="profile-photo"
                    alt={t("dashboard.profilePhotoAlt")}
                  />
                  <input type="file" className="profile-upload-input" />
                </div>
                <div className="profile-field">
                  <label>{t("dashboard.usernameLabel")}</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="profile-input"
                  />
                </div>
                <div className="profile-field">
                  <label>{t("dashboard.emailLabel")}</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="profile-input"
                  />
                </div>
                <div className="profile-field">
                  <label>{t("dashboard.languageLabel")}</label>
                  <select
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="profile-select"
                  >
                    {Object.keys(languageOptions).map((key) => (
                      <option key={key} value={key}>
                        {languageOptions[key]}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="profile-save-btn"
                  onClick={handleSaveProfile}
                >
                  {t("dashboard.saveChangesButton")}
                </button>
              </div>
            </div>

            <div className="security-section">
              <h2 className="section-title">{t("dashboard.securitySettings")}</h2>
              <div className="security-options">

                <div className="security-option">
                  <h3>{t("dashboard.changePasswordTitle")}</h3>
                  <p>{t("dashboard.changePasswordDescription")}</p>
                  <button
                    className="security-btn blue-btn"
                    onClick={handleChangePassword}
                  >
                    {t("dashboard.changePasswordButton")}
                  </button>
                </div>
                <div className="security-option">
                  <h3>{t("dashboard.deleteAccountTitle")}</h3>
                  <p>{t("dashboard.deleteAccountDescription")}</p>
                  <button
                    className="security-btn red-btn"
                    onClick={handleDeleteAccount}
                  >
                    {t("dashboard.deleteAccountButton")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="history-section">
            <h2 className="section-title">{t("dashboard.accessHistoryTitle")}</h2>
            <ul className="history-list">
              {history.map((item, index) => (
                <li
                  key={index}
                  className={`history-item ${
                    item.status === "fail" ? "history-fail" : ""
                  }`}
                >
                  <span className="history-message">{item.message}</span>
                  <span className="history-time">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t("modal.confirmDeletionTitle")}</h3>
            <p className="modal-message">
              {t("modal.confirmDeletionMessage")}
            </p>
            <p className="modal-warning">{t("modal.irreversibleWarning")}</p>
            <div className="modal-buttons">
              <button className="modal-btn yes-btn" onClick={confirmDelete}>
                {t("modal.yesButton")}
              </button>
              <button className="modal-btn no-btn" onClick={cancelDelete}>
                {t("modal.noButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
