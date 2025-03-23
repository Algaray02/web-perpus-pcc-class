import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    judul: "",
    penulis: "",
    description: "",
    rating: 0,
    isPopular: false,
    imgUrl: "",
  });
  const [editBook, setEditBook] = useState(null);
  const navigate = useNavigate();
  const [imgFile, setImgFile] = useState(null);
  const fileInputRef = useRef(null); // Add this line to create a reference

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "http://backend-perpus-pcc-class-production.up.railway.app/api/books"
      );
      setBooks(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    }
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:3000/api/logout");
    navigate("/web-perpus-pcc-class/login");
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(
        `http://backend-perpus-pcc-class-production.up.railway.app/api/books/${id}`
      );
      fetchBooks();
    } catch (error) {
      console.error("Gagal menghapus buku:", error);
    }
  };

  const handleFileChange = (e) => {
    setImgFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (imgFile) {
      const formData = new FormData();
      formData.append("imgUrl", imgFile);

      try {
        const response = await axios.post(
          "http://backend-perpus-pcc-class-production.up.railway.app/api/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.imgUrl;
      } catch (error) {
        console.error("Gagal mengunggah gambar:", error);
        return null;
      }
    }
    return null;
  };

  const resetFileInput = () => {
    // Reset the file input element
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImgFile(null);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const uploadedImgUrl = await uploadImage();
      if (!uploadedImgUrl) {
        alert("Gagal mengunggah gambar");
        return;
      }

      const bookData = {
        ...newBook,
        imgUrl: uploadedImgUrl,
      };

      await axios.post(
        "http://backend-perpus-pcc-class-production.up.railway.app/api/books",
        bookData
      );
      setNewBook({
        judul: "",
        penulis: "",
        description: "",
        rating: 0,
        isPopular: false,
        imgUrl: "",
      });
      resetFileInput(); // Reset file input after successful upload
      fetchBooks();
    } catch (error) {
      console.error("Gagal menambahkan buku:", error);
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      const uploadedImgUrl = await uploadImage();
      if (!uploadedImgUrl && !editBook.imgUrl) {
        alert("Gagal mengunggah gambar");
        return;
      }

      const bookData = {
        judul: editBook.judul,
        penulis: editBook.penulis,
        description: editBook.description,
        rating: editBook.rating,
        isPopular: editBook.isPopular,
        imgUrl: uploadedImgUrl || editBook.imgUrl,
      };

      await axios.put(
        `http://backend-perpus-pcc-class-production.up.railway.app/api/books/${editBook.id}`,
        bookData
      );
      setEditBook(null);
      resetFileInput(); // Reset file input after successful edit
      fetchBooks();
    } catch (error) {
      console.error("Gagal mengedit buku:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-600">Halaman Admin</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-emerald-600 mb-4">
          {editBook ? "Edit Buku" : "Tambah Buku"}
        </h3>
        <form onSubmit={editBook ? handleEditBook : handleAddBook}>
          <input
            type="text"
            placeholder="Judul"
            value={editBook ? editBook.judul : newBook.judul}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, judul: e.target.value })
                : setNewBook({ ...newBook, judul: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            required
          />
          <input
            type="text"
            placeholder="Penulis"
            value={editBook ? editBook.penulis : newBook.penulis}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, penulis: e.target.value })
                : setNewBook({ ...newBook, penulis: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            required
          />
          <textarea
            placeholder="Deskripsi"
            value={editBook ? editBook.description : newBook.description}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, description: e.target.value })
                : setNewBook({ ...newBook, description: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            required
          />
          <input
            type="number"
            placeholder="Rating"
            value={editBook ? editBook.rating : newBook.rating}
            onChange={(e) => {
              const value = e.target.value.replace(",", ".");
              const floatValue = parseFloat(value);

              if (editBook) {
                setEditBook({
                  ...editBook,
                  rating: isNaN(floatValue) ? "" : floatValue,
                });
              } else {
                setNewBook({
                  ...newBook,
                  rating: isNaN(floatValue) ? "" : floatValue,
                });
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            min="1"
            max="5"
            step="0.1"
            required
          />
          <label className="block mb-4">
            Unggah Gambar:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef} // Add this reference
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
          <label className="flex items-center mb-4">
            <span className="mr-2">Apakah Buku Populer?</span>
            <input
              type="checkbox"
              checked={editBook ? editBook.isPopular : newBook.isPopular}
              onChange={(e) =>
                editBook
                  ? setEditBook({ ...editBook, isPopular: e.target.checked })
                  : setNewBook({ ...newBook, isPopular: e.target.checked })
              }
              className="form-checkbox h-5 w-5 text-emerald-600"
            />
          </label>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            {editBook ? "Update" : "Tambah"}
          </button>
          {editBook && (
            <button
              type="button"
              onClick={() => {
                setEditBook(null);
                resetFileInput(); // Reset file input when canceling edit
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2"
            >
              Batal
            </button>
          )}
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={`http://backend-perpus-pcc-class-production.up.railway.app/images/books/${book.imgUrl}`}
              alt={book.judul}
              className="w-full h-48 object-contain rounded-md mb-4"
            />
            <h3 className="text-xl font-bold text-emerald-600">{book.judul}</h3>
            <p className="text-gray-600">{book.penulis}</p>
            <div className="text-yellow-400">
              {"⭐".repeat(book.rating)} ({book.rating})
            </div>
            <div className="flex mt-4">
              <button
                onClick={() => setEditBook(book)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBook(book.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
