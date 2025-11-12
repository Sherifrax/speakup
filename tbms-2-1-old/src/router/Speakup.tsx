import { Route } from "react-router-dom";
import SpeakupManage from "../pages/Speakup/SpeakupManage";
import SpeakupApproval from "../pages/Speakup/SpeakupApproval";

export const speakupApiRoutes = () => (
  <>
    <Route path="/speakup/manage" element={<SpeakupManage />} />
    <Route path="/speakup/approval" element={<SpeakupApproval />} />
  </>
);