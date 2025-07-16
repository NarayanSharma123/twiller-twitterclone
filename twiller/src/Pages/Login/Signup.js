import React, { useState } from "react";
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
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Firebase Auth Signup
      await signUp(email, password);

      // Backend me user send karna
      const user = {
        username,
        name,
        email,
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
      navigate("/");
    } catch (err) {
      console.log(err.message);
      setError(err.message);
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
          <h2 className="heading">Happening now</h2>
          <h3 className="heading1">Join Twiller today</h3>

          {error && <p className="errorMessage">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              className="display-name"
              type="text"
              placeholder="@username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="display-name"
              type="text"
              placeholder="Enter Full Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="email"
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="btn-login">
              <button type="submit" className="btn">
                Sign Up
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
            Already have an account?
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
