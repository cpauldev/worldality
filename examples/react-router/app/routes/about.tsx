import { About } from "../components/About";
import { Layout } from "../components/Layout";
import type { loader as homeLoader } from "./home.server";

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

export default function AboutRoute() {
  return (
    <Layout>
      <About />
    </Layout>
  );
}
