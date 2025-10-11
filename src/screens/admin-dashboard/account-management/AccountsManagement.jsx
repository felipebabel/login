import { useState, useEffect } from "react";
import TabsComponent from "@/components/tabs-component/TabsComponent";
import UsersFilters from "./UsersFilters";
import UsersTable from "./UsersTable";
import PaginationComponent from "@/components/common/PaginationComponent";
import ProfileModal from "@/components/modals/ProfileModal";
import TotalsComponent from "./TotalsComponent";
import ContextMenuComponent from "../components/ContextMenuComponent";
import {
  GET_USER,
  GET_TOTAL_ACCOUNT,
  GET_PENDING_ACCOUNT,
  GET_BLOCKED_ACCOUNT,
  GET_ACTIVE_ACCOUNT,
  GET_INACTIVE_ACCOUNT,
  GET_ACTIVE_SESSIONS,
  GET_USERS
} from "@api/endpoints";
import { authService } from "@/components/auth/AuthService";


function AccountsManagement({ t, setCustomAlert }) {
  const [activeTab, setActiveTab] = useState("active");
  const [usersData, setUsersData] = useState({
    pending: [],
    blocked: [],
    active: [],
    inactive: [],
    activeSessions: []
  });

  const [sortConfig, setSortConfig] = useState({ column: "identifier", direction: "asc" });

  const [pagination, setPagination] = useState({
    active: 0,
    inactive: 0,
    pending: 0,
    blocked: 0,
    activeSessions: 0,
    filtered: 0,
    size: 10,
    totalPages: {
      active: 1,
      inactive: 1,
      pending: 1,
      blocked: 1,
      activeSessions: 1,
      filtered: 1
    },
  });

  const [totals, setTotals] = useState({
    total: 0,
    totalActive: 0,
    totalInactive: 0,
    totalPending: 0,
    totalBlocked: 0,
    totalActiveSession: 0
  });

  const [usernameFilter, setUsernameFilter] = useState("");
  const [userIdentifierFilter, setUserIdentifierFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [contextMenu, setContextMenu] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const endpointMap = {
    pending: GET_PENDING_ACCOUNT,
    blocked: GET_BLOCKED_ACCOUNT,
    active: GET_ACTIVE_ACCOUNT,
    inactive: GET_INACTIVE_ACCOUNT,
    activeSessions: GET_ACTIVE_SESSIONS,
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
      const response = await authService.apiClient(`${endpointMap[tab]}?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsersData((prev) => ({ ...prev, [tab]: data.content || [] }));
      setPagination((prev) => ({
        ...prev,
        [tab]: page,
        totalPages: { ...prev.totalPages, [tab]: data.totalPages || 1 },
      }));
      setSortConfig({ column: sortBy, direction });
    } catch (error) {
      console.error(error);
      setCustomAlert({ show: true, message: t("adminDashboard.messageCannotLoadUsers") });
    }
  };

  const fetchUsersFilter = async (page = 0, sortBy = sortConfig.column, direction = sortConfig.direction, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        size: pagination.size,
        direction,
        username: filters.username || "",
        userIdentifier: filters.userIdentifier || "",
        name: filters.name || ""
      });

      const response = await authService.apiClient(`${GET_USERS}?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

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
      setCustomAlert({ show: true, message: t("adminDashboard.messageCannotLoadFilteredUsers") });
    }
  };

  const fetchTotals = async () => {
    try {
      const response = await authService.apiClient(GET_TOTAL_ACCOUNT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      setTotals(data);
    } catch (error) {
      console.error(error);
      setCustomAlert({ show: true, message: t("adminDashboard.messageCannotLoadTotalUsers") });
    }
  };

  const handleFilter = () => {
    if (!usernameFilter && !nameFilter && !userIdentifierFilter) return;
    const filters = {};
    if (usernameFilter) filters.username = usernameFilter;
    if (nameFilter) filters.name = nameFilter;
    if (userIdentifierFilter) filters.userIdentifier = userIdentifierFilter;
    fetchUsersFilter(0, sortConfig.column, sortConfig.direction, filters);
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

  const contextMenuOptionsMap = {
    active: [
      { key: "view", label: "See Profile" },
      { key: "block", label: "Block" },
    ],
    inactive: [
      { key: "view", label: "See Profile" },
      { key: "activate", label: "Activate" },
    ],
    pending: [
      { key: "view", label: "See Profile" },
      { key: "activate", label: "Activate" },
      { key: "delete", label: "Delete" },
    ],
    blocked: [
      { key: "view", label: "See Profile" },
      { key: "activate", label: "Activate" },
      { key: "delete", label: "Delete" },
    ],
    activeSessions: [
      { key: "view", label: "See Profile" },
      { key: "terminate", label: "Terminate Session" },
    ],
  };


  const handleRightClick = (e, user) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      user,
      options: contextMenuOptionsMap[activeTab] || [],
      visible: true,
    });
  };

  const handleMenuOptionClick = async (option, user) => {
    if (option === "See Profile") {
      try {
        const params = new URLSearchParams({ username: user.username });
        const response = await authService.apiClient(`${GET_USER}?${params.toString()}`);
        if (!response.ok) throw new Error("Erro ao buscar usuário");
        const data = await response.json();
        setProfileData(data);
        setProfileModalOpen(true);
      } catch (error) {
        console.error(error);
        setCustomAlert({ show: true, message: t("adminDashboard.messageCannotLoadProfile") });
      }
    }
    setContextMenu(null);
  };

  const handleSort = (columnName) => {
    const direction = sortConfig.column === columnName && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ column: columnName, direction });

    if (activeTab === "filtered") {
      fetchUsersFilter(0, columnName, direction, {
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

  const clearFilters = () => {
    setUsernameFilter("");
    setUserIdentifierFilter("");
    setNameFilter("");
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

  useEffect(() => {
    fetchTotals();
    fetchUsers(activeTab, 0, sortConfig.column, sortConfig.direction);
  }, []);

  useEffect(() => {
    fetchTotals();
  }, [activeTab]);

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

  const userTabs = [
    { key: "active", label: t("adminDashboard.active") },
    { key: "inactive", label: t("adminDashboard.inactive") },
    { key: "pending", label: t("adminDashboard.pending") },
    { key: "blocked", label: t("adminDashboard.blocked") },
    { key: "activeSessions", label: t("adminDashboard.activeSessions") },
  ];

  const displayedUsers = activeTab === "filtered" ? filteredUsers : usersData[activeTab] || [];

  return (
    <div className="accounts-section">
      <TotalsComponent totals={totals} t={t} />

      <div className="tabs-filters-container">
        <div className="tabs-wrapper">
          <TabsComponent
            tabs={userTabs}
            activeTab={activeTab !== "filtered" ? activeTab : null}
            onTabClick={(tab) => {
              if (usernameFilter || userIdentifierFilter || nameFilter) clearFilters();
              setActiveTab(tab);
              setFilteredUsers([]);
              fetchUsers(tab, 0, sortConfig.column, sortConfig.direction);
            }}
          />
        </div>

        <UsersFilters
          usernameFilter={usernameFilter}
          setUsernameFilter={setUsernameFilter}
          userIdentifierFilter={userIdentifierFilter}
          setUserIdentifierFilter={setUserIdentifierFilter}
          setNameFilter={setNameFilter}
          nameFilter={nameFilter}
          handleFilter={handleFilter}
          onClearTabSelection={() => setActiveTab(null)}
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

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        data={profileData}
        t={t}
      />

      <ContextMenuComponent
        contextMenu={contextMenu}
        closeMenu={() => setContextMenu(null)}
        handleAction={handleMenuOptionClick}
      />
    </div>
  );
}

export default AccountsManagement;
