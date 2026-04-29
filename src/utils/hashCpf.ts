import * as Crypto from "expo-crypto";
import { limparCpf } from "./validarCpf";

const SALT = "securio-cyberquiz-v1";

export async function hashCpf(cpf: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${SALT}:${limparCpf(cpf)}`
  );
}
