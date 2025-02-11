import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar
          style={isDarkColorScheme ? "light" : "dark"}
          hidden={false}
        />

        <Stack>
          {/* <Stack.Screen
          name='index'
          options={{
            title: 'Starter Base',
            headerRight: () => <ThemeToggle />,
          }}
        /> */}

          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen
            name="onboarding/screen1"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="onboarding/screen2"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="onboarding/screen3"
            options={{ headerShown: false }}
          />

          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />

          <Stack.Screen
            name="surdos/modulos"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="surdos/moduloDetalhes"
            options={{ headerTitle: "Voltar" }}
          />
          <Stack.Screen
            name="surdos/moduloPalavraDetalhes"
            options={{ headerTitle: "Voltar" }}
          />
          <Stack.Screen
            name="surdos/dicionario"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="surdos/perfil" options={{ headerShown: false }} />
          <Stack.Screen
            name="surdos/editPerfil"
            options={{ headerTitle: "Voltar" }}
          />
          <Stack.Screen name="surdos/forum" options={{ headerShown: false }} />
          <Stack.Screen
            name="surdos/moduloPalavraRecentes"
            options={{ headerTitle: "Voltar" }}
          />
          <Stack.Screen
            name="surdos/moduloPalavraCurtidas"
            options={{ headerTitle: "Voltar" }}
          />
          <Stack.Screen name="surdos/VariacoesLinguisticas" options={{ headerTitle: "Voltar" }}/>
          <Stack.Screen
            name="surdos/sobre"
            options={{ headerTitle: "Voltar" }}
          />

          <Stack.Screen name="interpretes/modulos" options={{ headerShown: false }}/>
          <Stack.Screen name="interpretes/dicionario" options={{ headerShown: false }}/>
          <Stack.Screen name="interpretes/interprete" />
          <Stack.Screen name="interpretes/perfil" />

          <Stack.Screen name="interpretes/interpreteDetalhePalavra" options={{ headerTitle: "Voltar" }}/>

          <Stack.Screen name="admin/modulos" options={{ headerShown: false }}/>
          <Stack.Screen name="admin/dicionario" options={{ headerShown: false }}/>
          <Stack.Screen name="admin/admin" />
          <Stack.Screen name="admin/perfil" options={{ headerTitle: "Voltar" }}/>

          <Stack.Screen name="admin/moduloDetalhes" options={{ headerTitle: "Voltar" }}/>
          <Stack.Screen name="admin/editPerfil" />
          <Stack.Screen name="admin/moduloPalavraDetalhes" options={{ headerTitle: "Voltar" }}/>
          <Stack.Screen name="admin/moduloPalavraRecentes" options={{ headerTitle: "Voltar" }}/>
          <Stack.Screen name="admin/moduloPalavraCurtidas" options={{ headerTitle: "Voltar" }}/>
          <Stack.Screen name="admin/adminDetalhePalavra" options={{ headerTitle: "Voltar" }}/>
          
        </Stack>
        <PortalHost />
      </ThemeProvider>
  );
}
