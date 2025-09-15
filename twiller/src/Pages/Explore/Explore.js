import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Profile from "../Profile/Profile";
import axios from "axios";
import "../pages.css";
import "./Explore.css";

const Explore = () => {
  const query = useRef();
  const [searchResult, setSearchResult] = useState([]);
  const { t } = useTranslation();

  const handleSearch = async (e) => {
    e.preventDefault();
    const queryVal = query.current.value;
    if (!queryVal) return;
    try {
      const res = await axios.get(`http://localhost:5000/search?q=${queryVal}`);
      setSearchResult(res.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page explore">
      <h2 className="pageTitle">{t("explore.title")}</h2>

      <form className="searchBox" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          className="searchInput"
          ref={query}
        />
      </form>

      {searchResult.length > 0 && (
        <div className="searchDropdown">
          <ul>
            {searchResult.map((user) => (
              <li key={user._id}>
                <img
                  src={
                    user.image ||
                    "https://cdn.pixabay.com/photo/2013/07/13/10/44/man-157699_1280.png"
                  }
                  alt={user.username || user.name}
                />
                <div>
                  <strong>{user.name}</strong>
                  <span>@{user.username}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Explore;
