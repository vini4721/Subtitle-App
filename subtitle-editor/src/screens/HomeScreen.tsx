import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoUpload = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsLoading(false);
        return;
      }

      const selectedFile = result.assets[0];

      // Basic video validation
      if (!selectedFile.name.match(/\.(mp4|mov|mkv|avi|wmv)$/i)) {
        Alert.alert(
          "Invalid File",
          "Please select a valid video file (MP4, MOV, MKV, AVI, WMV)"
        );
        setIsLoading(false);
        return;
      }

      // Navigate to video editor
      navigation.navigate("VideoEditor", { videoUri: selectedFile.uri });
      setIsLoading(false);
    } catch (error) {
      console.error("Error selecting video:", error);
      Alert.alert("Error", "Failed to select video file");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="videocam" size={60} color="#4C1D95" />
          </View>
          <Text style={styles.title}>AI Subtitle Editor</Text>
          <Text style={styles.subtitle}>
            Upload your video and let AI generate perfect subtitles
            automatically
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresList}>
            <FeatureItem
              icon="flash"
              title="AI-Powered"
              description="Automatic subtitle generation using OpenAI Whisper"
            />
            <FeatureItem
              icon="create"
              title="Easy Editing"
              description="Intuitive editor to fine-tune timing and text"
            />
            <FeatureItem
              icon="color-palette"
              title="Customizable"
              description="Style your subtitles with colors and fonts"
            />
            <FeatureItem
              icon="download"
              title="Multiple Formats"
              description="Export as SRT, VTT, or burn into video"
            />
          </View>
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <TouchableOpacity
            style={[
              styles.uploadButton,
              isLoading && styles.uploadButtonDisabled,
            ]}
            onPress={handleVideoUpload}
            disabled={isLoading}
          >
            <Ionicons
              name={isLoading ? "hourglass" : "cloud-upload"}
              size={30}
              color="#fff"
            />
            <Text style={styles.uploadButtonText}>
              {isLoading ? "Processing..." : "Upload Video"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.supportedFormats}>
            Supported formats: MP4, MOV, MKV, AVI, WMV
          </Text>
        </View>

        {/* Developer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Developed by Vinayak Singh for College Project
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  icon: any;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
}) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color="#4C1D95" />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#EDE9FE",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#EDE9FE",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  uploadSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  uploadButton: {
    backgroundColor: "#4C1D95",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#4C1D95",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  supportedFormats: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 12,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default HomeScreen;
