import { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { cores, espacos, fontes, raios } from "../theme";

type Props = {
  rotulo: string;
  valor: string;
  aoMudar: (texto: string) => void;
  placeholder?: string;
  senha?: boolean;
  tipoTeclado?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  erro?: string;
  maxLength?: number;
  editavel?: boolean;
  multiline?: boolean;
  style?: ViewStyle;
};

export function CampoTexto({
  rotulo,
  valor,
  aoMudar,
  placeholder,
  senha = false,
  tipoTeclado = "default",
  autoCapitalize = "none",
  erro,
  maxLength,
  editavel = true,
  multiline = false,
  style,
}: Props) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={[estilos.container, style]}>
      <Text style={[estilos.rotulo, focado && estilos.rotuloFocado]}>
        {rotulo}
      </Text>
      <TextInput
        style={[
          estilos.input,
          multiline && estilos.inputMultiline,
          focado && estilos.inputFocado,
          !!erro && estilos.inputErro,
          !editavel && estilos.inputDesabilitado,
        ]}
        value={valor}
        onChangeText={aoMudar}
        placeholder={placeholder}
        placeholderTextColor="rgba(163, 181, 186, 0.5)"
        secureTextEntry={senha}
        keyboardType={tipoTeclado}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        maxLength={maxLength}
        editable={editavel}
        multiline={multiline}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
      />
      {!!erro && <Text style={estilos.erro}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: espacos.md,
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: fontes.pequena,
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  rotuloFocado: {
    color: cores.primaria,
  },
  input: {
    height: 50,
    borderRadius: raios.medio,
    backgroundColor: "rgba(15, 47, 64, 0.6)",
    borderWidth: 1.5,
    borderColor: cores.bordaCard,
    paddingHorizontal: espacos.md,
    color: cores.texto,
    fontSize: fontes.media,
    outlineStyle: "none" as any,
  },
  inputMultiline: {
    height: 100,
    paddingTop: espacos.sm,
    textAlignVertical: "top",
  },
  inputFocado: {
    borderColor: cores.primaria,
    backgroundColor: "rgba(61, 217, 199, 0.08)",
    shadowColor: cores.primaria,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  inputErro: {
    borderColor: cores.erro,
  },
  inputDesabilitado: {
    opacity: 0.5,
  },
  erro: {
    color: cores.erro,
    fontSize: fontes.pequena,
    marginTop: espacos.xs,
    marginLeft: espacos.sm,
  },
});
