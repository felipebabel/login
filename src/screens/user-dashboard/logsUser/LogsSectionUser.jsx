import React, { useState, useEffect } from "react";
import LogsTable from "./LogsUserTable";
import PaginationComponent from "@/components/common/PaginationComponent";
import { GET_LOGS } from "@api/endpoints";
import "./LogsSectionUser.css";

function LogsSectionUser({ fetchWithLoading, t, userIdentifier }) {
  const [logsData, setLogsData] = useState([]);
  const [logsPage, setLogsPage] = useState(0);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsSortConfig, setLogsSortConfig] = useState({ column: "date", direction: "desc" });

  const fetchLogs = async (page = 0, sortBy = logsSortConfig.column, direction = logsSortConfig.direction) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        size: 10,
        sortBy,
        direction,
        userIdentifier: userIdentifier
      });
      const data = await fetchWithLoading(`${GET_LOGS}?${queryParams.toString()}`);
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

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="logs-section">
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

export default LogsSectionUser;
