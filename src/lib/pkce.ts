import * as Crypto from "expo-crypto";

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export interface PkcePair {
  verifier: string;
  challenge: string;
  state: string;
}

/** Génère un couple PKCE (verifier + challenge S256) et un state. */
export async function createPkce(): Promise<PkcePair> {
  const verifier = base64Url(Crypto.getRandomBytes(32));
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  const challenge = digest
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return { verifier, challenge, state: base64Url(Crypto.getRandomBytes(16)) };
}
