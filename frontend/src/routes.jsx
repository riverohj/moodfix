import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import AuthScreen from "../pages/AuthScreen";
import Home from "../pages/home";
import Layout from "../pages/layout";

function LayoutRoute({ isAuthenticated }) {
  const navigate = useNavigate();

  return (
    <Layout
      isAuthenticated={isAuthenticated}
      onLogin={() => navigate("/auth")}
      onLogout={() => navigate("/")}
    />
  );
}

export default function AppRoutes({ isAuthenticated = false }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Home />} path="/" />
        </Route>

        <Route element={<AuthScreen />} path="/auth" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
