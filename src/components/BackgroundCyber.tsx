import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, Line, RadialGradient, Rect, Stop } from "react-native-svg";
import { cores } from "../theme";

const LARGURA = 400;
const ALTURA = 800;
const ESPACO_GRID = 40;

function gerarPontos(quantidade: number, seedOffset = 0) {
  const seed = (i: number) => {
    const x = Math.sin((i + seedOffset) * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  return Array.from({ length: quantidade }).map((_, i) => ({
    cx: seed(i) * LARGURA,
    cy: seed(i + 1000) * ALTURA,
    r: 0.6 + seed(i + 2000) * 1.6,
    op: 0.2 + seed(i + 3000) * 0.7,
  }));
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function BackgroundCyber() {
  const pontosA = useMemo(() => gerarPontos(60, 0), []);
  const pontosB = useMemo(() => gerarPontos(60, 5000), []);
  const linhasV = useMemo(() => {
    const arr: number[] = [];
    for (let x = 0; x <= LARGURA; x += ESPACO_GRID) arr.push(x);
    return arr;
  }, []);
  const linhasH = useMemo(() => {
    const arr: number[] = [];
    for (let y = 0; y <= ALTURA; y += ESPACO_GRID) arr.push(y);
    return arr;
  }, []);

  const fase = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    fase.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const estiloA = useAnimatedStyle(() => ({
    opacity: 0.4 + fase.value * 0.6,
  }));
  const estiloB = useAnimatedStyle(() => ({
    opacity: 0.4 + (1 - fase.value) * 0.6,
  }));
  const estiloGlow = useAnimatedStyle(() => ({
    opacity: 0.7 + pulse.value * 0.3,
  }));

  return (
    <View style={estilos.container} pointerEvents="none">
      {/* Glow respirando */}
      <AnimatedView style={[StyleSheet.absoluteFill, estiloGlow]}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <Defs>
            <RadialGradient id="glowTopo" cx="50%" cy="0%" r="70%">
              <Stop offset="0%" stopColor={cores.primaria} stopOpacity="0.18" />
              <Stop offset="100%" stopColor={cores.primaria} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="glowBaixo" cx="50%" cy="100%" r="60%">
              <Stop offset="0%" stopColor={cores.primaria} stopOpacity="0.12" />
              <Stop offset="100%" stopColor={cores.primaria} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={LARGURA} height={ALTURA} fill="url(#glowTopo)" />
          <Rect x="0" y="0" width={LARGURA} height={ALTURA} fill="url(#glowBaixo)" />
        </Svg>
      </AnimatedView>

      {/* Grid estático */}
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {linhasV.map((x) => (
          <Line
            key={`v${x}`}
            x1={x}
            y1={0}
            x2={x}
            y2={ALTURA}
            stroke={cores.primaria}
            strokeWidth={0.3}
            strokeOpacity={0.08}
          />
        ))}
        {linhasH.map((y) => (
          <Line
            key={`h${y}`}
            x1={0}
            y1={y}
            x2={LARGURA}
            y2={y}
            stroke={cores.primaria}
            strokeWidth={0.3}
            strokeOpacity={0.08}
          />
        ))}
      </Svg>

      {/* Pontos camada A — animação cross-fade */}
      <AnimatedView style={[StyleSheet.absoluteFill, estiloA]}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          preserveAspectRatio="xMidYMid slice"
        >
          {pontosA.map((p, i) => (
            <Circle
              key={`a${i}`}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={cores.primaria}
              opacity={p.op}
            />
          ))}
        </Svg>
      </AnimatedView>

      {/* Pontos camada B */}
      <AnimatedView style={[StyleSheet.absoluteFill, estiloB]}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          preserveAspectRatio="xMidYMid slice"
        >
          {pontosB.map((p, i) => (
            <Circle
              key={`b${i}`}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={cores.primariaClara}
              opacity={p.op * 0.8}
            />
          ))}
        </Svg>
      </AnimatedView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
