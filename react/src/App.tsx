import { useCurrentPage, useLocaleRouting } from "worldality/react";

import { AboutPage } from "./pages/about";
import { IndexPage } from "./pages/index";

export default function App() {
  const currentPage = useCurrentPage();

  useLocaleRouting();

  return currentPage === "about" ? <AboutPage /> : <IndexPage />;
}
