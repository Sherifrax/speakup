import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { GrSecure } from "react-icons/gr";
import { ImBlocked } from "react-icons/im";
import { LuMailPlus } from "react-icons/lu";
import { IoCreateSharp } from "react-icons/io5";
import { GoTasklist } from "react-icons/go";
import { IoIosListBox } from "react-icons/io";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaCircleXmark } from "react-icons/fa6";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { BsHandThumbsDownFill } from "react-icons/bs";

import { RiTableLine } from "react-icons/ri";
import { RiFileListLine } from "react-icons/ri";
import { GoChecklist } from "react-icons/go";
import { BiListPlus } from "react-icons/bi";

 import { GridIcon, TableIcon } from "../assets/icons/general";

export const ICONS = {
    Dashboard: GridIcon,
    Grid: TableIcon,
    DashboardList:RiTableLine,
    CreateRequestList: BiListPlus,
    MyRequestList: RiFileListLine,
    ApproveRequestList: GoChecklist,
    CreateRequest: IoCreateSharp,
    ApproveList: GoTasklist,
    ManageList: IoIosListBox,
    Submit: IoMdCheckmarkCircle,
    Cancel: FaCircleXmark,
    Approve: BsHandThumbsUpFill,
    Reject: BsHandThumbsDownFill,
    Swapping: FaArrowRightArrowLeft,
    CreateMail: LuMailPlus,
    SecurityLock: GrSecure,
    Blocked: ImBlocked,
};
