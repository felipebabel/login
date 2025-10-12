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

  const options = contextMenu.options || [];
  if (options.length === 0) return null;
  return (
    <ul
      className="context-menu"
      ref={menuRef}
      style={{ top: contextMenu.y - 42, left: contextMenu.x - 32}}
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
