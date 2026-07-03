import {
  Links,
  type LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import { bootstrapWorldality, getWorldalityHtmlAttrs } from "worldality";

import type { loader as rootLoader } from "./root.server";

import appStylesHref from "./app.css?url";

export { loader } from "./root.server";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  {
    rel: "preload",
    href: "/fonts/inter-variable.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/inter-variable-italic.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/geist-mono-variable.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: appStylesHref },
];

export default function App() {
  const { worldalityData, worldalityScript } =
    useLoaderData<typeof rootLoader>();
  bootstrapWorldality(worldalityData);
  const htmlAttrs = getWorldalityHtmlAttrs(worldalityData);

  return (
    <html {...htmlAttrs} className="font-sans antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: worldalityScript,
          }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
