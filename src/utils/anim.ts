import { Platform } from "react-native";

/**
 * Retorna animações de entrada apenas em iOS/Android.
 * No web retorna undefined (sem animação) porque o Reanimated 4 tem bugs
 * conhecidos com Layout Animations entering em alguns navegadores —
 * elementos podem travar no meio da transição.
 */
export function entradaNativa<T>(animacao: T): T | undefined {
  return Platform.OS === "web" ? undefined : animacao;
}
