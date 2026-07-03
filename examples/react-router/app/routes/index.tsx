import type { loader as homeLoader } from "./home.server";

import { Home } from "../components/Home";
import { Layout } from "../components/Layout";

export { loader } from "./home.server";

export function meta({
  data,
}: {
  data?: Awaited<ReturnType<typeof homeLoader>>;
}) {
  return [
    { title: data?.title ?? "React Router" },
    {
      name: "description",
      content: data?.description ?? "React Router example for Worldality",
    },
  ];
}

export default function HomeRoute() {
  return (
    <Layout>
      <Home />
    </Layout>
  );
}
