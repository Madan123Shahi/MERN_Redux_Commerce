import { Routes, Route } from "react-router-dom";

import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import MainLayout from "./layouts/Mainlayout";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      {/* 🌍 Layout route */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default App;
