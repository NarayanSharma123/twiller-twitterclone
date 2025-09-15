import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./setting.css";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("idle");
  const [message, setMessage] = useState("");

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "Arabic" },
    { code: "de", label: "Deutsch" },
    { code: "hi", label: "हिन्दी" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "pt", label: "Portugese" },
    { code: "zh", label: "中文" },
    { code: "ja", label: "日本人" },
  ];

  const handleLanguageChange = (code) => {
    if (code === "fr") {
      if (step !== "verified") {
        setStep("email");
        setMessage("French चुनने के लिए Email verify करें।");
        return;
      }
    }

    i18n.changeLanguage(code);
    setOpen(false);
    setMessage(`Language changed to ${code.toUpperCase()}`);
  };

  // send OTP
  const sendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/send-otp", { email });
      if (res.data.success) {
        setStep("otp");
        setMessage("OTP आपके email पर भेजा गया है।");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("OTP भेजने में समस्या आई।");
    }
  };

  // verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp,
      });
      if (res.data.success) {
        setStep("verified");
        setMessage("Email verified! अब आप French चुन सकते हैं।");
        i18n.changeLanguage("fr");
        setOpen(false);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("OTP verification fail हुआ।");
    }
  };

  return (
    <div className="settings-container">
      <h2>{t("settings.title")}</h2>

      <div className="language-row">
        <span className="language-label">{t("settings.language")}</span>

        <div className="language-selector">
          <button className="dropdown-btn" onClick={() => setOpen(!open)}>
            {i18n.language.toUpperCase()}
          </button>

          {open && (
            <div className="dropdown-menu">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="dropdown-item"
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email OTP flow (only when French selected) */}
      {step === "email" && (
        <div className="otp-box">
          <input
            type="email"
            placeholder="अपना email डालें"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="otp-input"
          />
          <button onClick={sendOtp} className="otp-btn">
            Send OTP
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="otp-box">
          <input
            type="text"
            placeholder="OTP डालें"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
          />
          <button onClick={verifyOtp} className="otp-btn">
            Verify OTP
          </button>
        </div>
      )}

      {message && <p className="otp-msg">{message}</p>}
    </div>
  );
};

export default Settings;
