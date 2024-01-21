import FontAwesome from "@expo/vector-icons/FontAwesome";
import NetInfo from "@react-native-community/netinfo";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { onlineManager } from "@tanstack/react-query";
import { FontSource, useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { QueryProvider } from "../src/api";
import * as SplashScreen from "expo-splash-screen";

void SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono:
      // this is the expo-recommended way of doing this
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("../src/assets/fonts/SpaceMono-Regular.ttf") as FontSource,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
    if (loaded) void SplashScreen.hideAsync();
  }, [loaded, error]);

  /* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */
  return loaded ? <RootLayoutNav /> : null;
}

function RootLayoutNav() {
  const _colorScheme = useColorScheme();

  return (
    <QueryProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
