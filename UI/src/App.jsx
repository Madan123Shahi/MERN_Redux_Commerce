import { LoginPage } from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterAdmin";
import Dashboard from "./pages/Dashboard";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
