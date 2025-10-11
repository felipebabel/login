import React, { useEffect, useRef } from "react";
import "./ContextMenuComponent.css";

function ContextMenuComponent({ contextMenu, closeMenu, handleAction }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  if (!contextMenu || !contextMenu.visible) return null;

  const options = [
    { key: "view", label: "View Profile" },
    { key: "activate", label: "Activate" },
    { key: "block", label: "Block" },
    { key: "delete", label: "Delete" },
  ];

  return (
    <ul
      className="context-menu"
      ref={menuRef}
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      {options.map(({ key, label }) => (
        <li
          key={key}
          className="context-menu-item"
          onClick={() => handleAction(key, contextMenu.user)}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

export default ContextMenuComponent;
