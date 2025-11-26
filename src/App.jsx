import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isAdminPage && !isLoginPage && <Navbar />}

      <main
        className="main-container"
        style={{ padding: !isAdminPage && !isLoginPage ? "2rem" : "0" }}
      >
        <AppRoutes />
      </main>

      {!isAdminPage && !isLoginPage && <Footer />}
    </>
  );
}

export default App;
