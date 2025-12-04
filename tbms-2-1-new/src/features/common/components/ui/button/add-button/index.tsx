import { ReactNode } from "react";
import Button from "../";

interface AddButtonProps {
  onClick: () => void;
  text?: string;
  icon?: ReactNode;
  fromColor?: string;
  toColor?: string;
  className?: string;
}

export const AddButton = ({
  onClick,
  text = "Add",
  icon = <span className="pr-2 text-xl">+</span>,
  fromColor = "from-blue-500",
  toColor = "to-blue-800",
  className = ""
}: AddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`bg-gradient-to-r ${fromColor} ${toColor} hover:${fromColor.replace('500', '600')} hover:${toColor.replace('600', '700')} text-white px-4 py-2 rounded-full transition-colors text-lg shadow-md ${className} sm:px-6 sm:py-3 sm:text-lg`}
    >
      {icon}
      {text}
    </Button>
  );
};
