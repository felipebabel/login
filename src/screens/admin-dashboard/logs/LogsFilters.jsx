import React from "react";

const UsersFilters = ({
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
        placeholder="Username"
        value={usernameFilter}
        onChange={handleUsernameChange}
      />
      <input
        type="text"
        placeholder="User identifier"
        value={userIdentifierFilter}
        onChange={handleUserIdentifierChange}
      />
      <button type="submit" className="filter-btn">
        🔍 Filtrar
      </button>
    </form>
  );
};

export default UsersFilters;
