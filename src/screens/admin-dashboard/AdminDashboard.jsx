import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TabsComponent from "../../components/tabs-component/TabsComponent";
import ChartTab from "./charts/ChartTab";
import LogsSection from "./logs/LogsSection";
import ConfigTab from "./config-tab/ConfigTab";
import UsersFilters from "./logs/UsersFilters";
import PaginationComponent from "@/components/common/PaginationComponent";
import "./admin_dashboard.css";
import UsersTable from './UsersTable';
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import AlertComponent from '@/components/alert/AlertComponent';
import { LOGOUT } from "@api/endpoints";
import ProfileModal from "@/components/modals/ProfileModal";

const TotalsComponent = ({ totals, t }) => (
  <div className="totals-section">
    <div className="total-card total-all">{t("adminDashboard.total")}: {totals.total}</div>
    <div className="total-card total-active">{t("adminDashboard.totalActive")}: {totals.totalActive}</div>
    <div className="total-card total-inactive">{t("adminDashboard.totalInactive")}: {totals.totalInactive}</div>
    <div className="total-card total-pending">{t("adminDashboard.totalPending")}: {totals.totalPending}</div>
    <div className="total-card total-blocked">{t("adminDashboard.totalBlocked")}: {totals.totalBlocked}</div>
    <div className="total-card total-active">{t("adminDashboard.totalActiveSession")}: {totals.totalActiveSession}</div>
  </div>
);

const ContextMenuComponent = ({ contextMenu, handleMenuOptionClick }) => {
  if (!contextMenu) return null;
  return (
    <ul
      className="context-menu"
      style={{ top: contextMenu.y, left: contextMenu.x, position: "fixed" }}
      onClick={(e) => e.stopPropagation()}
    >
      {contextMenu.options.map((option, i) => (
        <li key={i} onClick={() => handleMenuOptionClick(option, contextMenu.user)} className="context-menu-item">
          {option}
        </li>
      ))}
    </ul>
  );
};

function AdminDashboard() {
  const API_URLS = {
    pending: "http://localhost:8080/api/v1/admin/get-pending-account",
    blocked: "http://localhost:8080/api/v1/admin/get-blocked-account",
    active: "http://localhost:8080/api/v1/admin/get-active-account",
    inactive: "http://localhost:8080/api/v1/admin/get-inactive-account",
    activeSessions: "http://localhost:8080/api/v1/admin/get-active-sessions",
  };

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState(location.state?.userIdentifier || null);
  const [userRole, setUserRole] = useState(location.state?.userRole || "user");

  const [activeExtraTab, setActiveExtraTab] = useState("accounts");
  const [activeTab, setActiveTab] = useState("active");

  const [usersData, setUsersData] = useState({ pending: [], blocked: [], active: [], inactive: [], activeSessions: [] });
  const [sortConfig, setSortConfig] = useState({ column: "identifier", direction: "asc" });
  const [pagination, setPagination] = useState({
    active: 0, inactive: 0, pending: 0, blocked: 0, activeSessions: 0, filtered: 0, size: 10,
    totalPages: { active: 1, inactive: 1, pending: 1, blocked: 1, activeSessions: 1, filtered: 1 },
  });

const [profileModalOpen, setProfileModalOpen] = useState(false);
const [profileData, setProfileData] = useState(null);

  const [totals, setTotals] = useState({ total: 0, active: 0, inactive: 0, pending: 0, blocked: 0, activeSessions: 0 });
  const [contextMenu, setContextMenu] = useState(null);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "" });
  const [chartTotals, setChartTotals] = useState(null);

  // ===== Filtros =====
  const [usernameFilter, setUsernameFilter] = useState("");
  const [userIdentifierFilter, setUserIdentifierFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchWithLoading = async (url, options = {}) => {
    try {
      setLoading(true);
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (response.status === 204) return null;
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    try {
      if (!userIdentifier) { 
        navigate("/");
        return;
      }

      const urlWithParams = new URL(LOGOUT);
      urlWithParams.searchParams.append("user", userIdentifier);

      await fetch(urlWithParams, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      navigate("/"); 
    } catch (error) {
      navigate("/"); 
      console.error("Erro ao fazer logout:", error);
    }
  };

  // ===== Fetch Users =====
  const fetchUsers = async (tab, page = 0, sortBy = sortConfig.column, direction = sortConfig.direction, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        size: pagination.size,
        sortBy,
        direction,
        ...filters
      });
      const data = await fetchWithLoading(`${API_URLS[tab]}?${params.toString()}`);
      setUsersData((prev) => ({ ...prev, [tab]: data.content || [] }));
      setPagination((prev) => ({
        ...prev,
        [tab]: page,
        totalPages: { ...prev.totalPages, [tab]: data.totalPages || 1 },
      }));
      setSortConfig({ column: sortBy, direction });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsersFilter = async (tab, page = 0, sortBy = sortConfig.column, direction = sortConfig.direction, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        size: pagination.size,
        direction,
        username: filters.username || "",
        userIdentifier: filters.userIdentifier || "",
        name: filters.name || ""
      });
      const data = await fetchWithLoading(`http://localhost:8080/api/v1/admin/get-users?${params.toString()}`);
      setFilteredUsers(data.content || []);
      setPagination((prev) => ({
        ...prev,
        filtered: page,
        totalPages: { ...prev.totalPages, filtered: data.totalPages || 1 },
      }));
      setSortConfig({ column: sortBy, direction });
      setActiveTab("filtered");
    } catch (error) {
      console.error(error);
      setCustomAlert({ show: true, message: "Não foi possível carregar usuários filtrados." });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!usernameFilter && !nameFilter && !userIdentifierFilter) return;
    const filters = {};
    if (usernameFilter) filters.username = usernameFilter;
    if (nameFilter) filters.name = nameFilter;
    if (userIdentifierFilter) filters.userIdentifier = userIdentifierFilter;

    fetchUsersFilter(activeTab, 0, sortConfig.column, sortConfig.direction, filters);
  };

  const handlePageChangeFiltered = (direction) => {
    const currentPage = pagination.filtered || 0;
    const newPage = direction === "next"
      ? Math.min(currentPage + 1, pagination.totalPages.filtered - 1)
      : Math.max(currentPage - 1, 0);

    fetchUsersFilter(activeTab, newPage, sortConfig.column, sortConfig.direction, {
      username: usernameFilter,
      name: nameFilter,
      userIdentifier: userIdentifierFilter,
    });
    setPagination((prev) => ({ ...prev, filtered: newPage }));
  };

  const fetchTotals = async () => {
    try {
      const data = await fetchWithLoading("http://localhost:8080/api/v1/admin/get-total-account");
      setTotals(data);
    } catch (error) {
      console.error(error);
      setCustomAlert({ show: true, message: "Não foi possível carregar os totais de usuários." });
    }
  };

  const handleRightClick = (e, user) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      user,
      options: ["See Profile"],
    });
  };


const handleMenuOptionClick = async (option, user) => {
  switch(option) {
    case "See Profile":
      try {
        setLoading(true);
        const params = new URLSearchParams({ username: user.username });
        const response = await fetch(`http://localhost:8080/api/v1/admin/get-user-by-identifier?${params.toString()}`);
        if (!response.ok) throw new Error("Erro ao buscar usuário");
        const data = await response.json();
        setProfileData(data);
        setProfileModalOpen(true);
      } catch (error) {
        console.error(error);
        setCustomAlert({ show: true, message: "Não foi possível carregar o perfil do usuário." });
      } finally {
        setLoading(false);
      }
      break;
    case "Editar":
      navigate("/admin-dashboard/edit-user", { state: { user } });
      break;
    case "Bloquear":
      console.log("Bloquear usuário", user);
      break;
    case "Deletar":
      console.log("Deletar usuário", user);
      break;
    default:
      break;
  }
  setContextMenu(null);
};


  useEffect(() => {
    fetchUsers(activeTab, 0, sortConfig.column, sortConfig.direction);
    fetchTotals();
  }, []);

  useEffect(() => {
    if (activeExtraTab === "charts") {
      fetchWithLoading("http://localhost:8080/api/v1/admin/get-total-account")
        .then(data => setChartTotals(data))
        .catch(err => setCustomAlert({ show: true, message: "Não foi possível carregar os dados do gráfico." }));
    }
  }, [activeExtraTab]);

  const clearFilters = () => {
    setUsernameFilter("");
    setUserIdentifierFilter("");
    setNameFilter("");
  };

  useEffect(() => {
    fetchTotals();
  }, [activeTab]);

  useEffect(() => {
    if (activeExtraTab === "accounts") {
      clearFilters();
      setActiveTab("active");
      fetchTotals();
      fetchUsers(activeTab, pagination[activeTab]);
    }
  }, [activeExtraTab]);

  useEffect(() => {
    const table = document.querySelector(".admin-users-table");
    const preventDefaultContext = (e) => e.preventDefault();
    table?.addEventListener("contextmenu", preventDefaultContext);
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener("click", handleClickOutside);

    return () => {
      table?.removeEventListener("contextmenu", preventDefaultContext);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const clearTabSelection = () => setActiveTab(null);

  const handleSort = (columnName) => {
    const direction = sortConfig.column === columnName && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ column: columnName, direction });

    if (activeTab === "filtered") {
      fetchUsersFilter(activeTab, 0, columnName, direction, {
        username: usernameFilter,
        identifier: userIdentifierFilter,
        name: nameFilter
      });
    } else {
      fetchUsers(activeTab, 0, columnName, direction, {
        username: usernameFilter,
        identifier: userIdentifierFilter,
        status: statusFilter
      });
    }
  };

  const displayedUsers = activeTab === "filtered" ? filteredUsers : usersData[activeTab] || [];

  const userTabs = [
    { key: "active", label: t("adminDashboard.active") },
    { key: "inactive", label: t("adminDashboard.inactive") },
    { key: "pending", label: t("adminDashboard.pending") },
    { key: "blocked", label: t("adminDashboard.blocked") },
    { key: "activeSessions", label: t("adminDashboard.activeSessions") },
  ];

  const extraTabs = [
    { key: "accounts", label: t("adminDashboard.accountsManagement") },
    { key: "logs", label: t("adminDashboard.logs") },
    { key: "config", label: t("adminDashboard.config") },
    { key: "charts", label: t("adminDashboard.charts") },
  ];

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE": return t("adminDashboard.active");
      case "PENDING": return t("adminDashboard.pending");
      case "BLOCKED": return t("adminDashboard.blocked");
      case "INACTIVE": return t("adminDashboard.inactive");
      default: return status;
    }
  };

  const handlePageChange = (tab, direction) => {
    const currentPage = pagination[tab] || 0;
    const newPage = direction === "next"
      ? Math.min(currentPage + 1, pagination.totalPages[tab] - 1)
      : Math.max(currentPage - 1, 0);

    fetchUsers(tab, newPage, sortConfig.column, sortConfig.direction, {
      username: usernameFilter,
      identifier: userIdentifierFilter,
      status: statusFilter,
    });

    setPagination((prev) => ({ ...prev, [tab]: newPage }));
  };

  return (
    <div className="dashboard-container">
      {loading && <LoadingOverlay />}
      <ProfileModal 
        open={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        data={profileData} 
        t={t}
      />
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h1>{t("adminDashboard.title")}</h1>
          <button className="admin-panel-logout-btn" onClick={handleBackToLogin}>
            {t("dashboard.logoutButton")}
          </button>
        </div>

        <TabsComponent tabs={extraTabs} activeTab={activeExtraTab} onTabClick={setActiveExtraTab} />

        {activeExtraTab === "accounts" && (
          <>
            <TotalsComponent totals={totals} t={t} />
            <div className="tabs-filters-container">
              <div className="tabs-wrapper">
                <TabsComponent tabs={userTabs} activeTab={activeTab !== "filtered" ? activeTab : null} onTabClick={(tab) => {
                  if (usernameFilter || userIdentifierFilter || nameFilter) clearFilters(); 
                  setActiveTab(tab);
                  setFilteredUsers([]);
                  fetchUsers(tab, 0, sortConfig.column, sortConfig.direction);
                }} />
              </div>

              <UsersFilters
                usernameFilter={usernameFilter}
                setUsernameFilter={setUsernameFilter}
                userIdentifierFilter={userIdentifierFilter}
                setUserIdentifierFilter={setUserIdentifierFilter}
                setNameFilter={setNameFilter}
                nameFilter={nameFilter}
                handleFilter={handleFilter}
                onClearTabSelection={clearTabSelection}
              />
            </div>
            <div className="admin-panel-content">
              {displayedUsers.length > 0 ? (
                <>
                  <div className="users-table-container">
                    <UsersTable
                      users={displayedUsers}
                      sortConfig={sortConfig}
                      handleSort={handleSort}
                      handleRightClick={handleRightClick}
                      getStatusLabel={getStatusLabel}
                      t={t}
                    />
                  </div>
                  <div className="account-pagination">
                    {pagination.totalPages[activeTab] > 1 && (
                      <PaginationComponent
                        activePage={activeTab === "filtered" ? pagination.filtered : pagination[activeTab]}
                        totalPages={activeTab === "filtered" ? pagination.totalPages.filtered : pagination.totalPages[activeTab]}
                        onPageChange={(dir) => handlePageChange(activeTab, dir)}
                        t={t}
                      />
                    )}
                  </div>
                </>
              ) : (
                <p className="admin-placeholder">{t("adminDashboard.noUserFound")}</p>
              )}
            </div>
          </>
        )}

        {activeExtraTab === "logs" && <LogsSection fetchWithLoading={fetchWithLoading} t={t} />}
        {activeExtraTab === "config" && <ConfigTab t={t} userRole={userRole} userIdentifier={userIdentifier} fetchWithLoading={fetchWithLoading} setCustomAlert={setCustomAlert} />}
        {activeExtraTab === "charts" && (
          <div className="charts-section">
            {chartTotals ? <ChartTab totals={chartTotals} /> : <p>Carregando gráfico...</p>}
          </div>
        )}

        <ContextMenuComponent contextMenu={contextMenu} handleMenuOptionClick={handleMenuOptionClick} />
        <AlertComponent customAlert={customAlert} setCustomAlert={setCustomAlert} />
      </div>
    </div>
  );
}

export default AdminDashboard;
