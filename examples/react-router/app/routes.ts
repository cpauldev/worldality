import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("./routes/index.tsx", { id: "home-index" }),
  route(":locale", "./routes/index.tsx", { id: "home-locale" }),
  route("about", "./routes/about.tsx", { id: "about-index" }),
  route(":locale/about", "./routes/about.tsx", { id: "about-locale" }),
] satisfies RouteConfig;
