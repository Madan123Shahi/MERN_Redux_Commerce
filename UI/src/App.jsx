import { LoginPage } from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterAdmin";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

export default App;
