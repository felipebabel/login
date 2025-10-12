import React from "react";

const UsersFilters = ({
  t,
  usernameFilter,
  setUsernameFilter,
  userIdentifierFilter,
  setUserIdentifierFilter,
  nameFilter,
  handleFilter,
  onClearTabSelection,
}) => {
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsernameFilter(value);
    if (value) {
      setUserIdentifierFilter("");
    }
  };

  const handleUserIdentifierChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUserIdentifierFilter(value);
      if (value) {
        setUsernameFilter("");
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onClearTabSelection?.(); 
    handleFilter();
  };

  return (
    <form className="users-filters" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder={t("adminDashboard.username")}
        value={usernameFilter}
        onChange={handleUsernameChange}
      />
      <input
        type="text"
        placeholder={t("adminDashboard.userIdentifier")}
        value={userIdentifierFilter}
        onChange={handleUserIdentifierChange}
      />
      <button type="submit" className="filter-btn">
        🔍  {t("adminDashboard.filterButton")}
      </button>
    </form>
  );
};

export default UsersFilters;
