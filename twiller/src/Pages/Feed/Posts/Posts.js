import React, { useState } from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import { useTranslation } from "react-i18next";

const Posts = ({ p }) => {
  const { name, username, photo, post, profilephoto } = p;
  const { t } = useTranslation();
  const [openImage, setOpenImage] = useState(false);

  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={profilephoto} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {name}{" "}
              <span className="post__headerSpecial">
                <VerifiedUserIcon
                  className="post__badge"
                  titleAccess={t("post.verified")}
                />{" "}
                @{username}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{post}</p>
          </div>
        </div>
        {photo && (
          <>
            <img
              src={photo}
              alt="post"
              width="500"
              style={{ cursor: "pointer" }}
              onClick={() => setOpenImage(true)}
            />

            {/* Image Modal */}
            {openImage && (
              <div
                className="imageModal"
                onClick={() => setOpenImage(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.8)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                }}
              >
                <img
                  src={photo}
                  alt="full"
                  style={{ maxWidth: "90%", maxHeight: "90%" }}
                />
              </div>
            )}
          </>
        )}
        <div className="post__footer">
          <ChatBubbleOutlineIcon
            className="post__fotter__icon"
            fontSize="small"
            titleAccess={t("post.reply")}
          />
          <RepeatIcon
            className="post__fotter__icon"
            fontSize="small"
            titleAccess={t("post.retweet")}
          />
          <FavoriteBorderIcon
            className="post__fotter__icon"
            fontSize="small"
            titleAccess={t("post.like")}
          />
          <PublishIcon
            className="post__fotter__icon"
            fontSize="small"
            titleAccess={t("post.share")}
          />
        </div>
      </div>
    </div>
  );
};

export default Posts;
