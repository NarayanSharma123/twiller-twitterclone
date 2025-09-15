import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (data.success) {
        alert("OTP verified, login successful!");
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "50px 40px",
          borderRadius: "16px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            color: "#333",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Enter OTP sent to <span style={{ color: "#007bff" }}>{email}</span>
        </h2>

        {error && (
          <p
            style={{
              color: "red",
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleVerify}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            style={{
              padding: "14px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              outline: "none",
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
              transition: "all 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
          <button
            type="submit"
            style={{
              padding: "14px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s",
              boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#0056b3";
              e.target.style.boxShadow = "0 6px 15px rgba(0,86,179,0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#007bff";
              e.target.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)";
            }}
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
