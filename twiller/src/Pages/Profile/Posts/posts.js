import React, { useState } from "react";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import "./posts.css";
const Posts = ({ p }) => {
  const [openImage, setOpenImage] = useState(false);
  const { name, username, photo, post, profilephoto } = p;
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
                <VerifiedUserIcon className="post__badge" /> @{username}
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
          />
          <RepeatIcon className="post__fotter__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__fotter__icon" fontSize="small" />
          <PublishIcon className="post__fotter__icon" fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Posts;
