type ActionConfig = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  visible: boolean;
  onClick: (rowId: string | number) => void;
};
export default ActionConfig;
