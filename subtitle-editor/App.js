import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-url-polyfill/auto";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProjectsScreen from "./src/screens/ProjectsScreen";
import SubtitleEditorScreenEnhanced from "./src/screens/SubtitleEditorScreenEnhanced";
import VideoEditorScreen from "./src/screens/VideoEditorScreen";
import FirebaseService from "./src/services/FirebaseService";

const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Initialize Firebase and other services
    const initializeApp = async () => {
      try {
        await FirebaseService.initialize();
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setInitializing(false);
      }
    };

    initializeApp();
  }, []);

  if (initializing) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4C1D95",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "AI Subtitle Editor" }}
        />
        <Stack.Screen
          name="VideoEditor"
          component={VideoEditorScreen}
          options={{ title: "Video Preview" }}
        />
        <Stack.Screen
          name="SubtitleEditor"
          component={SubtitleEditorScreenEnhanced}
          options={{ title: "Edit Subtitles" }}
        />
        <Stack.Screen
          name="Projects"
          component={ProjectsScreen}
          options={{ title: "My Projects" }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

// Register the main component
registerRootComponent(App);

export default App;
