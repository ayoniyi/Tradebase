import React, { useState } from "react";
import style from "./Tabs.module.scss";

interface AnimatedTabsProps {
  tabs: any[];
}

const TabsComponent: React.FC<AnimatedTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabz = ["Monday", "Wednesday", "Friday"];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className={style.tabsContainer}>
      <div className={style.tabs}>
        {tabs.map((tab: any, index: any) => (
          <div
            key={index}
            className={`${style.tab} ${activeTab === index ? style.active : ""}`}
            onClick={() => handleTabClick(index)}
          >
            <span className={style.tabContent}>{tab}</span>
          </div>
        ))}
        <div
          className={style.activeTabIndicator}
          style={{ transform: `translateX(${activeTab * 100}%)` }}
        />
      </div>
    </div>
  );
};

export default TabsComponent;
