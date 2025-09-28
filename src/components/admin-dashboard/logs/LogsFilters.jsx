import React from "react";
import "./logs_filters.css";

const LogsFilters = ({
  usernameFilter,
  setUsernameFilter,
  userIdentifierFilter,
  setUserIdentifierFilter,
  actionFilter,
  setActionFilter,
  handleFilter,
}) => {

  const handleUsernameChange = (e) => {
    setUsernameFilter(e.target.value);
    if (e.target.value) {
      setActionFilter(""); 
      setUserIdentifierFilter("");
    }
  };

  const handleUserIdentifierChange = (e) => {
    setUserIdentifierFilter(e.target.value);
    if (e.target.value) {
      setUsernameFilter(""); 
      setActionFilter("");
    }
  };

  const handleActionChange = (e) => {
    setActionFilter(e.target.value);
    if (e.target.value) {
      setUsernameFilter(""); 
      setUserIdentifierFilter("");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleFilter();
  };

  return (
    <form className="logs-filters" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={usernameFilter}
        onChange={handleUsernameChange}
      />
      <input
  type="text"
  placeholder="User identifier"
  value={userIdentifierFilter}
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUserIdentifierFilter(value);
      if (value) {
        setUsernameFilter("");
        setActionFilter("");
      }
    }
  }}
/>

      <input
        type="text"
        placeholder="Action"
        value={actionFilter}
        onChange={handleActionChange}
      />
      <button type="submit" className="filter-btn">
        🔍 Filtrar
      </button>
    </form>
  );
};

export default LogsFilters;
