import React from "react";
import "../components/style.css";

const Signup = () => {
  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-left">
          <img src={require("../assets/logo.png")} alt="logo" width="70%" />
          <h1 className="signup-left-heading">Saikrishna Institute Classes</h1>
          <p className="signup-left-para">
            Manage Your all data in easy way...
          </p>
        </div>
        <div className="signup-right">
          <hr />
          <form className="signup-form">
          <h1>Create Your Account</h1>

            <input type="text" placeholder="Institute Name" />
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Phone" />
            <input type="text" placeholder="Password" />
            <button type="submit" className="signup-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
