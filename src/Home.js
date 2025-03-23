import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import headerImage from "./images/header.webp";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeSection, setActiveSection] = useState("beranda"); // Default to "beranda"
  const [showAllBooks, setShowAllBooks] = useState(false);

  const sectionsRef = useRef([]);

  useEffect(() => {
    let lastScrollY = window.scrollY; // Simpan posisi scroll sebelumnya

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentScrollY = window.scrollY;

            // Cek apakah scroll ke bawah
            if (currentScrollY > lastScrollY) {
              entry.target.classList.add("fade-in");
            }

            lastScrollY = currentScrollY; // Update posisi scroll terakhir
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    const sections = sectionsRef.current;
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;

      const offsetPosition = elementPosition + window.pageYOffset - 125;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "beranda",
        "recent-book",
        "popular-book",
        "daftar-buku",
        "footer",
      ];
      const scrollPosition = window.scrollY + 50;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offset = element.offsetTop - 100;

          if (
            scrollPosition >= offset &&
            scrollPosition < offset + element.offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const rotateX = (y - 0.5) * 10;
    const rotateY = (x + 0.5) * 10;

    setMousePosition({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://backend-perpus-pcc-class-production.up.railway.app/api/books"
        );
        const result = await response.json();
        if (result.success) {
          setBooks(result.data);
          const popular = result.data.filter((book) => book.isPopular);
          setPopularBooks(popular);
        }
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async () => {
    const query = document.querySelector(".search").value.trim();
    if (query) {
      try {
        const response = await fetch(
          `https://backend-perpus-pcc-class-production.up.railway.app/api/books/search?query=${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) {
          throw new Error("Gagal mengambil data buku");
        }
        const result = await response.json();
        if (result.success) {
          setSearchResults(result.data);
          setIsModalOpen(true);
        } else {
          setSearchResults([]);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
        setSearchResults([]);
        setIsModalOpen(true);
      }
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const recentBooks = books.slice(-4);
  const initialBooksToShow = 4;
  const booksToShow = showAllBooks ? books : books.slice(0, initialBooksToShow);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="sticky top-0 z-10 bg-gray-100 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/web-perpus-pcc-class/"
              className="text-2xl font-bold text-emerald-600 font-montserrat ml-8 md:ml-4"
            >
              Pudigii📚
            </Link>
            <ul
              className={`hidden md:flex space-x-6 items-center ${
                isMenuActive
                  ? "flex flex-col absolute top-16 right-0 w-full bg-gray-100"
                  : ""
              }`}
            >
              <li>
                <a
                  href="/web-perpus-pcc-class/"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("beranda");
                  }}
                  className={`text-emerald-600 hover:text-emerald-700 transition-colors duration-300 ${
                    activeSection === "beranda" ? "font-bold" : ""
                  }`}
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#recent-book"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("recent-book");
                  }}
                  className={`text-emerald-600 hover:text-emerald-700 transition-colors duration-300 ${
                    activeSection === "recent-book" ? "font-bold" : ""
                  }`}
                >
                  Terbaru
                </a>
              </li>
              <li>
                <a
                  href="#popular-book"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("popular-book");
                  }}
                  className={`text-emerald-600 hover:text-emerald-700 transition-colors duration-300 ${
                    activeSection === "popular-book" ? "font-bold" : ""
                  }`}
                >
                  Populer
                </a>
              </li>
              <li>
                <a
                  href="#daftar-buku"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("daftar-buku");
                  }}
                  className={`text-emerald-600 hover:text-emerald-700 transition-colors duration-300 ${
                    activeSection === "daftar-buku" ? "font-bold" : ""
                  }`}
                >
                  Daftar Buku
                </a>
              </li>
              <li>
                <a
                  href="#footer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("footer");
                  }}
                  className={`text-emerald-600 hover:text-emerald-700 transition-colors duration-300 ${
                    activeSection === "footer" ? "font-bold" : ""
                  }`}
                >
                  Kontak
                </a>
              </li>
              <li>
                <Link
                  to="/web-perpus-pcc-class/login"
                  className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700"
                >
                  Login
                </Link>
              </li>
            </ul>
            <button className="md:hidden text-2xl" onClick={toggleMenu}>
              &#9776;
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-0 max-w-full ">
        <section
          id="beranda"
          ref={(el) => (sectionsRef.current[0] = el)}
          className="grid md:grid-cols-2 gap-8 items-center py-12 px-4 pt-20 pb-40 opacity-100 transition-opacity duration-500"
        >
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-4">
              Selamat Datang di Pudigi📚
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Pustaka Digital kita semua, Temukan buku terbaru dan menarik.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                className="search w-full px-4 py-2 border border-emerald-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Masukan Judul..."
              />
              <button
                className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors w-full md:w-auto"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div
              className="relative"
              mousePosition={mousePosition}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={headerImage}
                alt="Ilustrasi Pustaka Digital"
                className="rounded-lg shadow-lg w-[700px] h-[615px] object-cover mx-auto transition-transform duration-200 cursor-pointer hover:rotate-3 hover:scale-105"
              />
            </div>
          </div>
        </section>

        <section
          id="recent-book"
          ref={(el) => (sectionsRef.current[1] = el)}
          className="bg-gray-800 py-16 px-4 opacity-0"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Buku Terbaru
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full">
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="relative h-72 rounded-lg overflow-hidden">
                    <img
                      src={`https://backend-perpus-pcc-class-production.up.railway.app/images/books/${book.imgUrl}`}
                      alt={book.judul}
                      className="w-full h-full object-contain bg-gray-100 hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-white font-medium">{book.judul}</span>
                    <small className="text-gray-300 block">
                      {book.penulis}
                    </small>
                    <div className="flex justify-center items-center gap-1 mt-1">
                      <span className="text-yellow-400">
                        {"⭐".repeat(book.rating)}
                      </span>
                      <span className="text-gray-300">{book.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={(el) => (sectionsRef.current[2] = el)}
          className="py-16 px-4 opacity-0"
        >
          <h2 className="text-3xl font-bold text-emerald-600 text-center mb-8">
            Tentang
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Pudigi adalah sebuah pustaka digital yang melayani peminjaman online
            ataupun offline. Jelajahi jutaan koleksi digital. Dari fiksi hingga
            non-fiksi, kami memiliki segala yang Anda butuhkan untuk memuaskan
            rasa ingin tahu. Temukan buku langka, jurnal ilmiah, dan masih
            banyak lagi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-emerald-600">90k+</h2>
              <p className="text-lg text-gray-600">Judul</p>
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-emerald-600">23k+</h2>
              <p className="text-lg text-gray-600">Kategori</p>
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-emerald-600">10k+</h2>
              <p className="text-lg text-gray-600">Penulis</p>
            </div>
          </div>
        </section>

        <section
          id="popular-book"
          ref={(el) => (sectionsRef.current[3] = el)}
          className="bg-gray-800 py-16 px-4 opacity-0"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Buku Populer
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full">
              {popularBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="relative h-72 rounded-lg overflow-hidden">
                    <img
                      src={`https://backend-perpus-pcc-class-production.up.railway.app/images/books/${book.imgUrl}`}
                      alt={book.judul}
                      className="w-full h-full object-contain bg-gray-100 hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-2">
                    <Link to="#" className="block">
                      <span className="text-white font-medium">
                        {book.judul}
                      </span>
                      <small className="text-gray-300 block">
                        {book.penulis}
                      </small>
                    </Link>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400">
                        {"⭐".repeat(book.rating)}
                      </span>
                      <span className="text-gray-300">{book.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="daftar-buku"
          ref={(el) => (sectionsRef.current[4] = el)}
          className="py-16 px-4 bg-gray-100 opacity-0"
        >
          <h2 className="text-3xl font-bold text-emerald-600 text-center mb-8">
            Daftar Buku
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {booksToShow.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-4">
                  <img
                    src={`https://backend-perpus-pcc-class-production.up.railway.app/images/books/${book.imgUrl}`}
                    alt={book.judul}
                    className="w-full h-48 object-contain"
                  />
                  <h3 className="text-lg font-semibold text-emerald-600 mt-2">
                    {book.judul}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Penulis:</strong> {book.penulis}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Rating:</strong> {"⭐".repeat(book.rating)}
                    <span className="text-gray-800">{book.rating}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol "Selengkapnya" */}
          {!showAllBooks && books.length > initialBooksToShow && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllBooks(true)}
                className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                Selengkapnya
              </button>
            </div>
          )}
        </section>
      </main>

      <footer
        id="footer"
        ref={(el) => (sectionsRef.current[5] = el)}
        className="fade-in-up bg-footer bg-gray-800 rounded opacity-0"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 text-white sm:px-6 lg:px-8">
          <a
            className="hover:text-tb-cyan duration-300"
            href="https://www.ukmpcc.org/"
          >
            <p className="text-center text-xl font-bold">Pudigi</p>
          </a>
          <p className="mx-auto mt-2 max-w-md text-center leading-relaxed mb-10">
            Pustaka digital. Jelajahi jutaan koleksi digital. Dari fiksi hingga
            non-fiksi.
          </p>
          <p className="text-xl mt-4 font-bold text-center">Tentang</p>
          <p className="mx-auto mt-2 max-w-md text-center leading-relaxed mb-10">
            Pudigi adalah sebuah pustaka digital yang melayani peminjaman online
            ataupun offline. Jelajahi jutaan koleksi digital. Dari fiksi hingga
            non-fiksi, kami memiliki segala yang Anda butuhkan untuk memuaskan
            rasa ingin tahu. Temukan buku langka, jurnal ilmiah, dan masih
            banyak lagi.
          </p>
          <p className="text-center mt-4 text-xl font-bold">Hubungi Kami</p>
          <p className="mx-auto mt-2 max-w-md text-center leading-relaxed">
            JL PLN No. 21 Jerakah Semarang
          </p>
          <p className="mx-auto max-w-md text-center leading-relaxed">
            085728141488
          </p>
          <p className="mx-auto max-w-md text-center leading-relaxed mb-10">
            pudigi@gmail.com
          </p>
          <p className="text-center text-xl font-bold">Sosial Media Kami</p>
          <ul className="mt-6 flex justify-center gap-6 md:gap-8">
            <li>
              <a
                href="https://wa.me/6285728141488/"
                rel="noreferrer"
                target="_blank"
                className="text-white transition hover:text-teal-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/algaray_02/"
                rel="noreferrer"
                target="_blank"
                className="text-white transition hover:text-orange-600"
              >
                <svg
                  className="size-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://x.com/alpinee_02"
                rel="noreferrer"
                target="_blank"
                className="text-white transition hover:text-blue-400"
              >
                <svg
                  className="size-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Algaray02"
                rel="noreferrer"
                target="_blank"
                className="text-white transition hover:text-purple-800"
              >
                <svg
                  className="size-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
            <button
              className="float-right text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <div className="mt-4">
              {selectedBook ? (
                <div className="flex gap-6">
                  <div className="w-48 h-72 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={`https://backend-perpus-pcc-class-production.up.railway.app/images/books/${selectedBook.imgUrl}`}
                      alt={selectedBook.judul}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">
                      {selectedBook.judul}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Penulis:</strong> {selectedBook.penulis}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Rating:</strong> {selectedBook.rating}
                    </p>
                    <p className="text-gray-600 text-justify">
                      {selectedBook.description}
                    </p>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((book) => (
                  <div key={book.id} className="flex gap-6 mb-6">
                    <div className="w-48 h-72 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={`https://backend-perpus-pcc-class-production.up.railway.app/images/books/${book.imgUrl}`}
                        alt={book.judul}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-4">{book.judul}</h3>
                      <p className="text-gray-600 mb-2">
                        <strong>Penulis:</strong> {book.penulis}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <strong>Rating:</strong> {book.rating}
                      </p>
                      <p className="text-gray-600 text-justify">
                        {book.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  Tidak ada buku yang ditemukan.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
