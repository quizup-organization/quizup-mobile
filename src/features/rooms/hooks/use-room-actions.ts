import { useMutation } from "@tanstack/react-query";

import { roomsService } from "@/features/rooms/lib/rooms";

export function useWizzRoom(roomId: string) {
  return useMutation({
    mutationFn: () => roomsService.wizz(roomId),
  });
}

export function useCancelRoom(roomId: string) {
  return useMutation({
    mutationFn: () => roomsService.cancel(roomId),
  });
}
