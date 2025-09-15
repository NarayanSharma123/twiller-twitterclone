import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import "./login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [password, setPassword] = useState("");
  const { signUp, googleSignIn } = useUserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);

      const user = {
        username,
        name,
        email,
        phone,
      };

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (data.acknowledged) {
        console.log("User registered in backend:", data);
        navigate("/");
      } else {
        setError("User registration failed on backend.");
      }
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/login");
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  };

  const handleShowPassword = () => {
    if (!showPassword) {
      setShowPassword(true);
      setPasswordType("text");
    } else {
      setShowPassword(false);
      setPasswordType("password");
    }
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img className="image" src={twitterimg} alt="twitter" />
      </div>
      <div className="form-container">
        <div>
          <TwitterIcon style={{ color: "skyblue" }} />
          <h2 className="heading">{t("signup.title")}</h2>
          <h3 className="heading1">{t("signup.subtitle")}</h3>

          {error && <p className="errorMessage">{error.message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              className="display-name"
              type="text"
              placeholder={t("signup.usernamePlaceholder")}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="display-name"
              type="text"
              placeholder={t("signup.fullnamePlaceholder")}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="email"
              type="email"
              placeholder={t("signup.emailPlaceholder")}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <input
                className="password"
                type={passwordType}
                placeholder={t("signup.passwordPlaceholder")}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="show-hide-toggler" onClick={handleShowPassword}>
                {showPassword
                  ? t("signup.hidePassword")
                  : t("signup.showPassword")}
              </p>
            </div>
            <div className="btn-login">
              <button type="submit" className="btn">
                {t("signup.button")}
              </button>
            </div>
          </form>

          <hr />

          <div className="google-button">
            <GoogleButton
              className="g-btn"
              type="light"
              onClick={handleGoogleSignIn}
            />
          </div>

          <div>
            {t("signup.alreadyHaveAccount")}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              {t("signup.loginLink")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
