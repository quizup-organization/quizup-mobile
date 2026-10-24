/** Statut serveur d'un ticket d'appariement (`MatchmakingStatus`). */
export type MatchmakingStatus =
  | "SEARCHING"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED";

/** Ticket d'appariement public (`MatchmakingTicketView`). */
export interface MatchmakingTicket {
  ticketId: string;
  topicId: string;
  status: MatchmakingStatus;
  roomId: string | null;
  opponentId: string | null;
  vsBot: boolean;
  createdAt: string;
  updatedAt: string;
}
