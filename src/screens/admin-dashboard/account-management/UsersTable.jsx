import React from 'react';
import "./userTable.css";

const UsersTable = ({ users, sortConfig, handleSort, handleRightClick, getStatusLabel, t }) => {
  const columns = [
    { key: "identifier", label: t("adminDashboard.identifier") },
    { key: "username", label: t("adminDashboard.username") },
    { key: "name", label: t("adminDashboard.name") },
    { key: "email", label: t("adminDashboard.email") },
    { key: "status", label: t("adminDashboard.status") },
    { key: "lastAccessDate", label: t("adminDashboard.lastAccessDate") },
    { key: "creationUserDate", label: t("adminDashboard.creationUserDate") },
  ];

  return (
    <table className="admin-users-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} onClick={() => col.key !== "status" && handleSort(col.key)}>
              {col.label}
              {sortConfig.column === col.key && (
                <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
              )}
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
};

export default UsersTable;