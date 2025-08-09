/**
 * App shell and global providers
 *
 * - Provides the HTML document structure for every route
 * - Registers global <Links> (fonts, styles) and <Meta>
 * - Wraps the entire app with <AuthProvider> so any route can call useAuth()
 * - Renders the active route via <Outlet />
 *
 * Team notes:
 * - Add other global providers here (theme, i18n, query client, etc.).
 * - If you introduce additional fonts, prefer preconnect and a single stylesheet request
 *   to minimize layout shift and extra connections.
 */
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { AuthProvider } from "~/contexts/AuthContext";

import "./tailwind.css";

// Centralized link tags for fonts and styles.
// If you add a favicon set or manifest later, co-locate it here for visibility.
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/**
         * Global context for authentication and user profile.
         * Any route/component can call useAuth() without prop drilling.
         */}
        <AuthProvider>
          {children}
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
