import { useQuery } from "@tanstack/react-query";
import { config } from "@/lib/config";

interface ApiHealth {
  status: string;
}

async function fetchApiHealth(): Promise<ApiHealth> {
  const response = await fetch(`${config.apiUrl}/actuator/health`);
  if (!response.ok) {
    throw new Error(`API health: HTTP ${response.status}`);
  }
  return (await response.json()) as ApiHealth;
}

/** Vérifie que l'APK atteint bien le BFF de prod (endpoint public Actuator). */
export function useApiHealth() {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: fetchApiHealth,
    retry: 1,
    staleTime: 60_000,
  });
}
