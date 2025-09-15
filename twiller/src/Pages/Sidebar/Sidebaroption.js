import React from "react";
import "./Sidebaroption.css";
import "./sidebar.css";
import { useTranslation } from "react-i18next";

const Sidebaroption = ({ active, text, Icon }) => {
  const { t } = useTranslation();

  return (
    <div className={`sidebarOptions ${active && "sidebarOptions--active"}`}>
      <Icon />
      <h2>{t(text)}</h2>
    </div>
  );
};

export default Sidebaroption;
