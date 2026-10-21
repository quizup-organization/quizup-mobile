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

export function registerSessionGateway(next: SessionGateway): void {
  gateway = next;
}

export const sessionGateway: SessionGateway = {
  getAccessToken: () => gateway.getAccessToken(),
  refresh: () => gateway.refresh(),
  clear: () => gateway.clear(),
  subscribe: (listener) => gateway.subscribe(listener),
};
