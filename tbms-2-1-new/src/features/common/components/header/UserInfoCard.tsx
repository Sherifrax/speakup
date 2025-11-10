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

        if (profile.EmployeeName) setName(profile.EmployeeName);

        if (profile.ProfilePhoto) {
          const photoStr = profile.ProfilePhoto.trim();

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
      <img
        src={photo}
        alt="User"
        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
        title={name}
      />
    );
  }

  // 🔹 Name only
  if (showOnlyName) {
    return (
      <span
        className="font-medium text-gray-700 dark:text-gray-200 text-sm"
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
        flex items-center gap-2 px-2 py-1
        bg-white border border-gray-200 rounded-lg shadow-sm
        dark:bg-[#1f1f1f] dark:border-gray-700 dark:text-gray-200
      "
      title={name} // ✅ Tooltip with full name
    >
      <img
        src={photo}
        alt="User"
        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
      />
      <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
        {truncatedName}
      </span>
    </div>
  );
}
