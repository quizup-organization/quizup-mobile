export { SessionBootstrap } from "@/features/auth/components/session-bootstrap";
export { useAuth } from "@/features/auth/hooks/use-auth";
export {
  useAuthStatus,
  useSession,
  useSessionStore,
} from "@/features/auth/stores/use-session-store";
export {
  AuthCancelledError,
  AuthError,
  isFacebookEmailMissing,
} from "@/features/auth/domain/errors";
export { emailSchema, codeSchema } from "@/features/auth/schemas";
export type { AuthStatus } from "@/features/auth/stores/use-session-store";
export type { Session } from "@/features/auth/domain/session";
