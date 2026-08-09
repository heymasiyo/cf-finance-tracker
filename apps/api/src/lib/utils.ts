import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { Context as HonoContext } from "hono";

import type { Context } from "@/lib/types";

export function getRequestInfo(c: HonoContext<Context>) {
  const clientIp =
    c.req.header("cf-connecting-ip") ||
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown";

  const userAgent = c.req.header("user-agent") ?? "unknown";

  return {
    clientIp,
    userAgent
  };
}

export type IssueInput = readonly StandardSchemaV1.Issue[];
export function formatValidationError(errors: IssueInput): string {
  return errors
    .map((err) => {
      return err.message;
    })
    .join(", ");
}

export type EncryptableData =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<unknown>;
async function getEncryptionKey(secretKey: string): Promise<CryptoKey> {
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secretKey),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const salt = enc.encode("app-salt");

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(
  data: EncryptableData,
  secretKey: string
): Promise<string> {
  const enc = new TextEncoder();
  const key = await getEncryptionKey(secretKey);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const textData =
    typeof data === "object" ? JSON.stringify(data) : String(data);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(textData)
  );

  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const cipherHex = Array.from(new Uint8Array(encryptedBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${ivHex}:${cipherHex}`;
}

export async function decrypt(
  encryptedDataString: string,
  secretKey: string
): Promise<string> {
  const parts = encryptedDataString.split(":");

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("Invalid encrypted string format");
  }

  const [ivHex, cipherHex] = parts;

  const ivMatch = ivHex.match(/.{1,2}/g);
  const cipherMatch = cipherHex.match(/.{1,2}/g);

  if (!ivMatch || !cipherMatch) {
    throw new Error("Invalid hex characters in encrypted data");
  }

  const iv = new Uint8Array(ivMatch.map((byte) => parseInt(byte, 16)));
  const cipherBuffer = new Uint8Array(
    cipherMatch.map((byte) => parseInt(byte, 16))
  );

  const key = await getEncryptionKey(secretKey);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      cipherBuffer
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch {
    throw new Error("Decryption failed: Invalid secret key or corrupted data");
  }
}

export async function decryptJson<T = unknown>(
  encryptedDataString: string,
  secretKey: string
): Promise<T> {
  const decryptedText = await decrypt(encryptedDataString, secretKey);
  return JSON.parse(decryptedText) as T;
}
