import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./forgot-password.css";
import TwitterIcon from "@mui/icons-material/Twitter";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleForgatPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.warn(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="forgotPassword">
      <div className="forgotPassword-container">
        <div className="twillerIcon">
          <TwitterIcon style={{ color: "skyblue", fontSize: "30px" }} />
        </div>
        <h2>{t("ForgotPassword.title")}</h2>
        <p>{t("ForgotPassword.description")}</p>

        <form onSubmit={handleForgatPassword}>
          <input
            type="email"
            className="resetToEmail"
            placeholder={t("ForgotPassword.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="resetBtns">
            <button
              type="submit"
              className="resetNext"
              disabled={email.length === 0}
              style={{
                color: "white",
                background: email.length === 0 ? "#bbbbbb" : "black",
              }}
            >
              {t("ForgotPassword.reset_button")}
            </button>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              {t("ForgotPassword.return_login")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
