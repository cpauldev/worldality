import { Match, Switch } from "solid-js";
import { useCurrentPage, useLocaleRouting } from "worldality/solid";

import { AboutPage } from "./pages/about";
import { IndexPage } from "./pages/index";

export default function App() {
  const currentPage = useCurrentPage();

  useLocaleRouting();

  return (
    <Switch fallback={<IndexPage />}>
      <Match when={currentPage() === "about"}>
        <AboutPage />
      </Match>
    </Switch>
  );
}
