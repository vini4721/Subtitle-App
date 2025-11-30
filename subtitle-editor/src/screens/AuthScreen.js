import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FirebaseService from "../services/FirebaseService";

const { width: screenWidth } = Dimensions.get("window");

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await FirebaseService.signIn(email, password);
        Alert.alert("Success", "Signed in successfully!");
      } else {
        await FirebaseService.signUp(email, password);
        Alert.alert("Success", "Account created successfully!");
      }
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    navigation.replace("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Title */}
        <View style={styles.header}>
          <Ionicons name="videocam" size={64} color="#4C1D95" />
          <Text style={styles.title}>AI Subtitle Editor</Text>
          <Text style={styles.subtitle}>
            Create professional subtitles with AI
          </Text>
        </View>

        {/* Auth Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.authButton}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guest Access */}
        <View style={styles.guestSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestAccess}
          >
            <Ionicons name="person-outline" size={20} color="#4C1D95" />
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  form: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#1F2937",
  },
  authButton: {
    backgroundColor: "#4C1D95",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  authButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  switchText: {
    color: "#4C1D95",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  guestSection: {
    marginTop: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },
  dividerText: {
    paddingHorizontal: 12,
    color: "#6B7280",
    fontSize: 14,
  },
  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#4C1D95",
  },
  guestButtonText: {
    color: "#4C1D95",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default AuthScreen;
