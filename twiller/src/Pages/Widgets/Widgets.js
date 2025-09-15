import React from "react";
import "./widget.css";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { TwitterTimelineEmbed, TwitterTweetEmbed } from "react-twitter-embed";

const Widgets = () => {
  const { t } = useTranslation();

  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widget__searchIcon" />
        <input placeholder={t("Widgets.search_placeholder")} type="text" />
      </div>
      <div className="widgets__widgetContainer">
        <h2>{t("Widgets.whats_happening")}</h2>
        <TwitterTweetEmbed tweetId={"1816174440071241866"} />
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="Valorant"
          options={{ height: 400 }}
        />
        <div
          className="chatbot"
          onClick={() => {
            window.location.href = "/home/chatbot";
          }}
        >
          <div className="robot">
            <SmartToyIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
