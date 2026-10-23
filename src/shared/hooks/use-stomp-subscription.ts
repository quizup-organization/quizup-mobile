import { useEffect, useRef } from "react";

import { subscribeStomp, type IMessage } from "@/lib/ws";

/** Abonne un composant à une destination STOMP le temps de son montage. */
export function useStompSubscription(
  service: string,
  destination: string | null,
  onMessage: (message: IMessage) => void,
  onConnect?: () => void,
): void {
  const handlerRef = useRef(onMessage);
  const connectRef = useRef(onConnect);

  useEffect(() => {
    handlerRef.current = onMessage;
    connectRef.current = onConnect;
  }, [onMessage, onConnect]);

  useEffect(() => {
    if (!destination) return;
    return subscribeStomp(
      service,
      destination,
      (message) => handlerRef.current(message),
      () => connectRef.current?.(),
    );
  }, [service, destination]);
}
