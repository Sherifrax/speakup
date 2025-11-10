import React from "react";
import { GridIcon, TableIcon } from "../icons";
import { BaseNameSideMenuItem } from "../enum/BaseNameSideMenuItem";
import { HiSpeakerphone } from 'react-icons/hi'; 
import { SpeakUpEnum } from "../enum/SpeakUp.enum";
export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const navItems: NavItem[] = [
  {
    icon: React.createElement(GridIcon),
    name: "Dashboard",
    path: BaseNameSideMenuItem.Dashboard,
  },
  {
    name: "API Management",
    icon: React.createElement(TableIcon),
    path: BaseNameSideMenuItem.ApiManagement,
  },
  {
    name: "Speak Up",
    icon: React.createElement(HiSpeakerphone),
    subItems: [
      { name: "Speak Up Entry", path: `${BaseNameSideMenuItem.SpeakUp}/${SpeakUpEnum.Entry}`, pro: false },
      { name: "Speak Up Manage", path: `${BaseNameSideMenuItem.SpeakUp}/${SpeakUpEnum.Manage}`, pro: false }
    ],
  }
];
