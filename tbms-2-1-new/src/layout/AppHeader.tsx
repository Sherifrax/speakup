import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../features/common/components/header/ThemeToggleButton";
import UserInfoCard from "../features/common/components/header/UserInfoCard";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { Dropdown } from "../features/common/components/ui/dropdown/Dropdown";
import { ICONS } from "../constants/iconList";
import { ModuleMenu } from "../features/common/types/commonTypes";
import type { NavItem } from "../features/common/types/navigation";

const apiModules: ModuleMenu[] = JSON.parse(localStorage.getItem("menu") || "[]");

// Convert API ModuleMenu[] → NavItem[]
const navItems: NavItem[] = apiModules.map((module) => {
  const legacyMenu = module as unknown as {
    menuName?: string;
    iconName?: string;
    url?: string;
  };

  const subMenuItems = Array.isArray(module.subMenu) ? module.subMenu : [];
  const iconKey = subMenuItems[0]?.iconName || legacyMenu.iconName;
  const defaultPath = subMenuItems[0]?.url || legacyMenu.url;

  return {
    name: module.moduleName || legacyMenu.menuName || "",
    icon: (() => {
      const IconComponent =
        (iconKey && ICONS[iconKey as keyof typeof ICONS]) || ICONS.Grid;
      return <IconComponent />;
    })(),
    path: defaultPath,
    subItems:
      subMenuItems.length > 0
        ? subMenuItems.map((sub) => ({
            name: sub.subMenuName,
            path: sub.url,
          }))
        : undefined,
  };
});

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLaptop, setIsLaptop] = useState(window.innerWidth >= 991);
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<number | null>(null);
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
      // On mobile, toggle the navigation dropdown instead of sidebar
      setIsMobileNavOpen(!isMobileNavOpen);
    }
  };

  useEffect(() => {
    if (!isMobileNavOpen) {
      setMobileOpenSubmenu(null);
    }
  }, [isMobileNavOpen]);

  const toggleMobileSubmenu = (index: number) => {
    setMobileOpenSubmenu(mobileOpenSubmenu === index ? null : index);
  };

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleResize = () => setIsLaptop(window.innerWidth >= 991);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleApplicationMenu = () =>
    setApplicationMenuOpen(!isApplicationMenuOpen);
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
    <header className="sticky top-0 flex w-full bg-transparent border-b-2 border-white shadow-[0_1px_4px_rgba(255,255,255,0.3)] z-[9999] backdrop-blur-none flex-shrink-0">
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
        <div className="relative flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Sidebar Toggle - Top Left on Mobile */}
          <div className="relative">
            <button
              className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-[10000] dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border dropdown-toggle"
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
            
            {/* Mobile Navigation Dropdown */}
            {!isLaptop && (
              <Dropdown
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
                className="w-64 left-0 mt-1"
              >
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 dark:text-gray-400">
                    Menu
                  </div>
                  {navItems.map((item, index) => (
                    <div key={item.name}>
                      {item.subItems ? (
                        <>
                          <button
                            onClick={() => toggleMobileSubmenu(index)}
                            className="flex items-center w-full px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            <span className="flex items-center justify-center w-5 h-5 mr-3 text-gray-500 dark:text-gray-400">
                              {item.icon}
                            </span>
                            <span className="font-medium">{item.name}</span>
                            <svg
                              className={`ml-auto w-4 h-4 transition-transform ${
                                mobileOpenSubmenu === index ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {mobileOpenSubmenu === index && (
                            <div className="bg-gray-50 dark:bg-gray-800/50">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  onClick={() => {
                                    setIsMobileNavOpen(false);
                                    setMobileOpenSubmenu(null);
                                  }}
                                  className={`flex items-center px-4 py-2.5 pl-12 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                    isActive(subItem.path)
                                      ? "bg-brand-50 text-brand-600 border-r-2 border-brand-500 dark:bg-brand-900/20 dark:text-brand-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  <span className="font-medium">{subItem.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        item.path && (
                          <Link
                            to={item.path}
                            onClick={() => setIsMobileNavOpen(false)}
                            className={`flex items-center px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                              isActive(item.path)
                                ? "bg-brand-50 text-brand-600 border-r-2 border-brand-500 dark:bg-brand-900/20 dark:text-brand-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <span className="flex items-center justify-center w-5 h-5 mr-3 text-gray-500 dark:text-gray-400">
                              {item.icon}
                            </span>
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </Dropdown>
            )}
          </div>

          {/* Logo - Centered on Mobile */}
          <Link to="/home" className="lg:hidden absolute left-1/2 transform -translate-x-1/2">
            <img
              className="dark:hidden"
              src="/images/logo/logo-dark.png"
              alt="Logo"
              width={170}
            />
            <img
              className="hidden dark:block"
              src="/images/logo/logo-white.png"
              alt="Logo"
              width={170}
            />
          </Link>

          {/* Application menu button - Top Right on Mobile */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-[10000] hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden ml-auto"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

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
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
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
