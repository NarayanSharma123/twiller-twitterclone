import React from "react";
import { useTranslation } from "react-i18next";
import "../pages.css";
import "./More.css";
import CustomVideoPlayer from "../CustomVideoPlayer/CustomVideoPlayer";

const More = () => {
  const { t } = useTranslation();

  const handleNextVideo = () => {
    alert("Next Video Triggered!");
  };

  const handleShowComments = () => {
    alert("Comments Section Opened!");
  };

  return (
    <div className="page">
      <h2 className="pageTitle">{t("more.title")}</h2>
      <h2 className="pageSubTitle">Custom Video Player</h2>
      <CustomVideoPlayer
        src="/video/nature.mp4"
        onNextVideo={handleNextVideo}
        onShowComments={handleShowComments}
      />
    </div>
  );
};

export default More;
