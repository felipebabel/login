import React from "react";
import "./logsTable.css"

const LogsTable = ({ logs, sortConfig, handleSort, t }) => (
  <table className="admin-users-table">
    <thead>
      <tr>
        {[
          { key: "userIdentifier", label: t("adminDashboard.userIdentifier") },
          { key: "username", label: t("adminDashboard.username") },
          { key: "description", label: t("adminDashboard.description") },
          { key: "action", label: t("adminDashboard.action") },
          { key: "ipAddress", label: t("adminDashboard.ipAddress") },
          { key: "date", label: t("adminDashboard.date") },
        ].map((col) => (
          <th key={col.key} onClick={() => handleSort(col.key)}>
            {col.label}
            {sortConfig.column === col.key && <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {logs.map((log, idx) => (
        <tr key={log.id} className={idx % 2 === 0 ? "even" : "odd"}>
          <td>{log.userId}</td>
          <td>{log.username}</td>
          <td>{log.description}</td>
          <td>{log.action}</td>
          <td>{log.ipAddress}</td>
          <td>{new Date(log.date).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default LogsTable;
