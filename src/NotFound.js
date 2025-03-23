import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-emerald-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
      <Link
        to="/"
        className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
