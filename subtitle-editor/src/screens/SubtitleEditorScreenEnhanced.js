import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { ResizeMode, Video } from "expo-av";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AISubtitleService } from "../services/AISubtitleService";
import FirebaseService from "../services/FirebaseService";
import TranslationService from "../services/TranslationService";
import VideoProcessingService from "../services/VideoProcessingService";

const { width: screenWidth } = Dimensions.get("window");

const SubtitleEditorScreenEnhanced = ({ navigation, route }) => {
  const { videoUri, subtitles: initialSubtitles } = route.params;
  const videoRef = useRef(null);

  const [subtitles, setSubtitles] = useState(initialSubtitles);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState(null);
  const [showStylingModal, setShowStylingModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Styling states
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("rgba(0,0,0,0.8)");
  const [fontWeight, setFontWeight] = useState("normal");

  const handlePlayPause = async () => {
    try {
      if (videoRef.current) {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error("Error playing/pausing video:", error);
    }
  };

  const handlePlaybackSpeed = async (speed) => {
    try {
      if (videoRef.current) {
        await videoRef.current.setRateAsync(speed, true);
        setPlaybackSpeed(speed);
      }
    } catch (error) {
      console.error("Error changing playback speed:", error);
    }
  };

  const handleSubtitleSelect = async (subtitle) => {
    setSelectedSubtitle(subtitle);
    try {
      if (videoRef.current) {
        await videoRef.current.setPositionAsync(subtitle.startTime);
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error seeking to subtitle:", error);
    }
  };

  const handleEditSubtitle = (subtitle) => {
    setEditingSubtitle({ ...subtitle });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingSubtitle) {
      setSubtitles((prev) =>
        prev.map((sub) =>
          sub.id === editingSubtitle.id ? editingSubtitle : sub
        )
      );
      setShowEditModal(false);
      setEditingSubtitle(null);
    }
  };

  const handleDeleteSubtitle = (subtitleId) => {
    Alert.alert(
      "Delete Subtitle",
      "Are you sure you want to delete this subtitle?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSubtitles((prev) => prev.filter((sub) => sub.id !== subtitleId));
            if (selectedSubtitle?.id === subtitleId) {
              setSelectedSubtitle(null);
            }
          },
        },
      ]
    );
  };

  const handleAddSubtitle = () => {
    const newSubtitle = {
      id: Date.now().toString(),
      startTime: currentPosition,
      endTime: currentPosition + 3000,
      text: "New subtitle text",
      style: {
        fontSize,
        color: textColor,
        backgroundColor,
        fontWeight,
      },
    };
    setSubtitles((prev) => [...prev, newSubtitle]);
  };

  const handleTranslate = async (targetLanguage) => {
    try {
      Alert.alert("Translating", "Please wait...");
      const translatedSubtitles = await TranslationService.translateSubtitles(
        subtitles,
        targetLanguage,
        "en"
      );
      setSubtitles(translatedSubtitles);
      setShowTranslationModal(false);
      Alert.alert("Success", "Subtitles translated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to translate subtitles");
    }
  };

  const handleExport = async (format) => {
    try {
      if (format === "srt") {
        const srtContent = AISubtitleService.exportToSRT(subtitles);
        Alert.alert("Export SRT", srtContent.substring(0, 200) + "...");
      } else if (format === "vtt") {
        const vttContent = AISubtitleService.exportToVTT(subtitles);
        Alert.alert("Export VTT", vttContent.substring(0, 200) + "...");
      } else if (format === "video") {
        await VideoProcessingService.exportVideo(videoUri, subtitles);
        Alert.alert("Success", "Video and subtitles exported!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to export");
    }
  };

  const handleSaveProject = async () => {
    try {
      const project = {
        videoUri,
        subtitles,
        name: `Project ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
      };
      await FirebaseService.saveProject(project);
      Alert.alert("Success", "Project saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save project");
    }
  };

  const applyBulkStyling = () => {
    const updatedSubtitles = subtitles.map((sub) => ({
      ...sub,
      style: {
        ...sub.style,
        fontSize,
        color: textColor,
        backgroundColor,
        fontWeight,
      },
    }));
    setSubtitles(updatedSubtitles);
    setShowStylingModal(false);
    Alert.alert("Success", "Styling applied to all subtitles!");
  };

  const getCurrentSubtitle = () => {
    return subtitles.find(
      (subtitle) =>
        currentPosition >= subtitle.startTime &&
        currentPosition <= subtitle.endTime
    );
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderSubtitleItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.subtitleItem,
        selectedSubtitle?.id === item.id && styles.selectedSubtitle,
      ]}
      onPress={() => handleSubtitleSelect(item)}
    >
      <View style={styles.subtitleHeader}>
        <Text style={styles.subtitleTime}>
          {formatTime(item.startTime)} - {formatTime(item.endTime)}
        </Text>
        <View style={styles.subtitleActions}>
          <TouchableOpacity onPress={() => handleEditSubtitle(item)}>
            <Ionicons name="create-outline" size={20} color="#4C1D95" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteSubtitle(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtitleText}>{item.text}</Text>
    </TouchableOpacity>
  );

  const currentSubtitle = getCurrentSubtitle();

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoUri }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              setCurrentPosition(status.positionMillis || 0);
            }
          }}
        />

        {/* Subtitle Overlay */}
        {currentSubtitle && (
          <View style={styles.subtitleOverlay}>
            <View
              style={[
                styles.subtitleBox,
                {
                  backgroundColor:
                    currentSubtitle.style?.backgroundColor || backgroundColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.subtitleOverlayText,
                  {
                    fontSize: currentSubtitle.style?.fontSize || fontSize,
                    color: currentSubtitle.style?.color || textColor,
                    fontWeight: currentSubtitle.style?.fontWeight || fontWeight,
                  },
                ]}
              >
                {currentSubtitle.text}
              </Text>
            </View>
          </View>
        )}

        {/* Video Controls */}
        <View style={styles.controlsOverlay}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={40}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => setShowStylingModal(true)}
        >
          <Ionicons name="color-palette-outline" size={24} color="#4C1D95" />
          <Text style={styles.toolButtonText}>Style</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => setShowTranslationModal(true)}
        >
          <Ionicons name="language-outline" size={24} color="#4C1D95" />
          <Text style={styles.toolButtonText}>Translate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton} onPress={handleAddSubtitle}>
          <Ionicons name="add-circle-outline" size={24} color="#4C1D95" />
          <Text style={styles.toolButtonText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton} onPress={handleSaveProject}>
          <Ionicons name="save-outline" size={24} color="#4C1D95" />
          <Text style={styles.toolButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => handleExport("srt")}
        >
          <Ionicons name="download-outline" size={24} color="#4C1D95" />
          <Text style={styles.toolButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Playback Speed Controls */}
      <View style={styles.speedControls}>
        <Text style={styles.speedLabel}>Speed: {playbackSpeed}x</Text>
        {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
          <TouchableOpacity
            key={speed}
            style={[
              styles.speedButton,
              playbackSpeed === speed && styles.speedButtonActive,
            ]}
            onPress={() => handlePlaybackSpeed(speed)}
          >
            <Text
              style={[
                styles.speedButtonText,
                playbackSpeed === speed && styles.speedButtonTextActive,
              ]}
            >
              {speed}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Subtitles List */}
      <FlatList
        data={subtitles}
        renderItem={renderSubtitleItem}
        keyExtractor={(item) => item.id}
        style={styles.subtitlesList}
        contentContainerStyle={styles.subtitlesListContent}
      />

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Subtitle</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Subtitle text"
              value={editingSubtitle?.text || ""}
              onChangeText={(text) =>
                setEditingSubtitle({ ...editingSubtitle, text })
              }
              multiline
            />

            <View style={styles.timeInputs}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.inputLabel}>Start (ms)</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  value={String(editingSubtitle?.startTime || 0)}
                  onChangeText={(value) =>
                    setEditingSubtitle({
                      ...editingSubtitle,
                      startTime: parseInt(value) || 0,
                    })
                  }
                />
              </View>

              <View style={styles.timeInputGroup}>
                <Text style={styles.inputLabel}>End (ms)</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  value={String(editingSubtitle?.endTime || 0)}
                  onChangeText={(value) =>
                    setEditingSubtitle({
                      ...editingSubtitle,
                      endTime: parseInt(value) || 0,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Styling Modal */}
      <Modal visible={showStylingModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Subtitle Styling</Text>

            <ScrollView style={styles.stylingScrollView}>
              <Text style={styles.stylingLabel}>Font Size: {fontSize}px</Text>
              <Slider
                style={styles.slider}
                minimumValue={12}
                maximumValue={32}
                value={fontSize}
                onValueChange={setFontSize}
                minimumTrackTintColor="#4C1D95"
                maximumTrackTintColor="#E0E7FF"
              />

              <Text style={styles.stylingLabel}>Text Color</Text>
              <View style={styles.colorOptions}>
                {[
                  "#FFFFFF",
                  "#000000",
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                ].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      textColor === color && styles.colorButtonSelected,
                    ]}
                    onPress={() => setTextColor(color)}
                  />
                ))}
              </View>

              <Text style={styles.stylingLabel}>Background</Text>
              <View style={styles.colorOptions}>
                {[
                  "rgba(0,0,0,0.8)",
                  "rgba(255,255,255,0.8)",
                  "rgba(76,29,149,0.8)",
                  "transparent",
                ].map((bg) => (
                  <TouchableOpacity
                    key={bg}
                    style={[
                      styles.colorButton,
                      { backgroundColor: bg === "transparent" ? "#FFF" : bg },
                      backgroundColor === bg && styles.colorButtonSelected,
                    ]}
                    onPress={() => setBackgroundColor(bg)}
                  >
                    {bg === "transparent" && <Text>None</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.stylingLabel}>Font Weight</Text>
              <View style={styles.buttonRow}>
                {["normal", "bold"].map((weight) => (
                  <TouchableOpacity
                    key={weight}
                    style={[
                      styles.styleButton,
                      fontWeight === weight && styles.styleButtonActive,
                    ]}
                    onPress={() => setFontWeight(weight)}
                  >
                    <Text style={styles.styleButtonText}>{weight}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStylingModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={applyBulkStyling}
              >
                <Text style={styles.saveButtonText}>Apply to All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Translation Modal */}
      <Modal visible={showTranslationModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Translate Subtitles</Text>

            <ScrollView style={styles.languageList}>
              {TranslationService.supportedLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageItem}
                  onPress={() => handleTranslate(lang.code)}
                >
                  <Text style={styles.languageText}>{lang.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#4C1D95" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowTranslationModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  videoContainer: {
    width: screenWidth,
    height: 250,
    backgroundColor: "#000",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitleOverlay: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  subtitleBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  subtitleOverlayText: {
    textAlign: "center",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  toolButton: {
    alignItems: "center",
    padding: 8,
  },
  toolButtonText: {
    fontSize: 10,
    color: "#4C1D95",
    marginTop: 4,
  },
  speedControls: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  speedLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 12,
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  speedButtonActive: {
    backgroundColor: "#4C1D95",
  },
  speedButtonText: {
    fontSize: 12,
    color: "#6B7280",
  },
  speedButtonTextActive: {
    color: "#FFF",
  },
  subtitlesList: {
    flex: 1,
  },
  subtitlesListContent: {
    padding: 16,
  },
  subtitleItem: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedSubtitle: {
    borderColor: "#4C1D95",
    backgroundColor: "#F5F3FF",
  },
  subtitleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subtitleTime: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  subtitleActions: {
    flexDirection: "row",
    gap: 12,
  },
  deleteButton: {
    marginLeft: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: screenWidth - 40,
    maxHeight: "80%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  timeInputs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  timeInputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  saveButton: {
    backgroundColor: "#4C1D95",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  stylingScrollView: {
    maxHeight: 400,
  },
  stylingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
    marginTop: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  colorButtonSelected: {
    borderColor: "#4C1D95",
    borderWidth: 3,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  styleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
  },
  styleButtonActive: {
    backgroundColor: "#4C1D95",
  },
  styleButtonText: {
    fontSize: 14,
    color: "#1F2937",
  },
  languageList: {
    maxHeight: 400,
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  languageText: {
    fontSize: 16,
    color: "#1F2937",
  },
});

export default SubtitleEditorScreenEnhanced;
