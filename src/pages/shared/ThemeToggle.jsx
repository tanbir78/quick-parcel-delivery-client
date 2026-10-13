import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleThemeChange = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <button
            onClick={handleThemeChange}
            className="btn btn-circle btn-ghost"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <FaMoon className="text-lg" />
            ) : (
                <FaSun className="text-lg" />
            )}
        </button>
    );
};

export default ThemeToggle;