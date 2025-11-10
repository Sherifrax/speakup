import { Route } from "react-router-dom";
import { SpeakUpManage } from "../pages/SpeakUp/SpeakUpManage";

export const SpeakUpRoutes = () => (
  <>
    <Route path="/speak-up/speak-up-manage" element={<SpeakUpManage />} />
  </>
);