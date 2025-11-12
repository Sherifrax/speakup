// src/icons/GridIcon.tsx
import React from "react";

const GridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <rect x="0" y="0" width="10" height="10" fill="currentColor" />
    <rect x="14" y="0" width="10" height="10" fill="currentColor" />
    <rect x="0" y="14" width="10" height="10" fill="currentColor" />
    <rect x="14" y="14" width="10" height="10" fill="currentColor" />
  </svg>
);

export default GridIcon;
