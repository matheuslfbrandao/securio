import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  initializeAuth,
  // @ts-ignore - tipo não exportado, mas a função existe em runtime
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Cole aqui o objeto firebaseConfig que o console do Firebase mostra
// em "Configurações do projeto" > "Seus aplicativos" > app Web.
// Observação: a apiKey do Firebase Web NÃO é segredo — é um identificador
// público. A segurança é feita pelas Firestore Security Rules.
const firebaseConfig = {
  apiKey: "AIzaSyA62o7DRBW-MVDIAS_eo4KSVUraFtzx820",
  authDomain: "securio-1c7f3.firebaseapp.com",
  projectId: "securio-1c7f3",
  storageBucket: "securio-1c7f3.firebasestorage.app",
  messagingSenderId: "9505806923",
  appId: "1:9505806923:web:0e660eac3454b7c22e0bce",
};

const app = initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
export const db = getFirestore(app);
