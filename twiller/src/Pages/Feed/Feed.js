import React, { useEffect, useState } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import { useTranslation } from "react-i18next";
import Tweetbox from "./Tweetbox/Tweetbox";
import useLoggedinuser from "../../hooks/useLoggedinuser";
const Feed = () => {
  const [post, setpost] = useState([]);
  const [loggedInUser, setLoggedInUser] = useLoggedinuser();
  const { t } = useTranslation();

  useEffect(() => {
    fetch("http://localhost:5000/post")
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
        console.log(data);
      });
  }, []);
  return (
    <div className="feed">
      <div className="feed__header">
        <h2>{t("feed.home")}</h2>
      </div>
      <Tweetbox
        loggedInUser={loggedInUser}
        onNewPost={(newPost) => setpost([newPost, ...post])}
      />
      {post.map((p) => (
        <Posts key={p._id} p={p} loggedInUser={loggedInUser} />
      ))}
    </div>
  );
};

export default Feed;
