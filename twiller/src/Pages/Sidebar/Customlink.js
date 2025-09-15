import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./sidebar.css";

const Customlink = ({ children, to, ...props }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  const { t } = useTranslation();

  return (
    <div>
      <Link
        style={{
          textDecoration: "none",
          color: match ? "var(--twitter-color)" : "black",
        }}
        to={to}
        {...props}
      >
        {children || t("customlink.link")}
      </Link>
    </div>
  );
};

export default Customlink;
