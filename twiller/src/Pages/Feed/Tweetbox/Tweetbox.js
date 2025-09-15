import React, { useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import { useTranslation } from "react-i18next";

const Tweetbox = ({ onNewPost }) => {
  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const { user } = useUserAuth();
  const [loggedinuser] = useLoggedinuser();
  const { t } = useTranslation();

  const email = user?.email;
  const userprofilepic = loggedinuser[0]?.profileImage
    ? loggedinuser[0].profileImage
    : user && user.photoURL;

  const handleuploadimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    console.log("Selected file:", image);
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=c4f0b6446e6a8324677671db3bb5b8a7",
        formData
      )
      .then((res) => {
        console.log("ImgBB Response:", res.data);
        setimageurl(res.data.data.display_url);
        setisloading(false);
      })
      .catch(() => {
        setisloading(false);
      });
  };

  const handletweet = (e) => {
    e.preventDefault();
    if (user?.providerData[0]?.providerId === "password") {
      fetch(`http://localhost:5000/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setname(data[0]?.name);
          setusername(data[0]?.username);
          submitPost(data[0]?.name, data[0]?.username);
        });
    } else {
      setname(user?.displayName);
      setusername(email?.split("@")[0]);
      submitPost(user?.displayName, email?.split("@")[0]);
    }
  };

  const submitPost = (finalName, finalUsername) => {
    if ((finalName, finalUsername)) {
      const userpost = {
        profilephoto: userprofilepic,
        post: post,
        photo: imageurl,
        username: finalUsername,
        name: finalName,
        email: email,
      };
      setpost("");
      setimageurl("");
      fetch("http://localhost:5000/post", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userpost),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && onNewPost) {
            onNewPost({
              _id: data.id,
              ...userpost,
              createdAt: new Date(),
            });
          } else {
            alert(data.message || "Failed to post tweet");
          }
        })
        .catch(() => {
          alert("Something went wrong. Please try again.");
        });
    }
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handletweet}>
        <div className="tweetBox__input">
          <Avatar
            src={
              loggedinuser[0]?.profileImage
                ? loggedinuser[0].profileImage
                : user && user.photoURL
            }
          />
          <input
            type="text"
            placeholder={t("tweetbox.placeholder")}
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
          />
        </div>
        {imageurl && !isloading && (
          <div className="tweetBox__preview">
            <img src={imageurl} alt="preview" width="200" />
          </div>
        )}

        <div className="imageIcon_tweetButton">
          <div style={{ display: "flex" }}>
            <label htmlFor="image" className="imageIcon">
              {isloading ? (
                <p>{t("tweetbox.uploadingImage")}</p>
              ) : imageurl ? (
                <img src={imageurl} alt="uploaded" width="40" />
              ) : (
                <AddPhotoAlternateOutlinedIcon />
              )}
            </label>
            <input
              type="file"
              id="image"
              className="imageInput"
              onChange={handleuploadimage}
            />
          </div>
          <Button
            className="tweetBox__tweetButton"
            type="submit"
            disabled={isloading}
          >
            {isloading
              ? t("tweetbox.uploadingImage")
              : t("tweetbox.tweetButton")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Tweetbox;
