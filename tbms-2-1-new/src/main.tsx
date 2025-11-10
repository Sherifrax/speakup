import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { AppWrapper } from "./features/common/components/page/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
//import { loadConfig } from "./utils/configLoader.ts";

// Load configuration before rendering the app
//loadConfig().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </StrictMode>
  );
//});
