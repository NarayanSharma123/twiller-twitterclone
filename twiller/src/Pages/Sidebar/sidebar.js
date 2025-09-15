import React, { useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from "@mui/material/Divider";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./sidebar.css";
import Customlink from "./Customlink";
import Sidebaroption from "./Sidebaroption";
import { useNavigate } from "react-router-dom";
import useLoggedinuser from "../../hooks/useLoggedinuser";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const Sidebar = ({ handlelogout, user }) => {
  const { t } = useTranslation();
  const [anchorE1, setanchorE1] = useState(null);
  const openmenu = Boolean(anchorE1);
  const [loggedinuser] = useLoggedinuser();
  const navigate = useNavigate();

  const handleclick = (e) => {
    setanchorE1(e.currentTarget);
  };

  const handleclose = () => {
    setanchorE1(null);
  };

  const result = user?.email?.split("@")[0];

  return (
    <div className="sidebar">
      <TwitterIcon className="sidebar__twitterIcon" />
      <Customlink to="/home/feed">
        <Sidebaroption active Icon={HomeIcon} text={`${t("sidebar.home")} `} />
      </Customlink>
      <Customlink to="/home/explore">
        <Sidebaroption Icon={SearchIcon} text={t("sidebar.explore")} />
      </Customlink>
      <Customlink to="/home/notification">
        <Sidebaroption
          Icon={NotificationsNoneIcon}
          text={t("sidebar.notifications")}
        />
      </Customlink>
      <Customlink to="/home/messages">
        <Sidebaroption Icon={MailOutlineIcon} text={t("sidebar.messages")} />
      </Customlink>
      <Customlink to="/home/bookmarks">
        <Sidebaroption
          Icon={BookmarkBorderIcon}
          text={t("sidebar.bookmarks")}
        />
      </Customlink>
      <Customlink to="/home/lists">
        <Sidebaroption Icon={ListAltIcon} text={t("sidebar.lists")} />
      </Customlink>
      <Customlink to={`/home/profile/${loggedinuser[0]?._id || user?.uid}`}>
        <Sidebaroption Icon={PermIdentityIcon} text={t("sidebar.profile")} />
      </Customlink>
      <Customlink to="/home/more">
        <Sidebaroption Icon={MoreIcon} text={t("sidebar.more")} />
      </Customlink>
      <Button variant="outlined" className="sidebar__tweet" fullWidth>
        {t("sidebar.tweet")}
      </Button>

      <div className="Profile__info">
        <Avatar
          src={
            loggedinuser[0]?.profileImage
              ? loggedinuser[0].profileImage
              : user && user.photoURL
          }
        />
        <div className="user__info">
          <h4>
            {loggedinuser[0]?.name
              ? loggedinuser[0].name
              : user && user.displayName}
          </h4>
          <h5>@{result}</h5>
        </div>
        <IconButton
          size="small"
          sx={{ ml: 2 }}
          aria-controls={openmenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-valuetext={openmenu ? "true" : undefined}
          onClick={handleclick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorE1}
          open={openmenu}
          onClick={handleclose}
          onClose={handleclose}
        >
          <MenuItem
            className="Profile__info1"
            onClick={() =>
              navigate(`/home/profile/${loggedinuser[0]?._id || user?.uid}`)
            }
          >
            <Avatar
              src={
                loggedinuser[0]?.profileImage
                  ? loggedinuser[0]?.profileImage
                  : user && user.photoURL
              }
            />
            <div className="user__info subUser__info">
              <div>
                <h4>
                  {loggedinuser[0]?.name
                    ? loggedinuser[0].name
                    : user && user.displayName}
                </h4>
                <h5>@{result}</h5>
              </div>
              <ListItemIcon className="done__icon" color="blue">
                <DoneIcon />
              </ListItemIcon>
            </div>
          </MenuItem>
          <Divider />

          <Customlink to="/home/settings">
            <MenuItem>
              <SettingsIcon style={{ color: "gray", fontWeight: "bold" }} />
              &nbsp; {t("sidebar.menu.settings")}
            </MenuItem>
          </Customlink>

          <MenuItem onClick={handleclose}>
            <PersonAddAltIcon style={{ color: "blue", fontWeight: "bold" }} />
            &nbsp; {t("sidebar.menu.addAccount")}
          </MenuItem>
          <MenuItem onClick={handlelogout}>
            <LogoutIcon style={{ color: "red", fontWeight: "bold" }} />
            &nbsp; {t("sidebar.menu.logout")} @{result}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
