import React, { useState } from "react";
import { useLoginUserMutation } from "../../services/authApi";
import { useLazyGetProfileQuery } from "../../services/Common/profileGet";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file for styling
import logo from "../../../public/images/logo-dark.png"; // Adjust the path for your logo
import PageMeta from "../../features/common/components/page/PageMeta";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [triggerProfile] = useLazyGetProfileQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.clear();
      const response = await loginUser({ username, password }).unwrap();
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("username", response.username);
      localStorage.setItem("email", response.email);
      localStorage.setItem("AD", "false");

      const profileResponse = await triggerProfile().unwrap();
      if (profileResponse) {
        // Save Module Name
        if (profileResponse.moduleName) {
          localStorage.setItem("ModuleName", profileResponse.moduleName);
        }

        // Save Profile Object
        if (profileResponse.profile) {
          localStorage.setItem(
            "profile",
            JSON.stringify(profileResponse.profile)
          );
        }

        // Save Menu Array
        if (profileResponse.menu && Array.isArray(profileResponse.menu)) {
          localStorage.setItem("menu", JSON.stringify(profileResponse.menu));
        }
      }

      navigate("/home");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <PageMeta title="Login" description="" />
      <div className="login-container">
        <div className="login-box">
          <img src={logo} alt="Logo" className="login-logo" />
          <form onSubmit={handleSubmit} className="login-form">
            <h3 className="login-title">Login</h3>
            {error && <div className="login-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? <div className="spinner"></div> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
