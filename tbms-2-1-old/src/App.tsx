import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { ReactNode } from "react";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/LoginPage/Login";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ApiRoutes } from "./router/ApiRoutes";
import { SpeakUpRoutes } from "./router/SpeakUpRoutes";
import { useGetDashboardApiCountQuery } from "./services/Dashboard/dashboard.service";

// Enhanced authentication check with token validation
const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  const expiresOn = localStorage.getItem("token_expires_on");
  
  if (!token) return false;
  
  // Check token expiration using stored expires_on timestamp
  if (expiresOn) {
    try {
      const expirationDate = new Date(expiresOn);
      if (expirationDate.getTime() <= Date.now()) {
        // Token has expired, clean up
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("token_expires_on");
        return false;
      }
      return true;
    } catch {
      // If parsing fails, fall back to JWT validation
    }
  }
  
  // Fallback: Check token expiration from JWT payload
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      // Token has expired, clean up
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("token_expires_on");
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// Component to verify authentication before rendering children
const AuthVerifier = ({ children }: { children: ReactNode }) => {
  const { error } = useGetDashboardApiCountQuery(); // Using any API query to check auth
  
  if (error && 'status' in error && error.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("token_expires_on");
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Private Route Wrapper
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <AuthVerifier>{children}</AuthVerifier>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route index path="/home" element={<Home />} />
            {ApiRoutes()}
            {SpeakUpRoutes()}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;