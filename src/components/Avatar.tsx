import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, View, ViewStyle } from "react-native";
import { cores } from "../theme";

type Props = {
  url?: string;
  tamanho?: number;
  style?: ViewStyle;
  comBorda?: boolean;
};

export function Avatar({ url, tamanho = 36, style, comBorda = true }: Props) {
  const [erro, setErro] = useState(false);
  const semFoto = !url || erro;

  return (
    <View
      style={[
        estilos.container,
        comBorda && estilos.borda,
        {
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
        },
        style,
      ]}
    >
      {!semFoto ? (
        <Image
          source={{ uri: url }}
          style={{
            width: tamanho - (comBorda ? 4 : 0),
            height: tamanho - (comBorda ? 4 : 0),
            borderRadius: (tamanho - (comBorda ? 4 : 0)) / 2,
          }}
          onError={() => setErro(true)}
        />
      ) : (
        <Ionicons
          name="person"
          size={tamanho * 0.5}
          color={cores.primaria}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.fundoEscuro,
    overflow: "hidden",
  },
  borda: {
    borderWidth: 1.5,
    borderColor: cores.primaria,
  },
});
