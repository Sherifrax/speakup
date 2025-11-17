import { useState, useEffect, useCallback } from "react";
import { FiHash, FiMail, FiUser } from "react-icons/fi";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useGetProfileQuery } from "../../../../services/Common/profileGet";

interface UserInfoCardProps {
  showOnlyAvatar?: boolean;
  showOnlyName?: boolean;
}

type ProfileSource = Record<string, unknown> | null;

const extractProfileValue = (profile: ProfileSource, keys: string[]) => {
  if (!profile) return undefined;

  for (const key of keys) {
    const value = profile[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return undefined;
};

const buildPhotoSrc = (photoStr: string) => {
  const trimmed = photoStr.trim();

  if (trimmed.startsWith("/9j/") || trimmed.startsWith("iVBOR")) {
    return `data:image/jpeg;base64,${trimmed}`;
  }

  if (trimmed.startsWith("data:image")) {
    return trimmed;
  }

  return trimmed;
};

export default function UserInfoCard({
  showOnlyAvatar,
  showOnlyName,
}: UserInfoCardProps) {
  const [name, setName] = useState("Guest");
  const [photo, setPhoto] = useState("/images/avatar.jpg");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    data: profileData,
    isFetching: isProfileLoading,
  } = useGetProfileQuery();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedProfileRaw = localStorage.getItem("profile");
    let storedProfile: ProfileSource = null;

    if (storedProfileRaw) {
      try {
        storedProfile = JSON.parse(storedProfileRaw);
      } catch (err) {
        console.error("Error parsing profile data:", err);
      }
    }

    if (profileData?.profile) {
      try {
        localStorage.setItem("profile", JSON.stringify(profileData.profile));
      } catch (err) {
        console.warn("Unable to cache profile data:", err);
      }
    }

    const profile: ProfileSource =
      (profileData?.profile as ProfileSource) ?? storedProfile;

    const resolvedName =
      extractProfileValue(profile, ["employeeName", "EmployeeName"]) ||
      storedUsername ||
      "Guest";
    const resolvedEmail =
      extractProfileValue(profile, ["email", "Email"]) || "";
    const resolvedEmployeeId =
      extractProfileValue(profile, [
        "employeeId",
        "EmployeeId",
        "employeeID",
        "EmployeeID",
        "employeeCode",
        "EmployeeCode",
        "employeeNumber",
        "EmployeeNumber",
        "employeeNo",
        "EmployeeNo",
        "userId",
        "UserId",
      ]) || storedUsername;
    const resolvedPhoto = extractProfileValue(profile, [
      "profilePhoto",
      "ProfilePhoto",
    ]);

    setName(resolvedName);
    setEmail(resolvedEmail);
    setEmployeeId(resolvedEmployeeId || "");

    if (resolvedPhoto) {
      setPhoto(buildPhotoSrc(resolvedPhoto));
    } else if (!profile) {
      setPhoto("/images/avatar.jpg");
    }
  }, [profileData]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // ✅ Truncate name to 15 characters
  const truncatedName =
    name.length > 15 ? `${name.substring(0, 15)}...` : name;

  // 🔹 Avatar only
  if (showOnlyAvatar) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        <img
          src={photo}
          alt="User"
          className="relative w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-md ring-2 ring-gray-100 dark:ring-gray-800 transition-all duration-300 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 group-hover:scale-105"
          title={name}
        />
      </div>
    );
  }

  // 🔹 Name only
  if (showOnlyName) {
    return (
      <span
        className="font-semibold text-gray-800 dark:text-gray-100 text-sm transition-colors duration-200"
        title={name}
      >
        {truncatedName}
      </span>
    );
  }

  // 🔹 Avatar + Name (default)
  return (
    <div className="relative" title={name}>
      <button
        type="button"
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        className="
          dropdown-toggle group relative flex items-center gap-3 px-4 py-2.5
          bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-md
          dark:bg-gray-800/90 dark:border-gray-700/80 dark:text-gray-200
          hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600
          transition-all duration-300 ease-in-out
          cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600
        "
      >
        {/* Subtle gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Avatar with enhanced styling */}
        <div className="relative z-10">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
          <img
            src={photo}
            alt="User"
            className="relative w-10 h-10 rounded-full border-2 border-white dark:border-gray-600 shadow-sm ring-2 ring-gray-100 dark:ring-gray-700 transition-all duration-300 group-hover:ring-blue-200 dark:group-hover:ring-blue-700 group-hover:scale-105 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/avatar.jpg";
            }}
          />
          {/* Online status indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></div>
        </div>

        {/* Name with better typography */}
        <span className="relative z-10 font-semibold text-gray-800 dark:text-gray-100 text-sm tracking-tight transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-white">
          {truncatedName}
        </span>

        {/* Chevron icon for dropdown indication */}
        <svg
          className={`relative z-10 w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 group-hover:text-gray-600 dark:group-hover:text-gray-400 ${
            isMenuOpen ? "translate-x-0.5 rotate-90" : "group-hover:translate-x-0.5"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <Dropdown
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        className="w-[18rem] max-w-[calc(100vw-2rem)] sm:w-80 p-0"
      >
        <div className="p-5 space-y-4">
          {isProfileLoading ? (
            <div className="flex items-center justify-center py-6">
              <span className="inline-flex w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="relative">
                  <img
                    src={photo}
                    alt="User avatar"
                    className="w-14 h-14 rounded-full border-2 border-white dark:border-gray-600 shadow-md object-cover"
                  />
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border border-white dark:border-gray-900 rounded-full"></div>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
                    {email || "No email available"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Id",
                    value: employeeId || "Not available",
                    icon: <FiHash className="w-4 h-4" />,
                  },
                  {
                    label: "Name",
                    value: name,
                    icon: <FiUser className="w-4 h-4" />,
                  },
                  {
                    label: "Email",
                    value: email || "Not available",
                    icon: <FiMail className="w-4 h-4" />,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/60"
                  >
                    <span className="mt-1 inline-flex items-center justify-center rounded-full bg-white p-2 text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Dropdown>
    </div>
  );
}
