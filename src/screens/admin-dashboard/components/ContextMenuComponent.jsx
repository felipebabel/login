import React, { useEffect, useRef, useState } from "react";
import "./ContextMenuComponent.css";

function ContextMenuComponent({ contextMenu, closeMenu, handleAction }) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

useEffect(() => {
  if (contextMenu && contextMenu.visible && menuRef.current) {
    const menu = menuRef.current;
    const { innerWidth, innerHeight, scrollY, scrollX } = window;
    const menuRect = menu.getBoundingClientRect();

    let top = contextMenu.y + scrollY;
    let left = contextMenu.x + scrollX;

    const marginRight = 60;
    const marginBottom = 40;

    if (left + menuRect.width + marginRight > innerWidth + scrollX) {
      left = contextMenu.x + scrollX - menuRect.width - 10;
    }

    if (top + menuRect.height + marginBottom > innerHeight + scrollY) {
      top = contextMenu.y + scrollY - menuRect.height - 10;
    }

    top = Math.max(scrollY + 4, top) -40;
    left = Math.max(scrollX + 4, left) -30;

    setPosition({ top, left }); 
  }
}, [contextMenu]);


  if (!contextMenu || !contextMenu.visible) return null;

  const options = contextMenu.options || [];
  if (options.length === 0) return null;

  return (
    <ul
      className="context-menu"
      ref={menuRef}
      style={{
        top: position.top,
        left: position.left,
        position: "absolute",
        zIndex: 9999,
      }}
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
