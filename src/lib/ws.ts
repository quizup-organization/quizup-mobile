// Hermes n'expose pas encore TextEncoder ; @stomp/stompjs en a besoin pour parser
// les trames. Le polyfill est idempotent et laisse TextDecoder d'Expo en place.
import "fast-text-encoding";

import { AppState } from "react-native";
import {
  Client,
  ReconnectionTimeMode,
  type IMessage,
} from "@stomp/stompjs";

import { config } from "@/lib/config";
import { sessionGateway } from "@/lib/session";

export type { IMessage } from "@stomp/stompjs";

/** Base WebSocket dérivée de l'URL HTTP du BFF. */
function wsBase(): string {
  return config.apiUrl.replace(/^http/, "ws");
}

const CONNECTION_KEY = "bff";

function connectHeaders(): Record<string, string> {
  const token = sessionGateway.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type MessageHandler = (message: IMessage) => void;

interface BrokerSubscription {
  unsubscribe: () => void;
}

interface ServiceConnection {
  client: Client;
  destinations: Map<string, Set<MessageHandler>>;
  onConnectHandlers: Map<string, Set<() => void>>;
  brokerSubscriptions: Map<string, BrokerSubscription>;
  retained: number;
  active: boolean;
  suspended: boolean;
}

const connections = new Map<string, ServiceConnection>();

sessionGateway.subscribe(() => {
  const hasToken = Boolean(sessionGateway.getAccessToken());
  connections.forEach((connection) => {
    if (!hasToken) {
      if (connection.client.active) {
        void connection.client.deactivate();
      }
      return;
    }
    if (
      connection.active &&
      !connection.suspended &&
      !connection.client.active
    ) {
      connection.client.activate();
    }
  });
});

function suspendConnections(): void {
  connections.forEach((connection) => {
    connection.suspended = true;
    if (connection.client.active) {
      void connection.client.deactivate();
    }
  });
}

function resumeConnections(): void {
  connections.forEach((connection) => {
    connection.suspended = false;
    if (
      connection.active &&
      sessionGateway.getAccessToken() &&
      !connection.client.active
    ) {
      connection.client.activate();
    }
  });
}

AppState.addEventListener("change", (state) => {
  if (state === "active") resumeConnections();
  else suspendConnections();
});

function brokerSubscribe(
  connection: ServiceConnection,
  destination: string,
): void {
  const subscription = connection.client.subscribe(destination, (message) => {
    connection.destinations
      .get(destination)
      ?.forEach((handler) => handler(message));
  });
  connection.brokerSubscriptions.set(destination, subscription);
}

function ensureConnection(): ServiceConnection {
  const existing = connections.get(CONNECTION_KEY);
  if (existing) return existing;

  const connection: ServiceConnection = {
    client: undefined as unknown as Client,
    destinations: new Map(),
    onConnectHandlers: new Map(),
    brokerSubscriptions: new Map(),
    retained: 0,
    active: false,
    suspended: false,
  };

  const client = new Client({
    webSocketFactory: () => new WebSocket(`${wsBase()}/ws/websocket`),
    reconnectDelay: 1_000,
    reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
    maxReconnectDelay: 30_000,
    heartbeatIncoming: 10_000,
    heartbeatOutgoing: 10_000,
    debug: () => undefined,
    beforeConnect: () => {
      client.connectHeaders = connectHeaders();
    },
  });

  client.onConnect = () => {
    connection.brokerSubscriptions.forEach((sub) => sub.unsubscribe());
    connection.brokerSubscriptions.clear();
    connection.destinations.forEach((_handlers, destination) =>
      brokerSubscribe(connection, destination),
    );
    connection.onConnectHandlers.forEach((handlers) =>
      handlers.forEach((onConnect) => onConnect()),
    );
  };
  client.onWebSocketClose = () => {
    connection.brokerSubscriptions.clear();
  };

  connection.client = client;
  connections.set(CONNECTION_KEY, connection);
  return connection;
}

function activate(connection: ServiceConnection): void {
  connection.active = true;
  if (connection.suspended || !sessionGateway.getAccessToken()) return;
  if (!connection.client.active) {
    connection.client.activate();
  }
}

function deactivateIfIdle(connection: ServiceConnection): void {
  if (
    connection.destinations.size === 0 &&
    connection.retained === 0 &&
    connection.active
  ) {
    connection.active = false;
    connections.delete(CONNECTION_KEY);
    void connection.client.deactivate();
  }
}

/** Abonne un handler à une destination STOMP ; connexion BFF mutualisée. */
export function subscribeStomp(
  _service: string,
  destination: string,
  handler: MessageHandler,
  onConnect?: () => void,
): () => void {
  const connection = ensureConnection();

  let handlers = connection.destinations.get(destination);
  if (!handlers) {
    handlers = new Set();
    connection.destinations.set(destination, handlers);
  }
  handlers.add(handler);

  if (onConnect) {
    let connectHandlers = connection.onConnectHandlers.get(destination);
    if (!connectHandlers) {
      connectHandlers = new Set();
      connection.onConnectHandlers.set(destination, connectHandlers);
    }
    connectHandlers.add(onConnect);
  }

  if (connection.client.connected) {
    if (!connection.brokerSubscriptions.has(destination)) {
      brokerSubscribe(connection, destination);
    }
    onConnect?.();
  } else {
    activate(connection);
  }

  return () => {
    const current = connection.destinations.get(destination);
    if (current) {
      current.delete(handler);
      if (current.size === 0) {
        connection.destinations.delete(destination);
        connection.brokerSubscriptions.get(destination)?.unsubscribe();
        connection.brokerSubscriptions.delete(destination);
      }
    }
    if (onConnect) {
      const connectHandlers = connection.onConnectHandlers.get(destination);
      connectHandlers?.delete(onConnect);
      if (connectHandlers && connectHandlers.size === 0) {
        connection.onConnectHandlers.delete(destination);
      }
    }
    deactivateIfIdle(connection);
  };
}
