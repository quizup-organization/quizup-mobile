import { useSessionBootstrap } from "../hooks/useSessionBootstrap";
import { useSessionLifecycle } from "../hooks/useSessionLifecycle";

/**
 * Effets de session montés une fois dans le layout racine (sous le QueryClientProvider).
 * Ne rend rien.
 */
export function SessionRuntime() {
  useSessionBootstrap();
  useSessionLifecycle();
  return null;
}
