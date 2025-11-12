import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../features/common/components/header/ThemeToggleButton";
import UserInfoCard from "../features/common/components/header/UserInfoCard";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLaptop, setIsLaptop] = useState(window.innerWidth >= 991);
  const location = useLocation();

  const [moduleName, setModuleName] = useState("TBMS");
  // Fetch module name from localStorage
  useEffect(() => {
    const storedModuleName = localStorage.getItem("ModuleName");
    if (storedModuleName && storedModuleName.trim() !== "") {
      setModuleName(storedModuleName);
    }
  }, []);

  const { isExpanded, toggleSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      setIsMobileNavOpen(!isMobileNavOpen);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsLaptop(window.innerWidth >= 991);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleApplicationMenu = () =>
    setApplicationMenuOpen(!isApplicationMenuOpen);
  const isActive = (path: string) => location.pathname === path;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className="
        sticky top-0 z-[50] w-full 
        bg-transparent backdrop-blur-none 
        border-r-[1px] border-[#C0C0C0] 
        shadow-[6px_6px_12px_rgba(0,0,0,0.05),_-6px_-6px_12px_rgba(255,255,255,0.7)]
        transition-all duration-300
      "
    >
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:justify-normal lg:px-0 lg:py-4">
          {/* Sidebar Toggle */}
          <div className="relative">
            <button
              className="items-center justify-center w-10 h-10 text-gray-600 rounded-lg bg-transparent border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isLaptop ? (
                isExpanded ? (
                  <LuArrowLeftToLine />
                ) : (
                  <LuArrowRightToLine />
                )
              ) : (
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Logo + Mobile 3-dot menu */}
          <div className="flex items-center gap-2 lg:hidden relative">
            <Link to="/home">
              <img
                className="dark:hidden"
                src="./images/logo/logo-dark.png"
                alt="Logo"
                width={170}
              />
              <img
                className="hidden dark:block"
                src="./images/logo/logo-white.png"
                alt="Logo"
                width={170}
              />
            </Link>

            {/* Vertical 3-dot menu button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Open mobile menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="4" r="2" />
                <circle cx="10" cy="10" r="2" />
                <circle cx="10" cy="16" r="2" />
              </svg>
            </button>

            {/* Mobile User Dropdown */}
            {isMobileNavOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-lg z-50 border border-gray-200 dark:border-gray-700 py-2">
                {/* Profile Picture */}
                <div className="flex justify-center py-2">
                  <UserInfoCard showOnlyAvatar />
                </div>
                {/* Name */}
                <div className="text-center font-medium text-gray-800 dark:text-gray-200 py-1">
                  <UserInfoCard showOnlyName />
                </div>
                {/* Theme Toggle */}
                <div className="flex justify-center py-2 border-t border-gray-100 dark:border-gray-700">
                  <ThemeToggleButton />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Logo / Title */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {moduleName}
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <ThemeToggleButton />
          </div>
          <UserInfoCard />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
