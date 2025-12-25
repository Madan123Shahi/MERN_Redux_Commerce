import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const [form, setForm] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    const res = await api.post("/auth/login", form);
    login(res.data); // ✅ token handled inside AuthContext
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-xl mb-4">Login</h2>

      <Input
        label="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Input
        label="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Input
        label="Country Code"
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      />
      <Input
        label="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Button onClick={submit}>Login</Button>
    </div>
  );
}
