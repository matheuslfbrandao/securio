import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import { cores, espacos } from "../theme";

type Props = {
  tamanho?: "pequeno" | "medio" | "grande";
  style?: ViewStyle;
};

const TAMANHOS = {
  pequeno: { altura: 36, icone: 28, titulo: 22, subtitulo: 11 },
  medio: { altura: 64, icone: 40, titulo: 32, subtitulo: 14 },
  grande: { altura: 120, icone: 56, titulo: 44, subtitulo: 18 },
};

// Tenta carregar a imagem da logo. Se o arquivo não existir, fica null
// e o componente usa o fallback (ícone + texto).
let LOGO_IMG: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  LOGO_IMG = require("../../assets/images/logo.png");
} catch {
  LOGO_IMG = null;
}

export function Logo({ tamanho = "medio", style }: Props) {
  const t = TAMANHOS[tamanho];
  const [erro, setErro] = useState(false);

  if (LOGO_IMG && !erro) {
    return (
      <View style={[estilos.imagemContainer, style]}>
        <Image
          source={LOGO_IMG}
          style={{
            height: t.altura,
            aspectRatio: 3.05,
            resizeMode: "contain",
          }}
          onError={() => setErro(true)}
        />
      </View>
    );
  }

  return (
    <View style={[estilos.fallback, style]}>
      <Ionicons name="shield-checkmark" size={t.icone} color={cores.primaria} />
      <View>
        <Text style={[estilos.titulo, { fontSize: t.titulo }]}>Securio</Text>
        <Text style={[estilos.subtitulo, { fontSize: t.subtitulo }]}>
          O CyberQuiz
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  imagemContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
  },
  titulo: {
    color: cores.texto,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitulo: {
    color: cores.primaria,
    fontWeight: "500",
    marginTop: -2,
  },
});
