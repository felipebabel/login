import React, { useState, useEffect } from "react";
import LogsTable from "../components/LogsTable";
import LogsFilters from "../components/LogsFilters";
import PaginationComponent from "@/components/common/PaginationComponent";
import "./logsSection.css";
import { GET_LOGS } from "@api/endpoints";
import { authService } from "@/components/auth/AuthService";

function LogsSection({t }) {
  const [logsData, setLogsData] = useState([]);
  const [logsPage, setLogsPage] = useState(0);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsSortConfig, setLogsSortConfig] = useState({ column: "date", direction: "desc" });
  const [usernameFilter, setUsernameFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [userIdentifierFilter, setUserIdentifierFilter] = useState("");

  const fetchLogs = async (page = 0, sortBy = logsSortConfig.column, direction = logsSortConfig.direction) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        size: 10,
        sortBy,
        direction,
        username: usernameFilter,
        action: actionFilter,
        userIdentifier: userIdentifierFilter,
      });
      const response = await authService.apiClient(`${GET_LOGS}?${queryParams.toString()}`
        , {
          headers: {
            "Content-Type": "application/json",
          },
        });
      const data = await response.json();

      setLogsData(data.content || []);
      setLogsPage(page);
      setLogsTotalPages(data.totalPages || 1);
      setLogsSortConfig({ column: sortBy, direction });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogsSort = (columnName) => {
    const direction = logsSortConfig.column === columnName && logsSortConfig.direction === "asc" ? "desc" : "asc";
    fetchLogs(0, columnName, direction);
  };

  const handleLogsFilter = () => fetchLogs(0);

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="logs-section">
      <LogsFilters
        usernameFilter={usernameFilter}
        setUsernameFilter={setUsernameFilter}
        actionFilter={actionFilter}
        setActionFilter={setActionFilter}
        userIdentifierFilter={userIdentifierFilter}
        setUserIdentifierFilter={setUserIdentifierFilter}
        handleFilter={handleLogsFilter}
      />
      {logsData.length > 0 ? (
        <>
          <div className="logs-table-container">
            <LogsTable
              logs={logsData}
              sortConfig={logsSortConfig}
              handleSort={handleLogsSort}
              t={t}
            />
          </div>

          <div className="logs-pagination">
            <PaginationComponent
              activePage={logsPage}
              totalPages={logsTotalPages}
              onPageChange={(direction) => {
                const newPage =
                  direction === "next"
                    ? Math.min(logsPage + 1, logsTotalPages - 1)
                    : Math.max(logsPage - 1, 0);
                fetchLogs(newPage);
              }}
              t={t}
            />
          </div>
        </>
      ) : (
        <p className="admin-placeholder">{t("adminDashboard.noLogFound")}</p>
      )}
    </div>
  );
}

export default LogsSection;
