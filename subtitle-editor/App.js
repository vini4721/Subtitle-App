import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import SubtitleEditorScreen from "./src/screens/SubtitleEditorScreen";
import VideoEditorScreen from "./src/screens/VideoEditorScreen";

const Stack = createStackNavigator();

export default function App() {
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
          component={SubtitleEditorScreen}
          options={{ title: "Edit Subtitles" }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
