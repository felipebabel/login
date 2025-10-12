import React from "react";

const UsersFilters = ({
  t,
  usernameFilter,
  setUsernameFilter,
  userIdentifierFilter,
  setUserIdentifierFilter,
    setNameFilter,
    nameFilter,
  handleFilter,
  onClearTabSelection,
}) => {

  const handleUsernameChange = (e) => {
    setUsernameFilter(e.target.value);
    if (e.target.value) {
      setUserIdentifierFilter("");
    setNameFilter("");
    }
  };

  const handleUserIdentifierChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUserIdentifierFilter(value);
      if (value) {
        setUsernameFilter("");
        setNameFilter("");
      }
    }
  };


  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
    if (e.target.value) {
      setUsernameFilter("");
        setUserIdentifierFilter("");
    }
  };
  


  const onSubmit = (e) => {
    e.preventDefault();
    onClearTabSelection();
    handleFilter();
  };

  return (
    <form className="logs-filters" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder={t("adminDashboard.username")}
        value={usernameFilter}
        onChange={handleUsernameChange}
      />
            <input
        type="text"
        placeholder={t("adminDashboard.name")}
        value={nameFilter}
        onChange={handleNameChange}
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
            <button
  type="button"
  className="clear-btn"
  onClick={() => {
    setUsernameFilter("");
    setUserIdentifierFilter("");
    setNameFilter("");
  }}
>
  {t("adminDashboard.clearFilter")}
</button>
    </form>
  );
};

export default UsersFilters;
