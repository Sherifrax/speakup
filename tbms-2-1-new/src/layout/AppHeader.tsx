import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../features/common/components/header/ThemeToggleButton";
import UserInfoCard from "../features/common/components/header/UserInfoCard";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { Dropdown } from "../features/common/components/ui/dropdown/Dropdown";
import { ICONS } from "../constants/iconList";
import { ModuleMenu } from "../features/common/types/commonTypes";
import type { NavItem } from "../features/common/types/navigation";
import { ReactComponent as AppsIcon } from "../assets/icons/additional/widgets.svg?react";

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
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLaptop, setIsLaptop] = useState(window.innerWidth >= 991);
  const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState<number | null>(null);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [moduleName, setModuleName] = useState("TBMS");
  // Fetch module name from localStorage or fall back to first module from API
  useEffect(() => {
    const storedModuleName = localStorage.getItem("ModuleName");
    if (storedModuleName && storedModuleName.trim() !== "") {
      setModuleName(storedModuleName);
      return;
    }

    if (apiModules.length > 0) {
      const firstModule = apiModules[0] as unknown as {
        moduleName?: string;
        menuName?: string;
      };
      const name = firstModule.moduleName || firstModule.menuName;
      if (name && name.trim() !== "") {
        setModuleName(name);
      }
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

  const toggleAppsMenu = () => setIsAppsMenuOpen((prev) => !prev);
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
    <header className="sticky top-0 flex w-full bg-transparent border-b border-white shadow-none lg:shadow-[0_1px_4px_rgba(255,255,255,0.3)] z-[9999] flex-shrink-0 lg:h-[102px]">
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6 lg:h-[102px] w-full">
        <div className="relative flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-0">
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

          {/* Mobile 3-dot menu button - Top Right */}
          <button
            onClick={() => setIsMobileProfileMenuOpen(!isMobileProfileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Profile Menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="4" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="10" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </button>

          {/* Desktop Logo / Title */}
          <div className="hidden lg:block">
            <h1 className="app-header__title">
              {moduleName}
            </h1>
          </div>
        </div>

        {/* Right Section - theme, user info, and apps menu */}
        <div
          className={`flex items-center justify-end w-full gap-6 px-4 py-0 lg:px-0 min-h-[102px] ${
            !isLaptop && !isMobileProfileMenuOpen ? "hidden" : ""
          }`}
        >
          {/* Theme / user area */}
          <div className="flex items-center gap-2 2xsm:gap-3 h-full transition-all duration-300">
            <ThemeToggleButton />
            <UserInfoCard />
          </div>

          {/* Apps container - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex items-center justify-center app-header__apps-container">
            {/* Top-right applications menu showing modules from API profile */}
            <div className="relative flex items-center justify-center w-full">
              <button
                onClick={toggleAppsMenu}
                className={`dropdown-toggle flex items-center justify-center h-[48px] lg:min-w-fit lg:max-w-[220px] px-3 rounded-lg font-medium text-sm cursor-pointer transition-all hover:opacity-90 trojan-neumorphism-box trojan-neumorphism-box-shadow ${isAppsMenuOpen ? 'active' : ''}`}
                style={{ padding: "0 8px" }}
                aria-label="Open applications menu"
              >
                <span className="mr-3 text-gray-800 dark:text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] text-xs">
                  {moduleName}
                </span>
                {/* Widgets/grid icon - size aligned with WEBUI */}
                <AppsIcon className="w-6 h-6 text-gray-800 dark:text-gray-200 flex-shrink-0" />
              </button>

              <Dropdown
                isOpen={isAppsMenuOpen}
                onClose={() => setIsAppsMenuOpen(false)}
                className="w-[335px] max-w-[calc(100vw-2rem)] sm:max-w-[335px]"
                placement="auto"
              >
                <div className="py-2">
                  <div className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 dark:text-gray-400">
                    Applications
                  </div>
                  {navItems.map((item, index) => {
                    const isModuleActive = item.name === moduleName;

                    return (
                      <div key={item.name}>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.path) {
                              localStorage.setItem("ModuleName", item.name);
                              setModuleName(item.name);
                              setIsAppsMenuOpen(false);
                              navigate(item.path);
                            }
                          }}
                          className={`flex w-full items-center justify-between px-6 py-4 h-[54px] text-sm font-medium transition-colors ${
                            isModuleActive
                              ? "text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <span className="mr-3 flex h-5 w-5 items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
                              {item.icon}
                            </span>
                            <span className="font-medium text-left flex-1 truncate">
                              {item.name}
                            </span>
                          </div>
                          {isModuleActive && (
                            <svg
                              className="w-5 h-5 text-brand-500 dark:text-brand-400 flex-shrink-0 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                        {index < navItems.length - 1 && (
                          <div className="mx-6 border-b border-gray-100 dark:border-gray-700" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
