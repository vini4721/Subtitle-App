import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import { Subtitle } from "../types";

type SubtitleEditorScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SubtitleEditor"
>;
type SubtitleEditorScreenRouteProp = RouteProp<
  RootStackParamList,
  "SubtitleEditor"
>;

interface Props {
  navigation: SubtitleEditorScreenNavigationProp;
  route: SubtitleEditorScreenRouteProp;
}

const { width: screenWidth } = Dimensions.get("window");

const SubtitleEditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const { videoUri, subtitles: initialSubtitles } = route.params;
  const videoRef = useRef<Video>(null);

  const [subtitles, setSubtitles] = useState<Subtitle[]>(initialSubtitles);
  const [selectedSubtitle, setSelectedSubtitle] = useState<Subtitle | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null);

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

  const handleSubtitleSelect = async (subtitle: Subtitle) => {
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

  const handleEditSubtitle = (subtitle: Subtitle) => {
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

  const handleDeleteSubtitle = (subtitleId: string) => {
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
    const newSubtitle: Subtitle = {
      id: Date.now().toString(),
      startTime: currentPosition,
      endTime: currentPosition + 3000,
      text: "New subtitle text",
      style: {
        fontSize: 16,
        color: "#FFFFFF",
        backgroundColor: "rgba(0,0,0,0.8)",
        fontWeight: "normal",
      },
    };
    setSubtitles((prev) =>
      [...prev, newSubtitle].sort((a, b) => a.startTime - b.startTime)
    );
  };

  const exportSubtitles = () => {
    // Simulate export functionality
    const srtContent = generateSRTContent(subtitles);
    Alert.alert(
      "Export Successful",
      `Subtitles exported!\n\nSRT Content Preview:\n${srtContent.substring(
        0,
        200
      )}...`,
      [{ text: "OK" }]
    );
  };

  const generateSRTContent = (subtitles: Subtitle[]): string => {
    return subtitles
      .map((subtitle, index) => {
        const startTime = formatSRTTime(subtitle.startTime);
        const endTime = formatSRTTime(subtitle.endTime);
        return `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.text}\n`;
      })
      .join("\n");
  };

  const formatSRTTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${ms
      .toString()
      .padStart(3, "0")}`;
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getCurrentSubtitle = (): Subtitle | null => {
    return (
      subtitles.find(
        (sub) =>
          currentPosition >= sub.startTime && currentPosition <= sub.endTime
      ) || null
    );
  };

  const renderSubtitleItem = ({ item }: { item: Subtitle }) => {
    const isSelected = selectedSubtitle?.id === item.id;
    const isCurrent = getCurrentSubtitle()?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.subtitleItem,
          isSelected && styles.subtitleItemSelected,
          isCurrent && styles.subtitleItemCurrent,
        ]}
        onPress={() => handleSubtitleSelect(item)}
      >
        <View style={styles.subtitleHeader}>
          <Text style={styles.subtitleTime}>
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </Text>
          <View style={styles.subtitleActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditSubtitle(item)}
            >
              <Ionicons name="create" size={16} color="#4C1D95" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteSubtitle(item.id)}
            >
              <Ionicons name="trash" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitleText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

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
        {(() => {
          const currentSubtitle = getCurrentSubtitle();
          return currentSubtitle ? (
            <View style={styles.subtitleOverlay}>
              <Text style={[styles.overlaySubtitleText, currentSubtitle.style]}>
                {currentSubtitle.text}
              </Text>
            </View>
          ) : null;
        })()}

        {/* Video Controls */}
        <View style={styles.videoControls}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subtitle List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Subtitles ({subtitles.length})</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddSubtitle}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={exportSubtitles}
          >
            <Ionicons name="download" size={20} color="#4C1D95" />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subtitle List */}
      <FlatList
        data={subtitles}
        renderItem={renderSubtitleItem}
        keyExtractor={(item) => item.id}
        style={styles.subtitleList}
        showsVerticalScrollIndicator={false}
      />

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Subtitle</Text>
            <TouchableOpacity onPress={handleSaveEdit}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          {editingSubtitle && (
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subtitle Text</Text>
                <TextInput
                  style={styles.textInput}
                  value={editingSubtitle.text}
                  onChangeText={(text) =>
                    setEditingSubtitle((prev) =>
                      prev ? { ...prev, text } : null
                    )
                  }
                  multiline
                  placeholder="Enter subtitle text..."
                />
              </View>

              <View style={styles.timeInputs}>
                <View style={styles.timeInputGroup}>
                  <Text style={styles.inputLabel}>Start Time (ms)</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={editingSubtitle.startTime.toString()}
                    onChangeText={(text) =>
                      setEditingSubtitle((prev) =>
                        prev
                          ? {
                              ...prev,
                              startTime: parseInt(text) || 0,
                            }
                          : null
                      )
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.timeInputGroup}>
                  <Text style={styles.inputLabel}>End Time (ms)</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={editingSubtitle.endTime.toString()}
                    onChangeText={(text) =>
                      setEditingSubtitle((prev) =>
                        prev
                          ? {
                              ...prev,
                              endTime: parseInt(text) || 0,
                            }
                          : null
                      )
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  videoContainer: {
    position: "relative",
    backgroundColor: "#000",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  video: {
    width: screenWidth - 32,
    height: 180,
  },
  subtitleOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  overlaySubtitleText: {
    textAlign: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  videoControls: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  playButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    backgroundColor: "#4C1D95",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  exportButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#4C1D95",
  },
  exportButtonText: {
    color: "#4C1D95",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitleList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitleItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#E5E7EB",
  },
  subtitleItemSelected: {
    borderLeftColor: "#4C1D95",
    backgroundColor: "#F3F4F6",
  },
  subtitleItemCurrent: {
    borderLeftColor: "#10B981",
    backgroundColor: "#ECFDF5",
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
    fontWeight: "500",
  },
  subtitleActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#6B7280",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalSaveText: {
    fontSize: 16,
    color: "#4C1D95",
    fontWeight: "600",
  },
  modalContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  timeInputs: {
    flexDirection: "row",
    gap: 12,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

export default SubtitleEditorScreen;
