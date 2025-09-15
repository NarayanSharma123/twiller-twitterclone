import React from "react";
import { useTranslation } from "react-i18next";
import Widgets from "./Widgets/Widgets";
import Sidebar from "./Sidebar/sidebar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlelogout = async () => {
    try {
      await logOut();
      alert(t("Home.logout_success"));
      navigate("/login");
    } catch (error) {
      console.log(t("Home.error_message"), error.message);
      alert(t("Home.error_message"));
    }
  };

  return (
    <div className="app">
      <Sidebar handlelogout={handlelogout} user={user} />
      <Outlet />
      <Widgets />
    </div>
  );
};

export default Home;
