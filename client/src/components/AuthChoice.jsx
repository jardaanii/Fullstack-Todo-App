import React from "react";
import "./Auth.css";

function AuthChoice({ onChoice }) {
  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome</h2>
      <div className="auth-choice-buttons">
        <button className="auth-button" onClick={() => onChoice("signup")}>
          Sign Up
        </button>
        <button className="auth-button" onClick={() => onChoice("signin")}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default AuthChoice;
