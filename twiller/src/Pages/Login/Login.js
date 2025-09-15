import React, { useState } from "react";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import "react-phone-input-2/lib/style.css";
import GoogleButton from "react-google-button";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { useUserAuth } from "../../context/UserAuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();
  const { googleSignIn, logIn } = useUserAuth();
  const { t } = useTranslation();

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      const result = await logIn(email, password);
      const user = result.user;

      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      console.log("Backend /login response:", data);

      if (data.message === "OTP sent to your email") {
        navigate("/verify-otp", { state: { email: user.email } });
      } else if (data.success) {
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      seterror(error.message);
      window.alert(error.message);
      console.log(error);
    }
  };

  const hanglegooglesignin = async (e) => {
    e.preventDefault();
    try {
      const result = await googleSignIn();
      const { email, displayName, photoURL } = result.user;

      const regRes = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: displayName,
          image: photoURL,
          joinedOn: new Date(),
        }),
      });

      const regData = await regRes.json();
      console.log("Register response:", regData);

      const loginRes = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const loginData = await loginRes.json();
      console.log("Backend /login response:", loginData);

      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    setPasswordType(showPassword ? "password" : "text");
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img src={twitterimg} className="image" alt="twitterimg" />
      </div>
      <div className="form-container">
        <div className="form-box">
          <TwitterIcon style={{ color: "skyblue" }} />
          <h2 className="heading">{t("login.title")}</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handlesubmit}>
            <input
              type="email"
              className="email"
              placeholder={t("login.emailPlaceholder")}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <input
                type={passwordType}
                className="password"
                placeholder={t("login.passwordPlaceholder")}
                onChange={(e) => setpassword(e.target.value)}
              />
              <p className="show-hide-toggler" onClick={handleShowPassword}>
                {showPassword
                  ? t("login.hidePassword")
                  : t("login.showPassword")}
              </p>
            </div>
            <div className="btn-login">
              <button type="submit" className="btn">
                {t("login.button")}
              </button>
              <div className="forgot-password">
                <Link className="resetLink" to="/forgot-password">
                  <p>{t("login.resetPassword")}</p>
                </Link>
              </div>
            </div>
          </form>

          <hr />
          <br />
          <div className="google">
            <GoogleButton
              className="g-btn"
              type="light"
              onClick={hanglegooglesignin}
            />
          </div>
        </div>
        <br />

        <div className="signupLink">
          {t("login.dontHaveAccount")}
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "var(--twitter-color)",
              fontWeight: "600",
              marginLeft: "5px",
            }}
          >
            {t("login.signupLink")}
          </Link>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Login;
