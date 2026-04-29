import { Platform } from "react-native";

const ID_NOTIF_DIARIA = "securio-quiz-diario";

const ehWeb = Platform.OS === "web";

if (!ehWeb) {
  // Configura o handler apenas em mobile
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Notifications = require("expo-notifications");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function pedirPermissaoENotificar(): Promise<{
  ok: boolean;
  motivo?: string;
}> {
  if (ehWeb) {
    return {
      ok: false,
      motivo: "Notificações push só funcionam no app mobile (iOS/Android).",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Device = require("expo-device");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Notifications = require("expo-notifications");

  if (!Device.isDevice) {
    return {
      ok: false,
      motivo: "Notificações só funcionam em dispositivo real, não em emulador.",
    };
  }

  const atual = await Notifications.getPermissionsAsync();
  let status = atual.status;
  if (status !== "granted") {
    const pedido = await Notifications.requestPermissionsAsync();
    status = pedido.status;
  }
  if (status !== "granted") {
    return { ok: false, motivo: "Permissão negada nas configurações." };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Quiz Diário",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#3DD9C7",
    });
  }

  return { ok: true };
}

export async function agendarLembreteDiario(): Promise<void> {
  if (ehWeb) return;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Notifications = require("expo-notifications");

  await Notifications.cancelScheduledNotificationAsync(ID_NOTIF_DIARIA).catch(
    () => {}
  );

  await Notifications.scheduleNotificationAsync({
    identifier: ID_NOTIF_DIARIA,
    content: {
      title: "Securio · Pergunta do Dia 🛡️",
      body: "Uma nova pergunta de cibersegurança foi liberada. Responda para ganhar pontos!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 12,
      minute: 0,
      repeats: true,
    },
  });
}

export async function cancelarLembrete(): Promise<void> {
  if (ehWeb) return;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Notifications = require("expo-notifications");
  await Notifications.cancelScheduledNotificationAsync(ID_NOTIF_DIARIA).catch(
    () => {}
  );
}

export async function lembreteEstaAgendado(): Promise<boolean> {
  if (ehWeb) return false;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Notifications = require("expo-notifications");
  const agendados = await Notifications.getAllScheduledNotificationsAsync();
  return agendados.some(
    (n: { identifier: string }) => n.identifier === ID_NOTIF_DIARIA
  );
}
