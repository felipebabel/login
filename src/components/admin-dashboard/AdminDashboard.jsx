import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TabsComponent from "./tabs-component/TabsComponent";
import ChartTab from "./charts/ChartTab";
import LogsSection from "./logs/LogsSection";
import PaginationComponent from "./PaginationComponent";
import ConfigTab from "./config-tab/ConfigTab";
import UsersFilters from "./UsersFilters";

import "./admin_dashboard.css";

// ================== Componentes ==================
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

const UsersTable = ({ users, sortConfig, handleSort, handleRightClick, getStatusLabel, t }) => (
  <table className="admin-users-table">
    <thead>
      <tr>
        {[
          { key: "identifier", label: t("adminDashboard.identifier") },
          { key: "username", label: t("adminDashboard.username") },
          { key: "name", label: t("adminDashboard.name") },
          { key: "email", label: t("adminDashboard.email") },
          { key: "status", label: t("adminDashboard.status") },
          { key: "lastAccessDate", label: t("adminDashboard.lastAccessDate") },
          { key: "creationUserDate", label: t("adminDashboard.creationUserDate") },
        ].map((col) => (
          <th key={col.key} onClick={() => col.key !== "status" && handleSort(col.key)}>
            {col.label}
            {sortConfig.column === col.key && <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {users.map((user, idx) => (
        <tr
          key={user.identifier}
          className={idx % 2 === 0 ? "even" : "odd"}
          onContextMenu={(e) => handleRightClick(e, user)}
        >
          <td>{user.identifier}</td>
          <td>{user.username}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{getStatusLabel(user.status)}</td>
          <td>{new Date(user.lastAccessDate).toLocaleString()}</td>
          <td>{new Date(user.creationUserDate).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
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

const AlertComponent = ({ customAlert, setCustomAlert }) => {
  if (!customAlert.show) return null;
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-box">
        <p>{customAlert.message}</p>
        <button onClick={() => setCustomAlert({ show: false, message: "" })}>OK</button>
      </div>
    </div>
  );
};

const LoadingOverlay = () => (
  <div className="loading-overlay">
    <div className="spinner"></div>
  </div>
);

// ================== AdminDashboard ==================
function AdminDashboard() {
  const API_URLS = {
    pending: "http://localhost:8080/api/v1/admin/get-pending-account",
    blocked: "http://localhost:8080/api/v1/admin/get-blocked-account",
    active: "http://localhost:8080/api/v1/admin/get-active-account",
    inactive: "http://localhost:8080/api/v1/admin/get-inactive-account",
    activeSessions: "http://localhost:8080/api/v1/admin/get-active-sessions",
  };
  const API_USERNAME = "http://localhost:8080/api/v1/admin/get-user-by-identifier";

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState(location.state?.userIdentifier || null);
  const [userName, setUserName] = useState(location.state?.userName || "undefined");
  const [userRole, setUserRole] = useState(location.state?.userRole || "user");
  const [email, setEmail] = useState(location.state?.email || "");

  const [activeExtraTab, setActiveExtraTab] = useState("accounts");
  const [activeTab, setActiveTab] = useState("active");

  const [usersData, setUsersData] = useState({ pending: [], blocked: [], active: [], inactive: [], activeSessions: [] });
  const [sortConfig, setSortConfig] = useState({ column: "identifier", direction: "asc" });
  const [pagination, setPagination] = useState({
    active: 0, inactive: 0, pending: 0, blocked: 0, activeSessions: 0, size: 10,
    totalPages: { active: 1, inactive: 1, pending: 1, blocked: 1, activeSessions: 1 },
  });

  const [totals, setTotals] = useState({ total: 0, active: 0, inactive: 0, pending: 0, blocked: 0, activeSessions: 0 });
  const [contextMenu, setContextMenu] = useState(null);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "" });
  const [chartTotals, setChartTotals] = useState(null);

  // ===== Filtros =====
  const [usernameFilter, setUsernameFilter] = useState("");
  const [userIdentifierFilter, setUserIdentifierFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");


const handleFilter = () => {
  const filters = {};
  if (usernameFilter) filters.username = usernameFilter;
  if (nameFilter) filters.name = nameFilter;
  if (userIdentifierFilter) filters.userIdentifier = userIdentifierFilter;

  fetchUsersFilter(0, sortConfig.column, sortConfig.direction, filters);
};

const fetchUsersFilter = async (page = 0, sortBy = sortConfig.column, direction = sortConfig.direction, filters = {}) => {
  try {
    setLoading(true);

    const params = new URLSearchParams({
      page,
      size: pagination.size,
      sortBy,
      direction,
      ...filters
    });

    const data = await fetchWithLoading(`http://localhost:8080/api/v1/admin/get-users?${params.toString()}`);

    // Atualiza todos os tabs ou apenas um tab específico? Se você quiser, pode atualizar apenas 'active' ou criar um state separado para resultados de pesquisa
setFilteredUsers(data.content || []);
    
    setPagination((prev) => ({
      ...prev,
      active: page,
      totalPages: { ...prev.totalPages, active: data.totalPages || 1 },
    }));
    setSortConfig({ column: sortBy, direction });
  } catch (error) {
    console.error(error);
    setCustomAlert({ show: true, message: "Não foi possível carregar usuários." });
  } finally {
    setLoading(false);
  }
};

const handlePageChangeFiltered = (direction) => {
  const currentPage = pagination.filtered || 0;
  const newPage = direction === "next"
    ? Math.min(currentPage + 1, pagination.totalPages.filtered - 1)
    : Math.max(currentPage - 1, 0);

  fetchUsersFilter(newPage, sortConfig.column, sortConfig.direction, {
    username: usernameFilter,
    name: nameFilter,
    userIdentifier: userIdentifierFilter,
  });

  setPagination((prev) => ({ ...prev, filtered: newPage }));
};

useEffect(() => {
  const fetchUserData = async () => {
    if (!userName) return;
    try {
      const data = await fetchWithLoading(`${API_USERNAME}?username=${userName}`);
      setUserName(data.username);
      setEmail(data.email);
      setUserIdentifier(data.identifier);
      setUserRole(data.role);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  fetchUserData();
}, [userName]);


  // ================== Helper ==================
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
      setCustomAlert({ show: true, message: "Não foi possível carregar usuários." });
    }
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

  // ================== useEffect ==================
  useEffect(() => {
    fetchUsers(activeTab, 0, sortConfig.column, sortConfig.direction);
    fetchTotals();
  }, []);

  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (activeExtraTab === "charts") {
      fetchWithLoading("http://localhost:8080/api/v1/admin/get-total-account")
        .then(data => setChartTotals(data))
        .catch(err => setCustomAlert({ show: true, message: "Não foi possível carregar os dados do gráfico." }));
    }
  }, [activeExtraTab]);

  useEffect(() => {
    fetchTotals();
  }, [activeTab]);

  useEffect(() => {
    if (activeExtraTab === "accounts") {
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

    const clearTabSelection = () => {
        setActiveTab(null);
    };

  // ================== Funções ==================
  const handleBackToLogin = async () => {
    try {
      if (!userIdentifier) return;
      await fetchWithLoading(`http://localhost:8080/api/v1/login/logout?user=${userIdentifier}`, { method: "PUT" });
      navigate("/");
    } catch {
    }
      finally {
    navigate("/"); // garante que vai para login
  }
  };

  const handleSort = (columnName) => {
    const direction = sortConfig.column === columnName && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ column: columnName, direction });
    fetchUsers(activeTab, 0, columnName, direction, {
      username: usernameFilter,
      identifier: userIdentifierFilter,
      status: statusFilter
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (usersData[tab].length === 0) fetchUsers(tab, pagination[tab]);
  };

  const handlePageChange = (direction) => {
    const currentPage = pagination[activeTab];
    const newPage = direction === "next"
      ? Math.min(currentPage + 1, pagination.totalPages[activeTab] - 1)
      : Math.max(currentPage - 1, 0);
    fetchUsers(activeTab, newPage, sortConfig.column, sortConfig.direction, {
      username: usernameFilter,
      identifier: userIdentifierFilter,
      status: statusFilter
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE": return t("adminDashboard.active");
      case "PENDING": return t("adminDashboard.pending");
      case "BLOCKED": return t("adminDashboard.blocked");
      case "INACTIVE": return t("adminDashboard.inactive");
      default: return status;
    }
  };

  const handleRightClick = (e, user) => {
    e.preventDefault();
    let options = [];
    if (userRole === 'ADMIN') {
      if (activeTab === "active") options = [t("adminDashboard.inactivate"), t("adminDashboard.block"), t("adminDashboard.forceChangePassowrd"),
       t("adminDashboard.giveAnalysticPrivillege")];
      else if (activeTab === "inactive") options = [t("adminDashboard.activate"), t("adminDashboard.block")];
      else if (activeTab === "pending") options = [t("adminDashboard.deny")];
      else if (activeTab === "blocked") options = [t("adminDashboard.activate")];
      else if (activeTab === "activeSessions") options = [t("adminDashboard.forceLogout"), t("adminDashboard.forceChangePassowrd"),
         t("adminDashboard.giveAnalysticPrivillege")];
    }
    setContextMenu({ x: e.clientX, y: e.clientY, options, user });
  };

  const handleMenuOptionClick = async (option, user) => {
    try {
      let endpoint = "";
      if (["Activate", "Allow"].includes(option)) endpoint = "http://localhost:8080/api/v1/admin/allow-user";
      else if (option === "Block") endpoint = "http://localhost:8080/api/v1/admin/block-user";
      else if (option === "Inactivate") endpoint = "http://localhost:8080/api/v1/admin/inactive-user";
      else if (option === "Force Change Password") endpoint = "http://localhost:8080/api/v1/admin/force-password-change";
      else if (option === "Force Logout") endpoint = "http://localhost:8080/api/v1/login/logout";

      await fetchWithLoading(`${endpoint}?user=${user.identifier}`, {
        method: option === "Deny" ? "DELETE" : "PUT",
        headers: { "Content-Type": "application/json" },
      });

      setCustomAlert({ show: true, message: `Usuário ${option.toLowerCase()} com sucesso!` });
      fetchUsers(activeTab, pagination[activeTab]);
      fetchTotals();
    } catch (error) {
      setCustomAlert({ show: true, message: "Não foi possível executar a ação: " + error.message });
    } finally {
      setContextMenu(null);
    }
  };

const displayedUsers = (usernameFilter || nameFilter || userIdentifierFilter)
  ? filteredUsers
  : usersData[activeTab] || [];


  // ================== Render ==================
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

  return (
    <div className="dashboard-container">
      {loading && <LoadingOverlay />}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h1>{t("adminDashboard.title")}</h1>
          <button className="admin-panel-logout-btn" onClick={handleBackToLogin}>
            {t("adminDashboard.logoutButton")}
          </button>
        </div>

        <TabsComponent tabs={extraTabs} activeTab={activeExtraTab} onTabClick={setActiveExtraTab} />

        {activeExtraTab === "accounts" && (
          <>
            <TotalsComponent totals={totals} t={t} />
<div className="tabs-filters-container">
  <div className="tabs-wrapper">
    <TabsComponent tabs={userTabs} activeTab={activeTab} onTabClick={handleTabClick} />
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
  {activeTab ? (
    displayedUsers.length > 0 ? (
      <>
        <UsersTable
          users={displayedUsers}
          sortConfig={sortConfig}
          handleSort={handleSort}
          handleRightClick={handleRightClick}
          getStatusLabel={getStatusLabel}
          t={t}
        />
        <PaginationComponent
          activePage={pagination[activeTab]}
          totalPages={pagination.totalPages[activeTab]}
          onPageChange={handlePageChange}
          t={t}
        />
      </>
    ) : (
      <p className="admin-placeholder">Nenhum usuário encontrado</p>
    )
  ) : null}
</div>

          </>
        )}

        {activeExtraTab === "logs" && <LogsSection fetchWithLoading={fetchWithLoading} t={t} />}

        {activeExtraTab === "config" && (
          <ConfigTab
            t={t}
            userRole={userRole}
            userIdentifier={userIdentifier}
            fetchWithLoading={fetchWithLoading}
            setCustomAlert={setCustomAlert}
          />
        )}

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
