import React from "react";
import { ReactComponent as NoDataIllustration } from "../../../../assets/icons/additional/no-data.svg?react";

interface NoDataStateProps {
  title?: string;
  description?: string;
  className?: string;
  fullHeight?: boolean;
  illustrationWidth?: number | string;
}

export const NoDataState: React.FC<NoDataStateProps> = ({
  title = "No Data",
  description = "Can't find any item matching your request.",
  className = "",
  fullHeight = false,
  illustrationWidth = 100,
}) => {
  const containerClassName = [
    "flex flex-col items-center justify-center text-center gap-4 px-6 py-12",
    "text-gray-600 dark:text-gray-400",
    fullHeight ? "min-h-[280px]" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedWidth =
    typeof illustrationWidth === "number" ? `${illustrationWidth}px` : illustrationWidth;

  return (
    <div className={containerClassName}>
      <NoDataIllustration
        className="max-w-full text-gray-300 dark:text-gray-600"
        style={{ width: resolvedWidth, height: "auto" }}
      />
      <div className="space-y-1">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default NoDataState;

