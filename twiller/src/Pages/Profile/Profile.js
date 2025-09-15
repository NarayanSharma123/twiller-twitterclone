import React from "react";
import { useTranslation } from "react-i18next";
import "../pages.css";
import Mainprofile from "./Mainprofile/Mainprofile";
import { useUserAuth } from "../../context/UserAuthContext";

const Profile = () => {
  const { user } = useUserAuth();
  const { t } = useTranslation();
  return (
    <div className="profilePage">
      <Mainprofile user={user} />
    </div>
  );
};

export default Profile;
