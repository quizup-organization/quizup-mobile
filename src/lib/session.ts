/**
 * Contrat d'infrastructure de session : le client HTTP et le WebSocket ne
 * connaissent pas la feature auth. Celle-ci enregistre un `SessionGateway` au
 * bootstrap (même pattern que quizup-web).
 */
export interface SessionGateway {
  getAccessToken: () => string | null;
  refresh: () => Promise<string | null>;
  clear: () => Promise<void>;
  subscribe: (listener: () => void) => () => void;
}

const unregisteredGateway: SessionGateway = {
  getAccessToken: () => null,
  refresh: async () => null,
  clear: async () => undefined,
  subscribe: () => () => undefined,
};

let gateway: SessionGateway = unregisteredGateway;
const pendingListeners = new Set<() => void>();
let gatewayCleanups: Array<() => void> = [];

/**
 * Enregistre la gateway auth. Les abonnements souscrits avant le bootstrap (le
 * client WebSocket est importé tôt) sont rejoués sur la gateway réelle.
 */
export function registerSessionGateway(next: SessionGateway): void {
  gatewayCleanups.forEach((cleanup) => cleanup());
  gatewayCleanups = [];
  gateway = next;
  pendingListeners.forEach((listener) => {
    gatewayCleanups.push(next.subscribe(listener));
  });
  pendingListeners.clear();
}

export const sessionGateway: SessionGateway = {
  getAccessToken: () => gateway.getAccessToken(),
  refresh: () => gateway.refresh(),
  clear: () => gateway.clear(),
  subscribe: (listener) => {
    if (gateway === unregisteredGateway) {
      pendingListeners.add(listener);
      return () => pendingListeners.delete(listener);
    }
    return gateway.subscribe(listener);
  },
};
