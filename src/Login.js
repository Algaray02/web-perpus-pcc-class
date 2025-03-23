import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const usernameRef = useRef(null); // Ref untuk input username

  const handleLogin = async (e) => {
    e.preventDefault(); // Pastikan ini ada
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      if (response.data.success) {
        navigate("/admin");
      }
    } catch (error) {
      alert("Username atau password salah");
      console.error("Gagal login:", error);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">
          Login Admin
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              ref={usernameRef} // Menambahkan ref ke input username
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Login
          </button>
          <a
            href="/"
            className="block text-center mt-4 text-emerald-600 hover:text-emerald-700 transition-colors text-sm hover:underline"
          >
            Kembali
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
