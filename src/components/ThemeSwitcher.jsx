import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState("retro");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "retro";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="dropdown dropdown-end">
      
      {/* Trigger Button */}
      <div
        tabIndex={0}
        role="button"
        className="
          btn btn-ghost btn-circle
          transition-all duration-300
          hover:scale-110
          active:scale-95
          hover:rotate-12
        "
      >
        <span
          className="
            text-xl
            transition-transform duration-500
            animate-spin-slow
          "
        >
          {theme === "retro" && "☀️"}
          {theme === "dark" && "🌙"}
          {theme === "valentine" && "❤️"}
        </span>
      </div>

      {/* Dropdown Menu */}
      <ul
        tabIndex={0}
        className="
          dropdown-content z-[1] menu p-2 shadow-xl
          bg-base-200 rounded-2xl w-44
          backdrop-blur-md
          transition-all duration-300
        "
      >
        <li>
          <button
            onClick={() => changeTheme("retro")}
            className="hover:scale-105 transition"
          >
            ☀️ Retro
          </button>
        </li>

        <li>
          <button
            onClick={() => changeTheme("dark")}
            className="hover:scale-105 transition"
          >
            🌙 Dark
          </button>
        </li>

        <li>
          <button
            onClick={() => changeTheme("valentine")}
            className="hover:scale-105 transition"
          >
            ❤️ Valentine
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ThemeSwitcher;
