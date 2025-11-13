import { useState, useEffect } from "react";

interface UserInfoCardProps {
  showOnlyAvatar?: boolean;
  showOnlyName?: boolean;
}

export default function UserInfoCard({
  showOnlyAvatar,
  showOnlyName,
}: UserInfoCardProps) {
  const [name, setName] = useState("Guest");
  const [photo, setPhoto] = useState("/images/avatar.jpg");

  useEffect(() => {
    const profileData = localStorage.getItem("profile");
    const username = localStorage.getItem("username");

    if (profileData) {
      try {
        const profile = JSON.parse(profileData);

        if (profile.employeeName) setName(profile.employeeName);

        if (profile.profilePhoto) {
          const photoStr = profile.profilePhoto.trim();

          if (photoStr.startsWith("/9j/") || photoStr.startsWith("iVBOR")) {
            // JPEG or PNG base64
            setPhoto(`data:image/jpeg;base64,${photoStr}`);
          } else if (photoStr.startsWith("data:image")) {
            // Already full data URL
            setPhoto(photoStr);
          } else {
            // Regular image path or URL
            setPhoto(photoStr);
          }
        }
      } catch (err) {
        console.error("Error parsing profile data:", err);
        setName(username || "Guest");
      }
    } else {
      setName(username || "Guest");
    }
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
    <div
      className="
        group relative flex items-center gap-3 px-4 py-2.5
        bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-md
        dark:bg-gray-800/90 dark:border-gray-700/80 dark:text-gray-200
        hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600
        transition-all duration-300 ease-in-out
        cursor-pointer
      "
      title={name}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Avatar with enhanced styling */}
      <div className="relative z-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
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
        className="relative z-10 w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-300 group-hover:text-gray-600 dark:group-hover:text-gray-400 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
