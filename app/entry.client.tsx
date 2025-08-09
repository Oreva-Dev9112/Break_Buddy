/**
 * Client entry
 *
 * This runs only in the browser and "hydrates" the server-rendered HTML so the
 * UI becomes interactive. We keep this file intentionally small. If you need to
 * register analytics, a service worker, or polyfills, this is a good place.
 *
 * Team notes:
 * - Keep side effects minimal here; prefer route loaders/actions for data.
 * - If StrictMode causes third-party warnings in dev, you can disable it, but
 *   please document why so future maintainers understand the trade-off.
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
