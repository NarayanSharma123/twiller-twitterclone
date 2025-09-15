import React, { useState, useEffect } from "react";
import Post from "../Posts/posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import { useTranslation } from "react-i18next";

const Mainprofile = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [loggedinuser, setLoggedinuser] = useLoggedinuser();
  const username = user?.email ? user.email.split("@")[0] : "Guest";
  const [post, setpost] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/userpost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setpost(data));

    fetch(`http://localhost:5000/loggedinuser?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data[0]) {
          setNotificationsEnabled(data[0].notificationsEnabled || false);
        }
      });
  }, [user?.email]);

  useEffect(() => {
    if (!notificationsEnabled) return;

    const filteredPosts = post.filter(
      (p) =>
        p.post &&
        p.post.toLowerCase().includes("cricket") &&
        p.post.toLowerCase().includes("science")
    );

    filteredPosts.forEach((p) => {
      if (Notification.permission === "granted") {
        let bodyText = p.post || (p.photo ? "Image uploaded" : "");
        new Notification("New Tweet Alert 🚨", {
          body: bodyText,
          icon: p.photo || "/default-icon.png",
        });
      }
    });
  }, [post, notificationsEnabled]);

  const handleuploadcoverimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const usercoverimage = { email: user?.email, coverimage: url };
        setisloading(false);

        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(usercoverimage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
              setLoggedinuser([data]);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };

  const handleuploadprofileimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userprofileimage = { email: user?.email, profileImage: url };
        setisloading(false);

        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userprofileimage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
              setLoggedinuser([data]);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };

  const handleNotificationToggle = async () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);

    try {
      await fetch(`http://localhost:5000/user/notifications/${user?.email}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled: newStatus }),
      });

      if (newStatus && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>

      <div className="mainprofile">
        <div className="profile-bio">
          <div>
            {/* Cover Image */}
            <div className="coverImageContainer">
              <img
                src={
                  loggedinuser[0]?.coverimage
                    ? loggedinuser[0].coverimage
                    : user && user.photoURL
                }
                alt=""
                className="coverImage"
              />
              <div className="hoverCoverImage">
                <div className="imageIcon_tweetButton">
                  <label htmlFor="image" className="imageIcon">
                    {isloading ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleuploadcoverimage}
                  />
                </div>
              </div>
            </div>

            {/* Profile Avatar */}
            <div className="avatar-img">
              <div className="avatarContainer">
                <img
                  src={
                    loggedinuser[0]?.profileImage
                      ? loggedinuser[0].profileImage
                      : user && user.photoURL
                  }
                  alt=""
                  className="avatar"
                />
                <div className="hoverAvatarImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="profileImage" className="imageIcon">
                      {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      className="imageInput"
                      onChange={handleuploadprofileimage}
                    />
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="userInfo">
                <div>
                  <h3 className="heading-3">
                    {loggedinuser[0]?.name
                      ? loggedinuser[0].name
                      : user && user.displayname}
                  </h3>
                  <p className="usernameSection">@{username}</p>
                </div>
                <Editprofile user={user} loggedinuser={loggedinuser} />
              </div>

              {/* Bio + Location + Website */}
              <div className="infoContainer">
                {loggedinuser[0]?.bio ? <p>{loggedinuser[0].bio}</p> : ""}
                <div className="locationAndLink">
                  {loggedinuser[0]?.location ? (
                    <p className="suvInfo">
                      <MyLocationIcon /> {loggedinuser[0].location}
                    </p>
                  ) : (
                    ""
                  )}
                  {loggedinuser[0]?.website ? (
                    <p className="subInfo link">
                      <AddLinkIcon /> {loggedinuser[0].website}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* Notification Toggle */}
              <div className="notificationToggle" style={{ margin: "20px 0" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  <div
                    onClick={handleNotificationToggle}
                    style={{
                      width: "50px",
                      height: "25px",
                      background: notificationsEnabled ? "#4caf50" : "#ccc",
                      borderRadius: "25px",
                      position: "relative",
                      transition: "0.3s",
                    }}
                  >
                    <div
                      style={{
                        width: "21px",
                        height: "21px",
                        background: "#fff",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "2px",
                        left: notificationsEnabled ? "26px" : "2px",
                        transition: "0.3s",
                      }}
                    />
                  </div>
                  {notificationsEnabled
                    ? "Disable Notifications"
                    : "Enable Notifications"}
                </label>
              </div>

              {/* Tweets */}
              <h4 className="tweetsText">{t("mainprofile.tweets")}</h4>
              <hr />
            </div>

            {/* User posts */}
            {post.map((p, idx) => (
              <Post key={idx} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;
