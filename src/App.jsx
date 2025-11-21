import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";


function App() {
  return (
    <>
      <Navbar />
      <main className="main-container">
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

export default App;
