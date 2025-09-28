import React from "react";
import "./TabsComponent.css";

const TabsComponent = ({ tabs, activeTab, onTabClick }) => (
  <div className="tabs extra-tabs">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        className={activeTab === tab.key ? "tab-button active" : "tab-button"}
        onClick={() => onTabClick(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default TabsComponent;
