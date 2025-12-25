import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Welcome</h1>

      <div className="space-x-4">
        <Link to="/login" className="bg-black text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link to="/register" className="border px-4 py-2 rounded">
          Register
        </Link>
      </div>
    </div>
  );
}
