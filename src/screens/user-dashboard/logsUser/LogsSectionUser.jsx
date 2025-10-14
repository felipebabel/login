import React, { useState, useEffect } from "react";
import LogsTable from "./LogsUserTable";
import PaginationComponent from "@/components/common/PaginationComponent";
import { GET_LOGS } from "@api/endpoints";
import "./LogsSectionUser.css";
import LoadingOverlay from '@/components/loading/LoadingOverlay';
import { authService } from "@/components/auth/AuthService";

function LogsSectionUser({ t, userIdentifier }) {
  const [logsData, setLogsData] = useState([]);
  const [logsPage, setLogsPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsSortConfig, setLogsSortConfig] = useState({ column: "date", direction: "desc" });

  const fetchLogs = async (page = 0, sortBy = logsSortConfig.column, direction = logsSortConfig.direction) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        size: 10,
        sortBy,
        direction,
        userIdentifier: userIdentifier
      });
      const response = await authService.apiClient(`${GET_LOGS}?${queryParams.toString()}`);
      const data = await response.json();
      setLogsData(data.content || []);
      setLogsPage(page);
      setLogsTotalPages(data.totalPages || 1);
      setLogsSortConfig({ column: sortBy, direction });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogsSort = (columnName) => {
    const direction = logsSortConfig.column === columnName && logsSortConfig.direction === "asc" ? "desc" : "asc";
    fetchLogs(0, columnName, direction);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="logs-section">
      {loading && <LoadingOverlay />}
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
                  <p className="admin-placeholder">{t("adminDashboard.noUserFound")}</p>
      )}
    </div>
  );
}

export default LogsSectionUser;
