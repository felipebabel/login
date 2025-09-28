import React from "react";
import "./logs/logs_filters.css"; 

const UsersFilters = ({
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
        placeholder="Username"
        value={usernameFilter}
        onChange={handleUsernameChange}
      />
            <input
        type="text"
        placeholder="Name"
        value={nameFilter}
        onChange={handleNameChange}
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
            <button
  type="button"
  className="clear-btn"
  onClick={() => {
    setUsernameFilter("");
    setUserIdentifierFilter("");
    setNameFilter("");
  }}
>
  Limpar filtros
</button>
    </form>
  );
};

export default UsersFilters;
