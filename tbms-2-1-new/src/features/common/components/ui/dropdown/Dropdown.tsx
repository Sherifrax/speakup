import type React from "react";
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  placement?: "bottom" | "top" | "auto";
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  placement = "auto",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen && placement === "auto") {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (dropdownRef.current) {
          const viewportHeight = window.innerHeight;
          
          // Get the parent container (the relative positioned div)
          const parent = dropdownRef.current.parentElement;
          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            const spaceBelow = viewportHeight - parentRect.bottom;
            const spaceAbove = parentRect.top;
            const estimatedDropdownHeight = 300; // Estimate dropdown height

            // If there's not enough space below but more space above, open upward
            if (spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow) {
              setPosition("top");
            } else {
              setPosition("bottom");
            }
          }
        }
      });
    } else if (placement !== "auto") {
      setPosition(placement);
    }
  }, [isOpen, placement]);

  if (!isOpen) return null;

  const positionClasses =
    position === "top"
      ? "bottom-full mb-2"
      : "top-full mt-2";

  const maxHeight = position === "top" ? "calc(100vh - 100px)" : "calc(100vh - 120px)";

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-40 right-0 lg:right-0 ${positionClasses} rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark overflow-hidden ${className}`}
    >
      <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight }}>
        {children}
      </div>
    </div>
  );
};
